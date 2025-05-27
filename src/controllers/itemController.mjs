import Item from "../models/Item.mjs";

//  Add a new item under a restaurant
export const addItem = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const {name, price, category, description, image, availability } = req.body;

        if (!restaurantId || !name || !price || !category|| !description || ! availability) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newItem = new Item({ restaurantId, name, price, category, description, image, availability });
        await newItem.save();

        res.status(201).json({ message: "Item added successfully", item: newItem });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//  Get all items for a specific restaurant
export const getItemsByRestaurant = async (req, res) => {
    try {
        const items = await Item.find({ restaurantId: req.params.restaurantId });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//  Update an item
export const updateItem = async (req, res) => {
    try {
      const { restaurantId, itemId } = req.params;
      const updateData = req.body;
  
      if (!restaurantId || !itemId) {
        return res.status(400).json({ message: "Restaurant ID and Item ID are required!" });
      }
  
      const updatedItem = await Item.findOneAndUpdate(
        { _id: itemId, restaurantId: restaurantId }, 
        updateData, 
        { new: true }
      );
  
      if (!updatedItem) {
        return res.status(404).json({ message: "Item not found!" });
      }
  
      res.status(200).json({ message: "Item updated successfully!", item: updatedItem });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
//  Delete an item

export const deleteItem = async (req, res) => {
    try {
      const { restaurantId, itemId } = req.params;
  
      if (!restaurantId || !itemId) {
        return res.status(400).json({ message: "Restaurant ID and Item ID are required!" });
      }
  
      // Find item under the specific restaurant
      const deletedItem = await Item.findOneAndDelete({ _id: itemId, restaurantId });
  
      if (!deletedItem) {
        return res.status(404).json({ message: "Item not found or does not belong to this restaurant!" });
      }
  
      res.status(200).json({ message: "Item deleted successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  