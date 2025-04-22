import { Request, Response } from "express";
import { OnSession, OnAdmin } from "../../../middlewares/auth";
import { Prisma } from "@prisma/client";
import AbstractController from "../../AbstractController";
import UserModel from "../../../model/user/UserModel";
import { pushPdf } from "../../../model/pdf/GeneratePDFkit";
import AdressSubModel from "../../../model/config/AddressSubModel";
import QuotesSubModel from "../../../model/quotes/QuotesModel";

class ReportController extends AbstractController {

    public async HandleReportQuote (req:Request, res:Response) {
        const userModel = new UserModel();
        const quoteModel = new QuotesSubModel();

        const doctorPromise = userModel.findManyUser({ filter:{AND:[{isDelete:false},{role:`DOCTOR`}]}, skip:0, take:60 });
        const patientPromise = userModel.findManyUser({ filter:{AND:[{isDelete:false},{role:`PACIENTE`}]}, skip:0, take:60 });

        // filters query
        const doctorId = req.query.doctor ? req.query.doctor : null; 
        const patientId = req.query.patient ? req.query.patient : null;

        const headers = [``,`DOCTOR`,`PACIENTE`,`DESCRIPCIÓN`,`CALIFICACIÓN PACIENTE`,`CALIFICACIÓN DOCTOR`];

        let pdf: any = null;

        let take = 20;
        let skip = 0;

        if(doctorId) {
            const headers = [``,`PACIENTE`,`DESCIPCIÓN`,`CALIFICACIÓN PACIENTE`, `COLIFICACIÓN DOCTOR`];
            const quoteModel = new QuotesSubModel();
            const count = await quoteModel.countQuotes({filter:{AND:[{isDelete:false},{doctorId}]}});

            const currentDoctor = await userModel.findUser({ filter:{id:doctorId} });
    
            let i = 0;
            const rows: string[][] = [];
            do {
                const result = await quoteModel.findManyQuotes({ filter:{AND:[{isDelete:false},{doctorId}]}, skip, take });

                result.forEach((item,i)=>{
                    rows.push([
                        (i+1).toString(),
                        `${item.patientReference.name} ${item.patientReference.lastname}`,
                        `${item.message}`,
                        `${item.quoteDetailReference.descriptionPatient}`,
                        `${item.quoteDetailReference.descriptionDoctor}`
                    ]);
                });

                skip += take;
                take += take;
                i++;            
            } while (count > skip+take);

            pdf = await pushPdf({
                headers,
                rows,
                title:`Reporte Citas Doctor ${currentDoctor?.name} ${currentDoctor?.lastname}`,
                filter: [],
                count
            });

            const pdfResult = await pdf;
            return res.redirect(`${pdfResult.download}`); 
        }
        else if(patientId) {
            const headers = [``,`DOCTOR`,`DESCIPCIÓN`,`CALIFICACIÓN DOCTOR`, `COLIFICACIÓN PACIENTE`];
            const quoteModel = new QuotesSubModel();
            const count = await quoteModel.countQuotes({filter:{AND:[{isDelete:false},{patientId}]}});

            const currentDoctor = await userModel.findUser({ filter:{id:doctorId} });
    
            let i = 0;
            const rows: string[][] = [];
            do {
                const result = await quoteModel.findManyQuotes({ filter:{AND:[{isDelete:false},{doctorId}]}, skip, take });

                result.forEach((item,i)=>{
                    rows.push([
                        (i+1).toString(),
                        `${item.doctorReference.name} ${item.doctorReference.lastname}`,
                        `${item.message}`,
                        `${item.quoteDetailReference.descriptionDoctor}`,
                        `${item.quoteDetailReference.descriptionPatient}`
                    ]);
                });

                skip += take;
                take += take;
                i++;            
            } while (count > skip+take);

            pdf = await pushPdf({
                headers,
                rows,
                title:`Reporte Citas Paciente ${currentDoctor?.name} ${currentDoctor?.lastname}`,
                filter: [],
                count
            });

            const pdfResult = await pdf;
            return res.redirect(`${pdfResult.download}`);    
        } else {
            if(!req.query.generate) return res.render(`s/report/quote.hbs`, {
                patientList: await patientPromise,
                doctorList: await doctorPromise,
                // report: (await pdf).download 
            });
            const count = await quoteModel.countQuotes({filter:{isDelete:false}, });
    
            let i = 0;
            const rows: string[][] = [];
            do {
                const result = await quoteModel.findManyQuotes({ filter:{isDelete:false}, skip, take });
                result.forEach((item,i)=>{
                    rows.push([
                        (i+1).toString(),
                        `${item.doctorReference.name} ${item.doctorReference.lastname}`,
                        `${item.patientReference.name} ${item.patientReference.lastname}`,
                        `${item.message}`,
                        `${item.quoteDetailReference.descriptionPatient}`,
                        `${item.quoteDetailReference.descriptionDoctor}`
                    ]);
                });

                skip += take;
                take += take;
                i++;            
            } while (count > skip+take);

            pdf = await pushPdf({
                headers,
                rows,
                title:`Reporte Citas`,
                filter: [],
                count
            });

            const pdfResult = await pdf;
            return res.redirect(`${pdfResult.download}`); 
        }
    }

