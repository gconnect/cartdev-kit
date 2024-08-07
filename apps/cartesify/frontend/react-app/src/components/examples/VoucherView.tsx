'use client'
import { useEffect, useState } from "react"
import { Voucher } from "../../cartesi/model"
import { VoucherService } from "../../cartesi/services/VoucherService"
import { Button } from "@chakra-ui/react"
import { DAPP_ADDRESS } from "../../utils/constants"
import { useEthersSigner } from "../../utils/useEtherSigner"
import { executeVoucher } from "../../cartesi/services/Portal"
import { useAccount } from "wagmi"

export default function VoucherView() {
    const [vouchers, setVouchers] = useState<Voucher[] | undefined>()
    async function loadVouchers() {
        setVouchers(undefined)
        const res = await VoucherService.findAll()
        const vouchers = res.data.vouchers.edges.map((e: any) => e.node)
        setVouchers(vouchers)
    }

    useEffect(() => {
        if(vouchers){
         loadVouchers()
        }
    }, [])

    return (
        <div className="text-slate-400">
            <h2 className="text-2xl mt-4 mb-2">Vouchers</h2>
            <p>The voucher needs the epoch to end before it is ready to be executed.</p>
            <Button className="" onClick={loadVouchers}>Load Vouchers</Button>
            <div style={{ paddingTop: '10px' }}>
                {!!vouchers ? (
                    <div>
                        <div>{vouchers.length} vouchers</div>
                        {vouchers.map((voucher, i) => {
                            return (
                                <div key={`${i}`}>
                                    <VoucherItem voucher={voucher} />
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

function VoucherItem({ voucher }: { voucher: Voucher }) {
    const signer = useEthersSigner()
    const { chain } = useAccount()

    const hasProof = !!voucher.proof?.validity
    return (
        <>
            {voucher.destination}
            {hasProof ? (
                <Button className="bg-yellow-500 p-2 rounded m-2" onClick={async () => {
                    await executeVoucher(voucher, DAPP_ADDRESS, signer, chain!)
                }}>Execute</Button>
            ) : (
                <span> waiting for proof </span>
            )}
        </>
    )
}