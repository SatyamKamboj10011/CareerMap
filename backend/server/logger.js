// this is logger.js for Winston Logger Configuration
import winston from 'winston';

//defining the log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message }) =>{
        return `[${timestamp}] ${level}: ${message}`;
    })

);

//creating the logger instance
const logger = winston.createLogger({
    level: 'info',
    format: logFormat,
    transports: [
        //console output
        new winston.transports.Console(),

        //saving the errros to a file
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
        }),

        //saving all logs to a file
        new winston.transports.File({
            filename: 'logs/combined.log',
        }),
    ],  
});

export default logger;