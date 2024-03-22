import { ProofStruct } from "@cartesi/rollups/dist/src/types/contracts/dapp/CartesiDApp";

export interface Voucher {
    destination: string,
    payload: string,
    proof: ProofStruct
    index: number
    input: {
        index: number
    }
}
