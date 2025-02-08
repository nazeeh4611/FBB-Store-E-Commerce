import productModel from "../Model/ProductModel.js";
import categoryModel from "../Model/CategoryModel.js";

export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file?.location;
    
    if (!name || !image) {
      return res.status(400).json({ message: "Name and image are required" });
    }
    
    const newCategory = new categoryModel({
      name,
      image
    });
    
    await newCategory.save();
    res.status(201).json({ message: "Category added successfully", category: newCategory });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCategory = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    if (!categories.length) {
      return res.status(404).json({ message: "No categories found" });
    }
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addProduct = async (req, res) => {
  try {

    console.log("request vernd")
    const { name, brand, priceINR, priceAED, category } = req.body;
    console.log(name, brand, priceINR, priceAED, category)

    // Validate required fields
    if (!name || !brand || !priceINR || !priceAED || !category) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Validate category exists
    const categoryExists = await categoryModel.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    // Process images
    const images = {};
    if (req.files) {
      for (let i = 1; i <= 4; i++) {
        const fieldName = `image${i}`;
        if (req.files[fieldName] && req.files[fieldName][0]) {
          images[fieldName] = req.files[fieldName][0].location;
        }
      }
    }
    console.log(images,"this be teh image")

    // Ensure at least one image is uploaded
    if (!images.image1) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required"
      });
    }

    // Create product object
    const productData = {
      name,
      brand,
      priceINR: Number(priceINR),
      priceAED: Number(priceAED),
      images,
      category: category
    };

    // Save to database
    const product = await productModel.create(productData);

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: product
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: error.message
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await productModel
      .find({ active: true })
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: "No products found"
      });
    }

    res.status(200).json({products});
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message
    });
  }
};

export const editProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = { ...req.body };

    // Convert prices to numbers if provided
    if (updates.priceINR) updates.priceINR = Number(updates.priceINR);
    if (updates.priceAED) updates.priceAED = Number(updates.priceAED);

    // Handle image updates if files were uploaded
    if (req.files) {
      if (!updates.images) updates.images = {};
      
      Object.keys(req.files).forEach(fieldName => {
        updates.images[fieldName] = req.files[fieldName][0].location;
      });
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message
    });
  }
};
