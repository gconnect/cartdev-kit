import { ethers, JsonRpcApiProvider, JsonRpcSigner, parseEther, Provider, toBigInt } from "ethers";
import { RollupsContracts } from "./hooks/useRollups";
import {
  IERC1155__factory,
  IERC20__factory,
  IERC721__factory,
} from "./generated/rollups";
import { successAlert, errorAlert } from "../utils/customAlert";
import { Report } from "./hooks/useReports";
import { getVoucherWithProof, createUrqlClient} from "./VoucherService";

export const sendAddress = async (rollups: RollupsContracts | undefined, dappAddress: string) => {
  if (rollups) {
    try {
    const relayTx =  await rollups.relayContract.relayDAppAddress(dappAddress);
      const tx = await relayTx.wait(1) 
      return tx?.hash
    } catch (e) {
      console.log(`${e}`);
      return e
    }
  }
};

export const addInput = async (
  rollups: RollupsContracts | undefined, 
  jsonPayload: string,
  dappAddress: string,
 ) => {
  if (rollups) {
      try {
        let payload = ethers.toUtf8Bytes(jsonPayload);
        const tx = await rollups.inputContract.addInput(dappAddress, payload);
        const receipt = await tx?.wait()
        console.log(receipt?.hash)
        return receipt
      } catch (e) {
        console.log(`${e}`);
        return e
      }
  }
};

export const depositEtherToPortal = async (
  rollups: RollupsContracts | undefined, 
  provider: JsonRpcApiProvider | undefined, 
  amount: number,
  dappAddress: string
) => {
  try {
    if (rollups && provider) {
      const data = ethers.toUtf8Bytes(`Deposited (${amount}) ether.`);
      const txOverrides = { value: parseEther(`${amount}`) };
      console.log("Ether to deposit: ", txOverrides);

    const tx =  await rollups.etherPortalContract.depositEther(
        dappAddress,
        data,
        txOverrides
      );
      const receipt = await tx.wait(1)
      return receipt
    }
  } catch (e: any) {
    console.log(`${e}`);
    return e
  }
};

export const depositErc20ToPortal = async (
  rollups: RollupsContracts | undefined, 
  provider: JsonRpcApiProvider | undefined, 
  token: string, amount: number,
  dappAddress: string
  ) => {
  try {
    if (rollups && provider) {
      const data = ethers.toUtf8Bytes(
        `Deposited (${amount}) of ERC20 (${token}).`
      );
      const signer = await provider.getSigner();
      const signerAddress = await signer?.getAddress();

      const erc20PortalAddress = await rollups.erc20PortalContract.getAddress();
      const tokenContract = signer
        ? IERC20__factory.connect(token, signer)
        : IERC20__factory.connect(token, signer!);

      // query current allowance
      const currentAllowance = await tokenContract.allowance(
        signerAddress!,
        erc20PortalAddress
      );
      if (parseEther(`${amount}`) > currentAllowance) {
        // Allow portal to withdraw `amount` tokens from signer
        const tx = await tokenContract.approve(
          erc20PortalAddress,
          parseEther(`${amount}`)
        );

        // const receipt = await tx.wait(1);
        // if(!receipt) return errorAlert("Error approving")
        //   const event = (
        //     await tokenContract.queryFilter(
        //       tokenContract.filters.Approval(),
        //       receipt.blockHash
        //     )
        //   ).pop();
        //   if (!event) {
        //     throw Error(
        //       `could not approve ${amount} tokens for DAppERC20Portal(${erc20PortalAddress})  (signer: ${signerAddress}, tx: ${tx.hash})`
        //     );
        //   }
      }

     const deposit = await rollups.erc20PortalContract.depositERC20Tokens(
        token,
        dappAddress,
        ethers.parseEther(`${amount}`),
        "0x"
      );
      const transReceipt = await deposit.wait(1);
      return transReceipt
    }
  } catch (e) {
    console.log(`${e}`);
    return e
  }
};

export const withdrawEther = async (
  rollups: RollupsContracts | undefined, 
  provider: JsonRpcApiProvider | undefined, 
  amount: number,
  dappAddress: string
) => {
  try {
    if (rollups && provider) {
      let ether_amount = parseEther(String(amount)).toString();
      console.log("ether after parsing: ", ether_amount);
      const input_obj = {
        method: "ether_withdraw",
        args: {
          amount: ether_amount
        },
      };
      const data = JSON.stringify(input_obj);
      let payload = ethers.toUtf8Bytes(data);
      const tx = await rollups.inputContract.addInput(dappAddress, payload);
      const receipt = await tx.wait(1)
      return receipt
    }
  } catch (e) {
    console.log(e);
    return e
  }
};

