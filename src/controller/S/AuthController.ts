import passport from "passport";
import AbstractController from "../AbstractController"
import { NextFunction, Request, Response } from "express";
import { OffSession, OnSession } from "../../middlewares/auth";
import UserModel from "../../model/user/UserModel";
import AdressSubModel from "../../model/config/AddressSubModel";
import { Prisma } from "@prisma/client";
import { caclAge } from "../../util";

export default class AuthController extends AbstractController {

    constructor(
        private prefix = ``
    ) {
        super();
    }

    public async LoginController(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("local.login", {
            successRedirect: "/dashboard",
            failureRedirect: "/login",
            failureFlash: true
        })(req, res, next);
    }

    public async RegisterPatient(req: Request, res: Response) {
        try {
            const instance = new UserModel();

            const { addressId,exacAddress,birthdate,name,ci,email,lastname,phoneCode,phoneNumber,password } = req.body as { addressId:string,password:string,exacAddress:string,birthdate:string,name:string,ci:string,email:string,lastname:string,phoneCode:string,phoneNumber:string};
            const user = req.user as any;
            let parentId;
            const age = caclAge(birthdate);

            if(user) parentId = user.id;

            if(!name) {
                req.flash(`error`,`Debe completar los datos correctamente`);
                return res.redirect(`/register/`);
            } 

            let data: Prisma.UserCreateInput = { 
                ci,
                email,
                password,
                name,
                lastname,
                role:`PACIENTE`,
                phoneCode: phoneCode ? phoneCode : ``, 
                phoneNumber: phoneNumber ? phoneNumber : ``,
                birthdate: birthdate,
                exacAddress,
                age
            }

            if (addressId) {
                data = {
                    ...data,
                    addressReference: { connect:{id:addressId} }
                }
            }

            if (parentId) {
                data = {
                    ...data,
                    parentReference: {connect: { id:parentId }}
                }
            }

            try {
                const create = await instance.createUser({data}); 

            } catch (error) {
                req.flash(`Error`, `Error temporal`);
                return res.redirect(`/login/`); 
            }   
            
            req.flash(`succ`, `Usuario creado`);
            return res.redirect(`/login/`);
        } catch (error) {
            req.flash(`Error`, `Error temporal`);
            return res.redirect(`/login/`);            
        }
    }

    public loadRoutes () {
        this.router.post(`${this.prefix}/login`, OffSession, this.LoginController);
        this.router.post(`/register`, this.RegisterPatient);

        return this.router;
    }

}
