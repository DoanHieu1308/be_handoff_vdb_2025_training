import { createLogger, transports, format } from 'winston';
import * as fs from 'fs';
import * as path from 'path';

// Check if running in Vercel serverless environment
const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

let logDir: string | null = null;
let fileTransports: any[] = [];

// Only create file transports if not in Vercel
if (!isVercel) {
    try {
        logDir = path.join(__dirname, '..', '..', 'logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        fileTransports = [
            new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
            new transports.File({ filename: path.join(logDir, 'app.log') }),
        ];
    } catch (error) {
        console.warn('⚠️ Could not create logs directory, using console only:', error.message);
    }
}

export const logger = createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    format: format.combine(
        format.colorize(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.printf(({ timestamp, level, message, stack }) => {
            return stack
                ? `${timestamp} [${level}]: ${message}\n${stack}`
                : `${timestamp} [${level}]: ${message}`;
        }),
    ),
    transports: [
        new transports.Console(),
        ...fileTransports, // Only add file transports if not in Vercel
    ],
});




