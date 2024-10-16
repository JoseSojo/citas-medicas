import { Request, Response, Router } from "express";
import AbstractController from "../AbstractController";
import { OffSession } from "../../middlewares/auth";
import UserDetailSubModel from "../../model/user/UserDetailModel";
import UserModel from "../../model/user/UserModel";
import SocialMediaSubModel from "../../model/config/SocialMediaModel";
import NotificationModel from "../../model/user/notification/NotificationModel";
import { Prisma, PrismaClient } from "@prisma/client";
import { ad, F } from "@faker-js/faker/dist/airline-BBTAAfHZ";
import SpecialitySubModel from "../../model/config/SpecialityModel";
import AdressSubModel from "../../model/config/AddressSubModel";

export default class PublicController extends AbstractController {

    constructor(
        private prefix = ``
    ) {
        super();
    }

    public async PorfolioRender(req: Request, res: Response) {
        const userInstance = new UserModel();
        const social = new SocialMediaSubModel();
        const { id } = req.query as { id?: string };

        if (!id) {
            req.flash(`err`, `No se pudo obtener el doctor`);
            return res.redirect(`/`);
        }

        const porfolio = userInstance.findUser({ filter: { id: id } });
        const socialMedia = social.findManySocialMedia({ filter: { isDelete: false }, skip: 0, take: 10 });

        const dataReturn = {
            porfolio: await porfolio,
            social: await socialMedia
        }

        return res.render(`p/porfolio.hbs`, dataReturn);
    }

    public async RenderPublic(req: Request, res: Response) {
        // models
        const userModel = new UserModel();
        const specialityMode = new SpecialitySubModel();
        const addressModel = new AdressSubModel();

        console.log(req.query);

        const filter: Prisma.UserWhereInput[] = [];
        const filterText: string[] = [];
        filter.push({ isDelete: false });
        filter.push({ role: `DOCTOR` });

        // filtros
        const speciality = req.query.specialityId ? req.query.specialityId : null;
        const address = req.query.addressId ? req.query.addressId : null;
        const param = req.query.param ? req.query.param : null;
        const schedule = req.query.schedule ? req.query.schedule : null;

        const skip = req.query.skip ? req.query.skip : 0;
        const take = req.query.take ? req.query.take : 10;

        if (speciality) {
            const prisma = new PrismaClient();
            const result = await prisma.doctroWithSpeciality.findMany({ where: { specialityReference: { id: speciality } } });

            const ids = result.map(item => item.userId);

            const currentNewArray: { id: string }[] = [];
            ids.forEach(item => { currentNewArray.push({ id: item }); });

            if (currentNewArray.length > 0) filter.push({ OR: currentNewArray });
            else { filter.push({ ci: `0` }) }
        } else if (param) {
            filter.push({ OR: [{ name: { contains: param } }, { lastname: { contains: param } }, { email: { contains: param } }] });
        }
        else if (address) {

            filter.push({ addressId:address });
        }
        else if (schedule) { }
        else { }

        const count = userModel.countUser({ filter: { AND: filter } });
        const resultPromise = userModel.findManyUser({ filter: { AND: filter }, skip, take });

        return res.render(`p/main.hbs`, {
            list: await resultPromise,
            count: await count,
            filterText
        });
    }

    public async RenderAddress(req: Request, res: Response) {
        const userModel = new UserModel();
        const specialityMode = new SpecialitySubModel();
        const addressModel = new AdressSubModel();

        const param = req.query.param ? req.query.param : ``;

        return res.render(`p/main.hbs`, {
            address: true,
            list: await addressModel.findManyAdress({
                filter: {
                    AND: [
                        { isDelete: false },
                        { description: { contains: param } }
                    ]
                },
                skip: 0,
                take: 100
            }),
            count: await addressModel.countAdressBy({
                filter: {
                    AND: [
                        { isDelete: false },
                        { description: { contains: param } }
                    ]
                }
            })
        });
    }

    public async RenderSpeciality(req: Request, res: Response) {

        const userModel = new UserModel();
        const specialityMode = new SpecialitySubModel();
        const addressModel = new AdressSubModel();
        const param = req.query.param ? req.query.param : ``;

        return res.render(`p/main.hbs`, {
            speciality: true,
            list: await specialityMode.findManySpeciality({
                filter: {
                    AND: [
                        { isDelete: false },
                        { name: { contains: param } }
                    ]
                },
                skip: 0,
                take: 100
            }),
            count: await specialityMode.countSpecialityBy({
                filter: {
                    AND: [
                        { isDelete: false },
                        { name: { contains: param } }
                    ]
                }
            })
        });
    }

    public async RenderMain(req: Request, res: Response) { }

    public async RenderLogin(req: Request, res: Response) {
        return res.render(`p/login.hbs`);
    }

    public async RenderRegister(req: Request, res: Response) {
        return res.render(`p/register.hbs`);
    }

    public loadRoutes() {
        this.router.get(`${this.prefix}/`, OffSession, this.RenderPublic);
        this.router.get(`${this.prefix}/p/address`, OffSession, this.RenderAddress);
        this.router.get(`${this.prefix}/p/speciality`, OffSession, this.RenderSpeciality);
        this.router.get(`${this.prefix}/p/porfolio`, OffSession, this.PorfolioRender);
        this.router.get(`${this.prefix}/login`, OffSession, this.RenderLogin);
        this.router.get(`${this.prefix}/register`, OffSession, this.RenderRegister);

        return this.router;
    }
}
