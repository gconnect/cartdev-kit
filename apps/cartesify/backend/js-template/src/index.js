// Cartesify REST bridge
const { CartesifyBackend } = require("@calindra/cartesify-backend")


CartesifyBackend.createDapp().then((dapp) => {
    dapp.start().catch((e) => {
        console.error(e);
        process.exit(1);
    });
});

// Normal nodejs application using express
const express = require("express");

const app = express();
// Middleware to parse JSON bodies
app.use(bodyParser.json());

const port = 8383;

app.use(express.json());


app.post("/your-endpoint", (req, res) => {
  try{
    console.log("Request received on your endpoint")
    const senderAddress = req.header("x-msg_sender");
    res.send({ some: "response", senderAddress });
  }catch(error){
    return error
  }
});



app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
