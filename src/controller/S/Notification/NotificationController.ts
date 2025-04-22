import AbstractController from "../../AbstractController";
import NotificationModel from "../../../model/user/notification/NotificationModel";
import { Request, Response } from "express";
import { OnAdmin, OnAdminORDoctor, OnSession } from "../../../middlewares/auth";
import { Prisma } from "@prisma/client";


export default class NotificationController extends AbstractController {

    constructor() {
        super();
    }

    public async RenderList(req:Request,res:Response) {
        const instance = new NotificationModel();
        const noti = new NotificationModel();

        const {param} = req.query;
        let queryString = ``;
        const user = req.user as any;

        const take = req.query.take ? Number(req.query.take) : 10;
        const skip = req.query.skip ? Number(req.query.skip) : 0;

        const filter: Prisma.NotificationWhereInput[] = [];
        filter.push({ isDelete:false });
        filter.push({ toRole:user.role })
        filter.push({ fromId: user.id });
        filter.push({ toId: user.id });

        if(param) {
            queryString += `param=${param}`;
            filter.push({ message: { contains:param } });
            filter.push({ subject: { contains:param } });
        }

        const listPromise = instance.findManyNotification({
            filter: {AND:[{isDelete:false},{OR:filter}]},
            skip,
            take,
        });
        const countPromise = instance.countNotification({ filter:{AND:[{isDelete:false},{OR:filter}]} });

        const returnData = {
            titlePag: `Notificaciones`,
            notFoundMessage: `No hay notificaciones`,
            labels: [`Mensaje`,`Desde`,`Para`,`Asunto`,``],
            list: [] as any,
            countRender: ``,
            foundNext: false,
            urlNext: ``,
            foundPrevious: false,
            urlPrevious: ``,
            address: [] as any,
            speciality: [] as any,
            notifications: await noti.GetNowNotification({ id:user.id }),

            filter: {
                skip,
                take,
                param,
            }
        }

        const list = await listPromise;
        const count = await countPromise;        

        // next
        returnData.foundNext = count - skip > 10 ? true : false;
        returnData.urlNext = `/notification/?skip=${skip+10}&take=${take}`;

        // previus
        returnData.foundPrevious = take <= skip ? true : false; 
        returnData.urlPrevious = `/notification/?skip=${skip-10}&take=${take}`;

        if(queryString) {
            returnData.urlNext += `&${queryString}`;
            returnData.urlPrevious += `&${queryString}`;
        }

        returnData.list = list;
        returnData.countRender = `${count - skip < 11 ? count : skip+take}/${count}`;

        return res.render(`s/notification/list.hbs`, returnData);
    }

    public async CreateLogic(req:Request,res:Response) {
        try {
            const instance = new NotificationModel();

            const { message, toId, subject, toRole } = req.body;
            const user = req.user as any;
            
            let data: Prisma.NotificationCreateInput = { 
                message, 
                subject,
                fromReference: { connect:{ id:user.id } }
            }

            if(toRole) {
                data = {
                    ...data,
                    toRole
                }
            }

            if (toId) {
                data = {
                    ...data,
                    toReference: {connect: { id:toId }}
                }
            }

            try {
                const create = await instance.createNotification({data}); 

            } catch (error) {
                req.flash(`Error`, `Error temporal`);
                return res.redirect(`/notification/`); 
            }   
            
            req.flash(`succ`, `Notificado.`);
            if(toRole) {
                return res.redirect(`/`);
            }   
            return res.redirect(`/user/${toId}`);

        } catch (error) {
            req.flash(`Error`, `Error temporal`);
            return res.redirect(`/notification/`);            
        }
    } 

    public async DeleteLogic(req:Request,res:Response) {
        try {
            const instance = new NotificationModel();
            const id = req.params.id as string;
            const user = req.user as any;
            await instance.deleteNotification({ id });        

            await instance.CreateHistory({ des:`Eliminación de usuario`, name:`user`,userId:user.id, id });

            req.flash(`succ`, `Eliminado exitosamente.`);
            return res.redirect(`/notification/`);
        } catch (error) {
            req.flash(`Error`, `Error temporal`);
            return res.redirect(`/notification/`);            
        }
    }

    public async ReadNotification(req:Request,res:Response) {
        try {
            const instance = new NotificationModel();
            const id = req.params.id as string;

            await instance.updateNotification({
                data: { read:true }, filter:{ id } }); 

            req.flash(`succ`, `Notificación leída.`);
            return res.redirect(`/notification`);
        } catch (error) {
            req.flash(`Error`, `Error temporal`);
            return res.redirect(`/notification`);            
        }
    }

    public async RenderUnique(req:Request,res:Response) {
        const id = req.params.id as string;
        const noti = new NotificationModel();
        const user = req.user as any;

        const data = noti.findNotification({ filter:{id} });

        const dataReturn = {
            data: [] as any,
            form: {} as any,
            notifications: await noti.GetNowNotification({ id:user.id })
        }

        dataReturn.data = await data;
        return res.render(`s/notification/unique.hbs`, dataReturn);
    }

    public loadRoutes () {
        this.router.get(`/notification/`, OnSession, OnAdminORDoctor, this.RenderList);
        this.router.get(`/notification/:id`, OnSession, OnAdminORDoctor, this.RenderUnique);

        this.router.post(`/notification/create`, OnSession, this.CreateLogic);
        this.router.post(`/notification/:id/create`, OnSession, this.CreateLogic);
        this.router.post(`/notification/:id/read`, OnSession, this.ReadNotification);
        this.router.post(`/notification/:id/delete`, OnSession, this.DeleteLogic);

        return this.router;
    }
}
