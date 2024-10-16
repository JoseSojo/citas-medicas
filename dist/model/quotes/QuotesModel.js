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
const AbstractModel_1 = __importDefault(require("../AbstractModel"));
class QuotesSubModel extends AbstractModel_1.default {
    constructor() {
        super();
    }
    createQuotes(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data }) {
            const prisma = new client_1.PrismaClient();
            return prisma.quotes.create({ data });
        });
    }
    findQuotes(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter }) {
            const prisma = new client_1.PrismaClient();
            return prisma.quotes.findFirst({
                where: filter,
                include: {
                    doctorReference: true,
                    patientReference: true,
                    quoteDetailReference: true,
                }
            });
        });
    }
    countQuotes(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter }) {
            const prisma = new client_1.PrismaClient();
            return prisma.quotes.count({
                where: filter
            });
        });
    }
    findManyQuotes(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter, skip, take }) {
            const prisma = new client_1.PrismaClient();
            return prisma.quotes.findMany({
                where: filter,
                orderBy: { createAt: "asc" },
                skip,
                take,
                include: {
                    doctorReference: true,
                    patientReference: true,
                    quoteDetailReference: true
                }
            });
        });
    }
    updateQuotes(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data, filter }) {
            const prisma = new client_1.PrismaClient();
            return prisma.quotes.update({ data, where: filter });
        });
    }
    deleteAdress(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            const prisma = new client_1.PrismaClient();
            return prisma.quotes.update({ where: { id }, data: { isDelete: true } });
        });
    }
}
exports.default = QuotesSubModel;
