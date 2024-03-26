// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import React, { useState } from "react";
import { useSetChain } from "@web3-onboard/react";
import { ethers } from "ethers";
// import { useRollups } from "./useRollups";

import configFile from "./config.json";
import { parseEther } from "ethers/lib/utils";
//import "./App.css"
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
    Button,
    Stack,
    Box,
    Spacer
  } from '@chakra-ui/react'

const config: any = configFile;
interface Report {
    payload: string;
}

export const Balance: React.FC = () => {
    // const rollups = useRollups();
    const [{ connectedChain }] = useSetChain();
    const inspectCall = async (str: string) => {
        let payload = str;
        if (hexData) {
            const uint8array = ethers.utils.arrayify(payload);
            payload = new TextDecoder().decode(uint8array);
        }
        if (!connectedChain){
            return;
        }
        
        let apiURL= ""

        if(config[connectedChain.id]?.inspectAPIURL) {
            apiURL = `${config[connectedChain.id].inspectAPIURL}/inspect`;
        } else {
            console.error(`No inspect interface defined for chain ${connectedChain.id}`);
            return;
        }
        
        let fetchData: Promise<Response>;
        if (postData) {
            const payloadBlob = new TextEncoder().encode(payload);
            fetchData = fetch(`${apiURL}`, { method: 'POST', body: payloadBlob });
        } else {
            fetchData = fetch(`${apiURL}/${payload}`);
        }
        fetchData
            .then(response => response.json())
            .then(data => {
                setReports(data.reports);
                setMetadata({status: data.status, exception_payload: data.exception_payload});
                console.log("Metadata:", data.reports);

                // Decode payload from each report
                const decode = data.reports.map((report: Report) => {
                return ethers.utils.toUtf8String(report.payload);
                });
                console.log("Decoded Reports:", decode);
                const reportData = JSON.parse(decode)
                console.log("Report data: ", reportData)
                setDecodedReports(reportData)
                console.log("Erc20 : ", decodedReports.erc20)
                //console.log(parseEther("1000000000000000000", "gwei"))
            });
    };
    const [inspectData, setInspectData] = useState<string>("");
    const [reports, setReports] = useState<string[]>([]);
    const [decodedReports, setDecodedReports] = useState<any>({});
    const [metadata, setMetadata] = useState<any>({});
    const [hexData, setHexData] = useState<boolean>(false);
    const [postData, setPostData] = useState<boolean>(false);

    return (
        <Box borderWidth='1px' borderRadius='lg' overflow='hidden'>
        <TableContainer>
            <Stack>
            <Table variant='striped' size="lg">
                <Thead>
                    <Tr>
                        <Th textAlign={'center'}>Ether</Th>
                        <Th textAlign={'center'}>ERC-20</Th>
                        <Th textAlign={'center'}>ERC-721</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {reports?.length === 0 && (
                        <Tr>
                            <Td colSpan={4} textAlign={'center'} fontSize='14' color='grey' >looks like your cartesi dapp balance is zero! 🙁</Td>
                        </Tr>
                    )}
                
                    {<Tr key={`${decodedReports}`}>
                        {decodedReports && decodedReports.ether && (
                        <Td textAlign={'center'}>{ethers.utils.formatEther(decodedReports.ether)}</Td> )}
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
            <Button onClick={() => inspectCall("balance/0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")}>Get Balance</Button>
            </Stack>
        </TableContainer>
        </Box>
    );
};
