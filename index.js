import express from "express";
import enviroments from "./src/api/config/enviroments.js";
import connection from "./src/api/database/db.js";  
import cors from "cors";

const app = express();
const PORT = enviroments.port;
const db = connection;

///Middlewares///

///Middlewares de aplicacion///
app.use(express.json()); //Sirve prar parsear el JSON del body (peticiones post/put/patch)
app.use(cors()); //Permite todas las solicitudes 

//Logger sirve para analizar y loguear todas las solicitudes
app.use((req, rep, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next();
})

///Middlewares de rutas///

// Rutas de productos de nuestra API Rest
//app.use("/api/products", productRoutes);

// Rutas de las vistas EJS
//app.use("/dashboard", viewRoutes);


/*app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})*/

const validateId = (req, rest, next) => {
    const { id } = req.params;

    if(!id || isNaN(id)) {
        return res.status(400).json({
            error: "El ID debe ser un numero"
        })
    }

    //Convertimos el parametro id a un numero entero de base 10, decimal
    req.id = parseInt(id, 10);

    next();
}

///Rutas///

app.get("/", (req, res) => {
    res.send("Hola mundo")
});

app.get("/products", async (req, res) => {
    
    try {
        let sql = `SELECT * FROM juegos`;

        //al usar "[rows]" la desestructuracion extrae solamente las filas. Hace que el codigo sea mas legible y explicito.
        let [rows] = await connection.query(sql);
        
        //Devolvemos un status "200 OK" y la informacion que solicitamos a la db en formato JSON.
        res.status(200).json({
            payload: rows,
            message: rows.length === 0 ? "No se encontraron productos" : "Productos encontrados"
        });
    } catch (error) {
        console.log("Error al obtener productos: ", error);
        res.status(500).json({
            error: "Error inerno del servidor al obtener productos"
        });
    }
});


// GET product by id

app.get("/products/:id", validateId, async (req, res) => {
    try{
        let { id } = req.params;
        let sql = `SELECT * FROM juegos where id = ?`;
        let [rows] = await connection.query(sql, [id]);

        //verificamos si se encontro el producto
        if(rows.length === 0) {
            return res.status(404).json({
                error: `No se encontro el producto con el id: ${id}`
            })
        } 

        res.status(200).json({
            payload: rows
        })

    } catch (error) {
        console.error(`Error al obtener el producto con el id ${id}`, error.message);
        res.status(500).json({
            error: `Error interno al obtener producto por id`
        });
    }
});

/// POST ///

app.post("/products", async (req, res) => {
    try{
        let { categoria, imagen, nombre, precio } = req.body;

        if(!categoria || !imagen || !nombre || !precio) {
            return res.status(400).json({
                message: "Datos invalidos. Asegurate de mandar categoria, imagen, nombre y precio"
            });
        }

        //proteccion contra sql injection, usamos placeholders ? 
        let sql = `INSERT INTO juegos (categoria, imagen, nombre, precio) VALUES (?, ?, ?, ?)`;
        let [rows] = await connection.query(sql, [categoria, imagen, nombre, precio]);

        //Devolvemos informacion util del insert para devolver el ID del producto creado
        res.status(200).json({
            message: "Producto creado con exito.",
            productId: rows.insertId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: `Error interno del servidor`,
            error: error.message
        });
    }
});

/// PUT ///
app.put("/products", async (req, res) => {
    try{
        let { id, categoria, imagen, nombre, precio } = req.body;

        if(!id || !categoria || !imagen || !nombre || !precio) {
            return res.status(400).json({
                message: "Faltan campos requeridos"
            });
        }

        //proteccion contra sql injection, usamos placeholders ? 
        let sql = `UPDATE juegos SET nombre = ?, imagen = ?, precio = ?, categoria = ? WHERE id = ?`;
        let [result] = await connection.query(sql, [nombre, imagen, precio, categoria, id]);

        //Devolvemos informacion util del insert para devolver el ID del producto creado
        res.status(200).json({
            message: "Producto actualizado correctamente.",
        });

    } catch (error) {
        console.error("Error al actualizar un producto",error);
        res.status(500).json({
            message: `Error interno del servidor`,
            error: error.message
        });
    }
});

/// DELETE ///
app.delete("/products/:id", async (req, res) => {
    try{
        let { id } = req.params;

        if(!id)  {
            return res.status(400).json({
                message: "Se requiere un ID para eliminar un producto"
            })
        }


        let sql = `DELETE FROM juegos where id = ?`;
        let [result] = await connection.query(sql, [id]);

        if(result.affectedRows === 0){
            return res.status(404).json({
                message: `No se encontro un producto con id: ${id}`
            })
        }

        res.status(200).json({
            message: `Producto con id ${id} eliminado correctamente`
        })

    } catch (error) {
        console.error(`Error en DELETE /products/:id`, error);
        res.status(500).json({
            error: `Error al eliminar producto con id ${id}`, error,
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
})