const express = require('express');
const { appConfig } = require("./init-config");

console.log('starting app.js...');
const { app } = appConfig();

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


