/* eslint-disable import/first */
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from 'dotenv'
import express from "express"
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



import industryRoutes from './routes/industries.routes.js'
import productsRouter from './routes/products.routes.js'
import userRouter from './routes/user.routes.js'
import wasteRoutes from './routes/waste.routes.js'


app.use('/api/v1/users', userRouter)
app.use('/api/v1/industries', industryRoutes)
app.use('/api/v1/wastes', wasteRoutes)
app.use('/api/v1/products', productsRouter)

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}\thttp://localhost:${PORT}`)
})
