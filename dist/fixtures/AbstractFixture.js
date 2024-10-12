"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const Kernel_1 = __importDefault(require("../Kernel"));
class AbstractFixture extends Kernel_1.default {
    constructor(prisma = new client_1.PrismaClient()) {
        super();
        this.prisma = prisma;
    }
    GenerateNumber(len) {
        let result = "";
        for (let i = 0; i < len; i++) {
            // Generamos un número aleatorio entre min y max
            const numeroAleatorio = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
            result += numeroAleatorio;
        }
        return result;
    }
    SelectMinMax({ min, max }) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    CodePhone({}) {
        const codes = [`0412`, `0414`, `0416`, `0424`, `0426`];
        return codes;
    }
    HostEmail({}) {
        const host = [`gmail.com`, `hotmail.com`, `oulock.com`];
        return host;
    }
    Address() {
        return [`San Juan`, `Cantagallo`, `Casorla`, `Rivas`, `Monagas`];
    }
    Name({}) {
        const names = [`Josefina`, `Ivón`, `Luisa`, `Romelia`, `Valeria`, `Vanessa`, `Ana`, `José`, `Javier`, `Luis`, `Romulo`, `Rodrigo`, `Maximo`, `Armando`, `Richard`];
        return names;
    }
    Lastnames({}) {
        const lastnames = [`Hernandez`, `Rojas`, `Rivas`, `Colmenares`, `Torres`, `Valeria`, `Rito`, `Perez`, `Maduro`];
        return lastnames;
    }
}
exports.default = AbstractFixture;
