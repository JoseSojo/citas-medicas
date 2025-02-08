
export type ROLES = `DOCTOR` | `ADMIN` | `PACIENTE`;

export type STATUS = `REGISTRADO` | `FINALIZADO` | `CANCELADA` | `APROVADA`;

export interface MONTH_STRUCT {
    name:   string;
    label:  string
}

export interface STRUC_INPUT_FORM {}

export interface STRUC_SUBMIT_FORM {
    ico?:               string;
    text:               string;
}

export interface STRUC_FORM {
    method:             `GET` | `POST`;
    action:             string;
    title:              string;
    class?:             string;
    submit:             STRUC_SUBMIT_FORM;
    // children:           STRUC_INPUT_FORM[];
}
