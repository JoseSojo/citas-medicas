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
const client_1 = require("@prisma/client");
const CreateUserForm_1 = require("../../form/CreateUserForm");
const NotificationModel_1 = __importDefault(require("../../model/user/notification/NotificationModel"));
const UserModel_1 = __importDefault(require("../../model/user/UserModel"));
class HistoryController extends AbstractController_1.default {
    constructor() {
        super();
    }
    RenderList(req, res) {
        const _super = Object.create(null, {
            getRoles: { get: () => super.getRoles }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const instance = new UserModel_1.default();
            const noti = new NotificationModel_1.default();
            const user = req.user;
            const { action, entity, param } = req.query;
            let queryString = ``;
            const take = req.query.take ? Number(req.query.take) : 10;
            const skip = req.query.skip ? Number(req.query.skip) : 0;
            const filter = [];
            if (param) {
                filter.push({ description: { contains: param } });
                queryString += `param=${param}`;
            }
            if (action) {
                if (action == `delete`)
                    filter.push({ description: { contains: `liminaci` } });
                if (action == `create`)
                    filter.push({ description: { contains: `reaci` } });
                if (action == `update`)
                    filter.push({ description: { contains: `ctuali` } });
                if (action == `recovery`)
                    filter.push({ description: { contains: `ecuperaci` } });
                queryString += `action=${action}`;
            }
            if (entity) {
                filter.push({ objectName: { contains: param } });
                queryString += `entity=${entity}`;
            }
            const listPromise = instance.findManyUserHistory({
                filter: { AND: [{ OR: filter }] },
                skip,
                take,
            });
            const countPromise = instance.findManyCount({ filter: { AND: [{ OR: filter }] } });
            const returnData = {
                titlePag: `Historial`,
                notFoundMessage: `No hay historial`,
                labels: [`Fecha`, `Descripción`, `Creador`, ``],
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
                form: CreateUserForm_1.CreateUserFrom,
                filter: {
                    skip,
                    take,
                    action,
                    entity
                }
            };
            const list = yield listPromise;
            const count = yield countPromise;
            // next
            returnData.foundNext = count - skip > 10 ? true : false;
            returnData.urlNext = `/history/?skip=${skip + 10}&take=${take}`;
            // previus
            returnData.foundPrevious = take <= skip ? true : false;
            returnData.urlPrevious = `/history/?skip=${skip - 10}&take=${take}`;
            if (queryString) {
                returnData.urlNext += `&${queryString}`;
                returnData.urlPrevious += `&${queryString}`;
            }
            returnData.list = list;
            returnData.countRender = `${count - skip < 11 ? count : skip + take}/${count}`;
            return res.render(`s/history.hbs`, returnData);
        });
    }
    Restore(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const instance = new UserModel_1.default();
            const { name, id } = req.body;
            const prisma = new client_1.PrismaClient();
            switch (name) {
                case `user`:
                    yield prisma.user.update({ data: { isDelete: false }, where: { id } });
                    yield instance.CreateHistory({ des: `Recuperación de usuario`, name: `user`, userId: user.id, id: id });
                    req.flash(`succ`, `Registro recuperado`);
                    return res.redirect(`/user/${id}`);
                    break;
                case `university`:
                    yield prisma.university.update({ data: { isDelete: false }, where: { id } });
                    yield instance.CreateHistory({ des: `Recuperación de universidad`, name: `user`, userId: user.id, id: id });
                    req.flash(`succ`, `Registro recuperado`);
                    return res.redirect(`/university/${id}`);
                    break;
                case `speciality`:
                    yield prisma.speciality.update({ data: { isDelete: false }, where: { id } });
                    yield instance.CreateHistory({ des: `Recuperación de especialidad`, name: `user`, userId: user.id, id: id });
                    req.flash(`succ`, `Registro recuperado`);
                    return res.redirect(`/speciality/${id}`);
                    break;
                default:
                    break;
            }
            return res.redirect(`/history`);
        });
    }
    loadRoutes() {
        this.router.get(`/history/`, auth_1.OnSession, auth_1.OnAdmin, this.RenderList);
        this.router.post(`/history/restore`, auth_1.OnSession, auth_1.OnAdmin, this.Restore);
        return this.router;
    }
}
exports.default = HistoryController;
