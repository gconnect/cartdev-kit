import { ethers, JsonRpcApiProvider, JsonRpcSigner, parseEther, Provider } from "ethers";
import { RollupsContracts } from "../cartesi/hooks/useRollups";
import {
  IERC1155__factory,
  IERC20__factory,
  IERC721__factory,
} from "../cartesi/generated/rollups";
import { successAlert, errorAlert } from "../utils/customAlert";
import { DAPP_ADDRESS } from "../utils/constants";

export const sendAddress = async (rollups: RollupsContracts | undefined, signer: JsonRpcSigner | undefined, setDappRelayedAddress: Function) => {
  if (rollups) {
    try {
    const relayTx =  await rollups.relayContract.relayDAppAddress(DAPP_ADDRESS);
      setDappRelayedAddress(true);
      const trans = await signer!.sendTransaction(relayTx)
       const tx =  await trans?.wait(1)
      successAlert(tx!.hash)
      return tx?.hash
    } catch (e) {
      console.log(`${e}`);
      errorAlert(e)
    }
  }
};

export const addInput = async (
  rollups: RollupsContracts | undefined, 
  signer: JsonRpcSigner | undefined,
  setLoading: Function,
  jsonPayload: string
 ) => {
  if (rollups) {
      try {
        setLoading(true)
        const data = JSON.stringify(jsonPayload);
        let payload = ethers.toUtf8Bytes(data);
        const trans = await rollups.inputContract.addInput(DAPP_ADDRESS, payload);
        const tx = await signer?.sendTransaction(trans)
        const receipt = await tx?.wait()
        setLoading(false)
        successAlert(receipt?.hash)
        return receipt?.hash
      } catch (e) {
        setLoading(false)
        errorAlert(e)
        console.log(`${e}`);
      }
  }
};

export const depositErc20ToPortal = async (rollups: RollupsContracts | undefined, 
  provider: JsonRpcApiProvider | undefined, setLoadERC20: Function, 
  token: string, amount: number) => {
  try {
    if (rollups && provider) {
      setLoadERC20(true)
      const data = ethers.toUtf8Bytes(
        `Deposited (${amount}) of ERC20 (${token}).`
      );
      const signer = await provider.getSigner();
      const signerAddress = await signer?.getAddress();

      const erc20PortalAddress = rollups.erc20PortalContract.address;
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
        const trans = await signer.sendTransaction(tx)
        const receipt = await trans.wait(1);
        const event = (
          await tokenContract.queryFilter(
            tokenContract.filters.Approval(),
            receipt?.hash
          )
        ).pop();
        if (!event) {
          throw Error(
            `could not approve ${amount} tokens for DAppERC20Portal(${erc20PortalAddress})  (signer: ${signerAddress}, tx: ${tx.hash})`
          );
        }
      }

     const deposit = await rollups.erc20PortalContract.depositERC20Tokens(
        token,
        DAPP_ADDRESS,
        ethers.parseEther(`${amount}`),
        data
      );
      const depositTx = await signer.sendTransaction(deposit)
      const transReceipt = await depositTx.wait(1);
      setLoadERC20(false)
      successAlert(transReceipt!.hash)
      return transReceipt?.hash
    }
  } catch (e) {
    setLoadERC20(false)
    console.log(`${e}`);
    errorAlert(e)
  }
};

export const depositEtherToPortal = async (rollups: RollupsContracts | undefined, 
  provider: JsonRpcApiProvider | undefined, setLoadEther: Function, amount: number) => {
  try {
    if (rollups && provider) {
      setLoadEther(true)
      const data = ethers.toUtf8Bytes(`Deposited (${amount}) ether.`);
      const txOverrides = { value: parseEther(`${amount}`) };
      console.log("Ether to deposit: ", txOverrides);

    const trans =  await rollups.etherPortalContract.depositEther(
        DAPP_ADDRESS,
        data,
        txOverrides
      );
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction(trans)
      setLoadEther(false)
      const receipt = await tx.wait(1)
      successAlert(receipt!.hash)
      return receipt!.hash
    }
  } catch (e: any) {
    setLoadEther(false)
    console.log(`${e}`);
    errorAlert(e)
  }
};

export const withdrawEther = async (rollups: RollupsContracts | undefined, 
  provider: JsonRpcApiProvider | undefined, setLoadWithdrawEther: Function, amount: number) => {
  try {
    if (rollups && provider) {
      setLoadWithdrawEther(true)
      let ether_amount = parseEther(String(amount)).toString();
      console.log("ether after parsing: ", ether_amount);
      const input_obj = {
        method: "ether_withdraw",
        args: {
          amount: ether_amount,
        },
      };
      const data = JSON.stringify(input_obj);
      let payload = ethers.toUtf8Bytes(data);
      const trans = await rollups.inputContract.addInput(DAPP_ADDRESS, payload);
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction(trans)
      const receipt = await tx.wait(1)
      setLoadWithdrawEther(false)
      successAlert(receipt!.hash)
      return receipt!.hash
    }
  } catch (e) {
    setLoadWithdrawEther(false)
    console.log(e);
    errorAlert(e)
  }
};

export const withdrawErc20 = async (rollups: RollupsContracts | undefined, 
    provider: JsonRpcApiProvider | undefined, setLoadWithdrawERC20: Function,
   amount: number, address: String) => {
  try {
    if (rollups && provider) {
      setLoadWithdrawERC20(true)
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
      const trans =  await rollups.inputContract.addInput(DAPP_ADDRESS, payload);
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction(trans)
      const receipt = await tx.wait(1)
      setLoadWithdrawERC20(false)
      successAlert(receipt?.hash)
      return receipt?.hash
    }
  } catch (e) {
    setLoadWithdrawERC20(false)
    console.log(e);
    errorAlert(e)
  }
};

