import { Request, Response } from "express";
import AbstractController from "../AbstractController";
import { PrismaClient } from "@prisma/client";
import GraphicService from "../../service/GraphicService";
import { GraphicPayload } from "../../types/response";
import UserModel from "../../model/user/UserModel";

export default class ApiGraphicController extends AbstractController {

    constructor () {
        super();

    }

    public async GenereteGraphic(req:Request, res:Response) {
        const prisma = new PrismaClient();
        const userModel = new UserModel();

        const { type, userId, role } = req.query as { type:GraphicPayload, userId?:string, role?:`DOCTOR`|`PACIENTE` };
        const service = new GraphicService();

        if(userId && role) {
            const userFound = await userModel.findUser({ filter:{ id:userId } });
            if(role === "DOCTOR") {
                if(type === "spaceCiteQuoteYear") {
                    const {year} = req.query;
                    const {label,data} = await service.YearGraphicQuote({year,id:userId,ObjectName:`DOCTOR`});
                    return res.status(200).json({label,data});
                } else if(type === "spaceCiteQuoteMonth") {
                    const {month} = req.query;
                    const {label,data} = await service.MonthGraphicQuote({month,id:userId});
                    return res.status(200).json({label,data});
                }
                
                const {data,label} = await service.PieQuoteDoctorStatusChart({ id:userId });
                return res.status(200).json({label,data});
            } else {
                if(type === "spaceCiteQuoteYear") {
                    const {year} = req.query;
                    const {label,data} = await service.YearGraphicQuote({year,id:userId,ObjectName:`PACIENTE`});
                    return res.status(200).json({label,data});
                } else if(type === "spaceCiteQuoteMonth") {
                    const {month,year} = req.query;
                    const {label,data} = await service.MonthGraphicQuote({month,id:userId});
                    return res.status(200).json({label,data});
                }
                
                const {data,label} = await service.PieQuotePatientStatusChart({ id:userId });
                return res.status(200).json({label,data});
            }
        }

        if(type === "spaceCiteQuoteStatus") {
            const {label,data} = await service.PieQuoteStatusChart({id:userId});
            return res.status(200).json({label,data});
        }
        else if(type === "spaceCiteQuoteYear") {
            const {year} = req.query;
            const {label,data} = await service.YearGraphicQuote({year,id:userId});
            return res.status(200).json({label,data});
        }
        else if(type === "spaceCiteQuoteMonth") {
            const {month,year} = req.query;
            const {label,data} = await service.MonthGraphicQuote({month,id:userId});
            return res.status(200).json({label,data});
        }

    }

    public loadRoutes() {
        this.router.get(`/api/graphic`, this.GenereteGraphic);

        return this.router;
    } 

}
