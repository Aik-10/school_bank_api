
interface UserCreateProps {
    firstname: string,
    lastname: string,
    dob: Date,
    address: string,
    email: string,
    password: string
}


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
    lastname: string, firstname: string, email: string, customerId: number
}