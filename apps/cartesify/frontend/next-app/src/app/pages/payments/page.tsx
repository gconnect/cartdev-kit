'use client'
import { Cartesify } from "@calindra/cartesify";
import ERC1155Deposit from '../../cartesi/ERC1155Deposit';
import { RestExample } from '../../cartesi/RestExample';
import { WalletRest } from '../../cartesi/WalletRest';
import VoucherView from '../../cartesi/VoucherView';
import { Epoch } from '../../cartesi/Epoch';
import { fetch } from '../../utils/cartersify-init'
import { useAccount } from 'wagmi'
import { useEthersSigner, clientToSigner } from '../../utils/useEtherSigner'
import { DAPP_ADDRESS } from "@/app/utils/constants";

const Payment = () => {

  return (
    <div className="flex flex-col  bg-slate-900">
      <h1 className="text-center mt-24 text-2xl">Test all Wallet and Voucher Endpoints Here </h1>
      <div className="h-full flex-col justify-center items-center">
        <div className="justify-center items-center">
          <RestExample fetch={fetch} />
          <WalletRest fetch={fetch} dappAddress={DAPP_ADDRESS} />
        </div>
        <ERC1155Deposit fetch={fetch} dappAddress={DAPP_ADDRESS} />
        <div className="flex justify-evenly my-24">
            <VoucherView fetch={fetch} dappAddress={DAPP_ADDRESS} />
            <Epoch />
          </div>   
    </div>
    </div>
  )
}

export default Payment