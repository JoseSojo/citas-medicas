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
const UserModel_1 = __importDefault(require("../../model/user/UserModel"));
const QuotesModel_1 = __importDefault(require("../../model/quotes/QuotesModel"));
class DashboardController extends AbstractController_1.default {
    constructor(prefix = ``) {
        super();
        this.prefix = prefix;
    }
    RenderDashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            if (user.role === "DOCTOR")
                return res.redirect(`/doctor`);
            if (user.role === "PACIENTE")
                return res.redirect(`/patient`);
            const noti = new NotificationModel_1.default();
            const userModel = new UserModel_1.default();
            const quoteModel = new QuotesModel_1.default();
            const patientCountPromise = userModel.countUser({ filter: { AND: [{ role: `PACIENTE` }, { isDelete: false }] } });
            const doctorCountPromise = userModel.countUser({ filter: { AND: [{ role: `DOCTOR` }, { isDelete: false }] } });
            const adminCountPromise = userModel.countUser({ filter: { AND: [{ role: `ADMIN` }, { isDelete: false }] } });
            const quoteCountPromise = quoteModel.countQuotes({ filter: { isDelete: false } });
            const quoteProcesadoCountPromise = quoteModel.countQuotes({ filter: { AND: [{ isDelete: false }, { status: `REGISTRADO` }] } });
            const quoteAprobadoCountPromise = quoteModel.countQuotes({ filter: { AND: [{ isDelete: false }, { status: `Aprobado` }] } });
            const quoteCanceladoCountPromise = quoteModel.countQuotes({ filter: { AND: [{ isDelete: false }, { status: `CANCELADO` }] } });
            const quoteFinalizadoCountPromise = quoteModel.countQuotes({ filter: { AND: [{ isDelete: false }, { status: `FINALIZADO` }] } });
            const dataReturn = {
                notifications: yield noti.GetNowNotification({ id: user.id }),
                year: yield userModel.getYears(),
                cards: [
                    {
                        title: `Pacientes`,
                        link: `/user/?role=PACIENTE`,
                        color: `border-left-primary`,
                        ico: `bi-person-fill`,
                        count: yield patientCountPromise
                    },
                    {
                        title: `Doctores`,
                        link: `/user/?role=DOCTOR`,
                        color: `border-left-primary`,
                        ico: `bi-person-circle`,
                        count: yield doctorCountPromise
                    },
                    {
                        title: `Administradores`,
                        link: `/user/?role=ADMIN`,
                        color: `border-left-primary`,
                        ico: `bi-person-workspace`,
                        count: yield adminCountPromise
                    },
                    {
                        title: `Citas`,
                        link: `/quote/`,
                        color: `border-left-info`,
                        ico: `bi-calendar-check-fill`,
                        count: yield quoteCountPromise
                    },
                ],
                itemQoute: [
                    {
                        title: `Regsitrados`,
                        link: `/quote/?status=REGISTRADO`,
                        count: yield quoteProcesadoCountPromise
                    },
                    {
                        title: `Aprobado`,
                        link: `/quote/?status=Aprobado`,
                        count: yield quoteAprobadoCountPromise
                    },
                    {
                        title: `Cancelado`,
                        link: `/quote/?status=CANCELADO`,
                        count: yield quoteCanceladoCountPromise
                    },
                    {
                        title: `Finalizado`,
                        link: `/quote/?status=FINALIZADO`,
                        count: yield quoteFinalizadoCountPromise
                    },
                ]
            };
            return res.render(`s/dashboard.hbs`, dataReturn);
        });
    }
    loadRoutes() {
        this.router.get(`${this.prefix}/dashboard`, auth_1.OnSession, this.RenderDashboard);
        return this.router;
    }
}
exports.default = DashboardController;
