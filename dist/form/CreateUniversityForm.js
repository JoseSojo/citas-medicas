"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSpecialityFrom = exports.CreateUniversityFrom = exports.CreateUniversityInput = void 0;
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
    action: `/speciality/create`,
    title: `Crear Especialidad`,
    method: `POST`,
    submit: {
        text: `crear`,
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
            text: `actualizar`,
            ico: `bi bi-send-fill`
        },
        class: ``,
    };
};
exports.UpdateSpecialityFrom = UpdateSpecialityFrom;
