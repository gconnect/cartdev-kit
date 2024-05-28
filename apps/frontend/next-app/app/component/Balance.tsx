import React from "react";
import { ethers } from "ethers";
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
import { useInspectCall } from "../cartesi/hooks/useInspectCall";

export const Balance: React.FC = () => {
    const { decodedReports = {}, reports, inspectCall} = useInspectCall()

    return (
        <Box borderWidth='0.1px' padding='4' borderRadius='lg' overflow='hidden'>
        <TableContainer>
            <Stack>
            <Table variant='striped' size="lg">
                <Thead>
                    <Tr>
                        <Th textAlign={'center'} textColor={'slategray'}>Ether</Th>
                        <Th textAlign={'center'} textColor={'slategray'}>ERC-20</Th>
                        <Th textAlign={'center'} textColor={'slategray'}>ERC-721</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {reports?.length === 0 && (
                        <Tr>
                            <Td colSpan={4} textAlign={'center'} fontSize='14' color='grey' >looks like your cartesi dapp balance is zero! 🙁</Td>
                        </Tr>
                    )}
                
                    {<Tr key={`${decodedReports && decodedReports}`}>
                        {decodedReports && decodedReports.ether && (
                        <Td textAlign={'center'}>{ethers.formatEther(decodedReports.ether)}</Td> )}
                        { decodedReports && decodedReports.erc20 && (
                        <Td textAlign={'center'}>
                            <div>📍 {String(decodedReports.erc20).split(",")[0]}</div>
                            <div>🤑 {Number(String(decodedReports.erc20).split(",")[1]) > 0 ? Number(String(decodedReports.erc20).split(",")[1]) / 10**18 : null} </div>
                        </Td> )}
                        {decodedReports && decodedReports.erc721 && (
                        <Td textAlign={'center'}>
                            <div>📍 {String(decodedReports.erc721).split(",")[0]}</div>
                            <div>🆔 {String(decodedReports.erc721).split(",")[1]}</div>
                        </Td> )}
                    </Tr>}
                </Tbody>
            </Table>
            <Button backgroundColor={"#9395D3"} onClick={() => inspectCall("balance/0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")}>Get Balance</Button>
            </Stack>
        </TableContainer>
        </Box>
    );
};
