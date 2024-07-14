'use client'
import { DAPP_ADDRESS } from "@/app/utils/constants";
import Transfers from "../components/examples/Transfers";
import { SimpleGrid } from "@chakra-ui/react";
import { Balance } from "../components/examples/Balance";
const WalletExample = () => {

  return (
    <SimpleGrid background={"#05051F"} columns={1} marginTop={'48px'} marginLeft={'25%'} marginRight={'25%'}>  
      <Balance/>
      <br/>
      <Transfers dappAddress={DAPP_ADDRESS}/>
    </SimpleGrid>
  )
}

export default WalletExample