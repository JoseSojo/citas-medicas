"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers = {
    isHistoryDelete(history, options) {
        console.log(history);
        if (history.description.includes(`liminaci`)) {
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
    isAdmin(user, options) {
        return user.role === `ADMIN` ? options.fn(this) : null;
    },
    isDoctor(user, options) {
        return user.role === `DOCTOR` ? options.fn(this) : null;
    },
    isValid(op1, op2, options) {
        return op1 == op2 ? options.fn(this) : null;
    },
    isPatient(user, options) {
        return user.role === `PACIENTE` ? options.fn(this) : null;
    },
    workAddress(address, options) {
    },
    propietaryNotification(id, notification, options) {
        if (notification.fromId === id || notification.toId === id)
            return options.fn(true);
    },
    badgeStatus(status, options) {
        const color = status == "APROVADA" ? `#03346E`
            : status == "FINALIZADO" ? `#387F39`
                : status == "CANCELADA" ? `#3C3D37`
                    : status == "REGISTRADO" ? `#7FA1C3`
                        : `#E7E8D8`;
        const cls = `padding:3px 8px;font-family: monospace ;font-size:14px;border-radius:7px; background: ${color}; color:#f2f2f2;text-shadow: 0 0 2px #212529;`;
        return `
            <span style="${cls}">
                ${status}
            </span>
        `;
    },
    cardDashboard(obj, options) {
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
    itemQuoteStatus(obj, options) {
        return `
            <a href="${obj.link}" class="mb-2 d-flex justify-content-between align-items-center btn btn-light font-weight-bold text-gray-800">
                <span>${obj.title}</span>
                <span>${obj.count}</span>
            </a>
        `;
    },
    createAsingDay(day) {
        return `
            <h1>${day}</h1>
        `;
    }
};
exports.default = Helpers;
