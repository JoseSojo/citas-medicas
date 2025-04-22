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
const SocialMediaModel_1 = __importDefault(require("../../../model/config/SocialMediaModel"));
const CreateSocialForm_1 = require("../../../form/CreateSocialForm");
const NotificationModel_1 = __importDefault(require("../../../model/user/notification/NotificationModel"));
class AdressController extends AbstractController_1.default {
    constructor(prefix = `social`) {
        super();
        this.prefix = prefix;
    }
    RenderList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = new SocialMediaModel_1.default();
            const noti = new NotificationModel_1.default();
            const user = req.user;
            const { param } = req.query;
            let queryString = ``;
            // rol
            // param (email,name,lastname,ci,cmeg,matricula,address)
            const take = req.query.take ? Number(req.query.take) : 20;
            const skip = req.query.skip ? Number(req.query.skip) : 0;
            const filter = [];
            // if(param) {
            //     queryString += `param=${param}`;
            //     filter.push({ name: { contains:param } });
            // }
            const listPromise = instance.findManySocialMedia({
                filter: { AND: [{ isDelete: false }, { OR: filter }] },
                skip,
                take,
            });
            const countPromise = instance.countSocialMedia({ filter: { AND: [{ isDelete: false }, { OR: filter }] } });
            const returnData = {
                titlePag: `Redes Sociales`,
                notFoundMessage: `No hay Redes Sociales`,
                labels: [`Logo`, `Nombre`, `Usuarios`],
                list: [],
                countRender: ``,
                // foundNext: false,
                // urlNext: ``,
                // foundPrevious: false,
                // urlPrevious: ``,
                form: CreateSocialForm_1.CreateSocialFrom,
                notifications: yield noti.GetNowNotification({ id: user.id }),
                // filter: {
                //     skip,
                //     take,
                //     param
                // }
            };
            const list = yield listPromise;
            const count = yield countPromise;
            // // next
            // returnData.foundNext = take +10 < count ? true : false; 
            // returnData.urlNext = `/social/?skip=${skip+10}&take=${take}`;
            // // previous
            // returnData.foundPrevious = take <= skip ? true : false; 
            // returnData.urlPrevious = `/social/?skip=${skip-10}&take=${take}`;
            // if(queryString) {
            //     returnData.urlNext += `&${queryString}`;
            //     returnData.urlPrevious += `&${queryString}`;
            // }
            returnData.list = list;
            returnData.countRender = `${skip ? skip : count < 10 ? count : 10}/${count}`;
            return res.render(`s/social/list.hbs`, returnData);
        });
    }
    RenderUnique(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = new SocialMediaModel_1.default();
            const id = req.params.id;
            const noti = new NotificationModel_1.default();
            const user = req.user;
            const dataReturn = {
                notifications: yield noti.GetNowNotification({ id: user.id }),
                delete: {
                    id: id,
                    url: `/social/${id}/delete`,
                    name: `Eliminar especialidad`
                }
            };
            return res.render(`s/social/unique.hbs`, dataReturn);
        });
    }
    CreateLogic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instance = new SocialMediaModel_1.default();
                const { name, icoUrl } = req.body;
                const create = yield instance.createSocialMedia({
                    data: {
                        icoUrl, name
                    }
                });
                req.flash(`succ`, `Red social creada`);
                return res.redirect(`/social/`);
            }
            catch (error) {
                req.flash(`Error`, `Error temporal`);
                return res.redirect(`/social/`);
            }
        });
    }
    EditLogic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instance = new SocialMediaModel_1.default();
                const { icoUrl, name } = req.body;
                const id = req.params.id;
                const user = req.user;
                const update = yield instance.updateSocialMedia({
                    data: {
                        icoUrl, name
                    },
                    filter: { id }
                });
                yield instance.CreateHistory({ des: `Actualización de medio social, ${update.name}`, name: `socialmedia`, userId: user.id });
                req.flash(`succ`, `Red social creada`);
                return res.redirect(`/social/`);
            }
            catch (error) {
                req.flash(`Error`, `Error temporal`);
                return res.redirect(`/social/`);
            }
        });
    }
    DeleteLogic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instance = new SocialMediaModel_1.default();
                const id = req.params.id;
                const user = req.user;
                const currentDelete = yield instance.deleteAdress({ id });
                yield instance.CreateHistory({ des: `Eliminación de usuario`, name: `social`, userId: user.id, id });
                req.flash(`succ`, `Eliminado exitosamente.`);
                return res.redirect(`/social/`);
            }
            catch (error) {
                req.flash(`Error`, `Error temporal`);
                return res.redirect(`/social/`);
            }
        });
    }
    loadRoutes() {
        this.router.get(`/social/`, auth_1.OnSession, this.RenderList);
        this.router.get(`/social/:id`, auth_1.OnSession, this.RenderUnique);
        this.router.post(`/social/create`, auth_1.OnSession, this.CreateLogic);
        this.router.post(`/social/:id/delete`, auth_1.OnSession, this.DeleteLogic);
        this.router.post(`/social/:id/update`, auth_1.OnSession, this.EditLogic);
        return this.router;
    }
}
exports.default = AdressController;
