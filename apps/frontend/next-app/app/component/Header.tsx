import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Network } from './Network'

export default function Header() {
  return (
    <div className='p-4 bg-yellow-500 flex justify-between'>
      <p className=''>Logo</p>
      <Network/>
    </div>
  )
}
