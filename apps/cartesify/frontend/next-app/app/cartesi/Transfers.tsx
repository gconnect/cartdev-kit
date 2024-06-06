"use client"
import React, { useState } from "react";
import { Tabs, TabList, TabPanels, TabPanel, Tab, Card, CardBody, Checkbox } from "@chakra-ui/react";
import { Button, Box } from "@chakra-ui/react";
import { Input, Stack } from "@chakra-ui/react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { useEthersSigner } from "../utils/useEtherSigner";
import { useAccount } from "wagmi";
import VoucherView from "./VoucherView";
import { DAPP_ADDRESS } from "../utils/constants";
import { Epoch } from "./Epoch";
import { RestExample } from "./RestExample";
import { fetch } from '../utils/cartersify-init'
import { depositEther } from "./services/Portal";
import { getEtherBalance, transferEther, withdrawEther } from "./services/RestApiCalls";

interface IInputProps {
  dappAddress: string;
}

const Transfers: React.FC<IInputProps> = (props) => {
  const signer = useEthersSigner()
  const provider = signer?.provider
  const [dappRelayedAddress, setDappRelayedAddress] = useState<boolean>(false)
  const [erc20Amount, setErc20Amount] = useState<number>(0);
  const [erc20Token, setErc20Token] = useState<string>("");
  const [erc721Id, setErc721Id] = useState<number>(0);
  const [erc721, setErc721] = useState<string>("");
  const [etherAmount, setEtherAmount] = useState<number>(0);

  const [erc1155, setErc1155] = useState<string>("");
  const [erc1155Id, setErc1155Id] = useState<number>(0);
  const [erc1155Amount, setErc1155Amount] = useState<number>(0);
  const [erc1155Ids, setErc1155Ids] = useState<number[]>([]);
  const [erc1155Amounts, setErc1155Amounts] = useState<number[]>([]);
  const [erc1155IdsStr, setErc1155IdsStr] = useState<string>("[]");
  const [erc1155AmountsStr, setErc1155AmountsStr] = useState<string>("[]");

  const [loadEther, setLoadEther] = useState(false)
  const [loadEtherBalance, setEtherBalance] = useState(false)
  const [l2LoadEther, setL2LoadEther] = useState(false)
  const [loadERC20, setLoadERC20] = useState(false)
  const [loadWithdrawEther, setLoadWithdrawEther] = useState(false)
  const [loadWithdrawERC20, setLoadWithdrawERC20] = useState(false)
  const [loadTransferNFT, setLoadTransferNFT] = useState(false)
  const [loadWithdrawERC721, setLoadWithdrawERC721] = useState(false)
  const [loadERC1155, setLoadERC1155] = useState(false)
  const [loadERC1155Batch, setLoadERC1155Batch] = useState(false)
  const [isChecked, setIsChecked] = useState(false)

  const [etherBalanceL1, setEtherBalanceL1] = useState<number>(0)
  const [etherBalanceL2, setEtherBalanceL2] = useState<number>(0)

  const [response, setResponse] = useState('')
    // const [erc20address, setErc20Address] = useState(localStorage.getItem('erc20address') ?? '0xc6e7DF5E7b4f2A278906862b61205850344D4e7d')
    const [toAddress, setToAddress] = useState('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
    const [erc20value, setErc20value] = useState('0')
    const [erc20balanceL1, setErc20balanceL1] = useState('0')
    const [erc20balanceL2, setErc20balanceL2] = useState('0')

    const [etherValue, setEtherValue] = useState('0')
    const [erc721balanceL1, setErc721balanceL1] = useState('0')
    const [erc721balanceL2, setErc721balanceL2] = useState('0')
    // const [erc721address, setErc721Address] = useState(localStorage.getItem('erc721address') ?? '0x3Aa5ebB10DC797CAC828524e59A333d0A371443c')
    const { address, chain } = useAccount()
    
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked)
  }
  const addTo1155Batch = () => {
    const newIds = erc1155Ids;
    newIds.push(erc1155Id);
    setErc1155Ids(newIds);
    const newAmounts = erc1155Amounts;
    newAmounts.push(erc1155Amount);
    setErc1155Amounts(newAmounts);
    setErc1155IdsStr("["+erc1155Ids.join(',')+"]");
    setErc1155AmountsStr("["+erc1155Amounts.join(',')+"]");
};

