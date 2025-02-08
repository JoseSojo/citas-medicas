import { Request, Response } from "express";
import { OnDoctor, OnSession } from "../../../middlewares/auth";
import AbstractController from "../../AbstractController";
import NotificationModel from "../../../model/user/notification/NotificationModel";
import UserModel from "../../../model/user/UserModel";
import QuotesModel from "../../../model/quotes/QuotesModel";
import SpecialityModel from "../../../model/config/SpecialityModel";
import { Prisma } from "@prisma/client";
import QuotesSubModel from "../../../model/quotes/QuotesModel";
import ScheduleSubModel from "../../../model/schedule/ScheduleModel";

export default class PatientControlelr extends AbstractController {

    constructor() {
        super();
    }

    public async DoctorDashboard(req: Request, res: Response) {
        const noti = new NotificationModel();
        const user = req.user as any;
        const userModel = new UserModel();
        const quoteModel = new QuotesSubModel();
        const scheduleModel = new ScheduleSubModel();

        const quoteCountPromise = quoteModel.countQuotes({ filter:{AND:[{isDelete:false},{patientId:user.id}]} }); // citas totales
        const scheduleCountPromise = userModel.findUser({ filter:{id:user.id} });

        const quoteProcesadoCountPromise = quoteModel.countQuotes({ filter:{AND:[{ isDelete:false },{ status:`REGISTRADO` }, { patientId:user.id }]} });
        const quoteAprobadoCountPromise = quoteModel.countQuotes({ filter:{AND:[{ isDelete:false },{ status:`APROBADO` }, { patientId:user.id }]} });
        const quoteCanceladoCountPromise = quoteModel.countQuotes({ filter:{AND:[{ isDelete:false },{ status:`CANCELADO` }, { patientId:user.id }]} });
        const quoteFinalizadoCountPromise = quoteModel.countQuotes({ filter:{AND:[{ isDelete:false },{ status:`FINALIZADO` }, { patientId:user.id }]} });

        const dataReturn = {
            notifications: await noti.GetNowNotification({ id:user.id }),
            year: await userModel.getYears(),
            cards: [
                {
                    title: `Citas`,
                    link: `/quote/`,
                    color: `border-left-primary`,
                    ico: `bi-person-fill`,
                    count: await quoteCountPromise
                },
            ],
            itemQoute: [
                {
                    title: `Registrado`,
                    link: `/quote/?status=REGISTRADO`,
                    count: await quoteProcesadoCountPromise
                },
                {
                    title: `Aprobado`,
                    link: `/quote/?status=APROBADO`,
                    count: await quoteAprobadoCountPromise
                },
                {
                    title: `Cancelado`,
                    link: `/quote/?status=CANCELADO`,
                    count: await quoteCanceladoCountPromise
                },
                {
                    title: `Finalizado`,
                    link: `/quote/?status=FINALIZADO`,
                    count: await quoteFinalizadoCountPromise
                },
            ]
        }

        return res.render(`s/patient/dashboard.hbs`, dataReturn);
    }

    public loadRoutes () {
        this.router.get(`/patient`, OnSession, this.DoctorDashboard);

        return this.router;
    }

} 
