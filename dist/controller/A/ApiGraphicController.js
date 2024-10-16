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
const client_1 = require("@prisma/client");
const GraphicService_1 = __importDefault(require("../../service/GraphicService"));
const UserModel_1 = __importDefault(require("../../model/user/UserModel"));
class ApiGraphicController extends AbstractController_1.default {
    constructor() {
        super();
    }
    GenereteGraphic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const prisma = new client_1.PrismaClient();
            const userModel = new UserModel_1.default();
            const { type, userId, role } = req.query;
            const service = new GraphicService_1.default();
            if (userId && role) {
                const userFound = yield userModel.findUser({ filter: { id: userId } });
                console.log(req.query);
                if (role === "DOCTOR") {
                    if (type === "spaceCiteQuoteYear") {
                        const { year } = req.query;
                        const { label, data } = yield service.YearGraphicQuote({ year, id: userId, ObjectName: `DOCTOR` });
                        console.log(label, data);
                        return res.status(200).json({ label, data });
                    }
                    else if (type === "spaceCiteQuoteMonth") {
                        const { month } = req.query;
                        const { label, data } = yield service.MonthGraphicQuote({ month, id: userId });
                        console.log(label, data);
                        return res.status(200).json({ label, data });
                    }
                    const { data, label } = yield service.PieQuoteDoctorStatusChart({ id: userId });
                    return res.status(200).json({ label, data });
                }
                else {
                    if (type === "spaceCiteQuoteYear") {
                        const { year } = req.query;
                        const { label, data } = yield service.YearGraphicQuote({ year, id: userId, ObjectName: `PACIENTE` });
                        return res.status(200).json({ label, data });
                    }
                    else if (type === "spaceCiteQuoteMonth") {
                        const { month } = req.query;
                        const { label, data } = yield service.MonthGraphicQuote({ month, id: userId });
                        return res.status(200).json({ label, data });
                    }
                    const { data, label } = yield service.PieQuotePatientStatusChart({ id: userId });
                    return res.status(200).json({ label, data });
                }
            }
            if (type === "spaceCiteQuoteStatus") {
                const { label, data } = yield service.PieQuoteStatusChart({ id: userId });
                return res.status(200).json({ label, data });
            }
            else if (type === "spaceCiteQuoteYear") {
                const { year } = req.query;
                const { label, data } = yield service.YearGraphicQuote({ year, id: userId });
                return res.status(200).json({ label, data });
            }
            else if (type === "spaceCiteQuoteMonth") {
                const { month } = req.query;
                const { label, data } = yield service.MonthGraphicQuote({ month, id: userId });
                return res.status(200).json({ label, data });
            }
        });
    }
    loadRoutes() {
        this.router.get(`/api/graphic`, this.GenereteGraphic);
        return this.router;
    }
}
exports.default = ApiGraphicController;
