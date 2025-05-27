import express from "express";
import { addRestaurant, getRestaurants, getRestaurantById, updateRestaurant, deleteRestaurant } from "../controllers/restaurantController.mjs";
import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware.mjs"; // Import middleware


const router = express.Router();

// Public Route: Get All Restaurants
router.get("/", getRestaurants);

// Public Route: Get Single Restaurant by ID
router.get("/:id", getRestaurantById);

// Admin Routes: Requires Authentication & Admin Role
router.post("/add", verifyToken, verifyAdmin , addRestaurant);
router.put("/:id", verifyToken, verifyAdmin , updateRestaurant);
router.delete("/:id", verifyToken, verifyAdmin , deleteRestaurant);

export default router;
