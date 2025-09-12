'use strict';

import mongoose from 'mongoose';
import config from './config';

export class Database {
  private static instance: Database;

  private constructor() {
    this.connect();
  }

  private connect(): void {
    mongoose.set('debug', true);

    mongoose
      .connect(config.uri, config.options)
      .then(() => {
        console.log('✅ MongoDB connected successfully');
      })
      .catch((err) => {
        console.error('❌ Failed to connect to MongoDB:', err);
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
