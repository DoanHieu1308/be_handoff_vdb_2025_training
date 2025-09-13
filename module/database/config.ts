import { ConnectOptions } from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('❌ MONGODB_URI environment variable is required for MongoDB Atlas connection');
}

const config = {
  uri: process.env.MONGODB_URI,
  options: {
    maxPoolSize: 50,
    retryWrites: true,
    w: 'majority',
    serverSelectionTimeoutMS: 5000, 
    socketTimeoutMS: 45000,         
  } as ConnectOptions,
};

export default config;
