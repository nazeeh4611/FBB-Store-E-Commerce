import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import adminRouter from './Route/AdminRoute.js';
import UserRoute from './Route/UserRoute.js';
import databaseConnection from './Utils/Db.js';
import SellerRouter from './Route/SellerRoute.js';

dotenv.config();
const app = express();
const PORT = 3000;

databaseConnection();

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Middleware to handle large payloads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// ✅ Allow both local and production domains (adjust as needed)
app.use(cors({
    origin: ['http://localhost:5173', 'https://flybuybrand.com','https://fbb-store-e-commerce.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));

// ✅ API Routes
app.use('/api/admin', adminRouter);
app.use('/api/', UserRoute);
app.use('/api/seller', SellerRouter);

app.use(express.static(path.join(__dirname, '../Backend/build')));

app.get('/', (req, res) => {
    res.send('Backend is running');
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Backend/build', 'index.html'));
});

app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));
