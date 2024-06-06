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

export const Balance: React.FC = () => {

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
                        <Th textAlign={'center'} textColor={'slategray'}>ERC-1155</Th>
                    </Tr>
                </Thead>
                <Tbody>
                <Tr>
                    <Td colSpan={4} textAlign={'center'} fontSize='14' color='grey' >looks like your cartesi dapp balance is zero! 🙁</Td>
                 </Tr>
                </Tbody>
            </Table>
            <Button backgroundColor={"#9395D3"}>Get Balance</Button>
            </Stack>
        </TableContainer>
        </Box>
    );
};
