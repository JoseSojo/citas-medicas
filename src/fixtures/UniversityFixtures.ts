import AbstractFixture from "./AbstractFixture";
import UserModel from "../model/user/UserModel";
import AdressSubModel from "../model/config/AddressSubModel";
import UniversityModel from "../model/config/UniversityModel";

export default class UniversityFixtures extends AbstractFixture {

    constructor() {
        super();
    }

    public async push() {
        const instance = new UserModel();
        const university = new UniversityModel();
        const address = new AdressSubModel();
        const resultAddress = await address.findManyAdress({ filter:{}, skip:0, take:20 });

        if(!resultAddress) return;
        const current = [`Universidad Central de Venezuela`,`Universidad de los Andes`,`Universidad Simón Bolívar`,`Universidad de Carabobo`,`Universidad del Zulia`,`Universidad Católica Andrés Bello`,`Universidad Metropolitana`,`Universidad Monteávila`];

        console.log(`CREANDO UNIVERSIDADES....`);

        const currentUser = await instance.findUser({ filter:{role:`ADMIN`} });

        if(!currentUser) return console.log(`no hay usuarios`)

        for (let i = 0; i < current.length; i++) {
            const address = resultAddress[this.SelectMinMax({ min:0,max:resultAddress.length-1 })];
            console.log(`Universidad => ${current[i]} ubicada en => ${address.description} (${address.id})`)
            university.createUniversity({ data:{
                name: current[i],
                createReference: { connect:{id:currentUser.id} },
                withAddress: {
                    create: {
                        adressReference: { connect:{ id:address.id } }
                    }
                }
            } })
        }

        console.log(`UNIVERSIDADES CREADOS....`);
    }

}
