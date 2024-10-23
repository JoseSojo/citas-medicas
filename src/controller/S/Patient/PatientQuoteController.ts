import { Request, Response } from "express";
import { OnDoctor, OnSession } from "../../../middlewares/auth";
import AbstractController from "../../AbstractController";
import NotificationModel from "../../../model/user/notification/NotificationModel";
import UserModel from "../../../model/user/UserModel";
import SpecialitySubModel from "../../../model/config/SpecialityModel";
import QuotesSubModel from "../../../model/quotes/QuotesModel";
import { Prisma } from "@prisma/client";

export default class PatientQuoteController extends AbstractController {

    constructor() {
        super();
    }

    public async PatientDoctorList(req: Request, res: Response) {
        const {espId,espName,param,addressId,addressName} = req.query;
        const noti = new NotificationModel();
        const user = req.user as any;
        const userModel = new UserModel();
        const speciality = new SpecialitySubModel();
        const instance = new QuotesSubModel();
        let queryString = ``;

        const skipUser = req.query.skipUser ? Number(req.query.skipUser) : 0;   
        const takeUser = req.query.takeUser ? Number(req.query.takeUser) : 10;

        const whereUser: Prisma.UserWhereInput[] = []
        whereUser.push({ role:`DOCTOR` });
        // whereUser.push({ schedule: { every:{ primary:true } } });
        whereUser.push({ isDelete:false });

        if(param) {
            queryString += queryString ? `&param=${param}` : `param=${param}`;
            // whereUser.push({ speciality:{ every:{ specialityReference:{ isDelete:false } } } });
            whereUser.push({ name:{contains:param} });
            whereUser.push({ lastname:{contains:param} });            
        }

        if(espId) {
            queryString += queryString ? `&espId=${espId}` : `espId=${espId}`;
            whereUser.push({ speciality:{ every:{ specialityReference:{ id:espId } } } });
        }
        
        if(espName) {
            queryString += queryString ? `&espName=${espName}` : `espName=${espName}`;
            whereUser.push({ speciality:{ some:{ specialityReference:{ description:{ contains:espName } } } } });
            whereUser.push({ speciality:{ some:{ specialityReference:{ description:{ contains:espName } } } } });
        }

        if(addressId) {
            queryString += queryString ? `&addressId=${addressId}` : `addressId=${addressId}`;
            whereUser.push({ addressReference: { id:addressId } });
        }
        
        if(addressName) {
            queryString += queryString ? `&addressName=${addressName}` : `addressName=${addressName}`;
            whereUser.push({ addressReference: { description:{contains:addressName} } });
        }

        const userListPromise = userModel.findManyUser({ filter:{AND:whereUser},skip:skipUser,take:takeUser });
        const userCountPromise = userModel.countUser({ filter:{AND:whereUser} });
        
        const userList = await userListPromise;
        const userCount = await userCountPromise;

        // next
        const foundNext = userCount - skipUser > 10 ? true : false;
        const urlNext = `/patient/doctor/?skipUser=${skipUser+10}&takeUser=${takeUser}`;

        // previus
        const foundPrevious = takeUser <= skipUser ? true : false; 
        const urlPrevious = `/patient/doctor/?skipUser=${skipUser-10}&takeUser=${takeUser}`;

        const dataReturn = {
            titlePag: `Doctores`,
            notFoundMessage: `No hay doctor`,
            labels: [`Nombre y Apellido`,`Especialidades`,`Dirección`,``],
            notifications: await noti.GetNowNotification({ id:user.id }),
            urlNext,
            foundNext,
            urlPrevious,
            foundPrevious,
            list: userList,
            countRender: ``,

            filter: {
                param,
                espName,
                espId,
                addressId,
                addressName
            }
        }
        
        if(queryString) {
            dataReturn.urlNext += `&${queryString}`;
            dataReturn.urlPrevious += `&${queryString}`;
        }

        // dataReturn.address = addressList;
        // dataReturn.speciality = specialityList;
        dataReturn.countRender = `${userCount - skipUser < 11 ? userCount : skipUser+takeUser}/${userCount}`;

        return res.render(`s/patient/doctor.hbs`, dataReturn);
    }

