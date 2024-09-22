import { STRUC_FORM } from "../types/app";


export const CreateSocialFrom: STRUC_FORM = {
    action: `/social/create`,
    title: `Crear Red Social`,
    method: `POST`,
    submit: {
        text: `crear`,
        ico: `bi bi-send-fill`
    },
    class: ``,
}

export const UpdateSocialFrom = (id:string) => {
    return {
        action: `/social/${id}/update`,
        title: `Actualizar Medio Social`,
        method: `POST`,
        submit: {
            text: `actualizar`,
            ico: `bi bi-send-fill`
        },
        class: ``,
    }
}

