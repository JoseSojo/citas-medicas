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
class DoctorPatientControlelr extends AbstractController_1.default {
    constructor() {
        super();
    }
    DoctorPatient(req, res) {
        const _super = Object.create(null, {
            getRoles: { get: () => super.getRoles }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const instance = new QuotesModel_1.default();
            const user = req.user;
            const noti = new NotificationModel_1.default();
            const { param, role } = req.query;
            let queryString = ``;
            // rol
            // param (email,name,lastname,ci,cmeg,matricula,address)
            const take = req.query.take ? Number(req.query.take) : 10;
            const skip = req.query.skip ? Number(req.query.skip) : 0;
            const filter = [];
            // filter.push({ isDelete:false });
            filter.push({ patientId: user.id });
            filter.push({ doctorId: user.id });
            if (param) {
                filter.push({ patientReference: { name: { contains: param } } });
                filter.push({ patientReference: { lastname: { contains: param } } });
                queryString += `param=${param}`;
            }
            const listPromise = instance.findManyQuotes({
                filter: { AND: [{ isDelete: false }, { OR: filter }] },
                skip,
                take,
            });
            const countPromise = instance.countQuotes({ filter: { AND: [{ isDelete: false }, { OR: filter }] } });
            const returnData = {
                titlePag: `Pacientes atendidos`,
                notFoundMessage: `No hay pacientes`,
                labels: [`Nombre`, `Estado cita`, ``],
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
            returnData.urlNext = `/doctor/patient/?skip=${skip + 10}&take=${take}`;
            // previus
            returnData.foundPrevious = take <= skip ? true : false;
            returnData.urlPrevious = `/doctor/patient/?skip=${skip - 10}&take=${take}`;
            if (queryString) {
                returnData.urlNext += `&${queryString}`;
                returnData.urlPrevious += `&${queryString}`;
            }
            returnData.list = list;
            returnData.countRender = `${count - skip < 11 ? count : skip + take}/${count}`;
            return res.render(`s/doctor/patient/list.hbs`, returnData);
        });
    }
    loadRoutes() {
        this.router.get(`/doctor/patient`, auth_1.OnSession, auth_1.OnDoctor, this.DoctorPatient);
        return this.router;
    }
}
exports.default = DoctorPatientControlelr;
