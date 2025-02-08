import { Request, Response } from "express";
import { OnDoctor, OnSession } from "../../../middlewares/auth";
import AbstractController from "../../AbstractController";
import NotificationModel from "../../../model/user/notification/NotificationModel";
import QuotesSubModel from "../../../model/quotes/QuotesModel";
import { Prisma } from "@prisma/client";

export default class DoctorPatientControlelr extends AbstractController {

    constructor() {
        super();
    }

    public async DoctorPatient(req: Request, res: Response) {
        const instance = new QuotesSubModel();
        const user = req.user as any;
        const noti = new NotificationModel();

        const {param,role} = req.query;
        let queryString = ``;
        // rol
        // param (email,name,lastname,ci,cmeg,matricula,address)

        const take = req.query.take ? Number(req.query.take) : 10;
        const skip = req.query.skip ? Number(req.query.skip) : 0;

        const filter: Prisma.QuotesWhereInput[] = [];
        // filter.push({ isDelete:false });
        filter.push({ patientId: user.id });
        filter.push({ doctorId: user.id });

        if(param) {
            filter.push({ patientReference:{ name:{contains:param} } });
            filter.push({ patientReference:{ lastname:{contains:param} } });
            queryString += `param=${param}`;
        }

        const listPromise = instance.findManyQuotes({
            filter: {AND:[{isDelete:false},{OR:filter}]},
            skip,
            take,
        });

        const countPromise = instance.countQuotes({ filter:{AND:[{isDelete:false},{OR:filter}]} });

        const returnData = {
            titlePag: `Pacientes atendidos`,
            notFoundMessage: `No hay pacientes`,
            labels: [`Nombre`,`Estado cita`,``],
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
        returnData.urlNext = `/doctor/patient/?skip=${skip+10}&take=${take}`;

        // previus
        returnData.foundPrevious = take <= skip ? true : false; 
        returnData.urlPrevious = `/doctor/patient/?skip=${skip-10}&take=${take}`;

        if(queryString) {
            returnData.urlNext += `&${queryString}`;
            returnData.urlPrevious += `&${queryString}`;
        }

        returnData.list = list;
        returnData.countRender = `${count - skip < 11 ? count : skip+take}/${count}`;

        return res.render(`s/doctor/patient/list.hbs`, returnData);
    }


    public loadRoutes () {
        this.router.get(`/doctor/patient`, OnSession, OnDoctor, this.DoctorPatient);

        return this.router;
    }

} 
