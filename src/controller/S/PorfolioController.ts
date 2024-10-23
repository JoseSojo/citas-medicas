import AbstractController from "../AbstractController";
import UserModel from "../../model/user/UserModel";
import { Request, Response } from "express";
import { OnDoctor, OnSession } from "../../middlewares/auth";
import { Prisma } from "@prisma/client";
import { CreateUserFrom, UpdateUserFrom } from "../../form/CreateUserForm";
import AdressSubModel from "../../model/config/AddressSubModel";
import SpecialityModel from "../../model/config/SpecialityModel";
import { CreateUser, UpdateUser } from "../../validation/UserCreate";
import NotificationModel from "../../model/user/notification/NotificationModel";
import UserDetailSubModel from "../../model/user/UserDetailModel";
import SocialMediaByUserModel from "../../model/config/SocialMediaByUserModel";
import SocialMediaSubModel from "../../model/config/SocialMediaModel";
import upload from "../../config/multer/multer";


export default class PorfolioController extends AbstractController {

    constructor() {
        super();
    }

    public async PorfolioRender(req: Request, res: Response) {
        const instance = new UserDetailSubModel();
        const userInstance = new UserModel(); 
        const social = new SocialMediaSubModel();
        const {id} = req.query as {id?:string};
        const user = req.user as any;
        const noti = new NotificationModel();
        const idFind = user.role === `DOCTOR` ? user.id : id;

        const porfolio = userInstance.findUser({ filter:{ id:idFind } });
        const socialMedia = social.findManySocialMedia({ filter:{isDelete:false},skip:0,take:10 }); 

        const dataReturn = {
            notifications: await noti.GetNowNotification({ id:user.id }),
            porfolio: await porfolio,
            social: await socialMedia
        }

        return res.render(`s/porfolio/unique.hbs`, dataReturn);        
    }

    public async uplodPhoto(req: Request, res: Response) {
        const instance = new UserDetailSubModel();
        const userModel = new UserModel();
        const user = req.user as any;
        const file = req.file;
        const { detailId } = req.body;

        const detailFound = await instance.findUserDetail({ filter:{ userId: user.id } });

        if (detailFound) {
            await instance.updateUserDetail({
                filter: { id:detailId },
                data: {
                    photoReference: { create:{
                        ext: file ? file.mimetype : ``,
                        original: file ? file.originalname : ``,
                        path: file ? file.path : ``,
                        use: `Foto profesional`,
                    } }
                }
            });
            await instance.CreateHistory({ des:`Agregación de foto profesional por: ${user.name} ${user.lastname}`, name:`user`, userId:user.id })
        }
        else {
            await instance.createUserDetail({
                data: {
                    photoReference: { create:{
                        ext: file ? file.mimetype : ``,
                        original: file ? file.originalname : ``,
                        path: file ? file.path : ``,
                        use: `Foto profesional`,
                    } },
                    userReference: { connect:{id:user.id} }
                }
            });
        }

        return res.redirect(`/porfolio`);
    }

    public async AddSocialMedia(req: Request, res: Response) {
        const instance = new UserDetailSubModel();
        const userInstance = new UserModel();
        const userSocialMedia = new SocialMediaByUserModel();
        const socialMediaModel = new SocialMediaSubModel();
        const user = req.user as any;
        const { link,username,socialMediaId } = req.body;

        const socialMedia = await socialMediaModel.findSocialMedia({ filter:{ id:socialMediaId } });
        const socialUserFound = await userSocialMedia.findTest({ socialId:socialMediaId,userId:user.id });

        if(socialUserFound) {
            await userSocialMedia.updateTest({ data:{ link,username }, id:socialUserFound.id });
        } else {
            await userInstance.updateUser({
                data: {
                    socialMediaReference: { 
                        connectOrCreate: {
                            create: { link,username,socialMediaReference:{ connect:{id:socialMediaId} } },
                            where: { id:socialMediaId }
                        }
                    }
                },
                id: user.id
            });
        }

        await instance.CreateHistory({ des:`Agregación de foto red social ${socialMedia?.name} por: ${user.name} ${user.lastname}`, name:`user`, userId:user.id })

        req.flash(`succ`, `Operación exitosa`);
        return res.redirect(`/porfolio`);
    }

    public async Description(req: Request, res: Response) {
        const instance = new UserDetailSubModel();
        const {description} = req.body;
        const user = req.user as any;

        const detailFound = await instance.findUserDetail({ filter:{ userId: user.id } });

        if (detailFound) {
            await instance.updateUserDetail({
                data: {
                    userReference: { connect:{ id:user.id } },
                    description: description ? description : undefined 
                },
                filter: { id:detailFound.id }
            });
            await instance.CreateHistory({ des:`Creación de descripción profesional por: ${user.name} ${user.lastname}`, name:`user`, userId:user.id })

        } else {
            await instance.createUserDetail({
                data: {
                    description: description ? description : undefined,
                    userReference: { connect:{id:user.id} }
                }
            });
            await instance.CreateHistory({ des:`Agregación de descripción profesional por: ${user.name} ${user.lastname}`, name:`user`, userId:user.id })

        }


        req.flash(`succ`, `Descripción agregada`);
        return res.redirect(`/porfolio`);
    }

    public loadRoutes () {
        this.router.get(`/porfolio/`, OnSession, this.PorfolioRender);

        this.router.post(`/porfolio/social`, OnSession, OnDoctor, this.AddSocialMedia);
        this.router.post(`/porfolio/photo`, OnSession, OnDoctor, upload.single('file'), this.uplodPhoto);
        this.router.post(`/porfolio/description`, OnSession, OnDoctor, this.Description);

        return this.router;
    }
}
