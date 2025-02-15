import AbstractFixture from "./AbstractFixture";
import UserModel from "../model/user/UserModel";
import AdressSubModel from "../model/config/AddressSubModel";
import SocialMediaModel from "../model/config/SocialMediaModel";

export default class SocialMediaFixtures extends AbstractFixture {

    constructor() {
        super();
    }

    public async push() {
        const social = new SocialMediaModel();
        const resultAddress = [];
        const currentSocial = this.nativeMediaSocial();
        console.log(`CREANDO MEDIOS SOCIALES....`);

        for (let i = 0; i < currentSocial.length; i++) {
            console.log(currentSocial[i].name, currentSocial[i].linkSource);
            const result = await social.createSocialMedia({ data:{name:currentSocial[i].name,icoUrl:currentSocial[i].linkSource} });
            resultAddress.push(result);
        }


        console.log(`MEDIOS SOCIALES CREADOS....`);
    }

}
