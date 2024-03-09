export default interface Person {
    personID?: number,
    lastname: string,
    firstname: string,
    dateOfBirth?: Date,
    email: string,
    password: string,
    address?: string | null,
    created_at?: Date,
}

type CategoryRemoveKeys =  'personID' |  'lastname' |  'firstname' |  'dateOfBirth' |  'address' |  'created_at';
export type PersonLogin = Omit<Person, CategoryRemoveKeys>;