    public async findDoctorApi(req:Request, res:Response) {
        const param = req.query.param;
        const userModel = new UserModel();
        const result = userModel.findManyUser(
            { filter:{ AND:[
                {role:`DOCTOR`},
                {isDelete:false},
                {OR:[{name:{contains:param}}, {lastname:{contains:param}}, {cmeg_n:{contains:param}}, {matricula:{contains:param}}]}
            ]}, 
            skip:0,
            take:60 
        });

        return res.status(200).json({list:await result});
    }

    public async findAddressApi(req:Request, res:Response) {
        const param = req.query.param;
        const userModel = new AdressSubModel();
        const result = userModel.findManyAdress(
            { filter:{ AND:[
                {isDelete:false},
                {OR:[{description:{contains:param}}]}
            ]}, 
            skip:0,
            take:60 
        });

        return res.status(200).json({list:await result});
    }

    public async HandleReportDoctor (req:Request, res:Response) {
        const userModel = new UserModel();
        const addressModel = new AdressSubModel();

        const addressPromise = addressModel.findManyAdress({ filter:{isDelete:false}, skip:0, take:60 });
        const doctorPromise = userModel.findManyUser({ filter:{AND:[{isDelete:false},{role:`DOCTOR`}]}, skip:0, take:60 });

        // filters query
        const doctorId = req.query.doctor ? req.query.doctor : null; 
        const param = req.query.param ? req.query.param : null; 
        const address = req.query.address ? req.query.address : null; 

        const headers = [``,`Nombre`,`Matricula`,`Especialidad(s)`,`Citas`,`Dirección`];

        let pdf: any = null;

        let take = 20;
        let skip = 0;

        // unico doctor
        if(doctorId) {
            const headers = [``,`DOCTOR`,`PACIENTE`,`DESCRIPCIÓN`,`CALIFICACIÓN PACIENTE`,`CALIFICACIÓN DOCTOR`];

            const quoteModel = new QuotesSubModel();
            const count = await quoteModel.countQuotes({ 
                filter:{AND:[{isDelete:false},{doctorId}]}, 
            });

            const currentDoctor = await userModel.findUser({ filter:{id:doctorId} });
    
            let i = 0;
            const rows: string[][] = [];
            do {
                const result = await quoteModel.findManyQuotes({ filter:{AND:[{isDelete:false},{doctorId}]}, skip, take });

                result.forEach((item,i)=>{
                    rows.push([
                        (i+1).toString(),
                        `${item.doctorReference.name} ${item.doctorReference.lastname}`,
                        `${item.patientReference.name} ${item.patientReference.lastname}`,
                        `${item.message}`,
                        `${item.quoteDetailReference.descriptionPatient}`,
                        `${item.quoteDetailReference.descriptionDoctor}`
                    ]);
                });

                skip += take;
                take += take;
                i++;            
            } while (count > skip+take);

            pdf = await pushPdf({
                headers,
                rows,
                title:`Reporte de Doctor ${currentDoctor?.name} ${currentDoctor?.lastname}`,
                filter: [
                    `Teléfono: ${currentDoctor?.phoneCode} ${currentDoctor?.phoneNumber}`,
                    `Correo: ${currentDoctor?.email}`,
                    `Dirección: ${currentDoctor?.addressReference?.description}`,
                ],
                count,
            });

            const pdfResult = await pdf;
            return res.redirect(`${pdfResult.download}`);
        } else if(address) {
            const count = await userModel.countUser({ 
                filter:{AND:[{isDelete:false},{role:`DOCTOR`},{addressReference:{ id:address }}]}, 
            })
    
            let i = 0;
            const rows: string[][] = [];
            // lista de doctores
            do {
                const result = await userModel.findForReport({ filter:{AND:[{isDelete:false},{role:`DOCTOR`},{addressReference:{ id:address }}]}, skip, take });
                result.forEach((item,i)=>{
                    rows.push([
                        (i+1).toString(),
                        `${item.name} ${item.lastname}`,
                        `${item.matricula}`,
                        `${item.speciality[0] ? item.speciality[0].specialityReference.name : ``} ${item.speciality[1] ? item.speciality[1].specialityReference.name : ``}`, 
                        `${item._count.doctor}`,
                        `${item.addressReference?.description}`
                    ]);
                });
    
                skip += take;
                take += take;
                i++;            
            } while (count > skip+take);
    
            pdf = await pushPdf({
                headers,
                rows,
                title:`Reporte Doctores por Dirección`,
                filter: [],
                count
            });
    
            const pdfResult = await pdf;
            return res.redirect(`${pdfResult.download}`);
        } else {
            if(!req.query.generate) return res.render(`s/report/doctor.hbs`, {
                addressList: await addressPromise,
                doctorList: await doctorPromise,
            });;
            const count = await userModel.countUser({ 
                filter:{AND:[{isDelete:false},{role:`DOCTOR`}]}, 
            })
    
            let i = 0;
            const rows: string[][] = [];
            // lista de doctores
            do {
                const result = await userModel.findForReport({ filter:{AND:[{isDelete:false},{role:`DOCTOR`}]}, skip, take });
                result.forEach((item,i)=>{
                    rows.push([
                        (i+1).toString(),
                        `${item.name} ${item.lastname}`,
                        `${item.matricula}`,
                        `${item.speciality[0] ? item.speciality[0].specialityReference.name : ``} ${item.speciality[1] ? item.speciality[1].specialityReference.name : ``}`, 
                        `${item._count.doctor}`,
                        `${item.addressReference?.description}`
                    ]);
                });

                skip += take;
                take += take;
                i++;            
            } while (count > skip+take);

            pdf = await pushPdf({
                headers,
                rows,
                title:`Reporte Doctores`,
                filter: [],
                count
            });

            const pdfResult = await pdf;
            return res.redirect(`${pdfResult.download}`);
        }
        return res.render(`s/report/doctor.hbs`, {
            addressList: await addressPromise,
            doctorList: await doctorPromise,
            // // report: (await pdf).download 
        });
    }
    
