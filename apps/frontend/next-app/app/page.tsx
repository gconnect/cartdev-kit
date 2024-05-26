"use client"
import { FC, useCallback, useContext, createContext } from "react"
import { useState, useEffect } from "react";
import { useAccount } from 'wagmi';
import { Transfers } from "./component/Transfers"
import Greetings from "./greetings/page";
import { config } from './utils/providers'
import { useEthersSigner } from "./utils/useEtherSigner";
import { sign } from "crypto";

const Home: FC = () => {
    return(
      <div>        
        <Greetings/>       
      </div>
    )
  }
  
  export default Home