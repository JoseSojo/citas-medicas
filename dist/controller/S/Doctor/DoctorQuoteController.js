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
const QuotesModel_1 = __importDefault(require("../../../model/quotes/QuotesModel"));
const QuotesDetailModel_1 = __importDefault(require("../../../model/quotes/QuotesDetailModel"));
class DoctorQuoteControlelr extends AbstractController_1.default {
    constructor() {
        super();
    }
    DoctorQuote(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const noti = new NotificationModel_1.default();
            const user = req.user;
            const dataReturn = {
                notifications: yield noti.GetNowNotification({ id: user.id })
            };
            return res.render(`s/doctor/quote/list.hbs`, dataReturn);
        });
    }
    ChangeStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instance = new QuotesModel_1.default();
                const detail = new QuotesDetailModel_1.default();
                const { status } = req.body;
                const user = req.user;
                const id = req.params.id;
                if (status == `FINALIZADO`) {
                    if (user.role === `DOCTOR`) {
                        const { starDoctor, descriptionDoctor, currentDetail } = req.body;
                        const detailPromise = detail.updateQuotesDetail({ data: { descriptionDoctor, starDoctor: starDoctor ? Number(starDoctor) : 1 }, filter: { id: currentDetail } });
                        const instancePromise = instance.updateQuotes({ data: { status }, filter: { id } });
                        yield instance.CreateHistory({ des: `Doctor califica a paciente`, name: `user`, userId: user.id });
                        yield instance.PushStatictics({ objectId: user.id, objectName: `DOCTOR` });
                        yield detailPromise;
                        yield instancePromise;
                    }
                    if (user.role === `PACIENTE`) {
                        const { starPatient, descriptionPatient, currentDetail } = req.body;
                        const detailPromise = detail.updateQuotesDetail({ data: { descriptionPatient, starPatient: starPatient ? Number(starPatient) : 1 }, filter: { id: currentDetail } });
                        const staticticPromise = instance.PushStatictics({ objectId: user.id, objectName: `PACIENTE` });
                        yield instance.CreateHistory({ des: `Paciente califica a doctor`, name: `user`, userId: user.id });
                        yield detailPromise;
                        yield staticticPromise;
                    }
                }
                else {
                    if (user.role === `DOCTOR`) {
                        const instancePromise = instance.updateQuotes({ data: { status }, filter: { id } });
                        yield instance.CreateHistory({ des: `Cambio de estado de cita`, name: `user`, userId: user.id });
                        yield instancePromise;
                    }
                }
                req.flash(`Cita ${status}`);
                return res.redirect(`/quote/${id}`);
            }
            catch (error) {
                req.flash(`err`, `Error temporal`);
                return res.redirect(`/doctor`);
            }
        });
    }
    loadRoutes() {
        this.router.get(`/doctor/quote`, auth_1.OnSession, auth_1.OnDoctor, this.DoctorQuote);
        this.router.post(`/doctor/quote/status/:id`, auth_1.OnSession, this.ChangeStatus);
        return this.router;
    }
}
exports.default = DoctorQuoteControlelr;
