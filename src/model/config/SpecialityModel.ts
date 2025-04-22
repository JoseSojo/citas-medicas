import { Prisma, PrismaClient } from "@prisma/client";
import AbstractModel from "../AbstractModel";

export default class SpecialitySubModel extends AbstractModel {

    constructor () {
        super();
    }

    
    public async createSpeciality({ data }: { data: Prisma.SpecialityCreateInput }) {
        const prisma = new PrismaClient();
        const result = await prisma.speciality.create({ data });
        return result;
    }

    public async findSpeciality({ filter }: { filter: Prisma.SpecialityWhereInput }) {
        const prisma = new PrismaClient();
        return await prisma.speciality.findFirst({ 
            where:filter, 
            include: {
                _count: true
            }
        });
    }

    public async countSpecialityBy({filter}: { filter: Prisma.SpecialityWhereInput }) {
        const prisma = new PrismaClient();
        return await prisma.speciality.count({ where:filter });
    }

    public async findManySpeciality({ filter, skip, take }: { filter: Prisma.SpecialityWhereInput, skip:number, take: number }) {
        const prisma = new PrismaClient();
        return await prisma.speciality.findMany({ 
            where:filter,
            orderBy: { createAt:"asc" },
            include: {
                speciality: {
                    include: {
                        userReference: true
                    }
                },
            },
            skip,
            take
        });
    }

    public async updateSpeciality({ data, filter }: { data: Prisma.SpecialityCreateInput, filter: Prisma.SpecialityWhereUniqueInput }) {
        const prisma = new PrismaClient();
        return await prisma.speciality.update({ data, where:filter });
    }
    
    public async deleteSpeciality({ id }: { id: string }) {
        const prisma = new PrismaClient();
        return await prisma.speciality.update({ where: {id}, data:{isDelete:true} });
    }
}
