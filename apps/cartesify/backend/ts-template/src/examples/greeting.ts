import  { Request, Response } from 'express';
import { appConfig } from "./init-config"

console.log('starting app.js...');
const { app } = appConfig()

interface Greeting {
    id: number;
    message: string;
    sender: string | undefined;
}

const greetings: Greeting[] = [];
let nextId = 1;


// Create a new greeting
app.post('/greetings', (req: Request, res: Response) => {
    const sender = req.header("x-msg_sender");
    const { message } = req.body;
    const newGreeting: Greeting = { id: nextId++, message, sender };
    greetings.push(newGreeting);
    res.status(201).send(newGreeting);
});

// Get all greetings from a specific sender
app.get('/greetings', (req: Request, res: Response) => {
    const sender = req.header("x-msg_sender");
    if (!sender) {
        return res.status(400).send({ message: 'Sender not provided' });
    }
    const senderGreetings = greetings.filter(g => g.sender === sender);
    res.send(senderGreetings);
});

// Get a single greeting by ID
app.get('/greetings/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id!, 10);
    const sender = req.header("x-msg_sender");
    const greeting = greetings.find(g => g.id === id);

    if (!sender) {
        return res.status(400).send({ message: 'Sender not provided' });
    }

    if (greeting) {
        if (greeting.sender !== sender) {
            return res.status(403).send({ message: 'You can only view your own greetings' });
        }
        res.send(greeting);
    } else {
        res.status(404).send({ message: 'Greeting not found' });
    }
});

// Update a greeting by ID
app.put('/greetings/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id!, 10);
    const { message } = req.body;
    const sender = req.header("x-msg_sender");
    const greeting = greetings.find(g => g.id === id);

    if (!sender) {
        return res.status(400).send({ message: 'Sender not provided' });
    }

    if (greeting) {
        if (greeting.sender !== sender) {
            return res.status(403).send({ message: 'You can only update your own greetings' });
        }
        greeting.message = message;
        res.send(greeting);
    } else {
        res.status(404).send({ message: 'Greeting not found' });
    }
});

// Delete a greeting by ID
app.delete('/greetings/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id!, 10);
    const sender = req.header("x-msg_sender");
    const index = greetings.findIndex(g => g.id === id);

    if (!sender) {
        return res.status(400).send({ message: 'Sender not provided' });
    }

    if (index !== -1) {
        if (greetings[index]!.sender !== sender) {
            return res.status(403).send({ message: 'You can only delete your own greetings' });
        }
        greetings.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send({ message: 'Greeting not found' });
    }
});

// Delete all greetings from a specific sender
app.delete('/greetings/sender', (req: Request, res: Response) => {
    const sender = req.header("x-msg_sender");

    if (!sender) {
        return res.status(400).send({ message: 'Sender not provided' });
    }

    const initialLength = greetings.length;
    for (let i = greetings.length - 1; i >= 0; i--) {
        if (greetings[i]!.sender === sender) {
            greetings.splice(i, 1);
        }
    }

    const finalLength = greetings.length;
    const deletedCount = initialLength - finalLength;

    res.status(200).send({ message: `${deletedCount} greetings deleted` });
});

// without the sender check
// Get all greetings
app.get('/greetings', (req: Request, res: Response) => {
  res.send(greetings);
});

app.delete('/greetings/all', (req: Request, res: Response) => {
  const deletedCount = greetings.length;
  greetings.length = 0;
  res.status(200).send({ message: `${deletedCount} greetings deleted` });
});

