import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import adminRouter from './Route/AdminRoute.js';
import UserRoute from './Route/UserRoute.js';
import databaseConnection from './Utils/Db.js';


const app = express();
const PORT = 3000;

databaseConnection();


app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));
dotenv.config()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/admin',adminRouter)
app.use('/api/',UserRoute)

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

