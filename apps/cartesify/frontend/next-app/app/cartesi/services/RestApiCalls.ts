import { JsonRpcSigner } from "ethers";
import { RPC_URL, BASE_URL } from "../../utils/constants";
import { fetch } from '../../utils/cartersify-init'
import { Batch } from "../model";
import { balanceERC1155, balanceERC20, balanceERC721, loadBatchBalances } from './Portal'
import { errorAlert, successAlert } from '../../utils/customAlert'

export const transferEther = async (
  signer: JsonRpcSigner | undefined, 
  toAddress: string,
  etherValue: number
) => {
  const res = await fetch(`${BASE_URL}/wallet/ether/transfer`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          to: toAddress,
          amount: etherValue
      }),
      signer,
  })
  try {
    if (!res.ok) {
        console.log(res.status, res.text())
        return
    }
    successAlert("Transfer successful")
    console.log('Success!')
  } catch (error) {
    console.log(error)
    errorAlert(error)
  }
}

export const transferErc20 = async (
  signer: JsonRpcSigner | undefined, 
  erc20address: string, toAddress: string,
  erc20value: number
  ) => {
  const res = await fetch(`${BASE_URL}/wallet/erc-20/transfer`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          token: erc20address,
          to: toAddress,
          amount: erc20value
      }),
      signer,
  })
  try {
    if (!res.ok) {
        console.log(res.status, res.text())
        return
    }
    successAlert("Success")
    console.log('Success!')
  } catch (error) {
    console.log(error)
    errorAlert(error)
  }
}

export const transferErc721 = async (
  signer: JsonRpcSigner | undefined, 
  erc721address: string, toAddress: string,
  erc721id: number
) => {
  const res = await fetch(`${BASE_URL}/wallet/erc-721/transfer`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          token: erc721address,
          to: toAddress,
          tokenId: erc721id
      }),
      signer,
  })
  try {
    if (!res.ok) {
        console.log(res.status, res.text())
        return
    }
    console.log('Success!')
    successAlert("Success!")
  } catch (error) {
    console.log(error)
    errorAlert(error)
  }
}

export  const transferErc1155 = async (signer: JsonRpcSigner, erc1155address: string,
  toAddress: string, batch: any[] ) => {
 const res = await fetch(`${BASE_URL}/wallet/erc-1155/transfer`, {
     method: 'POST',
     headers: {
         'Content-Type': 'application/json'
     },
     body: JSON.stringify({
         token: erc1155address,
         to: toAddress,
         tokenIds: batch.map(item => +item.tokenId),
         values: batch.map(item => item.value)
     }),
     signer,
 })
 try {
   if (!res.ok) {
       console.log(res.status, res.text())
       return
   }
   const json = await res.json()
   console.log(json)
   } catch (error) {
     console.log(error)
   }
}

export const withdrawEther = async (
  signer: JsonRpcSigner | undefined, 
  etherValue: number
 ) => {
  const res = await fetch(`${BASE_URL}/wallet/ether/withdraw`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          amount: etherValue
      }),
      signer,
  })
  try {
    if (!res.ok) {
        console.log(res.status, res.text())
        return
    }
    console.log('Success!')
    successAlert("Withdrawn successfully!")
  } catch (error) {
    console.log(error)
    errorAlert(error)
  }
}

export const withdrawErc20 = async (
  signer: JsonRpcSigner | undefined, 
  erc20address: string,
  erc20value: number
) => {
  const res = await fetch(`${BASE_URL}/wallet/erc-20/withdraw`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          token: erc20address,
          amount: erc20value
      }),
      signer,
  })
  try {
    if (!res.ok) {
        console.log(res.status, res.text())
        return
    }
    successAlert("Success")
    console.log('Success!')
  } catch (error) {
    console.log(error)
    errorAlert(error)
  }
}

 export const withdrawErc721 = async (
  signer: JsonRpcSigner | undefined, 
  erc721address: string,
  erc721id: number
 ) => {
  // await Cartesify.withdrawERC721(erc721address, address, tokenId)

  const res = await fetch(`${BASE_URL}/wallet/erc-721/withdraw`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          token: erc721address,
          tokenId: erc721id
      }),
      signer,
  })
  try {
    if (!res.ok) {
        console.log(res.status, res.text())
        return
    }
    successAlert('Success!')
  } catch (error) {
    errorAlert(error)
  }
}

export const withdrawErc1155 = async (
  signer: JsonRpcSigner | undefined, 
  erc1155address: string,
  erc1155id: number,
  tokenAmount: number
 ) => {
  // await Cartesify.withdrawERC721(erc721address, address, tokenId)

  const res = await fetch(`${BASE_URL}/wallet/erc-1155/withdraw`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          token: erc1155address,
          tokenId: erc1155id,
          amount: tokenAmount
      }),
      signer,
  })
  try {
    if (!res.ok) {
        console.log(res.status, res.text())
        return
    }
    successAlert('Success!')
  } catch (error) {
    errorAlert(error)
  }
}


