import express from "express";
import { addCategory, getCategory, addProduct,getProducts,editProduct } from "../Controller/AdminController.js";
const adminRouter = express.Router();
import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import dotenv from 'dotenv';
dotenv.config();

// Configure S3 Client
const s3Client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY || "",
    secretAccessKey: process.env.AWS_SECRET_KEY || "",
  },
});

// Configure multer for category uploads
const categoryUpload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: "category-fbb",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
});

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

const handleProductImages = (req, res, next) => {
  if (!req.files && !req.file && Object.keys(req.files || {}).length === 0) {
    return next();
  }

  const filesToUpload = [];
  ['image1', 'image2', 'image3', 'image4'].forEach(fieldName => {
    if (req.body[`update_${fieldName}`] === 'true') {
      filesToUpload.push({ name: fieldName, maxCount: 1 });
    }
  });

  // If there are files to upload, use multer
  if (filesToUpload.length > 0) {
    return productUpload.fields(filesToUpload)(req, res, next);
  }

  next();
};

// Routes
adminRouter.post("/add-category", categoryUpload.single('image'), addCategory);
adminRouter.get("/get-category", getCategory);
adminRouter.post("/add-product", productUpload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 }
]), addProduct);
adminRouter.patch("/edit-product/:id", handleProductImages, editProduct);
adminRouter.get("/get-products", getProducts);

export default adminRouter;