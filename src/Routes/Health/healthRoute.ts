import { Request, Response } from 'express';

export const HealthRoute = async (req: Request, res: Response) => {
    try {
        const data: HealthRouteResponse = {
            uptime: process.uptime(),
            message: 'Ok',
            date: new Date()
        }

        res.status(200).send(data);
    } catch (error: any) {
        // console the error to debug
        console.log(error);

        const data: HealthRouteResponse = {
            uptime: process.uptime(),
            message: error.message.toString(),
            date: new Date()
        }

        // Send the error message to the client
        res.status(403).send(data);
    }
};