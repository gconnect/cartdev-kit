'use client'
import {useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useEthersSigner } from '../../utils/useEtherSigner'
import  { Cartesify }  from "@calindra/cartesify";

const fetch =  Cartesify.createFetch({
  dappAddress: '0x70ac08179605AF2D9e75782b8DEcDD3c22aA4D0C',
  endpoints: {
    graphQL: new URL("http://localhost:8080/graphql"),
    inspect: new URL("http://localhost:8080/inspect"),
  },
})

export default function Greetings() {
  const [result, setResult] = useState<string>("") 
  const [signer, setSigner] = useState<any>(undefined)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleMessageChange = (e:  React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)

  const etherSigner = useEthersSigner()


  const sendMessage = async () => {
    if(!message) return alert("Field required") 
    setLoading(true)

    let results;

    const response = await fetch("http://127.0.0.1:8383/greetings", {
      method: "POST",
      headers: {
              "Content-Type": "application/json",
      },
      body: JSON.stringify({data: message}),
      signer 
    })

    results = await response.json();
    setLoading(false)
    setResult(JSON.stringify(results))
    
  }

  useEffect(() =>{
    setSigner(etherSigner)
  },[etherSigner])
  return (
      <div className="flex min-h-screen flex-col items-center">
        <h1 className='mt-36 text-xl mb-4'>Send Greetings</h1>
        <input className='p-4 rounded w-1/3' type="text" onChange={handleMessageChange} placeholder='Enter your message' value={message} required/>
        <button className='bg-cyan-500 p-4 mt-4 w-1/3' onClick={sendMessage}>     
          {loading ? "loading...": "Send"}
        </button>
        <p className='mt-4 font-bold'>{`Result: ${result}`}</p>
      </div>
  );
}
