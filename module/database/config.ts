import { ConnectOptions } from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('❌ MONGODB_URI environment variable is required for MongoDB Atlas connection');
}

// Ensure database name is included in URI
const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'social_app';

// Add database name to URI if not already present
let uriWithDb = mongoUri;
if (!mongoUri.includes('/' + dbName) && !mongoUri.includes('/' + dbName + '?')) {
  if (mongoUri.includes('?')) {
    uriWithDb = `${mongoUri.split('?')[0]}/${dbName}?${mongoUri.split('?')[1]}`;
  } else {
    uriWithDb = `${mongoUri}/${dbName}`;
  }
}

const config = {
  uri: uriWithDb,
  options: {
    maxPoolSize: 50,
    retryWrites: true,
    w: 'majority',
    serverSelectionTimeoutMS: 5000, 
    socketTimeoutMS: 45000,         
  } as ConnectOptions,
};

export default config;
