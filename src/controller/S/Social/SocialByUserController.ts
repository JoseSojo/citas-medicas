import { Request, Response } from "express";
import AbstractController from "../../AbstractController"
import { OnSession } from "../../../middlewares/auth";
import SocialMediaByUserModel from "../../../model/config/SocialMediaByUserModel";

export default class AdressController extends AbstractController {

    constructor(
        private prefix = `social/`,
        private instance = new SocialMediaByUserModel()
    ) {
        super();
    }

    public async CreateLogic(req:Request,res:Response) {
        try {
            const { link, username, socialId } = req.body;
            const user = req.user as any;

            const create = await this.instance.createOrUpdate({
                data: {
                    link,
                    username,
                    socialId,
                    userId: user.id
                }
            });        

            req.flash(`succ`, `Registro exitoso`);
            return res.redirect(`${this.prefix}/`);
        } catch (error) {
            req.flash(`Error`, `Error temporal`);
            return res.redirect(`${this.prefix}/`);            
        }
    }

    public async DeleteLogic(req:Request,res:Response) {
        try {
            const id = req.params.id as string;

            const currentDelete = await this.instance.deleteSocial({ id });        

            req.flash(`succ`, `Eliminado exitosamente.`);
            return res.redirect(`${this.prefix}/`);
        } catch (error) {
            req.flash(`Error`, `Error temporal`);
            return res.redirect(`${this.prefix}/`);            
        }
    }

    public loadRoutes() {
        this.router.post(`${this.prefix}/create`, OnSession, this.CreateLogic);
        this.router.post(`${this.prefix}/:id/delete`, OnSession, this.DeleteLogic);

        return this.router;
    } 
}
