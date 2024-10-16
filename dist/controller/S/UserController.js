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
const UserModel_1 = __importDefault(require("../../model/user/UserModel"));
const auth_1 = require("../../middlewares/auth");
const CreateUserForm_1 = require("../../form/CreateUserForm");
const AddressSubModel_1 = __importDefault(require("../../model/config/AddressSubModel"));
const SpecialityModel_1 = __importDefault(require("../../model/config/SpecialityModel"));
const UserCreate_1 = require("../../validation/UserCreate");
const NotificationModel_1 = __importDefault(require("../../model/user/notification/NotificationModel"));
const UniversityModel_1 = __importDefault(require("../../model/config/UniversityModel"));
class UserController extends AbstractController_1.default {
    constructor() {
        super();
    }
    RenderList(req, res) {
        const _super = Object.create(null, {
            getRoles: { get: () => super.getRoles }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const instance = new UserModel_1.default();
            const address = new AddressSubModel_1.default();
            const speciality = new SpecialityModel_1.default();
            const user = req.user;
            const noti = new NotificationModel_1.default();
            const univ = new UniversityModel_1.default();
            const { param, role, addressId } = req.query;
            let queryString = ``;
            // rol
            // param (email,name,lastname,ci,cmeg,matricula,address)
            const take = req.query.take ? Number(req.query.take) : 10;
            const skip = req.query.skip ? Number(req.query.skip) : 0;
            const filter = [];
            // filter.push({ isDelete:false });
            if (param) {
                queryString += `param=${param}`;
                filter.push({ name: { contains: param } });
                filter.push({ email: { contains: param } });
                filter.push({ lastname: { contains: param } });
                filter.push({ ci: { contains: param } });
                filter.push({ cmeg_n: { contains: param } });
                filter.push({ matricula: { contains: param } });
            }
            if (role) {
                queryString += queryString ? `&role=${role}` : `role=${role}`;
                // if(filter.length > 0) {
                //     return;
                // }
                filter.push({ role: role });
            }
            if (addressId) {
                filter.push({ addressId });
                queryString += queryString ? `&addressId=${addressId}` : `addressId=${addressId}`;
            }
            const listPromise = instance.findManyUser({
                filter: { AND: [{ isDelete: false }, { OR: filter }] },
                skip,
                take,
            });
            const countPromise = instance.countUser({ filter: { AND: [{ isDelete: false }, { OR: filter }] } });
            const addressListPromise = address.findManyAdress({ filter: { isDelete: false }, skip: 0, take: 200 });
            const specialityListPromise = speciality.findManySpeciality({ filter: { isDelete: false }, skip: 0, take: 200 });
            const universityListPromise = univ.findManyUniversity({ filter: { isDelete: false }, skip: 0, take: 200 });
            const returnData = {
                titlePag: `Usuarios`,
                notFoundMessage: `No hay usuarios`,
                labels: [`Nombre`, `Cédula`, `Correo`, `Rol`, ``],
                list: [],
                countRender: ``,
                foundNext: false,
                urlNext: ``,
                foundPrevious: false,
                urlPrevious: ``,
                roleList: _super.getRoles.call(this),
                address: [],
                speciality: [],
                university: [],
                notifications: yield noti.GetNowNotification({ id: user.id }),
                form: CreateUserForm_1.CreateUserFrom,
                filter: {
                    skip,
                    take,
                    param,
                    role
                }
            };
            const specialityList = yield specialityListPromise;
            const addressList = yield addressListPromise;
            const list = yield listPromise;
            const count = yield countPromise;
            const listUniversity = yield universityListPromise;
            // next
            returnData.foundNext = count - skip > 10 ? true : false;
            returnData.urlNext = `/user/?skip=${skip + 10}&take=${take}`;
            // previus
            returnData.foundPrevious = take <= skip ? true : false;
            returnData.urlPrevious = `/user/?skip=${skip - 10}&take=${take}`;
            if (queryString) {
                returnData.urlNext += `&${queryString}`;
                returnData.urlPrevious += `&${queryString}`;
            }
            returnData.address = addressList;
            returnData.speciality = specialityList;
            returnData.list = list;
            returnData.university = listUniversity;
            returnData.countRender = `${count - skip < 11 ? count : skip + take}/${count}`;
            return res.render(`s/user/list.hbs`, returnData);
        });
    }
    RenderUnique(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const instance = new UserModel_1.default();
            const speciality = new SpecialityModel_1.default();
            const univ = new UniversityModel_1.default();
            const noti = new NotificationModel_1.default();
            const user = req.user;
            const data = instance.findUser({ filter: { id } });
            const specialityListPromise = speciality.findManySpeciality({ filter: { isDelete: false }, skip: 0, take: 200 });
            const universityListPromise = univ.findManyUniversity({ filter: { isDelete: false }, skip: 0, take: 200 });
            const dataReturn = {
                data: [],
                form: {},
                year: yield instance.getYears(),
                speciality: [],
                university: [],
                notifications: yield noti.GetNowNotification({ id: user.id })
            };
            dataReturn.data = yield data;
            dataReturn.form = (0, CreateUserForm_1.UpdateUserFrom)(dataReturn.data.id);
            dataReturn.speciality = yield specialityListPromise;
            dataReturn.university = yield universityListPromise;
            return res.render(`s/user/unique.hbs`, dataReturn);
        });
    }
    CreateLogic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // try {
            const instance = new UserModel_1.default();
            const addressInstance = new AddressSubModel_1.default();
            const speciality = new SpecialityModel_1.default();
            const { universityId, egresDate, rif, exacAddress, birthdate, name, ci, email, lastname, role, addressId, cmeg_n, matricula, phoneCode, phoneNumber, esp1, esp2 } = req.body;
            const user = req.user;
            let parentId;
            if (user)
                parentId = user.id;
            if (!name) {
                req.flash(`error`, `Debe completar los datos correctamente`);
                return res.redirect(`/user/`);
            }
            let data = {
                ci,
                cmeg_n: cmeg_n ? cmeg_n : ``,
                matricula: matricula ? matricula : ``,
                email,
                password: ci,
                name,
                lastname,
                role,
                phoneCode: phoneCode ? phoneCode : ``,
                phoneNumber: phoneNumber ? phoneNumber : ``,
                birthdate,
                exacAddress,
                rif,
                egresDate: egresDate
            };
            if (universityId)
                data = Object.assign(Object.assign({}, data), { egresUniversityReference: { connect: { id: universityId } } });
            if (!addressId.includes(`opción`)) {
                data = Object.assign(Object.assign({}, data), { addressReference: {
                        connect: { id: addressId }
                    } });
            }
            if (parentId) {
                data = Object.assign(Object.assign({}, data), { parentReference: { connect: { id: parentId } } });
            }
            console.log(data);
            yield instance.createUser({ data });
            req.flash(`succ`, `Usuario creado`);
            return res.redirect(`/user/`);
            // } catch (error) {
            // console.log(error);
            req.flash(`Error`, `Error temporal`);
            return res.redirect(`/user/`);
            // }
        });
    }
    EditLogic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instance = new UserModel_1.default();
                const { rif, ci, name, lastname, phoneCode, phoneNumber, cmeg_n, matricula, email } = req.body;
                const id = req.params.id;
                let dataUpdate = {};
                if (ci)
                    dataUpdate = Object.assign(Object.assign({}, dataUpdate), { ci });
                if (email)
                    dataUpdate = Object.assign(Object.assign({}, dataUpdate), { email });
                if (name)
                    dataUpdate = Object.assign(Object.assign({}, dataUpdate), { name });
                if (lastname)
                    dataUpdate = Object.assign(Object.assign({}, dataUpdate), { lastname });
                if (phoneCode)
                    dataUpdate = Object.assign(Object.assign({}, dataUpdate), { phoneCode });
                if (phoneNumber)
                    dataUpdate = Object.assign(Object.assign({}, dataUpdate), { phoneNumber });
                if (email)
                    dataUpdate = Object.assign(Object.assign({}, dataUpdate), { email });
                if (cmeg_n)
                    dataUpdate = Object.assign(Object.assign({}, dataUpdate), { cmeg_n });
                if (matricula)
                    dataUpdate = Object.assign(Object.assign({}, dataUpdate), { matricula });
                if (rif)
                    dataUpdate = Object.assign(Object.assign({}, dataUpdate), { rif });
                yield instance.updateUser({
                    data: dataUpdate,
                    id
                });
                // req.flash(`succ`, `Usuario actualizado`);
                return res.redirect(`/profile`);
            }
            catch (error) {
                req.flash(`Error`, `Error temporal`);
                return res.redirect(`/user/`);
            }
        });
    }
    DeleteLogic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instance = new UserModel_1.default();
                const id = req.params.id;
                yield instance.deleteUser({ id });
                req.flash(`succ`, `Eliminado exitosamente.`);
                return res.redirect(`/user/`);
            }
            catch (error) {
                req.flash(`Error`, `Error temporal`);
                return res.redirect(`/user/`);
            }
        });
    }
    UpdatePasswordLogic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instance = new UserModel_1.default();
                const { password, passwordNew, passwordRepeat, currentPassword } = req.body;
                const id = req.params.id;
                if (passwordNew !== passwordRepeat) {
                    req.flash(`err`, `Las contraseñas no coinciden`);
                    return res.redirect(`/profile`);
                }
                const compare = yield instance.ComparePassword({ dbPassword: currentPassword, password });
                if (!compare) {
                    req.flash(`err`, `Las contraseñas no coinciden`);
                    return res.redirect(`/profile`);
                }
                yield instance.updateUser({
                    data: {
                        password: yield instance.HashPassword({ password: passwordNew }),
                    },
                    id
                });
                req.flash(`succ`, `Usuario actualizado`);
                return res.render(`/profiel`);
            }
            catch (error) {
                req.flash(`Error`, `Error temporal`);
                return res.redirect(`/profile/`);
            }
        });
    }
    loadRoutes() {
        this.router.get(`/user/`, auth_1.OnSession, auth_1.OnAdminORDoctor, this.RenderList);
        this.router.post(`/user/create/`, auth_1.OnSession, this.CreateLogic);
        this.router.get(`/user/:id`, auth_1.OnSession, auth_1.OnAdminORDoctor, this.RenderUnique);
        this.router.post(`/user/:id/update`, auth_1.OnSession, UserCreate_1.UpdateUser, this.EditLogic);
        this.router.post(`/user/:id/password`, auth_1.OnSession, this.UpdatePasswordLogic);
        this.router.post(`/user/:id/delete`, auth_1.OnSession, auth_1.OnAdmin, this.DeleteLogic);
        return this.router;
    }
}
exports.default = UserController;
