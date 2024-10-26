import AbstractController from "../AbstractController";
import { Request, Response } from "express";
import { OnAdmin, OnSession } from "../../middlewares/auth";
import { Prisma, PrismaClient } from "@prisma/client";
import { CreateUserFrom } from "../../form/CreateUserForm";
import AdressSubModel from "../../model/config/AddressSubModel";
import SpecialityModel from "../../model/config/SpecialityModel";
import NotificationModel from "../../model/user/notification/NotificationModel";
import UserModel from "../../model/user/UserModel";


export default class HistoryController extends AbstractController {

    constructor() {
        super();
    }

    public async RenderList(req:Request,res:Response) {
        const instance = new UserModel();
        const noti = new NotificationModel();
        const user = req.user as any;

        const {action,entity,param} = req.query;
        let queryString = ``;

        const take = req.query.take ? Number(req.query.take) : 10;
        const skip = req.query.skip ? Number(req.query.skip) : 0;

        const filter: Prisma.HistoryWhereInput[] = [];

        if(param) {
            filter.push({ description: {contains: param} });
            queryString += `param=${param}`;
        }

        if(action) {
            if(action == `delete`) filter.push({ description: {contains: `liminaci`} });
            if(action == `create`) filter.push({ description: {contains: `reaci`} });
            if(action == `update`) filter.push({ description: {contains: `ctuali`} });
            if(action == `recovery`) filter.push({ description: {contains: `ecuperaci`} });
            queryString += `action=${action}`;
        }

        if(entity) {
            filter.push({ objectName: {contains: param} });
            queryString += `entity=${entity}`;
        }

        const listPromise = instance.findManyUserHistory({
            filter: {AND:[{OR:filter}]},
            skip,
            take,
        });
        const countPromise = instance.findManyCount({ filter:{AND:[{OR:filter}]} });

        const returnData = {
            titlePag: `Historial`,
            notFoundMessage: `No hay historial`,
            labels: [`Fecha`,`Descripción`,`Creador`,``],
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
                action,
                entity
            }
        }

        const list = await listPromise;
        const count = await countPromise;        

        // next
        returnData.foundNext = count - skip > 10 ? true : false;
        returnData.urlNext = `/history/?skip=${skip+10}&take=${take}`;

        // previus
        returnData.foundPrevious = take <= skip ? true : false; 
        returnData.urlPrevious = `/history/?skip=${skip-10}&take=${take}`;

        if(queryString) {
            returnData.urlNext += `&${queryString}`;
            returnData.urlPrevious += `&${queryString}`;
        }

        returnData.list = list;
        returnData.countRender = `${count - skip < 11 ? count : skip+take}/${count}`;

        return res.render(`s/history.hbs`, returnData);
    }

    public async Restore(req:Request,res:Response) {
        const user = req.user as any;
        const instance = new UserModel();
        const { name, id } = req.body;

        const prisma = new PrismaClient();
        switch (name) {
            case `user`:
                await prisma.user.update({ data:{isDelete:false}, where:{id} });
                await instance.CreateHistory({ des:`Recuperación de usuario`,name:`user`,userId:user.id,id:id });
                req.flash(`succ`, `Registro recuperado`);
                return res.redirect(`/user/${id}`);
                break;
            case `university`:
                await prisma.university.update({ data:{isDelete:false}, where:{id} });
                await instance.CreateHistory({ des:`Recuperación de universidad`,name:`user`,userId:user.id,id:id });
                req.flash(`succ`, `Registro recuperado`);
                return res.redirect(`/university/${id}`);
                break;

            case `speciality`:
                await prisma.speciality.update({ data:{isDelete:false}, where:{id} });
                await instance.CreateHistory({ des:`Recuperación de especialidad`,name:`user`,userId:user.id,id:id });
                req.flash(`succ`, `Registro recuperado`);
                return res.redirect(`/speciality/${id}`);
                break;
        
            default:
                break;
        }

        
        return res.redirect(`/history`);
    }

    public loadRoutes () {
        this.router.get(`/history/`, OnSession, OnAdmin, this.RenderList);
        this.router.post(`/history/restore`, OnSession, OnAdmin, this.Restore);

        return this.router;
    }
}