export  const batchWithdraw = async (
  signer: JsonRpcSigner, erc1155address: string, 
  batch: Batch[]
  ) => {
  const res = await fetch(`${BASE_URL}/wallet/erc-1155/withdraw`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          token: erc1155address,
          tokenIds: batch.map(item => +item.tokenId),
          values: batch.map(item => item.value)
      }),
      signer,
  })
  try {
    if (!res.ok) {
        console.log(res.status, res.text())
        return
    }
    const json = await res.json()
    console.log(json)
    } catch (error) {
      console.log(error)
    }
}

export const fetchBatchBalance = async (signer: JsonRpcSigner, erc1155address: string, batch: Batch[]) => {
  try {
    const res = await fetch(`${BASE_URL}/wallet/${signer.address}`)
      const wallet = await res.json()
      const erc1155tokens = wallet.erc1155[erc1155address]
      if (erc1155tokens) {
          batch.forEach(item => {
              item.balanceL2 = erc1155tokens[`${item.tokenId}`]
          })
      }
  } catch (error) {
    console.log(error)
  }
}

export const getRequest = async (
  signer: JsonRpcSigner | undefined,
  endpoint: string,
) => {
  try {
    const address = await signer?.getAddress()
    const res = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'x-msg_sender': address!
      },
    })
    const json = await res.json()
    return JSON.stringify(json)
  } catch (error) {
    console.log(error)
  }
}

export const createOrUpdateRequest = async (
  signer: JsonRpcSigner | undefined, 
  endpoint: string,
  method: string,
  body?: string, 
) => {
  const address = await signer?.getAddress()
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
      method,
      headers: {
          'Content-Type': 'application/json',
          'x-msg_sender': address!
      },
      body,
      signer
  })
  try{
    const json = await res.json()
    return JSON.stringify(json, null, 4)
  }catch(error){
    console.log(error)
  }

}

export const fetchWallet = async (signer: JsonRpcSigner | undefined, 
  setResponse: Function
) => {
  try {
    const res = await fetch(`${BASE_URL}/${signer?.address}`)
    const json = await res.json()
    setResponse(JSON.stringify(json, null, 4))
    successAlert("Successful!")
  } catch (error) {
    errorAlert(error)
  }
}

export const getEtherBalance = async (signer: JsonRpcSigner | undefined, setEtherBalanceL1: Function, setEtherBalanceL2: Function ) => {
  try {
      const res = await fetch(`${BASE_URL}/${signer?.address}`)
      const json = await res.json()
      setEtherBalanceL2(json.ether)
      const balance = await signer?.provider.getBalance(signer.address)
      setEtherBalanceL1(balance?.toString())
      console.log('Success!')
      successAlert("Succesfully fetched balance")
    } catch (error) {
      console.log(error)
      errorAlert(error)
  }
}

export const getERC20Balance = async (
  signer: JsonRpcSigner, 
  erc20address: string,
  setErc20balanceL1: Function, 
  setErc20balanceL2: Function
) => {
  try {
      const res = await fetch(`${BASE_URL}/wallet/${signer?.address}`)
      const json = await res.json()
      setErc20balanceL2(json.erc20[erc20address] ?? '0')
      const balance = await balanceERC20(erc20address, signer)
      setErc20balanceL1(balance.toString())
      console.log('Success!')
      successAlert("Success")
  } catch (error) {
    console.log(error)
    errorAlert(error)
  }
}

export const getERC721Balance = async (
  signer: JsonRpcSigner, 
  erc721address: string,
  setErc721balanceL1: Function,
  setErc721balanceL2: Function
) => {
  try {
    const url = `${BASE_URL}/wallet/${signer.address}`
    const res = await fetch(url)
    const json = await res.json()
    setErc721balanceL2(json.erc721[erc721address]?.length ?? '0')
    const balance = await balanceERC721(erc721address, signer)
    setErc721balanceL1(balance.toString())
    console.log('Success!')
    successAlert("Success")
  } catch (error) {
    console.log(error)
    errorAlert(error)
  }
}

export const getERC1155Balance = async (
  signer: JsonRpcSigner, 
  erc1155address: string,
  tokenId: number,
  setErc1155balanceL1: Function,
  setErc1155balanceL2: Function
) => {
  try {
    const url = `${BASE_URL}/wallet/${signer.address}`
    const res = await fetch(url)
    const json = await res.json()
    setErc1155balanceL2(json.erc1155[erc1155address]?.length ?? '0')
    const balance = await balanceERC1155(erc1155address, signer!, tokenId)
    setErc1155balanceL1(balance.toString())
    console.log('Success!')
    successAlert("Success")
  } catch (error) {
    console.log(error)
    errorAlert(error)
  }
}


export  const sendRPCCommand = async (method: string, params: any[]) => {
  const rpcUrl = RPC_URL; // Replace this with your JSON-RPC endpoint URL
  const data = {
      jsonrpc: '2.0',
      method: method,
      params: params,
      id: 1 // You can use any value for the ID
  };

  const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
  };

  try {
      const response = await fetch(rpcUrl, requestOptions);
      const responseData = await response.json();
      console.log(responseData);
  } catch (error) {
      console.error(error)
  }
}