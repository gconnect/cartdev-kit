import React, { useState, useEffect } from "react";
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
import { depositBatchERC1155, depositERC20, depositERC721, depositEther, depositSingleERC1155 } from "./services/Portal";
import { batchWithdraw, getERC1155Balance, getERC20Balance, getERC721Balance, getEtherBalance, transferErc1155, transferErc20, transferErc721, transferEther, withdrawErc1155, withdrawErc20, withdrawErc721, withdrawEther } from "./services/RestApiCalls";
import { Batch } from "./model";
import { errorAlert } from "../utils/customAlert";


const Transfers: React.FC = () => {
  const signer = useEthersSigner()
  const [dappRelayedAddress, setDappRelayedAddress] = useState<boolean>(false)
  const [erc20Amount, setErc20Amount] = useState<string>("");
  const [erc20Token, setErc20Token] = useState<string>("");
  const [erc721Id, setErc721Id] = useState<string>('');
  const [erc721, setErc721] = useState<string>("");
  const [etherAmount, setEtherAmount] = useState<string>('');

  const [erc1155, setErc1155] = useState<string>("");
  const [erc1155Id, setErc1155Id] = useState<string>('');
  const [erc1155Amount, setErc1155Amount] = useState<string>('');
  const [erc1155Ids, setErc1155Ids] = useState<string[]>([]);
  const [erc1155Amounts, setErc1155Amounts] = useState<number[]>([]);
  const [erc1155IdsStr, setErc1155IdsStr] = useState<string>("[]");
  const [erc1155AmountsStr, setErc1155AmountsStr] = useState<string>("[]");

  const [loadEther, setLoadEther] = useState(false)
  const [loadEtherBalance, setEtherBalance] = useState(false)
  const [l2LoadEther, setL2LoadEther] = useState(false)
  const [loadERC20, setLoadERC20] = useState(false)
  const [loadWithdrawEther, setLoadWithdrawEther] = useState(false)
  const [loadWithdrawERC20, setLoadWithdrawERC20] = useState(false)
  const [loadL2ERC20, setLoadL2ERC20] = useState(false)
  const [loadERC20Balance, setLoadERC20Balance] = useState(false)
  const [loadERC721, setLoadERC721] = useState(false)
  const [loadTransferNFT, setLoadTransferNFT] = useState(false)
  const [loadWithdrawERC721, setLoadWithdrawERC721] = useState(false)
  const [loadERC721Balance, setLoadERC721Balance] = useState(false)
  const [loadERC1155, setLoadERC1155] = useState(false)
  const [loadWithdrawERC1155, setLoadWithdrawERC1155] = useState(false)
  const [loadBatchWithdrawERC1155, setLoadBatchWithdrawERC1155] = useState(false)
  const [loadL2ERC1155, setL2LoadERC1155] = useState(false)
  const [loadERC1155Balance, setLoadERC1155Balance] = useState(false)
  const [erc1155balanceL1, setErc1155balanceL1] = useState(0)
  const [erc1155balanceL2, setErc1155balanceL2] = useState(0)
  const [batch, setBatch] = useState<Batch[]>([])

  const [loadERC1155Batch, setLoadERC1155Batch] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [isL2transfer, setL2Transfer] = useState(false)
  const [etherBalanceL1, setEtherBalanceL1] = useState<number>(0)
  const [etherBalanceL2, setEtherBalanceL2] = useState<number>(0)

  const [toAddress, setToAddress] = useState('')
  const [erc20balanceL1, setErc20balanceL1] = useState('0')
  const [erc20balanceL2, setErc20balanceL2] = useState('0')

  const [erc721balanceL1, setErc721balanceL1] = useState('0')
  const [erc721balanceL2, setErc721balanceL2] = useState('0')
  const { address, chain } = useAccount()
    
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked)
  }
  const handleL2Checkbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setL2Transfer(e.target.checked)
  }

  const addTo1155Batch = () => {
    const newIds = erc1155Ids;
    newIds.push(erc1155Id);
    setErc1155Ids(newIds);
    const newAmounts = erc1155Amounts;
    newAmounts.push(Number(erc1155Amount));
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
              <div className="flex justify-between">
              <h2>
                <AccordionButton textColor="white">
                    Ether
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <div className="text-slate-400 mt-2">
                <input className="" type="checkbox" onChange={handleL2Checkbox} name="l2 transfer" id="l2" /> L2 Transfer
                </div>
              </div>
                <AccordionPanel>
                  <Stack>
                    {isL2transfer && (
                      <Input
                      borderWidth="0.1px"
                      borderColor="slategrey"
                      type="text"
                      color="slategrey"
                      variant="outline"
                      placeholder="Receipient Address required for L2 transfer"
                      onChange={(e) => setToAddress(e.target.value)}
                      value={toAddress}
                    />
                    )}
                  
                     <Input
                      min={0}
                      borderWidth="0.1px"
                      borderColor="slategrey"
                      color="slategrey"
                      type="number"
                      variant="outline"
                      placeholder="Enter amount"
                      onChange={(e) => setEtherAmount(e.target.value)}
                      value={etherAmount}
                    />
                    {!isL2transfer && (
                      <Button disabled={!address}
                      colorScheme="blue"
                      size="sm"
                      onClick={async () => {
                        setLoadEther(true)
                        await depositEther(etherAmount.toString(), signer, chain!)
                        setLoadEther(false)
                      }}
                    > {loadEther ? "Depositing please wait..🤑" :"Deposit"}
                    </Button>
                    )}
                     
                     <Button disabled={!address}
                      size="sm"
                      onClick={ async () => {
                        setLoadWithdrawEther(true)
                        await withdrawEther(signer, Number(etherAmount))
                        setLoadWithdrawEther(false)
                      }}
                    >
                     { loadWithdrawEther ? "Withdrawing please wait..🤑" : "Voucher Withdraw" }
                    </Button>
                    {isL2transfer && (
                      <Button disabled={!address}
                      className="bg-custom-orange"
                      colorScheme=""
                      size="sm"
                      onClick={async () => {
                        setL2LoadEther(true)
                        await transferEther(signer, toAddress, Number(etherAmount))
                        setL2LoadEther(false)
                      }}
                    > {l2LoadEther ? "Transferring please wait..🤑" :"L2 Transfer"}
                    </Button>
                    )}
                    
                     <Button disabled={!address}
                      className="bg-light-purple"
                      colorScheme=""
                      size="sm"
                      onClick={ async () => {
                        setEtherBalance(true)
                        await getEtherBalance(signer, setEtherBalanceL1, setEtherBalanceL2)
                        setEtherBalance(false)
                      }}
                    > {loadEtherBalance ? "Fetching balance please wait..🤑" :"Get Balance"}
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
                <div className="flex justify-between">
                  <h2>
                    <AccordionButton textColor="white">
                      ERC20
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <div className="text-slate-400 mt-2">
                  <input className="" type="checkbox" onChange={handleL2Checkbox} name="l2 transfer" id="l2" /> L2 Transfer
                  </div>
                </div>    
                <AccordionPanel>
                  <Stack>
                    <Input
                      borderWidth="0.1px"
                      borderColor="slategrey"
                      type="text"
                      color="slategrey"
                      variant="outline"
                      placeholder="ERC20 Address"
                      onChange={(e) => setErc20Token(String(e.target.value))}
                      value={erc20Token}
                    />
                    {isL2transfer && (
                      <Input
                      borderWidth="0.1px"
                      borderColor="slategrey"
                      type="text"
                      color="slategrey"
                      variant="outline"
                      placeholder="Receipient Address required for L2 transfer"
                      onChange={(e) => setToAddress(String(e.target.value))}
                      value={toAddress}
                    />
                    )}           
                    <Input
                      borderWidth="0.1px"
                      borderColor="slategrey" 
                      color="slategrey"                   
                      type="number"
                      variant="outline"
                      placeholder="Enter Amount"
                      onChange={(e) => setErc20Amount(e.target.value)}
                      value={erc20Amount}
                    />
                    {!isL2transfer && (
                      <Button disabled={!address}
                      colorScheme="blue"
                      size="sm"
                      onClick={ async () => {
                        setLoadERC20(true)
                        await depositERC20(DAPP_ADDRESS, erc20Token, erc20Amount, signer!, chain!)
                        setLoadERC20(false)
                      }
                      }
                      >
                      {loadERC20 ? "Depositing please wait..🤑" : "Deposit"}
                      </Button>
                    )}
            
                     <Button disabled={!address}
                    size="sm"
                    onClick={ async () => {
                      setLoadWithdrawERC20(true)
                      await withdrawErc20(signer, erc20Token, Number(erc20Amount))
                      setLoadWithdrawERC20(false)
                    }}
                    >
                    {loadWithdrawERC20 ? "Withdrawing please wait..🤑" : "Voucher Withdraw"}
                    </Button>
                    {isL2transfer && (
                      <Button disabled={!address}
                      className="bg-custom-orange"
                      colorScheme=""
                      size="sm"
                      onClick={async () => {
                        setLoadL2ERC20(true)
                        await transferErc20(signer, erc20Token, toAddress, Number(erc20Amount))
                        setLoadL2ERC20(false)
                      }}
                      > {loadL2ERC20 ? "Transferring please wait..🤑" :"L2 Transfer"}
                    </Button>
                    )}
                     
                     <Button disabled={!address}
                      className="bg-light-purple"
                      colorScheme=""
                      size="sm"
                      onClick={async () => {
                        setLoadERC20Balance(true)
                        await getERC20Balance(signer!, erc20Token,setErc20balanceL1, setErc20balanceL2 )
                        setLoadERC20Balance(true)
                      }}
                    > {loadERC20Balance ? "Fetching balance please wait..🤑" :"Get Balance"}
                    </Button>
                    <div className="mt-2 text-slate-400">
                     <p>L1 Balance: {erc20balanceL1}</p>
                     <p>L2 Balance: {erc20balanceL2}</p> 
                    </div>
                  </Stack>
                  <br/>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <div className="flex justify-between">
                  <h2>
                    <AccordionButton textColor="white">
                      ERC721
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <div className="text-slate-400 mt-2">
                  <input className="" type="checkbox" onChange={handleL2Checkbox} name="l2 transfer" id="l2" /> L2 Transfer
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
                      placeholder="Token Address"
                      onChange={(e) => setErc721(String(e.target.value))}
                      value={erc721}
                    />
                    {isL2transfer && (
                      <Input
                      borderWidth="0.1px"
                      borderColor="slategrey"
                      type="text"
                      color="slategrey"
                      variant="outline"
                      placeholder="Receipient address required for L2 transfer"
                      onChange={(e) => setErc20Token(String(e.target.value))}
                      value={erc20Token}
                    />
                    )}
                     
                    <Input
                      type="number"
                      borderWidth="0.1px"
                      borderColor="slategrey"
                      color="slategrey"
                      variant="outline"
                      placeholder="Token ID"
                      onChange={(e) => setErc721Id(e.target.value)}
                      value={erc721Id}
                    />
                    {!isL2transfer && (
                      <Button disabled={!address}
                      colorScheme="blue"
                      size="sm"
                      onClick={ async () => {
                        setLoadERC721(true)
                        await depositERC721(DAPP_ADDRESS,erc721,erc721Id,signer!, chain!)
                        setLoadERC721(false)
                      }}
                    >
                    { loadERC721 ? "Depositing NFT please wait..🤑" : "Deposit"}
                    </Button>
                    )}            
                     <Button disabled={!address}
                      size="sm"
                      onClick={ async () => {
                        setLoadWithdrawERC721(true)
                        await withdrawErc721(signer, erc721, Number(erc721Id))
                        setLoadWithdrawERC721(false)
                      }}
                    >
                     { loadWithdrawERC721 ? "Withdrawing NFT Please wait..🤑" : "Withdraw"}
                    </Button>
                    {isL2transfer && (
                      <Button disabled={!address}
                      className="bg-custom-orange"
                        colorScheme=""
                        size="sm"
                        onClick={ async () => {
                          setLoadTransferNFT(true)
                          await transferErc721(signer,erc721,toAddress, Number(erc721Id))
                          setLoadTransferNFT(false)
                        }}
                      > {loadTransferNFT ? "Transferring please wait..🤑" :"L2 Transfer"}
                      </Button>
                    )}
                    
                     <Button disabled={!address}
                      className="bg-light-purple"
                      colorScheme=""
                      size="sm"
                      onClick={ async () => {
                        setLoadERC721Balance(true)
                        await getERC721Balance(signer!, erc721, setErc721balanceL1, setErc721balanceL2)
                        setLoadERC721Balance(false)
                      }}
                    > {loadERC721Balance ? "Fetching balance please wait..🤑" :"Get Balance"}
                    </Button>
                    <div className="mt-2 text-slate-400">
                     <p>L1 Balance: {erc721balanceL1}</p>
                     <p>L2 Balance: {erc721balanceL2}</p> 
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
                <input  type="checkbox" onChange={handleL2Checkbox} name="l2 transfer" id="l2" /> L2 Transfer
                <input className="ml" type="checkbox" onChange={ handleCheckboxChange}/> Set Batch
                </div>
                </div>
                <AccordionPanel>
                <Stack>
  <Input
    required
    type="text"
    borderWidth="0.1px"
    borderColor="slategrey"
    color="slategrey"
    variant="outline"
    placeholder="Token Address"
    onChange={(e) => setErc1155(String(e.target.value))}
    value={erc1155}
  />
  {isL2transfer && (
    <Input
      borderWidth="0.1px"
      borderColor="slategrey"
      type="text"
      color="slategrey"
      variant="outline"
      placeholder="Recipient address required for L2 transfer"
      onChange={(e) => setToAddress(e.target.value)}
      value={toAddress}  // Fixed the value to use toAddress instead of erc20Token
    />
  )}
  <Input
    type="number"
    borderWidth="0.1px"
    borderColor="slategrey"
    color="slategrey"
    variant="outline"
    placeholder="Token ID"
    onChange={(e) => setErc1155Id(e.target.value)}
    value={erc1155Id}
  />
  <Input
    type="number"
    borderWidth="0.1px"
    borderColor="slategrey"
    color="slategrey"
    variant="outline"
    placeholder="Amount"
    onChange={(e) => setErc1155Amount(e.target.value)}
    value={erc1155Amount}
  />
  {!isChecked && !isL2transfer && (
    <div className="flex flex-col">
      <Button
        className="mb-2"
        disabled={!address}
        colorScheme="blue"
        size="sm"
        onClick={async () => {
          if(!erc1155 || !erc1155Id || !erc1155Amount) return errorAlert("Fields required!")
          setLoadERC1155(true);
          await depositSingleERC1155(DAPP_ADDRESS, erc1155, erc1155Id, Number(erc1155Amount), signer!, chain!);
          setLoadERC1155(false);
        }}
      >
        {loadERC1155 ? "Depositing please wait..🤑" : "Deposit"}
      </Button>
      <Button
        disabled={!address}
        className="bg-light-purple"
        colorScheme=""
        size="sm"
        onClick={async () => {
          if(!erc1155 || !erc1155Id) return errorAlert("Token address and id required!")
          setLoadERC1155Balance(true);
          await getERC1155Balance(signer!, erc1155, Number(erc1155Id), setErc1155balanceL1, setErc1155balanceL2);
          setLoadERC1155Balance(false);
        }}
      >
        {loadERC1155Balance ? "Fetching balance please wait..🤑" : "Get Balance"}
      </Button>
      <div className="mt-2 text-slate-400">
        <p>L1 Balance: {erc1155balanceL1}</p>
        <p>L2 Balance: {erc1155balanceL2}</p>
      </div>
    </div>

  )}
  {isL2transfer && !isChecked && (
    <div className="flex flex-col">
      <Button
        disabled={!address}
        size="sm"
        onClick={async () => {
          if(!erc1155 || !erc1155Id || !erc1155Amount) return errorAlert("Fields required!")
          setLoadWithdrawERC1155(true);
          await withdrawErc1155(signer!, erc1155, Number(erc1155Id), Number(erc1155Amount));
          setLoadWithdrawERC1155(false);
        }}
      >
        {loadWithdrawERC1155 ? "Withdrawing Please wait..🤑" : "Withdraw"}
      </Button>
      <Button
        disabled={!address}
        className="bg-custom-orange mt-2"
        colorScheme=""
        size="sm"
        onClick={async () => {
          if(!erc1155 || !erc1155Id || !erc1155Amount || !toAddress) return errorAlert("Fields required!")
          setL2LoadERC1155(true);
          await transferErc1155(signer!, erc1155, toAddress, batch);
          setL2LoadERC1155(false);
        }}
      >
        {loadL2ERC1155 ? "Transferring please wait..🤑" : "L2 Transfer"}
      </Button>
    </div>
  )}
  {isChecked && !isL2transfer && (
    <div className="flex flex-col">
     
      {/* <div className="mt-2 text-slate-400">
        <p>L1 Balance: {erc1155balanceL1}</p>
        <p>L2 Balance: {erc1155balanceL2}</p>
      </div> */}
      <span className="text-slate-400">
        Ids: {erc1155IdsStr} - Amounts: {erc1155AmountsStr}
      </span>
      <Button 
      disabled={!address} 
      className="mt-2"
      onClick={clear1155Batch}
      >
        Clear Batch
      </Button>
      <Button
        disabled={!address}
        className="my-2 bg-light-purple"
        colorScheme=""
        size="sm"
        onClick={ () => {
          if(!erc1155 || !erc1155Id || !erc1155Amount) return errorAlert("Fields required!")
          addTo1155Batch
        }}
      >
        Add to Batch
      </Button>
      <Button
        disabled={!address}
        colorScheme="blue"
        size="sm"
        onClick = {() => {
          setLoadERC1155Batch(true)
          depositBatchERC1155(DAPP_ADDRESS, erc1155, erc1155Ids, erc1155Amounts, signer!, chain!)
          setLoadERC1155Batch(false)
        }}
      >
        {loadERC1155Batch ? "Transferring please wait..🤑" : "Batch Transfer"}
      </Button>
      {/* <Button
        className="mt-2"
        disabled={!address}
        size="sm"
        onClick={async () => {
          const batchItem: Batch[] = [
            {
              tokenId: erc1155,
              value: Number(erc1155Amount),
              balance: erc1155balanceL1,
              balanceL2: erc1155balanceL2,
            },
          ];
          if(!erc1155 || !erc1155Id || !erc1155Amount) return errorAlert("Fields required!")
          setLoadBatchWithdrawERC1155(true);
          setBatch(batchItem);
          await batchWithdraw(signer!, erc1155, batch);
          setLoadBatchWithdrawERC1155(false);
        }}
      >
        {loadBatchWithdrawERC1155 ? "Withdrawing Please wait..🤑" : "Batch Withdraw"}
      </Button> */}
      {/* <Button
        disabled={!address}
        className="bg-light-purple mt-2"
        colorScheme=""
        size="sm"
        onClick={async () => {
          setLoadERC1155Balance(true);
          await getERC1155Balance(signer!, erc1155, Number(erc1155Id), setErc1155balanceL1, setErc1155balanceL2);
          setLoadERC1155Balance(false);
        }}
      >
        {loadERC1155Balance ? "Fetching balance please wait..🤑" : "Get Balance"}
      </Button> */}
    </div>
  )}
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