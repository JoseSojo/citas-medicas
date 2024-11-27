import { Request, Response } from "express";
import AbstractController from "../AbstractController"
import { OnSession } from "../../middlewares/auth";
import NotificationModel from "../../model/user/notification/NotificationModel";
import UserModel from "../../model/user/UserModel";
import QuotesSubModel from "../../model/quotes/QuotesModel";
import { title } from "process";

export default class DashboardController extends AbstractController {

    constructor(
        private prefix = ``
    ) {
        super();
    }

    public async RenderDashboard(req:Request,res:Response) {
        const user = req.user as any;

        if(user.role === "DOCTOR") return res.redirect(`/doctor`);
        if(user.role === "PACIENTE") return res.redirect(`/patient`);

        const noti = new NotificationModel();
        const userModel = new UserModel();
        const quoteModel = new QuotesSubModel();

        const patientCountPromise = userModel.countUser({ filter:{ AND:[{role:`PACIENTE`},{isDelete:false}] } });
        const doctorCountPromise = userModel.countUser({ filter:{ AND:[{role:`DOCTOR`},{isDelete:false}] } });
        const adminCountPromise = userModel.countUser({ filter:{ AND:[{role:`ADMIN`},{isDelete:false}] } });
        const quoteCountPromise = quoteModel.countQuotes({ filter:{ isDelete:false } });

        const quoteProcesadoCountPromise = quoteModel.countQuotes({ filter:{AND:[{ isDelete:false },{ status:`PROCESADO` }]} });
        const quoteAprobadoCountPromise = quoteModel.countQuotes({ filter:{AND:[{ isDelete:false },{ status:`Aprobado` }]} });
        const quoteCanceladoCountPromise = quoteModel.countQuotes({ filter:{AND:[{ isDelete:false },{ status:`CANCELADO` }]} });
        const quoteFinalizadoCountPromise = quoteModel.countQuotes({ filter:{AND:[{ isDelete:false },{ status:`FINALIZADO` }]} });

        const dataReturn = {
            notifications: await noti.GetNowNotification({ id:user.id }),
            year: await userModel.getYears(),
            cards: [
                {
                    title: `Pacientes`,
                    link: `/user/?role=PACIENTE`,
                    color: `border-left-primary`,
                    ico: `bi-person-fill`,
                    count: await patientCountPromise
                },
                {
                    title: `Doctores`,
                    link: `/user/?role=DOCTOR`,
                    color: `border-left-primary`,
                    ico: `bi-person-circle`,
                    count: await doctorCountPromise
                },
                {
                    title: `Administradores`,
                    link: `/user/?role=ADMIN`,
                    color: `border-left-primary`,
                    ico: `bi-person-workspace`,
                    count: await adminCountPromise
                },
                {
                    title: `Citas`,
                    link: `/quote/`,
                    color: `border-left-info`,
                    ico: `bi-calendar-check-fill`,
                    count: await quoteCountPromise
                },
            ],

            itemQoute: [
                {
                    title: `Procesado`,
                    link: `/quote/?status=PROCESADO`,
                    count: await quoteProcesadoCountPromise
                },
                {
                    title: `Aprobado`,
                    link: `/quote/?status=Aprobado`,
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

        return res.render(`s/dashboard.hbs`, dataReturn);
    }


    public loadRoutes() {
        this.router.get(`${this.prefix}/dashboard`, OnSession, this.RenderDashboard);

        return this.router;
    } 
}
