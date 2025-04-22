import AbstractFixture from "./AbstractFixture";
import UserModel from "../model/user/UserModel";
import AdressSubModel from "../model/config/AddressSubModel";

export default class AddressFixtures extends AbstractFixture {

    constructor() {
        super();
    }

    public async push() {
        const instance = new UserModel();
        const address = new AdressSubModel();
        const resultAddress = [];
        const addressCurrent = this.Address();

        console.log(`CREANDO DIRECCIONES....`);

        const parent = await address.createAdress({ data:{
            description: `Guárico`,
        } });

        for (let i = 0; i < addressCurrent.length; i++) {
            const result = await address.createAdress({ data:{description:addressCurrent[i], parentReference:{connect:{id:parent.id}}} });
            resultAddress.push(result);
        }

        console.log(`DIRECCIONES CREADOS....`);
    }

}
