import { Request, Response } from "express";
import AbstractController from "../../AbstractController"
import { OnSession } from "../../../middlewares/auth";
import AdressSubModel from "../../../model/config/AddressSubModel";
import { Prisma } from "@prisma/client";
import { CreateAddressFrom, UpdateDirecciónFrom } from "../../../form/CreateAddressFrom";
import NotificationModel from "../../../model/user/notification/NotificationModel";

export default class AdressController extends AbstractController {

    constructor() {
        super();
    }

    public async RenderList(req:Request,res:Response) {
        const instance = new AdressSubModel();
        const noti = new NotificationModel();
        const user = req.user as any;
        const { param } = req.query;
        let queryString = ``;
        // rol
        // param (email,name,lastname,ci,cmeg,matricula,address)

        const take = req.query.take ? Number(req.query.take) : 10;
        const skip = req.query.skip ? Number(req.query.skip) : 0;

        const filter: Prisma.AddressWhereInput[] = [];

        if(param) {
            queryString += `param=${param}`;
            filter.push({ description: { contains:param } });
        }

        const listPromise = instance.findManyAdress({
            filter: { AND:[{ isDelete:false },{OR:filter}] },
            skip,
            take,
        })
        const countPromise = instance.countAdressBy({ filter:{AND:[{isDelete:false},{OR:filter}]} });

        const returnData = {
            titlePag: `Dirección`,
            notFoundMessage: `No hay direcciones`,
            labels: [`Descripción`,`Usuarios`,`Sub direcciones`,``],
            list: [] as any,
            countRender: ``,
            foundNext: false,
            urlNext: ``,
            foundPrevious: false,
            urlPrevious: ``,
            notifications: await noti.GetNowNotification({ id:user.id }),

            form: CreateAddressFrom,

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
        returnData.urlNext = `/address/?skip=${skip+10}&take=${take}`;

        // previus
        returnData.foundPrevious = take <= skip ? true : false; 
        returnData.urlPrevious = `/address/?skip=${skip-10}&take=${take}`;

        if(queryString) {
            returnData.urlNext += `&${queryString}`;
            returnData.urlPrevious += `&${queryString}`;
        }

        returnData.list = list;
        returnData.countRender = `${count - skip < 11 ? count : skip+take}/${count}`;

        return res.render(`s/address/list.hbs`, returnData);
    }

    public async RenderUnique(req:Request,res:Response) {
        const id = req.params.id as string;
        const noti = new NotificationModel();
        const instance = new AdressSubModel();
        const user = req.user as any;

        const data = instance.findAdress({ filter:{id} });

        const dataReturn = {
            data: {} as any,
            form: {} as any,
            notifications: await noti.GetNowNotification({ id:user.id }),
            delete: {
                id: id,
                url: `/address/${id}/delete`,
                name: `Eliminar especialidad`
            }
        }

        dataReturn.data = await data;
        dataReturn.form = UpdateDirecciónFrom(dataReturn.data.id);
        return res.render(`s/address/unique.hbs`, dataReturn);
    }

    public async CreateLogic(req:Request,res:Response) {
        try {
            const instance = new AdressSubModel();
            const { description, parentId } = req.body;
            const user = req.user as any;

            if(!description) {
                req.flash(`error`,`Debe completar los datos correctamente`);
                return res.redirect(`/address/`);
            }

            if (parentId) {
                const parentInstance = instance.findAdress({ filter:{id:parentId} });
                const createPromise = instance.createAdress({
                    data: { description,parentReference: {connect: { id:parentId }}}
                });

                const currentParent = await parentInstance;
                const create = await createPromise;

                await instance.CreateHistory({ des:`Creación de subdirección ${description} en ${currentParent?.description}`, name:`address`, userId:user.id });

                req.flash(`succ`, `Dirección creada`);
                return res.redirect(`/address/`);
            }

            const create = await instance.createAdress({
                data: {
                    description,
                }
            });        
            await instance.CreateHistory({ des:`Creación de dirección`, name:`address`, userId:user.id });


            req.flash(`succ`, `Dirección creada`);
            return res.redirect(`/address/`);
        } catch (error) {
            console.debug(error);
            req.flash(`Error`, `Error temporal`);
            return res.redirect(`/address/`);            
        }
    }

    public async EditLogic(req:Request,res:Response) {
        try {
            const instance = new AdressSubModel();
            const { description } = req.body;
            const id = req.params.id as string;
            const user = req.user as any;

            if(!description) {
                req.flash(`error`,`Debe completar los datos correctamente`);
                return res.redirect(`/address/`);
            }

            const update = await instance.updateAdress({
                data: {
                    description,
                },
                filter: { id }
            });     

            await instance.CreateHistory({ des:`Actualización de dirección/subdirección ${description}`, name:`address`, userId:user.id });

            req.flash(`succ`, `Dirección creada`);
            return res.redirect(`/address/`);
        } catch (error) {
            req.flash(`Error`, `Error temporal`);
            return res.redirect(`/address/`);            
        }
    }

    public async DeleteLogic(req:Request,res:Response) {
        try {
            const instance = new AdressSubModel();
            const id = req.params.id as string;
            const user = req.user as any;

            const currentDelete = await instance.deleteAdress({ id });        

            await instance.CreateHistory({ des:`Eliminación de dirección ${currentDelete.description}`, name:`address`, userId:user.id, id });

            req.flash(`succ`, `Eliminado exitosamente.`);
            return res.redirect(`/address/`);
        } catch (error) {
            req.flash(`Error`, `Error temporal`);
            return res.redirect(`/address/`);            
        }
    }

    public loadRoutes() {
        this.router.get(`/address/`, OnSession, this.RenderList);
        this.router.get(`/address/:id`, OnSession, this.RenderUnique);

        this.router.post(`/address/create`, OnSession, this.CreateLogic);
        this.router.post(`/address/:id/delete`, OnSession, this.DeleteLogic);
        this.router.post(`/address/:id/update`, OnSession, this.EditLogic);

        return this.router;
    } 
}
