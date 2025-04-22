import { Router } from "express";
import Kernel from "../Kernel";
import NotificationModel from "../model/user/notification/NotificationModel";

class AbstractController extends Kernel {

    public router = Router();
    public notification = new NotificationModel();

    constructor() {
        super();
    }

    

}

export default AbstractController;
