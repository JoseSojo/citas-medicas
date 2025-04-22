import { PrismaClient } from "@prisma/client";
import Kernel from "../Kernel";

export default class AbstractFixture extends Kernel {

    constructor(
        private prisma = new PrismaClient()
    ) {
        super();
    }

    public GenerateNumber(len: number) {
        let result = "";
        for (let i = 0; i < len; i++) {
            // Generamos un número aleatorio entre min y max
            const numeroAleatorio = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
            result += numeroAleatorio;
        }
        return result;
    }

    public SelectMinMax({min, max}:{min:number,max:number}) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public CodePhone({}:{}) {
        const codes = [`0412`,`0414`,`0416`,`0424`,`0426`]
        return codes;
    }

    public HostEmail({}:{}) {
        const host = [`gmail.com`,`hotmail.com`,`oulock.com`]
        return host;
    }

    public Address() {
        return [`San Juan`, `Cantagallo`,`Casorla`,`Rivas`,`Monagas`];
    }

    public Name({}:{}) {
        const names = [`Josefina`,`Ivón`,`Luisa`,`Romelia`,`Valeria`,`Vanessa`,`Ana`,`José`,`Javier`,`Luis`,`Romulo`,`Rodrigo`,`Maximo`,`Armando`,`Richard`];
        return names;
    }

    public Lastnames({}:{}) {
        const lastnames = [`Hernandez`,`Rojas`,`Rivas`,`Colmenares`,`Torres`,`Valeria`,`Rito`,`Perez`,`Maduro`];
        return lastnames;
    }
}
