import { ERC20Portal__factory, ERC721Portal__factory, EtherPortal__factory, IERC20__factory, IERC721__factory, 
    IERC1155__factory, ERC1155BatchPortal__factory,
    ERC1155SinglePortal__factory, CartesiDApp__factory, DAppAddressRelay__factory
 } from "@cartesi/rollups";
import { JsonRpcSigner, ethers, parseEther, parseUnits, toBigInt } from "ethers";
import { Voucher, Batch } from "../model";
import { DAPP_ADDRESS } from "@/app/utils/constants";
import { errorAlert, successAlert } from "@/app/utils/customAlert";
// import { Chain } from "@rainbow-me/rainbowkit";
import configFile from "../../cartesi/config.json"
import { toHex } from "viem";
import { Chain } from "viem";

const config: any = configFile

export const balanceERC20 = async (erc20address: string, signer: JsonRpcSigner) => {
    try{
        const contract = IERC20__factory.connect(erc20address, signer)
        const balance = await contract.balanceOf(signer.address)
        return balance 
    }catch(error){
        console.log(error)
        return error
    }
}

export const balanceERC721 = async (erc721address: string, signer: JsonRpcSigner) => {
    try{
        const bytecode = await signer.provider.getCode(erc721address)
        if (bytecode === '0x') {
        console.warn(`The contract erc-721 ${erc721address} does not exist`)
        return toBigInt(0)
    }
        const contract = IERC721__factory.connect(erc721address, signer)
        const balance = await contract.balanceOf(signer.address)
        return balance
    }catch(error){
        console.log(error)
        return error
    }
}

export const balanceERC1155 = async (erc1155address: string, signer: JsonRpcSigner, tokenId: number) => {
    try{
        const bytecode = await signer.provider.getCode(erc1155address)
        if (bytecode === '0x') {
        console.warn(`The contract erc-1155 ${erc1155address} does not exist`)
        return toBigInt(0)
    }
        const contract = IERC1155__factory.connect(erc1155address, signer)
        const balance = await contract.balanceOf(signer.address, tokenId)
        return balance
    }catch(error){
        console.log(error)
    }
}

export const loadBatchBalances = async (signer: JsonRpcSigner, erc1155address: string,
    batch: Batch[], setBatch: Function) => {
    try {
        const bytecode = await signer.provider.getCode(erc1155address)
        if (bytecode === '0x') {
            console.log('Token does not exist')
            return
        }
        if (!batch?.length) {
            return
        }
        const userAddress = await signer?.getAddress()
        const contract = IERC1155__factory.connect(erc1155address, signer)
        const balances = await contract.balanceOfBatch(batch.map(() => userAddress), batch.map(b => b.tokenId))
        balances.forEach((b, i) => {
            batch[i].balance = b.toString()
        })
        setBatch(batch)
    } catch (error) {
        console.log(error)
        return error
    }
}

export const depositEther = async (
    amount: string, 
    signer: JsonRpcSigner | undefined, 
    chain: Chain
    ) => {
    try {
    const data = ethers.toUtf8Bytes(`Deposited (${amount}) ether.`);
    const txOverrides = { 
        value: parseEther(`${amount}`),
        // gasLimit: ethers.hexlify(3000000), // Example gas limit
        gasPrice: ethers.parseUnits('10', 'gwei') // Example gas pr
    };

    const portalAddress = config[toHex(chain.id)].EtherPortalAddress
    const explorer = config[toHex(chain.id)].explorer
    const portal = EtherPortal__factory.connect(portalAddress, signer!)
    const tx = await portal.depositEther(DAPP_ADDRESS, data, txOverrides)
    const receipt = await (tx as any).wait(1)
    const transactionHash = `${explorer + "tx/" + receipt.hash}`;
    successAlert(transactionHash);
    } catch (error) {
    errorAlert(error)
    console.log(error)
    }
}

export const depositERC20 = async (dappAddress: string, erc20address: string, 
    erc20value: string, signer: JsonRpcSigner, chain: Chain) => {
    try {
        const portalAddress = config[toHex(chain.id)].Erc20PortalAddress
        const explorer = config[toHex(chain.id)].explorer
        const contract = IERC20__factory.connect(erc20address, signer)
        await contract.approve(portalAddress, parseEther(erc20value))
        const portal = ERC20Portal__factory.connect(portalAddress, signer)
        const tx = await portal.depositERC20Tokens(erc20address, dappAddress, parseEther(erc20value.toString()), '0x')
        const receipt = await (tx as any).wait()
        console.log(explorer)
        successAlert(`Successfully deposited`)
    } catch (error) {
        console.log(error)
        errorAlert(error)
    }
}

