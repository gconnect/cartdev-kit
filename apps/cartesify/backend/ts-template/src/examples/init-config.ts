import express from 'express';
import { CartesifyBackend } from "@calindra/cartesify-backend";
import { WalletApp, createWallet } from "@deroll/wallet";

let dapp: any;
let wallet: WalletApp;

export const appConfig = () => {

  CartesifyBackend.createDapp().then(initDapp => {
    console.log('Dapp started');
    initDapp.start().catch((e: Error) => {
        console.error(e);
        process.exit(1);
    });

    dapp = initDapp;
    wallet = createWallet();
    
    dapp.addAdvanceHandler((): string => {
        console.log('before wallet handler');
        return "reject";
    });

    dapp.addAdvanceHandler(wallet.handler);

    dapp.addAdvanceHandler((): string => {
        console.log('final handler');
        return "reject";
    });
});
  const express = require("express");
  const app = express();
  const port = 8383;
  app.use(express.json());

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });

  return { app, wallet, dapp }
}
