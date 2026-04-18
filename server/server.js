/* eslint-disable import/first */
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from 'dotenv'
import express from "express"
import router from './routes/index.js'

dotenv.config({
    quiet: true,
})

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser())

const PORT = process.env.PORT || 3000

app.use('/api/v1', router)

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}\thttp://localhost:${PORT}`)
})
