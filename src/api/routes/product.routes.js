import { Router } from "express";
import { validateId } from "../middlewares/middlewares.js";
import { removeProduct, getAllProducts, getProductById, newProduct, updateProduct } from "../controllers/product.controllers.js";

const router = Router();

/// GET products 
router.get("/", getAllProducts);

// GET product by id
router.get("/:id", validateId, getProductById);

/// PUT ///
router.put("/", updateProduct);

/// POST ///
router.post("/", newProduct);


/// DELETE ///
router.delete("/:id", removeProduct);

//Exportamos las rutas
export default router;