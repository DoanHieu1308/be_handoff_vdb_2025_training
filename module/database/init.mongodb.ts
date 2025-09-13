'use strict';

import mongoose from 'mongoose';
import config from './config';

export class Database {
  private static instance: Database;

  private constructor() {
    this.connect();
  }

  private connect(): void {
    console.log('🔄 Attempting to connect to MongoDB Atlas...');
    console.log('📍 Connection URI:', config.uri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials
    
    mongoose.set('debug', process.env.NODE_ENV === 'development');

    mongoose
      .connect(config.uri, config.options)
      .then(() => {
        console.log('✅ MongoDB Atlas connected successfully!');
        console.log('📊 Database:', mongoose.connection.db?.databaseName);
        console.log('🌐 Host:', mongoose.connection.host);
      })
      .catch((err) => {
        console.error('❌ Failed to connect to MongoDB Atlas:', err.message);
        console.error('🔍 Please check your MONGODB_URI in .env file');
        process.exit(1);
      });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

export const instanceMongodb = Database.getInstance();
