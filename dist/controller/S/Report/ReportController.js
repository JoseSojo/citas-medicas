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
const UserModel_1 = __importDefault(require("../../../model/user/UserModel"));
const GeneratePDFkit_1 = require("../../../model/pdf/GeneratePDFkit");
const AddressSubModel_1 = __importDefault(require("../../../model/config/AddressSubModel"));
const QuotesModel_1 = __importDefault(require("../../../model/quotes/QuotesModel"));
class ReportController extends AbstractController_1.default {
    HandleReportQuote(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userModel = new UserModel_1.default();
            const quoteModel = new QuotesModel_1.default();
            const doctorPromise = userModel.findManyUser({ filter: { AND: [{ isDelete: false }, { role: `DOCTOR` }] }, skip: 0, take: 60 });
            const patientPromise = userModel.findManyUser({ filter: { AND: [{ isDelete: false }, { role: `PACIENTE` }] }, skip: 0, take: 60 });
            // filters query
            const doctorId = req.query.doctor ? req.query.doctor : null;
            const patientId = req.query.patient ? req.query.patient : null;
            const headers = [``, `DOCTOR`, `PACIENTE`, `DESCRIPCIÓN`, `CALIFICACIÓN PACIENTE`, `CALIFICACIÓN DOCTOR`];
            let pdf = null;
            let take = 20;
            let skip = 0;
            if (doctorId) {
                const headers = [``, `PACIENTE`, `DESCIPCIÓN`, `CALIFICACIÓN PACIENTE`, `COLIFICACIÓN DOCTOR`];
                const quoteModel = new QuotesModel_1.default();
                const count = yield quoteModel.countQuotes({ filter: { AND: [{ isDelete: false }, { doctorId }] } });
                const currentDoctor = yield userModel.findUser({ filter: { id: doctorId } });
                let i = 0;
                const rows = [];
                do {
                    const result = yield quoteModel.findManyQuotes({ filter: { AND: [{ isDelete: false }, { doctorId }] }, skip, take });
                    result.forEach((item, i) => {
                        rows.push([
                            (i + 1).toString(),
                            `${item.patientReference.name} ${item.patientReference.lastname}`,
                            `${item.message}`,
                            `${item.quoteDetailReference.descriptionPatient}`,
                            `${item.quoteDetailReference.descriptionDoctor}`
                        ]);
                    });
                    skip += take;
                    take += take;
                    i++;
                } while (count > skip + take);
                pdf = yield (0, GeneratePDFkit_1.pushPdf)({
                    headers,
                    rows,
                    title: `Reporte Citas Doctor ${currentDoctor === null || currentDoctor === void 0 ? void 0 : currentDoctor.name} ${currentDoctor === null || currentDoctor === void 0 ? void 0 : currentDoctor.lastname}`,
                    filter: [],
                    count
                });
                const pdfResult = yield pdf;
                return res.redirect(`${pdfResult.download}`);
            }
            else if (patientId) {
                const headers = [``, `DOCTOR`, `DESCIPCIÓN`, `CALIFICACIÓN DOCTOR`, `COLIFICACIÓN PACIENTE`];
                const quoteModel = new QuotesModel_1.default();
                const count = yield quoteModel.countQuotes({ filter: { AND: [{ isDelete: false }, { patientId }] } });
                const currentDoctor = yield userModel.findUser({ filter: { id: doctorId } });
                let i = 0;
                const rows = [];
                do {
                    const result = yield quoteModel.findManyQuotes({ filter: { AND: [{ isDelete: false }, { doctorId }] }, skip, take });
                    result.forEach((item, i) => {
                        rows.push([
                            (i + 1).toString(),
                            `${item.doctorReference.name} ${item.doctorReference.lastname}`,
                            `${item.message}`,
                            `${item.quoteDetailReference.descriptionDoctor}`,
                            `${item.quoteDetailReference.descriptionPatient}`
                        ]);
                    });
                    skip += take;
                    take += take;
                    i++;
                } while (count > skip + take);
                pdf = yield (0, GeneratePDFkit_1.pushPdf)({
                    headers,
                    rows,
                    title: `Reporte Citas Paciente ${currentDoctor === null || currentDoctor === void 0 ? void 0 : currentDoctor.name} ${currentDoctor === null || currentDoctor === void 0 ? void 0 : currentDoctor.lastname}`,
                    filter: [],
                    count
                });
                const pdfResult = yield pdf;
                return res.redirect(`${pdfResult.download}`);
            }
            else {
                if (!req.query.generate)
                    return res.render(`s/report/quote.hbs`, {
                        patientList: yield patientPromise,
                        doctorList: yield doctorPromise,
                        // report: (await pdf).download 
                    });
                const count = yield quoteModel.countQuotes({ filter: { isDelete: false }, });
                let i = 0;
                const rows = [];
                do {
                    const result = yield quoteModel.findManyQuotes({ filter: { isDelete: false }, skip, take });
                    result.forEach((item, i) => {
                        rows.push([
                            (i + 1).toString(),
                            `${item.doctorReference.name} ${item.doctorReference.lastname}`,
                            `${item.patientReference.name} ${item.patientReference.lastname}`,
                            `${item.message}`,
                            `${item.quoteDetailReference.descriptionPatient}`,
                            `${item.quoteDetailReference.descriptionDoctor}`
                        ]);
                    });
                    skip += take;
                    take += take;
                    i++;
                } while (count > skip + take);
                pdf = yield (0, GeneratePDFkit_1.pushPdf)({
                    headers,
                    rows,
                    title: `Reporte Citas`,
                    filter: [],
                    count
                });
                const pdfResult = yield pdf;
                return res.redirect(`${pdfResult.download}`);
            }
        });
    }
    findDoctorApi(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const param = req.query.param;
            const userModel = new UserModel_1.default();
            const result = userModel.findManyUser({ filter: { AND: [
                        { role: `DOCTOR` },
                        { isDelete: false },
                        { OR: [{ name: { contains: param } }, { lastname: { contains: param } }, { cmeg_n: { contains: param } }, { matricula: { contains: param } }] }
                    ] },
                skip: 0,
                take: 60
            });
            return res.status(200).json({ list: yield result });
        });
    }
    findAddressApi(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const param = req.query.param;
            const userModel = new AddressSubModel_1.default();
            const result = userModel.findManyAdress({ filter: { AND: [
                        { isDelete: false },
                        { OR: [{ description: { contains: param } }] }
                    ] },
                skip: 0,
                take: 60
            });
            return res.status(200).json({ list: yield result });
        });
    }
    HandleReportDoctor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userModel = new UserModel_1.default();
            const addressModel = new AddressSubModel_1.default();
            const addressPromise = addressModel.findManyAdress({ filter: { isDelete: false }, skip: 0, take: 60 });
            const doctorPromise = userModel.findManyUser({ filter: { AND: [{ isDelete: false }, { role: `DOCTOR` }] }, skip: 0, take: 60 });
            // filters query
            const doctorId = req.query.doctor ? req.query.doctor : null;
            const param = req.query.param ? req.query.param : null;
            const address = req.query.address ? req.query.address : null;
            const headers = [``, `Nombre`, `Matricula`, `Especialidad(s)`, `Citas`, `Dirección`];
            let pdf = null;
            let take = 20;
            let skip = 0;
            // unico doctor
            if (doctorId) {
                const headers = [``, `DOCTOR`, `PACIENTE`, `DESCRIPCIÓN`, `CALIFICACIÓN PACIENTE`, `CALIFICACIÓN DOCTOR`];
                const quoteModel = new QuotesModel_1.default();
                const count = yield quoteModel.countQuotes({
                    filter: { AND: [{ isDelete: false }, { doctorId }] },
                });
                const currentDoctor = yield userModel.findUser({ filter: { id: doctorId } });
                let i = 0;
                const rows = [];
                do {
                    const result = yield quoteModel.findManyQuotes({ filter: { AND: [{ isDelete: false }, { doctorId }] }, skip, take });
                    result.forEach((item, i) => {
                        rows.push([
                            (i + 1).toString(),
                            `${item.doctorReference.name} ${item.doctorReference.lastname}`,
                            `${item.patientReference.name} ${item.patientReference.lastname}`,
                            `${item.message}`,
                            `${item.quoteDetailReference.descriptionPatient}`,
                            `${item.quoteDetailReference.descriptionDoctor}`
                        ]);
                    });
                    skip += take;
                    take += take;
                    i++;
                } while (count > skip + take);
                pdf = yield (0, GeneratePDFkit_1.pushPdf)({
                    headers,
                    rows,
                    title: `Reporte de Doctor ${currentDoctor === null || currentDoctor === void 0 ? void 0 : currentDoctor.name} ${currentDoctor === null || currentDoctor === void 0 ? void 0 : currentDoctor.lastname}`,
                    filter: [
                        `Teléfono: ${currentDoctor === null || currentDoctor === void 0 ? void 0 : currentDoctor.phoneCode} ${currentDoctor === null || currentDoctor === void 0 ? void 0 : currentDoctor.phoneNumber}`,
                        `Correo: ${currentDoctor === null || currentDoctor === void 0 ? void 0 : currentDoctor.email}`,
                        `Dirección: ${(_a = currentDoctor === null || currentDoctor === void 0 ? void 0 : currentDoctor.addressReference) === null || _a === void 0 ? void 0 : _a.description}`,
                    ],
                    count,
                });
                const pdfResult = yield pdf;
                return res.redirect(`${pdfResult.download}`);
            }
            else if (address) {
                const count = yield userModel.countUser({
                    filter: { AND: [{ isDelete: false }, { role: `DOCTOR` }, { addressReference: { id: address } }] },
                });
                let i = 0;
                const rows = [];
                // lista de doctores
                do {
                    const result = yield userModel.findForReport({ filter: { AND: [{ isDelete: false }, { role: `DOCTOR` }, { addressReference: { id: address } }] }, skip, take });
                    result.forEach((item, i) => {
                        var _a;
                        rows.push([
                            (i + 1).toString(),
                            `${item.name} ${item.lastname}`,
                            `${item.matricula}`,
                            `${item.speciality[0] ? item.speciality[0].specialityReference.name : ``} ${item.speciality[1] ? item.speciality[1].specialityReference.name : ``}`,
                            `${item._count.doctor}`,
                            `${(_a = item.addressReference) === null || _a === void 0 ? void 0 : _a.description}`
                        ]);
                    });
                    skip += take;
                    take += take;
                    i++;
                } while (count > skip + take);
                pdf = yield (0, GeneratePDFkit_1.pushPdf)({
                    headers,
                    rows,
                    title: `Reporte Doctores por Dirección`,
                    filter: [],
                    count
                });
                const pdfResult = yield pdf;
                return res.redirect(`${pdfResult.download}`);
            }
            else {
                if (!req.query.generate)
                    return res.render(`s/report/doctor.hbs`, {
                        addressList: yield addressPromise,
                        doctorList: yield doctorPromise,
                    });
                ;
                const count = yield userModel.countUser({
                    filter: { AND: [{ isDelete: false }, { role: `DOCTOR` }] },
                });
                let i = 0;
                const rows = [];
                // lista de doctores
                do {
                    const result = yield userModel.findForReport({ filter: { AND: [{ isDelete: false }, { role: `DOCTOR` }] }, skip, take });
                    result.forEach((item, i) => {
                        var _a;
                        rows.push([
                            (i + 1).toString(),
                            `${item.name} ${item.lastname}`,
                            `${item.matricula}`,
                            `${item.speciality[0] ? item.speciality[0].specialityReference.name : ``} ${item.speciality[1] ? item.speciality[1].specialityReference.name : ``}`,
                            `${item._count.doctor}`,
                            `${(_a = item.addressReference) === null || _a === void 0 ? void 0 : _a.description}`
                        ]);
                    });
                    skip += take;
                    take += take;
                    i++;
                } while (count > skip + take);
                pdf = yield (0, GeneratePDFkit_1.pushPdf)({
                    headers,
                    rows,
                    title: `Reporte Doctores`,
                    filter: [],
                    count
                });
                const pdfResult = yield pdf;
                return res.redirect(`${pdfResult.download}`);
            }
            return res.render(`s/report/doctor.hbs`, {
                addressList: yield addressPromise,
                doctorList: yield doctorPromise,
                // // report: (await pdf).download 
            });
        });
    }
    HandleReportPatient(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userModel = new UserModel_1.default();
            const addressModel = new AddressSubModel_1.default();
            const addressPromise = addressModel.findManyAdress({ filter: { isDelete: false }, skip: 0, take: 60 });
            const patientPromise = userModel.findManyUser({ filter: { AND: [{ isDelete: false }, { role: `PACIENTE` }] }, skip: 0, take: 60 });
            // filters query
            const patientId = req.query.patient ? req.query.patient : null;
            const address = req.query.address ? req.query.address : null;
            const headers = [``, `Nombre`, `Citas`, `Dirección`];
            let pdf = null;
            let take = 20;
            let skip = 0;
            if (patientId) {
                const headers = [``, `DOCTOR`, `PACIENTE`, `DESCRIPCIÓN`, `CALIFICACIÓN PACIENTE`, `CALIFICACIÓN DOCTOR`];
                const quoteModel = new QuotesModel_1.default();
                const count = yield quoteModel.countQuotes({
                    filter: { AND: [{ isDelete: false }, { patientId }] },
                });
                const currentPatient = yield userModel.findUser({ filter: { id: patientId } });
                let i = 0;
                const rows = [];
                do {
                    const result = yield quoteModel.findManyQuotes({ filter: { AND: [{ isDelete: false }, { patientId }] }, skip, take });
                    result.forEach((item, i) => {
                        rows.push([
                            (i + 1).toString(),
                            `${item.doctorReference.name} ${item.doctorReference.lastname}`,
                            `${item.patientReference.name} ${item.patientReference.lastname}`,
                            `${item.message}`,
                            `${item.quoteDetailReference.descriptionPatient}`,
                            `${item.quoteDetailReference.descriptionDoctor}`
                        ]);
                    });
                    skip += take;
                    take += take;
                    i++;
                } while (count > skip + take);
                pdf = yield (0, GeneratePDFkit_1.pushPdf)({
                    headers,
                    rows,
                    title: `Reporte de Paciente ${currentPatient === null || currentPatient === void 0 ? void 0 : currentPatient.name} ${currentPatient === null || currentPatient === void 0 ? void 0 : currentPatient.lastname}`,
                    filter: [
                        `Teléfono: ${currentPatient === null || currentPatient === void 0 ? void 0 : currentPatient.phoneCode} ${currentPatient === null || currentPatient === void 0 ? void 0 : currentPatient.phoneNumber}`,
                        `Correo: ${currentPatient === null || currentPatient === void 0 ? void 0 : currentPatient.email}`,
                        `Dirección: ${(_a = currentPatient === null || currentPatient === void 0 ? void 0 : currentPatient.addressReference) === null || _a === void 0 ? void 0 : _a.description}`,
                    ],
                    count
                });
                const pdfResult = yield pdf;
                return res.redirect(`${pdfResult.download}`);
            }
            else if (address) {
                const count = yield userModel.countUser({
                    filter: { AND: [{ isDelete: false }, { role: `PACIENTE` }, { addressReference: { id: address } }] },
                });
                let i = 0;
                const rows = [];
                do {
                    const result = yield userModel.findForReport({ filter: { AND: [{ isDelete: false }, { role: `PACIENTE` }, { addressReference: { id: address } }] }, skip, take });
                    result.forEach((item, i) => {
                        var _a;
                        rows.push([
                            (i + 1).toString(),
                            `${item.name} ${item.lastname}`,
                            `${item._count.patient}`,
                            `${(_a = item.addressReference) === null || _a === void 0 ? void 0 : _a.description}`
                        ]);
                    });
                    skip += take;
                    take += take;
                    i++;
                } while (count > skip + take);
                pdf = yield (0, GeneratePDFkit_1.pushPdf)({
                    headers,
                    rows,
                    title: `Reporte Pacientes por Dirección`,
                    filter: [],
                    count
                });
                const pdfResult = yield pdf;
                return res.redirect(`${pdfResult.download}`);
            }
            else {
                if (!req.query.generate)
                    return res.render(`s/report/patient.hbs`, {
                        addressList: yield addressPromise,
                        patientList: yield patientPromise,
                        // report: (await pdf).download 
                    });
                const count = yield userModel.countUser({
                    filter: { AND: [{ isDelete: false }, { role: `PACIENTE` }] },
                });
                let i = 0;
                const rows = [];
                do {
                    const result = yield userModel.findForReport({ filter: { AND: [{ isDelete: false }, { role: `PACIENTE` }] }, skip, take });
                    result.forEach((item, i) => {
                        var _a;
                        rows.push([
                            (i + 1).toString(),
                            `${item.name} ${item.lastname}`,
                            `${item._count.patient}`,
                            `${(_a = item.addressReference) === null || _a === void 0 ? void 0 : _a.description}`
                        ]);
                    });
                    skip += take;
                    take += take;
                    i++;
                } while (count > skip + take);
                pdf = yield (0, GeneratePDFkit_1.pushPdf)({
                    headers,
                    rows,
                    title: `Reporte Pacientes`,
                    filter: [],
                    count
                });
                const pdfResult = yield pdf;
                return res.redirect(`${pdfResult.download}`);
            }
            return res.render(`s/report/patient.hbs`, {
                addressList: yield addressPromise,
                patientList: yield patientPromise,
                // report: (await pdf).download 
            });
        });
    }
    LoadRouters() {
        this.router.get(`/report/quote`, auth_1.OnSession, auth_1.OnAdmin, this.HandleReportQuote);
        this.router.get(`/report/doctor`, auth_1.OnSession, auth_1.OnAdmin, this.HandleReportDoctor);
        this.router.get(`/report/patient`, auth_1.OnSession, auth_1.OnAdmin, this.HandleReportPatient);
        return this.router;
    }
}
exports.default = ReportController;
