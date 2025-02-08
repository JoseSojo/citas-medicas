import { History } from "@prisma/client";
import { STATUS } from "../../types/app";

const Helpers = {
    isHistoryDelete(history:History, options: any) {
        console.log(history);
        if(history.description.includes(`liminaci`)) {
            return `
                <form method="POST" action="/history/restore">
                    <input type="hidden" value="${history.objectName}" name="name" />
                    <input type="hidden" value="${history.objectId}" name="id" />
                    <button type="submit" class="btn btn-sm btn-warning">
                        <i class="bi bi-warning" style="font-size:12px;font-weight:700">Recuperar</i>
                    </button>
                </form>
            `;
        }
    },

    isAdmin (user: any, options: any) {
        return user.role === `ADMIN` ? options.fn(this) : null;
    },

    isDoctor (user: any, options: any) {
        return user.role === `DOCTOR` ? options.fn(this) : null;
    },

    isValid (op1: any, op2:any, options: any) {
        return op1 == op2 ? options.fn(this) : null;
    },

    isPatient (user: any, options: any) {
        return user.role === `PACIENTE` ? options.fn(this) : null;
    },

    workAddress (address: any, options: any) {
        
    },

    propietaryNotification(id:string, notification: {toId:string,fromId:string}, options: any) {
        if (notification.fromId === id || notification.toId === id) return options.fn(true);
    },

    badgeStatus(status: STATUS, options: any) {

        const color = 
            status == "APROVADA" ? `#03346E`
            : status == "FINALIZADO" ? `#387F39`
            : status == "CANCELADA" ? `#3C3D37`
            : status == "REGISTRADO" ? `#7FA1C3` 
            : `#E7E8D8`;

        const cls = `padding:3px 8px;font-family: monospace ;font-size:14px;border-radius:7px; background: ${color}; color:#f2f2f2;text-shadow: 0 0 2px #212529;`

        return `
            <span style="${cls}">
                ${status}
            </span>
        `;

    },

    cardDashboard(obj: {title:string, count:string, link: string, color:string, ico: string}, options: any) {
        return `
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card ${obj.color} shadow h-100 py-2">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <a href="${obj.link}" class="text-xs font-weight-bold text-primary text-uppercase mb-1">${obj.title}</a>
                                
                                <div class="h5 mb-0 font-weight-bold text-gray-800">${obj.count}</div>
                            </div>
                            <div class="col-auto">
                                <i class="bi ${obj.ico} text-gray-300 text-xl" style="font-size:35px"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    itemQuoteStatus(obj: { title:string,count:number,link:string }, options: any) {
        return `
            <a href="${obj.link}" class="mb-2 d-flex justify-content-between align-items-center btn btn-light font-weight-bold text-gray-800">
                <span>${obj.title}</span>
                <span>${obj.count}</span>
            </a>
        `;
    },

    createAsingDay(day: string) {

        return `
            <h1>${day}</h1>
        `;

    }
}

export default Helpers;
