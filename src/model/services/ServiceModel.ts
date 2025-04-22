import { Prisma, PrismaClient } from "@prisma/client";
import AbstractModel from "../AbstractModel";

export default class ServicesModel extends AbstractModel {

    constructor () {
        super();
    }

    public async createServices({ data }: { data: Prisma.ServicesCreateInput }) {
        const prisma = new PrismaClient();
        return prisma.services.create({
            data
        });
    }

    public async findServices({ filter }: { filter: Prisma.ServicesWhereInput }) {
        const prisma = new PrismaClient();
        return prisma.services.findFirst({ 
            where:filter,
        });
    }

    public async countServices({ filter }: { filter: Prisma.ServicesWhereInput }) {
        const prisma = new PrismaClient();
        return prisma.services.count({ 
            where:filter
        });
    }

    public async findManyServices({ filter, skip, take }: { filter: Prisma.ServicesWhereInput, skip:number, take: number }) {
        const prisma = new PrismaClient();
        return prisma.services.findMany({ 
            where:filter,
            orderBy: { createAt:"asc" },
            skip,
            take,
        });
    }

    public async updateServices({ data, filter }: { data: Prisma.ServicesUpdateInput, filter: Prisma.ServicesWhereUniqueInput }) {
        const prisma = new PrismaClient();
        return prisma.services.update({ data, where:filter });
    }
    
    public async deleteAdress({ id }: { id: string }) {
        const prisma = new PrismaClient();
        return prisma.services.update({ where: {id}, data:{isDelete:true} });
    }
}
