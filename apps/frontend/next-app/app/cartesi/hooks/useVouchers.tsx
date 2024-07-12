"use client"
import { useQuery } from '@apollo/client'
import { ethers } from 'ethers'
import { useState } from 'react'
import { VouchersDocument } from '../generated/graphql'

export type Voucher = {
  fetching: any
  data: boolean
  id: string;
  index: number;
  destination: string;
  input: any, //{index: number; epoch: {index: number; }
  payload: string;
  proof: any;
  executed: any;
};

export const useVouchers = () => {
  const [cursor] = useState(null)
  const { loading, error, data, refetch } = useQuery(VouchersDocument, {
    variables: { cursor },
    pollInterval: 0,
  })

  const vouchers: Voucher[] = data && data.vouchers.edges.map((node: any) => {
    const n = node.node;
    let payload = n?.payload;
    let inputPayload = n?.input.payload;
    if (inputPayload) {
        try {
            inputPayload = ethers.toUtf8String(inputPayload);
        } catch (e) {
            inputPayload = inputPayload + " (hex)";
        }
    } else {
        inputPayload = "(empty)";
    }
    if (payload) {
        const decoder = new ethers.AbiCoder();
        const selector = decoder.decode(["bytes4"], payload)[0]; 
        payload = ethers.dataSlice(payload,4);
        try {
            switch(selector) { 
                case '0xa9059cbb': { 
                    // erc20 transfer; 
                    const decode = decoder.decode(["address","uint256"], payload);
                    payload = `Erc20 Transfer - Amount: ${ethers.formatEther(decode[1])} - Address: ${decode[0]}`;
                    break; 
                }
                case '0x42842e0e': { 
                    //erc721 safe transfer;
                    const decode = decoder.decode(["address","address","uint256"], payload);
                    payload = `Erc721 Transfer - Id: ${decode[2]} - Address: ${decode[1]}`;
                    break; 
                }
                case '0x522f6815': { 
                    //ether transfer; 
                    const decode2 = decoder.decode(["address", "uint256"], payload)
                    payload = `Ether Transfer - Amount: ${ethers.formatEther(decode2[1])} (Native eth) - Address: ${decode2[0]}`;
                    break; 
                }
                case '0xf242432a': { 
                    //erc155 single safe transfer;
                    const decode = decoder.decode(["address","address","uint256","uint256"], payload);
                    payload = `Erc1155 Single Transfer - Id: ${decode[2]} Amount: ${decode[3]} - Address: ${decode[1]}`;
                    break; 
                }
                case '0x2eb2c2d6': { 
                    //erc155 Batch safe transfer;
                    const decode = decoder.decode(["address","address","uint256[]","uint256[]"], payload);
                    payload = `Erc1155 Batch Transfer - Ids: ${decode[2]} Amounts: ${decode[3]} - Address: ${decode[1]}`;
                    break; 
                }
                case '0xd0def521': { 
                    //erc721 mint;
                    const decode = decoder.decode(["address","string"], payload);
                    payload = `Mint Erc721 - String: ${decode[1]} - Address: ${decode[0]}`;
                    break; 
                }
                case '0x755edd17': { 
                    //erc721 mintTo;
                    const decode = decoder.decode(["address"], payload);
                    payload = `Mint Erc721 - Address: ${decode[0]}`;
                    break; 
                }
                case '0x6a627842': { 
                    //erc721 mint;
                    const decode = decoder.decode(["address"], payload);
                    payload = `Mint Erc721 - Address: ${decode[0]}`;
                    break; 
                }
                default: {
                    break; 
                }
            }
        } catch (e) {
            console.log(e);
        }
    } else {
        payload = "(empty)";
    }
    return {
        id: `${n?.id}`,
        index: parseInt(n?.index),
        destination: `${n?.destination ?? ""}`,
        payload: `${payload}`,
        input: n ? {index:n.input.index,payload: inputPayload} : {},
        proof: null,
        executed: null,
    };
}).sort((b: any, a: any) => {
    if (a.input.index === b.input.index) {
        return b.index - a.index;
    } else {
        return b.input.index - a.input.index;
    }
});
  return { loading, error, data, vouchers, refetch }
}
