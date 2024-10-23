import { Prisma, PrismaClient } from "@prisma/client";
import AbstractModel from "../AbstractModel";

export default class SocialMediaSubModel extends AbstractModel {

    constructor () {
        super();
    }
    

    public async createSocialMedia({ data }: { data: Prisma.SocialMediaCreateInput }) {
        const prisma = new PrismaClient();
        return prisma.socialMedia.create({ data });
    }

    public async findSocialMedia({ filter }: { filter: Prisma.SocialMediaWhereInput }) {
        const prisma = new PrismaClient();
        return prisma.socialMedia.findFirst({ where:filter });
    }

    public async countSocialMedia({ filter }: { filter: Prisma.SocialMediaWhereInput }) {
        const prisma = new PrismaClient();
        return prisma.socialMedia.count({ where:filter });
    }

    public async findManySocialMedia({ filter, skip, take }: { filter: Prisma.SocialMediaWhereInput, skip:number, take: number }) {
        const prisma = new PrismaClient();
        return prisma.socialMedia.findMany({ 
            where:filter,
            include: {
                _count: true,
            },
            orderBy: { createAt:"asc" },
            skip,
            take
        });
    }

    public async updateSocialMedia({ data, filter }: { data: Prisma.SocialMediaCreateInput, filter: Prisma.SocialMediaWhereUniqueInput }) {
        const prisma = new PrismaClient();
        return prisma.socialMedia.update({ data, where:filter });
    }
    
    public async deleteAdress({ id }: { id: string }) {
        const prisma = new PrismaClient();
        return prisma.socialMedia.update({ where: {id}, data:{isDelete:true} });
    }
}
