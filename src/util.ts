import { ROLES, STATUS } from "./types/app";

export function getRoles(): ROLES[] {
    return [`ADMIN`, "DOCTOR", "PACIENTE"];
}

export function getStatus(): STATUS[] {
    return [`CANCELADA`, `FINALIZADO`, `PROCESADO`];
}

export function getStatusEnable() {
    return [`ACTIVADO`, `DESACTIVADO`]
}

export function getDays() {
    return [`Lunes`, `Martes`, `Miercoles`, `Jueves`, `Viernes`, `Sábado`, `Domingo`];
}

export function randomDate(start: number, end: number) {
    // Generar un año aleatorio dentro del rango
    const añoAleatorio = Math.floor(Math.random() * (end - start + 1)) + start;

    // Generar un mes aleatorio (1-12)
    const mesAleatorio = Math.floor(Math.random() * 12) + 1;

    // Generar un día aleatorio según el mes (considerando años bisiestos)
    const diasEnMes = new Date(añoAleatorio, mesAleatorio, 0).getDate();
    const diaAleatorio = Math.floor(Math.random() * diasEnMes) + 1;

    // Crear la fecha
    const fechaAleatoria = new Date(añoAleatorio, mesAleatorio - 1, diaAleatorio); // Restamos 1 al mes porque los meses en JavaScript comienzan en 0

    return fechaAleatoria;
}

export function caclAge(fechaNacimiento: string): number {
    // Validación básica del formato de fecha (puedes agregar más validaciones si es necesario)
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(fechaNacimiento)) {
        throw new Error('Formato de fecha inválido. Debe ser AAAA-MM-DD');
    }

    // Convertir la fecha de nacimiento a un objeto Date
    const partesFecha = fechaNacimiento.split('-');
    const anioNacimiento = parseInt(partesFecha[0]);
    const mesNacimiento = parseInt(partesFecha[1]) - 1; // Los meses en JavaScript comienzan en 0
    const diaNacimiento = parseInt(partesFecha[2]);
    const fechaNacimientoObj = new Date(anioNacimiento, mesNacimiento, diaNacimiento);

    // Obtener la fecha actual
    const hoy = new Date();

    // Calcular la edad
    let edad = hoy.getFullYear() - fechaNacimientoObj.getFullYear();
    const mesActual = hoy.getMonth();
    const mesNacimientoActual = fechaNacimientoObj.getMonth();

    // Ajustar la edad si aún no se ha cumplido el cumpleaños este año
    if (mesActual < mesNacimiento || (mesActual === mesNacimiento && hoy.getDate() < diaNacimiento)) {
        edad--;
    }

    return edad;
}
