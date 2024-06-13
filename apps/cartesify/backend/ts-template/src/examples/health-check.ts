import { appConfig } from "./init-config"
import { Request, Response } from 'express'

console.log('starting app.js...');
const { app } = appConfig()


app.get("/health", (req: Request, res: Response) => {
  res.send({ some: "response" });
});

app.post('/echo', (req: Request, res: Response) => {
  res.send({ myPost: req.body });
});

app.post('/echo/headers', (req: Request, res: Response) => {
  res.send({ headers: req.headers });
});

app.get('/echo/headers', (req: Request, res: Response) => {
  res.send({ headers: req.headers });
});