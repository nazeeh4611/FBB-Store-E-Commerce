import SellerModel from "../Model/SellerModel.js"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import productModel from "../Model/ProductModel.js";
import categoryModel from "../Model/CategoryModel.js";

export const SignUp = async(req,res)=>{
    try {
  
        console.log("first")
      const {email,phone,password,name} = req.body
     console.log(email,phone,password,name)
      const existing = await SellerModel.findOne({email})
  
      if(existing){
        res.status(400).json({message:"email already existed"})
      }
  
      const salt = await bcrypt.genSalt(10)
      const hashedpass = await bcrypt.hash(password,salt)
      console.log(hashedpass,"pa")
  
      const seller = new SellerModel({
        name,
        email,
        phone,
        password:hashedpass
      })
      console.log(seller)
  
     await seller.save()
  
     console.log("mid")
     const token = jwt.sign({ userId: seller._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    console.log(token)

    console.log("last")
  
    res.status(201).json(token);
    } catch (error) {
        console.error(error)
      res.status(500).json({message:"Internal server error"})
      
    }
  }


  export const login = async (req, res) => {
    try {
        console.log(req.body,"may here")
      const { emailOrPhone, password } = req.body;
  
      if (!emailOrPhone || !password) {
        return res.status(400).json({ message: "Email/Phone and password are required" });
      }
  
      const seller = await SellerModel.findOne({
        $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      });
  
      if (!seller) {
        return res.status(404).json({ message: "User not found" });
      }
      console.log(seller.password)
      console.log(password)
      // Compare password
      const isMatch = await bcrypt.compare(password,seller.password);
      if (!isMatch) {
        console.log("klkllklkl")
        return res.status(401).json({ message: "Invalid password" });
      }
  
      const token = jwt.sign({ userId: seller._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });
  
      return res.status(200).json({ 
        message: 'Login successful', 
        token,
        user: {
          email: seller.email,
          phone: seller.phone,
          _id: seller._id
        }
      });
      
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  export const addProduct = async (req, res) => {
    try {
  
      console.log("request vernd",req.body)
      const { name, brand, priceINR, priceAED, categoryId,subCategoryId ,sellerId} = req.body;
  
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
        categoryId,
        seller:sellerId
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
         console.log(req.params)
        const seller = req.params.id
        console.log(seller)
      const products = await productModel
        .find({ seller: seller })
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



  export const resetPassword = async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const { userId } = req.params; // Getting from URL params since that's how your frontend is structured
  

      console.log(currentPassword,newPassword)
      // Find the seller
      const seller = await SellerModel.findById(userId);
      console.log(seller)
      if (!seller) {
        return res.status(404).json({ message: "Seller not found" });
      }
  
      // Check if current password matches
      const isMatch = await bcrypt.compare(currentPassword, seller.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
  
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);
  
      // Update password
      seller.password = hashedNewPassword;
      await seller.save();

      console.log("first")
  
      res.status(200).json({ message: "Password updated successfully" });
      
    } catch (error) {
      console.error('Password reset error:', error);
      res.status(500).json({ message: "Internal server error" });
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


  export const updateProfile = async (req, res) => {
    try {
      console.log(req.body, "may");
      const { INR, email, DXB } = req.body;
      
      const image = req.file?.location;
      console.log(image, "imaeggege");
  
      if (!email) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const updateFields = {};
      if (INR) updateFields.INR = INR;
      if (DXB) updateFields.DXB = DXB;
      if (image) updateFields.Image = image; 
      
      const updatedSeller = await SellerModel.findOneAndUpdate(
        { email: email },
        { $set: updateFields }, 
        { new: true, runValidators: true }
      );
  
      console.log(updatedSeller, "OPPPP");
      
      if (!updatedSeller) {
        return res.status(404).json({ message: "Seller not found" });
      }
      
      res.status(200).json({ message: "Profile updated successfully", updatedSeller });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  


  export const deleteProduct = async(req,res)=>{
    try {
      const id = req.params.id
      const response = await productModel.findByIdAndDelete(id)
      res.status(200).json({message:"deleted success"})
    } catch (error) {
      
    }
  }