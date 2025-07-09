import express from "express";
import enviroments from "./src/api/config/enviroments.js";
import cors from "cors";
import { productRoutes } from "./src/api/routes/index.js";
import { loggerUrl } from "./src/api/middlewares/middlewares.js";

const app = express();
const PORT = enviroments.port;

// Middlewares

// Middlewares de aplicación
// Aplicamos a nivel global para todas las solicitudes: autenticación, registro de solicitudes o logging, analisis del cuerpo de la solicitud body parsing

// Sirve prar parsear el JSON del body (peticiones post/put/patch)
app.use(express.json()); 

// Permite todas las solicitudes
app.use(cors());  

// Sirve para analizar y loguear todas las solicitudes
app.use(loggerUrl);

// Rutas
app.get("/", (req, res) => {
    res.send("Hola mundo");
});

app.use("/api/products", productRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}.`);
})