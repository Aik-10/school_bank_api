import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getPoolConnection } from "../../Handler/Database";
import { VarChar, Int, Decimal } from "mssql";

type AccountProps = {
    id: number
    action: 'withdraw' | 'deposit'
    amount?: number
    target?: string
}
async function UserAction(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    
    const { id, action }: any = request.params;
    const amount = await request.query.get('amount');

    if ( !action ) {
        throw new Error("Invalid action");
    }

    switch(action){
        case 'deposit':
            await userAccountDepositAction({ accountId: id, amount });
            break;
        case 'withdraw':
            await userAccountWithDrawAction({ accountId: id, amount });
            break;
        default: 
            throw new Error("Invalid action")
    }
    
    context.log('Http function was triggered.');
    return { jsonBody: true };
};

app.http('user-account-action', {
    route: "user/accounts/{id}/action/{action}",
    methods: ['POST', 'GET'], 
    authLevel: 'anonymous',
    handler: UserAction
});


const userAccountTransactionHistory = async({ type, amount }: any): Promise<void> => {}

const userAccountWithDrawAction = async({ accountId, amount }: any): Promise<void> => {
    const currentBalance = await userAccountBalance({accountId});
    
    /* TODO: credit check */
    if ( amount > currentBalance || currentBalance - amount < 0) {
        throw new Error("Doesnt have enough balance");        
    }

    const poolConnection = await getPoolConnection();

    const result = await poolConnection
        .input('accountid', Int, accountId)
        .input('depositAmount', Decimal, amount)
        .query(`UPDATE Accounts SET Balance = Balance - (@depositAmount) WHERE AccountID = @accountid`);

    if ( result.rowsAffected <= 0 ) {
        throw new Error("Something went wrong.")
    }
}

const userAccountBalance = async({ accountId }: any): Promise<number> => {
    const poolConnection = await getPoolConnection();
    const result = await poolConnection
        .input('accountid', Int, accountId)
        .query(`SELECT Balance FROM Accounts WHERE AccountID = @accountid`);

    return result['recordset']?.[0]?.Balance;
}

const userAccountDepositAction = async({ accountId, amount }: any): Promise<void> => {
    const poolConnection = await getPoolConnection();

    const result = await poolConnection
        .input('accountid', Int, accountId)
        .input('depositAmount', Decimal, amount)
        .query(`UPDATE Accounts SET Balance = Balance + (@depositAmount) WHERE AccountID = @accountid`);

    if ( result.rowsAffected <= 0 ) {
        throw new Error("Something went wrong.")
    }
}

