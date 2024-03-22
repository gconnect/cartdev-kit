import './App.css'
import { Cartesify } from "@calindra/cartesify";
import { BrowserProvider } from 'ethers';
import ERC1155Deposit from './cartesi/ERC1155Deposit';
import { RestExample } from './cartesi/RestExample';
import { WalletRest } from './cartesi/WalletRest';
import VoucherView from './cartesi/VoucherView';
import { Epoch } from './cartesi/Epoch';

type EthereumFromWindow = import("ethers").Eip1193Provider & import("ethers").AbstractProvider;
declare global {
  interface Window {
    /** @link {https://docs.metamask.io/wallet/reference/provider-api/} */
    ethereum?: // import("@ethersproject/providers").ExternalProvider &
    EthereumFromWindow;
  }
}

// you could check this address by executing `sunodo address-book`
const DAPP_ADDRESS = '0x70ac08179605AF2D9e75782b8DEcDD3c22aA4D0C'

// replace with the content of your dapp address (it could be found on dapp.json)
const fetch = Cartesify.createFetch({
  dappAddress: DAPP_ADDRESS,
  endpoints: {
    graphQL: new URL("http://localhost:8080/graphql"),
    inspect: new URL("http://localhost:8080/inspect"),
  },
})

function App() {
  async function getSigner() {
    try {
      if (!window.ethereum) {
        alert("Connecting to metamask failed.");
        throw new Error("Connecting to metamask failed. (window.ethereum is undefined)")
      }
      await window.ethereum.request({ method: "eth_requestAccounts" })
      const provider = new BrowserProvider(
        window.ethereum
      );
      return provider.getSigner();
    } catch (error) {
      console.log(error);
      alert("Connecting to metamask failed.");
      throw error
    }
  }

  return (
    <>
      <div>
        
      </div>
      <h1>Cartesi Playground</h1>
      <div className="card">
        <RestExample fetch={fetch} getSigner={getSigner} />
        <WalletRest fetch={fetch} dappAddress={DAPP_ADDRESS} getSigner={getSigner} />
        <ERC1155Deposit fetch={fetch} dappAddress={DAPP_ADDRESS} getSigner={getSigner} />
        <VoucherView fetch={fetch} dappAddress={DAPP_ADDRESS} getSigner={getSigner} />
        <Epoch />
      </div>
    </>
  )
}

export default App
