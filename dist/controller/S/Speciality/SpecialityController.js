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
const AbstractController_1 = __importDefault(require("../../AbstractController"));
const auth_1 = require("../../../middlewares/auth");
const SpecialityModel_1 = __importDefault(require("../../../model/config/SpecialityModel"));
const CreateSpecialityForm_1 = require("../../../form/CreateSpecialityForm");
const NotificationModel_1 = __importDefault(require("../../../model/user/notification/NotificationModel"));
class SpecialityController extends AbstractController_1.default {
    constructor(prefix = `/speciality`, instance = new SpecialityModel_1.default()) {
        super();
        this.prefix = prefix;
        this.instance = instance;
    }
    RenderList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = new SpecialityModel_1.default();
            const noti = new NotificationModel_1.default();
            const user = req.user;
            const { param } = req.query;
            let queryString = ``;
            // rol
            // param (email,name,lastname,ci,cmeg,matricula,address)
            const take = req.query.take ? Number(req.query.take) : 10;
            const skip = req.query.skip ? Number(req.query.skip) : 0;
            const filter = [];
            if (param) {
                queryString += `param=${param}`;
                filter.push({ name: { contains: param } });
            }
            const listPromise = instance.findManySpeciality({
                filter: { AND: [{ isDelete: false }, { OR: filter }] },
                skip,
                take,
            });
            const countPromise = instance.countSpecialityBy({ filter: { AND: [{ isDelete: false }, { OR: filter }] } });
            const returnData = {
                titlePag: `Especialidades`,
                notFoundMessage: `No hay especialidad`,
                labels: [`Nombre`, `Descripción`, ``],
                list: [],
                countRender: ``,
                foundNext: false,
                urlNext: ``,
                foundPrevious: false,
                urlPrevious: ``,
                notifications: yield noti.GetNowNotification({ id: user.id }),
                form: CreateSpecialityForm_1.CreateSpecialityFrom,
                filter: {
                    skip,
                    take,
                    param
                }
            };
            const list = yield listPromise;
            const count = yield countPromise;
            // next
            returnData.foundNext = count - skip > 10 ? true : false;
            returnData.urlNext = `/speciality/?skip=${skip + 10}&take=${take}`;
            // previus
            returnData.foundPrevious = take <= skip ? true : false;
            returnData.urlPrevious = `/speciality/?skip=${skip - 10}&take=${take}`;
            if (queryString) {
                returnData.urlNext += `&${queryString}`;
                returnData.urlPrevious += `&${queryString}`;
            }
            returnData.list = list;
            returnData.countRender = `${count - skip < 11 ? count : skip + take}/${count}`;
            return res.render(`s/speciality/list.hbs`, returnData);
        });
    }
    RenderUnique(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const instance = new SpecialityModel_1.default();
            const noti = new NotificationModel_1.default();
            const user = req.user;
            const data = instance.findSpeciality({ filter: { id } });
            const dataReturn = {
                data: {},
                form: {},
                notifications: yield noti.GetNowNotification({ id: user.id })
            };
            dataReturn.data = yield data;
            dataReturn.form = (0, CreateSpecialityForm_1.UpdateSpecialityFrom)(dataReturn.data.id);
            return res.render(`s/speciality/unique.hbs`, dataReturn);
        });
    }
    CreateLogic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instance = new SpecialityModel_1.default();
                const { name, description } = req.body;
                const create = yield instance.createSpeciality({
                    data: { name, description }
                });
                req.flash(`succ`, `Especialidad creada`);
                return res.redirect(`/speciality/`);
            }
            catch (error) {
                req.flash(`Error`, `Error temporal`);
                return res.redirect(`/speciality/`);
            }
        });
    }
    EditLogic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instance = new SpecialityModel_1.default();
                const { description, name } = req.body;
                const id = req.params.id;
                const update = yield instance.updateSpeciality({
                    data: {
                        description, name
                    },
                    filter: { id }
                });
                req.flash(`succ`, `Especialidad creada`);
                return res.redirect(`/speciality/`);
            }
            catch (error) {
                req.flash(`Error`, `Error temporal`);
                return res.redirect(`/speciality/`);
            }
        });
    }
    DeleteLogic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instance = new SpecialityModel_1.default();
                const id = req.params.id;
                const currentDelete = yield instance.deleteSpeciality({ id });
                req.flash(`succ`, `Eliminado exitosamente.`);
                return res.redirect(`/speciality/`);
            }
            catch (error) {
                req.flash(`Error`, `Error temporal`);
                return res.redirect(`/speciality/`);
            }
        });
    }
    loadRoutes() {
        this.router.get(`/speciality/`, auth_1.OnSession, this.RenderList);
        this.router.get(`/speciality/:id`, auth_1.OnSession, this.RenderUnique);
        this.router.post(`/speciality/create`, auth_1.OnSession, this.CreateLogic);
        this.router.post(`/speciality/:id/delete`, auth_1.OnSession, this.DeleteLogic);
        this.router.post(`/speciality/:id/update`, auth_1.OnSession, this.EditLogic);
        return this.router;
    }
}
exports.default = SpecialityController;
