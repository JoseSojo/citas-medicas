import AbstractController from "../AbstractController";
import UserModel from "../../model/user/UserModel";
import { Request, Response } from "express";
import { OnAdmin, OnAdminORDoctor, OnSession } from "../../middlewares/auth";
import { Prisma } from "@prisma/client";
import { CreateUserFrom, UpdateUserFrom } from "../../form/CreateUserForm";
import AdressSubModel from "../../model/config/AddressSubModel";
import SpecialityModel from "../../model/config/SpecialityModel";
import { CreateUser, UpdateUser } from "../../validation/UserCreate";
import NotificationModel from "../../model/user/notification/NotificationModel";
import UniversityModel from "../../model/config/UniversityModel";


export default class UserController extends AbstractController {

    constructor() {
        super();
    }

    public async RenderList(req:Request,res:Response) {
        const instance = new UserModel();
        const address = new AdressSubModel();
        const speciality = new SpecialityModel();
        const user = req.user as any;
        const noti = new NotificationModel();
        const univ = new UniversityModel();

        const {param,role,addressId} = req.query;
        let queryString = ``;
        // rol
        // param (email,name,lastname,ci,cmeg,matricula,address)

        const take = req.query.take ? Number(req.query.take) : 10;
        const skip = req.query.skip ? Number(req.query.skip) : 0;

        const filter: Prisma.UserWhereInput[] = [];
        // filter.push({ isDelete:false });

        if(param) {
            queryString += `param=${param}`;
            filter.push({ name: { contains:param } });
            filter.push({ email: { contains:param } });
            filter.push({ lastname: { contains:param } });
            filter.push({ ci: { contains:param } });
            filter.push({ cmeg_n: { contains:param } });
            filter.push({ matricula: { contains:param } });
        }

        if(role) {
            queryString += queryString ? `&role=${role}` : `role=${role}`;
            // if(filter.length > 0) {
            //     return;
            // }
            filter.push({ role: role });
        }

        if(addressId) {
            filter.push({ addressId });
            queryString += queryString ? `&addressId=${addressId}` : `addressId=${addressId}`;
        }

        const listPromise = instance.findManyUser({
            filter: {AND:[{isDelete:false},{OR:filter}]},
            skip,
            take,
        });
        const countPromise = instance.countUser({ filter:{AND:[{isDelete:false},{OR:filter}]} });

        const addressListPromise = address.findManyAdress({ filter:{AND:[{isDelete:false},{children:undefined}]},skip:0,take:200 });
        const specialityListPromise = speciality.findManySpeciality({ filter:{isDelete:false},skip:0,take:200 });
        const universityListPromise = univ.findManyUniversity({ filter:{isDelete:false},skip:0,take:200 });

        const returnData = {
            titlePag: `Usuarios`,
            notFoundMessage: `No hay usuarios`,
            labels: [`Nombre`,`Cédula`,`Correo`,`Rol`,``],
            list: [] as any,
            countRender: ``,
            foundNext: false,
            urlNext: ``,
            foundPrevious: false,
            urlPrevious: ``,
            roleList: super.getRoles(),
            address: [] as any,
            speciality: [] as any,
            university: [] as any,
            notifications: await noti.GetNowNotification({ id:user.id }),

            form: CreateUserFrom,

            filter: {
                skip,
                take,
                param,
                role,
                addressId
            }
        }

        const specialityList = await specialityListPromise;
        const addressList = await addressListPromise;
        const list = await listPromise;
        const count = await countPromise;       
        const listUniversity = await universityListPromise; 

        // next
        returnData.foundNext = count - skip > 10 ? true : false;
        returnData.urlNext = `/user/?skip=${skip+10}&take=${take}`;

        // previus
        returnData.foundPrevious = take <= skip ? true : false; 
        returnData.urlPrevious = `/user/?skip=${skip-10}&take=${take}`;

        if(queryString) {
            returnData.urlNext += `&${queryString}`;
            returnData.urlPrevious += `&${queryString}`;
        }

        returnData.address = addressList;
        returnData.speciality = specialityList;
        returnData.list = list;
        returnData.university = listUniversity;
        returnData.countRender = `${count - skip < 11 ? count : skip+take}/${count}`;

        return res.render(`s/user/list.hbs`, returnData);
    }

