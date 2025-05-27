import express from "express";
import { verifyToken, verifyAdmin }  from "../middlewares/authMiddleware.mjs";
import { addItem, updateItem, deleteItem, getItemsByRestaurant } from "../controllers/itemController.mjs";

const router = express.Router();

//  Add New Item (Admin Only)
router.post("/:restaurantId/addItem", verifyToken, verifyAdmin, addItem);

//  Get Items by Restaurant
router.get("/:restaurantId", getItemsByRestaurant);

//  Update Item (Admin Only)
router.put("/:restaurantId/:itemId", verifyToken, verifyAdmin, updateItem);

//  Delete Item (Admin Only)
router.delete("/:restaurantId/:itemId", verifyToken, verifyAdmin, deleteItem);

export default router;
