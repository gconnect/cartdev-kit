
import { Request, Response } from 'express';
import axios from "axios"
import { createWallet, WalletApp } from "@deroll/wallet";
import CartesifyBackend from '@calindra/cartesify-backend';

console.log('starting app.js...');

const express = require("express");
const app = express();
const port = 8383;
app.use(express.json());

interface Greeting {
    id: number;
    message: string;
    sender: string
}

let greetings: Greeting[] = [];
let nextId = 1;


let dapp: any;
let wallet: WalletApp

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
    
    app.post('/greetings', (req: Request, res: Response) => {
        const { message, sender } = req.body;
        const newGreeting: Greeting = { id: nextId++, message, sender };
        greetings.push(newGreeting);
        if (message) {
            res.status(200).json(newGreeting);
        } else {
            res.status(400).json({ error: 'Please provide a greeting' });
        }
    });
    
    // GET request to the /greeting/:id endpoint
    app.get('/greetings/:id', (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id!, 10);
            const greet = greetings.find(greet => greet.id === id);
            if (greet) {
                res.status(200).json({ message: greet });
            } else {
                res.status(404).json({ error: 'Greeting not found' });
            }
        } catch (e) {
            res.status(400).json({ error: 'No greeting provided' });
        }
    });
    
    // GET request to the /greetings endpoint
    app.get('/greetings', (req: Request, res: Response) => {
        try {
            if (greetings) {
                res.status(200).json({ greetings });
            }
        } catch (e) {
            res.status(400).json({ error: 'No greeting provided' });
        }
    });
    
    app.put('/greetings/:id', (req: Request, res: Response) => {
        const id = parseInt(req.params.id!, 10);
        const index = greetings.findIndex(greet => greet.id === id);
    
        if (index === -1) {
            return res.status(404).json({ error: 'Item not found' });
        }
    
        const updatedGreeting = { id: id, message: req.body.message } as Greeting; // Assuming request body contains the updated item data
        greetings[index] = updatedGreeting;
    
        res.json(updatedGreeting);
    });
    
    app.delete('/greetings/:id', (req: Request, res: Response) => {
        const id = parseInt(req.params.id!, 10);
        const index = greetings.findIndex(greet => greet.id === id);
        if (index === -1) {
            return res.status(404).json({ error: 'Item not found' });
        }
        greetings = greetings.filter(greet => greet.id !== id);
        res.json({ message: 'Item deleted successfully' });
    });
    
    app.delete('/greetings', (req: Request, res: Response) => {
      const deletedCount = greetings.length;
      greetings.length = 0;
      res.status(200).send({ message: `${deletedCount} greetings deleted` });
    });
    
    
    app.get("/wallet/:address", async (req: Request, res: Response) => {
        console.log(`Checking balance ${req.params.address}`);
        const userWallet = await wallet.getWallet(req.params.address!);
        console.log("UserWallet", userWallet)
        const json = JSON.stringify(userWallet, (_key, value) => {
            if (typeof value === 'bigint') {
                return value.toString();
            } else if (typeof value === 'object' && value instanceof Map) {
                return Object.fromEntries(value);
            } else if (typeof value === 'object' && value instanceof Set) {
                return [...value];
            } else {
                return value;
            }
        });
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.send(json);
    });
    
    app.post("/wallet/ether/transfer", async (req: Request, res: Response) => {
        try {
             wallet.transferEther(
                req.get('x-msg_sender') as string,
                req.body.to,
                BigInt(req.body.amount),
            );
            res.send({ ok: 1 });
        } catch (e: any) {
            res.status(400).send({ message: e.message });
        }
    });
    
    app.post("/wallet/ether/withdraw", async (req: Request, res: Response) => {
        try {
            if(!wallet || !wallet.withdrawEther) throw new Error("Wallet not accessible!")
            const voucher = wallet.withdrawEther(
                req.get('x-msg_sender') as `0x${string}`,
                BigInt(req.body.amount)
            );
            const voucherResult = await dapp.createVoucher(voucher);
            res.send({
                ok: 1, voucherResult, inputIndex: req.get('x-input_index')
            });
        } catch (e: any) {
            res.status(400).send({ message: e.message });
        }
    });
    
    app.post("/wallet/erc-20/withdraw", async (req: Request, res: Response) => {
        try {
            if(!wallet || !wallet.withdrawERC20) throw new Error("Wallet not accessible!")
            const voucher = wallet.withdrawERC20(
                req.body.token,
                req.get('x-msg_sender') as `0x${string}`,
                BigInt(req.body.amount)
            );
            const voucherResult = await dapp.createVoucher(voucher);
            res.send({
                ok: 1, voucherResult, inputIndex: req.get('x-input_index')
            });
        } catch (e: any) {
            res.status(400).send({ message: e.message });
        }
    });
    
    app.post("/wallet/erc-20/transfer", async (req: Request, res: Response) => {
        try {
            wallet.transferERC20(
                req.body.token,
                req.get('x-msg_sender') as string,
                req.body.to,
                BigInt(req.body.amount)
            );
            res.send({ ok: 1 });
        } catch (e: any) {
            res.status(400).send({ message: e.message });
        }
    });
    
    app.post("/wallet/erc-721/transfer", async (req: Request, res: Response) => {
        try {
            wallet.transferERC721(
                req.body.token,
                req.get('x-msg_sender') as string,
                req.body.to,
                BigInt(req.body.tokenId)
            );
            res.send({ ok: 1 });
        } catch (e: any) {
            res.status(400).send({ message: e.message });
        }
    });
    
    app.post("/wallet/erc-1155/transfer", async (req: Request, res: Response) => {
        try {
            wallet.transferERC1155(
                req.body.token,
                req.get('x-msg_sender') as string,
                req.body.to,
                req.body.tokenIds.map((id: number) => {
                    if (typeof id !== 'number') {
                        throw new Error(`BadRequest id ${id} is not a number`);
                    }
                    return BigInt(id);
                }),
                req.body.values.map((value: number) => {
                    if (typeof value !== 'number') {
                        throw new Error(`BadRequest value ${value} is not a number`);
                    }
                    return BigInt(value);
                })
            );
            res.send({ ok: 1 });
        } catch (e: any) {
            res.status(400).send({ message: e.message });
        }
    });
    
    app.post("/wallet/erc-721/withdraw", async (req: Request, res: Response) => {
        try {
            const voucher = wallet.withdrawERC721(
                req.body.token,
                req.get('x-msg_sender') as `0x${string}`,
                BigInt(req.body.tokenId)
            );
            const voucherResult = await dapp.createVoucher(voucher);
            res.send({
                ok: 1, voucherResult, inputIndex: req.get('x-input_index')
            });
        } catch (e: any) {
            res.status(400).send({ message: e.message });
        }
    });
    
    app.post("/wallet/erc-1155/withdraw", async (req: Request, res: Response) => {
        try {
            const voucher = wallet.withdrawERC1155(
                req.body.token,
                req.get('x-msg_sender') as `0x${string}`,
                req.body.tokenIds.map((id: number) => {
                    if (typeof id !== 'number') {
                        throw new Error('BadRequest');
                    }
                    return BigInt(id);
                }),
                req.body.values.map((value: number) => {
                    if (typeof value !== 'number') {
                        throw new Error('BadRequest');
                    }
                    return BigInt(value);
                }),
                "0x"
            );
            const voucherResult = await dapp.createVoucher(voucher);
            res.send({
                ok: 1, voucherResult, inputIndex: req.get('x-input_index')
            });
        } catch (e: any) {
            res.status(400).send({ message: e.message });
        }
    });
    
    app.post('/deposit', (req: Request, res: Response) => {
        axios.post('http://deroll/voucher');
      });
    
      app.get("/health", (req: Request, res: Response) => {
        res.send({ some: "response" });
      });
      
      app.post('/echo', (req: Request, res: Response) => {
        res.send({ myPost: req.body });
      });
      
      app.post('/echo', (req: Request, res: Response) => {
        res.send({ myPost: req.body });
      });
      
      app.post('/echo/headers', (req: Request, res: Response) => {
        res.send({ headers: req.headers });
      });
      
      app.get('/echo/headers', (req: Request, res: Response) => {
        res.send({ headers: req.headers });
      });

app.listen(port, () => {
console.log(`[server]: Server is running at http://localhost:${port}`);
});


