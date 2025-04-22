import { Prisma, PrismaClient } from "@prisma/client";
import UserModel from "../../user/UserModel";

export default class NotificationModel extends UserModel {

    constructor () {
        super();
    }

    public async GetNowNotification({ id }:{ id:string }) {
        return this.findManyNotification({ filter:{ AND:[{isDelete:false},{OR:[{fromId:id},{toId:id}]}] }, skip:0, take:5, order:{ read:"asc" } });
    }

    public async createNotification({ data }: { data: Prisma.NotificationCreateInput }) {
        const prisma = new PrismaClient();
        return prisma.notification.create({ data });
    }

    public async findNotification({ filter }: { filter: Prisma.NotificationWhereInput }) {
        const prisma = new PrismaClient();
        return prisma.notification.findFirst({ where:filter, include: { fromReference:true,toReference:true } });
    }

    public async countNotification({ filter }: { filter: Prisma.NotificationWhereInput }) {
        const prisma = new PrismaClient();
        return prisma.notification.count({ where:filter });
    }

    public async findManyNotification({ filter, skip, take, order }: { order?: Prisma.NotificationOrderByWithRelationInput, filter: Prisma.NotificationWhereInput, skip:number, take: number }) {
        const prisma = new PrismaClient();
        return prisma.notification.findMany({ 
            where:filter,
            orderBy: { createAt:"asc" },
            skip,
            take,
            include: {
                fromReference: true,
                toReference: true,
            }
        });
    }

    public async updateNotification({ data, filter }: { data: Prisma.NotificationUpdateInput, filter: Prisma.NotificationWhereUniqueInput }) {
        const prisma = new PrismaClient();
        return prisma.notification.update({ data, where:filter });
    }
    
    public async deleteNotification({ id }: { id: string }) {
        const prisma = new PrismaClient();
        return prisma.notification.update({ where: {id}, data:{isDelete:true} });
    }
}
