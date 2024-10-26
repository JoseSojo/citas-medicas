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
const AbstractController_1 = __importDefault(require("../../AbstractController"));
const auth_1 = require("../../../middlewares/auth");
const CreateUserForm_1 = require("../../../form/CreateUserForm");
const AddressSubModel_1 = __importDefault(require("../../../model/config/AddressSubModel"));
const SpecialityModel_1 = __importDefault(require("../../../model/config/SpecialityModel"));
const ScheduleModel_1 = __importDefault(require("../../../model/schedule/ScheduleModel"));
const NotificationModel_1 = __importDefault(require("../../../model/user/notification/NotificationModel"));
class UserController extends AbstractController_1.default {
    constructor() {
        super();
    }
    RenderList(req, res) {
        const _super = Object.create(null, {
            getRoles: { get: () => super.getRoles }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const instance = new ScheduleModel_1.default();
            const address = new AddressSubModel_1.default();
            const speciality = new SpecialityModel_1.default();
            const noti = new NotificationModel_1.default();
            const user = req.user;
            const { param, role } = req.query;
            let queryString = ``;
            // rol
            // param (email,name,lastname,ci,cmeg,matricula,address)
            const take = req.query.take ? Number(req.query.take) : 10;
            const skip = req.query.skip ? Number(req.query.skip) : 0;
            const filter = [];
            // filter.push({ isDelete:false });
            if (param) {
                queryString += `param=${param}`;
            }
            if (role) {
                queryString += queryString ? `&role=${role}` : `role=${role}`;
                // if(filter.length > 0) {
                //     return;
                // }
            }
            filter.push({ primary: true });
            const listPromise = instance.findManySchedule({
                filter: { AND: [{ isDelete: false }, { OR: filter }] },
                skip,
                take,
            });
            const countPromise = instance.countSchedule({ filter: { AND: [{ isDelete: false }, { OR: filter }] } });
            const addressListPromise = address.findManyAdress({ filter: { isDelete: false }, skip: 0, take: 200 });
            const specialityListPromise = speciality.findManySpeciality({ filter: { isDelete: false }, skip: 0, take: 200 });
            const returnData = {
                titlePag: `Horarios`,
                notFoundMessage: `No hay horarios`,
                labels: [`Descripción`, `Cítas`, `Propietario`, ``],
                list: [],
                countRender: ``,
                foundNext: false,
                urlNext: ``,
                foundPrevious: false,
                urlPrevious: ``,
                roleList: _super.getRoles.call(this),
                address: [],
                speciality: [],
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
            // next
            returnData.foundNext = count - skip > 10 ? true : false;
            returnData.urlNext = `/schedule/?skip=${skip + 10}&take=${take}`;
            // previus
            returnData.foundPrevious = take <= skip ? true : false;
            returnData.urlPrevious = `/schedule/?skip=${skip - 10}&take=${take}`;
            if (queryString) {
                returnData.urlNext += `&${queryString}`;
                returnData.urlPrevious += `&${queryString}`;
            }
            returnData.address = addressList;
            returnData.speciality = specialityList;
            returnData.list = list;
            returnData.countRender = `${count - skip < 11 ? count : skip + take}/${count}`;
            return res.render(`s/schedule/list.hbs`, returnData);
        });
    }
    RenderUnique(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const instance = new ScheduleModel_1.default();
            const noti = new NotificationModel_1.default();
            const user = req.user;
            const data = instance.findSchedule({ filter: { id } });
            const dataReturn = {
                data: [],
                form: {},
                notifications: yield noti.GetNowNotification({ id: user.id }),
                delete: {
                    id: id,
                    url: `/schedule/${id}/delete`,
                    name: `Eliminar especialidad`
                }
            };
            dataReturn.data = yield data;
            dataReturn.form = (0, CreateUserForm_1.UpdateUserFrom)(dataReturn.data.id);
            return res.render(`s/schedule/unique.hbs`, dataReturn);
        });
    }
    loadRoutes() {
        this.router.get(`/schedule/`, auth_1.OnSession, auth_1.OnAdmin, this.RenderList);
        this.router.get(`/schedule/:id`, auth_1.OnSession, auth_1.OnAdmin, this.RenderUnique);
        return this.router;
    }
}
exports.default = UserController;
