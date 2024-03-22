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

let greetings = []

app.post("/your-endpoint", (req, res) => {
  try{
    console.log("Request received on your endpoint")
    const senderAddress = req.header("x-msg_sender");
    res.send({ some: "response", senderAddress });
  }catch(error){
    return error
  }
});

// POST request to the /greeting endpoint
app.post('/greeting', (req, res) => {
  let greet = req.body;
  greetings.push(greet)
  if (greet) {
      res.status(200).json({ message: greet });
  } else {
      res.status(400).json({ error: 'Please provide a greeting' });
  }
});

// GET request to the /greeting endpoint
app.get('/greetings/:id', (req, res) => {
  try{
    const id = parseInt(req.params.id);
    const greet = greetings.find(greet => greet.id === id);
    if(greet){
      res.status(200).json({ message: greet });
    }
  }catch(e){
    res.status(400).json({ error: 'No greeting provided' });
  }
});

app.get('/greetings', (req, res) => {
    try{
      if(greet){
        res.status(200).json({ greetings });
      }
    }catch(e){
      res.status(400).json({ error: 'No greeting provided' });
    }
  });

  app.put('/greetings/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = greetings.findIndex(greet => greet.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Item not found' });
    }

    const updatedGreeting = { id: id, message: req.body.message }; // Assuming request body contains the updated item data
    greetings[index] = updatedGreeting;

    res.json(updatedGreeting);
});


  app.delete('/greetings/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = greetings.findIndex(greet => greet.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Item not found' });
    }
    greetings = greetings.filter(greetings => greetings.id !== id);
    res.json({ message: 'Item deleted successfully' });
});



app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
