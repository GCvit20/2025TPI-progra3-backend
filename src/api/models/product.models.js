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
const selectProductFromId = async (id) => {
    let sql = `SELECT * FROM juegos where id_juego = ?`;

    return await connection.query(sql, [id]);
}

// POST
const insertNewProduct = async (nombre, imagen, categoria, precio) => {
    //Proteccion contra sql injection, usamos placeholders ? 
    let sql = `INSERT INTO juegos (nombre, imagen, categoria, precio) VALUES (?, ?, ?, ?)`;
    return await connection.query(sql, [nombre, imagen, categoria, precio]);
}

// PUT
const updateProduct = async (id, nombre, imagen, categoria, precio) => {
    let sql = `UPDATE juegos SET nombre = ?, imagen = ?, precio = ?, categoria = ? WHERE id_juego = ?`;

    return await connection.query(sql, [nombre, imagen, precio, categoria, id]);
}

// DELETE
const deleteProduct = async (id) => {
    let sql = `DELETE FROM juegos where id_juego = ?`;

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