import sql from 'mssql'
import { getPoolConnection } from '../../../Handler/Database'
import { HttpRequest, HttpResponseInit } from "@azure/functions";

export const AuthCardCheckRoute = async (request: HttpRequest): Promise<HttpResponseInit> => {
    try {
        const id = request.query.get('id');
        if (!id ) {
            throw new Error('Invalid param!');
        }
        const amount = await getCardAmountById(id);

        return {
            status: 201,
            jsonBody: {
                status: (amount > 0)
            }
        };
    } catch (error: any) {
        console.error(error);

        return {
            status: 400,
            body: error.message.toString(),
        };
    }
};

const getCardAmountById = async (cardID: string): Promise<number> => {
    const poolConnection = await getPoolConnection();
    const result = await poolConnection
        .input('cardID', sql.VarChar, cardID)
        .query(`SELECT COUNT(PhysicalCardID) as amount FROM PhysicalCards WHERE PhysicalCardID = @cardID`);

    return result['recordset']?.[0]?.amount ?? 0;
}