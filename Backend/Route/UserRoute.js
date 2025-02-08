import express from "express";
const UserRoute = express.Router();
import dotenv from 'dotenv';
import { getCategory, getDetails, getProduct, relatedProduct } from "../Controller/UserController.js";
dotenv.config();



UserRoute.get("/get-product",getProduct)
UserRoute.get("/get-category",getCategory)
UserRoute.get("/get-product/:id",getDetails)
UserRoute.get("/get-related/:category",relatedProduct)
UserRoute.get("/get-related/:category",relatedProduct)
// Routes


export default UserRoute;