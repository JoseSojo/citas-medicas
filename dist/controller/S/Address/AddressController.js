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
const AddressSubModel_1 = __importDefault(require("../../../model/config/AddressSubModel"));
const CreateAddressFrom_1 = require("../../../form/CreateAddressFrom");
const NotificationModel_1 = __importDefault(require("../../../model/user/notification/NotificationModel"));
class AdressController extends AbstractController_1.default {
    constructor() {
        super();
    }
    RenderList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = new AddressSubModel_1.default();
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
                filter.push({ description: { contains: param } });
            }
            const listPromise = instance.findManyAdress({
                filter: { AND: [{ isDelete: false }, { OR: filter }] },
                skip,
                take,
            });
            const countPromise = instance.countAdressBy({ filter: { AND: [{ isDelete: false }, { OR: filter }] } });
            const returnData = {
                titlePag: `Dirección`,
                notFoundMessage: `No hay direcciones`,
                labels: [`Descripción`, `Usuarios`, `Sub direcciones`, ``],
                list: [],
                countRender: ``,
                foundNext: false,
                urlNext: ``,
                foundPrevious: false,
                urlPrevious: ``,
                notifications: yield noti.GetNowNotification({ id: user.id }),
                form: CreateAddressFrom_1.CreateAddressFrom,
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
            returnData.urlNext = `/address/?skip=${skip + 10}&take=${take}`;
            // previus
            returnData.foundPrevious = take <= skip ? true : false;
            returnData.urlPrevious = `/address/?skip=${skip - 10}&take=${take}`;
            if (queryString) {
                returnData.urlNext += `&${queryString}`;
                returnData.urlPrevious += `&${queryString}`;
            }
            returnData.list = list;
            returnData.countRender = `${count - skip < 11 ? count : skip + take}/${count}`;
            return res.render(`s/address/list.hbs`, returnData);
        });
    }
    RenderUnique(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const noti = new NotificationModel_1.default();
            const instance = new AddressSubModel_1.default();
            const user = req.user;
            const data = instance.findAdress({ filter: { id } });
            const dataReturn = {
                data: {},
                form: {},
                notifications: yield noti.GetNowNotification({ id: user.id })
            };
            dataReturn.data = yield data;
            dataReturn.form = (0, CreateAddressFrom_1.UpdateDirecciónFrom)(dataReturn.data.id);
            return res.render(`s/address/unique.hbs`, dataReturn);
        });
    }
    CreateLogic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instance = new AddressSubModel_1.default();
                const { description, parentId } = req.body;
                const user = req.user;
                if (!description) {
                    req.flash(`error`, `Debe completar los datos correctamente`);
                    return res.redirect(`/address/`);
                }
                if (parentId) {
                    const parentInstance = instance.findAdress({ filter: { id: parentId } });
                    const createPromise = instance.createAdress({
                        data: { description, parentReference: { connect: { id: parentId } } }
                    });
                    const currentParent = yield parentInstance;
                    const create = yield createPromise;
                    yield instance.CreateHistory({ des: `Creación de subdirección ${description} en ${currentParent === null || currentParent === void 0 ? void 0 : currentParent.description}`, name: `address`, userId: user.id });
                    req.flash(`succ`, `Dirección creada`);
                    return res.redirect(`/address/`);
                }
                const create = yield instance.createAdress({
                    data: {
                        description,
                    }
                });
                yield instance.CreateHistory({ des: `Creación de dirección`, name: `address`, userId: user.id });
                req.flash(`succ`, `Dirección creada`);
                return res.redirect(`/address/`);
            }
            catch (error) {
                console.debug(error);
                req.flash(`Error`, `Error temporal`);
                return res.redirect(`/address/`);
            }
        });
    }
    EditLogic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instance = new AddressSubModel_1.default();
                const { description } = req.body;
                const id = req.params.id;
                const user = req.user;
                if (!description) {
                    req.flash(`error`, `Debe completar los datos correctamente`);
                    return res.redirect(`/address/`);
                }
                const update = yield instance.updateAdress({
                    data: {
                        description,
                    },
                    filter: { id }
                });
                yield instance.CreateHistory({ des: `Actualización de dirección/subdirección ${description}`, name: `address`, userId: user.id });
                req.flash(`succ`, `Dirección creada`);
                return res.redirect(`/address/`);
            }
            catch (error) {
                req.flash(`Error`, `Error temporal`);
                return res.redirect(`/address/`);
            }
        });
    }
    DeleteLogic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instance = new AddressSubModel_1.default();
                const id = req.params.id;
                const user = req.user;
                const currentDelete = yield instance.deleteAdress({ id });
                yield instance.CreateHistory({ des: `Eliminación de dirección ${currentDelete.description}`, name: `address`, userId: user.id });
                req.flash(`succ`, `Eliminado exitosamente.`);
                return res.redirect(`/address/`);
            }
            catch (error) {
                req.flash(`Error`, `Error temporal`);
                return res.redirect(`/address/`);
            }
        });
    }
    loadRoutes() {
        this.router.get(`/address/`, auth_1.OnSession, this.RenderList);
        this.router.get(`/address/:id`, auth_1.OnSession, this.RenderUnique);
        this.router.post(`/address/create`, auth_1.OnSession, this.CreateLogic);
        this.router.post(`/address/:id/delete`, auth_1.OnSession, this.DeleteLogic);
        this.router.post(`/address/:id/update`, auth_1.OnSession, this.EditLogic);
        return this.router;
    }
}
exports.default = AdressController;
