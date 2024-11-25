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
const SpecialityModel_1 = __importDefault(require("../../../model/config/SpecialityModel"));
const QuotesModel_1 = __importDefault(require("../../../model/quotes/QuotesModel"));
class PatientQuoteController extends AbstractController_1.default {
    constructor() {
        super();
    }
    PatientDoctorList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { espId, espName, param, addressId, addressName } = req.query;
            const noti = new NotificationModel_1.default();
            const user = req.user;
            const userModel = new UserModel_1.default();
            const speciality = new SpecialityModel_1.default();
            const instance = new QuotesModel_1.default();
            let queryString = ``;
            const skipUser = req.query.skipUser ? Number(req.query.skipUser) : 0;
            const takeUser = req.query.takeUser ? Number(req.query.takeUser) : 10;
            const whereUser = [];
            whereUser.push({ role: `DOCTOR` });
            // whereUser.push({ schedule: { every:{ primary:true } } });
            whereUser.push({ isDelete: false });
            if (param) {
                queryString += queryString ? `&param=${param}` : `param=${param}`;
                // whereUser.push({ speciality:{ every:{ specialityReference:{ isDelete:false } } } });
                whereUser.push({ name: { contains: param } });
                whereUser.push({ lastname: { contains: param } });
            }
            if (espId) {
                queryString += queryString ? `&espId=${espId}` : `espId=${espId}`;
                whereUser.push({ speciality: { every: { specialityReference: { id: espId } } } });
            }
            if (espName) {
                queryString += queryString ? `&espName=${espName}` : `espName=${espName}`;
                whereUser.push({ speciality: { some: { specialityReference: { description: { contains: espName } } } } });
                whereUser.push({ speciality: { some: { specialityReference: { description: { contains: espName } } } } });
            }
            if (addressId) {
                queryString += queryString ? `&addressId=${addressId}` : `addressId=${addressId}`;
                whereUser.push({ addressReference: { id: addressId } });
            }
            if (addressName) {
                queryString += queryString ? `&addressName=${addressName}` : `addressName=${addressName}`;
                whereUser.push({ addressReference: { description: { contains: addressName } } });
            }
            const userListPromise = userModel.findManyUser({ filter: { AND: whereUser }, skip: skipUser, take: takeUser });
            const userCountPromise = userModel.countUser({ filter: { AND: whereUser } });
            const userList = yield userListPromise;
            const userCount = yield userCountPromise;
            // next
            const foundNext = userCount - skipUser > 10 ? true : false;
            const urlNext = `/patient/doctor/?skipUser=${skipUser + 10}&takeUser=${takeUser}`;
            // previus
            const foundPrevious = takeUser <= skipUser ? true : false;
            const urlPrevious = `/patient/doctor/?skipUser=${skipUser - 10}&takeUser=${takeUser}`;
            const dataReturn = {
                titlePag: `Doctores`,
                notFoundMessage: `No hay doctor`,
                labels: [`Nombre y Apellido`, `Especialidades`, `Dirección`, ``],
                notifications: yield noti.GetNowNotification({ id: user.id }),
                urlNext,
                foundNext,
                urlPrevious,
                foundPrevious,
                list: userList,
                countRender: ``,
                filter: {
                    param,
                    espName,
                    espId,
                    addressId,
                    addressName
                }
            };
            if (queryString) {
                dataReturn.urlNext += `&${queryString}`;
                dataReturn.urlPrevious += `&${queryString}`;
            }
            // dataReturn.address = addressList;
            // dataReturn.speciality = specialityList;
            dataReturn.countRender = `${userCount - skipUser < 11 ? userCount : skipUser + takeUser}/${userCount}`;
            return res.render(`s/patient/doctor.hbs`, dataReturn);
        });
    }
    RenderCreateQuote(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { doctorId } = req.query;
            const noti = new NotificationModel_1.default();
            const user = req.user;
            const userInstance = new UserModel_1.default();
            const dataReturn = {
                doctor: doctorId ? yield userInstance.findUser({ filter: { AND: [{ id: doctorId }, { role: `DOCTOR` }, { isDelete: false }] } }) : null,
                notifications: yield noti.GetNowNotification({ id: user.id }),
            };
            return res.render(`s/patient/quote/create.hbs`, dataReturn);
        });
    }
    RenderListQuote(req, res) {
        const _super = Object.create(null, {
            getRoles: { get: () => super.getRoles }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const instance = new QuotesModel_1.default();
            const user = req.user;
            const noti = new NotificationModel_1.default();
            const { param, status, patient, doctor } = req.query;
            let queryString = ``;
            const take = req.query.take ? Number(req.query.take) : 10;
            const skip = req.query.skip ? Number(req.query.skip) : 0;
            const filter = [];
            if (user.role != `ADMIN`)
                filter.push({ OR: [{ patientId: user.id }, { doctorId: user.id }] });
            if (status) {
                queryString += `status=${status}`;
                filter.push({ status });
            }
            if (patient) {
                queryString += `patient=${patient}`;
                filter.push({ patientId: patient });
            }
            if (doctor) {
                queryString += `doctor=${doctor}`;
                filter.push({ doctorId: doctor });
            }
            const listPromise = instance.findManyQuotes({
                filter: { AND: [{ isDelete: false }, { AND: filter }] },
                skip,
                take,
            });
            const countPromise = instance.countQuotes({ filter: { AND: [{ isDelete: false }, { AND: filter }] } });
            const returnData = {
                titlePag: `Citas`,
                notFoundMessage: `No hay citas`,
                labels: [`Mensaje`, `Doctor`, `Paciente`, `Estado`, `Fecha`, ``],
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
                    patient,
                    doctor
                }
            };
            const list = yield listPromise;
            const count = yield countPromise;
            // next
            returnData.foundNext = count - skip > 10 ? true : false;
            returnData.urlNext = `/quote/?skip=${skip + 10}&take=${take}`;
            // previus
            returnData.foundPrevious = take <= skip ? true : false;
            returnData.urlPrevious = `/quote/?skip=${skip - 10}&take=${take}`;
            if (queryString) {
                returnData.urlNext += `&${queryString}`;
                returnData.urlPrevious += `&${queryString}`;
            }
            returnData.list = list;
            returnData.countRender = `${count - skip < 11 ? count : skip + take}/${count}`;
            return res.render(`s/quote/list.hbs`, returnData);
        });
    }
    RenderUnique(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const noti = new NotificationModel_1.default();
            const user = req.user;
            const instance = new QuotesModel_1.default();
            const dataReturn = {
                notifications: yield noti.GetNowNotification({ id: user.id }),
                data: yield instance.findQuotes({ filter: { AND: [{ id }, { isDelete: false }] } }),
            };
            return res.render(`s/quote/unique.hbs`, dataReturn);
        });
    }
    CreateLogic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { message, doctorId } = req.body;
                const user = req.user;
                const instance = new QuotesModel_1.default();
                const create = yield instance.createQuotes({ data: {
                        doctorReference: { connect: { id: doctorId } },
                        patientReference: { connect: { id: user.id } },
                        quoteDetailReference: {
                            create: {}
                        },
                        message,
                    } });
                yield instance.PushStatictics({ objectId: ``, objectName: `CITAS` });
                yield instance.CreateHistory({ des: `Creación de cita por el paciente ${user.name} ${user.lastname} para el doctor ${create.doctorReference.name} ${create.doctorReference.lastname}`, name: `patient.quote`, userId: user.id });
                req.flash(`succ`, `Cita agendada, esperando aprobación`);
                return res.redirect(`/quote/${create.id}`);
            }
            catch (error) {
                req.flash(`err`, `Error temporal`);
                return res.redirect(`/patient/`);
            }
        });
    }
    loadRoutes() {
        this.router.get(`/patient/doctor`, auth_1.OnSession, this.PatientDoctorList);
        this.router.get(`/patient/quote/create`, auth_1.OnSession, this.RenderCreateQuote);
        this.router.get(`/quote`, auth_1.OnSession, this.RenderListQuote);
        this.router.get(`/quote/:id`, auth_1.OnSession, this.RenderUnique);
        this.router.post(`/quote/create`, auth_1.OnSession, this.CreateLogic);
        return this.router;
    }
}
exports.default = PatientQuoteController;