export const withdrawErc20 = async (
    rollups: RollupsContracts | undefined, 
    provider: JsonRpcApiProvider | undefined,
    amount: number, address: String,
    dappAddress: string
  ) => {
  try {
    if (rollups && provider) {
      let erc20_amount = parseEther(String(amount)).toString();
      console.log("erc20 after parsing: ", erc20_amount);
      const input_obj = {
        method: "erc20_withdraw",
        args: {
          erc20: address,
          amount: erc20_amount,
        },
      };
      const data = JSON.stringify(input_obj);
      let payload = ethers.toUtf8Bytes(data);
      const tx =  await rollups.inputContract.addInput(dappAddress, payload);
      const receipt = await tx.wait(1)
      return receipt
    }
  } catch (e) {
    console.log(e);
    return e
  }
};

export const withdrawErc721 = async (
  rollups: RollupsContracts | undefined, 
  provider: JsonRpcApiProvider | undefined,
  address: String, 
  id: number,
  dappAddress: string
) => {
  try {
    if (rollups && provider) {
      let erc721_id = String(id);
      console.log("erc721 after parsing: ", erc721_id);
      const input_obj = {
        method: "erc721_withdraw",
        args: {
          erc721: address,
          token_id: id,
        },
      };
      const data = JSON.stringify(input_obj);
      let payload = ethers.toUtf8Bytes(data);
      const tx = await rollups.inputContract.addInput(dappAddress, payload);
      const receipt = await tx.wait(1)
      return receipt
    }
  } catch (e) {
    console.log(e);
    return e
  }
};

export const transferNftToPortal = async (
  rollups: RollupsContracts | undefined, 
  provider: JsonRpcApiProvider | undefined,
  contractAddress: string,
  nftid: number,
  dappAddress: string
) => {
  try {
    if (rollups && provider) {
      const data = ethers.toUtf8Bytes(
        `Deposited (${nftid}) of ERC721 (${contractAddress}).`
      );
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();

      const erc721PortalAddress = await rollups.erc721PortalContract.getAddress();

      const tokenContract = signer
        ? IERC721__factory.connect(contractAddress, signer)
        : IERC721__factory.connect(contractAddress, signer);

      // query current approval
      const currentApproval = await tokenContract.getApproved(nftid);
      if (currentApproval !== erc721PortalAddress) {
        // Allow portal to withdraw `amount` tokens from signer
        const tx = await tokenContract.approve(erc721PortalAddress, nftid);      
        // const receipt = await tx.wait(1);
        // const event = (
        //   await tokenContract.queryFilter(
        //     tokenContract.filters.Approval(),
        //     receipt?.hash
        //   )
        // ).pop();
        // if (!event) {
        //   throw Error(
        //     `could not approve ${nftid} for DAppERC721Portal(${erc721PortalAddress})  (signer: ${signerAddress}, tx: ${tx.hash})`
        //   );
        // }
      }

      // Transfer
      const tx = await rollups.erc721PortalContract.depositERC721Token(
        contractAddress,
        dappAddress,
        nftid,
        "0x",
        data
      );

      const receipt = await tx.wait(1)
      return receipt
    }
  } catch (e) {
    console.log(`${e}`);
    return e
  }
};


export const transferErc1155SingleToPortal = async (
  rollups: RollupsContracts | undefined, 
  provider: JsonRpcApiProvider | undefined,
  contractAddress: string, 
  id: number, 
  amount: number,
  dappAddress: string
) => {
  try {
      if (rollups && provider) {
          const data = ethers.toUtf8Bytes(`Deposited (${amount}) tokens from id (${id}) of ERC1155 (${contractAddress}).`);
          //const data = `Deposited ${args.amount} tokens (${args.token}) for DAppERC20Portal(${portalAddress}) (signer: ${address})`;
          const signer = await provider.getSigner();
          const signerAddress = await signer.getAddress()

          const erc1155SinglePortalAddress = await rollups.erc1155SinglePortalContract.getAddress();

          const tokenContract = signer ? IERC1155__factory.connect(contractAddress, signer) : IERC1155__factory.connect(contractAddress, signer);

          // query current approval
          const currentApproval = await tokenContract.isApprovedForAll(signerAddress,erc1155SinglePortalAddress);
          if (!currentApproval) {
              // Allow portal to withdraw `amount` tokens from signer
              const tx = await tokenContract.setApprovalForAll(erc1155SinglePortalAddress,true);
              const receipt = await tx.wait(1);
              const event = (await tokenContract.queryFilter(tokenContract.filters.ApprovalForAll(), receipt?.blockHash)).pop();
              if (!event) {
                  throw Error(`could set approval for DAppERC1155Portal(${erc1155SinglePortalAddress})  (signer: ${signerAddress}, tx: ${tx.hash})`);
              }
          }

          // Transfer
        const tx =  await rollups.erc1155SinglePortalContract.depositSingleERC1155Token(contractAddress,dappAddress, id, amount, "0x", data);
        const receipt = await tx.wait(1)
        return receipt
      }
  } catch (e) {
    console.log(`${e}`);
    return e
  }
};

