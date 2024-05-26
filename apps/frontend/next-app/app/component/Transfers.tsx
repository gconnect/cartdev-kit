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

import React, { useState } from "react";
import { ethers, parseEther, Provider } from "ethers";
import { useRollups } from "../cartesi/useRollups";
import {
  IERC1155__factory,
  IERC20__factory,
  IERC721__factory,
} from "../cartesi/generated/rollups";
import { Tabs, TabList, TabPanels, TabPanel, Tab, Card, CardBody } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { Button, Box } from "@chakra-ui/react";
import { Input, Stack, Flex } from "@chakra-ui/react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { Vouchers } from "./../cartesi/Vouchers";
import { Notices } from "./../cartesi/Notices";
import { Reports } from "./../cartesi/Reports";
import { useEthersSigner } from "../utils/useEtherSigner";
import toast from "react-hot-toast";
interface IInputPropos {
  dappAddress: string;
}

export const Transfers: React.FC<IInputPropos> = (propos) => {
  const rollups = useRollups(propos.dappAddress);
  const signer = useEthersSigner()
  const provider = signer?.provider

  const [input, setInput] = useState<string>("");
  const [dappRelayedAddress, setDappRelayedAddress] = useState<boolean>(false)
  const [erc20Amount, setErc20Amount] = useState<number>(0);
  const [erc20Token, setErc20Token] = useState<string>("");
  const [erc721Id, setErc721Id] = useState<number>(0);
  const [erc721, setErc721] = useState<string>("");
  const [etherAmount, setEtherAmount] = useState<number>(0);
  const [loadEther, setLoadEther] = useState(false)

  const sendAddress = async (str: string) => {
    if (rollups) {
      try {
        await rollups.relayContract.relayDAppAddress(propos.dappAddress);
        setDappRelayedAddress(true);
      } catch (e) {
        console.log(`${e}`);
      }
    }
  };

  const depositErc20ToPortal = async (token: string, amount: number) => {
    try {
      if (rollups && provider) {
        const data = ethers.toUtf8Bytes(
          `Deposited (${amount}) of ERC20 (${token}).`
        );
        //const data = `Deposited ${args.amount} tokens (${args.token}) for DAppERC20Portal(${portalAddress}) (signer: ${address})`;
        // const signer = provider.getSigner();
        const signerAddress = await signer.getAddress();

        const erc20PortalAddress = rollups.erc20PortalContract.address;
        const tokenContract = signer
          ? IERC20__factory.connect(token, signer)
          : IERC20__factory.connect(token, signer);

        // query current allowance
        const currentAllowance = await tokenContract.allowance(
          signerAddress,
          erc20PortalAddress
        );
        if (parseEther(`${amount}`) > currentAllowance) {
          // Allow portal to withdraw `amount` tokens from signer
          const tx = await tokenContract.approve(
            erc20PortalAddress,
            parseEther(`${amount}`)
          );
          const trans = await signer.sendTransaction(tx)
          const receipt = await trans.wait();
          const event = (
            await tokenContract.queryFilter(
              tokenContract.filters.Approval(),
              receipt?.hash
            )
          ).pop();
          if (!event) {
            throw Error(
              `could not approve ${amount} tokens for DAppERC20Portal(${erc20PortalAddress})  (signer: ${signerAddress}, tx: ${tx.hash})`
            );
          }
        }

        await rollups.erc20PortalContract.depositERC20Tokens(
          token,
          propos.dappAddress,
          ethers.parseEther(`${amount}`),
          data
        );
      }
    } catch (e) {
      console.log(`${e}`);
    }
  };

  const depositEtherToPortal = async (amount: number) => {
    try {
      if (rollups && provider) {
        setLoadEther(true)
        const data = ethers.toUtf8Bytes(`Deposited (${amount}) ether.`);
        const txOverrides = { value: parseEther(`${amount}`) };
        console.log("Ether to deposit: ", txOverrides);

        // const tx = await ...
      const trans =  await rollups.etherPortalContract.depositEther(
          propos.dappAddress,
          data,
          txOverrides
        );
        const tx = await signer.sendTransaction(trans)
        setLoadEther(false)
        console.log(tx.hash)
        toast(tx.hash, {
          position: 'bottom-right',
        })
        return tx.hash
      }
    } catch (e: any) {
      setLoadEther(false)
      console.log(`${e}`);
      toast.error(e.message, {
        position: 'bottom-right',
        style: {
          paddingRight: '40px',
        },
      })
    }
  };

  const withdrawEther = async (amount: number) => {
    try {
      if (rollups && provider) {
        let ether_amount = parseEther(String(amount)).toString();
        console.log("ether after parsing: ", ether_amount);
        const input_obj = {
          method: "ether_withdraw",
          args: {
            amount: ether_amount,
          },
        };
        const data = JSON.stringify(input_obj);
        let payload = ethers.toUtf8Bytes(data);
        await rollups.inputContract.addInput(propos.dappAddress, payload);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const withdrawErc20 = async (amount: number, address: String) => {
    try {
      if (rollups && provider) {
        let erc20_amount = parseEther(String(amount)).toString();
        console.log("erc20 after parsing: ", erc20_amount);
        const input_obj = {
          method: "erc20_withdraw",
          args: {
            erc20: address,
            amount: erc20_amount,
          },
        };
        const data = JSON.stringify(input_obj);
        let payload = ethers.toUtf8Bytes(data);
        await rollups.inputContract.addInput(propos.dappAddress, payload);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const withdrawErc721 = async (address: String, id: number) => {
    try {
      if (rollups && provider) {
        let erc721_id = String(id);
        console.log("erc721 after parsing: ", erc721_id);
        const input_obj = {
          method: "erc721_withdrawal",
          args: {
            erc721: address,
            token_id: id,
          },
        };
        const data = JSON.stringify(input_obj);
        let payload = ethers.toUtf8Bytes(data);
        await rollups.inputContract.addInput(propos.dappAddress, payload);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const transferNftToPortal = async (
    contractAddress: string,
    nftid: number
  ) => {
    try {
      if (rollups && provider) {
        const data = ethers.toUtf8Bytes(
          `Deposited (${nftid}) of ERC721 (${contractAddress}).`
        );
        //const data = `Deposited ${args.amount} tokens (${args.token}) for DAppERC20Portal(${portalAddress}) (signer: ${address})`;
        const signer = provider.getSigner();
        const signerAddress = await (await signer).getAddress();

        const erc721PortalAddress = rollups.erc721PortalContract.address;

        const tokenContract = signer
          ? IERC721__factory.connect(contractAddress, await signer)
          : IERC721__factory.connect(contractAddress, signer);

        // query current approval
        const currentApproval = await tokenContract.getApproved(nftid);
        if (currentApproval !== erc721PortalAddress) {
          // Allow portal to withdraw `amount` tokens from signer
          const tx = await tokenContract.approve(erc721PortalAddress, nftid);
          const trans = await (await signer).sendTransaction(tx)
          const receipt = await trans.wait(1);
          const event = (
            await tokenContract.queryFilter(
              tokenContract.filters.Approval(),
              receipt?.hash
            )
          ).pop();
          if (!event) {
            throw Error(
              `could not approve ${nftid} for DAppERC721Portal(${erc721PortalAddress})  (signer: ${signerAddress}, tx: ${tx.hash})`
            );
          }
        }

        // Transfer
        rollups.erc721PortalContract.depositERC721Token(
          contractAddress,
          propos.dappAddress,
          nftid,
          "0x",
          data
        );
      }
    } catch (e) {
      console.log(`${e}`);
    }
  };

  return (
    <Box borderWidth='0.1px' padding='4' borderRadius='lg' overflow='hidden'>
    <Tabs variant="enclosed" size="lg" align="center">
      <TabList >
        <Tab sx={{
            "&:not([aria-selected=true])": {
              color: "gray.500", // Setting the color for inactive tabs
            },
          }}> 🚀 Transfer</Tab>
        <Tab sx={{
            "&:not([aria-selected=true])": {
              color: "gray.500", // Setting the color for inactive tabs
            },
          }} >🎟️ Vouchers</Tab>
        <Tab sx={{
            "&:not([aria-selected=true])": {
              color: "gray.500", // Setting the color for inactive tabs
            },
          }}>🔔 Activity</Tab>
      </TabList>
      <Box p={4} display="flex">
        <TabPanels>
          <TabPanel>
            <Text fontSize="sm" color="slategray">
              Cartesi dApps recieve asset deposits via Portal smart contracts on
              the base layer.
            </Text>
            <br/>
            <Accordion size="xl" border="#09324C" borderWidth="0.1px" defaultIndex={[0]} allowMultiple>
              <AccordionItem>         
                <h2>
                  <AccordionButton textColor="white">
                    Ether
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
             
                <AccordionPanel>
                  <Stack>
                     <Input
                      min={0}
                      borderWidth="0.1px"
                      borderColor="slategrey"
                      color="slategrey"
                      type="number"
                      variant="outline"
                      placeholder="Enter amount"
                      onChange={(e) => setEtherAmount(Number(e.target.value))}
                      value={etherAmount}
                    />
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => {
                        depositEtherToPortal(etherAmount);
                      }}
                      disabled={!rollups}
                    > {loadEther ? "Depositing please wait..🤑" :"Deposit"}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        withdrawEther(etherAmount);
                      }}
                      disabled={!rollups}
                    >
                      Withdraw
                    </Button>
                  </Stack>
                  <br/>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton textColor="white">
                    ERC20
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel>
                  <Stack>
                    <Input
                      borderWidth="0.1px"
                      borderColor="slategrey"
                      type="text"
                      color="slategrey"
                      variant="outline"
                      placeholder="Address"
                      onChange={(e) => setErc20Token(String(e.target.value))}
                      value={erc20Token}
                    />
                    <Input
                      borderWidth="0.1px"
                      borderColor="slategrey" 
                      color="slategrey"                   
                      type="number"
                      variant="outline"
                      placeholder="Amount"
                      onChange={(e) => setErc20Amount(Number(e.target.value))}
                      value={erc20Amount}
                    />
                    <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={() =>
                        depositErc20ToPortal(erc20Token, erc20Amount)
                    }
                    disabled={!rollups}
                    >
                    Deposit
                    </Button>
                    <Button
                    size="sm"
                    onClick={() => {
                        withdrawErc20(erc20Amount, erc20Token);
                    }}
                    disabled={!rollups}
                    >
                    Withdraw
                    </Button>
                  </Stack>
                  <br/>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton textColor="white">
                    ERC721
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel>
                  <Stack>
                    <Input
                      type="text"
                      borderWidth="0.1px"
                      borderColor="slategrey"
                      color="slategrey"
                      variant="outline"
                      placeholder="Address"
                      onChange={(e) => setErc721(String(e.target.value))}
                      value={erc721}
                    />
                    <Input
                      type="number"
                      borderWidth="0.1px"
                      borderColor="slategrey"
                      color="slategrey"
                      variant="outline"
                      placeholder="ID"
                      onChange={(e) => setErc721Id(Number(e.target.value))}
                      value={erc721Id}
                    />
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => transferNftToPortal(erc721, erc721Id)}
                      disabled={!rollups}
                    >
                      Transfer
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        withdrawErc721(erc721, erc721Id);
                      }}
                      disabled={!rollups}
                    >
                      Withdraw
                    </Button>
                    <br />
                    <br />
                  </Stack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </TabPanel>

          <TabPanel>
            <Accordion defaultIndex={[0]} allowMultiple>
            <Text fontSize="sm" color="slategrey">
              After the withdraw request, the user has to execute a voucher to transfer assets from Cartesi dApp to their account. 
            </Text>
            <br />
            {!dappRelayedAddress && 
              <div className="text-slate-500">
                Let the dApp know its address! <br />
                <Button
                className="mt-4"
                  size="sm"
                  onClick={() => sendAddress(input)}
                  disabled={!rollups}
                >
                  Relay Address
                </Button>
                <br />
                <br />
              </div>
              }
              {dappRelayedAddress && <Vouchers dappAddress={propos.dappAddress} />}
            </Accordion>
          </TabPanel>
          <TabPanel>
            <Notices />
            <br />
            {/* <Reports /> */}
          </TabPanel>
        </TabPanels>
      </Box>
    </Tabs>
    </Box>
    //</div>
  );
};
