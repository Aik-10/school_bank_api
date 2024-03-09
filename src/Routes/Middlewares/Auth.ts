import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express';

export const Authenticate = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.API_JWT_TOKEN, (err: any, user?: AuthToken) => {
        if (err) return res.sendStatus(403);
        req.user = user

        next()
    })
}
