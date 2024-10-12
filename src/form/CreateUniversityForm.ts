import { STRUC_FORM, STRUC_INPUT_FORM } from "../types/app";

export const CreateUniversityInput: STRUC_INPUT_FORM[] = [
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

export const CreateUniversityFrom: STRUC_FORM = {
    action: `/university/create`,
    title: `Crear Universidad`,
    method: `POST`,
    submit: {
        text: `crear`,
        ico: `bi bi-send-fill`
    },
    class: ``,
}


export const UpdateUniversityFrom = (id:string) => {
    return {
        action: `/university/${id}/update`,
        title: `Actualizar universidad`,
        method: `POST`,
        submit: {
            text: `actualizar`,
            ico: `bi bi-send-fill`
        },
        class: ``,
    }
}