    public async RenderUnique(req:Request,res:Response) {
        const id = req.params.id;
        const instance = new UserModel();
        const speciality = new SpecialityModel();
        const univ = new UniversityModel();
        const noti = new NotificationModel();
        const user = req.user as any;

        const data = instance.findUser({ filter:{id} });
        const specialityListPromise = speciality.findManySpeciality({ filter:{isDelete:false},skip:0,take:200 });
        const universityListPromise = univ.findManyUniversity({ filter:{isDelete:false},skip:0,take:200 });

        const dataReturn = {
            data: [] as any,
            form: {} as any,
            year: await instance.getYears(),
            speciality: [] as any,
            university: [] as any,
            notifications: await noti.GetNowNotification({ id:user.id }),
            delete: {
                id: id,
                url: `/user/${id}/delete`,
                name: `Eliminar usuario`
            }
        }

        dataReturn.data = await data;
        dataReturn.form = UpdateUserFrom(dataReturn.data.id);
        dataReturn.speciality = await specialityListPromise;
        dataReturn.university = await universityListPromise;
        return res.render(`s/user/unique.hbs`, dataReturn);
    }

    public async CreateLogic(req:Request,res:Response) {
        // try {
            const instance = new UserModel();
            const addressInstance = new AdressSubModel();
            const speciality = new SpecialityModel();

            const { universityId,egresDate,rif,exacAddress,birthdate,name, ci, email, lastname, role, addressId,cmeg_n,matricula, phoneCode, phoneNumber, esp1, esp2 } = req.body;
            const user = req.user as any;
            let parentId;

            if(user) parentId = user.id;

            if(!name) {
                req.flash(`error`,`Debe completar los datos correctamente`);
                return res.redirect(`/user/`);
            } 

            let data: Prisma.UserCreateInput = { 
                ci,
                cmeg_n: cmeg_n ? cmeg_n : ``,
                matricula: matricula ? matricula : ``,
                email,
                password:ci,
                name,
                lastname,
                role,
                phoneCode: phoneCode ? phoneCode : ``, 
                phoneNumber: phoneNumber ? phoneNumber : ``,
                birthdate,
                exacAddress,
                rif,
                egresDate: egresDate
            }

            if(universityId) data = {...data, egresUniversityReference:{ connect:{id:universityId} }}
            if(!addressId.includes(`opción`)) {
                data = {
                    ...data,
                    addressReference: {
                        connect: {id:addressId}
                    }
                }
            }

            if (parentId) {
                data = {
                    ...data,
                    parentReference: {connect: { id:parentId }}
                }
            }


            await instance.createUser({data}); 
            
            await instance.CreateHistory({ 
                des:`Creación de Usuario [${role}] Nombre:${name} Apellido:${lastname} Teléfono:${phoneCode} ${phoneNumber} Rif:${rif ? rif : `sin definir`}`, 
                name:`user`,
                userId:user.id
            });

            req.flash(`succ`, `Usuario creado`);
            return res.redirect(`/user/`);
        // } catch (error) {
            req.flash(`Error`, `Error temporal`);
            return res.redirect(`/user/`);            
        // }
    }

