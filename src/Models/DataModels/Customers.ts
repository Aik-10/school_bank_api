export default interface Customer {
    customerID?: number,
    personID: number,
    customerType?: CustomerType,
}

enum CustomerType {
    'A', 'B'
}