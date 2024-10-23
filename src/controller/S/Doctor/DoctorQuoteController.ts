import { Request, Response } from "express";
import { OnDoctor, OnSession } from "../../../middlewares/auth";
import AbstractController from "../../AbstractController";
import NotificationModel from "../../../model/user/notification/NotificationModel";
import QuotesSubModel from "../../../model/quotes/QuotesModel";
import QuotesDetailSubModel from "../../../model/quotes/QuotesDetailModel";

export default class DoctorQuoteControlelr extends AbstractController {

    constructor() {
        super();
    }


    public async DoctorQuote(req: Request, res: Response) {
        const noti = new NotificationModel();
        const user = req.user as any;

        const dataReturn = {
            notifications: await noti.GetNowNotification({ id:user.id })
        }

        return res.render(`s/doctor/quote/list.hbs`, dataReturn);
    }

    public async ChangeStatus(req: Request, res: Response) {
        try {
            const instance = new QuotesSubModel();
            const detail = new QuotesDetailSubModel();
            const {status} = req.body;
            const user = req.user as any;
            const id = req.params.id;

            if(status == `FINALIZADO`) {
                if(user.role === `DOCTOR`) {
                    const {starDoctor,descriptionDoctor,currentDetail} = req.body;
                    const detailPromise = detail.updateQuotesDetail({ data:{ descriptionDoctor,starDoctor:starDoctor ? Number(starDoctor) : 1 }, filter:{ id:currentDetail } })
                    const instancePromise = instance.updateQuotes({ data:{ status }, filter:{ id } });
                    await instance.CreateHistory({ des:`Doctor califica a paciente`, name:`user`, userId:user.id });
                    await instance.PushStatictics({ objectId:user.id,objectName:`DOCTOR` });
                    await detailPromise;
                    await instancePromise;
                   
                }
                if(user.role === `PACIENTE`) {
                    const {starPatient,descriptionPatient,currentDetail} = req.body;
                    const detailPromise = detail.updateQuotesDetail({ data:{ descriptionPatient,starPatient:starPatient ? Number(starPatient) : 1 }, filter:{ id:currentDetail } })
                    const staticticPromise = instance.PushStatictics({ objectId:user.id,objectName:`PACIENTE` });
                    await instance.CreateHistory({ des:`Paciente califica a doctor`, name:`user`, userId:user.id });
                    await detailPromise;
                    await staticticPromise;
                }
            } else {
                if(user.role === `DOCTOR`) {
                    const instancePromise = instance.updateQuotes({ data:{ status }, filter:{ id } });
                    await instance.CreateHistory({ des:`Cambio de estado de cita`, name:`user`, userId:user.id });
                    await instancePromise;

                }
            }
        
            req.flash(`Cita ${status}`);
            return res.redirect(`/quote/${id}`);
        } catch (error) {
            req.flash(`err`, `Error temporal`);
            return res.redirect(`/doctor`);
        }
    }

    public loadRoutes () {
        this.router.get(`/doctor/quote`, OnSession, OnDoctor, this.DoctorQuote);
        this.router.post(`/doctor/quote/status/:id`, OnSession, this.ChangeStatus);

        return this.router;
    }

} 
