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
const UniversityModel_1 = __importDefault(require("../../../model/config/UniversityModel"));
const AddressSubModel_1 = __importDefault(require("../../../model/config/AddressSubModel"));
const CreateUniversityForm_1 = require("../../../form/CreateUniversityForm");
const NotificationModel_1 = __importDefault(require("../../../model/user/notification/NotificationModel"));
class UniversityController extends AbstractController_1.default {
    constructor() {
        super();
    }
    RenderList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = new UniversityModel_1.default();
            const address = new AddressSubModel_1.default();
            const noti = new NotificationModel_1.default();
            const user = req.user;
            const { param } = req.query;
            let queryString = ``;
            const addressListPromise = address.findManyAdress({ filter: {}, skip: 0, take: 500 });
            const take = req.query.take ? Number(req.query.take) : 10;
            const skip = req.query.skip ? Number(req.query.skip) : 0;
            const filter = [];
            if (param) {
                queryString += `param=${param}`;
                filter.push({ name: { contains: param } });
            }
            const listPromise = instance.findManyUniversity({
                filter: { AND: [{ isDelete: false }, { OR: filter }] },
                skip,
                take,
            });
            const countPromise = instance.countUniversityBy({ filter: { AND: [{ isDelete: false }, { OR: filter }] } });
            const returnData = {
                titlePag: `Universidad`,
                notFoundMessage: `No hay universidades`,
                labels: [`Nombre`, `Especialidad`, `Cirujano`, `Dirección`, `Creador`, ``],
                list: [],
                countRender: ``,
                foundNext: false,
                urlNext: ``,
                address: [],
                foundPrevious: false,
                urlPrevious: ``,
                notifications: yield noti.GetNowNotification({ id: user.id }),
                form: CreateUniversityForm_1.CreateUniversityFrom,
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
            returnData.urlNext = `/university/?skip=${skip + 10}&take=${take}`;
            // previus
            returnData.foundPrevious = take <= skip ? true : false;
            returnData.urlPrevious = `/university/?skip=${skip - 10}&take=${take}`;
            if (queryString) {
                returnData.urlNext += `&${queryString}`;
                returnData.urlPrevious += `&${queryString}`;
            }
            returnData.list = list;
            returnData.countRender = `${count - skip < 11 ? count : skip + take}/${count}`;
            returnData.address = yield addressListPromise;
            return res.render(`s/university/list.hbs`, returnData);
        });
    }
    RenderUnique(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const instance = new UniversityModel_1.default();
            const noti = new NotificationModel_1.default();
            const user = req.user;
            const data = instance.findUniversity({ filter: { id } });
            const dataReturn = {
                data: {},
                form: {},
                notifications: yield noti.GetNowNotification({ id: user.id })
            };
            dataReturn.data = yield data;
            dataReturn.form = (0, CreateUniversityForm_1.UpdateUniversityFrom)(dataReturn.data.id);
            return res.render(`s/university/unique.hbs`, dataReturn);
        });
    }
    CreateLogic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instance = new UniversityModel_1.default();
                const { name, adressId } = req.body;
                const user = req.user;
                const create = yield instance.createUniversity({
                    data: {
                        name,
                        createReference: { connect: { id: user.id } },
                        withAddress: {
                            create: {
                                adressReference: { connect: { id: adressId } }
                            }
                        }
                    }
                });
                yield instance.CreateHistory({ des: `Creación de universidad ${name} dirección:${create.withAddress[0].adressReference.description}`, name: `university`, userId: user.id });
                req.flash(`succ`, `Universidad creada`);
                return res.redirect(`/university/`);
            }
            catch (error) {
                req.flash(`Error`, `Error temporal`);
                return res.redirect(`/university/`);
            }
        });
    }
    EditLogic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instance = new UniversityModel_1.default();
                const { name } = req.body;
                const id = req.params.id;
                const update = yield instance.updateUniversity({
                    data: {
                        name,
                    },
                    filter: { id }
                });
                req.flash(`succ`, `Universidad actualizada`);
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
                const instance = new UniversityModel_1.default();
                const id = req.params.id;
                const currentDelete = yield instance.deleteUniversity({ id });
                req.flash(`succ`, `Eliminado exitosamente.`);
                return res.redirect(`/university/`);
            }
            catch (error) {
                req.flash(`Error`, `Error temporal`);
                return res.redirect(`/university/`);
            }
        });
    }
    loadRoutes() {
        this.router.get(`/university/`, auth_1.OnSession, this.RenderList);
        this.router.post(`/university/create`, auth_1.OnSession, this.CreateLogic);
        this.router.get(`/university/:id`, auth_1.OnSession, this.RenderUnique);
        this.router.post(`/university/:id/delete`, auth_1.OnSession, this.DeleteLogic);
        this.router.post(`/university/:id/update`, auth_1.OnSession, this.EditLogic);
        return this.router;
    }
}
exports.default = UniversityController;
