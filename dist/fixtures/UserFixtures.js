"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractFixture_1 = __importDefault(require("./AbstractFixture"));
const UserModel_1 = __importDefault(require("../model/user/UserModel"));
const AddressSubModel_1 = __importDefault(require("../model/config/AddressSubModel"));
const SpecialityModel_1 = __importDefault(require("../model/config/SpecialityModel"));
const UniversityModel_1 = __importDefault(require("../model/config/UniversityModel"));
const util_1 = require("../util");
class UserFixtures extends AbstractFixture_1.default {
    constructor() {
        super();
    }
    push() {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = new UserModel_1.default();
            const address = new AddressSubModel_1.default();
            const speciality = new SpecialityModel_1.default();
            const university = new UniversityModel_1.default();
            const resultAddress = yield address.findManyAdress({ filter: { children: undefined }, skip: 0, take: 10 });
            const names = this.Name({});
            const lastnames = this.Lastnames({});
            const phoneCode = this.CodePhone({});
            const phoneNumber = this.GenerateNumber(7);
            const host = this.HostEmail({});
            const specialitys = yield speciality.findManySpeciality({ filter: {}, skip: 0, take: 20 });
            const universitys = yield university.findManyUniversity({ filter: {}, skip: 0, take: 20 });
            const userFound = yield instance.findUser({ filter: { role: `ADMIN` } });
            if (!userFound)
                return;
            for (let i = 0; i < 10; i++) {
                const name = names[this.SelectMinMax({ min: 0, max: names.length - 1 })];
                const lastname = lastnames[this.SelectMinMax({ min: 0, max: lastnames.length - 1 })];
                console.log(`PACIENTE`, i, name, lastname);
                yield instance.createUser({
                    data: {
                        name: name,
                        lastname: lastname,
                        ci: this.GenerateNumber(8),
                        email: `${name}_${lastname}@${host[this.SelectMinMax({ min: 0, max: host.length - 1 })]}`,
                        password: `1234567890`,
                        role: `PACIENTE`,
                        phoneCode: phoneCode[this.SelectMinMax({ min: 0, max: phoneCode.length - 1 })],
                        phoneNumber: phoneNumber[this.SelectMinMax({ min: 0, max: phoneNumber.length })],
                        addressReference: {
                            connect: { id: resultAddress[this.SelectMinMax({ min: 0, max: resultAddress.length - 1 })].id }
                        }
                    }
                });
            }
            for (let i = 0; i < 5; i++) {
                const name = names[this.SelectMinMax({ min: 0, max: names.length - 1 })];
                const lastname = lastnames[this.SelectMinMax({ min: 0, max: lastnames.length - 1 })];
                const esp = specialitys[this.SelectMinMax({ min: 0, max: names.length - 1 })];
                console.log(`DOCTOR`, i, name, lastname);
                yield instance.createUser({
                    data: {
                        name: name,
                        lastname: lastname,
                        ci: this.GenerateNumber(8),
                        email: `${name}_${lastname}@${host[this.SelectMinMax({ min: 0, max: host.length - 1 })]}`,
                        password: `1234567890`,
                        role: `DOCTOR`,
                        phoneCode: phoneCode[this.SelectMinMax({ min: 0, max: phoneCode.length - 1 })],
                        phoneNumber: phoneNumber[this.SelectMinMax({ min: 0, max: phoneNumber.length })],
                        parentReference: {
                            connect: {
                                id: userFound.id
                            }
                        },
                        addressReference: {
                            connect: { id: resultAddress[this.SelectMinMax({ min: 0, max: resultAddress.length - 1 })].id }
                        },
                        speciality: {
                            create: {
                                specialityReference: { connect: { id: esp.id } },
                                date: (0, util_1.randomDate)(2000, 2020).toString(),
                                universityReference: { connect: { id: universitys[this.SelectMinMax({ min: 0, max: resultAddress.length - 1 })].id } }
                            }
                        }
                    }
                });
            }
            for (let i = 0; i < 2; i++) {
                const name = names[this.SelectMinMax({ min: 0, max: names.length - 1 })];
                const lastname = lastnames[this.SelectMinMax({ min: 0, max: lastnames.length - 1 })];
                console.log(`ADMIN`, i, name, lastname);
                yield instance.createUser({
                    data: {
                        name: name,
                        lastname: lastname,
                        ci: this.GenerateNumber(8),
                        email: `${name}_${lastname}@${host[this.SelectMinMax({ min: 0, max: host.length - 1 })]}`,
                        password: `1234567890`,
                        role: `ADMIN`,
                        phoneCode: phoneCode[this.SelectMinMax({ min: 0, max: phoneCode.length - 1 })],
                        phoneNumber: phoneNumber[this.SelectMinMax({ min: 0, max: phoneNumber.length })],
                        addressReference: {
                            connect: { id: resultAddress[this.SelectMinMax({ min: 0, max: resultAddress.length - 1 })].id }
                        }
                    }
                });
            }
            console.log(`USUARIOS CREADOS....`);
        });
    }
}
exports.default = UserFixtures;
