import mongoose from 'mongoose';

export async function connectToDatabase(): Promise<void> {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ExploreDB2';
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process if the connection fails
    }
}

