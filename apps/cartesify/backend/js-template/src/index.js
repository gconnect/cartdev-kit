const express = require("express");
const axios = require("axios");
const { createWallet } = require("@deroll/wallet");
const { CartesifyBackend } = require("@calindra/cartesify-backend")

console.log('starting app.js...');

const app = express();
const port = 8383;
app.use(express.json());

let greetings = [];
let nextId = 1;

let dapp;
let wallet;

CartesifyBackend.createDapp().then(initDapp => {
    console.log('Dapp started');
    initDapp.start().catch(e => {
        console.error(e);
        process.exit(1);
    });

    dapp = initDapp;
    wallet = createWallet();
    
    dapp.addAdvanceHandler(() => {
        console.log('before wallet handler');
        return "reject";
    });

    dapp.addAdvanceHandler(wallet.handler);

    dapp.addAdvanceHandler(() => {
        console.log('final handler');
        return "reject";
    });
});

app.post('/greetings', (req, res) => {
    const { message, sender } = req.body;
    const newGreeting = { id: nextId++, message, sender };
    greetings.push(newGreeting);
    if (message) {
        res.status(200).json(newGreeting);
    } else {
        res.status(400).json({ error: 'Please provide a greeting' });
    }
});

app.get('/greetings/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
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

app.get('/greetings', (req, res) => {
    try {
        if (greetings) {
            res.status(200).json({ greetings });
        }
    } catch (e) {
        res.status(400).json({ error: 'No greeting provided' });
    }
});

app.put('/greetings/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = greetings.findIndex(greet => greet.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Item not found' });
    }

    const updatedGreeting = { id: id, message: req.body.message };
    greetings[index] = updatedGreeting;

    res.json(updatedGreeting);
});

app.delete('/greetings/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = greetings.findIndex(greet => greet.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Item not found' });
    }
    greetings = greetings.filter(greet => greet.id !== id);
    res.json({ message: 'Item deleted successfully' });
});

app.delete('/greetings', (req, res) => {
    const deletedCount = greetings.length;
    greetings.length = 0;
    res.status(200).send({ message: `${deletedCount} greetings deleted` });
});

app.get("/wallet/:address", async (req, res) => {
    console.log(`Checking balance ${req.params.address}`);
    const userWallet = await wallet.getWallet(req.params.address);
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

app.post("/wallet/ether/transfer", async (req, res) => {
    try {
         wallet.transferEther(
            req.get('x-msg_sender'),
            req.body.to,
            BigInt(req.body.amount),
        );
        res.send({ ok: 1 });
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
});

app.post("/wallet/ether/withdraw", async (req, res) => {
    try {
        if(!wallet || !wallet.withdrawEther) throw new Error("Wallet not accessible!");
        const voucher = wallet.withdrawEther(
            req.get('x-msg_sender'),
            BigInt(req.body.amount)
        );
        const voucherResult = await dapp.createVoucher(voucher);
        res.send({
            ok: 1, voucherResult, inputIndex: req.get('x-input_index')
        });
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
});

app.post("/wallet/erc-20/withdraw", async (req, res) => {
    try {
        if(!wallet || !wallet.withdrawERC20) throw new Error("Wallet not accessible!");
        const voucher = wallet.withdrawERC20(
            req.body.token,
            req.get('x-msg_sender'),
            BigInt(req.body.amount)
        );
        const voucherResult = await dapp.createVoucher(voucher);
        res.send({
            ok: 1, voucherResult, inputIndex: req.get('x-input_index')
        });
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
});

app.post("/wallet/erc-20/transfer", async (req, res) => {
    try {
        wallet.transferERC20(
            req.body.token,
            req.get('x-msg_sender'),
            req.body.to,
            BigInt(req.body.amount)
        );
        res.send({ ok: 1 });
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
});

app.post("/wallet/erc-721/transfer", async (req, res) => {
    try {
        wallet.transferERC721(
            req.body.token,
            req.get('x-msg_sender'),
            req.body.to,
            BigInt(req.body.tokenId)
        );
        res.send({ ok: 1 });
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
});

app.post("/wallet/erc-1155/transfer", async (req, res) => {
    try {
        wallet.transferERC1155(
            req.body.token,
            req.get('x-msg_sender'),
            req.body.to,
            req.body.tokenIds.map(id => {
                if (typeof id !== 'number') {
                    throw new Error(`BadRequest id ${id} is not a number`);
                }
                return BigInt(id);
            }),
            req.body.values.map(value => {
                if (typeof value !== 'number') {
                    throw new Error(`BadRequest value ${value} is not a number`);
                }
                return BigInt(value);
            })
        );
        res.send({ ok: 1 });
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
});

app.post("/wallet/erc-721/withdraw", async (req, res) => {
    try {
        const voucher = wallet.withdrawERC721(
            req.body.token,
            req.get('x-msg_sender'),
            BigInt(req.body.tokenId)
        );
        const voucherResult = await dapp.createVoucher(voucher);
        res.send({
            ok: 1, voucherResult, inputIndex: req.get('x-input_index')
        });
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
});

app.post("/wallet/erc-1155/withdraw", async (req, res) => {
    try {
        const voucher = wallet.withdrawERC1155(
            req.body.token,
            req.get('x-msg_sender'),
            req.body.tokenIds.map(id => {
                if (typeof id !== 'number') {
                    throw new Error('BadRequest');
                }
                return BigInt(id);
            }),
            req.body.values.map(value => {
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
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
});

app.post('/deposit', (req, res) => {
    axios.post('http://deroll/voucher');
});

app.get("/health", (req, res) => {
    res.send({ some: "response" });
});

app.post('/echo', (req, res) => {
    res.send({ myPost: req.body });
});

app.post('/echo/headers', (req, res) => {
    res.send({ headers: req.headers });
});

app.get('/echo/headers', (req, res) => {
    res.send({ headers: req.headers });
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
