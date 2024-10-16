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
const SocialMediaByUserModel_1 = __importDefault(require("../../../model/config/SocialMediaByUserModel"));
class AdressController extends AbstractController_1.default {
    constructor(prefix = `social/`, instance = new SocialMediaByUserModel_1.default()) {
        super();
        this.prefix = prefix;
        this.instance = instance;
    }
    CreateLogic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { link, username, socialId } = req.body;
                const user = req.user;
                const create = yield this.instance.createOrUpdate({
                    data: {
                        link,
                        username,
                        socialId,
                        userId: user.id
                    }
                });
                req.flash(`succ`, `Registro exitoso`);
                return res.redirect(`${this.prefix}/`);
            }
            catch (error) {
                req.flash(`Error`, `Error temporal`);
                return res.redirect(`${this.prefix}/`);
            }
        });
    }
    DeleteLogic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const currentDelete = yield this.instance.deleteSocial({ id });
                req.flash(`succ`, `Eliminado exitosamente.`);
                return res.redirect(`${this.prefix}/`);
            }
            catch (error) {
                req.flash(`Error`, `Error temporal`);
                return res.redirect(`${this.prefix}/`);
            }
        });
    }
    loadRoutes() {
        this.router.post(`${this.prefix}/create`, auth_1.OnSession, this.CreateLogic);
        this.router.post(`${this.prefix}/:id/delete`, auth_1.OnSession, this.DeleteLogic);
        return this.router;
    }
}
exports.default = AdressController;
