import { Router } from "express";
import { validateId } from "../middlewares/middlewares.js";
import { createProduct, getAllProducts, getProductByID, modifyProduct, removeProduct } from "../controllers/product.controllers.js";

const router = Router();

// GET
router.get("/", getAllProducts);

// GET by ID
router.get("/:id", validateId, getProductByID);

// POST
router.post("/", createProduct);

// PUT
router.put("/", modifyProduct);

/// DELETE ///
router.delete("/:id", removeProduct);

// Exportamos todas las rutas
export default router;