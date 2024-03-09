import { Router, Request, Response } from 'express';
import { AuthRegisterRoute } from './Auth/register';
import { AuthLoginRoute } from './Auth/login';
import { HealthRoute } from './Health/healthRoute';
import { Authenticate } from './Middlewares/Auth';

const routeHandler: Router = Router();

routeHandler.get('/', Authenticate, (req: Request, res: Response) => {
    console.log(req)
    res.send("<h1>Welcome To JWT Authentication 2</h1>");
})
routeHandler.post('/auth/register', AuthRegisterRoute)
routeHandler.post('/auth/login', AuthLoginRoute)
routeHandler.get('/health', HealthRoute)

export { routeHandler };