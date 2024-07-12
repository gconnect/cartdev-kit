"use client"

import { ethers } from "ethers";
import React, { useEffect } from "react";
import { useReports } from "../../cartesi/hooks/useReports";

import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Button
  } from '@chakra-ui/react'

export const Reports: React.FC = () => {

    const {loading, error, data, reports, refetch,} = useReports();

    useEffect(() => {
        refetch({ requestPolicy: 'network-only' });
    }, [refetch]);
    
    if (loading) return <p className="text-slate-400">Loading...</p>;
    if (error) return <p className="text-slate-400">Oh no... {error.message}</p>;

    if (!data || !data.reports) return <p className="text-slate-400">No reports</p>;

    return (
        <div className="overflow-x-auto">
            <Table>
                <Thead>
                    <Tr>
                        {/* <Th>Input Index</Th>
                        <Th>Notice Index</Th> 
                        <th>Input Payload</th> */}
                        <Th className="text-slate-200">Reports <Button size='xs' onClick={() => refetch({ requestPolicy: 'network-only' })}>
                             🔃 </Button>
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {reports && reports.length === 0 && (
                        <Tr>
                            <Td colSpan={4}>-</Td>
                        </Tr>
                    )}
                    {reports && reports.map((n: any) => (
                        <Tr key={`${n.input.index}-${n.index}`}>
                            {/* <Td>{n.input.index}</Td>
                            <Td>{n.index}</Td>  */}
                             {/* <td>{n.input.payload}</td> */}
                            <Td color={'slategray'}>{n.payload}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>

        </div>
    );
};
