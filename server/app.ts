import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { userRouter } from './src/routes/user'

dotenv.config()

const MONGO_CONN = process.env?.MONGO_CONN || ''

const app = express()
const version = '0.0.1'

app.use(express.json())
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:8100',
    'https://tunelog.usingthe.computer',
    'localhost'
  ],
}));


mongoose.connect(MONGO_CONN)

app.locals.JWT_SECRET = process.env?.JWT_SECRET || '';
app.locals.PROD = process.env?.NODE_ENV === 'prod';

app.get('/health', (_, res) => res.json({ status: "OK" }))
app.get('/version', (_, res) => res.json({ version }))
app.use('/user', userRouter);

export default app;