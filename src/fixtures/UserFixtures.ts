import AbstractFixture from "./AbstractFixture";
import UserModel from "../model/user/UserModel";
import AdressSubModel from "../model/config/AddressSubModel";
import SpecialitySubModel from "../model/config/SpecialityModel";
import UniversityModel from "../model/config/UniversityModel";
import { randomDate } from "../util";

export default class UserFixtures extends AbstractFixture {

    constructor() {
        super();
    }

    public async push() {
        const instance = new UserModel();
        const address = new AdressSubModel();
        const speciality = new SpecialitySubModel();
        const university = new UniversityModel();
        const resultAddress = await address.findManyAdress({ filter:{ children:undefined }, skip:0,take:10 });

        const names = this.Name({});
        const lastnames = this.Lastnames({});
        const phoneCode = this.CodePhone({});
        const phoneNumber = this.GenerateNumber(7);
        const host = this.HostEmail({});
        const specialitys = await speciality.findManySpeciality({ filter:{},skip:0,take:20 });
        const universitys = await university.findManyUniversity({ filter:{},skip:0,take:20 });

        const userFound = await instance.findUser({ filter:{role:`ADMIN`} });
        if(!userFound) return;
        
        for (let i = 0; i < 10; i++) {

            const name = names[this.SelectMinMax({ min:0, max:names.length-1 })];
            const lastname = lastnames[this.SelectMinMax({ min:0, max:lastnames.length-1 })];

            console.log(`PACIENTE`, i, name, lastname);

            await instance.createUser({
                data: {
                    name: name,
                    lastname: lastname,
                    ci: this.GenerateNumber(8),
                    email: `${name}_${lastname}@${host[this.SelectMinMax({ min:0, max:host.length-1 })]}`,
                    password: `1234567890`,
                    role: `PACIENTE`,
                    phoneCode: phoneCode[this.SelectMinMax({ min:0, max:phoneCode.length-1 })],
                    phoneNumber: phoneNumber[this.SelectMinMax({ min:0, max:phoneNumber.length })],
                    addressReference: {
                        connect: { id:resultAddress[this.SelectMinMax({min:0,max:resultAddress.length-1})].id }
                    }
                }
            })
        }

        for (let i = 0; i < 5; i++) {

            const name = names[this.SelectMinMax({ min:0, max:names.length-1 })];
            const lastname = lastnames[this.SelectMinMax({ min:0, max:lastnames.length-1 })];
            const esp = specialitys[this.SelectMinMax({ min:0, max:names.length-1 })];

            console.log(`DOCTOR`, i, name, lastname);

            await instance.createUser({
                data: {
                    name: name,
                    lastname: lastname,
                    ci: this.GenerateNumber(8),
                    email: `${name}_${lastname}@${host[this.SelectMinMax({ min:0, max:host.length-1 })]}`,
                    password: `1234567890`,
                    role: `DOCTOR`,
                    phoneCode: phoneCode[this.SelectMinMax({ min:0, max:phoneCode.length-1 })],
                    phoneNumber: phoneNumber[this.SelectMinMax({ min:0, max:phoneNumber.length })],
                    parentReference: {
                        connect: {
                            id: userFound.id
                        }
                    },
                    addressReference: {
                        connect: { id:resultAddress[this.SelectMinMax({min:0,max:resultAddress.length-1})].id }
                    },
                    speciality: {
                        create: {
                            specialityReference: { connect: { id:esp.id } },
                            date:randomDate(2000,2020).toString(),
                            universityReference: { connect:{ id:universitys[this.SelectMinMax({min:0,max:resultAddress.length-1})].id } }
                        }
                    }
                }
            })
        }

        for (let i = 0; i < 2; i++) {

            const name = names[this.SelectMinMax({ min:0, max:names.length-1 })];
            const lastname = lastnames[this.SelectMinMax({ min:0, max:lastnames.length-1 })];

            console.log(`ADMIN`, i, name, lastname);

            await instance.createUser({
                data: {
                    name: name,
                    lastname: lastname,
                    ci: this.GenerateNumber(8),
                    email: `${name}_${lastname}@${host[this.SelectMinMax({ min:0, max:host.length-1 })]}`,
                    password: `1234567890`,
                    role: `ADMIN`,
                    phoneCode: phoneCode[this.SelectMinMax({ min:0, max:phoneCode.length-1 })],
                    phoneNumber: phoneNumber[this.SelectMinMax({ min:0, max:phoneNumber.length })],
                    addressReference: {
                        connect: { id:resultAddress[this.SelectMinMax({min:0,max:resultAddress.length-1})].id }
                    }
                }
            })
        }

        console.log(`USUARIOS CREADOS....`);
    }

}
