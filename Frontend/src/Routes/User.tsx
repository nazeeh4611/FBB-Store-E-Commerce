import React from "react";
import { Route, Routes } from "react-router-dom";
import Homepage from "../Components/User/HomePage";
import Shop from "../Components/User/Shop";
import ProductPage from "../Components/User/ProductDetail";
import CategoryPages from "../Components/User/Category";
import FilterProduct from "../Components/User/FilterProduct";


const User: React.FC = () => {
    return (
      <>
        <Routes>
          <Route path="/" element={<Homepage/>} />
          <Route path="/Shop" element={<Shop/>} />
          <Route path="/product" element={<ProductPage/>} />
          <Route path="/product/:id" element={<ProductPage/>}/>
          <Route path="/category" element={<CategoryPages/>}/>
          <Route path="/category/:category" element={<FilterProduct/>}/>
          </Routes>
      </>
    );
  };
  
  export default User;
  