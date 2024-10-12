import { Request, Response } from "express";
import AbstractController from "../../AbstractController"
import { OnSession } from "../../../middlewares/auth";
import UniversityModel from "../../../model/config/UniversityModel";
import { Prisma } from "@prisma/client";
import { CreateUniversityFrom, UpdateSpecialityFrom } from "../../../form/CreateUniversityForm";
import NotificationModel from "../../../model/user/notification/NotificationModel";

export default class UniversityController extends AbstractController {

    constructor(
    ) {
        super();
    }

    public async RenderList(req:Request,res:Response) {
        const instance = new UniversityModel();
        const noti = new NotificationModel();
        const user = req.user as any;

        const { param } = req.query;
        let queryString = ``;
        // rol
        // param (email,name,lastname,ci,cmeg,matricula,address)

        const take = req.query.take ? Number(req.query.take) : 10;
        const skip = req.query.skip ? Number(req.query.skip) : 0;

        const filter: Prisma.UniversityWhereInput[] = [];

        if(param) {
            queryString += `param=${param}`;
            filter.push({ name: { contains:param } });
        }

        const listPromise = instance.findManyUniversity({
            filter: { AND:[{ isDelete:false },{OR:filter}] },
            skip,
            take,
        })
        const countPromise = instance.countUniversityBy({ filter:{AND:[{isDelete:false},{OR:filter}]} });

        const returnData = {
            titlePag: `Universidad`,
            notFoundMessage: `No hay universidades`,
            labels: [`Nombre`,`Dirección`,`Doctores`],
            list: [] as any,
            countRender: ``,
            foundNext: false,
            urlNext: ``,
            foundPrevious: false,
            urlPrevious: ``,
            notifications: await noti.GetNowNotification({ id:user.id }),
            
            form: CreateUniversityFrom,

            filter: {
                skip,
                take,
                param
            }
        }

        const list = await listPromise;
        const count = await countPromise;

        // next
        returnData.foundNext = count - skip > 10 ? true : false;
        returnData.urlNext = `/university/?skip=${skip+10}&take=${take}`;

        // previus
        returnData.foundPrevious = take <= skip ? true : false; 
        returnData.urlPrevious = `/university/?skip=${skip-10}&take=${take}`;

        if(queryString) {
            returnData.urlNext += `&${queryString}`;
            returnData.urlPrevious += `&${queryString}`;
        }

        returnData.list = list;
        returnData.countRender = `${count - skip < 11 ? count : skip+take}/${count}`;

        return res.render(`s/university/list.hbs`, returnData);
    }

    public async RenderUnique(req:Request,res:Response) {
        const id = req.params.id as string;
        const instance = new UniversityModel();
        const noti = new NotificationModel();
        const user = req.user as any;

        const data = instance.findUniversity({ filter:{id} });

        const dataReturn = {
            data: {} as any,
            form: {} as any,
            notifications: await noti.GetNowNotification({ id:user.id })
        }

        dataReturn.data = await data;
        dataReturn.form = UpdateSpecialityFrom(dataReturn.data.id)
        return res.render(`s/university/unique.hbs`, dataReturn);
    }

    public async CreateLogic(req:Request,res:Response) {
        try {
            const instance = new UniversityModel();
            const { name, adressId } = req.body;
            const user = req.user as any;

            const create = await instance.createUniversity({
                data: { 
                    name,
                    createReference: { connect:{id:user.id} },
                    withAddress: {
                        create: {
                            adressReference:{ connect:{ id:adressId } }
                        }
                    }
                }
            });    

            
            req.flash(`succ`, `Dirección creada`);
            return res.redirect(`/speciality/`);
        } catch (error) {
            req.flash(`Error`, `Error temporal`);
            return res.redirect(`/speciality/`);            
        }
    }

    public async EditLogic(req:Request,res:Response) {
        try {
            const instance = new UniversityModel();
            const { description, name } = req.body;
            const id = req.params.id as string;

            const update = await instance.updateUniversity({
                data: {
                    name,

                },
                filter: { id }
            });        

            req.flash(`succ`, `Universidad creada`);
            return res.redirect(`/speciality/`);
        } catch (error) {
            req.flash(`Error`, `Error temporal`);
            return res.redirect(`/speciality/`);            
        }
    }

    public async DeleteLogic(req:Request,res:Response) {
        try {
            const instance = new UniversityModel();
            const id = req.params.id as string;

            const currentDelete = await instance.deleteUniversity({ id });        

            req.flash(`succ`, `Eliminado exitosamente.`);
            return res.redirect(`/speciality/`);
        } catch (error) {
            req.flash(`Error`, `Error temporal`);
            return res.redirect(`/speciality/`);            
        }
    }

    public loadRoutes() {
        this.router.get(`/university/`, OnSession, this.RenderList);
        this.router.get(`/university/:id`, OnSession, this.RenderUnique);

        this.router.post(`/university/create`, OnSession, this.CreateLogic);
        this.router.post(`/university/:id/delete`, OnSession, this.DeleteLogic);
        this.router.post(`/university/:id/update`, OnSession, this.EditLogic);
        return this.router;
    } 
}
