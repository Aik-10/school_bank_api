import { getPoolConnection } from "../Handler/Database";
import Person from "./DataModels/Person";
import { Int } from 'mssql'

export class PersonModel {

    private _personData: Person;

    public get personData(): Person {
        return this._personData;
    }

    public set personData(value: Person) {
        this._personData = value;
    }

    constructor(personId?: number) {
        if (personId) {
            console.log(personId)
            // this._personData.personID = personId;
            this.getPersonData();
        }
    }

    private async getPersonData(): Promise<void> {
        const id = this._personData.personID;

        const poolConnection = await getPoolConnection();

        const result = await poolConnection
            .input('id', Int, 1)
            .query(`SELECT * FROM person WHERE id = @id`);

        // if (!result['recordset']?.[0]) {
        //     console.log("Cannot get person by id: ", id);
        //     return;
        // }

        console.log(result['recordset'])

        // this._personData = result['recordset']?.[0];

    }

}