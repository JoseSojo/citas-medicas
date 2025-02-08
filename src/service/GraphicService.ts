import { Prisma, PrismaClient } from "@prisma/client";
import AbstractModel from "../model/AbstractModel";
import QuotesSubModel from "../model/quotes/QuotesModel";
import { MONTH_STRUCT, STATUS } from "../types/app";

export default class GraphicService extends AbstractModel {

    constructor () {
        super();
    }

    public async MonthGraphic({objectName,objectId,month}:{ objectName:string,objectId?:string,month:string }) {
        const prisma = new PrismaClient();
        const model = new AbstractModel();

        const months = model.getAllMonths();


    }

    public async MonthGraphicQuote({month,id,ObjectName}:{ month?:number, id?:string,ObjectName?:string }) {
        const prisma = new PrismaClient();
        const model = new AbstractModel();
        const months = model.getAllMonths();
        const monthFind = month ? Number(month) : model.getMonth();

        // if(month) {
        //     const result = await prisma.staticticsMonth.findFirst({ where:{monthNumber: month,objectName:`CITAS`} });

        //     const label = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        //     const data = [
        //         result?.totalDay1,
        //         result?.totalDay2,
        //         result?.totalDay3,
        //         result?.totalDay4,
        //         result?.totalDay5,
        //         result?.totalDay6,
        //         result?.totalDay7,
        //         result?.totalDay8,
        //         result?.totalDay9,
        //         result?.totalDay10,
        //         result?.totalDay11,
        //         result?.totalDay12,
        //         result?.totalDay13,
        //         result?.totalDay14,
        //         result?.totalDay15,
        //         result?.totalDay16,
        //         result?.totalDay17,
        //         result?.totalDay18,
        //         result?.totalDay19,
        //         result?.totalDay20,
        //         result?.totalDay21,
        //         result?.totalDay22,
        //         result?.totalDay23,
        //         result?.totalDay24,
        //         result?.totalDay25,
        //         result?.totalDay26,
        //         result?.totalDay27,
        //         result?.totalDay28,
        //         result?.totalDay29,
        //         result?.totalDay30,
        //         result?.totalDay31,
        //     ];

        //     return {label,data};
        // }

        if(id) {
            const result = await prisma.staticticsMonth.findFirst({ where:{AND:[{objectId:id},{monthNumber:monthFind}]} });
            const label = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
            const data = [
                result?.totalDay1,
                result?.totalDay2,
                result?.totalDay3,
                result?.totalDay4,
                result?.totalDay5,
                result?.totalDay6,
                result?.totalDay7,
                result?.totalDay8,
                result?.totalDay9,
                result?.totalDay10,
                result?.totalDay11,
                result?.totalDay12,
                result?.totalDay13,
                result?.totalDay14,
                result?.totalDay15,
                result?.totalDay16,
                result?.totalDay17,
                result?.totalDay18,
                result?.totalDay19,
                result?.totalDay20,
                result?.totalDay21,
                result?.totalDay22,
                result?.totalDay23,
                result?.totalDay24,
                result?.totalDay25,
                result?.totalDay26,
                result?.totalDay27,
                result?.totalDay28,
                result?.totalDay29,
                result?.totalDay30,
                result?.totalDay31,
            ];

            return {label,data};
        }


        const filter: Prisma.StaticticsMonthWhereInput[] = [{monthNumber: monthFind},{objectName:ObjectName?ObjectName:`CITAS`}];
        // if(id) filter.push({ objectId:id });

        const result = await prisma.staticticsMonth.findFirst({ where:{AND:filter} });
        const label = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        const data = [
            result?.totalDay1,
            result?.totalDay2,
            result?.totalDay3,
            result?.totalDay4,
            result?.totalDay5,
            result?.totalDay6,
            result?.totalDay7,
            result?.totalDay8,
            result?.totalDay9,
            result?.totalDay10,
            result?.totalDay11,
            result?.totalDay12,
            result?.totalDay13,
            result?.totalDay14,
            result?.totalDay15,
            result?.totalDay16,
            result?.totalDay17,
            result?.totalDay18,
            result?.totalDay19,
            result?.totalDay20,
            result?.totalDay21,
            result?.totalDay22,
            result?.totalDay23,
            result?.totalDay24,
            result?.totalDay25,
            result?.totalDay26,
            result?.totalDay27,
            result?.totalDay28,
            result?.totalDay29,
            result?.totalDay30,
            result?.totalDay31,
        ];

        return {label,data};
    }

