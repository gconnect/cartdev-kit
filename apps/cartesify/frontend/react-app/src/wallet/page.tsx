'use client'
import Transfers from "../cartesi/Transfers";
import { SimpleGrid } from "@chakra-ui/react";
import { Balance } from "../cartesi/Balance";
const WalletExample = () => {

  return (
    <SimpleGrid background={"#05051F"} columns={1} marginTop={'48px'} marginLeft={'25%'} marginRight={'25%'}>  
      <Balance/>
      <br/>
      <Transfers />
    </SimpleGrid>
  )
}

export default WalletExample