"use client"

// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.
import { ethers } from "ethers";
import React, { useEffect } from "react";
import { useReports } from "./hooks/useReports";

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
    }, []);
    
    if (loading) return <p className="text-slate-400">Loading...</p>;
    if (error) return <p className="text-slate-400">Oh no... {error.message}</p>;

    if (!data || !data.reports) return <p className="text-slate-400">No reports</p>;

    return (
        <div>
            <Table>
                <Thead>
                    <Tr>
                        {/* <Th>Input Index</Th>
                        <Th>Notice Index</Th> */}
                        {/* <th>Input Payload</th> */}
                        <Th className="text-slate-200">Reports <Button size='xs' onClick={() => reexecuteQuery({ requestPolicy: 'network-only' })}>
                             🔃 </Button>
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {reports.length === 0 && (
                        <Tr>
                            <Td colSpan={4}>-</Td>
                        </Tr>
                    )}
                    {reports.map((n: any) => (
                        <Tr key={`${n.input.index}-${n.index}`}>
                            {/* <Td>{n.input.index}</Td>
                            <Td>{n.index}</Td> */}
                            {/* <td>{n.input.payload}</td> */}
                            <Td color={'grey'}>{n.payload}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>

        </div>
    );
};
