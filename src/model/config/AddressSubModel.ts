import { Prisma, PrismaClient } from "@prisma/client";
import AbstractModel from "../AbstractModel";

export default class AdressSubModel extends AbstractModel {

    constructor () {
        super();
    }


    public async createAdress({ data }: { data: Prisma.AddressCreateInput }) {
        const prisma = new PrismaClient();
        return prisma.address.create({ data });
    }

    public async findAdress({ filter }: { filter: Prisma.AddressWhereInput }) {
        const prisma = new PrismaClient();
        return prisma.address.findFirst({ 
            where:filter,
            include: {
                _count: true,
                parentReference: true,
                children: true
            }
        });
    }

    public async countAdressBy({ filter }: { filter: Prisma.AddressWhereInput }) {
        const prisma = new PrismaClient();
        return prisma.address.count({ where:filter });
    }

    public async findManyAdress({ filter, skip, take }: { filter: Prisma.AddressWhereInput, skip:number, take: number }) {
        const prisma = new PrismaClient();
        return prisma.address.findMany({ 
            where:filter,
            include: {
                _count: true,
                parentReference: {
                    include: {
                        parentReference: true
                    }
                }
            },
            orderBy: { createAt:"asc" },
            skip,
            take
        });
    }

    public async updateAdress({ data, filter }: { data: Prisma.AddressCreateInput, filter: Prisma.AddressWhereUniqueInput }) {
        const prisma = new PrismaClient();
        return prisma.address.update({ data, where:filter });
    }
    
    public async deleteAdress({ id }: { id: string }) {
        const prisma = new PrismaClient();
        return prisma.address.update({ where: {id}, data:{isDelete:true} });
    }
}
