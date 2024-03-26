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
import { ethers } from "ethers";
import { useRollups } from "../cartesi/useRollups";
import { useWallets } from "@web3-onboard/react";
import {
  IERC1155__factory,
  IERC20__factory,
  IERC721__factory,
} from "../cartesi/generated/rollups";
import { Tabs, TabList, TabPanels, TabPanel, Tab } from "@chakra-ui/react";
import { Divider } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { Button, ButtonGroup, Box } from "@chakra-ui/react";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
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

interface IInputPropos {
  dappAddress: string;
}

export const Transfers: React.FC<IInputPropos> = (propos) => {
  const rollups = useRollups(propos.dappAddress);
  const [connectedWallet] = useWallets();
  const provider = new ethers.providers.Web3Provider(connectedWallet.provider);
  const toast = useToast();

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
        const data = ethers.utils.toUtf8Bytes(
          `Deposited (${amount}) of ERC20 (${token}).`
        );
        //const data = `Deposited ${args.amount} tokens (${args.token}) for DAppERC20Portal(${portalAddress}) (signer: ${address})`;
        const signer = provider.getSigner();
        const signerAddress = await signer.getAddress();

        const erc20PortalAddress = rollups.erc20PortalContract.address;
        const tokenContract = signer
          ? IERC20__factory.connect(token, signer)
          : IERC20__factory.connect(token, provider);

        // query current allowance
        const currentAllowance = await tokenContract.allowance(
          signerAddress,
          erc20PortalAddress
        );
        if (ethers.utils.parseEther(`${amount}`) > currentAllowance) {
          // Allow portal to withdraw `amount` tokens from signer
          const tx = await tokenContract.approve(
            erc20PortalAddress,
            ethers.utils.parseEther(`${amount}`)
          );
          const receipt = await tx.wait(1);
          const event = (
            await tokenContract.queryFilter(
              tokenContract.filters.Approval(),
              receipt.blockHash
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
          ethers.utils.parseEther(`${amount}`),
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
        const data = ethers.utils.toUtf8Bytes(`Deposited (${amount}) ether.`);
        const txOverrides = { value: ethers.utils.parseEther(`${amount}`) };
        console.log("Ether to deposit: ", txOverrides);

        // const tx = await ...
        rollups.etherPortalContract.depositEther(
          propos.dappAddress,
          data,
          txOverrides
        );
      }
    } catch (e) {
      console.log(`${e}`);
    }
  };

  const withdrawEther = async (amount: number) => {
    try {
      if (rollups && provider) {
        let ether_amount = ethers.utils.parseEther(String(amount)).toString();
        console.log("ether after parsing: ", ether_amount);
        const input_obj = {
          method: "ether_withdraw",
          args: {
            amount: ether_amount,
          },
        };
        const data = JSON.stringify(input_obj);
        let payload = ethers.utils.toUtf8Bytes(data);
        await rollups.inputContract.addInput(propos.dappAddress, payload);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const withdrawErc20 = async (amount: number, address: String) => {
    try {
      if (rollups && provider) {
        let erc20_amount = ethers.utils.parseEther(String(amount)).toString();
        console.log("erc20 after parsing: ", erc20_amount);
        const input_obj = {
          method: "erc20_withdraw",
          args: {
            erc20: address,
            amount: erc20_amount,
          },
        };
        const data = JSON.stringify(input_obj);
        let payload = ethers.utils.toUtf8Bytes(data);
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
        let payload = ethers.utils.toUtf8Bytes(data);
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
        const data = ethers.utils.toUtf8Bytes(
          `Deposited (${nftid}) of ERC721 (${contractAddress}).`
        );
        //const data = `Deposited ${args.amount} tokens (${args.token}) for DAppERC20Portal(${portalAddress}) (signer: ${address})`;
        const signer = provider.getSigner();
        const signerAddress = await signer.getAddress();

        const erc721PortalAddress = rollups.erc721PortalContract.address;

        const tokenContract = signer
          ? IERC721__factory.connect(contractAddress, signer)
          : IERC721__factory.connect(contractAddress, provider);

        // query current approval
        const currentApproval = await tokenContract.getApproved(nftid);
        if (currentApproval !== erc721PortalAddress) {
          // Allow portal to withdraw `amount` tokens from signer
          const tx = await tokenContract.approve(erc721PortalAddress, nftid);
          const receipt = await tx.wait(1);
          const event = (
            await tokenContract.queryFilter(
              tokenContract.filters.Approval(),
              receipt.blockHash
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

  const [input, setInput] = useState<string>("");
  const [dappRelayedAddress, setDappRelayedAddress] = useState<boolean>(false)
  const [hexInput, setHexInput] = useState<boolean>(false);
  const [erc20Amount, setErc20Amount] = useState<number>(0);
  const [erc20Token, setErc20Token] = useState<string>("");
  const [erc721Id, setErc721Id] = useState<number>(0);
  const [erc721, setErc721] = useState<string>("");
  const [etherAmount, setEtherAmount] = useState<number>(0);

  return (
    <Tabs variant="enclosed" size="lg" align="center">
      <TabList>
        <Tab>🚀 Transfer</Tab>
        <Tab>🎟️ Vouchers</Tab>
        <Tab>🔔 Activity</Tab>
      </TabList>
      <Box p={4} display="flex">
        <TabPanels>
          <TabPanel>
            <Text fontSize="sm" color="grey">
              Cartesi dApps recieve asset deposits via Portal smart contracts on
              the base layer.
            </Text>
            <br />
            <Accordion size="xl" defaultIndex={[0]} allowMultiple>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    Ether
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel>
                  <Stack>
                    <NumberInput
                      defaultValue={0}
                      min={0}
                      onChange={(value) => setEtherAmount(Number(value))}
                      value={etherAmount}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => {
                        depositEtherToPortal(etherAmount);
                      }}
                      disabled={!rollups}
                    >
                      Deposit
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
                  <AccordionButton>
                    ERC20
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel>
                  <Stack>
                    <Input
                      type="text"
                      variant="outline"
                      placeholder="Address"
                      onChange={(e) => setErc20Token(String(e.target.value))}
                      value={erc20Token}
                    />
                    <Input
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
                  <AccordionButton>
                    ERC721
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel>
                  <Stack>
                    <Input
                      type="text"
                      variant="outline"
                      placeholder="Address"
                      onChange={(e) => setErc721(String(e.target.value))}
                      value={erc721}
                    />
                    <Input
                      type="number"
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
            <Text fontSize="sm" color="grey">
              After the withdraw request, the user has to execute a voucher to transfer assets from Cartesi dApp to their account. 
            </Text>
            <br />
            {!dappRelayedAddress && 
              <div>
                Let the dApp know its address! <br />
                <Button
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
            <Reports />
          </TabPanel>
        </TabPanels>
      </Box>
    </Tabs>
    //</div>
  );
};
