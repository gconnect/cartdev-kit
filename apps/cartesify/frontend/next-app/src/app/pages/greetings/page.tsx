'use client'
import {useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useEthersSigner } from '../../utils/useEtherSigner'
import { fetch } from '../../utils/cartersify-init'
import { BASE_URL } from '@/app/utils/constants'

export default function Greetings() {
  const [result, setResult] = useState<string>("") 
  const [signer, setSigner] = useState<any>(undefined)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [greeting, setGreeting] = useState('')
  const [loadGreeting, setLoadGreeting] = useState(false)
  const { address } = useAccount()
  const etherSigner = useEthersSigner()

  const handleMessageChange = (e:  React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)

  const sendGreeting = async () => {
    try{
      if(!message) return alert("Field required")
      if(!address) return alert("Ensure your wallet is connect")
    setLoading(true)

    let results;

    const response = await fetch(`${BASE_URL}/greeting`, {
      method: "POST",
      headers: {
              "Content-Type": "application/json",
      },
      body: JSON.stringify({ message}),
      signer 
    })

    results = await response.json();
    console.log("results", results)
    setResult(JSON.stringify(results))
    setLoading(false)
    console.log("result", result)
    }catch(error){
      setLoading(false)
      console.log(error)
    }
  }

  const getGreeting = async () => {
    if(!address) return alert("Ensure your wallet is connect")
    setLoadGreeting(true)
    try{
      const response = await fetch(`${BASE_URL}/greetings?id=1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const greet = await response.json();
    setGreeting(JSON.stringify(greet))
    setLoadGreeting(false)
    console.log("greet", greet)
    }catch(error){
      setLoadGreeting(false)
      console.log(error)
      alert(`${error} Ensure your server is up and running`)
    }
  }


  useEffect(() =>{
    setSigner(etherSigner)
  },[etherSigner])
  return (
      <div className="flex min-h-screen flex-col items-center bg-slate-900">
        <h1 className='mt-36 text-xl mb-4'>Send Greetings</h1>
        <input className='p-4 rounded lg:w-1/3 md:w-full text-black' type="text" onChange={handleMessageChange} placeholder='Enter your message' value={message} required/>
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
