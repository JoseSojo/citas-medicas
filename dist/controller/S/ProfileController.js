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
const NotificationModel_1 = __importDefault(require("../../model/user/notification/NotificationModel"));
class ProfileController extends AbstractController_1.default {
    constructor(prefix = `/profile`) {
        super();
        this.prefix = prefix;
    }
    RenderProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const noti = new NotificationModel_1.default();
            const dataReturn = {
                notifications: yield noti.GetNowNotification({ id: user.id })
            };
            return res.render(`s/profile.hbs`, dataReturn);
        });
    }
    loadRoutes() {
        this.router.get(`${this.prefix}/`, auth_1.OnSession, this.RenderProfile);
        return this.router;
    }
}
exports.default = ProfileController;
