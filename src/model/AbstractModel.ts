import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import Kernel from "../Kernel";
import { MONTH_STRUCT } from "../types/app";

class AbstractModel extends Kernel {

    constructor(
        private prisma = new PrismaClient()
    ) {
        super();
    }

    // compara contrasenias
    public async ComparePassword({password, dbPassword}:{password:string, dbPassword:string}) {
        const result = await bcrypt.compare(password, dbPassword);
        return result;
    }

    // encripta contrasenia
    public async HashPassword({password}:{password:string}) {
        const result = await bcrypt.hash(password, 15);
        return result;
    }

    // connect or create
    public async PushStatictics({objectId, objectName}: {objectName:string, objectId:string}) {
        const prisma = this.prisma;
        const month = this.getMonth();

        const staticticsMonthPromise = prisma.staticticsMonth.findFirst({
            where: {
                AND: [
                    { objectName },
                    { objectId },
                    { monthNumber:month }
                ]
            }
        });

        const staticticsYearPromise = prisma.staticticsYear.findFirst({
            where: {
                AND: [
                    { objectName },
                    { objectId }
                ]
            }
        });

        const staticticsYear = await staticticsYearPromise;
        const staticticsMonth = await staticticsMonthPromise;
        
        if(staticticsYear) {this.increment({id:staticticsYear.id,type:"YEAR",prisma});}
        else this.create({ objectId,objectName,prisma,type:"YEAR" });

        if(staticticsMonth) {this.increment({id:staticticsMonth.id,type:"MONTH",prisma});}
        else this.create({ objectId,objectName,prisma,type:"MONTH" });
    }

    public async increment({id,type, prisma}: {type:`MONTH` | `YEAR`,id:string, prisma:PrismaClient}) {
        if(type === "MONTH") {
            const monthNumber = this.getMonth();
            const month: MONTH_STRUCT = this.getMonths(monthNumber-1) as MONTH_STRUCT;

            const day = this.getDay();
            return await prisma.staticticsMonth.update({
                data: {
                    totalMonth: { increment:1 },

                    totalDay1: day == 1 ? {increment:1} : {increment:0},
                    totalDay2: day == 2 ? {increment:1} : {increment:0},
                    totalDay3: day == 3 ? {increment:1} : {increment:0},
                    totalDay4: day == 4 ? {increment:1} : {increment:0},
                    totalDay5: day == 5 ? {increment:1} : {increment:0},
                    totalDay6: day == 6 ? {increment:1} : {increment:0},
                    totalDay7: day == 7 ? {increment:1} : {increment:0},
                    totalDay8: day == 8 ? {increment:1} : {increment:0},
                    totalDay9: day == 9 ? {increment:1} : {increment:0},
                    totalDay10: day == 10 ? {increment:1} : {increment:0},
                    totalDay11: day == 11 ? {increment:1} : {increment:0},
                    totalDay12: day == 12 ? {increment:1} : {increment:0},
                    totalDay13: day == 13 ? {increment:1} : {increment:0},
                    totalDay14: day == 14 ? {increment:1} : {increment:0},
                    totalDay15: day == 15 ? {increment:1} : {increment:0},
                    totalDay16: day == 16 ? {increment:1} : {increment:0},
                    totalDay17: day == 17 ? {increment:1} : {increment:0},
                    totalDay18: day == 18 ? {increment:1} : {increment:0},
                    totalDay19: day == 19 ? {increment:1} : {increment:0},
                    totalDay20: day == 20 ? {increment:1} : {increment:0},
                    totalDay21: day == 21 ? {increment:1} : {increment:0},
                    totalDay22: day == 22 ? {increment:1} : {increment:0},
                    totalDay23: day == 23 ? {increment:1} : {increment:0},
                    totalDay24: day == 24 ? {increment:1} : {increment:0},
                    totalDay25: day == 25 ? {increment:1} : {increment:0},
                    totalDay26: day == 26 ? {increment:1} : {increment:0},
                    totalDay27: day == 27 ? {increment:1} : {increment:0},
                    totalDay28: day == 28 ? {increment:1} : {increment:0},
                    totalDay29: day == 29 ? {increment:1} : {increment:0},
                    totalDay30: day == 30 ? {increment:1} : {increment:0},
                    totalDay31: day == 31 ? {increment:1} : {increment:0},
                },
                where: { id }
            })
        }

        const monthNumber = this.getMonth();
        const year = this.getYear();

        return await prisma.staticticsYear.update({
            data: {
                totalYear: {increment:1},
                year,

                totalMonth1: monthNumber == 1 ? {increment:1} : {increment:0},
                totalMonth2: monthNumber == 2 ? {increment:1} : {increment:0},
                totalMonth3: monthNumber == 3 ? {increment:1} : {increment:0},
                totalMonth4: monthNumber == 4 ? {increment:1} : {increment:0},
                totalMonth5: monthNumber == 5 ? {increment:1} : {increment:0},
                totalMonth6: monthNumber == 6 ? {increment:1} : {increment:0},
                totalMonth7: monthNumber == 7 ? {increment:1} : {increment:0},
                totalMonth8: monthNumber == 8 ? {increment:1} : {increment:0},
                totalMonth9: monthNumber == 9 ? {increment:1} : {increment:0},
                totalMonth10: monthNumber == 10 ? {increment:1} : {increment:0},
                totalMonth11: monthNumber == 11 ? {increment:1} : {increment:0},
                totalMonth12: monthNumber == 12 ? {increment:1} : {increment:0},
            },
            where: { id }
        })
    } 

