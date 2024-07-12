"use client"

import React, {useEffect} from "react";
import { useNotices } from "../../cartesi/hooks/useNotices";
import { ethers } from "ethers";
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    Button,
    Badge,
    TableCaption,
    TableContainer,
    Box
} from '@chakra-ui/react'

export const Notices: React.FC = () => {
    const {loading, error, data, notices, refetch } = useNotices()

    useEffect(() => {
        refetch({ requestPolicy: 'network-only' });
    }, [refetch]);
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-slate-400">Oh no... {error.message}</p>;

    if (!data || !data.notices) return <p className="text-slate-400">No Notices</p>;
  
    const payloadIsJSON = (payload: any) => {
        try {
            JSON.parse(payload);
            return true;
        } catch (e) {
            return false;
        }
    }

    return (
        <Box className="overflow-x-auto" >
        <Table>
            <Thead>
                <Tr>
                    {/* <th>Input Index</th>
                    <th>Notice Index</th>  */}
                    {/* <th>Input Payload</th> */}
                    <Th>Notices <Button size='xs' onClick={() => {
                        refetch({ requestPolicy: 'network-only' });
                        }}>🔃</Button>
                    </Th>
                    <Th></Th>
                </Tr>
            </Thead>
            <Tbody>
                {notices.length === 0 && (
                    <Tr>
                        <Td colSpan={4}>-</Td>
                    </Tr>
                )}
                {notices.map((n: any) => (
                    <Tr key={`${n.input.index}-${n.index}`}>

                        {/* Conditionally render deposit activity */}
                        {payloadIsJSON(n.payload) ? (
                            JSON.parse(n.payload).type === "etherdeposit" ? (
                                <Td color={'grey'}><Badge colorScheme="cyan">{JSON.parse(n.payload).type}</Badge></Td>
                            ) :
                                JSON.parse(n.payload).type === "erc20deposit" ? (
                                    <Td color={'grey'}><Badge colorScheme="green">{JSON.parse(n.payload).type}</Badge></Td>
                                ) :
                                    JSON.parse(n.payload).type === "erc721deposit" ? (
                                        <Td color={'grey'}><Badge colorScheme="purple">{JSON.parse(n.payload).type}</Badge> </Td>
                                    ) : (
                                        // Render something else for other JSON content
                                        <Td color={'grey'}>{JSON.stringify(n.payload)}</Td>
                                    )
                        ) : (
                            // Render if payload is not JSON
                            <Td color={'grey'}><Badge>DappAdressRelay</Badge></Td>
                        )}

                        {payloadIsJSON(n.payload) ? (
                            JSON.parse(n.payload).type === "etherdeposit" ? (
                                <Td color={'slategray'}> {ethers.formatEther((JSON.parse(n.payload).content).amount)} Ξ deposited to ctsi account {(JSON.parse(n.payload).content).address} </Td>
                            ) :
                                JSON.parse(n.payload).type === "erc20deposit" ? (
                                    <Td color={'slategray'}> {ethers.formatEther((JSON.parse(n.payload).content).amount)} amount deposited to ctsi account {(JSON.parse(n.payload).content).address}. ERC20 address {(JSON.parse(n.payload).content).erc20} </Td>
                                ) :
                                    JSON.parse(n.payload).type === "erc721deposit" ? (
                                        <Td color={'slategray'}> NFT address <Badge variant="outline">{(JSON.parse(n.payload).content).erc721}</Badge> and id {(JSON.parse(n.payload).content).token_id} transferred to ctsi account {(JSON.parse(n.payload).content).address}</Td>
                                    ) : (
                                        // Render something else for other JSON content
                                        <Td color={'slategray'}>{JSON.stringify(n.payload)}</Td>
                                    )
                        ) : (
                            // Render if payload is not JSON     
                            <Td color={'slategray'}>{n.payload}</Td>
                        )}
                    </Tr>
                ))}
            </Tbody>
        </Table>

    </Box>
    );
};
