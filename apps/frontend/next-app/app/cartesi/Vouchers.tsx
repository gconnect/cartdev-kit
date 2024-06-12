"use client"

import { ethers, toBigInt } from "ethers";
import React, { useEffect } from "react";
import { useRollups } from "./hooks/useRollups";
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
  import { useEthersSigner } from "../utils/useEtherSigner";
import { Voucher, useVouchers } from "./hooks/useVouchers";
import { executeVoucher } from "./Portals";
interface IVoucherProps {
    dappAddress: string 
}

export const Vouchers: React.FC<IVoucherProps> = (props) => {
    const {loading, error, data, vouchers, voucherResult, refetch } = useVouchers()

    const [voucherToFetch, setVoucherToFetch] = React.useState([0,0]);

    const [voucherToExecute, setVoucherToExecute] = React.useState<any>();
    const rollups = useRollups(props.dappAddress);
    
    const getProof = async (voucher: Voucher) => {
        setVoucherToFetch([voucher.index, voucher.input.index]);
        refetch({ requestPolicy: 'network-only' });
    };

    useEffect( () => {
        const setVoucher = async (voucher: Voucher) => {
            if (rollups) {
                voucher.executed = await rollups.dappContract.wasVoucherExecuted(toBigInt(voucher.input.index),toBigInt(voucher.index));
            }
            console.log( voucher.executed)
            setVoucherToExecute(voucher);
        }
    
        if (!voucherResult?.executed && voucherResult){
            setVoucher(voucherResult);
        }
    },[voucherResult, voucherToFetch, rollups]);
    

    if (loading) return <p className="text-slate-400">Loading...</p>;
    if (error) return <p className="text-slate-400">Oh no... {error.message}</p>;

    if (!data || !data.vouchers) return <p className="text-slate-400">No vouchers</p>;

    return (
        <div className="text-slate-400">
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
                        <Button size='sm' isDisabled={voucherToExecute && !voucherToExecute.proof || voucherToExecute && voucherToExecute.executed}
                         onClick={() => executeVoucher(rollups, setVoucherToExecute, voucherToExecute)}>{voucherToExecute && voucherToExecute.proof ? 
                         (voucherToExecute.executed ? "Voucher executed" : "Execute voucher") : "No proof yet"}
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
                                <Button size='sm' onClick={() => getProof(n)}>Info</Button>
                            </Td>
                            {/* <td>{n.input.payload}</td> */}
                            <Td color={'grey'}>{n.payload}</Td>
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
