import { Request, Response } from "express";
import { OnDoctor, OnSession } from "../../../middlewares/auth";
import AbstractController from "../../AbstractController";
import ScheduleSubModel from "../../../model/schedule/ScheduleModel";
import ScheduleDetailModel from "../../../model/schedule/ScheduleDetailModel"; 
import { Prisma } from "@prisma/client";
import { getDays, getStatusEnable } from "../../../util";
import NotificationModel from "../../../model/user/notification/NotificationModel";

// HORARIOS CONTROLLER BY DOCTOR
export default class DoctorScheduleControlelr extends AbstractController {

    constructor() {
        super();
    }

    public async DoctorSchedule(req: Request, res: Response) {
        const noti = new NotificationModel();
        const instance = new ScheduleSubModel();

        const { param, status } = req.query;
        let queryString = ``;
        const user = req.user as any;

        const take = req.query.take ? Number(req.query.take) : 10;
        const skip = req.query.skip ? Number(req.query.skip) : 0;

        const filter: Prisma.ScheduleWhereInput[] = [];
        filter.push({ userId: user.id });

        if(param) {
            queryString += `param=${param}`;
            filter.push({ description: { contains:param } });
        }

        if(status) {
            queryString += `param=${param}`;
            filter.push({ description: { contains:param } });
        }

        const listPromise = instance.findManySchedule({
            filter: { AND:[{ isDelete:false },{OR:filter}] },
            skip,
            take,
        });

        const countPromise = instance.countSchedule({ filter:{AND:[{isDelete:false},{OR:filter}]} });

        const returnData = {
            titlePag: `Horarios`,
            notFoundMessage: `No hay horarios`,
            labels: [`Activo`,`Descripción`,``],
            list: [] as any,
            countRender: ``,
            foundNext: false,
            urlNext: ``,
            foundPrevious: false,
            urlPrevious: ``,
            status: getStatusEnable(),
            days: getDays,
            notifications: await noti.GetNowNotification({ id:user.id }),

            filter: {
                skip,
                take,
                param
            }
        }

        const list = await listPromise;
        const count = await countPromise;

        // next
        returnData.foundNext = count - skip > 10 ? true : false;
        returnData.urlNext = `/doctor/schedule/?skip=${skip+10}&take=${take}`;

        // previus
        returnData.foundPrevious = take <= skip ? true : false; 
        returnData.urlPrevious = `/doctor/schedule/?skip=${skip-10}&take=${take}`;

        if(queryString) {
            returnData.urlNext += `&${queryString}`;
            returnData.urlPrevious += `&${queryString}`;
        }

        returnData.list = list;
        returnData.countRender = `${count - skip < 11 ? count : skip+take}/${count}`;

        return res.render(`s/doctor/schedule/list.hbs`, returnData);
    }

    public async DoctorCreateSchedule(req: Request, res: Response) {
        const {description, day_name, time_start, time_end} = req.body;
        const user = req.user as any;
        const instance = new ScheduleSubModel();
        const detailInstance = new ScheduleDetailModel();

        const dataCreate: Prisma.ScheduleCreateInput = {
            description,
            user: { connect:{ id:user.id } }
        }

        const createResult = await instance.createSchedule({ data:dataCreate });

        day_name.forEach(async (name: string, i: number) => {
            await detailInstance.createScheduleTime({
                data: {
                    day: name,
                    day_index: i,
                    scheduleReference: { connect: {id:createResult.id} },
                    time_start: time_start[i] ? time_start[i] : ``,
                    time_end: time_end[i] ? time_end[i] : ``
                }
            })
        })

        return res.redirect(`/doctor/schedule`);
    }

    public async DoctorUniqueShedule(req: Request, res: Response) {
        const id = req.params.id as string;
        const instance = new ScheduleSubModel();
        const noti = new NotificationModel();
        const user = req.user as any;

        const data = instance.findSchedule({ filter:{id} });

        const dataReturn = {
            data: [] as any,
            form: {} as any,
            notifications: await noti.GetNowNotification({ id:user.id }),
        }

        dataReturn.data = await data;
        return res.render(`s/doctor/schedule/unique.hbs`, dataReturn);
    }

    public async ToPrimary(req: Request, res: Response) {
        const id = req.params.id as string;
        const instance = new ScheduleSubModel();
        const user = req.user as any;

        try {
            const sing = await instance.singPrimary({ id, user:user.id });
            await instance.CreateHistory({ des:`Horario a principal ${sing.description} del doctor: ${user.name} ${user.lastname}`, name:`user`, userId:user.id });
            return res.redirect(`/doctor/schedule`);
        } catch (error) {
            return res.redirect(`/doctor/schedule`);
        }

        return res.redirect(`/doctor/schedule`);
    }

    public async DoctoScheduleDetailUpdate(req: Request, res: Response) {
        const id = req.params.id;
        const { start_payload, time_start, end_payload, time_end } = req.body as { start_payload:string, time_start:string, end_payload:string, time_end:string };
        const instance = new ScheduleDetailModel();
        const user = req.user as any;

        const result = await instance.updateScheduleTime({
            filter: { id },
            data: {
                time_start: time_start ? time_start : ``,
                end_payload: end_payload ? end_payload : ``,
                start_payload: start_payload ? start_payload : ``,
                time_end: time_end ? time_end : ``,
            }
        });

        await instance.CreateHistory({ des:`Actualización de horario del doctor: ${user.name} ${user.lastname}`, name:`user`, userId:id });

        return res.redirect(`/doctor/schedule/`);
    }

    public loadRoutes () {
        this.router.get(`/doctor/schedule`, OnSession, OnDoctor, this.DoctorSchedule);
        this.router.get(`/doctor/schedule/:id`, OnSession, OnDoctor, this.DoctorUniqueShedule);
        this.router.get(`/doctor/schedule/:id/primary`, OnSession, OnDoctor, this.ToPrimary);

        this.router.post(`/doctor/schedule/create`, OnSession, OnDoctor, this.DoctorCreateSchedule);

        this.router.post(`/doctor/schedule/detail/:id/update`, OnSession, OnDoctor, this.DoctoScheduleDetailUpdate);

        return this.router;
    }
} 
