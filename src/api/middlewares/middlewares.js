
//Logger sirve para analizar y loguear todas las solicitudes
const loggerUrl = (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next();
}

const validateId = (req, res, next) => {
    const { id } = req.params;

    if(!id || isNaN(id)) {
        return res.status(400).json({
            error: "El ID debe ser un numero."
        })
    }

    //Convertimos el parametro id a un numero entero de base 10, decimal
    req.id = parseInt(id, 10);

    next();
}

export {
    loggerUrl,
    validateId
}