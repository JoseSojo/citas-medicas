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

        for (let i = 0; i < currentSocial.length; i++) {
            const result = await social.createSocialMedia({ data:{name:currentSocial[i].name,icoUrl:currentSocial[i].linkSource} });
            resultAddress.push(result);
        }
    }

}
