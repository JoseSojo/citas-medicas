import { Prisma, PrismaClient } from "@prisma/client";
import AbstractModel from "../AbstractModel";

export default class QuotesDetailSubModel extends AbstractModel {

    constructor () {
        super();
    }

    public async createQuotesDetail({ data }: { data: Prisma.QuoteDetailCreateInput }) {
        const prisma = new PrismaClient();
        return prisma.quoteDetail.create({ data });
    }

    public async findQuotesDetail({ filter }: { filter: Prisma.QuoteDetailWhereInput }) {
        const prisma = new PrismaClient();
        return prisma.quoteDetail.findFirst({ where:filter, include:{ quote: true } });
    }

    public async findManyQuotesDetail({ filter, skip, take }: { filter: Prisma.QuoteDetailWhereInput, skip:number, take: number }) {
        const prisma = new PrismaClient();
        return prisma.quoteDetail.findMany({ 
            where:filter,
            orderBy: { createAt:"asc" },
            skip,
            take
        });
    }

    public async updateQuotesDetail({ data, filter }: { data: Prisma.QuoteDetailCreateInput, filter: Prisma.QuoteDetailWhereUniqueInput }) {
        const prisma = new PrismaClient();
        return prisma.quoteDetail.update({ data, where:filter });
    }
    
    public async deleteAdress({ id }: { id: string }) {
        const prisma = new PrismaClient();
        return prisma.quoteDetail.update({ where: {id}, data:{isDelete:true} });
    }
}
