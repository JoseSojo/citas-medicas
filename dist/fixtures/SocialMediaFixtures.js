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
const AbstractFixture_1 = __importDefault(require("./AbstractFixture"));
const SocialMediaModel_1 = __importDefault(require("../model/config/SocialMediaModel"));
class SocialMediaFixtures extends AbstractFixture_1.default {
    constructor() {
        super();
    }
    push() {
        return __awaiter(this, void 0, void 0, function* () {
            const social = new SocialMediaModel_1.default();
            const resultAddress = [];
            const currentSocial = this.nativeMediaSocial();
            for (let i = 0; i < currentSocial.length; i++) {
                const result = yield social.createSocialMedia({ data: { name: currentSocial[i].name, icoUrl: currentSocial[i].linkSource } });
                resultAddress.push(result);
            }
        });
    }
}
exports.default = SocialMediaFixtures;
