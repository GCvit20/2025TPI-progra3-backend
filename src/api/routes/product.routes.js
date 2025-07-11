import { Router } from "express";
import { validateId } from "../middlewares/middlewares.js";
import { createProduct, getAllProducts, getProductByID, modifyProduct, removeProduct } from "../controllers/product.controllers.js";

const router = Router();

// GET
router.get("/", getAllProducts);

// GET by ID
router.get("/:tabla/:id", validateId, getProductByID);

// POST
router.post("/:tabla", createProduct);

// PUT
router.put("/:tabla/:id", validateId, modifyProduct);

/// DELETE ///
router.delete("/:tabla/:id", validateId, removeProduct);

// Exportamos todas las rutas
export default router;