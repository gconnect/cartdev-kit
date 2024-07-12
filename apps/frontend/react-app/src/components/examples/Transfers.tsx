"use client"
import React, { useState } from "react";
import { useRollups } from "../../cartesi/hooks/useRollups";
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
import { Vouchers } from "./Vouchers";
import { Notices } from "./Notices";
import { Reports } from "./Reports";
import { useEthersSigner } from "../../utils/useEtherSigner";
import { sendAddress, depositErc20ToPortal, depositEtherToPortal, 
  withdrawErc20, withdrawErc721, withdrawEther, transferNftToPortal, 
  transferErc1155SingleToPortal,
  transferErc1155BatchToPortal} 
  from "../../cartesi/Portals";
import { errorAlert, successAlert } from "@/app/utils/customAlert";

interface IProps {
  dappAddress: string;
}

const Transfers: React.FC<IProps> = ({ dappAddress }: IProps) => {

  const rollups = useRollups(dappAddress);
  const signer = useEthersSigner()
  const provider = signer?.provider
  const [dappRelayedAddress, setDappRelayedAddress] = useState<boolean>(false)
  const [erc20Amount, setErc20Amount] = useState<number>(0);
  const [erc20Token, setErc20Token] = useState<string>("");
  const [erc721Id, setErc721Id] = useState<number>(0);
  const [erc721, setErc721] = useState<string>("");
  const [etherAmount, setEtherAmount] = useState<number>(0);

  const [erc1155, setErc1155] = useState<string>("");
  const [erc1155Id, setErc1155Id] = useState<number>();
  const [erc1155Amount, setErc1155Amount] = useState<number>();
  const [erc1155Ids, setErc1155Ids] = useState<number[]>([]);
  const [erc1155Amounts, setErc1155Amounts] = useState<number[]>([]);
  const [erc1155IdsStr, setErc1155IdsStr] = useState<string>("[]");
  const [erc1155AmountsStr, setErc1155AmountsStr] = useState<string>("[]");
  const [loadEther, setLoadEther] = useState(false)
  const [loadERC20, setLoadERC20] = useState(false)
  const [loadWithdrawEther, setLoadWithdrawEther] = useState(false)
  const [loadWithdrawERC20, setLoadWithdrawERC20] = useState(false)
  const [loadTransferNFT, setLoadTransferNFT] = useState(false)
  const [loadWithdrawERC721, setLoadWithdrawERC721] = useState(false)
  const [loadERC1155, setLoadERC1155] = useState(false)
  const [loadERC1155Batch, setLoadERC1155Batch] = useState(false)
  const [isChecked, setIsChecked] = useState(false)

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked)
  }
  const addTo1155Batch = () => {
    const newIds = erc1155Ids;
    newIds.push(erc1155Id!);
    setErc1155Ids(newIds);
    const newAmounts = erc1155Amounts;
    newAmounts.push(erc1155Amount!);
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
                      try {
                        if(!etherAmount) return errorAlert("Amount field required!")
                        setLoadEther(true)
                        const res = await depositEtherToPortal(rollups, provider, etherAmount, dappAddress);
                        if(!res.hash) {
                          setLoadEther(false)
                          return errorAlert(res)
                        }
                        setLoadEther(false)
                        successAlert(res.hash)
                      } catch (error) {
                        errorAlert(error)
                      }
                      }}
                      disabled={!rollups}
                    > {loadEther ? "Depositing please wait..🤑" :"Deposit"}
                    </Button>
                    <Button
                      size="sm"
                      onClick={async () => {
                          if(!etherAmount) return errorAlert("Amount fields required!")
                          setLoadWithdrawEther(true)
                          const res: any = await withdrawEther(rollups, provider, etherAmount, dappAddress);
                          if(!res.hash) {
                            setLoadWithdrawEther(false)
                            return errorAlert(res)
                          }
                          setLoadWithdrawEther(false)
                          successAlert(res.hash)
                      }}
                      disabled={!rollups}
                    >
                     { loadWithdrawEther ? "Withdrawing please wait..🤑" : "Withdraw" }
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
                    onClick={async () => {
                      if(!erc20Amount || !erc20Token) return errorAlert("Fields required!")
                      setLoadERC20(true)
                      const res: any = await depositErc20ToPortal(
                            rollups,provider, 
                            erc20Token, 
                            erc20Amount,
                            dappAddress
                          )
                        if(!res.hash) {
                          setLoadERC20(false)
                          return errorAlert(res)
                        }
                        setLoadERC20(false)
                        successAlert(res.hash)
                  
                    }}
                    >
                   {loadERC20 ? "Depositing please wait..🤑" : "Deposit"}
                    </Button>
                    <Button
                    size="sm"
                    onClick={async () => {
                        if(!erc20Amount || !erc20Token) return errorAlert("Fields required!")
                        setLoadWithdrawERC20(true)
                        const res: any = await withdrawErc20(rollups, provider, erc20Amount, erc20Token, dappAddress);
                        if(!res.hash) {   
                          setLoadWithdrawERC20(false)
                          return errorAlert(res)
                        }
                        setLoadWithdrawERC20(false)
                        successAlert(res.hash)
              
                    }}
                    disabled={!rollups}
                    >
                    {loadWithdrawERC20 ? "Withdrawing please wait..🤑" : "Withdraw"}
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
                      onClick={ async () => 
                      {
                      if(!erc721 || !erc721Id) return errorAlert("Fields required!")
                      setLoadTransferNFT(true)
                      const res: any = await transferNftToPortal(rollups, provider, erc721, erc721Id, dappAddress)
                      if(!res.hash) {
                        setLoadTransferNFT(false)
                        return errorAlert(res)
                      }
                      setLoadTransferNFT(false)
                      successAlert(res.hash)
                      }
                    }
                      disabled={!rollups}
                    >
                      { loadTransferNFT ? "Transferring NFT please wait..🤑" : "Transfer"}
                    </Button>
                    <Button
                      size="sm"
                      onClick={async () => {
                        if(!erc721 || !erc721Id) return errorAlert("Fields required!")
                        setLoadWithdrawERC721(true)
                        const res: any = await withdrawErc721(rollups, provider, erc721, erc721Id, dappAddress);
                        if(!res.hash){
                          setLoadWithdrawERC721(false)
                          return errorAlert(res)
                        }
                        setLoadWithdrawERC721(false)
                        successAlert(res.hash)
                  
                      }}
                      disabled={!rollups}
                    >
                     { loadWithdrawERC721 ? "Withdrawing NFT Please wait..🤑" : "Withdraw"}
                    </Button>
                    <br />
                    <br />
                  </Stack>
                </AccordionPanel>
              </AccordionItem>

              {/* <AccordionItem>
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
                      onChange={(e) => setErc1155Amount(parseInt(e.target.value))}
                      value={erc1155Amount}
                    />


                    { !isChecked ? 
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={async () => {
                        if(!erc1155 || !erc1155Id || !erc1155Amount) return errorAlert("Fields required!")
                        setLoadERC1155(true)
                        const res: any = await transferErc1155SingleToPortal(rollups, provider, erc1155, erc1155Id!, erc1155Amount!, dappAddress)
                        if(!res.hash) {
                          setLoadERC1155(false) 
                          return errorAlert(res)
                        }
                        setLoadERC1155(false)
                        successAlert(res.hash)        
                        }
                      }
                      disabled={!rollups}
                    > 
                      { loadERC1155 ? "Transferring please wait..🤑" : "Transfer"}
                    </Button> :

                    <div className="flex flex-col">
                    <span className="text-slate-400">Ids: {erc1155IdsStr} - Amounts: {erc1155AmountsStr}  </span>
                    <Button className="mt-2" onClick={() => clear1155Batch()} disabled={!rollups}>
                        Clear Batch
                    </Button>
                    <Button
                      className="my-2 bg-light-purple"
                      colorScheme=""
                      size="sm"
                      onClick={() => addTo1155Batch()}
                      disabled={!rollups}
                    >
                      Add to Batch
                    </Button>

                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={ async () => 
                        {
                        try {
                        if(!erc1155 || !erc1155Ids || !erc1155Amounts) return errorAlert("Fields required!")
                         setLoadERC1155Batch(true)
                         const res: any = await transferErc1155BatchToPortal(rollups, provider, erc1155, erc1155Ids, erc1155Amounts, dappAddress)
                         if(!res.hash){
                          setLoadERC1155Batch(false)
                          return errorAlert(res)
                         }
                         setLoadERC1155Batch(false)
                         successAlert(res.hash)
                        } catch (error) {
                          errorAlert(error)
                        }
                        }
                      }
                      disabled={!rollups}
                    >
                      { loadERC1155Batch ? "Transferring please wait..🤑" : "Batch Transfer"}
                    </Button>
                    </div> }
                  </Stack>
                </AccordionPanel>
              </AccordionItem> */}

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
                  onClick={ async () => {
                    try{
                      const tx =  await sendAddress(rollups, dappAddress)
                      setDappRelayedAddress(true)
                      successAlert(tx)
                    }catch(err){
                      errorAlert(err)
                    }
               
                  }}
                  disabled={!rollups}
                >
                  Relay Address
                </Button>
                <br />
                <br />
              </div>
              }
              {dappRelayedAddress &&  <Vouchers dappAddress={dappAddress} />}
            </Accordion>
          </TabPanel>
          <TabPanel>
            <Notices />
            <br/>
            <Reports />
          </TabPanel>
        </TabPanels>
      </Box>
    </Tabs>
  </Box>
  );
};

export default Transfers