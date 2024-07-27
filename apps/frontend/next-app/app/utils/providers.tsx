'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
  darkTheme,
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
import { WagmiProvider } from 'wagmi';
import { http } from 'wagmi'
import { mylocalhost } from './mylocalhost';
import { RPC_URL } from './constants';

const { wallets } = getDefaultWallets();

const config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
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
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  transports: {
    [sepolia.id]: http(RPC_URL),
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
