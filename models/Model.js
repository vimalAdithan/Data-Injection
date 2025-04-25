import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  productId: { type: String, unique: true },
  name: String,
  category: String,
  unitPrice: Number,
});
export const ProductModel = mongoose.model("product", ProductSchema);

const CustomerSchema = new mongoose.Schema({
  customerId: { type: String, unique: true },
  name: String,
  email: String,
  address: String,
});
export const CustomerModel = mongoose.model("customer", CustomerSchema);

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  productId: String,
  customerId: String,
  region: String,
  dateOfSale: Date,
  quantitySold: Number,
  discount: Number,
  shippingCost: Number,
  paymentMethod: String,
});
export const OrderModel = mongoose.model("order", OrderSchema);
