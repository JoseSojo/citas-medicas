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
const UserModel_1 = __importDefault(require("../../model/user/UserModel"));
const auth_1 = require("../../middlewares/auth");
const NotificationModel_1 = __importDefault(require("../../model/user/notification/NotificationModel"));
const UserDetailModel_1 = __importDefault(require("../../model/user/UserDetailModel"));
const SocialMediaByUserModel_1 = __importDefault(require("../../model/config/SocialMediaByUserModel"));
const SocialMediaModel_1 = __importDefault(require("../../model/config/SocialMediaModel"));
const multer_1 = __importDefault(require("../../config/multer/multer"));
class PorfolioController extends AbstractController_1.default {
    constructor() {
        super();
    }
    PorfolioRender(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = new UserDetailModel_1.default();
            const userInstance = new UserModel_1.default();
            const social = new SocialMediaModel_1.default();
            const { id } = req.query;
            const user = req.user;
            const noti = new NotificationModel_1.default();
            const idFind = user.role === `DOCTOR` ? user.id : id;
            const porfolio = userInstance.findUser({ filter: { id: idFind } });
            const socialMedia = social.findManySocialMedia({ filter: { isDelete: false }, skip: 0, take: 10 });
            const dataReturn = {
                notifications: yield noti.GetNowNotification({ id: user.id }),
                porfolio: yield porfolio,
                social: yield socialMedia
            };
            return res.render(`s/porfolio/unique.hbs`, dataReturn);
        });
    }
    uplodPhoto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = new UserDetailModel_1.default();
            const userModel = new UserModel_1.default();
            const user = req.user;
            const file = req.file;
            const { detailId } = req.body;
            const detailFound = yield instance.findUserDetail({ filter: { userId: user.id } });
            if (detailFound) {
                yield instance.updateUserDetail({
                    filter: { id: detailId },
                    data: {
                        photoReference: { create: {
                                ext: file ? file.mimetype : ``,
                                original: file ? file.originalname : ``,
                                path: file ? file.path : ``,
                                use: `Foto profesional`,
                            } }
                    }
                });
            }
            else {
                yield instance.createUserDetail({
                    data: {
                        photoReference: { create: {
                                ext: file ? file.mimetype : ``,
                                original: file ? file.originalname : ``,
                                path: file ? file.path : ``,
                                use: `Foto profesional`,
                            } },
                        userReference: { connect: { id: user.id } }
                    }
                });
            }
            return res.redirect(`/porfolio`);
        });
    }
    AddSocialMedia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = new UserDetailModel_1.default();
            const userInstance = new UserModel_1.default();
            const userSocialMedia = new SocialMediaByUserModel_1.default();
            const user = req.user;
            const { link, username, socialMediaId, detailId } = req.body;
            const socialUserFound = yield userSocialMedia.findTest({ socialId: socialMediaId, userId: user.id });
            if (socialUserFound) {
                yield userSocialMedia.updateTest({ data: { link, username }, id: socialUserFound.id });
            }
            else {
                yield userInstance.updateUser({
                    data: {
                        socialMediaReference: {
                            connectOrCreate: {
                                create: { link, username, socialMediaReference: { connect: { id: socialMediaId } } },
                                where: { id: socialMediaId }
                            }
                        }
                    },
                    id: user.id
                });
            }
            req.flash(`succ`, `Operación exitosa`);
            return res.redirect(`/porfolio`);
        });
    }
    Description(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = new UserDetailModel_1.default();
            const { description } = req.body;
            const user = req.user;
            const detailFound = yield instance.findUserDetail({ filter: { userId: user.id } });
            console.log(0, true, detailFound);
            if (detailFound) {
                console.log(1, false);
                yield instance.updateUserDetail({
                    data: {
                        userReference: { connect: { id: user.id } },
                        description: description ? description : undefined
                    },
                    filter: { id: detailFound.id }
                });
            }
            else {
                console.log(1, true);
                yield instance.createUserDetail({
                    data: {
                        description: description ? description : undefined,
                        userReference: { connect: { id: user.id } }
                    }
                });
            }
            req.flash(`succ`, `Descripción agregada`);
            return res.redirect(`/porfolio`);
        });
    }
    loadRoutes() {
        this.router.get(`/porfolio/`, auth_1.OnSession, this.PorfolioRender);
        this.router.post(`/porfolio/social`, auth_1.OnSession, auth_1.OnDoctor, this.AddSocialMedia);
        this.router.post(`/porfolio/photo`, auth_1.OnSession, auth_1.OnDoctor, multer_1.default.single('file'), this.uplodPhoto);
        this.router.post(`/porfolio/description`, auth_1.OnSession, auth_1.OnDoctor, this.Description);
        return this.router;
    }
}
exports.default = PorfolioController;
