import connection from "../database/db.js";

// GET
const selectAllProducts = async () => {
    let sql = `
        SELECT
            j.id_juego,
            j.nombre       AS juego_nombre,
            j.imagen       AS juego_imagen,
            j.categoria    AS juego_categoria,
            j.precio       AS juego_precio,
            d.id_dlc       AS dlc_id,
            d.nombre       AS dlc_nombre,
            d.imagen       AS dlc_imagen,
            d.precio       AS dlc_precio
        FROM juegos j
        LEFT JOIN dlcs d
            ON d.id_juego = j.id_juego
        ORDER BY j.id_juego;
        `;

    return await connection.query(sql);
}

// GET by ID
const selectProductFromId = async (tabla, id) => {
    let tablaProd = tabla === "juegos" ? "juegos" : "dlcs";
    let idCampo = tabla === "juegos" ? "id_juego" : "id_dlc";

    let sql = `SELECT * FROM ${tablaProd} WHERE ${idCampo} = ?`;

    return await connection.query(sql, [id]);
}

// POST
const insertNewProduct = async (tabla, data) => {
    let sql = "";

    //Proteccion contra sql injection, usamos placeholders ?
    if (tabla === "juegos") 
    {
        let { nombre, imagen, categoria, precio } = data;

        sql = ` INSERT INTO juegos (nombre, imagen, categoria, precio) VALUES (?, ?, ?, ?) `;
        
        return await connection.query(sql, [nombre, imagen, categoria, precio]);
    } 
    else if (tabla === "dlcs") 
    {
        let { nombre, imagen, precio, id_juego } = data;

        // Validar que exista un juego con esa ID
        let [[padre]] = await connection.query("SELECT 1 FROM juegos WHERE id_juego = ?", [id_juego]);

        if (!padre) 
        {
        throw new Error(`No existe el juego con id ${id_juego}`);
        }

        sql = ` INSERT INTO dlcs (nombre, imagen, precio, id_juego) VALUES (?, ?, ?, ?) `;
        
        return await connection.query(sql, [nombre, imagen, precio, id_juego]);
    }
}

// PUT
const updateProduct = async (tabla, id, data) => {
    let sql = "";

    if(tabla === "juegos")
    {
        let { nombre, imagen, categoria, precio} = data;

        sql = ` UPDATE juegos SET nombre = ?, imagen = ?, categoria = ?, precio = ? WHERE id_juego = ? `;

        return connection.query(sql, [nombre, imagen, categoria, precio, id]);
    }
    else 
    { // dlcs
        let { nombre, imagen, precio } = data;

        sql = ` UPDATE dlcs SET nombre = ?, imagen = ?, precio = ? WHERE id_dlc = ? `;

        return connection.query(sql, [nombre, imagen, precio, id]);
    }
}

// DELETE
const deleteProduct = async (tabla, id) => {
    let tablaProd, idProd;

    if(tabla === "juegos")
    {
        tablaProd = "juegos";
        idProd = "id_juego";
    }
    else
    {
        tablaProd = "dlcs";
        idProd = "id_dlc";
    }

    let sql = `DELETE FROM ${tablaProd} where ${idProd} = ?`;

    return await connection.query(sql, [id]);
}

export default 
{
    selectAllProducts,
    selectProductFromId,
    insertNewProduct,
    updateProduct,
    deleteProduct
}