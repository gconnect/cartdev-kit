'use client'
import {useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
// import { useEthersSigner } from '../../utils/useEtherSigner'
import { BASE_URL } from '@/app/utils/constants'

export default function Greetings() {
  const [result, setResult] = useState<string>("") 
  const [signer, setSigner] = useState<any>(undefined)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [greeting, setGreeting] = useState('')
  const [loadGreeting, setLoadGreeting] = useState(false)
  // const { address } = useAccount()
  // const etherSigner = useEthersSigner()

  const handleMessageChange = (e:  React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)

  const sendGreeting = async () => {
    console.log("send greeting")
  }

  const getGreeting = async () => {
    console.log("Hello world")
  }

  return (
      <div className="flex min-h-screen flex-col items-center bg-white text-black">
        <h1 className='mt-36 text-xl mb-4'>Send Greetings</h1>
        <input className='p-4 rounded border-2 lg:w-1/3 md:w-full text-black' type="text" onChange={handleMessageChange} placeholder='Enter your message' value={message} required/>
        <button className='bg-cyan-500 p-4 mt-4 w-1/3 rounded' onClick={sendGreeting}>     
          {loading ? "loading...": "Send"}
        </button>

        <button className='bg-yellow-500 p-4 mt-4 w-1/3 rounded' onClick={getGreeting}>     
          {loadGreeting ? "fetching data...": "Get Greet"}
        </button>

        <p>
          {greeting && greeting}
        </p>

        <p className='mt-4 font-bold'>{`Result: ${result}`}</p>
      </div>
  );
}
