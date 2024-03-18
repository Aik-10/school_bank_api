import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CardController } from "../../Controllers/CardController";

async function UserInformation(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const { id, action } = request.params as unknown as { id: number, action?: string };
        if (!id) {
            throw new Error("Invalid Card id");
        }

        const cardModel = new CardController(id);
        await cardModel.initialize();

        const pageString = await request.query.get('page');
        const page = pageString ? parseFloat(pageString) : 0;

        const transactions = await cardModel.getAccountTransaction(page);

        let result;

        switch (action) {
            case 'transaction':
                result = { transactions: await stripTransactionDetails(transactions) }
                break;
            default:
                result = {
                    cardType: await cardModel.getCardType(),
                    balance: await cardModel.getAccountBalance(),
                    creditLimit: await cardModel.getAccountCreditLimit(),
                    transactions: await stripTransactionDetails(transactions)
                }
        }

        return { jsonBody: result };
    } catch (err: any) {
        return { status: 500, body: JSON.stringify({ error: err.message }) };
    }
};

const stripTransactionDetails = async (transactions): Promise<any[]> => {
    return transactions.map(({ TransactionID, AccountID, ...rest }) => rest);
}

app.http('user-card-data', {
    route: "user/card/{id}/{action?}",
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: UserInformation
});