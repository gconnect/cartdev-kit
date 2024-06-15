import React, { useState } from "react";
import { fetchWallet } from "./services/RestApiCalls"
import { callDAppAddressRelay } from "./services/Portal"
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Button,
    Stack,
    Box,
  } from '@chakra-ui/react'
  import { useAccount } from "wagmi"
  import { useEthersSigner } from "../utils/useEtherSigner"

export const Balance: React.FC = () => {
    const [backendResponse, setResponse] = useState('')
    const signer = useEthersSigner()
    const { chain } = useAccount()
    console.log(backendResponse)
    return (
        <div>
        <Box borderWidth='0.1px' padding='4' mt='16' borderRadius='lg' overflow='hidden'>
        <TableContainer>
            <Stack>
            <Table variant='striped' size="lg">
                <Thead>
                    <Tr>
                        <Th textAlign={'center'} textColor={'slategray'}>Ether</Th>
                        <Th textAlign={'center'} textColor={'slategray'}>ERC-20</Th>
                        <Th textAlign={'center'} textColor={'slategray'}>ERC-721</Th>
                        <Th textAlign={'center'} textColor={'slategray'}>ERC-1155</Th>
                    </Tr>
                </Thead>
                <Tbody>
                <Tr>
                    {backendResponse  === "" ? 
                    <Td colSpan={4} textAlign={'center'} fontSize='14' color='grey' >looks like your cartesi dapp balance is zero! 🙁</Td>
                    : <Td colSpan={4} textAlign={'center'} fontSize='14' color='grey' >{backendResponse}</Td>
                    }
                 </Tr>
                </Tbody>
            </Table>
            <Button colorScheme="blue" className=" p-2 " onClick={async () => {
                    await fetchWallet(signer, setResponse)
                }}>Get Wallet Balance</Button>
             <Button  onClick={async () => {
                    await callDAppAddressRelay(signer, chain!)
                }} backgroundColor={"#9395D3"}>Dapp Relay Address</Button>
            </Stack>
        </TableContainer>
        </Box>
        </div>
    );
};
