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
class SpecialityFixtures extends AbstractFixture_1.default {
    constructor() {
        super();
    }
    push() {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = new UserModel_1.default();
            const address = new AddressSubModel_1.default();
            const speciality = new SpecialityModel_1.default();
            console.log(`CREANDO ESPECIALIDADES....`);
            const names = [`Cardiología`, `Neumología`, `Gastroenterología`, `Oftalmología`, `Otorrinolaringología`, `Urología`, `Ortodoncia`, `Psiquiatría`, `Psicología`, `Endocrinología`, `Reumatología`, `Nefrología`, `Pediatria`, `Geriatría`, `Dermatología`, `Anestesiología`, `Radiología`, `Patología`, `Inmunología`, `Oncología`];
            names.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                yield speciality.createSpeciality({ data: { name: item, description: `Descripción ${item}` } });
                console.log(`${item} creado`);
            }));
            console.log(`ESPECIALIDADES CREADOS....`);
        });
    }
}
exports.default = SpecialityFixtures;
