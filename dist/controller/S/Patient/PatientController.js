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
const UserModel_1 = __importDefault(require("../../../model/user/UserModel"));
const QuotesModel_1 = __importDefault(require("../../../model/quotes/QuotesModel"));
const ScheduleModel_1 = __importDefault(require("../../../model/schedule/ScheduleModel"));
class PatientControlelr extends AbstractController_1.default {
    constructor() {
        super();
    }
    DoctorDashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const noti = new NotificationModel_1.default();
            const user = req.user;
            const userModel = new UserModel_1.default();
            const quoteModel = new QuotesModel_1.default();
            const scheduleModel = new ScheduleModel_1.default();
            const quoteCountPromise = quoteModel.countQuotes({ filter: { AND: [{ isDelete: false }, { patientId: user.id }] } }); // citas totales
            const scheduleCountPromise = userModel.findUser({ filter: { id: user.id } });
            const quoteProcesadoCountPromise = quoteModel.countQuotes({ filter: { AND: [{ isDelete: false }, { status: `REGISTRADO` }, { patientId: user.id }] } });
            const quoteAprobadoCountPromise = quoteModel.countQuotes({ filter: { AND: [{ isDelete: false }, { status: `Aprobado` }, { patientId: user.id }] } });
            const quoteCanceladoCountPromise = quoteModel.countQuotes({ filter: { AND: [{ isDelete: false }, { status: `CANCELADO` }, { patientId: user.id }] } });
            const quoteFinalizadoCountPromise = quoteModel.countQuotes({ filter: { AND: [{ isDelete: false }, { status: `FINALIZADO` }, { patientId: user.id }] } });
            const dataReturn = {
                notifications: yield noti.GetNowNotification({ id: user.id }),
                year: yield userModel.getYears(),
                cards: [
                    {
                        title: `Citas`,
                        link: `/quote/`,
                        color: `border-left-primary`,
                        ico: `bi-person-fill`,
                        count: yield quoteCountPromise
                    },
                ],
                itemQoute: [
                    {
                        title: `Registrado`,
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
            return res.render(`s/patient/dashboard.hbs`, dataReturn);
        });
    }
    loadRoutes() {
        this.router.get(`/patient`, auth_1.OnSession, this.DoctorDashboard);
        return this.router;
    }
}
exports.default = PatientControlelr;