export const withdrawErc721 = async (rollups: RollupsContracts | undefined, 
  provider: JsonRpcApiProvider | undefined,
  setLoadWithdrawERC721: Function, address: String, id: number) => {
  try {
    if (rollups && provider) {
      setLoadWithdrawERC721(true)
      let erc721_id = String(id);
      console.log("erc721 after parsing: ", erc721_id);
      const input_obj = {
        method: "erc721_withdrawal",
        args: {
          erc721: address,
          token_id: id,
        },
      };
      const data = JSON.stringify(input_obj);
      let payload = ethers.toUtf8Bytes(data);
      const trans = await rollups.inputContract.addInput(DAPP_ADDRESS, payload);
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction(trans)
      const receipt = await tx.wait(1)
      setLoadWithdrawERC721(false)
      successAlert(receipt?.hash)
      return receipt?.hash
    }
  } catch (e) {
    setLoadWithdrawERC721(false)
    console.log(e);
    errorAlert(e)
  }
};

export const transferNftToPortal = async (
  rollups: RollupsContracts | undefined, 
  provider: JsonRpcApiProvider | undefined,
  setLoadTransferNFT: Function, 
  contractAddress: string,
  nftid: number
) => {
  try {
    if (rollups && provider) {
      setLoadTransferNFT(true)
      const data = ethers.toUtf8Bytes(
        `Deposited (${nftid}) of ERC721 (${contractAddress}).`
      );
      //const data = `Deposited ${args.amount} tokens (${args.token}) for DAppERC20Portal(${portalAddress}) (signer: ${address})`;
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();

      const erc721PortalAddress = rollups.erc721PortalContract.address;

      const tokenContract = signer
        ? IERC721__factory.connect(contractAddress, await signer)
        : IERC721__factory.connect(contractAddress, signer);

      // query current approval
      const currentApproval = await tokenContract.getApproved(nftid);
      if (currentApproval !== erc721PortalAddress) {
        // Allow portal to withdraw `amount` tokens from signer
        const tx = await tokenContract.approve(erc721PortalAddress, nftid);
        const trans = await (await signer).sendTransaction(tx)
        const receipt = await trans.wait(1);
        const event = (
          await tokenContract.queryFilter(
            tokenContract.filters.Approval(),
            receipt?.hash
          )
        ).pop();
        if (!event) {
          throw Error(
            `could not approve ${nftid} for DAppERC721Portal(${erc721PortalAddress})  (signer: ${signerAddress}, tx: ${tx.hash})`
          );
        }
      }

      // Transfer
      const trans = await rollups.erc721PortalContract.depositERC721Token(
        contractAddress,
        DAPP_ADDRESS,
        nftid,
        "0x",
        data
      );

      const tx = await (await signer).sendTransaction(trans)
      const receipt = await tx.wait(1)
      setLoadTransferNFT(false)
      successAlert(receipt?.hash)
      return receipt?.hash
    }
  } catch (e) {
    setLoadTransferNFT(false)
    console.log(`${e}`);
    errorAlert(e)
  }
};


export const transferErc1155SingleToPortal = async (
  rollups: RollupsContracts | undefined, 
  provider: JsonRpcApiProvider | undefined,
  setLoadERC1155: Function,
  contractAddress: string, id: number, amount: number) => {
  try {
      if (rollups && provider) {
        setLoadERC1155(true)
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
              const trans = await tokenContract.setApprovalForAll(erc1155SinglePortalAddress,true);
              const tx = await signer.sendTransaction(trans)
              const receipt = await tx.wait(1);
              const event = (await tokenContract.queryFilter(tokenContract.filters.ApprovalForAll(), receipt?.blockHash)).pop();
              if (!event) {
                  throw Error(`could set approval for DAppERC1155Portal(${erc1155SinglePortalAddress})  (signer: ${signerAddress}, tx: ${tx.hash})`);
              }
          }

          // Transfer
        const depositTx =  await rollups.erc1155SinglePortalContract.depositSingleERC1155Token(contractAddress,DAPP_ADDRESS, id, amount, "0x", data);
        const tx = await signer.sendTransaction(depositTx)
        const receipt = await tx.wait(1)
        setLoadERC1155(false)
        successAlert(receipt?.hash)
        return receipt?.hash
      }
  } catch (e) {
    setLoadERC1155(false)
    errorAlert(e)
    console.log(`${e}`);
  }
};

export const transferErc1155BatchToPortal = async ( 
  rollups: RollupsContracts | undefined, 
  provider: JsonRpcApiProvider | undefined,
  setLoadERC1155Batch: Function,
  contractAddress: string, 
  ids: number[], 
  amounts: number[]
) => {
  try {
      if (rollups && provider) {
          setLoadERC1155Batch(true)
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
              const tx = await signer.sendTransaction(trans)
              const receipt = await tx.wait(1);
              const event = (await tokenContract.queryFilter(tokenContract.filters.ApprovalForAll(), receipt?.blockHash)).pop();
              if (!event) {
                  throw Error(`could set approval for DAppERC1155Portal(${erc1155BatchPortalAddress})  (signer: ${signerAddress}, tx: ${tx.hash})`);
              }
          }

          // Transfer
         const depositTx = await rollups.erc1155BatchPortalContract.depositBatchERC1155Token(contractAddress,DAPP_ADDRESS, ids, amounts, "0x", data);        
         const tx = await signer.sendTransaction(depositTx)  
         const receipt = await tx.wait()
         setLoadERC1155Batch(false)
         successAlert(receipt?.hash)
         return receipt?.hash

      }
  } catch (e) {
      setLoadERC1155Batch(false)
      errorAlert(e)
      console.log(`${e}`);
  }
};

