import jwt from 'jsonwebtoken'
import { Int, VarChar } from 'mssql'
import { getPoolConnection } from '../Handler/Database';

export class LoginController {

    protected readonly userId: number;
    protected readonly cardId: CardRFID;

    constructor(userId: number, cardId?: CardRFID) {
        this.userId = userId;
        if (cardId) {
            this.cardId = cardId;
        }
    }

    public async getToken() {
        if (!this.userId) {
            throw new Error("UserId isnt initialized!");
        }

        const userData = await this.getUserData();
        if (!userData) {
            throw new Error("UserId isnt valid!");
        }

        const cardData = await this.getCardDetails();
        const token = await this.getJWT({ userId: this.userId, email: userData.Email, customerId: userData.CustomerID, cardType: cardData ?? null });

        return {
            token,
            cardType: cardData ?? null,
            fullName: `${userData.FirstName} ${userData.LastName}`
        };
    }

    private async getUserData(): Promise<UserResult> {
        const poolConnection = await getPoolConnection();

        const result = await poolConnection
            .input('userID', Int, this.userId)
            .query(`SELECT u.*, c.CustomerID FROM Users u
                        INNER JOIN Customers c ON c.UserID = u.UserID
                    WHERE u.UserID = @userID`);
        return result['recordset']?.[0] ?? undefined;
    }

    private async getCardDetails(): Promise<string> {
        const poolConnection = await getPoolConnection();

        const result = await poolConnection
            .input('cardID', VarChar, this.cardId)
            .query(`SELECT c.CardType FROM PhysicalCards pc
                    INNER JOIN Cards c ON c.PhysicalCardID = pc.PhysicalCardID
                WHERE pc.PhysicalCardID = @cardID GROUP BY CardType`);

        const str = result['recordset']?.sort((a, b) => {
            if (a.CardType === 'credit') return -1;
            if (b.CardType === 'credit') return 1;
            return 0;
        })
            ?.map(card => card.CardType)
            ?.join(' & ');

        return str ?? undefined;
    }

    private async getJWT({ userId, customerId, cardType, email }: GetJWTProps): Promise<string> {
        return await jwt.sign(
            { _id: userId, _customerId: customerId, type: cardType, email: email }, process.env.API_JWT_TOKEN, { expiresIn: "30min" }
        );
    }
}

