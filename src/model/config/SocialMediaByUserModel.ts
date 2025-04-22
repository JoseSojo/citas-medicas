import { Prisma, PrismaClient } from "@prisma/client";
import AbstractModel from "../AbstractModel";
export default class SocialMediaByUserModel extends AbstractModel {

    constructor () {
        super();
    }

    
    public async createOrUpdate({ data }: { data: {link:string, username:string, socialId:string, userId:string} }) {
        const prisma = new PrismaClient();
        const socialFound = await prisma.socialMediaByUser.findFirst({ 
            where: { 
                AND:[
                    {socialMediaId:data.socialId},
                    {userId:data.userId}
                ] 
            } 
        });

        if(socialFound) {
            return prisma.socialMediaByUser.update({ where: { id:data.socialId}, data:{ link:data.link,username:data.username } });
        }

        return prisma.socialMediaByUser.create({
            data: {
                link: data.link,
                username: data.username,
                socialMediaReference: { connect: { id:data.socialId } },
                userReference: { connect: { id:data.socialId } },
            }
        });
    }

    public async findTest({ socialId,userId }: { socialId:string, userId:string }) {
        const prisma = new PrismaClient();
        return await prisma.socialMediaByUser.findFirst({ 
            where: { 
                AND:[
                    {socialMediaId:socialId},
                    {userId:userId}
                ] 
            } 
        });
    }

    public async updateTest({ data,id }: { data: {link:string, username:string}, id:string }) {
        const prisma = new PrismaClient();
        return prisma.socialMediaByUser.update({
            data: {
                link: data.link,
                username: data.username,
            },
            where: { id }
        });
    }

    public async deleteSocial({ id }: { id:string }) {
        const prisma = new PrismaClient();
        return prisma.socialMediaByUser.delete({ where:{id} });
    }

}
