import { Request, Response } from "express";
import { OnDoctor, OnSession } from "../../../middlewares/auth";
import AbstractController from "../../AbstractController";
import NotificationModel from "../../../model/user/notification/NotificationModel";
import ServicesModel from "../../../model/services/ServiceModel";
import { Prisma } from "@prisma/client";

export default class ServicesControlelr extends AbstractController {

    constructor() {
        super();
    }

    public async RenderList(req:Request,res:Response) {
        const instance = new ServicesModel();
        const noti = new NotificationModel();
        const user = req.user as any;

        const {param,role} = req.query;
        let queryString = ``;

        const take = req.query.take ? Number(req.query.take) : 10;
        const skip = req.query.skip ? Number(req.query.skip) : 0;

        const filter: Prisma.ServicesWhereInput[] = [];
        // filter.push({ isDelete:false });

        if(param) filter.push({ name:{contains:param} });

        const listPromise = instance.findManyServices({
            filter: {AND:[{isDelete:false},{OR:filter}]},
            skip,
            take,
        });
        const countPromise = instance.countServices({ filter:{AND:[{isDelete:false},{OR:filter}]} });

        const returnData = {
            titlePag: `Servicios`,
            notFoundMessage: `No hay servicios`,
            labels: [`Nombre`,`Descripción`],
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

            filter: {
                skip,
                take,
                param,
                role
            }
        }

        const list = await listPromise;
        const count = await countPromise;        

        // next
        returnData.foundNext = count - skip > 10 ? true : false;
        returnData.urlNext = `/service/?skip=${skip+10}&take=${take}`;

        // previus
        returnData.foundPrevious = take <= skip ? true : false; 
        returnData.urlPrevious = `/service/?skip=${skip-10}&take=${take}`;

        if(queryString) {
            returnData.urlNext += `&${queryString}`;
            returnData.urlPrevious += `&${queryString}`;
        }

        returnData.list = list;
        returnData.countRender = `${count - skip < 11 ? count : skip+take}/${count}`;

        return res.render(`s/service/list.hbs`, returnData);
    }

    public async CreateLogic(req:Request,res:Response) {
        const instance = new ServicesModel();
        const {name, description} = req.body;
        const user = req.user as any;

        const data: Prisma.ServicesCreateInput = {
            description,
            name,
            doctorReference: {
                connect: { id:user.id }
            }
        }

        const result = await instance.createServices({ data });

        req.flash(`succ`, `Servicio creado`);
        return res.redirect(`/service`);
    } 

    public async DoctorQuote(req: Request, res: Response) {
        const noti = new NotificationModel();
        const user = req.user as any;

        const dataReturn = {
            notifications: await noti.GetNowNotification({ id: user.id })
        }

        return res.render(`s/quote/list.hbs`, dataReturn);
    }

    public loadRoutes() {
        this.router.get(`/service`, OnSession, OnDoctor, this.RenderList);
        this.router.post(`/service`, OnSession, OnDoctor, this.RenderList);
        this.router.post(`/service/create`, OnSession, OnDoctor, this.CreateLogic);

        return this.router;
    }

} 
