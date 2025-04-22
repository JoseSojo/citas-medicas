/*

ESTADISTICAS
    - portafolios vistos

PANEL DE CONTROL
    DOCTOR
        - pacientes atendidos
        - ver citas de aprovadas

    PACIENTE
        - citas
        - doctores que atendieron
        - citas aprovadas


GRAFICOS
    - pie citas por estados
    - citas mensuales
    - citas anuales

- PUBLIC
    formulario para crear pacientes
    langing

- DEFINE
    - buscar horarios por pacientes
    - buscar horarios por días
    - estilo de notificaciones

*/


// import { Router } from "express";
// import { readdirSync } from 'fs';

// const PATH_NAME = `${__dirname}`;
// const router = Router();

// /**
//  * 
//  * @param fileName => nombre a limpiar (quitar extension del archivo)
//  */
// const cleanFileName = (fileName:string) => {
//     return fileName.split('.').shift();
// }

// readdirSync(PATH_NAME).filter((fileName) => {
//     const cleanName = cleanFileName(fileName);
//     if(cleanName !== 'index') {
//         import(`./${cleanName}`)
//             .then((moduleRouter) => {
//                 // console.debug('Cargando Rutas...', moduleRouter);
//                 router.use(`/${cleanName}`, moduleRouter.router);
//             });
//     }
// })

// export { router };