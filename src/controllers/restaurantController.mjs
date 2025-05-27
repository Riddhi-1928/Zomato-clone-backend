import Restaurant from "../models/Restaurant.mjs";

// Add a new restaurant (Admin only)
export const addRestaurant = async (req, res) => {
    try {
        const { name, location, cuisine, avg_price, image, opening_time, closing_time } = req.body;

        if (!name || !location || !cuisine || !avg_price || !image || !opening_time || !closing_time) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newRestaurant = new Restaurant({ name, location, cuisine, avg_price, image, opening_time, closing_time });
        await newRestaurant.save();

        res.status(201).json({ message: "Restaurant added successfully", restaurant: newRestaurant });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get all restaurants
export const getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get a single restaurant by ID
export const getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

        res.status(200).json(restaurant);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const updateRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Validate required fields
        if (!updateData.name || !updateData.location || !updateData.cuisine || !updateData.avg_price || !updateData.image || !updateData.opening_time || !updateData.closing_time) {
            return res.status(400).json({ message: " All fields are required!" });
        }

        // Find and update the restaurant
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedRestaurant) {
            return res.status(404).json({ message: " Restaurant not found!" });
        }

        res.json({ message: " Restaurant updated successfully!", restaurant: updatedRestaurant });
    } catch (error) {
        res.status(500).json({ message: " Server Error", error: error.message });
    }
};




// Delete restaurant (Admin only)
export const deleteRestaurant = async (req, res) => {
    try {
        const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);
        if (!deletedRestaurant) return res.status(404).json({ message: "Restaurant not found" });

        res.status(200).json({ message: "Restaurant deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
