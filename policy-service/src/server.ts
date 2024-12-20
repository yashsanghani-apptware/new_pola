// Import the Express application instance from the app module
import app from './app';
// Import the database connection function from the config/db module
import connectDB from './config/db';

// Define the port number that the server will listen on
// Use the PORT environment variable if available, otherwise default to 4000
const PORT = process.env.PORT || 4000;

// Define an asynchronous function to start the server
const startServer = async () => {
  // Connect to the MongoDB database before starting the server
  await connectDB();

  // Start the Express server and listen on the specified port
  app.listen(PORT, () => {
    // Log a message to the console indicating that the server is running
    console.log(`Server running on port ${PORT}`);
  });
};

// Call the startServer function to initialize the database connection and start the server
startServer();

