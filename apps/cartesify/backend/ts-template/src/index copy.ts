import { Request, Response } from 'express'

// Cartesify REST bridge
const { CartesifyBackend } = require("@calindra/cartesify-backend")


CartesifyBackend.createDapp().then((dapp:any) => {
    dapp.start().catch((e: any) => {
        console.error(e);
        process.exit(1);
    });
});

// Normal nodejs application using express
const express = require("express");

const app = express();
const port = 8383;

app.use(express.json());

app.post("/your-endpoint", (req:Request, res:Response) => {
    console.log("Request received on your endpoint")
    const senderAddress = req.header("x-msg_sender");
    res.send({ some: "response", senderAddress });
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});