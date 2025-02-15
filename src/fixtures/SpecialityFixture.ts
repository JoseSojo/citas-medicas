import AbstractFixture from "./AbstractFixture";
import UserModel from "../model/user/UserModel";
import AdressSubModel from "../model/config/AddressSubModel";
import SpecialitySubModel from "../model/config/SpecialityModel";

export default class SpecialityFixtures extends AbstractFixture {

    constructor() {
        super();
    }

    public async push() {
        const instance = new UserModel();
        const address = new AdressSubModel();
        const speciality = new SpecialitySubModel();

        const names = [`Cardiología`,`Neumología`,`Gastroenterología`,`Oftalmología`,`Otorrinolaringología`,`Urología`,`Ortodoncia`,`Psiquiatría`,`Psicología`,`Endocrinología`,`Reumatología`,`Nefrología`,`Pediatria`,`Geriatría`,`Dermatología`,`Anestesiología`,`Radiología`,`Patología`,`Inmunología`, `Oncología`]

        names.forEach(async (item) => {
            await speciality.createSpeciality({ data:{ name:item,description:`Descripción ${item}` } });
        })
    }

}
