"use client"
import Image from "next/image";
import React, { useState } from "react";
import { ethers } from "ethers";
import { useRollups } from "./useRollups";
import { useWallets } from "@web3-onboard/react";
import { IERC1155__factory, IERC20__factory, IERC721__factory } from "../src/generated/rollups";
import { Notices } from "./Notices";

interface IInputPropos {
  dappAddress: string 
}

export const Home: React.FC<IInputPropos> = (propos) => {
  const rollups = useRollups("0x59b22D57D4f067708AB0c00552767405926dc768");
  const [connectedWallet] = useWallets();
  const [hexInput, setHexInput] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  // const provider = new ethers.providers.Web3Provider(
  //     connectedWallet.provider
  // );
  const addInput = async (str: string) => {
    if (rollups) {
        try {
            let payload = ethers.utils.toUtf8Bytes(str);
            if (hexInput) {
                payload = ethers.utils.arrayify(str);
            }
            await rollups.inputContract.addInput("0x59b22D57D4f067708AB0c00552767405926dc768", payload);
        } catch (e) {
            console.log(`${e}`);
        }
    }
};

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        Send Input <br />
                Input: <input className="text-black"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
        <button onClick={() => addInput(input)} disabled={!rollups}>
                    Send
                </button>
       <div>
        Notice
        {/* <Notices/> */}
       </div>
      </div>
    </main>
  );
}

export default Home