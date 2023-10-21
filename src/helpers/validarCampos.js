const validarEmail = email => {
    const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    const resultado = regex.test(email);
    return resultado;
}

/* VALIDAR FORMATO DE RUT */
const cleanRut = rut => {
    return typeof rut === "string"
    ? rut.replace(/^0+|[^0-9kK]+/g, "").toUpperCase()
    : "";
}

const validarRut = rut => {
    if (typeof rut !== "string") {
        return false;
    }

    // if it starts with 0 we return false
    // so a rut like 00000000-0 will not pass
    if (/^0+/.test(rut)) {
        return false;
    }

    if (!/^\d{7,8}-[\dkK]$/.test(rut)) {
        return false;
    }

    rut = cleanRut(rut);

    let t = parseInt(rut.slice(0, -1), 10);
    let m = 0;
    let s = 1;

    while (t > 0) {
        s = (s + (t % 10) * (9 - (m++ % 6))) % 11;
        t = Math.floor(t / 10);
    }

    const v = s > 0 ? "" + (s - 1) : "K";
    return v === rut.slice(-1);
}
  

const formatearTiempo = tiempo => {
    const nuevoTiempo = new Date(tiempo)
    return nuevoTiempo.toLocaleString()
}

export {
    validarEmail,
    validarRut,
    formatearTiempo
}