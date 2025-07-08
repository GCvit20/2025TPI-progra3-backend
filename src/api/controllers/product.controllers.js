import Products from "../models/product.models.js";

export const getAllProducts = async (req, res) => {
    try {
        // let sql = `SELECT * FROM juegos`;
        /*let sql = `
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

        //al usar "[rows]" la desestructuracion extrae solamente las filas. Hace que el codigo sea mas legible y explicito.
        let [rows] = await connection.query(sql);*/

        let [rows] = Products.selectAllProducts();
        let juegosMap = {};

        rows.forEach(row => {
            if(!juegosMap[row.id_juego]) 
            {
                juegosMap[row.id_juego] = {
                id_juego:  row.id_juego,
                nombre:    row.juego_nombre,
                imagen:    row.juego_imagen,
                categoria: row.juego_categoria,
                precio:    row.juego_precio,
                dlcs:      []
                };
            }
            if(row.dlc_id != null) 
            {
                juegosMap[row.id_juego].dlcs.push({
                id_dlc:  row.dlc_id,
                nombre:  row.dlc_nombre,
                imagen:  row.dlc_imagen,
                precio:  row.dlc_precio
                });
            }
            });

        // let juegosConDlcs = [];
        // Object.keys(juegosMap).forEach(key => {
        // juegosConDlcs.push(juegosMap[key]);
        // });

        let juegosConDlcs = Object.values(juegosMap);
        
        //Devolvemos un status "200 OK" y la informacion que solicitamos a la db en formato JSON.
        res.status(200).json({
            payload: juegosConDlcs,
            message: juegosConDlcs.length === 0 ? "No se encontraron juegos." : "Juegos (con sus DLCs) encontrados."
        });
    } catch (error) {
        console.log("Error al obtener productos: ", error);
        res.status(500).json({
            error: "Error interno del servidor al obtener juegos."
        });
    }
}

export const getProductById = async (req, res) => {
    try{
        let { id } = req.params;

        /*
        let sql = `SELECT * FROM juegos where id_juego = ?`;

        let [rows] = await connection.query(sql, [id]);*/

        let [rows] = await Products.selectProductById(id);

        //Verificamos si se encontro el producto
        if(rows.length === 0) {
            return res.status(404).json({
                error: `No se encontró el producto con el id: ${id}.`
            })
        } 

        res.status(200).json({
            payload: rows
        })

    } catch (error) {
        console.error(`Error al obtener el producto con el id ${id}.`, error.message);
        res.status(500).json({
            error: `Error interno al obtener producto por id.`
        });
    }
}

export const newProduct = async (req, res) => {
    try{
        let { nombre , imagen , categoria , precio } = req.body;

        if(!nombre || !imagen || !categoria || !precio) {
            return res.status(400).json({
                message: "Datos inválidos. Asegurate de mandar nombre, imagen, categoria y precio."
            });
        }

        /*Proteccion contra sql injection, usamos placeholders ? 
        let sql = `INSERT INTO juegos (nombre, imagen, categoria, precio) VALUES (?, ?, ?, ?)`;
        let [rows] = await connection.query(sql, [nombre, imagen, categoria, precio]);*/

        let [rows] = await Products.insertNewPorduct(nombre, imagen, categoria, precio);

        //Devolvemos informacion util del insert para devolver el ID del producto creado
        res.status(200).json({
            message: "Producto creado con éxito.",
            productId: rows.insertId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: `Error interno del servidor.`,
            error: error.message
        });
    }
}

export const updateProduct = async (req, res) => {
    try{
        let { id, nombre, imagen, categoria, precio } = req.body;

        if(!id || !nombre || !imagen || !categoria || !precio) {
            return res.status(400).json({
                message: "Faltan campos requeridos."
            });
        }

        /*proteccion contra sql injection, usamos placeholders ? 
        let sql = `UPDATE juegos SET nombre = ?, imagen = ?, precio = ?, categoria = ? WHERE id_juego = ?`;
        let [result] = await connection.query(sql, [nombre, imagen, precio, categoria, id]);*/

        let [result] = await Products.updateProduct(nombre, imagen, precio, categoria, id);

        //Devolvemos informacion util del insert para devolver el ID del producto creado
        res.status(200).json({
            message: "Producto actualizado correctamente.",
        });

    } catch (error) {
        console.error("Error al actualizar un producto.",error);
        res.status(500).json({
            message: `Error interno del servidor.`,
            error: error.message
        });
    }
}

export const removeProduct = async (req, res) => {
    try{
        let { id } = req.params;

        if(!id)  {
            return res.status(400).json({
                message: "Se requiere un ID para eliminar un producto."
            })
        }


        /*let sql = `DELETE FROM juegos where id_juego = ?`;
        let [result] = await connection.query(sql, [id]);*/

        let [result] = await Products.deleteProduct(id);

        if(result.affectedRows === 0){
            return res.status(404).json({
                message: `No se encontró un producto con ID: ${id}.`
            })
        }

        res.status(200).json({
            message: `Producto con ID ${id} eliminado correctamente.`
        })

    } catch (error) {
        console.error(`Error en DELETE /products/:id.`, error);
        res.status(500).json({
            error: `Error al eliminar producto con ID ${id}.`, error,
            error: error.message
        });
    }
}