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
class ScheduleSubModel extends AbstractModel_1.default {
    constructor() {
        super();
    }
    createSchedule(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data }) {
            const prisma = new client_1.PrismaClient();
            return prisma.schedule.create({ data });
        });
    }
    singPrimary(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, user }) {
            const prisma = new client_1.PrismaClient();
            const foundPrimary = yield prisma.schedule.findMany({
                where: {
                    AND: [{ primary: true }, { isDelete: false }, { userId: user }]
                },
                select: { id: true }
            });
            if (foundPrimary) {
                foundPrimary.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                    yield prisma.schedule.update({
                        data: { primary: false },
                        where: { id: item.id }
                    });
                }));
            }
            return prisma.schedule.update({
                data: { primary: true },
                where: { id }
            });
        });
    }
    findSchedule(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter }) {
            const prisma = new client_1.PrismaClient();
            return prisma.schedule.findFirst({
                where: filter,
                include: {
                    detail: {
                        orderBy: { day_index: "asc" },
                        select: {
                            day: true,
                            day_index: true,
                            scheduleId: true,
                            time_end: true,
                            time_start: true,
                            id: true,
                            isDelete: true
                        }
                    },
                    user: true,
                    _count: true
                }
            });
        });
    }
    countSchedule(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter }) {
            const prisma = new client_1.PrismaClient();
            return prisma.schedule.count({ where: filter });
        });
    }
    findManySchedule(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter, skip, take }) {
            const prisma = new client_1.PrismaClient();
            return prisma.schedule.findMany({
                where: filter,
                orderBy: {
                    primary: "desc",
                },
                include: {
                    _count: true,
                    user: true
                },
                skip,
                take
            });
        });
    }
    updateSchedule(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data, filter }) {
            const prisma = new client_1.PrismaClient();
            return prisma.schedule.update({ data, where: filter });
        });
    }
    deleteAdress(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            const prisma = new client_1.PrismaClient();
            return prisma.schedule.update({ where: { id }, data: { isDelete: true } });
        });
    }
}
exports.default = ScheduleSubModel;