    public async RenderCreateQuote(req: Request, res: Response) {
        const { doctorId } = req.query;
        const noti = new NotificationModel();
        const user = req.user as any;
        const userInstance = new UserModel();


        const dataReturn = {
            doctor: doctorId ? await userInstance.findUser({ filter:{AND:[{id:doctorId},{role:`DOCTOR`},{isDelete:false}]} }) : null,
            notifications: await noti.GetNowNotification({ id:user.id }),
        }

        return res.render(`s/patient/quote/create.hbs`, dataReturn);
    }

    public async RenderListQuote(req: Request, res: Response) {
        const instance = new QuotesSubModel();
        const user = req.user as any;
        const noti = new NotificationModel();

        const {param,status,patient,doctor} = req.query;
        let queryString = ``;

        const take = req.query.take ? Number(req.query.take) : 10;
        const skip = req.query.skip ? Number(req.query.skip) : 0;

        const filter: Prisma.QuotesWhereInput[] = [];
        if(user.role != `ADMIN`)filter.push({ OR:[{ patientId:user.id },{ doctorId:user.id }]});

        if(status) {
            queryString += `status=${status}`;
            filter.push({ status });
        }

        if(patient) {
            queryString += `patient=${patient}`;
            filter.push({ patientId:patient });
        }

        if(doctor) {
            queryString += `doctor=${doctor}`;
            filter.push({ doctorId:doctor });
        }

        const listPromise = instance.findManyQuotes({
            filter: {AND:[{isDelete:false},{AND:filter}]},
            skip,
            take,
        });
        const countPromise = instance.countQuotes({ filter:{AND:[{isDelete:false},{AND:filter}]} });

        const returnData = {
            titlePag: `Citas`,
            notFoundMessage: `No hay citas`,
            labels: [`Mensaje`,`Doctor`,`Paciente`,`Estado`,``],
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
                patient,
                doctor
            }
        }

        const list = await listPromise;
        const count = await countPromise;        

        // next
        returnData.foundNext = count - skip > 10 ? true : false;
        returnData.urlNext = `/quote/?skip=${skip+10}&take=${take}`;

        // previus
        returnData.foundPrevious = take <= skip ? true : false; 
        returnData.urlPrevious = `/quote/?skip=${skip-10}&take=${take}`;

        if(queryString) {
            returnData.urlNext += `&${queryString}`;
            returnData.urlPrevious += `&${queryString}`;
        }

        returnData.list = list;
        returnData.countRender = `${count - skip < 11 ? count : skip+take}/${count}`;

        return res.render(`s/quote/list.hbs`, returnData);
    }

    public async RenderUnique(req: Request, res: Response) {
        const id = req.params.id;
        const noti = new NotificationModel();
        const user = req.user as any;
        const instance = new QuotesSubModel();

        const dataReturn = {
            notifications: await noti.GetNowNotification({ id:user.id }),
            data: await instance.findQuotes({ filter:{ AND:[{id},{isDelete:false}] } }),
        }

        return res.render(`s/quote/unique.hbs`, dataReturn);
    }

    public async CreateLogic(req: Request, res: Response) {
        try {
            const {message,doctorId} = req.body;
            const user = req.user as any;
            const instance = new QuotesSubModel();

            const create = await instance.createQuotes({ data:{
                doctorReference: { connect: { id:doctorId } },
                patientReference: { connect: { id:user.id } },
                quoteDetailReference: {
                    create: {}
                },
                message,                
            } });

            await instance.PushStatictics({ objectId:``,objectName:`CITAS` });
            await instance.CreateHistory({ des:`Creación de cita por el paciente ${user.name} ${user.lastname} para el doctor ${create.doctorReference.name} ${create.doctorReference.lastname}`,name:`patient.quote`,userId:user.id });

            req.flash(`succ`, `Cita agendada, esperando aprobación`);
            return res.redirect(`/quote/${create.id}`);   
        } catch (error) {
            req.flash(`err`, `Error temporal`)
            return res.redirect(`/patient/`);   
        }     
    }

    public loadRoutes () {
        this.router.get(`/patient/doctor`, OnSession, this.PatientDoctorList);
        this.router.get(`/patient/quote/create`, OnSession, this.RenderCreateQuote);
        this.router.get(`/quote`, OnSession, this.RenderListQuote);
        this.router.get(`/quote/:id`, OnSession, this.RenderUnique);

        this.router.post(`/quote/create`, OnSession, this.CreateLogic);


        return this.router;
    }
} 
