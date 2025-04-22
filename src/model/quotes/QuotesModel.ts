import { Prisma, PrismaClient } from "@prisma/client";
import AbstractModel from "../AbstractModel";

export default class QuotesSubModel extends AbstractModel {

    constructor () {
        super();
    }

    public async createQuotes({ data }: { data: Prisma.QuotesCreateInput }) {
        const prisma = new PrismaClient();
        return prisma.quotes.create({ data, include:{doctorReference:true} });
    }

    public async findQuotes({ filter }: { filter: Prisma.QuotesWhereInput }) {
        const prisma = new PrismaClient();
        return prisma.quotes.findFirst({ 
            where:filter,
            include: {
                doctorReference: true,
                patientReference: true,
                quoteDetailReference: true,
            }
        });
    }

    public async countQuotes({ filter }: { filter: Prisma.QuotesWhereInput }) {
        const prisma = new PrismaClient();
        return prisma.quotes.count({ 
            where:filter
        });
    }

    public async findManyQuotes({ filter, skip, take }: { filter: Prisma.QuotesWhereInput, skip:number, take: number }) {
        const prisma = new PrismaClient();
        return prisma.quotes.findMany({ 
            where:filter,
            orderBy: { createAt:"asc" },
            skip,
            take,
            include: {
                doctorReference: true,
                patientReference: true,
                quoteDetailReference: true
            }
        });
    }

    public async updateQuotes({ data, filter }: { data: Prisma.QuotesUpdateInput, filter: Prisma.QuotesWhereUniqueInput }) {
        const prisma = new PrismaClient();
        return prisma.quotes.update({ data, where:filter });
    }
    
    public async deleteAdress({ id }: { id: string }) {
        const prisma = new PrismaClient();
        return prisma.quotes.update({ where: {id}, data:{isDelete:true} });
    }
}
