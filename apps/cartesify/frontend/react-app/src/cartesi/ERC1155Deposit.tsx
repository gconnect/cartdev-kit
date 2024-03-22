import { FetchFun } from "@calindra/cartesify/src/cartesify/FetchLikeClient"
import { ERC1155BatchPortal__factory, ERC1155SinglePortal__factory, IERC1155__factory } from "@cartesi/rollups"
import { JsonRpcSigner } from "ethers"
import { useEffect, useState } from "react"
import { Button } from "../components/Button"

type ERC1155DepositProps = {
    dappAddress: string
    getSigner: () => Promise<JsonRpcSigner>
    fetch: FetchFun
}

export default function ERC1155Deposit({ getSigner, dappAddress, fetch }: ERC1155DepositProps) {
    const [toAddress, setToAddress] = useState('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
    const [erc1155address, _setErc1155Address] = useState(localStorage.getItem(`erc1155address`) ?? '0x3Aa5ebB10DC797CAC828524e59A333d0A371443c')
    const [tokenId, setTokenId] = useState('1')
    const [value, setValue] = useState(1)

    const [batchSize, setBatchSize] = useState(2)
    const [batch, setBatch] = useState<{ tokenId: string, value: number, balance?: number, balanceL2?: number }[]>([])

    function setErc1155Address(address: string) {
        _setErc1155Address(address)
        localStorage.setItem('erc1155address', address)
    }

    async function singleDeposit() {
        const signer = await getSigner()
        // you could check this address by executing `sunodo run --verbose`
        const portalAddress = '0x7CFB0193Ca87eB6e48056885E026552c3A941FC4'
        const contract = IERC1155__factory.connect(erc1155address, signer)
        const portal = ERC1155SinglePortal__factory.connect(portalAddress, signer)
        const approve = await contract.setApprovalForAll(portalAddress, true)
        console.log('approve', approve)
        const tx = await portal.depositSingleERC1155Token(erc1155address, dappAddress, tokenId, value, '0x', '0x')
        await (tx as any).wait()
        console.log('Success!')
    }

    async function batchDeposit() {
        const signer = await getSigner()
        // you could check this address by executing `sunodo run --verbose`
        const portalAddress = '0xedB53860A6B52bbb7561Ad596416ee9965B055Aa'
        const contract = IERC1155__factory.connect(erc1155address, signer)
        const approve = await contract.setApprovalForAll(portalAddress, true)
        console.log('approve', approve)

        const portal = ERC1155BatchPortal__factory.connect(portalAddress, signer)
        const tx = await portal.depositBatchERC1155Token(erc1155address, dappAddress, batch.map(b => BigInt(b.tokenId)), batch.map(b => BigInt(b.value)), '0x', '0x')
        await (tx as any).wait()
        console.log('Success!')
    }

    async function transferErc1155() {
        const signer = await getSigner()
        const res = await fetch(`http://127.0.0.1:8383/wallet/erc-1155/transfer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: erc1155address,
                to: toAddress,
                tokenIds: batch.map(item => +item.tokenId),
                values: batch.map(item => item.value)
            }),
            signer,
        })
        if (!res.ok) {
            console.log(res.status, res.text())
            return
        }
        const json = await res.json()
        console.log(json)
    }

    async function batchWithdraw() {
        const signer = await getSigner()
        const res = await fetch(`http://127.0.0.1:8383/wallet/erc-1155/withdraw`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: erc1155address,
                tokenIds: batch.map(item => +item.tokenId),
                values: batch.map(item => item.value)
            }),
            signer,
        })
        if (!res.ok) {
            console.log(res.status, res.text())
            return
        }
        const json = await res.json()
        console.log(json)
    }

    function updateBatchSize(newSize: number) {
        setBatchSize(newSize)
        const newBatch = batch.slice(0, newSize)
        for (let i = newBatch.length; i < newSize; i++) {
            newBatch.push({
                tokenId: `${i + 1}`,
                value: 1
            })
        }
        loadBalances(newBatch)
    }

    async function loadBalances(batch: { tokenId: string; value: number; balance?: number }[]) {
        const signer = await getSigner()
        const bytecode = await signer.provider?.getCode(erc1155address)
        if (bytecode === '0x') {
            console.log('Token does not exist')
            return
        }
        if (!batch?.length) {
            return
        }
        const userAddress = await signer.getAddress()
        const contract = IERC1155__factory.connect(erc1155address, signer)
        const balances = await contract.balanceOfBatch(batch.map(() => userAddress), batch.map(b => b.tokenId))
        balances.forEach((b, i) => {
            batch[i].balance = b.toString()
        })
        setBatch(batch)
    }

    useEffect(() => updateBatchSize(batchSize), [])

    return (
        <div style={{ textAlign: 'left' }}>
            <h2>ERC-1155</h2>
            <h3>Single Deposit</h3>
            Token address: <input value={erc1155address} onChange={(e) => setErc1155Address(e.target.value)} /><br />
            Token ID: <input value={tokenId} onChange={(e) => setTokenId(e.target.value)} /><br />
            Value: <input value={value} onChange={(e) => setValue(+e.target.value)} /><br />
            <Button onClick={singleDeposit}>Deposit</Button>
            <h3>Batch Deposit</h3>
            Token address: <input value={erc1155address} onChange={(e) => setErc1155Address(e.target.value)} />
            <Button onClick={async () => {
                const signer = await getSigner()
                const res = await fetch(`http://127.0.0.1:8383/wallet/${signer.address}`)
                const wallet = await res.json()
                const erc1155tokens = wallet.erc1155[erc1155address]
                if (erc1155tokens) {
                    batch.forEach(item => {
                        item.balanceL2 = erc1155tokens[`${item.tokenId}`]
                    })
                }
                // setErc20balanceL2(json.balance)
                // console.log(json)
                loadBalances([...batch])
            }}>GET Balance</Button><br />
            Batch size: <input value={batchSize} type="number" onChange={(e) => {
                updateBatchSize(+e.target.value)
            }} /><br />
            {batch.map((item, i) => {
                return (
                    <div key={`${i}`} style={{ border: '1px solid #444', padding: '3px', marginTop: '3px' }}>
                        Token ID: <input value={item.tokenId} onChange={(e) => {
                            batch[i].tokenId = e.target.value;
                            loadBalances([...batch])
                        }} /><br />
                        Value: <input value={item.value} onChange={(e) => {
                            batch[i].value = +e.target.value;
                            setBatch([...batch])
                        }} /><br />
                        L1 Balance: {batch[i].balance ?? "0"}<br />
                        L2 Balance: {batch[i].balanceL2 ?? "0"}<br />
                    </div>
                )
            })}
            <Button onClick={batchDeposit}>Deposit</Button>{" "}
            <Button onClick={batchWithdraw}>Voucher Withdraw</Button><br />
            <input value={toAddress} onChange={(e) => {
                setToAddress(e.target.value)
            }} />
            <Button onClick={transferErc1155}>L2 Transfer</Button>
        </div>
    )
}

