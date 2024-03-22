'use client'
import { FetchFun } from "@calindra/cartesify/src/cartesify/FetchLikeClient"
import { DAppAddressRelay__factory } from "@cartesi/rollups"
import { JsonRpcSigner } from "ethers"
import { useEffect, useState } from "react"
import { BaseLayerWalletService } from "./services/BaseLayerWalletService"
import { Button } from "../components/Button"
import { CommonProps } from "./utils/CommonProps"
import { useEthersSigner } from "../utils/useEtherSigner"

export function WalletRest({ fetch, dappAddress }: CommonProps) {
    const [backendWalletResponse, setBackendWalletResponse] = useState('')
    const [erc20address, setErc20Address] = useState(localStorage.getItem('erc20address') ?? '0xc6e7DF5E7b4f2A278906862b61205850344D4e7d')
    const [toAddress, setToAddress] = useState('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
    const [erc20value, setErc20value] = useState('0')
    const [erc20balanceL1, setErc20balanceL1] = useState('0')
    const [erc20balanceL2, setErc20balanceL2] = useState('0')

    const [etherValue, setEtherValue] = useState('0')
    const [etherBalanceL1, setEtherBalanceL1] = useState('0')
    const [etherBalanceL2, setEtherBalanceL2] = useState('0')
    const [erc721balanceL1, setErc721balanceL1] = useState('0')
    const [erc721balanceL2, setErc721balanceL2] = useState('0')
    const [erc721address, setErc721Address] = useState(localStorage.getItem('erc721address') ?? '0x3Aa5ebB10DC797CAC828524e59A333d0A371443c')
    const [erc721id, setErc721id] = useState('1')
    const signer = useEthersSigner()

    useEffect(() => {
        loadErc20balance()
    }, [erc20address])

    async function loadErc20balance() {
        const balance = await BaseLayerWalletService.balanceERC20(erc20address, signer)
        setErc20balanceL1(balance.toString())
    }

    useEffect(() => {
        loadErc721balance()
    }, [erc721address])

    async function loadErc721balance() {
        const balance = await BaseLayerWalletService.balanceERC721(erc721address, signer)
        setErc721balanceL1(balance.toString())
    }

    async function transferErc20() {
        const res = await fetch(`http://127.0.0.1:8383/wallet/erc-20/transfer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: erc20address,
                to: toAddress,
                amount: erc20value
            }),
            signer,
        })
        if (!res.ok) {
            console.log(res.status, res.text())
            return
        }
        console.log('Success!')
    }

    async function transferErc721() {
        const res = await fetch(`http://127.0.0.1:8383/wallet/erc-721/transfer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: erc721address,
                to: toAddress,
                tokenId: erc721id
            }),
            signer,
        })
        if (!res.ok) {
            console.log(res.status, res.text())
            return
        }
        console.log('Success!')
    }

    async function transferEther() {
        const res = await fetch(`http://127.0.0.1:8383/wallet/ether/transfer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: toAddress,
                amount: etherValue
            }),
            signer,
        })
        if (!res.ok) {
            console.log(res.status, res.text())
            return
        }
        console.log('Success!')
    }

    async function withdrawErc20() {
        const res = await fetch(`http://127.0.0.1:8383/wallet/erc-20/withdraw`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: erc20address,
                amount: erc20value
            }),
            signer,
        })
        if (!res.ok) {
            console.log(res.status, res.text())
            return
        }
        console.log('Success!')
    }

    async function withdrawErc721() {
        // await Cartesify.withdrawERC721(erc721address, address, tokenId)

        const res = await fetch(`http://127.0.0.1:8383/wallet/erc-721/withdraw`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: erc721address,
                tokenId: erc721id
            }),
            signer,
        })
        if (!res.ok) {
            console.log(res.status, res.text())
            return
        }
        console.log('Success!')
    }

    async function depositEther() {
        await BaseLayerWalletService.depositEther(dappAddress, etherValue, signer)
        console.log('Success!')
    }

    async function withdrawEther() {
        const res = await fetch(`http://127.0.0.1:8383/wallet/ether/withdraw`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: etherValue
            }),
            signer,
        })
        if (!res.ok) {
            console.log(res.status, res.text())
            return
        }
        console.log('Success!')
    }

    async function depositErc20() {
        await BaseLayerWalletService.depositERC20(dappAddress, erc20address, erc20value, signer)
        console.log('Success!')
    }

    async function depositErc721() {
        // await Cartesify.depositERC721({
        //     type: 'ERC-721',
        //     erc721address,
        //     erc721id,
        //     // signer
        // })
        await BaseLayerWalletService.depositERC721(dappAddress, erc721address, erc721id, signer)
        console.log('Success!')
    }

    async function callDAppAddressRelay() {
        const relay = DAppAddressRelay__factory.connect('0xF5DE34d6BbC0446E2a45719E718efEbaaE179daE', signer)
        const tx = await relay.relayDAppAddress(dappAddress)
        const res = await (tx as any).wait()
        console.log('Executed!', res)
    }

    return (
        <div>
            <h2 className="text-2xl mt-16 text-center">Wallet + REST</h2>
            <div className="flex justify-around">
            <div>
            <p>Some wallet operations require you to first provide the dappAddress.</p>
            <Button onClick={callDAppAddressRelay}>Inform DApp Address</Button>

            <h3 className="text-xl mt-16">JSON Wallet</h3>
            <pre>GET http://127.0.0.1:8383/wallet/:address</pre>
            <Button className="bg-blue-500 p-2 rounded m-2" onClick={async () => {
                const signer = await getSigner()
                const res = await fetch(`http://127.0.0.1:8383/wallet/${signer?.address}`)
                const json = await res.json()
                setBackendWalletResponse(JSON.stringify(json, null, 4))
            }}>GET Wallet</Button><br />
            <div className="text-lg my-4">
                Backend wallet response: <pre>{backendWalletResponse}</pre>
            </div>

            <h3 className="text-xl mt-16 mb-4">Ether</h3>
            <Button className="bg-blue-500 p-2 rounded m-2" onClick={async () => {
                const signer = await getSigner()
                const res = await fetch(`http://127.0.0.1:8383/wallet/${signer.address}`)
                const json = await res.json()
                setEtherBalanceL2(json.ether)
                const balance = await signer.provider.getBalance(signer.address)
                setEtherBalanceL1(balance.toString())
                console.log('Success!')
            }}>GET Balance</Button><br />

            <input className="border rounded p-2 my-2  text-black" type="number" value={etherValue} placeholder="ether value" onChange={(e) => {
                setEtherValue(e.target.value)
            }} />
            <Button className="bg-green-500 p-2 rounded m-2" onClick={depositEther}>Deposit</Button>
            <Button className="bg-yellow-500 p-2 rounded m-2" onClick={withdrawEther}>Voucher Withdraw</Button><br />
            <input className="border rounded p-2 my-2  text-black" type="number" value={toAddress} onChange={(e) => {
                setToAddress(e.target.value)
            }} />
            <Button className="bg-blue-500 p-2 rounded m-2" onClick={transferEther}>L2 Transfer</Button><br />
            <div className="my-2">
                L1 Balance: {etherBalanceL1}<br />
                L2 Balance: {etherBalanceL2}
            </div>
            </div>
            
            <div>
            <h3 className="mt-8 text-lg">ERC-20</h3>
            <input className="border rounded p-2 my-2  text-black" type="number" value={erc20address} onChange={(e) => {
                localStorage.setItem('erc20address', e.target.value)
                setErc20Address(e.target.value)
            }} />
            
            <Button className="bg-green-500 p-2 rounded m-2" onClick={async () => {
                const signer = await getSigner()
                const res = await fetch(`http://127.0.0.1:8383/wallet/${signer.address}`)
                const json = await res.json()
                setErc20balanceL2(json.erc20[erc20address] ?? '0')
                loadErc20balance()
                console.log('Success!')
            }}>GET Balance</Button><br />
            <input className="border rounded p-2 my-2  text-black" type="number" value={erc20value} onChange={(e) => {
                setErc20value(e.target.value)
            }} />
            <Button className="bg-yellow-500 p-2 rounded m-2" onClick={depositErc20}>Deposit</Button>
            <Button className="bg-blue-500 p-2 rounded m-2" onClick={withdrawErc20}>Voucher Withdraw</Button><br />
            <input className="border rounded p-2 my-2  text-black" type="number" value={toAddress} onChange={(e) => {
                setToAddress(e.target.value)
            }} />
            <Button className="bg-yellow-500 p-2 rounded m-2" onClick={transferErc20}>L2 Transfer</Button><br />
            L1 Balance: {erc20balanceL1}<br />
            L2 Balance: {erc20balanceL2}<br />

            <h3 className="xl mt-8">ERC-721</h3>
            <input className="border rounded p-2 my-2  text-black" type="number" value={erc721address} onChange={(e) => {
                localStorage.setItem('erc721address', e.target.value)
                setErc721Address(e.target.value)
            }} />
            <Button className="bg-blue-500 p-2 rounded m-2" onClick={async () => {
                const url = `http://127.0.0.1:8383/wallet/${signer.address}`
                const res = await fetch(url)
                const json = await res.json()
                setErc721balanceL2(json.erc721[erc721address]?.length ?? '0')
                loadErc721balance()
                console.log('Success!')
            }}>GET Balance</Button><br />
            <input className="border rounded p-2 my-2  text-black" value={erc721id} type="number" onChange={(e) => {
                setErc721id(e.target.value)
            }} />
            <Button className="bg-green-500 p-2 rounded m-2" onClick={depositErc721}>Deposit</Button>
            <Button className="bg-yellow-500 p-2 rounded m-2" onClick={withdrawErc721}>Voucher Withdraw</Button><br />
            <input className="border rounded p-2 my-2  text-black" value={toAddress} type="number" onChange={(e) => {
                setToAddress(e.target.value)
            }} />
            <Button className="bg-blue-500 p-2 rounded m-2" onClick={transferErc721}>L2 Transfer</Button>
            <br />
            L1 Balance: {erc721balanceL1}<br />
            L2 Balance: {erc721balanceL2}<br />
            </div>
            
        </div>
        </div>
        
    )
}
