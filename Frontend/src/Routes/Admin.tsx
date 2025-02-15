import React from "react";
import { Route, Routes } from "react-router-dom";
import Homepage from "../Components/User/HomePage";
import Shop from "../Components/User/Shop";
import CategoryManager from "../Components/Admin/Category";
import ProductPage from "../Components/Admin/Product";
import SubCategory from "../Components/Admin/Subcategory";
import ProductType from "../Components/Admin/ProductType";
import AdminLogin from "../Components/Admin/Login";
import Protect from "./Protect/Protected";
import ReProtect from "./Protect/ReverseProtect";


const Admin: React.FC = () => {
    return (
      <>
        <Routes>
          <Route path="/category" element={<CategoryManager/>} />
          <Route path="/sub-category" element={<Protect component={SubCategory}/>} />
          <Route path="/product-type" element={<Protect component={ProductType}/>} />
          <Route path="/product" element={<Protect component={ProductPage}/>} />
          <Route path="/login" element={<ReProtect component={AdminLogin}/>} />
          </Routes>
      </>
    );
  };
  
  export default Admin;
  