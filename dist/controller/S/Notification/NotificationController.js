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
const NotificationModel_1 = __importDefault(require("../../../model/user/notification/NotificationModel"));
const auth_1 = require("../../../middlewares/auth");
class NotificationController extends AbstractController_1.default {
    constructor() {
        super();
    }
    RenderList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = new NotificationModel_1.default();
            const noti = new NotificationModel_1.default();
            const { param } = req.query;
            let queryString = ``;
            const user = req.user;
            const take = req.query.take ? Number(req.query.take) : 10;
            const skip = req.query.skip ? Number(req.query.skip) : 0;
            const filter = [];
            filter.push({ isDelete: false });
            filter.push({ fromId: user.id });
            filter.push({ toId: user.id });
            if (param) {
                queryString += `param=${param}`;
                filter.push({ message: { contains: param } });
                filter.push({ subject: { contains: param } });
            }
            const listPromise = instance.findManyNotification({
                filter: { AND: [{ isDelete: false }, { OR: filter }] },
                skip,
                take,
            });
            const countPromise = instance.countNotification({ filter: { AND: [{ isDelete: false }, { OR: filter }] } });
            const returnData = {
                titlePag: `Notificaciones`,
                notFoundMessage: `No hay notificaciones`,
                labels: [`Mensaje`, `Desde`, `Para`, `Asunto`, ``],
                list: [],
                countRender: ``,
                foundNext: false,
                urlNext: ``,
                foundPrevious: false,
                urlPrevious: ``,
                address: [],
                speciality: [],
                notifications: yield noti.GetNowNotification({ id: user.id }),
                filter: {
                    skip,
                    take,
                    param,
                }
            };
            const list = yield listPromise;
            const count = yield countPromise;
            // next
            returnData.foundNext = count - skip > 10 ? true : false;
            returnData.urlNext = `/notification/?skip=${skip + 10}&take=${take}`;
            // previus
            returnData.foundPrevious = take <= skip ? true : false;
            returnData.urlPrevious = `/notification/?skip=${skip - 10}&take=${take}`;
            if (queryString) {
                returnData.urlNext += `&${queryString}`;
                returnData.urlPrevious += `&${queryString}`;
            }
            returnData.list = list;
            returnData.countRender = `${count - skip < 11 ? count : skip + take}/${count}`;
            return res.render(`s/notification/list.hbs`, returnData);
        });
    }
    CreateLogic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instance = new NotificationModel_1.default();
                const { message, toId, subject, toRole } = req.body;
                const user = req.user;
                let data = {
                    message,
                    subject,
                    fromReference: { connect: { id: user.id } }
                };
                if (toRole) {
                    data = Object.assign(Object.assign({}, data), { toRole });
                }
                if (toId) {
                    data = Object.assign(Object.assign({}, data), { toReference: { connect: { id: toId } } });
                }
                try {
                    const create = yield instance.createNotification({ data });
                }
                catch (error) {
                    req.flash(`Error`, `Error temporal`);
                    return res.redirect(`/notification/`);
                }
                req.flash(`succ`, `Notificado.`);
                return res.redirect(`/user/${toId}`);
            }
            catch (error) {
                req.flash(`Error`, `Error temporal`);
                return res.redirect(`/notification/`);
            }
        });
    }
    DeleteLogic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instance = new NotificationModel_1.default();
                const id = req.params.id;
                yield instance.deleteNotification({ id });
                req.flash(`succ`, `Eliminado exitosamente.`);
                return res.redirect(`/notification/`);
            }
            catch (error) {
                req.flash(`Error`, `Error temporal`);
                return res.redirect(`/notification/`);
            }
        });
    }
    ReadNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instance = new NotificationModel_1.default();
                const id = req.params.id;
                yield instance.updateNotification({
                    data: { read: true }, filter: { id }
                });
                req.flash(`succ`, `Notificación leída.`);
                return res.redirect(`/notification`);
            }
            catch (error) {
                req.flash(`Error`, `Error temporal`);
                return res.redirect(`/notification`);
            }
        });
    }
    RenderUnique(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const noti = new NotificationModel_1.default();
            const user = req.user;
            const data = noti.findNotification({ filter: { id } });
            const dataReturn = {
                data: [],
                form: {},
                notifications: yield noti.GetNowNotification({ id: user.id })
            };
            dataReturn.data = yield data;
            return res.render(`s/notification/unique.hbs`, dataReturn);
        });
    }
    loadRoutes() {
        this.router.get(`/notification/`, auth_1.OnSession, auth_1.OnAdminORDoctor, this.RenderList);
        this.router.get(`/notification/:id`, auth_1.OnSession, auth_1.OnAdminORDoctor, this.RenderUnique);
        this.router.post(`/notification/:id/create`, auth_1.OnSession, this.CreateLogic);
        this.router.post(`/notification/:id/read`, auth_1.OnSession, this.ReadNotification);
        this.router.post(`/notification/:id/delete`, auth_1.OnSession, this.DeleteLogic);
        return this.router;
    }
}
exports.default = NotificationController;
