export default interface Person {
    personID?: number,
    lastname: string,
    firstname: string,
    email: string,
    password: string,
    created_at?: Date,
}

type CategoryRemoveKeys =  'personID' |  'lastname' |  'firstname' |  'dateOfBirth' |  'address' |  'created_at';
export type PersonLogin = Omit<Person, CategoryRemoveKeys>;