export const depositERC721 = async (dappAddress: string, erc721address: string, 
    erc721id: string, signer: JsonRpcSigner, chain: Chain) => {
    try {
    const portalAddress = config[toHex(chain.id)].Erc721PortalAddress
    const explorer = config[toHex(chain.id)].explorer
    const contract = IERC721__factory.connect(erc721address, signer)
    await contract.approve(portalAddress, erc721id)
    const portal =  ERC721Portal__factory.connect(portalAddress, signer)
    const tx = await portal.depositERC721Token(erc721address, dappAddress, erc721id, '0x', '0x')
    const receipt = await (tx as any).wait()
    successAlert(`${explorer/+"tx"/receipt.hash}`)
    } catch (error) {
    errorAlert(error)
    }
}

export const depositSingleERC1155 = async (dappAddress: string, erc1155address: string, 
    erc1155id: string, amount: number, signer: JsonRpcSigner, chain: Chain) => {
    try {
        const portalAddress = config[toHex(chain.id)].Erc1155SinglePortalAddress
        const explorer = config[toHex(chain.id)].explorer
        const data = ethers.toUtf8Bytes(`Deposited (${amount}) tokens from id (${erc1155id}) of ERC1155 (${erc1155address}).`);
        const contract = IERC1155__factory.connect(erc1155address, signer)
        await contract.isApprovedForAll(portalAddress, erc1155id)
        const approve = await contract.setApprovalForAll(portalAddress, true)
        console.log('approve', approve)
        const portal = ERC1155SinglePortal__factory.connect(portalAddress, signer)
        const tx = await portal.depositSingleERC1155Token(erc1155address, dappAddress, erc1155id, amount, '0x', data)
        const receipt = await (tx as any).wait()
        successAlert(`${explorer/+"tx"/receipt.hash}`)
    } catch (error) {
        errorAlert(error)
    }
}

export const depositBatchERC1155 = async (dappAddress: string, erc1155address: string, 
    erc1155ids: string[], amounts: number[], signer: JsonRpcSigner, chain: Chain) => {
    try {
        const portalAddress = config[toHex(chain.id)].Erc1155BatchPortalAddress
        const explorer = config[toHex(chain.id)].explorer
        const data = ethers.toUtf8Bytes(`Deposited (${amounts}) tokens from id (${erc1155ids}) of ERC1155 (${erc1155address}).`);
        const contract = IERC1155__factory.connect(erc1155address, signer)
        const approve = await contract.setApprovalForAll(portalAddress, true)
        console.log('approve', approve)
        const portal = ERC1155BatchPortal__factory.connect(portalAddress, signer)
        const tx = await portal.depositBatchERC1155Token(erc1155address, dappAddress, erc1155ids, amounts, '0x', data)
        const receipt = await (tx as any).wait()
        successAlert(`${explorer/+"tx"/receipt.hash}`)
    } catch (error) {
        errorAlert(error)
    }
}

export const executeVoucher = async (voucher: Voucher, dappAddress: string, 
signer: JsonRpcSigner | undefined, chain: Chain) => {
try {
    const explorer = config[toHex(chain.id)].explorer
    const cartesiDApp = CartesiDApp__factory.connect(dappAddress, signer)
    const executed = await cartesiDApp.wasVoucherExecuted(voucher.input.index, voucher.index)
        if (executed) {
            console.log('Voucher was executed!!!')
            errorAlert('Voucher already executed!')
        } else {
            console.log('executing voucher...')
            const tx = await cartesiDApp.executeVoucher(voucher.destination, voucher.payload, voucher.proof)
            console.log(tx)
            const receipt = await (tx as any).wait()
            console.log('Executed!', receipt)
            successAlert(`voucher successfully executed!`)
        }
    return executed
    } catch (error) {
        errorAlert(error)
    }
}

export const callDAppAddressRelay = async (signer: JsonRpcSigner | undefined, chain: Chain) => {
    try {
        const explorer = config[toHex(chain.id)].explorer
        const portalAddress = config[toHex(chain.id)].DAppRelayAddress
        const relay = DAppAddressRelay__factory.connect(portalAddress, signer)
        const tx = await relay.relayDAppAddress(DAPP_ADDRESS)
        const receipt = await (tx as any).wait()
        console.log('Executed!', receipt.hash)
        console.log("hash", receipt.hash)
        console.log("explorer", explorer)
        successAlert(`Succesfully fetched dapp address`)
    } catch (error) {
        errorAlert(error)
    }
}

