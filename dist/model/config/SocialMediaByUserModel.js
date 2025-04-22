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
class SocialMediaByUserModel extends AbstractModel_1.default {
    constructor() {
        super();
    }
    createOrUpdate(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data }) {
            const prisma = new client_1.PrismaClient();
            const socialFound = yield prisma.socialMediaByUser.findFirst({
                where: {
                    AND: [
                        { socialMediaId: data.socialId },
                        { userId: data.userId }
                    ]
                }
            });
            if (socialFound) {
                return prisma.socialMediaByUser.update({ where: { id: data.socialId }, data: { link: data.link, username: data.username } });
            }
            return prisma.socialMediaByUser.create({
                data: {
                    link: data.link,
                    username: data.username,
                    socialMediaReference: { connect: { id: data.socialId } },
                    userReference: { connect: { id: data.socialId } },
                }
            });
        });
    }
    findTest(_a) {
        return __awaiter(this, arguments, void 0, function* ({ socialId, userId }) {
            const prisma = new client_1.PrismaClient();
            return yield prisma.socialMediaByUser.findFirst({
                where: {
                    AND: [
                        { socialMediaId: socialId },
                        { userId: userId }
                    ]
                }
            });
        });
    }
    updateTest(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data, id }) {
            const prisma = new client_1.PrismaClient();
            return prisma.socialMediaByUser.update({
                data: {
                    link: data.link,
                    username: data.username,
                },
                where: { id }
            });
        });
    }
    deleteSocial(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            const prisma = new client_1.PrismaClient();
            return prisma.socialMediaByUser.delete({ where: { id } });
        });
    }
}
exports.default = SocialMediaByUserModel;
