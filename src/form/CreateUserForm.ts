import { STRUC_FORM, STRUC_INPUT_FORM } from "../types/app";

export const CreateUserFrom: STRUC_FORM = {
    action: `/user/create`,
    title: `Crear Usuario`,
    method: `POST`,
    submit: {
        text: `crear`,
        ico: `bi bi-send-fill`
    },
    class: ``
}

export const UpdateUserFrom = (id:string) => {
    return {
        action: `/user/${id}/update`,
        title: `Actualizar Usuario`,
        method: `POST`,
        submit: {
            text: `actualizar`,
            ico: `bi bi-send-fill`
        },
        class: ``,
    }
}
