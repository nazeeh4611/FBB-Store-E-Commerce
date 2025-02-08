import mongoose from 'mongoose';

const databaseConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log('Database is connected');
    } catch (error) {
        console.error('Database connection error:', error.message);
        throw error; 
    }
};

export default databaseConnection;
