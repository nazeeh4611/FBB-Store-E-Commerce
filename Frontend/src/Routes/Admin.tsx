import React from "react";
import { Route, Routes } from "react-router-dom";
import Homepage from "../Components/User/HomePage";
import Shop from "../Components/User/Shop";
import CategoryManager from "../Components/Admin/Category";
import ProductPage from "../Components/Admin/Product";
import SubCategory from "../Components/Admin/Subcategory";
import ProductType from "../Components/Admin/ProductType";


const Admin: React.FC = () => {
    return (
      <>
        <Routes>
          <Route path="/category" element={<CategoryManager/>} />
          <Route path="/sub-category" element={<SubCategory/>} />
          <Route path="/product-type" element={<ProductType/>} />
          <Route path="/product" element={<ProductPage/>} />
          </Routes>
      </>
    );
  };
  
  export default Admin;
  