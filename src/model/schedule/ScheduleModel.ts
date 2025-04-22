import { Prisma, PrismaClient } from "@prisma/client";
import AbstractModel from "../AbstractModel";

export default class ScheduleSubModel extends AbstractModel {

    constructor () {
        super();
    }

    public async createSchedule({ data }: { data: Prisma.ScheduleCreateInput }) {
        const prisma = new PrismaClient();
        return prisma.schedule.create({ data });
    }

    public async singPrimary({id, user}: {id:string, user:string}) {
        const prisma = new PrismaClient();

        const foundPrimary = await prisma.schedule.findMany({
            where: {
                AND:[{ primary:true },{isDelete:false},{userId:user}]
            },
            select: {id:true}
        });

        if (foundPrimary) {
            foundPrimary.forEach(async (item) => {
                await prisma.schedule.update({
                    data: {primary:false},
                    where: { id:item.id }
                });
            })
        }

        return prisma.schedule.update({
            data: {primary:true},
            where: { id }
        });
    }

    public async findSchedule({ filter }: { filter: Prisma.ScheduleWhereInput }) {
        const prisma = new PrismaClient();
        return prisma.schedule.findFirst({ 
            where:filter,
            include: {
                detail: {
                    orderBy: { day_index: "asc" },
                    select: {
                        day: true,
                        day_index: true,
                        scheduleId: true,
                        time_end: true,
                        time_start: true,
                        id: true,
                        isDelete: true
                    }
                },
                user: true,
                _count: true
            }
        });
    }

    public async countSchedule({ filter }: { filter: Prisma.ScheduleWhereInput }) {
        const prisma = new PrismaClient();
        return prisma.schedule.count({ where:filter });
    }

    public async findManySchedule({ filter, skip, take }: { filter: Prisma.ScheduleWhereInput, skip:number, take: number }) {
        const prisma = new PrismaClient();
        return prisma.schedule.findMany({ 
            where:filter,
            orderBy: { 
                primary:"desc",
            },
            include: {
                _count: true,
                user: true
            },
            skip,
            take
        });
    }

    public async updateSchedule({ data, filter }: { data: Prisma.ScheduleUpdateInput, filter: Prisma.ScheduleWhereUniqueInput }) {
        const prisma = new PrismaClient();
        return prisma.schedule.update({ data, where:filter });
    }
    
    public async deleteAdress({ id }: { id: string }) {
        const prisma = new PrismaClient();
        return prisma.schedule.update({ where: {id}, data:{isDelete:true} });
    }
}
