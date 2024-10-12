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
const client_1 = require("@prisma/client");
const AbstractModel_1 = __importDefault(require("../model/AbstractModel"));
const QuotesModel_1 = __importDefault(require("../model/quotes/QuotesModel"));
class GraphicService extends AbstractModel_1.default {
    constructor() {
        super();
    }
    MonthGraphic(_a) {
        return __awaiter(this, arguments, void 0, function* ({ objectName, objectId, month }) {
            const prisma = new client_1.PrismaClient();
            const model = new AbstractModel_1.default();
            const months = model.getAllMonths();
        });
    }
    MonthGraphicQuote(_a) {
        return __awaiter(this, arguments, void 0, function* ({ month, id, ObjectName }) {
            const prisma = new client_1.PrismaClient();
            const model = new AbstractModel_1.default();
            const months = model.getAllMonths();
            const monthFind = month ? Number(month) : model.getMonth();
            // if(month) {
            //     const result = await prisma.staticticsMonth.findFirst({ where:{monthNumber: month,objectName:`CITAS`} });
            //     const label = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
            //     const data = [
            //         result?.totalDay1,
            //         result?.totalDay2,
            //         result?.totalDay3,
            //         result?.totalDay4,
            //         result?.totalDay5,
            //         result?.totalDay6,
            //         result?.totalDay7,
            //         result?.totalDay8,
            //         result?.totalDay9,
            //         result?.totalDay10,
            //         result?.totalDay11,
            //         result?.totalDay12,
            //         result?.totalDay13,
            //         result?.totalDay14,
            //         result?.totalDay15,
            //         result?.totalDay16,
            //         result?.totalDay17,
            //         result?.totalDay18,
            //         result?.totalDay19,
            //         result?.totalDay20,
            //         result?.totalDay21,
            //         result?.totalDay22,
            //         result?.totalDay23,
            //         result?.totalDay24,
            //         result?.totalDay25,
            //         result?.totalDay26,
            //         result?.totalDay27,
            //         result?.totalDay28,
            //         result?.totalDay29,
            //         result?.totalDay30,
            //         result?.totalDay31,
            //     ];
            //     return {label,data};
            // }
            if (id) {
                const result = yield prisma.staticticsMonth.findFirst({ where: { AND: [{ objectId: id }, { monthNumber: monthFind }] } });
                const label = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
                const data = [
                    result === null || result === void 0 ? void 0 : result.totalDay1,
                    result === null || result === void 0 ? void 0 : result.totalDay2,
                    result === null || result === void 0 ? void 0 : result.totalDay3,
                    result === null || result === void 0 ? void 0 : result.totalDay4,
                    result === null || result === void 0 ? void 0 : result.totalDay5,
                    result === null || result === void 0 ? void 0 : result.totalDay6,
                    result === null || result === void 0 ? void 0 : result.totalDay7,
                    result === null || result === void 0 ? void 0 : result.totalDay8,
                    result === null || result === void 0 ? void 0 : result.totalDay9,
                    result === null || result === void 0 ? void 0 : result.totalDay10,
                    result === null || result === void 0 ? void 0 : result.totalDay11,
                    result === null || result === void 0 ? void 0 : result.totalDay12,
                    result === null || result === void 0 ? void 0 : result.totalDay13,
                    result === null || result === void 0 ? void 0 : result.totalDay14,
                    result === null || result === void 0 ? void 0 : result.totalDay15,
                    result === null || result === void 0 ? void 0 : result.totalDay16,
                    result === null || result === void 0 ? void 0 : result.totalDay17,
                    result === null || result === void 0 ? void 0 : result.totalDay18,
                    result === null || result === void 0 ? void 0 : result.totalDay19,
                    result === null || result === void 0 ? void 0 : result.totalDay20,
                    result === null || result === void 0 ? void 0 : result.totalDay21,
                    result === null || result === void 0 ? void 0 : result.totalDay22,
                    result === null || result === void 0 ? void 0 : result.totalDay23,
                    result === null || result === void 0 ? void 0 : result.totalDay24,
                    result === null || result === void 0 ? void 0 : result.totalDay25,
                    result === null || result === void 0 ? void 0 : result.totalDay26,
                    result === null || result === void 0 ? void 0 : result.totalDay27,
                    result === null || result === void 0 ? void 0 : result.totalDay28,
                    result === null || result === void 0 ? void 0 : result.totalDay29,
                    result === null || result === void 0 ? void 0 : result.totalDay30,
                    result === null || result === void 0 ? void 0 : result.totalDay31,
                ];
                return { label, data };
            }
            const filter = [{ monthNumber: monthFind }, { objectName: ObjectName ? ObjectName : `CITAS` }];
            // if(id) filter.push({ objectId:id });
            const result = yield prisma.staticticsMonth.findFirst({ where: { AND: filter } });
            const label = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
            const data = [
                result === null || result === void 0 ? void 0 : result.totalDay1,
                result === null || result === void 0 ? void 0 : result.totalDay2,
                result === null || result === void 0 ? void 0 : result.totalDay3,
                result === null || result === void 0 ? void 0 : result.totalDay4,
                result === null || result === void 0 ? void 0 : result.totalDay5,
                result === null || result === void 0 ? void 0 : result.totalDay6,
                result === null || result === void 0 ? void 0 : result.totalDay7,
                result === null || result === void 0 ? void 0 : result.totalDay8,
                result === null || result === void 0 ? void 0 : result.totalDay9,
                result === null || result === void 0 ? void 0 : result.totalDay10,
                result === null || result === void 0 ? void 0 : result.totalDay11,
                result === null || result === void 0 ? void 0 : result.totalDay12,
                result === null || result === void 0 ? void 0 : result.totalDay13,
                result === null || result === void 0 ? void 0 : result.totalDay14,
                result === null || result === void 0 ? void 0 : result.totalDay15,
                result === null || result === void 0 ? void 0 : result.totalDay16,
                result === null || result === void 0 ? void 0 : result.totalDay17,
                result === null || result === void 0 ? void 0 : result.totalDay18,
                result === null || result === void 0 ? void 0 : result.totalDay19,
                result === null || result === void 0 ? void 0 : result.totalDay20,
                result === null || result === void 0 ? void 0 : result.totalDay21,
                result === null || result === void 0 ? void 0 : result.totalDay22,
                result === null || result === void 0 ? void 0 : result.totalDay23,
                result === null || result === void 0 ? void 0 : result.totalDay24,
                result === null || result === void 0 ? void 0 : result.totalDay25,
                result === null || result === void 0 ? void 0 : result.totalDay26,
                result === null || result === void 0 ? void 0 : result.totalDay27,
                result === null || result === void 0 ? void 0 : result.totalDay28,
                result === null || result === void 0 ? void 0 : result.totalDay29,
                result === null || result === void 0 ? void 0 : result.totalDay30,
                result === null || result === void 0 ? void 0 : result.totalDay31,
            ];
            return { label, data };
        });
    }
    YearGraphicQuote(_a) {
        return __awaiter(this, arguments, void 0, function* ({ year, id, ObjectName }) {
            const prisma = new client_1.PrismaClient();
            const model = new AbstractModel_1.default();
            const yearFind = year ? Number(year) : model.getYear();
            if (id) {
                const result = yield prisma.staticticsYear.findFirst({ where: { AND: [{ objectId: id }, { year: yearFind }] } });
                const label = [];
                model.getAllMonths().forEach((item) => {
                    label.push(item.label);
                });
                const data = [
                    result === null || result === void 0 ? void 0 : result.totalMonth1,
                    result === null || result === void 0 ? void 0 : result.totalMonth2,
                    result === null || result === void 0 ? void 0 : result.totalMonth3,
                    result === null || result === void 0 ? void 0 : result.totalMonth4,
                    result === null || result === void 0 ? void 0 : result.totalMonth5,
                    result === null || result === void 0 ? void 0 : result.totalMonth6,
                    result === null || result === void 0 ? void 0 : result.totalMonth7,
                    result === null || result === void 0 ? void 0 : result.totalMonth8,
                    result === null || result === void 0 ? void 0 : result.totalMonth9,
                    result === null || result === void 0 ? void 0 : result.totalMonth10,
                    result === null || result === void 0 ? void 0 : result.totalMonth11,
                    result === null || result === void 0 ? void 0 : result.totalMonth12,
                ];
                return { label, data };
            }
            const filter = [{ year: yearFind }, { objectName: ObjectName ? ObjectName : `CITAS` }];
            // if(id) filter.push({ objectId:id });
            const result = yield prisma.staticticsYear.findFirst({ where: { AND: filter } });
            const label = [];
            model.getAllMonths().forEach((item) => {
                label.push(item.label);
            });
            const data = [
                result === null || result === void 0 ? void 0 : result.totalMonth1,
                result === null || result === void 0 ? void 0 : result.totalMonth2,
                result === null || result === void 0 ? void 0 : result.totalMonth3,
                result === null || result === void 0 ? void 0 : result.totalMonth4,
                result === null || result === void 0 ? void 0 : result.totalMonth5,
                result === null || result === void 0 ? void 0 : result.totalMonth6,
                result === null || result === void 0 ? void 0 : result.totalMonth7,
                result === null || result === void 0 ? void 0 : result.totalMonth8,
                result === null || result === void 0 ? void 0 : result.totalMonth9,
                result === null || result === void 0 ? void 0 : result.totalMonth10,
                result === null || result === void 0 ? void 0 : result.totalMonth11,
                result === null || result === void 0 ? void 0 : result.totalMonth12,
            ];
            return { label, data };
        });
    }
    PieQuoteStatusChart(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            const prisma = new client_1.PrismaClient();
            const model = new AbstractModel_1.default();
            const quoteModel = new QuotesModel_1.default();
            const filter = [{ isDelete: false }];
            const quoteProcesadoCountPromise = quoteModel.countQuotes({ filter: { AND: [...filter, { status: `PROCESADO` }] } });
            const quoteAprovadoCountPromise = quoteModel.countQuotes({ filter: { AND: [...filter, { status: `APROVADO` }] } });
            const quoteCanceladoCountPromise = quoteModel.countQuotes({ filter: { AND: [...filter, { status: `CANCELADO` }] } });
            const quoteFinalizadoCountPromise = quoteModel.countQuotes({ filter: { AND: [...filter, { status: `FINALIZADO` }] } });
            const procesado = yield quoteProcesadoCountPromise;
            const aprovado = yield quoteAprovadoCountPromise;
            const cancelado = yield quoteCanceladoCountPromise;
            const finalizado = yield quoteFinalizadoCountPromise;
            const label = [`PROCESADO`, "APROVADA", "CANCELADA", "FINALIZADO"];
            const data = [procesado, aprovado, cancelado, finalizado];
            return { label, data };
        });
    }
    PieQuoteDoctorStatusChart(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            const prisma = new client_1.PrismaClient();
            const model = new AbstractModel_1.default();
            const quoteModel = new QuotesModel_1.default();
            const quoteProcesadoCountPromise = quoteModel.countQuotes({ filter: { AND: [{ isDelete: false }, { doctorId: id }, { status: `PROCESADO` }] } });
            const quoteAprovadoCountPromise = quoteModel.countQuotes({ filter: { AND: [{ isDelete: false }, { doctorId: id }, { status: `APROVADO` }] } });
            const quoteCanceladoCountPromise = quoteModel.countQuotes({ filter: { AND: [{ isDelete: false }, { doctorId: id }, { status: `CANCELADO` }] } });
            const quoteFinalizadoCountPromise = quoteModel.countQuotes({ filter: { AND: [{ isDelete: false }, { doctorId: id }, { status: `FINALIZADO` }] } });
            const procesado = yield quoteProcesadoCountPromise;
            const aprovado = yield quoteAprovadoCountPromise;
            const cancelado = yield quoteCanceladoCountPromise;
            const finalizado = yield quoteFinalizadoCountPromise;
            const label = [`PROCESADO`, "APROVADA", "CANCELADA", "FINALIZADO"];
            const data = [procesado, aprovado, cancelado, finalizado];
            return { label, data };
        });
    }
    PieQuotePatientStatusChart(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            const prisma = new client_1.PrismaClient();
            const model = new AbstractModel_1.default();
            const quoteModel = new QuotesModel_1.default();
            const filter = [{ isDelete: false }, { patientId: id }];
            const quoteProcesadoCountPromise = quoteModel.countQuotes({ filter: { AND: [...filter, { status: `PROCESADO` }] } });
            const quoteAprovadoCountPromise = quoteModel.countQuotes({ filter: { AND: [...filter, { status: `APROVADO` }] } });
            const quoteCanceladoCountPromise = quoteModel.countQuotes({ filter: { AND: [...filter, { status: `CANCELADO` }] } });
            const quoteFinalizadoCountPromise = quoteModel.countQuotes({ filter: { AND: [...filter, { status: `FINALIZADO` }] } });
            const procesado = yield quoteProcesadoCountPromise;
            const aprovado = yield quoteAprovadoCountPromise;
            const cancelado = yield quoteCanceladoCountPromise;
            const finalizado = yield quoteFinalizadoCountPromise;
            const label = [`PROCESADO`, "APROVADA", "CANCELADA", "FINALIZADO"];
            const data = [procesado, aprovado, cancelado, finalizado];
            return { label, data };
        });
    }
}
exports.default = GraphicService;
