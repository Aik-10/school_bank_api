import express, { Router } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';

const MiddlewareHandler: Router = Router();

MiddlewareHandler.use(express.json());
MiddlewareHandler.use(helmet()); // Adds security headers

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    // max: process.env.API_RATELIMIT_MAX, // Limit each IP to 100 requests per windowMs
});

// MiddlewareHandler.use(express.urlencoded({ extended: true }));

// MiddlewareHandler.use(limiter);
MiddlewareHandler.use(morgan('[:date[web]] :method :url :status :res[content-length] - :response-time ms ":user-agent"'));

export { MiddlewareHandler };



