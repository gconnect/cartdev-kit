import { hexToString } from "viem";
import { AdvanceRoute, DefaultRoute, Router } from "cartesi-router";
import { Wallet, Notice, Output, Error_out, Report } from "cartesi-wallet";
import viem from "viem"
import deployments from "./rollups.json";
import { CreateGreeting } from "./examples/greetings";
import { CreateGreetingRoute, DeleteGreetingRoute, DeleteGreetingsRoute, GreetingRoute, GreetingsRoute, UpdateGreetingRoute } from "./examples/routes";

let rollup_address = "";
const rollup_server: string = <string>process.env.ROLLUP_HTTP_SERVER_URL;

let Network: string = "localhost";
Network = <string>process.env.Network;
console.info("rollup server url is ", rollup_server, Network);
if (Network === undefined) {
  Network = "localhost";
}

const wallet = new Wallet(new Map());
const router = new Router(wallet);
var handlers: any = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

const greeting = new CreateGreeting()

router.addRoute("create_greeting", new CreateGreetingRoute(greeting))
router.addRoute("update_greeting", new UpdateGreetingRoute(greeting))
router.addRoute("get_greeting", new GreetingRoute(greeting))
router.addRoute("get_greetings", new GreetingsRoute(greeting))
router.addRoute("delete_greeting", new DeleteGreetingRoute(greeting))
router.addRoute("delete_greetings", new DeleteGreetingsRoute(greeting))


const send_request = async (output: Output | Set<Output>) => {
  if (output instanceof Output) {
    let endpoint;
    console.log("type of output", output.type);

    if (output.type == "notice") {
      endpoint = "/notice";
    } else if (output.type == "voucher") {
      endpoint = "/voucher";
    } else {
      endpoint = "/report";
    }

    console.log(`sending request ${typeof output}`);
    const response = await fetch(rollup_server + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(output),
    });
    console.debug(
      `received ${output.payload} status ${response.status} body ${response.body}`
    );
  }
   else {
    output.forEach((value: Output) => {
      send_request(value);
    });
  }
};


async function handle_advance(data: any) {
  console.log("Received advance request data " + JSON.stringify(data));
  try {
    const payload = data.payload;
    const msg_sender: string = data.metadata.msg_sender;
    console.log("msg sender is", msg_sender.toLowerCase());
    const payloadStr = hexToString(payload);
    
    if (
      msg_sender.toLowerCase() ===
      deployments.contracts.EtherPortal.address.toLowerCase()
    ) {
      try {
        return router.process("ether_deposit", payload);
      } catch (e) {
        return new Error_out(`failed to process ether deposit ${payload} ${e}`);
      }
    }
    if (
      msg_sender.toLowerCase() ===
      deployments.contracts.DAppAddressRelay.address.toLowerCase()
    ) {
      rollup_address = payload;
      router.set_rollup_address(rollup_address, "ether_withdraw");
      router.set_rollup_address(rollup_address, "erc20_withdraw");
      router.set_rollup_address(rollup_address, "erc721_withdraw");

      console.log("Setting DApp address");
      return new Notice(
        `DApp address set up successfully to ${rollup_address}`
      );
    }

    if (
      msg_sender.toLowerCase() ===
      deployments.contracts.ERC20Portal.address.toLowerCase()
    ) {
      try {
        return router.process("erc20_deposit", payload);
      } catch (e) {
        return new Error_out(`failed ot process ERC20Deposit ${payload} ${e}`);
      }
    }

    if (
      msg_sender.toLowerCase() ===
      deployments.contracts.ERC721Portal.address.toLowerCase()
    ) {
      try {
        return router.process("erc721_deposit", payload);
      } catch (e) {
        return new Error_out(`failed ot process ERC20Deposit ${payload} ${e}`);
      }
    }
    
    try {
      const jsonpayload = JSON.parse(payloadStr);
      console.log("payload is ", data);
      return router.process(jsonpayload.method, data);
    } catch (e) {
      return new Error_out(`failed to process command ${payloadStr} ${e}`);
    }

  } catch (e) {
    console.error(e);
    return new Error_out(`failed to process advance_request ${e}`);
  }
}


async function handle_inspect(data: any) {
  console.debug(`received inspect request data${data}`);
  try {
    const url = hexToString(data.payload).split("/");
    console.log("url is ", url);
    return router.process(<string>url[0], url[1]);
  } catch (e) {
    const error_msg = `failed to process inspect request ${e}`;
    console.debug(error_msg);
    return new Error_out(error_msg);
  }
}

var finish = { status: "accept" };

(async () => {
  while (true) {
    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "accept" }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();

      var typeq = rollup_req.request_type;
      var handler: any;
      if (typeq === "inspect_state") {
        handler = handlers.inspect_state;
      } else {
        handler = handlers.advance_state;
      }
      var output = await handler(rollup_req.data);
      finish.status = "accept";
      if (output instanceof Error_out) {
        finish.status = "reject";
      }
      console.log(output);
      console.log(output instanceof Output);
      await send_request(output);
    }
  }
})();