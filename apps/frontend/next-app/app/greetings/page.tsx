'use client'
import {useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useEthersSigner } from '../utils/useEtherSigner'
import { BASE_URL, DAPP_ADDRESS } from '@/app/utils/constants'
import { Box } from '@chakra-ui/react'
import { useRollups } from '../cartesi/useRollups'
import toast from 'react-hot-toast'

export default function Greetings() {
  const [result, setResult] = useState<string>("") 
  // const [signer, setSigner] = useState<any>(undefined)
  const [loading, setLoading] = useState(false)
  const [greeting, setGreeting] = useState('')
  const [loadGreeting, setLoadGreeting] = useState(false)
  const rollups = useRollups(DAPP_ADDRESS);
  const { isConnected } = useAccount();
  const signer = useEthersSigner()
  const provider = signer?.provider

  const handleMessageChange = (e:  React.ChangeEvent<HTMLInputElement>) =>{ 
    console.log(e.target.value)
    setGreeting(e.target.value)
}
  const jsonPayload = JSON.stringify({
    method: 'sendgreeting',
    data: greeting,
  })

  const sendGreeting = async () => {
    if(!isConnected) return toast("Please connect your wallet")
    if (rollups) {
      try {
       const trans = await rollups.inputContract.addInput(JSON.stringify(jsonPayload), DAPP_ADDRESS);
        const tx = await signer?.sendTransaction(trans)
        const receipt = await tx?.wait()
        console.log("receipt", receipt?.hash)
        return receipt?.hash
      } catch (e) {
        console.log(`${e}`);
      }
    }
  };


  const getGreeting = async () => {
    if(!isConnected) return toast("Please connect your wallet")
    console.log("Hello world")
  }



  return (
      <div className="flex min-h-screen flex-col lg:mb-2 md:mb-8 mb-36 items-center text-black">
        <h1 className='mt-36 text-xl mb-4 font-bold text-gray-400'>Welcome! Say Hello 👋</h1>
        <input className='p-4 rounded border-2 lg:w-1/3 md:w-full w-3/4' type="text" onChange={handleMessageChange} placeholder='Enter your message' value={greeting} required/>
        <button className='bg-cyan-500 p-4 mt-4 lg:w-1/3 md:w-1/2 w-3/4 rounded' onClick={() => sendGreeting()}>     
          {loading ? "loading...": "Send"}
        </button>

        <button className='bg-purple-400 p-4 mt-4 lg:w-1/3 md:w-1/2 w-3/4  rounded' onClick={getGreeting}>     
          {loadGreeting ? "fetching data...": "Get Greet"}
        </button>

        <p>
          {greeting && greeting}
        </p>
        <p className='mt-4 font-bold text-gray-400'>{`Result: ${result}`}</p>
      </div>
  );
}
