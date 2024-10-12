import { Prisma, PrismaClient } from "@prisma/client";
import AbstractModel from "../AbstractModel";

class UserModel extends AbstractModel {

    constructor() {
        super();
    } 

    public async getYears() {
        const prisma = new PrismaClient();
        const years = await prisma.staticticsYear.findMany({
            select: { year:true }
        });
        const newYears: number[] = [];
        years.forEach(({year}:{year:number}) => {
            if (!newYears.includes(year)) {
                newYears.push(year);
            }
        });

        return newYears;
    }

    public async countUser({filter}: {filter:Prisma.UserWhereInput | Prisma.UserWhereInput[]}) {
        const prisma = new PrismaClient();
        return prisma.user.count({
            where: {
                ...filter,
                isDelete: false
            }
        });
    }

    // find one register
    public async findUser({filter}: {filter:Prisma.UserWhereInput}) {
        const prisma = new PrismaClient();
        return prisma.user.findFirst({
            where: {
                ...filter,
                isDelete: false
            },
            include: {
                addressReference: {
                    include: {
                        parentReference: {
                            include:{
                                parentReference:true
                            }
                        }
                    }
                },
                children: true,
                detail: {
                    include: {
                        photoReference: true
                    }
                },
                socialMediaReference: {
                    include: {
                        socialMediaReference: true
                    }
                },
                doctor: true,
                parentReference: true,
                patient: true,
                schedule: {
                    where: {
                        primary: true
                    },
                    include: {
                        detail:{
                            orderBy: { day_index:"asc" },
                            select: {
                                day:true,
                                day_index: true,
                                id: true,
                                isDelete: true,
                                time_end: true,
                                time_start: true
                            }
                        }
                    }
                },
                speciality: {
                    include: {
                        specialityReference: true,
                        universityReference: true

                    }
                },
                _count: true
            }
        });
    }

    // findMany one register
    public async findManyUser({filter,skip,take}: {filter:Prisma.UserWhereInput,skip:number,take:number}) {
        console.log(true, filter);
        const prisma = new PrismaClient();
        return prisma.user.findMany({
            where: {
                ...filter,
                isDelete: false
            },
            orderBy: {createAt:"asc"},
            include: {
                detail: true,
                speciality: {
                    include: {
                        specialityReference: true
                    }
                },
                schedule: {
                    where: { primary: true }
                },
                addressReference: true,
                _count: true
            },
            skip,
            take
        });
    }

    // findMany one register
    public async findForReport({filter,skip,take}: {filter:Prisma.UserWhereInput,skip:number,take:number}) {
        const prisma = new PrismaClient();
        return prisma.user.findMany({
            where: {
                ...filter,
                isDelete: false
            },
            orderBy: {createAt:"asc"},
            include: {
                detail: true,
                speciality: {
                    include: {
                        specialityReference: true
                    }
                },
                addressReference: true,
                _count: true
            },
            skip,
            take
        });
    }

    public async createUser({data}: {data:Prisma.UserCreateInput}) {
        const prisma = new PrismaClient();

        return prisma.user.create({ 
            data: {
                ...data,
                password: await this.HashPassword({password:data.password})
            }
        });
    }

    public async deleteUser({id}: {id:string}) {
        const prisma = new PrismaClient();
        return prisma.user.update({
            where: { id },
            data: {
                isDelete: true
            }
        })
    }

    public async connectSpeciality({user,speciality,university,date}:{user:string,speciality:string,university:string,date:string}) {
        const prisma = new PrismaClient();
        return prisma.doctroWithSpeciality.create({ data:{
            specialityReference: { connect:{id:speciality} },
            userReference: { connect: { id:user } },
            universityReference: { connect:{id:university} },
            date
        } })
    }

    public async getDoctorForPatient({}: {}) {
        const prisma = new PrismaClient();
        return prisma.user.findMany({
            where: {
                AND: [
                    { isDelete: true },
                ]
            }
        })
    }

    public async updateUser({id, data}: {id:string,data:Prisma.UserUpdateInput}) {
        const prisma = new PrismaClient();
        return prisma.user.update({
            where: {id},
            data: data
        })
    }
}

export default UserModel;
