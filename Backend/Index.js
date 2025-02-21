import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import adminRouter from './Route/AdminRoute.js';
import UserRoute from './Route/UserRoute.js';
import databaseConnection from './Utils/Db.js';

dotenv.config();
const app = express();
const PORT = 3000;

databaseConnection();

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
    origin: 'http://flybuybrand.com:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/admin', adminRouter);
app.use('/api/', UserRoute);

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../Frontend/build')));

// Catch-all route to serve React frontend
app.get('/', (req, res) => {
    res.send('Backend is running');
});


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/build', 'index.html'));
});

app.listen(3000, '0.0.0.0', () => console.log('Server is running at http://0.0.0.0:3000'));