    public async YearGraphicQuote({year,id,ObjectName}:{ year?:number , id?:string, ObjectName?:string}) {
        const prisma = new PrismaClient();
        const model = new AbstractModel();
        const yearFind = year ? Number(year) : model.getYear();

        if(id) {
            const result = await prisma.staticticsYear.findFirst({ where:{AND:[{objectId:id},{year:yearFind}]} });
            const label: string[] = [];
            model.getAllMonths().forEach((item) => {
                label.push(item.label);
            })
            const data = [
                result?.totalMonth1,
                result?.totalMonth2,
                result?.totalMonth3,
                result?.totalMonth4,
                result?.totalMonth5,
                result?.totalMonth6,
                result?.totalMonth7,
                result?.totalMonth8,
                result?.totalMonth9,
                result?.totalMonth10,
                result?.totalMonth11,
                result?.totalMonth12,
            ];
    
            return {label,data};
        }

        const filter: Prisma.StaticticsYearWhereInput[] = [{year: yearFind},{objectName:ObjectName?ObjectName:`CITAS`}];
        // if(id) filter.push({ objectId:id });

        const result = await prisma.staticticsYear.findFirst({ where:{AND:filter} });
        const label: string[] = [];
        model.getAllMonths().forEach((item) => {
            label.push(item.label);
        })
        const data = [
            result?.totalMonth1,
            result?.totalMonth2,
            result?.totalMonth3,
            result?.totalMonth4,
            result?.totalMonth5,
            result?.totalMonth6,
            result?.totalMonth7,
            result?.totalMonth8,
            result?.totalMonth9,
            result?.totalMonth10,
            result?.totalMonth11,
            result?.totalMonth12,
        ];

        return {label,data};
    }

    public async PieQuoteStatusChart({id}:{id?:string}) {
        const prisma = new PrismaClient();
        const model = new AbstractModel();
        const quoteModel = new QuotesSubModel();

        const filter: Prisma.QuotesWhereInput[] = [{ isDelete:false }];

        const quoteProcesadoCountPromise = quoteModel.countQuotes({ filter:{AND:[...filter,{ status:`REGISTRADO` }]} });
        const quoteAprobadoCountPromise = quoteModel.countQuotes({ filter:{AND:[...filter,{ status:`APROBADO` }]} });
        const quoteCanceladoCountPromise = quoteModel.countQuotes({ filter:{AND:[...filter,{ status:`CANCELADO` }]} });
        const quoteFinalizadoCountPromise = quoteModel.countQuotes({ filter:{AND:[...filter,{ status:`FINALIZADO` }]} });

        const procesado = await quoteProcesadoCountPromise;
        const Aprobado = await quoteAprobadoCountPromise;
        const cancelado = await quoteCanceladoCountPromise;
        const finalizado = await quoteFinalizadoCountPromise;

        const label: STATUS[] = [`REGISTRADO`,"REGISTRADO","CANCELADA","FINALIZADO"];
        const data = [procesado,Aprobado,cancelado,finalizado];

        return {label, data};
    }

    public async PieQuoteDoctorStatusChart({id}:{id?:string}) {
        const prisma = new PrismaClient();
        const model = new AbstractModel();
        const quoteModel = new QuotesSubModel();

        const quoteProcesadoCountPromise = quoteModel.countQuotes({ filter:{AND:[{ isDelete:false }, {doctorId:id},{ status:`REGISTRADO` }]} });
        const quoteAprobadoCountPromise = quoteModel.countQuotes({ filter:{AND:[{ isDelete:false }, {doctorId:id},{ status:`APROBADO` }]} });
        const quoteCanceladoCountPromise = quoteModel.countQuotes({ filter:{AND:[{ isDelete:false }, {doctorId:id},{ status:`CANCELADO` }]} });
        const quoteFinalizadoCountPromise = quoteModel.countQuotes({ filter:{AND:[{ isDelete:false }, {doctorId:id},{ status:`FINALIZADO` }]} });

        const procesado = await quoteProcesadoCountPromise;
        const Aprobado = await quoteAprobadoCountPromise;
        const cancelado = await quoteCanceladoCountPromise;
        const finalizado = await quoteFinalizadoCountPromise;

        const label: STATUS[] = [`REGISTRADO`,"REGISTRADO","CANCELADA","FINALIZADO"];
        const data = [procesado,Aprobado,cancelado,finalizado];

        return {label, data};
    }

    public async PieQuotePatientStatusChart({id}:{id?:string}) {
        const prisma = new PrismaClient();
        const model = new AbstractModel();
        const quoteModel = new QuotesSubModel();

        const filter: Prisma.QuotesWhereInput[] = [{ isDelete:false }, {patientId:id}];

        const quoteProcesadoCountPromise = quoteModel.countQuotes({ filter:{AND:[...filter,{ status:`REGISTRADO` }]} });
        const quoteAprobadoCountPromise = quoteModel.countQuotes({ filter:{AND:[...filter,{ status:`APROBADO` }]} });
        const quoteCanceladoCountPromise = quoteModel.countQuotes({ filter:{AND:[...filter,{ status:`CANCELADO` }]} });
        const quoteFinalizadoCountPromise = quoteModel.countQuotes({ filter:{AND:[...filter,{ status:`FINALIZADO` }]} });

        const procesado = await quoteProcesadoCountPromise;
        const Aprobado = await quoteAprobadoCountPromise;
        const cancelado = await quoteCanceladoCountPromise;
        const finalizado = await quoteFinalizadoCountPromise;

        const label: STATUS[] = [`REGISTRADO`,"REGISTRADO","CANCELADA","FINALIZADO"];
        const data = [procesado,Aprobado,cancelado,finalizado];

        return {label, data};
    }
}
