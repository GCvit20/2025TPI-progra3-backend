// Middlewares de aplicación
// Middleware logger sirve para analizar y loguear todas las solicitudes
const loggerUrl = (req, rep, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next();
}

// Middlewares de rutas//
// Middleware de ruta donde validaremos el ID
const validateId = (req, rest, next) => {
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

export
{
    loggerUrl,
    validateId
}