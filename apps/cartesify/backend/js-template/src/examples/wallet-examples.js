const express = require('express');
const { CartesifyBackend } = require("@calindra/cartesify-backend");
const { createWallet } = require("@deroll/wallet");
const axios = require("axios");
const { appConfig } = require("./init-config");

console.log('starting app.js...');
const { app, wallet, dapp } = appConfig();

app.get("/wallet/:address", async (req, res) => {
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

app.post("/wallet/ether/transfer", async (req, res) => {
    try {
        await wallet.transferEther(
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
        const voucher = await wallet.withdrawEther(
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
        const voucher = await wallet.withdrawERC20(
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
        await wallet.transferERC20(
            req.body.token,
            req.get('x-msg_sender'),
            req.body.to,
            BigInt(req.body.amount),
        );
        res.send({ ok: 1 });
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
});

app.post("/wallet/erc-721/transfer", async (req, res) => {
    try {
        await wallet.transferERC721(
            req.body.token,
            req.get('x-msg_sender'),
            req.body.to,
            BigInt(req.body.tokenId),
        );
        res.send({ ok: 1 });
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
});

app.post("/wallet/erc-1155/transfer", async (req, res) => {
    try {
        await wallet.transferERC1155(
            req.body.token,
            req.get('x-msg_sender'),
            req.body.to,
            req.body.tokenIds.map((id) => {
                if (typeof id !== 'number') {
                    throw new Error(`BadRequest id ${id} is not a number`);
                }
                return BigInt(id);
            }),
            req.body.values.map((value) => {
                if (typeof value !== 'number') {
                    throw new Error(`BadRequest value ${value} is not a number`);
                }
                return BigInt(value);
            }),
        );
        res.send({ ok: 1 });
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
});

app.post("/wallet/erc-721/withdraw", async (req, res) => {
    try {
        const voucher = await wallet.withdrawERC721(
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
        const voucher = await wallet.withdrawERC1155(
            req.body.token,
            req.get('x-msg_sender'),
            req.body.tokenIds.map((id) => {
                if (typeof id !== 'number') {
                    throw new Error('BadRequest');
                }
                return BigInt(id);
            }),
            req.body.values.map((value) => {
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
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
});

app.post('/deposit', (req, res) => {
    axios.post('http://deroll/voucher');
});
