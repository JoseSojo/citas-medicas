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
const UniversityModel_1 = __importDefault(require("../model/config/UniversityModel"));
class UniversityFixtures extends AbstractFixture_1.default {
    constructor() {
        super();
    }
    push() {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = new UserModel_1.default();
            const university = new UniversityModel_1.default();
            const address = new AddressSubModel_1.default();
            const resultAddress = yield address.findManyAdress({ filter: {}, skip: 0, take: 20 });
            if (!resultAddress)
                return;
            const current = [`Universidad Central de Venezuela`, `Universidad de los Andes`, `Universidad Simón Bolívar`, `Universidad de Carabobo`, `Universidad del Zulia`, `Universidad Católica Andrés Bello`, `Universidad Metropolitana`, `Universidad Monteávila`];
            const currentUser = yield instance.findUser({ filter: { role: `ADMIN` } });
            if (!currentUser)
                return;
            for (let i = 0; i < current.length; i++) {
                const address = resultAddress[this.SelectMinMax({ min: 0, max: resultAddress.length - 1 })];
                university.createUniversity({ data: {
                        name: current[i],
                        createReference: { connect: { id: currentUser.id } },
                        withAddress: {
                            create: {
                                adressReference: { connect: { id: address.id } }
                            }
                        }
                    } });
            }
        });
    }
}
exports.default = UniversityFixtures;
