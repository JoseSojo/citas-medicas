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
const AbstractController_1 = __importDefault(require("../AbstractController"));
const auth_1 = require("../../middlewares/auth");
const UserModel_1 = __importDefault(require("../../model/user/UserModel"));
const SocialMediaModel_1 = __importDefault(require("../../model/config/SocialMediaModel"));
const SpecialityModel_1 = __importDefault(require("../../model/config/SpecialityModel"));
const AddressSubModel_1 = __importDefault(require("../../model/config/AddressSubModel"));
class PublicController extends AbstractController_1.default {
    constructor(prefix = ``) {
        super();
        this.prefix = prefix;
    }
    PorfolioRender(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userInstance = new UserModel_1.default();
            const social = new SocialMediaModel_1.default();
            const { id } = req.query;
            if (!id) {
                req.flash(`err`, `No se pudo obtener el doctor`);
                return res.redirect(`/`);
            }
            const porfolio = userInstance.findUser({ filter: { id: id } });
            const socialMedia = social.findManySocialMedia({ filter: { isDelete: false }, skip: 0, take: 10 });
            const dataReturn = {
                porfolio: yield porfolio,
                social: yield socialMedia
            };
            return res.render(`p/porfolio.hbs`, dataReturn);
        });
    }
    RenderPublic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // models
            const userModel = new UserModel_1.default();
            const specialityMode = new SpecialityModel_1.default();
            const addressModel = new AddressSubModel_1.default();
            const filter = [];
            const filterText = [];
            filter.push({ isDelete: false });
            filter.push({ role: `DOCTOR` });
            // filtros
            const speciality = req.query.specialityId ? req.query.specialityId : null;
            const address = req.query.addressId ? req.query.addressId : null;
            const param = req.query.param ? req.query.param : null;
            const schedule = req.query.schedule ? req.query.schedule : null;
            console.log(speciality);
            if (req.query.specialityId)
                filter.push({ speciality: { some: { id: req.query.specialityId } } });
            const skip = req.query.skip ? req.query.skip : 0;
            const take = req.query.take ? req.query.take : 10;
            if (param) {
                filter.push({ OR: [{ name: { contains: param } }, { lastname: { contains: param } }, { email: { contains: param } }] });
            }
            if (address) {
                filter.push({ addressId: address });
            }
            const count = userModel.countUser({ filter: { AND: filter } });
            const resultPromise = userModel.findManyUser({ filter: { AND: filter }, skip, take });
            return res.render(`p/main.hbs`, {
                list: yield resultPromise,
                count: yield count,
                filterText
            });
        });
    }
    RenderAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userModel = new UserModel_1.default();
            const specialityMode = new SpecialityModel_1.default();
            const addressModel = new AddressSubModel_1.default();
            const param = req.query.param ? req.query.param : ``;
            return res.render(`p/main.hbs`, {
                address: true,
                action: `/p/address`,
                list: yield addressModel.findManyAdress({
                    filter: {
                        AND: [
                            { isDelete: false },
                            { description: { contains: param } }
                        ]
                    },
                    skip: 0,
                    take: 100
                }),
                count: yield addressModel.countAdressBy({
                    filter: {
                        AND: [
                            { isDelete: false },
                            { description: { contains: param } }
                        ]
                    }
                })
            });
        });
    }
    RenderSpeciality(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userModel = new UserModel_1.default();
            const specialityMode = new SpecialityModel_1.default();
            const addressModel = new AddressSubModel_1.default();
            const param = req.query.param ? req.query.param : ``;
            return res.render(`p/main.hbs`, {
                speciality: true,
                action: `/p/speciality`,
                list: yield specialityMode.findManySpeciality({
                    filter: {
                        AND: [
                            { isDelete: false },
                            { name: { contains: param } }
                        ]
                    },
                    skip: 0,
                    take: 100
                }),
                count: yield specialityMode.countSpecialityBy({
                    filter: {
                        AND: [
                            { isDelete: false },
                            { name: { contains: param } }
                        ]
                    }
                })
            });
        });
    }
    RenderMain(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    RenderLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.render(`p/login.hbs`);
        });
    }
    RenderRegister(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.render(`p/register.hbs`);
        });
    }
    loadRoutes() {
        this.router.get(`${this.prefix}/`, auth_1.OffSession, this.RenderPublic);
        this.router.get(`${this.prefix}/p/address`, auth_1.OffSession, this.RenderAddress);
        this.router.get(`${this.prefix}/p/speciality`, auth_1.OffSession, this.RenderSpeciality);
        this.router.get(`${this.prefix}/p/porfolio`, auth_1.OffSession, this.PorfolioRender);
        this.router.get(`${this.prefix}/login`, auth_1.OffSession, this.RenderLogin);
        this.router.get(`${this.prefix}/register`, auth_1.OffSession, this.RenderRegister);
        return this.router;
    }
}
exports.default = PublicController;
