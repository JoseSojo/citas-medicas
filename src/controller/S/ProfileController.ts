import { Request, Response, Router } from "express";
import AbstractController from "../AbstractController"
import { OnSession } from "../../middlewares/auth";
import NotificationModel from "../../model/user/notification/NotificationModel";

export default class ProfileController extends AbstractController {

    constructor(
        private prefix = `/profile`
    ) {
        super();
    }

    public async RenderProfile(req:Request,res:Response) {
        const user = req.user as any;
        const noti = new NotificationModel();

        const dataReturn = {
            notifications: await noti.GetNowNotification({ id:user.id })
        }

        return res.render(`s/profile.hbs`, dataReturn);
    }

    public loadRoutes() {
        this.router.get(`${this.prefix}/`, OnSession, this.RenderProfile);

        return this.router;
    } 
}
