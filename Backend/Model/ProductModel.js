import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  priceINR: {
    type: Number,  // Changed to Number for better querying and validation
    required: true
  },
  priceAED: {
    type: Number,  // Changed to Number for better querying and validation
    required: true
  },
  images: {
    image1: { type: String, required: true },  // First image is required
    image2: { type: String },
    image3: { type: String },
    image4: { type: String }
  },
  subCategoryId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'subcategory',
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const productModel = mongoose.model('Product', ProductSchema);
export default productModel;