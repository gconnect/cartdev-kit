'use client'
import { FetchFun } from "@calindra/cartesify/src/cartesify/FetchLikeClient"
import { Signer } from "ethers"
import { useState } from "react"
import { Button } from "../components/Button"
import { CommonProps } from "./utils/CommonProps"
import { useEthersSigner } from "../utils/useEtherSigner"

export function RestExample({ fetch }: CommonProps) {
    const [backendResponse, setBackendResponse] = useState('')
    const signer = useEthersSigner()

    return (
        <div className="flex justify-center">
            <div>
            <h2 className="text-2xl mt-16">REST Example</h2>
            <Button className="bg-blue-500 p-2 rounded m-2" onClick={async () => {
                const res = await fetch('http://127.0.0.1:8383/health')
                const json = await res.json()
                setBackendResponse(JSON.stringify(json, null, 4))
            }}>GET</Button>
            <Button className="bg-green-500 p-2 rounded m-2" onClick={async () => {
                const res = await fetch('http://127.0.0.1:8383/new-game', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ any: 'body' }),
                    signer
                })
                const json = await res.json()
                setBackendResponse(JSON.stringify(json, null, 4))
            }}>POST</Button>
            <Button  className="bg-orange-500 p-2 rounded m-2" onClick={async () => {
                const res = await fetch('http://127.0.0.1:8383/update', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ any: 'body' }),
                    signer
                })
                const json = await res.json()
                setBackendResponse(JSON.stringify(json, null, 4))
            }}>PUT</Button>
            <Button className="bg-red-500 p-2 rounded m-2" onClick={async () => {
                const res = await fetch('http://127.0.0.1:8383/delete?some=body', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    signer
                })
                const json = await res.json()
                setBackendResponse(JSON.stringify(json, null, 4))
            }}>DELETE</Button>
            
            <div className="text-lg my-4">
                Backend response: <pre>{backendResponse}</pre>
            </div>
            </div>
            
        </div>
    )
}