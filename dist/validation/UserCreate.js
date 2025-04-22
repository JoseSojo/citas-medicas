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
exports.UpdateUser = exports.CreateUser = void 0;
const UserModel_1 = __importDefault(require("../model/user/UserModel"));
const CreateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userInstance = new UserModel_1.default();
    const { name, ci, email, lastname, role, addressId, cmeg_n, matricula, phoneCode, phoneNumber, esp1, esp2 } = req.body;
    const ciFoundPromise = userInstance.findUser({ filter: { ci } });
    const emailFoundPromise = userInstance.findUser({ filter: { email } });
    const cmeg_nFoundPromise = userInstance.findUser({ filter: { cmeg_n } });
    const matriculaFoundPromise = userInstance.findUser({ filter: { matricula } });
    const phoneFoundPromise = userInstance.findUser({ filter: { AND: [{ phoneCode }, { phoneNumber }] } });
    if (!name) {
        req.flash(`err`, `Debe contener el nombre`);
        return res.redirect(`/user`);
    }
    if (ci.length < 8) {
        req.flash(`err`, `Cédula incorrecta`);
        return res.redirect(`/user`);
    }
    if (!email.indexOf(`@`) || !email.indexOf(`.`)) {
        req.flash(`err`, `Correo incorrecto`);
        return res.redirect(`/user`);
    }
    if (!lastname) {
        req.flash(`err`, `Debe contener un apellido`);
        return res.redirect(`/user`);
    }
    if (role === `DOCTOR`) {
        if (!addressId) {
            req.flash(`err`, `Debe contener una dirección`);
            return res.redirect(`/user`);
        }
        if (!cmeg_n) {
            req.flash(`err`, `Debe contener un Número de inscripción`);
            return res.redirect(`/user`);
        }
        if (!matricula) {
            req.flash(`err`, `Debe contener una matrícula`);
            return res.redirect(`/user`);
        }
        if (!phoneCode || !phoneNumber) {
            req.flash(`err`, `Debe contener el número de teléfono`);
            return res.redirect(`/user`);
        }
        if (!esp1 && !esp2) {
            req.flash(`err`, `Debe contener al menos una especialidad`);
            return res.redirect(`/user`);
        }
    }
    const ciFound = yield ciFoundPromise;
    const emailFound = yield emailFoundPromise;
    const cmeg_nFound = yield cmeg_nFoundPromise;
    const matriculaFound = yield matriculaFoundPromise;
    const phoneFound = yield phoneFoundPromise;
    if (ciFound) {
        req.flash(`err`, `Cédula ${ci} ya registrada.`);
        return res.redirect(`/user`);
    }
    if (emailFound) {
        req.flash(`err`, `Correo ${email} ya registrado.`);
        return res.redirect(`/user`);
    }
    if (phoneFound) {
        req.flash(`err`, `Cédula ${phoneCode}${phoneNumber} ya registrado.`);
        return res.redirect(`/user`);
    }
    if (role === `DOCTOR` && cmeg_nFound) {
        req.flash(`err`, `Número de inscripción ${cmeg_n} ya en uso.`);
        return res.redirect(`/user`);
    }
    if (role === `DOCTOR` && matriculaFound) {
        req.flash(`err`, `Matrícula ${matricula} ya en uso.`);
        return res.redirect(`/user`);
    }
    next();
});
exports.CreateUser = CreateUser;
const UpdateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userInstance = new UserModel_1.default();
    const { id } = req.user;
    const { name, ci, email, lastname, addressId, cmeg_n, matricula, phoneCode, phoneNumber, esp1, esp2, password } = req.body;
    const ciFoundPromise = userInstance.findUser({ filter: { AND: [{ ci }, { isDelete: false }, { id: { not: id } }] } });
    const emailFoundPromise = userInstance.findUser({ filter: { AND: [{ email }, { isDelete: false }, { id: { not: id } }] } });
    const cmeg_nFoundPromise = userInstance.findUser({ filter: { AND: [{ cmeg_n }, { isDelete: false }, { id: { not: id } }] } });
    const matriculaFoundPromise = userInstance.findUser({ filter: { AND: [{ matricula }, { isDelete: false }, { id: { not: id } }] } });
    const phoneFoundPromise = userInstance.findUser({ filter: { AND: [{ phoneCode }, { phoneNumber }, { isDelete: false }, { id: { not: id } }] } });
    const ciFound = yield ciFoundPromise;
    const emailFound = yield emailFoundPromise;
    const cmeg_nFound = yield cmeg_nFoundPromise;
    const matriculaFound = yield matriculaFoundPromise;
    const phoneFound = yield phoneFoundPromise;
    const user = req.user;
    const role = user.role;
    if (role === `DOCTOR`) {
        if (emailFound) {
            req.flash(`err`, `Correo ${email} ya registrado.`);
            return res.redirect(`/user`);
        }
        req.body = { email, password };
        return next();
    }
    if (role === `PATIENT`) {
        if (ciFound) {
            req.flash(`err`, `Cédula ${ci} ya registrado.`);
            return res.redirect(`/user`);
        }
        if (emailFound) {
            req.flash(`err`, `Correo ${email} ya registrado.`);
            return res.redirect(`/user`);
        }
        req.body = { email, password, name, lastname, ci };
        return next();
    }
    if (role === `ADMIN`) {
        if (ciFound) {
            req.flash(`err`, `Cédula ${ci} ya registrada.`);
            return res.redirect(`/user`);
        }
        if (emailFound) {
            req.flash(`err`, `Correo ${email} ya registrado.`);
            return res.redirect(`/user`);
        }
        if (phoneFound) {
            req.flash(`err`, `Teléfono ${phoneCode}${phoneNumber} ya registrado.`);
            return res.redirect(`/user`);
        }
        if (cmeg_n && cmeg_nFound) {
            req.flash(`err`, `Número de inscripción ${cmeg_n} ya en uso.`);
            return res.redirect(`/user`);
        }
        if (matricula && matriculaFound) {
            req.flash(`err`, `Matrícula ${matricula} ya en uso.`);
            return res.redirect(`/user`);
        }
        req.body = { email, name, lastname, ci, cmeg_n: cmeg_n ? cmeg_n : ``, matricula: matricula ? matricula : ``, phoneCode, phoneNumber };
        return next();
    }
    req.flash(`err`, `Error temporal`);
    return res.redirect(`/`);
});
exports.UpdateUser = UpdateUser;
