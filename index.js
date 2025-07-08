import express from "express";
import cors from "cors";
import enviroments from "./src/api/config/enviroments.js";
import { productRoutes } from "./src/api/routes/index.js";
import { loggerUrl } from "./src/api/middlewares/middlewares.js";

const app = express();
const PORT = enviroments.port;

///Middlewares de aplicacion///
app.use(cors()); //Permite todas las solicitudes 
app.use(express.json()); //Sirve prar parsear el JSON del body (peticiones post/put/patch)

//Logger sirve para analizar y loguear todas las solicitudes
app.use(loggerUrl);

///Middlewares de rutas///

// Rutas de productos de nuestra API Rest
//app.use("/api/products", productRoutes);

// Rutas de las vistas EJS
//app.use("/dashboard", viewRoutes);


/*app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})*/


///Rutas///
app.get("/", (req, res) => {
    res.send("Hola mundo");
});

app.use("/api/products", productRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}.`);
})