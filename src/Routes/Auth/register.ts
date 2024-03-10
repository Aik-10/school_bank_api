import Person from '../../Models/DataModels/Person';
import { getPoolConnection } from '../../Handler/Database'
import { PasswordManager } from '../../Controllers/PasswordManager'
import sql from 'mssql'
import { HttpRequest, HttpResponseInit } from "@azure/functions";

export const AuthRegisterRoute = async (request: HttpRequest): Promise<HttpResponseInit> => {
    try {
        const person: Person = JSON.parse(await request.text());
        const isEmailAllReadyExist = await getPersonEmailAmount(person);

        // ** Add a condition if the user exist we will send the response as email all ready exist
        if (isEmailAllReadyExist > 0) {
            console.log("Email all ready in use")
            return {
                status: 400,
                body: "Email all ready in use",
            };
        }

        const passManager = new PasswordManager(person.password);
        const passHash = await passManager.hashPasswordString();

        if (!passHash) {
            console.log("Password hashing get some error, please try again new password")
            return {
                status: 400,
                body: "Password hashing get some error, please try again new password",
            };
        }

        person.password = passHash;
        const poolConnection = await getPoolConnection();

        const result = await poolConnection
            .input('firstname', sql.VarChar, person.firstname)
            .input('lastname', sql.VarChar, person.lastname)
            .input('address', sql.VarChar, person.address)
            .input('email', sql.VarChar, person.email)
            .input('password', sql.VarChar, person.password)
            .query(`INSERT INTO person (firstname ,lastname ,address ,email ,password) VALUES (@firstname,@lastname,@address,@email,@password)`)

        console.log("New person register", person)

        return {
            status: 201,
            body: JSON.stringify({
                success: true,
                message: " User created Successfully",
                user: person,
            })
        };
    } catch (error: any) {
        console.error(error);

        return {
            status: 400,
            body: error.message.toString(),
        };
    }
};

const getPersonEmailAmount = async ({ email }: Person): Promise<number> => {
    const poolConnection = await getPoolConnection();
    const result = await poolConnection
        .input('email', sql.VarChar, email)
        .query(`SELECT COUNT(email) as amount FROM person WHERE email = @email`);

    return result['recordset']?.[0]?.amount ?? 0;
}