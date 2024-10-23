import { Request, Response } from "express";
import AbstractController from "../../AbstractController"
import { OnSession } from "../../../middlewares/auth";
import SocialMediaModel from "../../../model/config/SocialMediaModel";
import { Prisma } from "@prisma/client";
import { CreateSocialFrom } from "../../../form/CreateSocialForm";
import NotificationModel from "../../../model/user/notification/NotificationModel";

export default class AdressController extends AbstractController {

    constructor(
        private prefix = `social`,
        
    ) {
        super();
    }

    public async RenderList(req:Request,res:Response) {
        const instance = new SocialMediaModel()
        const noti = new NotificationModel();
        const user = req.user as any;

        const { param } = req.query;
        let queryString = ``;
        // rol
        // param (email,name,lastname,ci,cmeg,matricula,address)

        const take = req.query.take ? Number(req.query.take) : 20;
        const skip = req.query.skip ? Number(req.query.skip) : 0;

        const filter: Prisma.SocialMediaWhereInput[] = [];

        // if(param) {
        //     queryString += `param=${param}`;
        //     filter.push({ name: { contains:param } });
        // }

        const listPromise = instance.findManySocialMedia({
            filter: { AND:[{ isDelete:false },{OR:filter}] },
            skip,
            take,
        })
        const countPromise = instance.countSocialMedia({ filter:{AND:[{isDelete:false},{OR:filter}]} });

        const returnData = {
            titlePag: `Redes Sociales`,
            notFoundMessage: `No hay Redes Sociales`,
            labels: [`Logo`,`Nombre`,`Usuarios`],
            list: [] as any,
            countRender: ``,
            // foundNext: false,
            // urlNext: ``,
            // foundPrevious: false,
            // urlPrevious: ``,

            form: CreateSocialFrom,
            notifications: await noti.GetNowNotification({ id:user.id }),

            // filter: {
            //     skip,
            //     take,
            //     param
            // }
        }

        const list = await listPromise;
        const count = await countPromise;

        // // next
        // returnData.foundNext = take +10 < count ? true : false; 
        // returnData.urlNext = `/social/?skip=${skip+10}&take=${take}`;

        // // previous
        // returnData.foundPrevious = take <= skip ? true : false; 
        // returnData.urlPrevious = `/social/?skip=${skip-10}&take=${take}`;

        // if(queryString) {
        //     returnData.urlNext += `&${queryString}`;
        //     returnData.urlPrevious += `&${queryString}`;
        // }

        returnData.list = list;
        returnData.countRender = `${skip ? skip : count < 10 ? count : 10}/${count}`;


        return res.render(`s/social/list.hbs`, returnData);
    }

    public async RenderUnique(req:Request,res:Response) {
        const instance = new SocialMediaModel()
        const noti = new NotificationModel();
        const user = req.user as any;

        const dataReturn = {
            notifications: await noti.GetNowNotification({ id:user.id })
        }

        return res.render(`s/social/unique.hbs`, dataReturn);
    }

    public async CreateLogic(req:Request,res:Response) {
        try {
            const instance = new SocialMediaModel()
            const { name, icoUrl } = req.body;

            const create = await instance.createSocialMedia({
                data: {
                    icoUrl,name
                }
            });        

            req.flash(`succ`, `Red social creada`);
            return res.redirect(`/social/`);
        } catch (error) {
            req.flash(`Error`, `Error temporal`);
            return res.redirect(`/social/`);            
        }
    }

    public async EditLogic(req:Request,res:Response) {
        try {
            const instance = new SocialMediaModel()
            const { icoUrl, name } = req.body;
            const id = req.params.id as string;
            const user = req.user as any;

            const update = await instance.updateSocialMedia({
                data: {
                    icoUrl,name
                },
                filter: { id }
            });  
            
            await instance.CreateHistory({ des:`Actualización de medio social, ${update.name}`,name:`socialmedia`,userId:user.id });

            req.flash(`succ`, `Red social creada`);
            return res.redirect(`/social/`);
        } catch (error) {
            req.flash(`Error`, `Error temporal`);
            return res.redirect(`/social/`);            
        }
    }

    public async DeleteLogic(req:Request,res:Response) {
        try {
            const instance = new SocialMediaModel()
            const id = req.params.id as string;

            const currentDelete = await instance.deleteAdress({ id });        

            req.flash(`succ`, `Eliminado exitosamente.`);
            return res.redirect(`/social/`);
        } catch (error) {
            req.flash(`Error`, `Error temporal`);
            return res.redirect(`/social/`);            
        }
    }

    public loadRoutes() {
        this.router.get(`/social/`, OnSession, this.RenderList);
        this.router.get(`/social/:id`, OnSession, this.RenderUnique);

        this.router.post(`/social/create`, OnSession, this.CreateLogic);
        this.router.post(`/social/:id/delete`, OnSession, this.DeleteLogic);
        this.router.post(`/social/:id/update`, OnSession, this.EditLogic);

        return this.router;
    } 
}
