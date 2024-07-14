console.log('starting app.js...')
const { CartesifyBackend } = require("@calindra/cartesify-backend")
const { createWallet } = require("@deroll/wallet")
let dapp, wallet

CartesifyBackend.createDapp().then(initDapp => {
    initDapp.start(() => {
        console.log('Dapp started');
    }).catch((e) => {
        console.error(e);
        process.exit(1);
    });
    dapp = initDapp

    wallet = createWallet()
    dapp.addAdvanceHandler(() => {
        console.log('before wallet handler')
        return "reject"
    })
    dapp.addAdvanceHandler(wallet.handler);
    dapp.addAdvanceHandler(() => {
        console.log('final handler')
        return "reject"
    })
})

const express = require("express")

const app = express();
const port = 8383;
app.use(express.json());

let totalAmount = 0

let games = []

app.get("/health", (req, res) => {
    res.send({ some: "response" });
});

app.get("/wallet/:address", async (req, res) => {
    console.log(`Checking balance ${req.params.address}`)
    const userWallet = await wallet.getWalletOrNew(req.params.address)
    const json = JSON.stringify(userWallet, (_key, value) => {
        if (typeof value === 'bigint') {
            return value.toString()
        } else if (typeof value === 'object' && value instanceof Map) {
            return Object.fromEntries(value)
        } else if (typeof value === 'object' && value instanceof Set) {
            return [...value]
        } else {
            return value
        }
    })
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.send(json)
})

app.post("/wallet/ether/transfer", async (req, res) => {
    try {
        await wallet.transferEther(
            req.get('x-msg_sender'),
            req.body.to,
            BigInt(req.body.amount),
        )
        res.send({ ok: 1 })
    } catch (e) {
        // Here, we need to detect the type of error to send the appropriate status.
        res.status(400).send({ message: e.message })
    }
})

app.post("/wallet/ether/withdraw", async (req, res) => {
    try {
        const voucher = await wallet.withdrawEther(
            req.get('x-msg_sender'),
            BigInt(req.body.amount)
        )
        const voucherResult = await dapp.createVoucher(voucher)
        res.send({
            ok: 1, voucherResult, inputIndex: req.get('x-input_index')
        })
    } catch (e) {
        // Here, we need to detect the type of error to send the appropriate status.
        res.status(400).send({ message: e.message })
    }
})

app.post("/wallet/erc-20/withdraw", async (req, res) => {
    try {
        const voucher = await wallet.withdrawERC20(
            req.body.token,
            req.get('x-msg_sender'),
            BigInt(req.body.amount)
        )
        const voucherResult = await dapp.createVoucher(voucher)
        res.send({
            ok: 1, voucherResult, inputIndex: req.get('x-input_index')
        })
    } catch (e) {
        // Here, we need to detect the type of error to send the appropriate status.
        res.status(400).send({ message: e.message })
    }
})

app.post("/wallet/erc-20/transfer", async (req, res) => {
    try {
        await wallet.transferERC20(
            req.body.token,
            req.get('x-msg_sender'),
            req.body.to,
            BigInt(req.body.amount),
        )
        res.send({ ok: 1 })
    } catch (e) {
        // Here, we need to detect the type of error to send the appropriate status.
        res.status(400).send({ message: e.message })
    }
})

app.post("/wallet/erc-721/transfer", async (req, res) => {
    try {
        await wallet.transferERC721(
            req.body.token,
            req.get('x-msg_sender'),
            req.body.to,
            BigInt(req.body.tokenId),
        )
        res.send({ ok: 1 })
    } catch (e) {
        // Here, we need to detect the type of error to send the appropriate status.
        res.status(400).send({ message: e.message })
    }
})

app.post("/wallet/erc-1155/transfer", async (req, res) => {
    try {
        await wallet.transferERC1155(
            req.body.token,
            req.get('x-msg_sender'),
            req.body.to,

            // deepcode ignore HTTPSourceWithUncheckedType: doing the type validation
            req.body.tokenIds.map(id => {
                if (typeof id !== 'number') {
                    throw new Error(`BadRequest id ${value} is not a number`)
                }
                return BigInt(id)
            }),

            // deepcode ignore HTTPSourceWithUncheckedType: doing the type validation
            req.body.values.map(value => {
                if (typeof value !== 'number') {
                    throw new Error(`BadRequest value ${value} is not a number`)
                }
                return BigInt(value)
            }),
        )
        res.send({ ok: 1 })
    } catch (e) {
        // Here, we need to detect the type of error to send the appropriate status.
        res.status(400).send({ message: e.message })
    }
})

app.post("/wallet/erc-721/withdraw", async (req, res) => {
    try {
        const voucher = await wallet.withdrawERC721(
            req.body.token,
            req.get('x-msg_sender'),
            BigInt(req.body.tokenId)
        )
        const voucherResult = await dapp.createVoucher(voucher)
        res.send({
            ok: 1, voucherResult, inputIndex: req.get('x-input_index')
        })
    } catch (e) {
        // Here, we need to detect the type of error to send the appropriate status.
        res.status(400).send({ message: e.message })
    }
})

app.post("/wallet/erc-1155/withdraw", async (req, res) => {
    try {
        const voucher = await wallet.withdrawERC1155(
            req.body.token,
            req.get('x-msg_sender'),

            // deepcode ignore HTTPSourceWithUncheckedType: doing the type validation
            req.body.tokenIds.map(id => {
                if (typeof id !== 'number') {
                    throw new Error('BadRequest')
                }
                return BigInt(id)
            }),

            // deepcode ignore HTTPSourceWithUncheckedType: doing the type validation
            req.body.values.map(value => {
                if (typeof value !== 'number') {
                    throw new Error('BadRequest')
                }
                return BigInt(value)
            }),
        )

        const voucherResult = await dapp.createVoucher(voucher)
        res.send({
            ok: 1, voucherResult, inputIndex: req.get('x-input_index')
        })
    } catch (e) {
        // Here, we need to detect the type of error to send the appropriate status.
        res.status(400).send({ message: e.message })
    }
})

app.get("/token/:tokenId/owners", (req, res) => {
    res.send({ owners })
})

app.post("/new-game", async (req, res) => {
    let player1 = req.header("x-msg_sender")
    let commit1 = req.body.commit // = hash(move + nonce)
    games.push({
        player1,
        commit1
    })
    res.send({ created: games.length })
})

app.post('/deposit', (req, res) => {
    axios.post('http://deroll/voucher')
})

app.get("/", (req, res) => {
    res.send({ some: "response" });
});

app.get('/games', (req, res) => {
    console.log('hi')
    res.send({ ok: 1 })
})

app.put('/update', (req, res) => {
    res.send({ updateBody: req.body })
})

app.patch('/patch', (req, res) => {
    res.send({ patchBody: req.body })
})

app.delete('/delete', (req, res) => {
    res.send({ query: req.query })
})

app.post('/player', (req, res) => {
    const name = req.body.name
    const id = req.user.id
    res.send({ msg: "created", player: { id, name } })
})

app.post('/games', (req, res) => {
    req.body.startBid
    res.send({ msg: "game created" })
})

app.post('/hit', (req, res) => {
    // req.user.id === 'msg_sender'
    if (!Number.isNaN(+req.body.amount)) {
        totalAmount += +req.body.amount
    }
    res.send({ amount: totalAmount, myPost: req.body });
});

app.post('/echo', (req, res) => {
    res.send({ myPost: req.body });
});

app.post('/echo/headers', (req, res) => {
    res.send({ headers: req.headers });
});

app.get('/echo/headers', (req, res) => {
    res.send({ headers: req.headers });
})

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
