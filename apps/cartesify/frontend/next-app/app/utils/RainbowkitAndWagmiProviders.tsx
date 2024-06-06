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
import { http, createConfig } from 'wagmi'
import { mylocalhost } from './mylocalhost';

const { wallets } = getDefaultWallets();

export const config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: process.env.NEXT_PUBLIC_WALLECT_CONNECT_PROJECT_ID as string,
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
  ssr: true,
});

const queryClient = new QueryClient();

export function RainbowkitAndWagmiProviders({ children }: { children: React.ReactNode }) {
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
