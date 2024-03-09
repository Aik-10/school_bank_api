import dotenv from 'dotenv';

import { ApiService } from './Services/ApiService';
try {
    dotenv.config();
    new ApiService();
} catch (e: any) {
    console.error(e);
}