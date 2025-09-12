import { ConnectOptions } from 'mongoose';

const db = {
  host: process.env.MONGODB_HOST || '127.0.0.1',
  port: parseInt(process.env.MONGODB_PORT || '27017'),
  name: process.env.MONGODB_NAME || 'users_dev',
};

const config = {
  db,
  uri:
    process.env.MONGODB_URI ||
    `mongodb://${db.host}:${db.port}/${db.name}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 50,
    // MongoDB Atlas specific options
    ssl: process.env.MONGODB_URI?.includes('mongodb+srv://') ? true : false,
    authSource: 'admin',
    retryWrites: true,
    w: 'majority',
  } as ConnectOptions,
};

export default config;
