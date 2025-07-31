import express from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import cors from 'cors';
import router_ai from './ROUTER/router_ai.js';
import router_calendar from './ROUTER/router_oauth.js';

const app = express();
app.use(cors({
  origin: 'http://localhost:8100',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With'],
  credentials: true
}));
app.use(express.json({ limit: '100mb' }));

app.use(express.json());
app.use(router_ai);
app.use(router_calendar);

export const api = onRequest({
  invoker: 'public'
}, app);