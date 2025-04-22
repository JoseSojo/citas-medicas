import { Request, Response } from "express";
import AbstractController from "../../AbstractController"
import { OnSession } from "../../../middlewares/auth";
import SpecialityModel from "../../../model/config/SpecialityModel";
import { Prisma } from "@prisma/client";
import { CreateSpecialityFrom, UpdateSpecialityFrom } from "../../../form/CreateSpecialityForm";
import NotificationModel from "../../../model/user/notification/NotificationModel";

export default class SpecialityController extends AbstractController {

    constructor(
        private prefix = `/speciality`,
        private instance = new SpecialityModel()
    ) {
        super();
    }

    public async RenderList(req:Request,res:Response) {
        const instance = new SpecialityModel();
        const noti = new NotificationModel();
        const user = req.user as any;

        const { param } = req.query;
        let queryString = ``;
        // rol
        // param (email,name,lastname,ci,cmeg,matricula,address)

        const take = req.query.take ? Number(req.query.take) : 10;
        const skip = req.query.skip ? Number(req.query.skip) : 0;

        const filter: Prisma.SpecialityWhereInput[] = [];

        if(param) {
            queryString += `param=${param}`;
            filter.push({ name: { contains:param } });
        }

        const listPromise = instance.findManySpeciality({
            filter: { AND:[{ isDelete:false },{OR:filter}] },
            skip,
            take,
        })
        const countPromise = instance.countSpecialityBy({ filter:{AND:[{isDelete:false},{OR:filter}]} });

        const returnData = {
            titlePag: `Especialidades`,
            notFoundMessage: `No hay especialidad`,
            labels: [`Nombre`,`Descripción`,``],
            list: [] as any,
            countRender: ``,
            foundNext: false,
            urlNext: ``,
            foundPrevious: false,
            urlPrevious: ``,
            notifications: await noti.GetNowNotification({ id:user.id }),
            
            form: CreateSpecialityFrom,

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
        returnData.urlNext = `/speciality/?skip=${skip+10}&take=${take}`;

        // previus
        returnData.foundPrevious = take <= skip ? true : false; 
        returnData.urlPrevious = `/speciality/?skip=${skip-10}&take=${take}`;

        if(queryString) {
            returnData.urlNext += `&${queryString}`;
            returnData.urlPrevious += `&${queryString}`;
        }

        returnData.list = list;
        returnData.countRender = `${count - skip < 11 ? count : skip+take}/${count}`;

        return res.render(`s/speciality/list.hbs`, returnData);
    }

    public async RenderUnique(req:Request,res:Response) {
        const id = req.params.id as string;
        const instance = new SpecialityModel();
        const noti = new NotificationModel();
        const user = req.user as any;

        const data = instance.findSpeciality({ filter:{id} });

        const dataReturn = {
            data: {} as any,
            form: {} as any,
            notifications: await noti.GetNowNotification({ id:user.id }),
            delete: {
                id: id,
                url: `/speciality/${id}/delete`,
                name: `Eliminar especialidad`
            }
        }

        dataReturn.data = await data;
        dataReturn.form = UpdateSpecialityFrom(dataReturn.data.id)
        return res.render(`s/speciality/unique.hbs`, dataReturn);
    }

    public async CreateLogic(req:Request,res:Response) {
        try {
            const instance = new SpecialityModel();
            const { name, description } = req.body;
            const user = req.user as any;

            const create = await instance.createSpeciality({
                data: { name, description }
            });    

            await instance.CreateHistory({ des:`Creación de especialidad Nombre:${name}, Descripción:${description}`, name:`speciality`, userId:user.id });            

            req.flash(`succ`, `Especialidad creada`);
            return res.redirect(`/speciality/`);
        } catch (error) {
            req.flash(`Error`, `Error temporal`);
            return res.redirect(`/speciality/`);            
        }
    }

    public async EditLogic(req:Request,res:Response) {
        try {
            const instance = new SpecialityModel();
            const { description, name } = req.body;
            const id = req.params.id as string;

            const update = await instance.updateSpeciality({
                data: {
                    description,name
                },
                filter: { id }
            });        

            req.flash(`succ`, `Especialidad creada`);
            return res.redirect(`/speciality/`);
        } catch (error) {
            req.flash(`Error`, `Error temporal`);
            return res.redirect(`/speciality/`);            
        }
    }

    public async DeleteLogic(req:Request,res:Response) {
        try {
            const instance = new SpecialityModel();
            const id = req.params.id as string;
            const user = req.user as any;

            const currentDelete = await instance.deleteSpeciality({ id });        

            await instance.CreateHistory({ des:`Eliminación de usuario`, name:`speciality`,userId:user.id, id });
            req.flash(`succ`, `Eliminado exitosamente.`);
            return res.redirect(`/speciality/`);
        } catch (error) {
            req.flash(`Error`, `Error temporal`);
            return res.redirect(`/speciality/`);            
        }
    }

    public loadRoutes() {
        this.router.get(`/speciality/`, OnSession, this.RenderList);
        this.router.get(`/speciality/:id`, OnSession, this.RenderUnique);

        this.router.post(`/speciality/create`, OnSession, this.CreateLogic);
        this.router.post(`/speciality/:id/delete`, OnSession, this.DeleteLogic);
        this.router.post(`/speciality/:id/update`, OnSession, this.EditLogic);
        return this.router;
    } 
}
