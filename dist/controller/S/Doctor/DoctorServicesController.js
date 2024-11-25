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
const auth_1 = require("../../../middlewares/auth");
const AbstractController_1 = __importDefault(require("../../AbstractController"));
const NotificationModel_1 = __importDefault(require("../../../model/user/notification/NotificationModel"));
const ServiceModel_1 = __importDefault(require("../../../model/services/ServiceModel"));
class ServicesControlelr extends AbstractController_1.default {
    constructor() {
        super();
    }
    RenderList(req, res) {
        const _super = Object.create(null, {
            getRoles: { get: () => super.getRoles }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const instance = new ServiceModel_1.default();
            const noti = new NotificationModel_1.default();
            const user = req.user;
            const { param, role } = req.query;
            let queryString = ``;
            const take = req.query.take ? Number(req.query.take) : 10;
            const skip = req.query.skip ? Number(req.query.skip) : 0;
            const filter = [];
            // filter.push({ isDelete:false });
            if (param)
                filter.push({ name: { contains: param } });
            const listPromise = instance.findManyServices({
                filter: { AND: [{ isDelete: false }, { OR: filter }] },
                skip,
                take,
            });
            const countPromise = instance.countServices({ filter: { AND: [{ isDelete: false }, { OR: filter }] } });
            const returnData = {
                titlePag: `Servicios`,
                notFoundMessage: `No hay servicios`,
                labels: [`Nombre`, `Descripción`],
                list: [],
                countRender: ``,
                foundNext: false,
                urlNext: ``,
                foundPrevious: false,
                urlPrevious: ``,
                roleList: _super.getRoles.call(this),
                address: [],
                speciality: [],
                notifications: yield noti.GetNowNotification({ id: user.id }),
                filter: {
                    skip,
                    take,
                    param,
                    role
                }
            };
            const list = yield listPromise;
            const count = yield countPromise;
            // next
            returnData.foundNext = count - skip > 10 ? true : false;
            returnData.urlNext = `/service/?skip=${skip + 10}&take=${take}`;
            // previus
            returnData.foundPrevious = take <= skip ? true : false;
            returnData.urlPrevious = `/service/?skip=${skip - 10}&take=${take}`;
            if (queryString) {
                returnData.urlNext += `&${queryString}`;
                returnData.urlPrevious += `&${queryString}`;
            }
            returnData.list = list;
            returnData.countRender = `${count - skip < 11 ? count : skip + take}/${count}`;
            return res.render(`s/service/list.hbs`, returnData);
        });
    }
    CreateLogic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = new ServiceModel_1.default();
            const { name, description } = req.body;
            const user = req.user;
            const data = {
                description,
                name,
                doctorReference: {
                    connect: { id: user.id }
                }
            };
            const result = yield instance.createServices({ data });
            req.flash(`succ`, `Servicio creado`);
            return res.redirect(`/service`);
        });
    }
    DoctorQuote(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const noti = new NotificationModel_1.default();
            const user = req.user;
            const dataReturn = {
                notifications: yield noti.GetNowNotification({ id: user.id })
            };
            return res.render(`s/quote/list.hbs`, dataReturn);
        });
    }
    loadRoutes() {
        this.router.get(`/service`, auth_1.OnSession, auth_1.OnDoctor, this.RenderList);
        this.router.post(`/service`, auth_1.OnSession, auth_1.OnDoctor, this.RenderList);
        this.router.post(`/service/create`, auth_1.OnSession, auth_1.OnDoctor, this.CreateLogic);
        return this.router;
    }
}
exports.default = ServicesControlelr;
