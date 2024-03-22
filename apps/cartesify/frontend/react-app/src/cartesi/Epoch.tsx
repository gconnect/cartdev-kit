import { Button } from "../components/Button";


async function sendRPCCommand(method: string, params: any[]) {
    const rpcUrl = 'http://localhost:8545'; // Replace this with your JSON-RPC endpoint URL
    const data = {
        jsonrpc: '2.0',
        method: method,
        params: params,
        id: 1 // You can use any value for the ID
    };

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    try {
        const response = await fetch(rpcUrl, requestOptions);
        const responseData = await response.json();
        console.log(responseData);
    } catch (error) {
        console.error(error)
    }
}

export function Epoch() {

    return (
        <div style={{ textAlign: 'left' }}>
            <h2>Epoch</h2>
            <p>Advance the epoch by running this command on terminal:</p>
            <pre>ETH_RPC_URL=http://localhost:8545 cast rpc evm_increaseTime 5184000</pre>
            <p>Or click
                <Button onClick={() => {
                    sendRPCCommand('evm_increaseTime', [5184000]);
                }}>Increase Time</Button>
            </p>
        </div>
    )
}