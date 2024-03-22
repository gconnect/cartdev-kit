import { FetchFun } from "@calindra/cartesify/src/cartesify/FetchLikeClient"
import { CartesiDApp__factory } from "@cartesi/rollups"
import { Signer } from "ethers"
import { useEffect, useState } from "react"
import { Voucher } from "./model/Voucher"
import { VoucherService } from "./services/VoucherService"
import { Button } from "../components/Button"

type VoucherViewProps = {
    dappAddress: string
    getSigner: () => Promise<Signer>
    fetch: FetchFun
}

export default function VoucherView({ getSigner, dappAddress }: VoucherViewProps) {
    const [vouchers, setVouchers] = useState<Voucher[] | undefined>()

    async function loadVouchers() {
        setVouchers(undefined)
        const res = await VoucherService.findAll()
        const vouchers = res.data.vouchers.edges.map((e: any) => e.node)
        setVouchers(vouchers)
    }

    useEffect(() => {
        loadVouchers()
    }, [])

    /*
     | 0xF5B2d8c81cDE4D6238bBf20D3D77DB37df13f735 Bitmask
     | 0xB634F716BEd5Dd5A2b9a91C92474C499e50Cb27D CartesiMathV2
     | 0x33436035441927Df1a73FE3AAC5906854632e53d MerkleV2
     | 0x3F8FdcD1B0F421D817BF58C96b7C91B98100B450 UnrolledCordic
     | 0x59b22D57D4f067708AB0c00552767405926dc768 InputBox
     | 0xFfdbe43d4c855BF7e0f105c400A50857f53AB044 EtherPortal
     | 0x9C21AEb2093C32DDbC53eEF24B873BDCd1aDa1DB ERC20Portal
     | 0x237F8DD094C0e47f4236f12b4Fa01d6Dae89fb87 ERC721Portal
     | 0x7CFB0193Ca87eB6e48056885E026552c3A941FC4 ERC1155SinglePortal
     | 0xedB53860A6B52bbb7561Ad596416ee9965B055Aa ERC1155BatchPortal
     | 0xF5DE34d6BbC0446E2a45719E718efEbaaE179daE DAppAddressRelay
     | 0x7122cd1221C20892234186facfE8615e6743Ab02 CartesiDAppFactory
     | 0x5050F233F2312B1636eb7CF6c7876D9cC6ac4785 Authority
     | 0x4FF8BD9122b7D91d56Dd5c88FE6891Fb3c0b5281 History
     | 0xae7f61eCf06C65405560166b259C54031428A9C4 SunodoToken
     | 0x519421Bd7843e0D1E2F280490962850e31c86087 AuthorityFactory
     | 0x5314730B6285B9B026FAaD759aa39A9415eB874c PayableDAppSystem
     */
    async function executeVoucher(voucher: Voucher) {
        const signer = await getSigner()
        const cartesiDApp = CartesiDApp__factory.connect(dappAddress, signer)
        const executed = await cartesiDApp.wasVoucherExecuted(voucher.input.index, voucher.index)
        if (executed) {
            console.log('Voucher was executed!!!')
        } else {
            console.log('executing voucher...')
            const tx = await cartesiDApp.executeVoucher(voucher.destination, voucher.payload, voucher.proof)
            console.log(tx)
            const res = await (tx as any).wait()
            console.log('Executed!', res)
        }
    }

    return (
        <div style={{ textAlign: 'left' }}>
            <h2>Vouchers</h2>
            <p>The voucher needs the epoch to end before it is ready to be executed.</p>
            <Button onClick={loadVouchers}>Load Vouchers</Button>
            <div style={{ paddingTop: '10px' }}>
                {!!vouchers ? (
                    <div>
                        <div>{vouchers.length} vouchers</div>
                        {vouchers.map((voucher, i) => {
                            return (
                                <div key={`${i}`}>
                                    <VoucherERC1155 voucher={voucher} executeVoucher={executeVoucher} />
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div>...</div>
                )}
            </div>
        </div>
    )
}

function VoucherERC1155({ voucher, executeVoucher }: { voucher: Voucher, executeVoucher: (voucher: Voucher) => Promise<void> }) {
    const hasProof = !!voucher.proof?.validity
    return (
        <>
            {voucher.destination}
            {hasProof ? (
                <Button onClick={async () => {
                    await executeVoucher(voucher)
                }}>Execute</Button>
            ) : (
                <span> waiting for proof </span>
            )}
        </>
    )
}