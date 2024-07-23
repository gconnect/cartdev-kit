import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
  lightTheme
} from '@rainbow-me/rainbowkit';
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
  metaMaskWallet
} from '@rainbow-me/rainbowkit/wallets';
import {
  arbitrum,
  base,
  baseSepolia,
  mainnet,
  optimism,
  sepolia,
  optimismSepolia,
  arbitrumSepolia
} from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, WagmiProvider } from 'wagmi';
import { mylocalhost } from './mylocalhost';


const { wallets } = getDefaultWallets();


// eslint-disable-next-line react-refresh/only-export-components
 const config = getDefaultConfig({
  appName: 'CartDevKit',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID as string,
  wallets: [
    ...wallets,
    {
      groupName: 'Other',
      wallets: [argentWallet, trustWallet, ledgerWallet, metaMaskWallet],
    },
  ],
  chains: [
    mylocalhost, 
    sepolia,
    optimismSepolia,
    arbitrumSepolia,
    optimism,
    arbitrum,
    mainnet,
    base,
    baseSepolia,
    ...(import.meta.env.VITE_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  transports: {
    [mainnet.id]: http('https://eth-mainnet.g.alchemy.com/v2/...'),
    [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/...'),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
        theme={lightTheme({
          accentColor: '#FE8A7C',
          accentColorForeground: 'black',
          borderRadius: 'small',
          fontStack: 'system',
          overlayBlur: 'small',
        })}
        >{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
