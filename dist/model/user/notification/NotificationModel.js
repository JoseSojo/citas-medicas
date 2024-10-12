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
const UserModel_1 = __importDefault(require("../../user/UserModel"));
class NotificationModel extends UserModel_1.default {
    constructor() {
        super();
    }
    GetNowNotification(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            return this.findManyNotification({ filter: { AND: [{ isDelete: false }, { OR: [{ fromId: id }, { toId: id }] }] }, skip: 0, take: 5, order: { read: "asc" } });
        });
    }
    createNotification(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data }) {
            const prisma = new client_1.PrismaClient();
            return prisma.notification.create({ data });
        });
    }
    findNotification(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter }) {
            const prisma = new client_1.PrismaClient();
            return prisma.notification.findFirst({ where: filter, include: { fromReference: true, toReference: true } });
        });
    }
    countNotification(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter }) {
            const prisma = new client_1.PrismaClient();
            return prisma.notification.count({ where: filter });
        });
    }
    findManyNotification(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter, skip, take, order }) {
            const prisma = new client_1.PrismaClient();
            return prisma.notification.findMany({
                where: filter,
                orderBy: { createAt: "asc" },
                skip,
                take,
                include: {
                    fromReference: true,
                    toReference: true,
                }
            });
        });
    }
    updateNotification(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data, filter }) {
            const prisma = new client_1.PrismaClient();
            return prisma.notification.update({ data, where: filter });
        });
    }
    deleteNotification(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            const prisma = new client_1.PrismaClient();
            return prisma.notification.update({ where: { id }, data: { isDelete: true } });
        });
    }
}
exports.default = NotificationModel;
