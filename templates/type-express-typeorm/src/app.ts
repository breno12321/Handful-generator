import express from 'express';
import { urlencoded, json } from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import * as dotenv from 'dotenv';
import userRoute from './routes/userRouter';
import authRoute from './routes/authRouter';
import { apiLimit, authLimit } from './middleware/rateLimit';

dotenv.config();
// const jwt = require('jsonwebtoken');

const app = express();

// Adds some headers for security
app.use(helmet());

// For Nginx Custom Configurations
// app.enable('trust proxy');

// Disable powered by header
app.disable('x-powered-by');

app.use(morgan('[:date[clf]] From :remote-addr ":method :url HTTP/:http-version" :status Content-Length :res[content-length]'));

app.use(
  urlencoded({
    extended: false,
  }),
);
app.use(json());

app.use(
  cors({
    credentials: true,
    methods: 'POST, GET, PUT, DELETE, PATCH, HEAD, OPTIONS',
    origin: true,
  }),
);

app.use('/users', apiLimit, userRoute);
app.use('/auth', authLimit, authRoute);

app.get('/', (req, res) => {
  res.sendStatus(418);
});

app.get('/status', (req, res) => {
  res.send({
    status: 'ok',
  });
});

export default app;
