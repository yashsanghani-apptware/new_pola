// Import the mongoose library to manage MongoDB connections
import mongoose from 'mongoose';

async function printConnectedDatabase() {
    try {
        if (mongoose.connection.readyState === 1) { // 1 means connected
            console.log('Connected to MongoDB.');
            const dbName = mongoose.connection.name;
            console.log(`Currently using the database: ${dbName}`);
        } else {
            console.log('Not connected to MongoDB.');
        }
    } catch (err) {
        console.error('Error checking connected database:', err);
    }
}
// Define an asynchronous function to connect to the MongoDB database
const connectDB = async () => {
  try {
    // Attempt to connect to the MongoDB database using the MONGO_URI environment variable
    // If MONGO_URI is not set, it defaults to a local MongoDB instance
    await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://saddamshah:hOzlWf1NF6Xnx7aA@agsiri.nk7ua3s.mongodb.net/polaService");
    // await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/agsiri');

    // Log a success message to the console if the connection is established
    console.log('MongoDB connected');
    printConnectedDatabase();
  } catch (error: unknown) {
    // Catch any errors that occur during the connection attempt

    // If the error is an instance of the Error class, log the error message
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      // If the error is not a standard Error instance, log a generic message
      console.error('Unknown error occurred during DB connection.');
    }

    // Exit the process with a failure code (1) to indicate that the connection failed
    process.exit(1);
  }
};

// Export the connectDB function for use in other parts of the application
export default connectDB;

