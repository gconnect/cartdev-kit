'use client'
import { useState } from "react"
import { Button } from "@chakra-ui/react"
import { useEthersSigner } from "../utils/useEtherSigner"
import { createOrUpdateRequest, getRequest } from "./services/RestApiCalls"

export function RestExample() {
    const [backendResponse, setResponse] = useState('')
    const signer = useEthersSigner()

    return (
        <div className="flex justify-center text-white">
            <div>
            <Button colorScheme="blue" className="p-2 rounded m-2" onClick={async () => {
                await getRequest(setResponse, "health")
            }}>GET</Button>
            <Button colorScheme="green" className=" p-2 rounded m-2" onClick={async () => {
                await createOrUpdateRequest(signer, "greeting", "POST", JSON.stringify({ any: 'body' }),)
            }}>POST</Button>
            <Button colorScheme="orange" className=" p-2 rounded m-2" onClick={async () => {
             await createOrUpdateRequest(signer, "greeting", "PUT", JSON.stringify({ any: 'body' }))
            }}>PUT</Button>
            <Button colorScheme="red" className=" p-2 rounded m-2" onClick={async () => {
                await createOrUpdateRequest(signer, "delete?some=body", "DELETE")
            }}>DELETE</Button>
            
            <div className="text-lg my-4 text-slate-400">
                Backend response: <pre>{backendResponse}</pre>
            </div>
            </div>
            
        </div>
    )
}