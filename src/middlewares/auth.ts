import { NextFunction } from "express";

export const OnSession = function(req: any, res: any, next: NextFunction) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash("err", "Debes iniciar sessión.");
        res.redirect("/login");
    }
};

export const OffSession = function(req: any, res: any, next: NextFunction) {
    if (!req.isAuthenticated()) {
        next();
    } else {
        // req.flash("err", "No puedes visitar esa pagina.");
        res.redirect("/dashboard");
    }
};

export const OnDoctor = function(req: any, res: any, next: NextFunction) {
    if (req.user.role === `DOCTOR`) {
        next();
    } else {
        req.flash("err", "No eres un doctor.");
        res.redirect("/dashboard");
    }
}

export const OnAdmin = function(req: any, res: any, next: NextFunction) {
    if (req.user.role === `ADMIN`) {
        next();
    } else {
        req.flash("err", "No eres un doctor.");
        res.redirect("/dashboard");
    }
}

export const OnAdminORDoctor = function(req: any, res: any, next: NextFunction) {
    if (req.user.role === `ADMIN` || req.user.role === `DOCTOR`) {
        next();
    } else {
        req.flash("err", "No eres un doctor.");
        res.redirect("/dashboard");
    }
}

