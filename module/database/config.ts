import { ConnectOptions } from 'mongoose';

const config = {
  uri: process.env.MONGODB_URI || (() => {
    throw new Error('MONGODB_URI environment variable is required for MongoDB Atlas connection');
  })(),
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 50,
    // MongoDB Atlas specific options
    ssl: true,
    authSource: 'admin',
    retryWrites: true,
    w: 'majority',
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  } as ConnectOptions,
};

export default config;
