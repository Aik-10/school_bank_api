
interface UserCreateProps {
    firstname: string,
    lastname: string,
    dob: Date,
    address: string,
    email: string,
    password: string
}

type CardRFID = string
type CardId = number

type HealthRouteResponse = {
    uptime: number
    message: 'OK' | string
    date: Date
}


type AuthToken = {
    _id: number,
    email: string,
    iat: number,
    exp: number
}

interface CreateCustomerRowProps {
    userId: number
}


interface CreatePerson {
    lastname: string, firstname: string, email: string, customerId: number, userId: number
}

interface GetJWTProps {
    userId: number, customerId: number, cardType?: string, email: string
}

interface UserResult {
    UserID: number
    FirstName: string
    LastName: string
    Email: string
    CustomerID: number
}
interface UserAccountAction {
    accountId: number;
    amount: number;
}

interface TransactionHistoryProps extends UserAccountAction {
    type: string;
    target: string;
}