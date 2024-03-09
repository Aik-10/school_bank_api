import { routeHandler } from '../Routes/routeHandler';
import { MiddlewareHandler } from '../Routes/Middlewares/Setup';
import { log } from '../Utils/logger';
import express, {
    Application, Request, Response
} from 'express';

export class ApiService {
    private app: Application;

    constructor() {
        this.app = express();

        this.app.use(MiddlewareHandler);

        this.app.use(routeHandler);


        this.app.post('/test', (req: Request, res: Response) => {
            console.log(req.body)
            res.send("<h1>Welcome To JWT Authentication </h1>");
        })

        const port = process.env.API_PORT ?? 3001;
        this.app.listen(port, () => log(`Server is running on port ${port}`));
    }
}