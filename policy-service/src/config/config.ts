// config/config.ts

import * as dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

interface Config {
  OPENAI_API_KEY: string;
  POLA_ANALYSIS: boolean;
  POLICY_SERVICE_URL: string;
  mongoURI: string;
  mongoTestURI: string;
  listingServiceUrl: string;
  // The URL for the Policy Service, used for policy management operations
  policyServiceUrl: string;
  // The URL for the Data Room service, used for Data room management operations
  dataRoomServiceUrl: string;
  portfolioServiceUrl: string

  // The Agsiri Resource Identifier (ARI) for a specific resource managed
  // by this service
  resourceARI: string;
}

const config: Config = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  POLA_ANALYSIS: process.env.POLA_ANALYSIS === 'true' || false,
  POLICY_SERVICE_URL: process.env.POLICY_SERVICE_URL || 'http://pola.coretical.com/check-permission',

  mongoURI: process.env.MONGO_URI || "mongodb+srv://saddamshah:hOzlWf1NF6Xnx7aA@agsiri.nk7ua3s.mongodb.net/offering" ||  "mongodb://localhost:27017/offering",
  mongoTestURI:
    process.env.TEST_MONGO_URI || "mongodb://localhost:27017/offering",
  listingServiceUrl: process.env.LISTING_SERVICE_URL || 'http://listing-service:3002',
  // Set the Policy Service URL from environment variables or use a
  // default local URL
  policyServiceUrl: process.env.POLICY_SERVICE_URL || 'http://localhost:4000',

  // Set the Data room service URL from environment variables or use a
  // default local URL
  dataRoomServiceUrl:
    process.env.DATA_ROOM_SERVICE_URL || 'http://data-room-service:3001',

  portfolioServiceUrl: process.env.PORTFOLIO_SERVICE_URL || 'http://localhost:3005',

  // Set the Resource ARI from environment variables or use a default ARI;
  // This should be customized to match the specific resource for each service
  resourceARI: process.env.RESOURCE_ARI || "ari:pola:us:agsiri:pola",
};

export default config;

