import AbstractController from "../../AbstractController";
import { Request, Response } from "express";
import { OnAdmin, OnSession } from "../../../middlewares/auth";
import { Prisma } from "@prisma/client";
import { CreateUserFrom, UpdateUserFrom } from "../../../form/CreateUserForm";
import AdressSubModel from "../../../model/config/AddressSubModel";
import SpecialityModel from "../../../model/config/SpecialityModel";
import ScheduleModel from "../../../model/schedule/ScheduleModel";
import NotificationModel from "../../../model/user/notification/NotificationModel";


export default class UserController extends AbstractController {

    constructor() {
        super();
    }

    public async RenderList(req:Request,res:Response) {
        const instance = new ScheduleModel();
        const address = new AdressSubModel();
        const speciality = new SpecialityModel();
        const noti = new NotificationModel();
        const user = req.user as any;

        const {param,role} = req.query;
        let queryString = ``;
        // rol
        // param (email,name,lastname,ci,cmeg,matricula,address)

        const take = req.query.take ? Number(req.query.take) : 10;
        const skip = req.query.skip ? Number(req.query.skip) : 0;

        const filter: Prisma.ScheduleWhereInput[] = [];
        // filter.push({ isDelete:false });

        if(param) {
            queryString += `param=${param}`;
        }

        if(role) {
            queryString += queryString ? `&role=${role}` : `role=${role}`;
            // if(filter.length > 0) {
            //     return;
            // }
        }

        filter.push({ primary: true });
        const listPromise = instance.findManySchedule({
            filter: {AND:[{isDelete:false},{OR:filter}]},
            skip,
            take,
        });
        const countPromise = instance.countSchedule({ filter:{AND:[{isDelete:false},{OR:filter}]} });

        const addressListPromise = address.findManyAdress({ filter:{isDelete:false},skip:0,take:200 });
        const specialityListPromise = speciality.findManySpeciality({ filter:{isDelete:false},skip:0,take:200 })

        const returnData = {
            titlePag: `Horarios`,
            notFoundMessage: `No hay horarios`,
            labels: [`Descripción`,`Cítas`,`Propietario`,``],
            list: [] as any,
            countRender: ``,
            foundNext: false,
            urlNext: ``,
            foundPrevious: false,
            urlPrevious: ``,
            roleList: super.getRoles(),
            address: [] as any,
            speciality: [] as any,
            notifications: await noti.GetNowNotification({ id:user.id }),

            form: CreateUserFrom,

            filter: {
                skip,
                take,
                param,
                role
            }
        }

        const specialityList = await specialityListPromise;
        const addressList = await addressListPromise;
        const list = await listPromise;
        const count = await countPromise;        

        // next
        returnData.foundNext = count - skip > 10 ? true : false;
        returnData.urlNext = `/schedule/?skip=${skip+10}&take=${take}`;

        // previus
        returnData.foundPrevious = take <= skip ? true : false; 
        returnData.urlPrevious = `/schedule/?skip=${skip-10}&take=${take}`;

        if(queryString) {
            returnData.urlNext += `&${queryString}`;
            returnData.urlPrevious += `&${queryString}`;
        }

        returnData.address = addressList;
        returnData.speciality = specialityList;
        returnData.list = list;
        returnData.countRender = `${count - skip < 11 ? count : skip+take}/${count}`;

        return res.render(`s/schedule/list.hbs`, returnData);
    }

    public async RenderUnique(req:Request,res:Response) {
        const id = req.params.id as string;
        const instance = new ScheduleModel();
        const noti = new NotificationModel();
        const user = req.user as any;

        const data = instance.findSchedule({ filter:{id} });

        const dataReturn = {
            data: [] as any,
            form: {} as any,
            notifications: await noti.GetNowNotification({ id:user.id }),
            delete: {
                id: id,
                url: `/schedule/${id}/delete`,
                name: `Eliminar especialidad`
            }
        }

        dataReturn.data = await data;
        dataReturn.form = UpdateUserFrom(dataReturn.data.id);
        return res.render(`s/schedule/unique.hbs`, dataReturn);
    }

    public loadRoutes () {
        this.router.get(`/schedule/`, OnSession, OnAdmin, this.RenderList);
        this.router.get(`/schedule/:id`, OnSession, OnAdmin, this.RenderUnique);

        return this.router;
    }
}
