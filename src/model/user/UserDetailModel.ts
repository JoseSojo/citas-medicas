import { Prisma, PrismaClient } from "@prisma/client";
import AbstractModel from "../AbstractModel";

export default class UserDetailSubModel extends AbstractModel {

    constructor () {
        super();
    }

    public async createUserDetail({ data }: { data: Prisma.UserDetailCreateInput }) {
        const prisma = new PrismaClient();
        return prisma.userDetail.create({ data });
    }

    public async findUserDetail({ filter }: { filter: Prisma.UserDetailWhereInput }) {
        const prisma = new PrismaClient();
        return prisma.userDetail.findFirst({ 
            where:filter,
            include: {
                photoReference: true,
                userReference: {
                    include: {
                        speciality: true,
                        schedule: true,
                    }
                }
            }
        });
    }

    public async findManyUserDetail({ filter, skip, take }: { filter: Prisma.UserDetailWhereInput, skip:number, take: number }) {
        const prisma = new PrismaClient();
        return prisma.userDetail.findMany({ 
            where:filter,
            orderBy: { createAt:"asc" },
            skip,
            take
        });
    }

    public async updateUserDetail({ data, filter }: { data: Prisma.UserDetailUpdateInput, filter: Prisma.UserDetailWhereUniqueInput }) {
        const prisma = new PrismaClient();
        return prisma.userDetail.update({ data, where:filter });
    }
    
    public async deleteAdress({ id }: { id: string }) {
        const prisma = new PrismaClient();
        return prisma.userDetail.update({ where: {id}, data:{isDelete:true} });
    }
}
