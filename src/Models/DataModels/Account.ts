export default interface Account {
    accountID?: number,
    customerID: number,
    accountNumber: string,
    accountType?: AccountType,
    accountBalance: number,
    accountCreated_at?: Date,
    accountClosed_at?: Date,
    accountStatus?: AccountStatus,
}

enum AccountType {
    'Credit', 'Debit'
}

enum AccountStatus {
    'active', 'closed', 'hold'
}