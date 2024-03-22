import { ERC20Portal__factory, ERC721Portal__factory, EtherPortal__factory, IERC20__factory, IERC721__factory } from "@cartesi/rollups";
import { JsonRpcSigner } from "ethers";


export class BaseLayerWalletService {

    static async balanceERC20(erc20address: string, signer: JsonRpcSigner) {
        const contract = IERC20__factory.connect(erc20address, signer)
        const balance = await contract.balanceOf(signer.address)
        return balance
    }

    static async balanceERC721(erc721address: string, signer: JsonRpcSigner) {
        const bytecode = await signer.provider.getCode(erc721address)
        if (bytecode === '0x') {
            console.warn(`The contract erc-721 ${erc721address} does not exist`)
            return 0n
        }
        const contract = IERC721__factory.connect(erc721address, signer)
        const balance = await contract.balanceOf(signer.address)
        return balance
    }

    static async depositERC20(dappAddress: string, erc20address: string, erc20value: string, signer: JsonRpcSigner) {
        const portalAddress = '0x9C21AEb2093C32DDbC53eEF24B873BDCd1aDa1DB'
        const contract = IERC20__factory.connect(erc20address, signer)
        await contract.approve(portalAddress, erc20value)
        const portal = ERC20Portal__factory.connect(portalAddress, signer)
        const tx = await portal.depositERC20Tokens(erc20address, dappAddress, erc20value, '0x')
        await (tx as any).wait()
    }

    static async depositEther(dappAddress: string, etherValue: string, signer: JsonRpcSigner) {
        const portalAddress = '0xFfdbe43d4c855BF7e0f105c400A50857f53AB044'
        const portal = EtherPortal__factory.connect(portalAddress, signer)
        const tx = await portal.depositEther(dappAddress, '0x', { value: etherValue })
        await (tx as any).wait()
    }

    static async depositERC721(dappAddress: string, erc721address: string, erc721id: string, signer: JsonRpcSigner) {
        const portalAddress = '0x237F8DD094C0e47f4236f12b4Fa01d6Dae89fb87'
        const contract = IERC721__factory.connect(erc721address, signer)
        await contract.approve(portalAddress, erc721id)
        const portal = ERC721Portal__factory.connect(portalAddress, signer)
        const tx = await portal.depositERC721Token(erc721address, dappAddress, erc721id, '0x', '0x')
        await (tx as any).wait()
    }
}
