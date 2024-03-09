import { Request, Response } from 'express';
import Person from '../../Models/DataModels/Person';
import { getPoolConnection } from '../../Handler/Database'
import { PasswordManager } from '../../Controllers/PasswordManager'

export const AuthRegisterRoute = async (req: Request, res: Response) => {
    try {
        const person: Person = req.body;
        const isEmailAllReadyExist = await getPersonEmailAmount(person);

        // ** Add a condition if the user exist we will send the response as email all ready exist
        if (isEmailAllReadyExist > 0) {
            res.status(400).json({
                status: 400,
                message: "Email all ready in use",
            });
            return;
        }

        const passManager = new PasswordManager(person.password);
        const passHash = await passManager.hashPasswordString();

        if (!passHash) {
            res.status(400).json({
                status: 400,
                message: "Password is shit",
            });
            return;
        }

        person.password = passHash;
        const poolConnection = await getPoolConnection();
        await poolConnection?.query(`INSERT INTO person SET ?`, [person])

        res.status(200).json({
            status: 201,
            success: true,
            message: " User created Successfully",
            user: person,
        });
    } catch (error: any) {
        // console the error to debug
        console.log(error);

        // Send the error message to the client
        res.status(400).json({
            status: 400,
            message: error.message.toString(),
        });
    }
};

const getPersonEmailAmount = async ({ email }: Person): Promise<number> => {
    const poolConnection = await getPoolConnection();
    const result = await poolConnection?.query(`SELECT COUNT(email) as amount FROM person WHERE email = ? LIMIT 1`, [email])

    return result?.[0]?.[0].amount ?? 0;
}