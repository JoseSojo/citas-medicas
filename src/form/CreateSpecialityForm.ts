import { STRUC_FORM, STRUC_INPUT_FORM } from "../types/app";

export const CreateSpecialityInput: STRUC_INPUT_FORM[] = [
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
] 

export const CreateSpecialityFrom: STRUC_FORM = {
    action: `/speciality/create`,
    title: `Crear Especialidad`,
    method: `POST`,
    submit: {
        text: `Crear`,
        ico: `bi bi-send-fill`
    },
    class: ``,
}


export const UpdateSpecialityFrom = (id:string) => {
    return {
        action: `/speciality/${id}/update`,
        title: `Actualizar Especialidad`,
        method: `POST`,
        submit: {
            text: `Actualizar`,
            ico: `bi bi-send-fill`
        },
        class: ``,
    }
}
