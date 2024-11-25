import flash from "connect-flash";
import express, { Application, NextFunction, Request, Response, Router } from "express";
import exphbs from "express-handlebars";
import session from "express-session";
import methodOverride from "method-override";
import morgan from "morgan";
import path from "path";
import passport from "passport";
import helpersHandlebars from "./config/helpers/helpers";
import Kernel from "./Kernel"
import "./config/passport";

// ROUTES
import Public from "./controller/P/PublicController";
import Auth from "./controller/S/AuthController";
import Dashboard from "./controller/S/DashboardController";
import User from "./controller/S/UserController";
import Address from "./controller/S/Address/AddressController";
import SocialByUser from "./controller/S/Social/SocialByUserController";
import SocialMedia from "./controller/S/Social/SocialMediaController";
import Speciality from "./controller/S/Speciality/SpecialityController";
import Profile from "./controller/S/ProfileController";
import Doctor from "./controller/S/Doctor/DoctorController";
import DoctorScedule from "./controller/S/Doctor/DoctorScheduleController";
import DoctorQuote from "./controller/S/Doctor/DoctorQuoteController";
import DoctorPatient from "./controller/S/Doctor/DoctorPatientController";
import Schedule from "./controller/S/Schedule/ScheduleController";
import NotificationController from "./controller/S/Notification/NotificationController";
import PatientControlelr from "./controller/S/Patient/PatientController";
import PatientQuoteController from "./controller/S/Patient/PatientQuoteController";
import PorfolioController from "./controller/S/PorfolioController";
import ReportController from "./controller/S/Report/ReportController";
import ApiGraphicController from "./controller/A/ApiGraphicController";
import UniversityController from "./controller/S/University/UniversityController";
import HistoryController from "./controller/S/HistoryController";
import ServicesControlelr from "./controller/S/Doctor/DoctorServicesController";


class App extends Kernel {

    constructor () {
        super();
    }

    public async Run() {

        const app = express();
        const PORT = process.env.PORT || 8080;

        this.setting(app);
        this.middlewares(app);
        this.static(app);

        this.routes(app);

        app.listen(PORT, () => {
            console.debug(`Server runing in port ${PORT}`);
            console.debug(`Open => http://localhost:${PORT}`);
        });
    }

    private async setting(app: Application) {
        // Set Template engine to handlebars
        app.set("views", path.join(__dirname, "views"));
        app.engine("hbs", exphbs({
        defaultLayout: "main.hbs",
        layoutsDir: path.join(app.get("views"), "layouts"),
        partialsDir: path.join(app.get("views"), "partials"),
        helpers: helpersHandlebars,
        extname: ".hbs"
        }));
        app.set("view engine", "hbs");

        // Settings
        app.use(morgan("dev"));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(methodOverride("_method"));
        app.use(session({
            secret: "cite_medical",
            resave: true,
            saveUninitialized: true
        }));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(flash());
    }

    private async static(app: Application) {
        app.use((req: Request, res: Response, next: NextFunction) => {
            res.locals.user = req.user || null;
            res.locals.succ = req.flash("succ");
              res.locals.err = req.flash("err");
              res.locals.error = req.flash("error");
              next();
        });

        app.use(express.static(path.join(__dirname, "../public")));
        app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
    }

    private async middlewares(app: Application) {}

    private async routes(app: Application) {
        const publicInstance = new Public();
        const authInstance = new Auth();
        const dashboardInstance = new Dashboard();
        const userInstance = new User();
        const addressInstance = new Address();
        const socialByUserInstance = new SocialByUser();
        const socialMediaInstance = new SocialMedia();
        const specialityInstance = new Speciality();
        const profileInstance = new Profile();
        const doctorInstance = new Doctor();
        const doctorScheduleInstance = new DoctorScedule();
        const doctorQuoteInstance = new DoctorQuote();
        const doctorPatientInstance = new DoctorPatient();
        const scheduleInstance = new Schedule();
        const notificationInstance = new NotificationController();
        const patientInstance = new PatientControlelr();
        const patientQuoteInstance = new PatientQuoteController();
        const porfolioInstance = new PorfolioController();
        const reportInstance = new ReportController();
        const universityInstance = new UniversityController();
        const api = new ApiGraphicController();
        const history = new HistoryController();
        const service = new ServicesControlelr();

        app.use(publicInstance.loadRoutes());           // rutas públicas
        app.use(dashboardInstance.loadRoutes());        // rutas panel de control
        app.use(profileInstance.loadRoutes());          // rutas de profile
        app.use(authInstance.loadRoutes());             // rutas de login
        app.use(userInstance.loadRoutes());             // rutas de usuario
        app.use(addressInstance.loadRoutes());          // rutas de direcciones
        app.use(socialByUserInstance.loadRoutes());     // rutas de social by user
        app.use(socialMediaInstance.loadRoutes());      // rutas de social media
        app.use(specialityInstance.loadRoutes());       // rutas de espacialidad
        app.use(doctorInstance.loadRoutes());           // rutas de doctor
        app.use(doctorScheduleInstance.loadRoutes());           // rutas de doctor  -   Horario
        app.use(doctorQuoteInstance.loadRoutes());              // rutas de doctor  -   Citas
        app.use(doctorPatientInstance.loadRoutes());            // rutas de doctor  -   Paciente
        app.use(scheduleInstance.loadRoutes());         // rutas de horarios
        app.use(notificationInstance.loadRoutes());     // rutas notificación
        app.use(patientInstance.loadRoutes());          // rutas paciente
        app.use(patientQuoteInstance.loadRoutes());             // rutas paciente   -   Cita
        app.use(reportInstance.LoadRouters());             // rutas paciente   -   Cita
        app.use(universityInstance.loadRoutes());             // rutas paciente   -   Cita
        app.use(porfolioInstance.loadRoutes());         // rutas portafolio
        app.use(history.loadRoutes());         // rutas portafolio
        app.use(service.loadRoutes());


        app.use(api.loadRoutes());

        app.get(`/logout`, async (req: Request, res: Response) => {
            req.logOut((err) => {
                return res.redirect(`/`);
            });
        })
    }

}

export default App;
