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
const ScheduleModel_1 = __importDefault(require("../../../model/schedule/ScheduleModel"));
const ScheduleDetailModel_1 = __importDefault(require("../../../model/schedule/ScheduleDetailModel"));
const util_1 = require("../../../util");
const NotificationModel_1 = __importDefault(require("../../../model/user/notification/NotificationModel"));
// HORARIOS CONTROLLER BY DOCTOR
class DoctorScheduleControlelr extends AbstractController_1.default {
    constructor() {
        super();
    }
    DoctorSchedule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const noti = new NotificationModel_1.default();
            const instance = new ScheduleModel_1.default();
            const { param, status } = req.query;
            let queryString = ``;
            const user = req.user;
            const take = req.query.take ? Number(req.query.take) : 10;
            const skip = req.query.skip ? Number(req.query.skip) : 0;
            const filter = [];
            filter.push({ userId: user.id });
            if (param) {
                queryString += `param=${param}`;
                filter.push({ description: { contains: param } });
            }
            if (status) {
                queryString += `param=${param}`;
                filter.push({ description: { contains: param } });
            }
            const listPromise = instance.findManySchedule({
                filter: { AND: [{ isDelete: false }, { OR: filter }] },
                skip,
                take,
            });
            const countPromise = instance.countSchedule({ filter: { AND: [{ isDelete: false }, { OR: filter }] } });
            const returnData = {
                titlePag: `Horarios`,
                notFoundMessage: `No hay horarios`,
                labels: [`Activo`, `Descripción`, ``],
                list: [],
                countRender: ``,
                foundNext: false,
                urlNext: ``,
                foundPrevious: false,
                urlPrevious: ``,
                status: (0, util_1.getStatusEnable)(),
                days: util_1.getDays,
                notifications: yield noti.GetNowNotification({ id: user.id }),
                filter: {
                    skip,
                    take,
                    param
                }
            };
            const list = yield listPromise;
            const count = yield countPromise;
            // next
            returnData.foundNext = count - skip > 10 ? true : false;
            returnData.urlNext = `/doctor/schedule/?skip=${skip + 10}&take=${take}`;
            // previus
            returnData.foundPrevious = take <= skip ? true : false;
            returnData.urlPrevious = `/doctor/schedule/?skip=${skip - 10}&take=${take}`;
            if (queryString) {
                returnData.urlNext += `&${queryString}`;
                returnData.urlPrevious += `&${queryString}`;
            }
            returnData.list = list;
            returnData.countRender = `${count - skip < 11 ? count : skip + take}/${count}`;
            return res.render(`s/doctor/schedule/list.hbs`, returnData);
        });
    }
    DoctorCreateSchedule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { description, day_name, time_start, time_end } = req.body;
            const user = req.user;
            const instance = new ScheduleModel_1.default();
            const detailInstance = new ScheduleDetailModel_1.default();
            const dataCreate = {
                description,
                user: { connect: { id: user.id } }
            };
            const createResult = yield instance.createSchedule({ data: dataCreate });
            day_name.forEach((name, i) => __awaiter(this, void 0, void 0, function* () {
                yield detailInstance.createScheduleTime({
                    data: {
                        day: name,
                        day_index: i,
                        scheduleReference: { connect: { id: createResult.id } },
                        time_start: time_start[i] ? time_start[i] : ``,
                        time_end: time_end[i] ? time_end[i] : ``
                    }
                });
            }));
            return res.redirect(`/doctor/schedule`);
        });
    }
    DoctorUniqueShedule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const instance = new ScheduleModel_1.default();
            const noti = new NotificationModel_1.default();
            const user = req.user;
            const data = instance.findSchedule({ filter: { id } });
            const dataReturn = {
                data: [],
                form: {},
                notifications: yield noti.GetNowNotification({ id: user.id }),
            };
            dataReturn.data = yield data;
            return res.render(`s/doctor/schedule/unique.hbs`, dataReturn);
        });
    }
    ToPrimary(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const instance = new ScheduleModel_1.default();
            const user = req.user;
            try {
                yield instance.singPrimary({ id, user: user.id });
                return res.redirect(`/doctor/schedule`);
            }
            catch (error) {
                return res.redirect(`/doctor/schedule`);
            }
            return res.redirect(`/doctor/schedule`);
        });
    }
    DoctoScheduleDetailUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const { start_payload, time_start, end_payload, time_end } = req.body;
            const instance = new ScheduleDetailModel_1.default();
            const result = yield instance.updateScheduleTime({
                filter: { id },
                data: {
                    time_start: time_start ? time_start : ``,
                    end_payload: end_payload ? end_payload : ``,
                    start_payload: start_payload ? start_payload : ``,
                    time_end: time_end ? time_end : ``,
                }
            });
            return res.redirect(`/doctor/schedule/`);
        });
    }
    loadRoutes() {
        this.router.get(`/doctor/schedule`, auth_1.OnSession, auth_1.OnDoctor, this.DoctorSchedule);
        this.router.get(`/doctor/schedule/:id`, auth_1.OnSession, auth_1.OnDoctor, this.DoctorUniqueShedule);
        this.router.get(`/doctor/schedule/:id/primary`, auth_1.OnSession, auth_1.OnDoctor, this.ToPrimary);
        this.router.post(`/doctor/schedule/create`, auth_1.OnSession, auth_1.OnDoctor, this.DoctorCreateSchedule);
        this.router.post(`/doctor/schedule/detail/:id/update`, auth_1.OnSession, auth_1.OnDoctor, this.DoctoScheduleDetailUpdate);
        return this.router;
    }
}
exports.default = DoctorScheduleControlelr;
