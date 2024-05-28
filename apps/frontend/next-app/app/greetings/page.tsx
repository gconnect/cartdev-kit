'use client'
import {useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useEthersSigner } from '../utils/useEtherSigner'
import { DAPP_ADDRESS } from '@/app/utils/constants'
import { Box } from '@chakra-ui/react'
import { useRollups } from '../cartesi/hooks/useRollups'
import toast from 'react-hot-toast'
import { useNotices } from '../cartesi/hooks/useNotices'
import { Notices } from '../cartesi/Notices'
import { ethers } from 'ethers'
import { addInput } from '../cartesi/Portals'

export default function Greetings() {
  const [greeting, setGreeting] = useState('')
  const [loadGreeting, setLoading] = useState(false)
  const rollups = useRollups(DAPP_ADDRESS);
  const { isConnected } = useAccount();
  const signer = useEthersSigner()
  const { refetch } = useNotices()

  const handleMessageChange = (e:  React.ChangeEvent<HTMLInputElement>) =>{ 
    console.log(e.target.value)
    setGreeting(e.target.value)
}

  const sendGreeting = async () => {

    const jsonPayload = JSON.stringify({
      method: 'sendgreeting',
      args: {
        amount: greeting,
      },
    })

    if(!isConnected) return toast("Please connect your wallet")
    if(!greeting) return toast.error("Input field should not be empty")
  
    await addInput(rollups, signer, setLoading, jsonPayload)
  };

  useEffect(() => {
      const handleInputAdded = () => {
        console.log('Input added, refetching notices')
        refetch()
      }
      // Add event listener for inputAdded event
      rollups?.inputContract.on('InputAdded', handleInputAdded)
      // Cleanup function to remove event listener
      return () => {
        rollups?.inputContract.off('InputAdded', handleInputAdded)
      }
    }, [rollups, refetch])

    return (
      <div className="flex min-h-screen flex-col lg:mb-2 md:mb-8 mb-36 items-center text-black">
        <h1 className='mt-36 text-xl mb-4 font-bold text-gray-400'>Welcome! Say Hello 👋</h1>
        <input className='p-4 rounded border-2 lg:w-1/3 md:w-full w-3/4' type="text" onChange={handleMessageChange} placeholder='Enter your message' value={greeting} required/>
        <button className='bg-purple-400 p-4 mt-4 lg:w-1/3 md:w-1/2 w-3/4 rounded' onClick={() => sendGreeting()}>     
          {loadGreeting ? "Sending message please wait... 💁‍♀️": "Send"}
        </button>
        <p className='my-4 font-bold text-gray-400'>Output</p>
        <Notices/>
      </div>
  );
}
