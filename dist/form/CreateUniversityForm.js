"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUniversityFrom = exports.CreateUniversityFrom = exports.CreateUniversityInput = void 0;
exports.CreateUniversityInput = [
    {
        cols: `col-12`,
        name: `name`,
        placeholder: `Nombre`,
        type: `text`,
        value: ``,
    },
    {
        cols: `col-12`,
        name: `description`,
        placeholder: `Descripción`,
        type: `text`,
        value: ``,
    }
];
exports.CreateUniversityFrom = {
    action: `/university/create`,
    title: `Crear Universidad`,
    method: `POST`,
    submit: {
        text: `Crear`,
        ico: `bi bi-send-fill`
    },
    class: ``,
};
const UpdateUniversityFrom = (id) => {
    return {
        action: `/university/${id}/update`,
        title: `Actualizar universidad`,
        method: `POST`,
        submit: {
            text: `Actualizar`,
            ico: `bi bi-send-fill`
        },
        class: ``,
    };
};
exports.UpdateUniversityFrom = UpdateUniversityFrom;
