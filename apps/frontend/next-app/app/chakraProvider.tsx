// app/providers.tsx
'use client'

import { ChakraProvider } from '@chakra-ui/react'

export function ChakraProviders({ children }: { children: React.ReactNode }) {
  return <ChakraProvider>{children}</ChakraProvider>
}