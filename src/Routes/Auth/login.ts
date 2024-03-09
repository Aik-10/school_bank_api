import { Request, Response } from 'express';
import jwt from 'jsonwebtoken'

import Person, { PersonLogin } from '../../Models/DataModels/Person';

import { getPoolConnection } from '../../Handler/Database'
import { PasswordManager } from '../../Controllers/PasswordManager'

export const AuthLoginRoute = async (req: Request, res: Response) => {
    try {
        const user: PersonLogin = req.body;

        const passwordHash = await getPersonPasswordHashByEmail(user);
        if (!passwordHash ) {
            res.status(400).json({
                status: 400,
                message: "Invalid password",
            });
            return;
        }
        
        const passManager = new PasswordManager(user.password);
        const isPassCompare = await passManager.comparePasswordHash(passwordHash);

        if (!isPassCompare) {
            res.status(400).json({
                status: 400,
                message: "Invalid password",
            });
            return;
        } 

        const personId = await getPersonIdEmail(user);

        const token = await jwt.sign(
            { _id: personId, email: user.email }, process.env.API_JWT_TOKEN, { expiresIn: "1d" }
        );

        res.status(200).json({
            status: 200,
            success: true,
            message: "Login success",
            token: token,
        });
    } catch (error: any) {
        // Send the error message to the client
        res.status(400).json({
            status: 400,
            message: error.message.toString(),
        });
    }
};




const getPersonPasswordHashByEmail = async ({ email }: PersonLogin | Person): Promise<string | undefined> => {
    const poolConnection = await getPoolConnection();

    const result = await poolConnection?.query(`SELECT password FROM person WHERE email = ? LIMIT 1`, [email]);
    return result?.[0]?.[0].password ?? undefined;
}

const getPersonIdEmail = async ({ email }: PersonLogin | Person): Promise<number | undefined> => {
    const poolConnection = await getPoolConnection();

    const result = await poolConnection?.query(`SELECT personID FROM person WHERE email = ? LIMIT 1`, [email]);
    return result?.[0]?.[0].personID ?? undefined;
}