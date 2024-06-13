const express = require('express');
const { CartesifyBackend } = require("@calindra/cartesify-backend");
const { createWallet } = require("@deroll/wallet");

let dapp;
let wallet;

const appConfig = () => {
  CartesifyBackend.createDapp().then(initDapp => {
    console.log('Dapp started');
    initDapp.start().catch((e) => {
        console.error(e);
        process.exit(1);
    });

    dapp = initDapp;
    wallet = createWallet();

    dapp.addAdvanceHandler(() => {
        console.log('before wallet handler');
        return "reject";
    });

    dapp.addAdvanceHandler(wallet.handler);

    dapp.addAdvanceHandler(() => {
        console.log('final handler');
        return "reject";
    });
  });

  const app = express();
  const port = 8383;
  app.use(express.json());

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });

  return { app, wallet, dapp };
}

module.exports = { appConfig };
