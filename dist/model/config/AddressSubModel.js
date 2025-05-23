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
class AdressSubModel extends AbstractModel_1.default {
    constructor() {
        super();
    }
    createAdress(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data }) {
            const prisma = new client_1.PrismaClient();
            return prisma.address.create({ data });
        });
    }
    findAdress(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter }) {
            const prisma = new client_1.PrismaClient();
            return prisma.address.findFirst({
                where: filter,
                include: {
                    _count: true,
                    parentReference: true,
                    children: true
                }
            });
        });
    }
    countAdressBy(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter }) {
            const prisma = new client_1.PrismaClient();
            return prisma.address.count({ where: filter });
        });
    }
    findManyAdress(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter, skip, take }) {
            const prisma = new client_1.PrismaClient();
            return prisma.address.findMany({
                where: filter,
                include: {
                    _count: true,
                    parentReference: {
                        include: {
                            parentReference: true,
                        }
                    }
                },
                orderBy: { createAt: "asc" },
                skip,
                take
            });
        });
    }
    updateAdress(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data, filter }) {
            const prisma = new client_1.PrismaClient();
            return prisma.address.update({ data, where: filter });
        });
    }
    deleteAdress(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            const prisma = new client_1.PrismaClient();
            return prisma.address.update({ where: { id }, data: { isDelete: true } });
        });
    }
}
exports.default = AdressSubModel;
