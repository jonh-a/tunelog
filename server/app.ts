import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const MONGO_CONN = process.env?.MONGO_CONN || ''

const app = express()
const version = '0.0.1'

app.use(express.json())

mongoose.connect(MONGO_CONN)

app.get('/health', (_, res) => res.json({ status: "OK" }))
app.get('/version', (_, res) => res.json({ version }))

export default app;