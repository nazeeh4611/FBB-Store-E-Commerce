import React from "react";
import { Route, Routes } from "react-router-dom";
import Homepage from "../Components/User/HomePage";
import Shop from "../Components/User/Shop";
import CategoryManager from "../Components/Admin/Category";
import ProductPage from "../Components/Admin/Product";


const Admin: React.FC = () => {
    return (
      <>
        <Routes>
          <Route path="/category" element={<CategoryManager/>} />
          <Route path="/product" element={<ProductPage/>} />
          </Routes>
      </>
    );
  };
  
  export default Admin;
  