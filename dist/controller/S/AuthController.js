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
const passport_1 = __importDefault(require("passport"));
const AbstractController_1 = __importDefault(require("../AbstractController"));
const auth_1 = require("../../middlewares/auth");
const UserModel_1 = __importDefault(require("../../model/user/UserModel"));
const util_1 = require("../../util");
class AuthController extends AbstractController_1.default {
    constructor(prefix = ``) {
        super();
        this.prefix = prefix;
    }
    LoginController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            passport_1.default.authenticate("local.login", {
                successRedirect: "/",
                failureRedirect: "/login",
                failureFlash: true
            })(req, res, next);
        });
    }
    RegisterPatient(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instance = new UserModel_1.default();
                const { exacAddress, birthdate, name, ci, email, lastname, phoneCode, phoneNumber, password } = req.body;
                const user = req.user;
                let parentId;
                const age = (0, util_1.caclAge)(birthdate);
                console.log(`############### ${password}`);
                if (user)
                    parentId = user.id;
                if (!name) {
                    req.flash(`error`, `Debe completar los datos correctamente`);
                    return res.redirect(`/register/`);
                }
                let data = {
                    ci,
                    email,
                    password,
                    name,
                    lastname,
                    role: `PACIENTE`,
                    phoneCode: phoneCode ? phoneCode : ``,
                    phoneNumber: phoneNumber ? phoneNumber : ``,
                    birthdate: birthdate,
                    exacAddress,
                    age
                };
                if (parentId) {
                    data = Object.assign(Object.assign({}, data), { parentReference: { connect: { id: parentId } } });
                }
                try {
                    const create = yield instance.createUser({ data });
                }
                catch (error) {
                    req.flash(`Error`, `Error temporal`);
                    return res.redirect(`/login/`);
                }
                req.flash(`succ`, `Usuario creado`);
                return res.redirect(`/login/`);
            }
            catch (error) {
                req.flash(`Error`, `Error temporal`);
                return res.redirect(`/login/`);
            }
        });
    }
    loadRoutes() {
        this.router.post(`${this.prefix}/login`, auth_1.OffSession, this.LoginController);
        this.router.post(`/register`, this.RegisterPatient);
        return this.router;
    }
}
exports.default = AuthController;