export const transferErc1155BatchToPortal = async ( 
  rollups: RollupsContracts | undefined, 
  provider: JsonRpcApiProvider | undefined,
  contractAddress: string, 
  ids: number[], 
  amounts: number[],
  dappAddress: string
) => {
  try {
      if (rollups && provider) {
          const data = ethers.toUtf8Bytes(`Deposited (${amounts}) tokens from ids (${ids}) of ERC1155 (${contractAddress}).`);
          //const data = `Deposited ${args.amount} tokens (${args.token}) for DAppERC20Portal(${portalAddress}) (signer: ${address})`;
          const signer = await provider.getSigner();
          const signerAddress = await signer.getAddress()

          const erc1155BatchPortalAddress = await rollups.erc1155BatchPortalContract.getAddress();

          const tokenContract = signer ? IERC1155__factory.connect(contractAddress, signer) : IERC1155__factory.connect(contractAddress, signer);

          // query current approval
          const currentApproval = await tokenContract.isApprovedForAll(signerAddress,erc1155BatchPortalAddress);
          if (!currentApproval) {
              // Allow portal to withdraw `amount` tokens from signer
              const trans = await tokenContract.setApprovalForAll(erc1155BatchPortalAddress,true);
              const receipt = await trans.wait(1);
              const event = (await tokenContract.queryFilter(tokenContract.filters.ApprovalForAll(), receipt?.blockHash)).pop();
              if (!event) {
                  throw Error(`could set approval for DAppERC1155Portal(${erc1155BatchPortalAddress})  (signer: ${signerAddress}, tx: ${receipt?.hash})`);
              }
          }

          // Transfer
         const tx = await rollups.erc1155BatchPortalContract.depositBatchERC1155Token(contractAddress,dappAddress, ids, amounts, "0x", data);        
         const receipt = await tx.wait(1)
         return receipt

      }
    } catch (e) {
      return e
    }
};

export const executeVoucher = async (voucher: any, rollups: RollupsContracts) => {
  const client = createUrqlClient();

  try {
    if (!rollups) throw new Error("Rollups contract is required");

    const isExecuted = await rollups.dappContract.wasVoucherExecuted(
      BigInt(voucher.input.index),
      BigInt(voucher.index)
    );

    if (isExecuted) throw new Error('Fund already withdrawn');

    const voucherWithProof = await getVoucherWithProof(client, voucher.index, voucher.input.index);

    if (voucherWithProof) {
      const tx = await rollups.dappContract.executeVoucher(
        voucherWithProof.destination,
        voucherWithProof.payload,
        voucherWithProof.proof
      );

      const receipt = await tx.wait();
      if (receipt) {
        console.log('Voucher receipt', receipt);
        // successAlert('Congratulations! Funds successfully withdrawn');
        return 'Congratulations! Funds successfully withdrawn'
      }
      console.log("Voucher executed successfully", voucherWithProof);
      return "Voucher executed successfully"

    }
  } catch (error) {
    console.error('Error executing voucher:', error);
    // errorAlert(`Could not execute voucher ${error}`);
    return error
  }
};

export const inspectCall = async (inspectUrl: string, endpoint: string) => {
  try {
    const result = await fetch(`${inspectUrl}/${endpoint}`);
    if (!result.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await result.json()
    const decode = data.reports.map((report: Report) => {
      return ethers.toUtf8String(report.payload);
    });
    const reportData: any = JSON.parse(decode);
    return reportData;
  } catch (error) {
    console.log(error)
  }
};