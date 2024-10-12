import UserModel from "../model/user/UserModel";
import AddressFixtures from "./AddressFixturs";
import SocialMediaFixtures from "./SocialMediaFixtures";
import SpecialityFixtures from "./SpecialityFixture";
import UniversityFixtures from "./UniversityFixtures";
import UserFixtures from "./UserFixtures";

const userInstance = new UserFixtures();
const socialInstance = new SocialMediaFixtures();
const addressInstance = new AddressFixtures();
const specialityInstance =  new SpecialityFixtures();
const universityInstance =  new UniversityFixtures();

const instance = new UserModel();


(async () => {
   const userFound = await instance.findUser({ filter:{role:`leni.admin@example.com`} });

   if(!userFound) {
      // user admin
      await instance.createUser({
         data: {
             ci: `00000000`,
             name: `Leni`,
             email: `leni.admin@example.com`,
             lastname: `Admin`,
             password: `1234567890`,
             role: `ADMIN`,
             phoneCode: `0412`,
             phoneNumber: `8606734`
         }
     });
  
   }
   await addressInstance.push();
   await universityInstance.push();
   await specialityInstance.push();
   await socialInstance.push();
   await userInstance.push();
})()
