import  { Cartesify }  from "@calindra/cartesify";
import { DAPP_ADDRESS } from "./constants";

export const fetch =  Cartesify.createFetch({
  dappAddress: DAPP_ADDRESS,
  endpoints: {
    graphQL: new URL("http://localhost:8080/graphql"),
    inspect: new URL("http://localhost:8080/inspect"),
  },
})