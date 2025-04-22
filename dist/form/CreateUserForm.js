"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserFrom = exports.CreateUserFrom = void 0;
exports.CreateUserFrom = {
    action: `/user/create`,
    title: `Crear Usuario`,
    method: `POST`,
    submit: {
        text: `Crear`,
        ico: `bi bi-send-fill`
    },
    class: ``
};
const UpdateUserFrom = (id) => {
    return {
        action: `/user/${id}/update`,
        title: `Actualizar Usuario`,
        method: `POST`,
        submit: {
            text: `Actualizar`,
            ico: `bi bi-send-fill`
        },
        class: ``,
    };
};
exports.UpdateUserFrom = UpdateUserFrom;
