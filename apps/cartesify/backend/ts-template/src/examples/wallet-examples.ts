import express, { Request, Response } from 'express';
import { CartesifyBackend } from "@calindra/cartesify-backend";
import { createWallet } from "@deroll/wallet";
import axios from "axios"
import { appConfig } from "./init-config"

console.log('starting app.js...');
const { app, wallet, dapp } = appConfig()

// let dapp: any;
// let wallet: any;

// CartesifyBackend.createDapp().then(initDapp => {
//     console.log('Dapp started');
//     initDapp.start().catch((e: Error) => {
//         console.error(e);
//         process.exit(1);
//     });

//     dapp = initDapp;
//     wallet = createWallet();

//     dapp.addAdvanceHandler((): string => {
//         console.log('before wallet handler');
//         return "reject";
//     });

//     dapp.addAdvanceHandler(wallet.handler);

//     dapp.addAdvanceHandler((): string => {
//         console.log('final handler');
//         return "reject";
//     });
// });

// const app = express();
// const port = 8383;
// app.use(express.json());



app.get("/wallet/:address", async (req: Request, res: Response) => {
    console.log(`Checking balance ${req.params.address}`);
    const userWallet = await wallet.getWalletOrNew(req.params.address);
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
        await wallet.transferEther(
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
        const voucher = await wallet.withdrawEther(
            req.get('x-msg_sender') as string,
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
        const voucher = await wallet.withdrawERC20(
            req.body.token,
            req.get('x-msg_sender') as string,
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
        await wallet.transferERC20(
            req.body.token,
            req.get('x-msg_sender') as string,
            req.body.to,
            BigInt(req.body.amount),
        );
        res.send({ ok: 1 });
    } catch (e: any) {
        res.status(400).send({ message: e.message });
    }
});

app.post("/wallet/erc-721/transfer", async (req: Request, res: Response) => {
    try {
        await wallet.transferERC721(
            req.body.token,
            req.get('x-msg_sender') as string,
            req.body.to,
            BigInt(req.body.tokenId),
        );
        res.send({ ok: 1 });
    } catch (e: any) {
        res.status(400).send({ message: e.message });
    }
});

app.post("/wallet/erc-1155/transfer", async (req: Request, res: Response) => {
    try {
        await wallet.transferERC1155(
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
            }),
        );
        res.send({ ok: 1 });
    } catch (e: any) {
        res.status(400).send({ message: e.message });
    }
});

app.post("/wallet/erc-721/withdraw", async (req: Request, res: Response) => {
    try {
        const voucher = await wallet.withdrawERC721(
            req.body.token,
            req.get('x-msg_sender') as string,
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
        const voucher = await wallet.withdrawERC1155(
            req.body.token,
            req.get('x-msg_sender') as string,
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

// app.listen(port, () => {
//     console.log(`[server]: Server is running at http://localhost:${port}`);
// });
