"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSpecialityFrom = exports.CreateSpecialityFrom = exports.CreateSpecialityInput = void 0;
exports.CreateSpecialityInput = [
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
exports.CreateSpecialityFrom = {
    action: `/speciality/create`,
    title: `Crear Especialidad`,
    method: `POST`,
    submit: {
        text: `Crear`,
        ico: `bi bi-send-fill`
    },
    class: ``,
};
const UpdateSpecialityFrom = (id) => {
    return {
        action: `/speciality/${id}/update`,
        title: `Actualizar Especialidad`,
        method: `POST`,
        submit: {
            text: `Actualizar`,
            ico: `bi bi-send-fill`
        },
        class: ``,
    };
};
exports.UpdateSpecialityFrom = UpdateSpecialityFrom;
