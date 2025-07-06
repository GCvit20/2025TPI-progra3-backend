// Importamos el modulo mysql2 en modo promesas par apoder usar asnyc/await para conectarnos a la BBDD
import mysql from "mysql2/promise";
import environments from "../config/enviroments.js"

const { database } = environments;

//createPool es un conjunto de conecciones activas y reutilizables a la db (mantiene una coneccion abierta)
const connection = mysql.createPool({
    host: database.host,
    database: database.name,
    user: database.user,
    password: database.password
});

export default connection;