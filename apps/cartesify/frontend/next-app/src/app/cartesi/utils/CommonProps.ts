import { FetchFun } from "@calindra/cartesify/src/cartesify/FetchLikeClient"
import { JsonRpcSigner } from "ethers"

 export type CommonProps = {
  dappAddress: string
  fetch: FetchFun
}