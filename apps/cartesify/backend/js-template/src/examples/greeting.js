const { Request, Response } = require('express');
const { appConfig } = require('./init-config');

console.log('starting app.js...');
const { app } = appConfig();

let greetings = [];
let nextId = 1;

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

    const updatedGreeting = { id: id, message: req.body.message, sender: greetings[index].sender };
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
