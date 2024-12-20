import express from 'express';
import schemaRouter from './routes/schemaRoutes'; // Existing schema routes
import definitionRouter from './routes/definitionRoutes'; // New definition routes
import mongoose from 'mongoose';
import { MONGO_URI } from './config/db';

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Schema Routes
app.use('/v1/schemas', schemaRouter);

// Definition Routes
app.use('/v1/definitions', definitionRouter);

// defs Routes (Shortcut for Defintions
app.use('/v1/defs', definitionRouter);

// MongoDB connection
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

export default app;