const clear1155Batch = () => {
    setErc1155IdsStr("[]");
    setErc1155AmountsStr("[]");
    setErc1155Ids([]);
    setErc1155Amounts([]);
};

  return (
    <Box borderWidth='0.1px' padding='4' borderRadius='lg' overflow='hidden'>
    <Tabs variant="enclosed" size="lg" align="center">
      <TabList >
      <Tab sx={{
            "&:not([aria-selected=true])": {
              color: "gray.500", // Setting the color for inactive tabs
            },
          }}> 🚀 REST Example</Tab>
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
          }}>🔔 Epoch</Tab>
      </TabList>
      <Box p={4} display="flex">
        <TabPanels>
          <TabPanel>
              <RestExample/>
              <br/>
          </TabPanel>
          <TabPanel>
            <Text fontSize="sm" color="slategray">
              Cartesi dApps recieve asset deposits via Portal smart contracts on
              the base layer.
            </Text>
            <br/>
            <Accordion size="xl" border="#09324C" borderWidth="0.1px" defaultIndex={[0]}>
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
                      borderWidth="0.1px"
                      borderColor="slategrey"
                      type="text"
                      color="slategrey"
                      variant="outline"
                      placeholder="Address required for L2 transfer"
                      onChange={(e) => setErc20Token(String(e.target.value))}
                      value={erc20Token}
                    />
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
                      onClick={async () => {
                        setLoadEther(true)
                        await depositEther(etherAmount.toString(), signer, chain!)
                        setLoadEther(false)
                      }}
                    > {loadEther ? "Depositing please wait..🤑" :"Deposit"}
                    </Button>
                    <Button
                      size="sm"
                      onClick={ async () => {
                        setLoadWithdrawEther(true)
                        await withdrawEther(signer, etherAmount)
                        setLoadWithdrawEther(false)
                      }}
                    >
                     { loadWithdrawEther ? "Withdrawing please wait..🤑" : "Voucher Withdraw" }
                    </Button>
                    <Button
                    className="bg-custom-orange"
                      colorScheme=""
                      size="sm"
                      onClick={async () => {
                        setL2LoadEther(true)
                        await transferEther(signer, toAddress, etherAmount)
                        setL2LoadEther(false)
                      }}
                    > {l2LoadEther ? "Transferring please wait..🤑" :"L2 Transfer"}
                    </Button>
                    <Button
                      className="bg-light-purple"
                      colorScheme=""
                      size="sm"
                      onClick={ async () => {
                        setEtherBalance(true)
                        await getEtherBalance(signer, setEtherBalanceL1, setEtherBalanceL2)
                        setEtherBalance(false)
                      }}
                    > {loadEtherBalance ? "Transferring please wait..🤑" :"Get Balance"}
                    </Button>
                    <div className="mt-2 text-slate-400">
                     <p>L1 Balance: {etherBalanceL1}</p>
                     <p>L2 Balance: {etherBalanceL2}</p> 
                    </div>
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
                    // onClick={}
                    >
                   {loadERC20 ? "Depositing please wait..🤑" : "Deposit"}
                    </Button>
                    <Button
                    size="sm"
                    onClick={() => {
                    }}
                    >
                    {loadWithdrawERC20 ? "Withdrawing please wait..🤑" : "Voucher Withdraw"}
                    </Button>
                       <Button
                    className="bg-custom-orange"
                      colorScheme=""
                      size="sm"
                      onClick={() => {}}
                    > {loadEther ? "Transferring please wait..🤑" :"L2 Transfer"}
                    </Button>
                    <Button
                      className="bg-light-purple"
                      colorScheme=""
                      size="sm"
                      onClick={() => {}}
                    > {loadEther ? "Transferring please wait..🤑" :"Get Balance"}
                    </Button>
                    <div className="mt-2 text-slate-400">
                     <p>L1 Balance: {etherBalanceL1}</p>
                     <p>L2 Balance: {etherBalanceL2}</p> 
                    </div>
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
                    >
                      { loadTransferNFT ? "Depositing NFT please wait..🤑" : "Deposit"}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                      }}
                    >
                     { loadWithdrawERC721 ? "Withdrawing NFT Please wait..🤑" : "Withdraw"}
                    </Button>
                    <Button
                    className="bg-custom-orange"
                      colorScheme=""
                      size="sm"
                      onClick={() => {}}
                    > {loadEther ? "Transferring please wait..🤑" :"L2 Transfer"}
                    </Button>
                    <Button
                      className="bg-light-purple"
                      colorScheme=""
                      size="sm"
                      onClick={() => {}}
                    > {loadEther ? "Transferring please wait..🤑" :"Get Balance"}
                    </Button>
                    <div className="mt-2 text-slate-400">
                     <p>L1 Balance: {etherBalanceL1}</p>
                     <p>L2 Balance: {etherBalanceL2}</p> 
                    </div>
                    <br />
                    <br />
                  </Stack>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <div className="flex justify-between">
                <h2>
                  <AccordionButton textColor="white">
                    ERC1155 & ERC1155Batch
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <div className="m-2 text-slate-400">
                <input type="checkbox" onChange={ handleCheckboxChange}/> Set Batch
                </div>
                </div>
                <AccordionPanel>
                  <Stack>
                    <Input
                      type="text"
                      borderWidth="0.1px"
                      borderColor="slategrey"
                      color="slategrey"
                      variant="outline"
                      placeholder="Address"
                      onChange={(e) => setErc1155(String(e.target.value))}
                      value={erc1155}
                    />
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
                      type="number"
                      borderWidth="0.1px"
                      borderColor="slategrey"
                      color="slategrey"
                      variant="outline"
                      placeholder="ID"
                      onChange={(e) => setErc1155Id(Number(e.target.value))}
                      value={erc1155Id}
                    />
                    <Input
                      type="text"
                      borderWidth="0.1px"
                      borderColor="slategrey"
                      color="slategrey"
                      variant="outline"
                      placeholder="Amount"
                      // onChange={(e) => }
                      value={erc1155Amount}
                    />
                    { !isChecked ? 
                    <Button
                      colorScheme="blue"
                      size="sm"
                      disabled={!address}
                    > 
                      { loadERC1155 ? "Transferring please wait..🤑" : "Deposit"}
                    </Button> :

                    <div className="flex flex-col">
                       <Button
                    className="bg-custom-orange"
                      colorScheme=""
                      size="sm"
                      onClick={() => {}}
                    > {loadEther ? "Transferring please wait..🤑" :"L2 Transfer"}
                    </Button>
                    <Button
                      className="bg-light-purple mt-2"
                      colorScheme=""
                      size="sm"
                      onClick={() => {}}
                    > {loadEther ? "Transferring please wait..🤑" :"Get Balance"}
                    </Button>
                    <div className="mt-2 text-slate-400">
                     <p>L1 Balance: {etherBalanceL1}</p>
                     <p>L2 Balance: {etherBalanceL2}</p> 
                    </div>
                    <span className="text-slate-400">Ids: {erc1155IdsStr} - Amounts: {erc1155AmountsStr}  </span>
                    <Button className="mt-2"  disabled={!address}>
                        Clear Batch
                    </Button>
                    <Button
                      className="my-2 bg-light-purple"
                      colorScheme=""
                      size="sm"
                      disabled={!address}
                    >
                      Add to Batch
                    </Button>

                    <Button
                      colorScheme="blue"
                      size="sm"
                      disabled={!address}
                    >
                      { loadERC1155Batch ? "Transferring please wait..🤑" : "Batch Transfer"}
                    </Button>
                    </div> }
                  </Stack>
                </AccordionPanel>
              </AccordionItem>

            </Accordion>
          </TabPanel>

          <TabPanel>
            <Accordion defaultIndex={[0]} allowMultiple>
            <VoucherView />
            </Accordion>
          </TabPanel>
          <TabPanel>
            <Epoch/>
            <br/>
          </TabPanel>
        </TabPanels>
      </Box>
    </Tabs>
  </Box>
  );
};

export default Transfers