'use client'
import {useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { useEthersSigner } from '../utils/useEtherSigner'
import { createOrUpdateRequest, getRequest } from '../cartesi/services/RestApiCalls'
import { errorAlert, successAlert } from '../utils/customAlert'

export default function Greetings() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<string | undefined>('')
  const [fetching, setFetching] = useState(false)
  const [message, setMessage] = useState('')
  const { address } = useAccount()
  const signer = useEthersSigner()
  
  const handleMessageChange = (e:  React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)

  const sendGreeting = async () => {
    try{
      if(!message) return errorAlert("Field required")
      if(!address) return errorAlert("Ensure your wallet is connect")
        setLoading(true)
      const res = await createOrUpdateRequest(signer, "POST", "greeting", 
       JSON.stringify({ message}))
       setLoading(false)
      successAlert(res)
    }catch(error){
      setLoading(false)
      console.log(error)
      errorAlert(error)
    }
  }

  const getGreeting = useCallback( async () => {
    try{
      setFetching(true)
      await getRequest(setData, "greetings?id=1")
      setFetching(false)
    }catch(error){
      setFetching(false)
      console.log("error", error)
    }
  }, [])


  useEffect(() =>{
    getGreeting()
  },[data, getGreeting])

    return (
      <div className="flex min-h-screen flex-col lg:mb-2 md:mb-8 mb-36 items-center text-black">
        <h1 className='mt-36 text-xl mb-4 font-bold text-gray-400'>Welcome! Say Hello 👋</h1>
        <input className='p-4 rounded border-2 lg:w-1/3 md:w-full w-3/4' type="text" onChange={handleMessageChange} placeholder='Enter your message' value={message} required/>
        <button className='bg-purple-400 p-4 mt-4 lg:w-1/3 md:w-1/2 w-3/4 rounded' onClick={() => sendGreeting()}>     
          {loading ? "Sending message please wait... 💁‍♀️": "Send"}
        </button>
        {fetching ? (<p className='mt-4 text-gray-400'>Fetching data...</p>) : data ? (
            <div>
              <p className="my-4 font-bold text-gray-400">Output</p>
              <p className="my-4 font-bold text-gray-400">{data}</p>
            </div>
          ) : <div></div>
          }
      </div>
  );
}
