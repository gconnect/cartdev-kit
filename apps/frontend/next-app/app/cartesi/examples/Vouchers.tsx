"use client"

import { ethers, toBigInt } from "ethers";
import React, { useCallback, useEffect, useState } from "react";
import { useRollups } from "../hooks/useRollups";
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    Text
  } from '@chakra-ui/react'
import { useEthersSigner } from "../../utils/useEtherSigner";
import { Voucher, useVouchers } from "../hooks/useVouchers";
import { errorAlert, successAlert } from "../../utils/customAlert";
import {  executeVoucher } from "../Portals";


interface IVoucherProps {
    dappAddress: string 
}

export const Vouchers: React.FC<IVoucherProps> = (props) => {
    const {loading, error, data, vouchers, refetch } = useVouchers()
    const [voucherToExecute, setVoucherToExecute] = useState<any>();
    const rollups = useRollups(props.dappAddress);
    
    const getProof = async (voucher: Voucher) => {
        setVoucher(voucher)
        refetch({ requestPolicy: 'network-only' });
    };

    const setVoucher = useCallback(async (voucher: any) => {
        if (rollups) {
            voucher.executed = await rollups.dappContract.wasVoucherExecuted(toBigInt(voucher.input.index),toBigInt(voucher.index));
        }
        setVoucherToExecute(voucher);
        console.log(voucherToExecute)
        console.log(voucherToExecute.executed)

    },[rollups, voucherToExecute])


    if (loading) return <p className="text-slate-400">Loading...</p>;
    if (error) return <p className="text-slate-400">Oh no... {error.message}</p>;

    if (!data || !data.vouchers) return <p className="text-slate-400">No vouchers</p>;

    return (
        <div className="text-slate-200">
            <p></p>
        <Button marginTop={'15px'} float={'right'} size='sm' onClick={() => refetch({ requestPolicy: 'network-only' })}>
            Reload 🔃
        </Button>
        {voucherToExecute ? 
        <Table>
            <Thead>
                <Tr>
                     <Th>Input Index</Th>
                    <Th>Action</Th> 
                    <Th>Voucher Index</Th>
                    {/*<Th>Destination</Th> */}
                    {/* <Th>Payload</Th> */}
                    {/* <th>Proof</th> */}
                    {/* <Th>Input Payload</Th> */} 
                    {/* <Th>Msg</Th> */}
                </Tr>
            </Thead>
            <Tbody>
                <Tr key={`${voucherToExecute && voucherToExecute.input.index}-${voucherToExecute && voucherToExecute.index}`}>
                     <Td>{voucherToExecute && voucherToExecute.input.index}</Td>
                    {/*<Td>{voucherToExecute.destination}</Td> */}
                    <Td>
                        <Button size='sm' colorScheme={"green"}
                         isDisabled={voucherToExecute.executed}
                         onClick={() => executeVoucher(voucherToExecute, rollups!)}>{voucherToExecute && voucherToExecute.proof &&
                         voucherToExecute.executed ? "Voucher executed" : "Voucher Executed"}
                        </Button>
                    </Td>
                    <Td>{voucherToExecute && voucherToExecute.index}</Td> 
                    {/* <td>{voucherToExecute.payload}</td> */}
                    {/* <td>{voucherToExecute.proof}</td> */}
                    {/* <Td>{voucherToExecute.input.payload}</Td> */} 
                    {/* <Td>{voucherToExecute.msg}</Td> */}
                    <br /> <br />
                </Tr>
            </Tbody>
        </Table> : <Text></Text>}
            <Table marginTop={'20px'}>
                <Thead>
                    <Tr>
                        {/*<Th>Input Index</Th>
                        <Th>Voucher Index</Th>
                        <Th>Destination</Th> */}
                        <Th>Action</Th>
                        {/* <th>Input Payload</th> */}
                        <Th>Payload</Th>
                        {/* <th>Proof</th> */}
                    </Tr>
                </Thead>
                <Tbody>
                    {vouchers && vouchers.length === 0 && (
                        <Tr>
                            <Td textAlign={'center'} colSpan={4}>-</Td>
                        </Tr>
                    )}
                    {vouchers &&  vouchers.map((n: any) => (
                        <Tr key={`${n.input.index}-${n.index}`}>
                            {/*<Td>{n.input.index}</Td>
                            <Td>{n.index}</Td>
                            <Td>{n.destination}</Td> */}
                            <Td>
                                <Button size='sm' onClick={() => getProof(n)}>Get Proof</Button>
                            </Td>
                            {/* <td>{n.input.payload}</td> */}
                            <Td color={'slategray'}>{n.payload}</Td>
                            {/* <td>
                                <button disabled={!!n.proof} onClick={() => executeVoucher(n)}>Execute voucher</button>
                            </td> */}
                        </Tr>
                    ))}
                </Tbody>
            </Table>

        </div>
    );
};
