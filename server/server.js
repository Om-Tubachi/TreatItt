
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
    origin: [
        'http://localhost:8081',
        'http://172.20.10.9:8081' // Your Expo dev server IP
    ],
    credentials: true
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser())

const PORT = process.env.PORT || 3000

app.use('/api/v1', router)
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Listening on port ${PORT}\thttp://localhost:${PORT}`)
})