    public async HandleReportPatient (req:Request, res:Response) {
        const userModel = new UserModel();
        const addressModel = new AdressSubModel();

        const addressPromise = addressModel.findManyAdress({ filter:{isDelete:false}, skip:0, take:60 });
        const patientPromise = userModel.findManyUser({ filter:{AND:[{isDelete:false},{role:`PACIENTE`}]}, skip:0, take:60 });

        // filters query
        const patientId = req.query.patient ? req.query.patient : null;
        const address = req.query.address ? req.query.address : null; 

        const headers = [``,`Nombre`,`Citas`,`Dirección`];

        let pdf: any = null;

        let take = 20;
        let skip = 0;

        if(patientId) {
            const headers = [``,`DOCTOR`,`PACIENTE`,`DESCRIPCIÓN`,`CALIFICACIÓN PACIENTE`,`CALIFICACIÓN DOCTOR`];

            const quoteModel = new QuotesSubModel();
            const count = await quoteModel.countQuotes({ 
                filter:{AND:[{isDelete:false},{patientId}]}, 
            });

            const currentPatient = await userModel.findUser({ filter:{id:patientId} });
    
            let i = 0;
            const rows: string[][] = [];
            do {
                const result = await quoteModel.findManyQuotes({ filter:{AND:[{isDelete:false},{patientId}]}, skip, take });

                result.forEach((item,i)=>{
                    rows.push([
                        (i+1).toString(),
                        `${item.doctorReference.name} ${item.doctorReference.lastname}`,
                        `${item.patientReference.name} ${item.patientReference.lastname}`,
                        `${item.message}`,
                        `${item.quoteDetailReference.descriptionPatient}`,
                        `${item.quoteDetailReference.descriptionDoctor}`
                    ]);
                });

                skip += take;
                take += take;
                i++;            
            } while (count > skip+take);

            pdf = await pushPdf({
                headers,
                rows,
                title:`Reporte de Paciente ${currentPatient?.name} ${currentPatient?.lastname}`,
                filter: [
                    `Teléfono: ${currentPatient?.phoneCode} ${currentPatient?.phoneNumber}`,
                    `Correo: ${currentPatient?.email}`,
                    `Dirección: ${currentPatient?.addressReference?.description}`,
                ],
                count
            });

            const pdfResult = await pdf;
            return res.redirect(`${pdfResult.download}`);
        }
        else if(address) {
            const count = await userModel.countUser({ 
                filter:{AND:[{isDelete:false},{role:`PACIENTE`},{addressReference:{ id:address }}]}, 
            })

            let i = 0;
            const rows: string[][] = [];
            do {
                const result = await userModel.findForReport({ filter:{AND:[{isDelete:false},{role:`PACIENTE`},{addressReference:{ id:address }}]}, skip, take });
                result.forEach((item,i)=>{
                    rows.push([
                        (i+1).toString(),
                        `${item.name} ${item.lastname}`,
                        `${item._count.patient}`,
                        `${item.addressReference?.description}`
                    ]);
                });
    
                skip += take;
                take += take;
                i++;            
            } while (count > skip+take);

            pdf = await pushPdf({
                headers,
                rows,
                title:`Reporte Pacientes por Dirección`,
                filter: [],
                count
            });

            const pdfResult = await pdf;
            return res.redirect(`${pdfResult.download}`);    
         } else {
            if(!req.query.generate) return res.render(`s/report/patient.hbs`, {
                addressList: await addressPromise,
                patientList: await patientPromise,
                // report: (await pdf).download 
            });
            const count = await userModel.countUser({ 
                filter:{AND:[{isDelete:false},{role:`PACIENTE`}]}, 
            })
    
            let i = 0;
            const rows: string[][] = [];
            do {
                const result = await userModel.findForReport({ filter:{AND:[{isDelete:false},{role:`PACIENTE`}]}, skip, take });
                
                result.forEach((item,i)=>{
                    rows.push([
                        (i+1).toString(),
                        `${item.name} ${item.lastname}`,
                        `${item._count.patient}`,
                        `${item.addressReference?.description}`
                    ]);
                });

                skip += take;
                take += take;
                i++;            
            } while (count > skip+take);

            pdf = await pushPdf({
                headers,
                rows,
                title:`Reporte Pacientes`,
                filter: [],
                count
            });

            const pdfResult = await pdf;
            return res.redirect(`${pdfResult.download}`);
        }

        return res.render(`s/report/patient.hbs`, {
            addressList: await addressPromise,
            patientList: await patientPromise,
            // report: (await pdf).download 
        });
    }

    public LoadRouters() {        
        this.router.get(`/report/quote`, OnSession, OnAdmin,this.HandleReportQuote);
        this.router.get(`/report/doctor`, OnSession, OnAdmin,this.HandleReportDoctor);
        this.router.get(`/report/patient`, OnSession, OnAdmin,this.HandleReportPatient);

        return this.router;
    }
}

export default ReportController;
