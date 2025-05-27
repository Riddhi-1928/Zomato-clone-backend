import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    cuisine: { type: String, required: true },
    avg_price: { type: Number, required: true },
    image: { type: String, required: true },
    opening_time: { type: String, required: true },
    closing_time: { type: String, required: true },
});

const Restaurant = mongoose.model("Restaurant", RestaurantSchema);
export default Restaurant; 
