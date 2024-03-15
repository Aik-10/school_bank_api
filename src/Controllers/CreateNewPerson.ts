import { VarChar, Int } from 'mssql'
import Person from "../Models/DataModels/Person";
import { PasswordManager } from "./PasswordManager";
import { getPoolConnection } from "../Handler/Database";

export const CreateNewUser = async ({ lastname, firstname, email, password }: Person): Promise<CreatePerson> => {

    try {
        /* Handling duplicate email */
        const emailExists = await getPersonEmailAmount({ email } as Person);
        if (emailExists > 0) {
            throw new Error('Email is already in system.')
        }

        /* Handling password & password hashing */
        const passManager = new PasswordManager(password);
        const passHash = await passManager.hashPasswordString();

        if (!passHash) {
            throw new Error('Password hashing get some error, please try again new password.')
        }

        /* Changing readable STRING password to hashed one. */
        password = passHash;

        const User = await createUserRow({ lastname, firstname, email, password });
        const customers = await createCustomerRow({ userId: User });

        return {
            lastname, firstname, email, customerId: customers
        }
    } catch (err: any) {
        console.error(err);
        throw err;
    }
}

const createCustomerRow = async ({ userId }: CreateCustomerRowProps): Promise<number> => {
    const poolConnection = await getPoolConnection();
    const result = await poolConnection
        .input('userId', Int, userId)
        .query(`INSERT INTO Customers (UserID) VALUES (@userId)`)

    console.log("createCustomerRow")
    console.log(result);


    return 3;
};

const createUserRow = async ({ lastname, firstname, email, password }: Person): Promise<number> => {
    const poolConnection = await getPoolConnection();

    const result = await poolConnection
        .input('firstname', VarChar, firstname)
        .input('lastname', VarChar, lastname)
        .input('email', VarChar, email)
        .input('password', VarChar, password)
        .query(`INSERT INTO Users (FirstName, LastName, Email, Password) VALUES (@firstname,@lastname,@email,@password)`)

    console.log("createUserRow")
    console.log(result);

    return 1;
};


const getPersonEmailAmount = async ({ email }: Person): Promise<number> => {
    const poolConnection = await getPoolConnection();
    const result = await poolConnection
        .input('email', VarChar, email)
        .query(`SELECT COUNT(Email) as amount FROM Users WHERE Email = @email`);

    return result['recordset']?.[0]?.amount ?? 0;
}

