"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDirecciónFrom = exports.CreateAddressFrom = void 0;
exports.CreateAddressFrom = {
    action: `/address/create`,
    title: `Agregar Dirección`,
    method: `POST`,
    submit: {
        text: `agregar`,
        ico: `bi bi-send-fill`
    },
    class: ``,
};
const UpdateDirecciónFrom = (id) => {
    return {
        action: `/address/${id}/update`,
        title: `Actualizar Dirección`,
        method: `POST`,
        submit: {
            text: `actualizar`,
            ico: `bi bi-send-fill`
        },
        class: ``,
    };
};
exports.UpdateDirecciónFrom = UpdateDirecciónFrom;