    public async EditLogic(req:Request,res:Response) {
        try {
            const instance = new UserModel();
            const user = req.user as any;

            const { rif,ci,name,lastname,phoneCode,phoneNumber,cmeg_n,matricula,email } = req.body;
            const id = req.params.id as string;

            let dataUpdate: Prisma.UserUpdateInput = {};

            let descr = ``;

            if(ci) {
                dataUpdate = {...dataUpdate, ci};
                descr += ` Cédula:${ci}`; 
            }
            if(email) {
                dataUpdate = {...dataUpdate, email};
                descr += ` Correo:${email}`; 
            }
            if(name) {
                dataUpdate = {...dataUpdate, name};
                descr += ` Nombre:${name}`; 
            }
            if(lastname) {
                dataUpdate = {...dataUpdate, lastname};
                descr += ` Apellido:${lastname}`; 
            }
            if(phoneCode) {
                dataUpdate = {...dataUpdate, phoneCode};
                descr += ` Teléfono Código:${phoneCode}`; 
            }
            if(phoneNumber) {
                dataUpdate = {...dataUpdate, phoneNumber};
                descr += ` Teléfono Número:${phoneNumber}`; 
            }
            if(email) {
                dataUpdate = {...dataUpdate, email};
                descr += ` Correo:${email}`; 
            }
            if(cmeg_n) {
                dataUpdate = {...dataUpdate, cmeg_n};
                descr += ` CMEG:${cmeg_n}`; 
            }
            if(matricula) {
                dataUpdate = {...dataUpdate, matricula};
                descr += ` Matricula:${matricula}`; 
            }
            if(rif) {
                dataUpdate = {...dataUpdate, rif};
                descr += ` Rif:${rif}`; 
            }

            await instance.updateUser({
                data: dataUpdate,
                id
            });   
            
            await instance.CreateHistory({ 
                des:descr, 
                name:`user`,
                userId:user.id
            });

            // req.flash(`succ`, `Usuario actualizado`);
            return res.redirect(`/profile`);
        } catch (error) {
            req.flash(`Error`, `Error temporal`);
            return res.redirect(`/user/`);            
        }
    }

    public async DeleteLogic(req:Request,res:Response) {
        try {
            const instance = new UserModel();
            const user = req.user as any;
            const id = req.params.id as string;

            await instance.deleteUser({ id });        

            await instance.CreateHistory({ des:`Eliminación de usuario`, name:`user`,userId:user.id, id });
            req.flash(`succ`, `Eliminado exitosamente.`);
            return res.redirect(`/user/`);
        } catch (error) {
            req.flash(`Error`, `Error temporal`);
            return res.redirect(`/user/`);            
        }
    }

    public async UpdatePasswordLogic(req:Request,res:Response) {
        try {
            const instance = new UserModel();
            const user = req.user as any;

            const { password, passwordNew, passwordRepeat,currentPassword } = req.body;
            const id = req.params.id as string;

            if(passwordNew !== passwordRepeat) {
                req.flash(`err`, `Las contraseñas no coinciden`);
                return res.redirect(`/profile`);
            }

            const compare = await instance.ComparePassword({ dbPassword:currentPassword, password });
            if(!compare) {
                req.flash(`err`, `Las contraseñas no coinciden`);
                return res.redirect(`/profile`);
            }

            await instance.updateUser({
                data: {
                    password: await instance.HashPassword({password:passwordNew}),
                },
                id
            }); 

            await instance.CreateHistory({ des:`Actualización de contraseña`, name:`user`,userId:user.id });

            req.flash(`succ`, `Usuario actualizado`);
            return res.redirect(`/profile`);
        } catch (error) {
            req.flash(`Error`, `Error temporal`);
            return res.redirect(`/profile/`);            
        }
    }

    public loadRoutes () {
        this.router.get(`/user/`, OnSession, OnAdminORDoctor, this.RenderList);
        this.router.post(`/user/create/`, OnSession, this.CreateLogic);
        
        this.router.get(`/user/:id`, OnSession, OnAdminORDoctor, this.RenderUnique);

        this.router.post(`/user/:id/update`, OnSession, UpdateUser, this.EditLogic);
        this.router.post(`/user/:id/password`, OnSession, this.UpdatePasswordLogic);
        this.router.post(`/user/:id/delete`, OnSession, OnAdmin, this.DeleteLogic);

        return this.router;
    }
}
