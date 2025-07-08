import connection from "../database/db.js";

const selectAllProducts = async () => {
    // let sql = `SELECT * FROM juegos`;
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

const selectProductById = async (id) => {
    let sql = `SELECT * FROM juegos where id_juego = ?`;
    return await connection.query(sql, [id]);
}

const insertNewPorduct = async (nombre, imagen, categoria, precio) => {
    //Proteccion contra sql injection, usamos placeholders ? 
    let sql = `INSERT INTO juegos (nombre, imagen, categoria, precio) VALUES (?, ?, ?, ?)`;
    return await connection.query(sql, [nombre, imagen, categoria, precio]);
}

const updateProduct = async (nombre, imagen, categoria, precio, id) => {
    let sql = `UPDATE juegos SET nombre = ?, imagen = ?, precio = ?, categoria = ? WHERE id_juego = ?`;
    return await connection.query(sql, [nombre, imagen, precio, categoria, id]);
}

const deleteProduct = async (id) => {
    let sql = `DELETE FROM juegos where id_juego = ?`;
    return await connection.query(sql, [id]);
}

export default {
    selectAllProducts,
    selectProductById,
    insertNewPorduct,
    updateProduct,
    deleteProduct
}

