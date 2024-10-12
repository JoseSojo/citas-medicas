"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Kernel_1 = __importDefault(require("../Kernel"));
const NotificationModel_1 = __importDefault(require("../model/user/notification/NotificationModel"));
class AbstractController extends Kernel_1.default {
    constructor() {
        super();
        this.router = (0, express_1.Router)();
        this.notification = new NotificationModel_1.default();
    }
}
exports.default = AbstractController;
