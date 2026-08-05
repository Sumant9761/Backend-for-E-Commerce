import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/connectDB.js';
import userRouter from './route/user.route.js';
import categoryRouter from './route/category.route.js';
import productRouter from './route/product.route.js';

const app = express();
app.use(cors());
app.options('*', cors());

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev")); 
app.use(helmet({
    crossOriginEmbedderPolicy : false
}))


app.get("/", (req, res) => {
    // Server to client
    res.send("Server is running on the 8000 port")
})

app.use("/api/user", userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`)
    }) 
})
