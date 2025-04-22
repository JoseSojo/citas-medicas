import { Prisma, PrismaClient } from "@prisma/client";
import AbstractModel from "../AbstractModel";

export default class UniversityModel extends AbstractModel {

    constructor () {
        super();
    }

    
    public async createUniversity({ data }: { data: Prisma.UniversityCreateInput }) {
        const prisma = new PrismaClient();
        const result = await prisma.university.create({ data, include:{ withAddress: { include:{ adressReference:true } } } });
        return result;
    }

    public async findUniversity({ filter }: { filter: Prisma.UniversityWhereInput }) {
        const prisma = new PrismaClient();
        return await prisma.university.findFirst({ 
            where:filter, 
            include: {
                _count: true,
                createReference: true,
                withAddress: {
                    include: {
                        adressReference: true,
                    },
                    skip: 0,
                    take: 1
                }
            }
        });
    }

    public async countUniversityBy({filter}: { filter: Prisma.UniversityWhereInput }) {
        const prisma = new PrismaClient();
        return await prisma.university.count({ where:filter });
    }

    public async findManyUniversity({ filter, skip, take }: { filter: Prisma.UniversityWhereInput, skip:number, take: number }) {
        const prisma = new PrismaClient();
        return await prisma.university.findMany({ 
            where:filter,
            orderBy: { createAt:"asc" },
            include: {
                _count: true,
                createReference: true,
                withAddress: {
                    include: { adressReference: true }
                },
            },
            skip,
            take
        });
    }

    public async updateUniversity({ data, filter }: { data: Prisma.UniversityUpdateInput, filter: Prisma.UniversityWhereUniqueInput }) {
        const prisma = new PrismaClient();
        return await prisma.university.update({ data, where:filter });
    }
    
    public async deleteUniversity({ id }: { id: string }) {
        const prisma = new PrismaClient();
        return await prisma.university.update({ where: {id}, data:{isDelete:true} });
    }
}
