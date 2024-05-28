import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers, JsonRpcApiProvider, JsonRpcSigner } from 'ethers';
import { RollupsContracts, useRollups } from '../cartesi/hooks/useRollups';
import { useEthersSigner } from '../utils/useEtherSigner';

interface RollupsContextProps {
  rollups: RollupsContracts | undefined;
  signer: JsonRpcSigner | undefined;
  provider: JsonRpcApiProvider | undefined;
}

const RollupsContext = createContext<RollupsContextProps | undefined>(undefined);

export const RollupsProvider: React.FC<{ dappAddress: string; children: React.ReactNode }> = ({ dappAddress, children }) => {
  const rollups = useRollups(dappAddress);
  const signer = useEthersSigner();
  const provider = signer?.provider;

  return (
    <RollupsContext.Provider value={{ rollups, signer, provider }}>
      {children}
    </RollupsContext.Provider>
  );
};

export const useRollupsContext = () => {
  const context = useContext(RollupsContext);
  if (!context) {
    throw new Error('useRollupsContext must be used within a RollupsProvider');
  }
  return context;
};
