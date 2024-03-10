import jwt from 'jsonwebtoken'

import Person, { PersonLogin } from '../../Models/DataModels/Person';

import { getPoolConnection } from '../../Handler/Database'
import { PasswordManager } from '../../Controllers/PasswordManager'
import { VarChar } from 'mssql'

import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export const AuthLoginRoute = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
        const user: PersonLogin = JSON.parse(await request.text());

        const passwordHash = await getPersonPasswordHashByEmail(user);
        if (!passwordHash) {
            return {
                status: 400,
                body: "Invalid password",
            }
        }

        const passManager = new PasswordManager(user.password);
        const isPassCompare = await passManager.comparePasswordHash(passwordHash);

        if (!isPassCompare) {
            return {
                status: 400,
                body: "Invalid password",
            }
        }

        const personId = await getPersonIdEmail(user);

        const token = await jwt.sign(
            { _id: personId, email: user.email }, process.env.API_JWT_TOKEN, { expiresIn: "30min" }
        );

        console.log("New login with data", {
            user: personId,
            email: user.email
        });

        return {
            status: 200,
            jsonBody: {
                success: true,
                message: "Login success",
                token: token,
            }
        }
    } catch (err: any) {
        console.error(err)
        return {
            status: 400,
            body: err.message.toString(),
        };
    }
};

const getPersonPasswordHashByEmail = async ({ email }: PersonLogin | Person): Promise<string | undefined> => {
    const poolConnection = await getPoolConnection();

    const result = await poolConnection
        .input('email', VarChar, email)
        .query(`SELECT password FROM person WHERE email = @email`);
    return result['recordset']?.[0]?.password ?? undefined;
}

const getPersonIdEmail = async ({ email }: PersonLogin | Person): Promise<number | undefined> => {
    const poolConnection = await getPoolConnection();

    const result = await poolConnection
        .input('email', VarChar, email)
        .query(`SELECT personID FROM person WHERE email = @email`);
    return result['recordset']?.[0]?.personID ?? undefined;
}