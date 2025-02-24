import express from "express";
import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import dotenv from 'dotenv';
import { SignUp, addProduct, deleteProduct, getProducts, login, resetPassword, updateProduct, updateProfile } from "../Controller/SellerController.js";

dotenv.config();

const SellerRouter = express.Router();

const s3Client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY || "",
    secretAccessKey: process.env.AWS_SECRET_KEY || "",
  },
});

// const categoryUpload = multer({
//   storage: multerS3({
//     s3: s3Client,
//     bucket: "category-fbb",
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     key: function (req, file, cb) {
//       cb(null, Date.now().toString() + "-" + file.originalname);
//     },
//   }),
// });

const productUpload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: "product-fbb",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.fieldname}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
});

const handleProductImages = async (req, res, next) => {
    try {
      const existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];
      req.existingImages = existingImages;
  
      const filesToUpload = [];
  
      for (let i = 1; i <= 4; i++) {
        const fieldName = `image${i}`;
        if (req.files?.[fieldName] || !existingImages[i - 1]) {
          filesToUpload.push({ name: fieldName, maxCount: 1 });
        }
      }
  
      if (filesToUpload.length > 0) {
        return productUpload.fields(filesToUpload)(req, res, (err) => {
          if (err) {
            console.error("Error uploading files:", err);
            return res.status(400).json({ error: "Error uploading files" });
          }
          next();
        });
      }
  
      next();
    } catch (error) {
      console.error("Error in handleProductImages:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

SellerRouter.post("/register",SignUp)
SellerRouter.post("/login",login)
SellerRouter.post("/add-product", productUpload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
  ]), addProduct);

  SellerRouter.get("/get-products/:id", getProducts);
  SellerRouter.put("/edit-product/:id", handleProductImages, updateProduct);

  SellerRouter.post('/reset-password/:userId', resetPassword);
  SellerRouter.put('/update-profile/:userId', updateProfile);
  SellerRouter.delete("/delete-product/:id",deleteProduct)



export default SellerRouter;