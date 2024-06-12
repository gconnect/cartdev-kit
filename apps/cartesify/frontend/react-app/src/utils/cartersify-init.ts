import  { Cartesify }  from "@calindra/cartesify";
import { GRAPHQL_BASE_URL, DAPP_ADDRESS, INSPECT_BASE_URL } from "./constants";

export const fetch =  Cartesify.createFetch({
  dappAddress: DAPP_ADDRESS,
  endpoints: {
    graphQL: new URL(GRAPHQL_BASE_URL),
    inspect: new URL(INSPECT_BASE_URL),
  },
})