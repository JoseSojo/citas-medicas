import { NextFunction, Request, Response } from "express";
import UserModel from "../model/user/UserModel";

export const CreateUser = async (req: Request, res: Response, next: NextFunction) => {
    const userInstance = new UserModel();
    const { name, ci, email, lastname, role, addressId,cmeg_n,matricula, phoneCode, phoneNumber, esp1, esp2 } = req.body as { name:string, ci:string, email:string, lastname:string, role:string, addressId:string,cmeg_n:string,matricula:string, phoneCode:string, phoneNumber:string, esp1:string, esp2:string };

    const ciFoundPromise = userInstance.findUser({ filter:{ ci } });
    const emailFoundPromise = userInstance.findUser({ filter:{ email } });
    const cmeg_nFoundPromise = userInstance.findUser({ filter:{ cmeg_n } });
    const matriculaFoundPromise = userInstance.findUser({ filter:{ matricula } });
    const phoneFoundPromise = userInstance.findUser({ filter:{ AND:[{phoneCode},{phoneNumber}] } });

    if(!name) {
        req.flash(`err`, `Debe contener el nombre`);
        return res.redirect(`/user`);
    } 

    if(ci.length < 8) {
        req.flash(`err`, `Cédula incorrecta`);
        return res.redirect(`/user`);
    } 

    if(!email.indexOf(`@`) || !email.indexOf(`.`)) {
        req.flash(`err`, `Correo incorrecto`);
        return res.redirect(`/user`);
    } 

    if(!lastname) {
        req.flash(`err`, `Debe contener un apellido`);
        return res.redirect(`/user`);
    }

    if(role === `DOCTOR`) {
        if(!addressId) {
            req.flash(`err`, `Debe contener una dirección`);
            return res.redirect(`/user`);
        }
        if(!cmeg_n) {
            req.flash(`err`, `Debe contener un Número de inscripción`);
            return res.redirect(`/user`);
        }
        if(!matricula) {
            req.flash(`err`, `Debe contener una matrícula`);
            return res.redirect(`/user`);
        }
        if(!phoneCode || !phoneNumber) {
            req.flash(`err`, `Debe contener el número de teléfono`);
            return res.redirect(`/user`);
        }
        if(!esp1 && !esp2) {
            req.flash(`err`, `Debe contener al menos una especialidad`);
            return res.redirect(`/user`);
        }
    }

    const ciFound = await ciFoundPromise;
    const emailFound = await emailFoundPromise;
    const cmeg_nFound = await cmeg_nFoundPromise;
    const matriculaFound = await matriculaFoundPromise;
    const phoneFound = await phoneFoundPromise;

    if(ciFound) {
        req.flash(`err`, `Cédula ${ci} ya registrada.`);
        return res.redirect(`/user`);
    }

    if(emailFound) {
        req.flash(`err`, `Correo ${email} ya registrado.`);
        return res.redirect(`/user`);
    }

    if(phoneFound) {
        req.flash(`err`, `Cédula ${phoneCode}${phoneNumber} ya registrado.`);
        return res.redirect(`/user`);
    }

    if(role === `DOCTOR` && cmeg_nFound) {
        req.flash(`err`, `Número de inscripción ${cmeg_n} ya en uso.`);
        return res.redirect(`/user`);
    }

    if(role === `DOCTOR` && matriculaFound) {
        req.flash(`err`, `Matrícula ${matricula} ya en uso.`);
        return res.redirect(`/user`);
    }

    next();
}

export const UpdateUser = async (req: Request, res: Response, next: NextFunction) => {
    const userInstance = new UserModel();
    const {id} = req.user as any;
    const { name, ci, email, lastname, addressId,cmeg_n,matricula, phoneCode, phoneNumber, esp1, esp2, password } = req.body as {password?:string, name?:string, ci?:string, email?:string, lastname?:string, role?:string, addressId?:string,cmeg_n?:string,matricula?:string, phoneCode?:string, phoneNumber?:string, esp1?:string, esp2?:string };
    
    const ciFoundPromise = userInstance.findUser({ filter:{AND:[{ ci },{isDelete:false},{id:{not:id}}] }});
    const emailFoundPromise = userInstance.findUser({ filter:{AND:[{ email },{isDelete:false},{id:{not:id}}] }});
    const cmeg_nFoundPromise = userInstance.findUser({ filter:{AND:[{ cmeg_n },{isDelete:false},{id:{not:id}}] }});
    const matriculaFoundPromise = userInstance.findUser({ filter:{AND:[{ matricula },{isDelete:false},{id:{not:id}}] }});
    const phoneFoundPromise = userInstance.findUser({ filter:{ AND:[{phoneCode},{phoneNumber},{isDelete:false},{id:{not:id}}] } });

    const ciFound = await ciFoundPromise;
    const emailFound = await emailFoundPromise;
    const cmeg_nFound = await cmeg_nFoundPromise;
    const matriculaFound = await matriculaFoundPromise;
    const phoneFound = await phoneFoundPromise;

    const user = req.user as any;
    const role = user.role;

    if(role === `DOCTOR`) {
        if(emailFound) {
            req.flash(`err`, `Correo ${email} ya registrado.`);
            return res.redirect(`/user`);
        }

        req.body = { email, password };
        return next();
    }

    if(role === `PATIENT`) {
        if(ciFound) {
            req.flash(`err`, `Cédula ${ci} ya registrado.`);
            return res.redirect(`/user`);
        }

        if(emailFound) {
            req.flash(`err`, `Correo ${email} ya registrado.`);
            return res.redirect(`/user`);
        }

        req.body = { email, password, name, lastname, ci };
        return next();
    }

    if(role === `ADMIN`) {
        if(ciFound) {
            req.flash(`err`, `Cédula ${ci} ya registrada.`);
            return res.redirect(`/user`);
        }
    
        if(emailFound) {
            req.flash(`err`, `Correo ${email} ya registrado.`);
            return res.redirect(`/user`);
        }
    
        if(phoneFound) {
            req.flash(`err`, `Teléfono ${phoneCode}${phoneNumber} ya registrado.`);
            return res.redirect(`/user`);
        }
    
        if(cmeg_n && cmeg_nFound) {
            req.flash(`err`, `Número de inscripción ${cmeg_n} ya en uso.`);
            return res.redirect(`/user`);
        }
    
        if(matricula && matriculaFound) {
            req.flash(`err`, `Matrícula ${matricula} ya en uso.`);
            return res.redirect(`/user`);
        }

        req.body = { email, name, lastname, ci, cmeg_n:cmeg_n?cmeg_n:``, matricula:matricula?matricula:``, phoneCode, phoneNumber };
        return next();
    }

    req.flash(`err`, `Error temporal`);
    return res.redirect(`/`);
}
