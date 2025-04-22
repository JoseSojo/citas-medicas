import { MONTH_STRUCT, ROLES, STATUS } from "./types/app";

class Kernel {

    constructor() {}

    public getRoles(): ROLES[] {
        return [`ADMIN`,"DOCTOR","PACIENTE"];
    }

    public getStatus(): STATUS[] {
        return [`CANCELADA`,`FINALIZADO`,`REGISTRADO`,`APROBADO`];
    }

    public getStatusEnable() {
        return [`ACTIVADO`,`DESACTIVADO`]
    }

    public getMonths(num: number): MONTH_STRUCT | MONTH_STRUCT[] {
        const month: MONTH_STRUCT[] = [
            {name:`ENERO`,      label: `ENE`}, 
            {name:`FEBRERO`,    label: `FEB`}, 
            {name:`MARZO`,      label: `MAR`},
            {name:`ABRIL`,      label: `ABR`},
            {name:`MAYO`,       label: `MAY`},
            {name:`JUNIO`,      label: `JUN`},
            {name:`JULIO`,      label: `JUL`},
            {name:`AGOSTO`,     label: `AGO`},
            {name:`SEPTIEMBRE`, label: `SEP`},
            {name:`OCTUBRE`,    label: `OCT`},
            {name:`NOVIEMBRE`,  label: `NOV`},
            {name:`DICIEMBRE`,  label: `DIC`}
        ];

        if(num) return month[num];

        return month;
    }

    public getAllMonths(): MONTH_STRUCT[] {
        const month: MONTH_STRUCT[] = [
            {name:`ENERO`,      label: `ENE`}, 
            {name:`FEBRERO`,    label: `FEB`}, 
            {name:`MARZO`,      label: `MAR`},
            {name:`ABRIL`,      label: `ABR`},
            {name:`MAYO`,       label: `MAY`},
            {name:`JUNIO`,      label: `JUN`},
            {name:`JULIO`,      label: `JUL`},
            {name:`AGOSTO`,     label: `AGO`},
            {name:`SEPTIEMBRE`, label: `SEP`},
            {name:`OCTUBRE`,    label: `OCT`},
            {name:`NOVIEMBRE`,  label: `NOV`},
            {name:`DICIEMBRE`,  label: `DIC`}
        ];
        return month;
    }

    public nativeMediaSocial() {
        return [
            {
                name:`Facebook`,
                linkSource:`/image/social/fb.svg`
            },
            {
                name:`Instragram`,
                linkSource:`/image/social/ins.svg`
            },
            {
                name:`Linkein`,
                linkSource:`/image/social/link.svg`
            },
            {
                name:`Pinterest`,
                linkSource:`/image/social/pin.svg`
            },
            {
                name:`Tiktok`,
                linkSource:`/image/social/tiktok.svg`
            },

            {
                name:`Threads`,
                linkSource:`/image/social/thre.svg`
            },

            {
                name:`Telegram`,
                linkSource:`/image/social/tlg.svg`
            },
            {
                name:`Whatsapp`,
                linkSource:`/image/social/ws.svg`
            },
        ]
    }

    public getDays() {
        return [`Lunes`,`Martes`,`Miercoles`,`Jueves`,`Viernes`,`Sábado`,`Domingo`];
    }
}

export default Kernel;
