'use client'
import { Button } from "@chakra-ui/react";

import { sendRPCCommand } from "./services/RestApiCalls";
import { useState } from "react";

export function Epoch() {
    const [loading, setLoading] = useState(false)
    return (
        <div className="text-center text-slate-400">
            <h2 className="mt-8 text-2xl mb-4">Epoch</h2>
            <p>Advance the epoch by running this command on terminal:</p>
            <pre>ETH_RPC_URL=http://localhost:8545 cast rpc evm_increaseTime 5184000</pre>
            <p>Or click </p>
                <Button className=" p-2 text-black rounded m-2" onClick={ async () => {
                    setLoading(true)
                   await sendRPCCommand('evm_increaseTime', [5184000]);
                   setLoading(true)
                }}>{loading ?  "loading please wait..." : "Increase Time"}</Button>
           
        </div>
    )
}