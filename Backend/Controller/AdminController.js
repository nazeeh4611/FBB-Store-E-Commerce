import productModel from "../Model/ProductModel.js";
import categoryModel from "../Model/CategoryModel.js";
import subcategoryModel from "../Model/SubCategoryModel.js";
import AdminModel from "../Model/AdminModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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


export const addSubcategory = async(req,res)=>{
  try {
    const { name,categoryId } = req.body;
    const image = req.file?.location;
    
    if (!name || !image) {
      return res.status(400).json({ message: "Name and image are required" });
    }
    
    const newCategory = new subcategoryModel({
      name,
      categoryId,
      image
    });
    
    await newCategory.save();
    res.status(201).json({ message: "Category added successfully", category: newCategory });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const getSubCategory = async (req, res) => {
  try {
    const subcategories = await subcategoryModel.find().populate('categoryId');
    if (!subcategories.length) {
      return res.status(404).json({ message: "No categories found" });
    }
    res.status(200).json(subcategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




export const addProduct = async (req, res) => {
  try {

    console.log("request vernd",req.body)
    const { name, brand, priceINR, priceAED, categoryId,subCategoryId } = req.body;

    // Validate required fields
    if (!name || !brand || !priceINR || !priceAED || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Validate category exists
    const categoryExists = await categoryModel.findById(categoryId);
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
      subCategoryId,
      categoryId
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
      .populate('categoryId', 'name').populate('subCategoryId','name')
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

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      brand,
      categoryId,
      subCategoryId,
      priceINR,
      priceAED,
      isTrending,
      existingImages
    } = req.body;

    // Get the current product
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Parse existing images if it's a string
    let parsedExistingImages = existingImages;
    try {
      if (typeof existingImages === 'string') {
        parsedExistingImages = JSON.parse(existingImages);
      }
    } catch (error) {
      console.error('Error parsing existing images:', error);
      parsedExistingImages = [];
    }

    // Handle new uploaded images
    const newImages = {};
    if (req.files) {
      Object.keys(req.files).forEach((key) => {
        newImages[key] = req.files[key][0].location;
      });
    }

    // Combine existing and new images
    const finalImages = [];
    for (let i = 0; i < 4; i++) {
      const newImage = newImages[`image${i + 1}`];
      const existingImage = parsedExistingImages[i];
      
      if (newImage) {
        finalImages.push(newImage);
      } else if (existingImage) {
        finalImages.push(existingImage);
      }
    }

    // Update product
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        name,
        brand,
        categoryId,
        subCategoryId,
        priceINR,
        priceAED,
        images: finalImages,
        trending: isTrending === 'true'
      },
      { new: true }
    ).populate('categoryId')
      .populate('subCategoryId');

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: error.message });
  }
};


export const updateTrending = async (req, res) => {
  try {
    const id = req.params.id;
    
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      { trending: !product.trending },
      { new: true } 
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const SignUp = async(req,res)=>{
  try {

    const {email,phone,password} = req.body
   console.log(email,phone,password)
    const existing = await AdminModel.findOne({email})

    if(existing){
      res.status(400).json({message:"email already existed"})
    }

    const salt = await bcrypt.genSalt(10)
    const hashedpass = await bcrypt.hash(password,salt)
    console.log(hashedpass,"pa")

    const admin = new AdminModel({
      email,
      phone,
      password:hashedpass
    })
    console.log(admin)

   await admin.save()


   const token = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    res.status(500).json({message:"Internal server error"})
  }
}

export const login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ message: "Email/Phone and password are required" });
    }

    const admin = await AdminModel.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!admin) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(admin.password)
    console.log(password)
    // Compare password
    const isMatch = await bcrypt.compare(password,admin.password);
    if (!isMatch) {
      console.log("klkllklkl")
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.status(200).json({ 
      message: 'Login successful', 
      token,
      user: {
        email: admin.email,
        phone: admin.phone,
        _id: admin._id
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



export const editCategory = async(req,res)=>{
  try {
    const image = req.file?.location;
   const {name,categoryId} = req.body

   const response = await categoryModel.updateOne(
    {_id:categoryId},
    {name:name,image:image}
   )

    console.log(response)

    res.status(200).json(response)
  } catch (error) {
    
  }
}