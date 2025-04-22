import { Prisma, PrismaClient } from "@prisma/client";
import AbstractModel from "../AbstractModel";

export default class ScheduleTimeModel extends AbstractModel {

    constructor () {
        super();
    }

    public async createScheduleTime({ data }: { data: Prisma.ScheduleTimeCreateInput }) {
        const prisma = new PrismaClient();
        return prisma.scheduleTime.create({ data });
    }

    public async findScheduleTime({ filter }: { filter: Prisma.ScheduleTimeWhereInput }) {
        const prisma = new PrismaClient();
        return prisma.scheduleTime.findFirst({ where:filter });
    }

    public async findManyScheduleTime({ filter, skip, take }: { filter: Prisma.ScheduleTimeWhereInput, skip:number, take: number }) {
        const prisma = new PrismaClient();
        return prisma.scheduleTime.findMany({ 
            where:filter,
            orderBy: { createAt:"asc" },
            skip,
            take
        });
    }

    public async updateScheduleTime({ data, filter }: { data: Prisma.ScheduleTimeUpdateInput, filter: Prisma.ScheduleTimeWhereUniqueInput }) {
        const prisma = new PrismaClient();
        return prisma.scheduleTime.update({ data, where:filter });
    }
    
    public async deleteAdress({ id }: { id: string }) {
        const prisma = new PrismaClient();
        return prisma.scheduleTime.update({ where: {id}, data:{isDelete:true} });
    }
}
