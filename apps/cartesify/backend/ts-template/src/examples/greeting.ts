import  { Request, Response } from 'express';
import { appConfig } from "./init-config"

console.log('starting app.js...');
const { app } = appConfig()

interface Greeting {
    id: number;
    message: string;
    sender: string
}

let greetings: Greeting[] = [];
let nextId = 1;


app.post('/greetings', (req: Request, res: Response) => {
    // const sender = req.header("x-msg_sender");
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