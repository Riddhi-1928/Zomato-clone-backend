import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true }, // Link to restaurant
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true }, // e.g., "Appetizers", "Beverages"
    description: { type: String },
    image: { type: String }, // Image URL
    availability: { type: Boolean, default: true }, // In-stock or Out-of-stock
});

export default mongoose.model("Item", ItemSchema);