    public async create({objectId, objectName,type, prisma}: {type:`MONTH` | `YEAR`,objectName:string, objectId:string, prisma:PrismaClient}) {
        if(type === "MONTH") {
            const monthNumber = this.getMonth();
            const month: MONTH_STRUCT = this.getMonths(monthNumber-1) as MONTH_STRUCT;

            const day = this.getDay();
            return await prisma.staticticsMonth.create({
                data: {
                    monthLabel: month.label,
                    monthName: month.name,
                    monthNumber: monthNumber,
                    objectId,
                    objectName,

                    totalMonth: 1,

                    totalDay1: day == 1 ? 1 : 0,
                    totalDay2: day == 2 ? 1 : 0,
                    totalDay3: day == 3 ? 1 : 0,
                    totalDay4: day == 4 ? 1 : 0,
                    totalDay5: day == 5 ? 1 : 0,
                    totalDay6: day == 6 ? 1 : 0,
                    totalDay7: day == 7 ? 1 : 0,
                    totalDay8: day == 8 ? 1 : 0,
                    totalDay9: day == 9 ? 1 : 0,
                    totalDay10: day == 10 ? 1 : 0,
                    totalDay11: day == 11 ? 1 : 0,
                    totalDay12: day == 12 ? 1 : 0,
                    totalDay13: day == 13 ? 1 : 0,
                    totalDay14: day == 14 ? 1 : 0,
                    totalDay15: day == 15 ? 1 : 0,
                    totalDay16: day == 16 ? 1 : 0,
                    totalDay17: day == 17 ? 1 : 0,
                    totalDay18: day == 18 ? 1 : 0,
                    totalDay19: day == 19 ? 1 : 0,
                    totalDay20: day == 20 ? 1 : 0,
                    totalDay21: day == 21 ? 1 : 0,
                    totalDay22: day == 22 ? 1 : 0,
                    totalDay23: day == 23 ? 1 : 0,
                    totalDay24: day == 24 ? 1 : 0,
                    totalDay25: day == 25 ? 1 : 0,
                    totalDay26: day == 26 ? 1 : 0,
                    totalDay27: day == 27 ? 1 : 0,
                    totalDay28: day == 28 ? 1 : 0,
                    totalDay29: day == 29 ? 1 : 0,
                    totalDay30: day == 30 ? 1 : 0,
                    totalDay31: day == 31 ? 1 : 0,
                }
            })
        }

        const monthNumber = this.getMonth();
        const month: MONTH_STRUCT = this.getMonths(monthNumber-1) as MONTH_STRUCT;
        const year = this.getYear();

        return await prisma.staticticsYear.create({
            data: {
                objectId,
                objectName,

                totalYear: 1,

                year,

                totalMonth1: monthNumber == 1 ? 1 : 0,
                totalMonth2: monthNumber == 2 ? 1 : 0,
                totalMonth3: monthNumber == 3 ? 1 : 0,
                totalMonth4: monthNumber == 4 ? 1 : 0,
                totalMonth5: monthNumber == 5 ? 1 : 0,
                totalMonth6: monthNumber == 6 ? 1 : 0,
                totalMonth7: monthNumber == 7 ? 1 : 0,
                totalMonth8: monthNumber == 8 ? 1 : 0,
                totalMonth9: monthNumber == 9 ? 1 : 0,
                totalMonth10: monthNumber == 10 ? 1 : 0,
                totalMonth11: monthNumber == 11 ? 1 : 0,
                totalMonth12: monthNumber == 12 ? 1 : 0,
            }
        })
    } 

    public getYear() {
        const date = new Date();
        return date.getFullYear();
    }

    public getMonth() {
        const date = new Date();
        return date.getMonth()+1;
    }

    public getDay() {
        const date = new Date();
        return date.getDate();
    }

    async CreateHistory (data: { des: string, id?:string, userId:string, name:string }) {
        return await this.prisma.history.create({
            data: {
                description: data.des,
                objectReference: data.id ? true : false,
                objectId: data.id,
                objectName: data.name,
                userReference: {
                    connect: { id:data.userId }
                }
            }
        });
    }

    // findMany one register
    public async findManyUserHistory({filter,skip,take}: {filter:Prisma.HistoryWhereInput,skip:number,take:number}) {
        const prisma = new PrismaClient();
        return prisma.history.findMany({
            where: {
                ...filter,
            },
            orderBy: {createAt:"asc"},
            include: {
                userReference: true
            },
            skip,
            take
        });
    }

    public async findManyCount({filter}: {filter:Prisma.HistoryWhereInput}) {
        const prisma = new PrismaClient();
        return prisma.history.count({
            where: {
                ...filter,
            }
        });
    }
}

export default AbstractModel;

