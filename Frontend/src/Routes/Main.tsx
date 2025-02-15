import React from "react";
import {Route, BrowserRouter as Router, Routes } from "react-router-dom";
import User from "./User";
import Admin from "./Admin";
import ScrollToTop from "../Components/Layouts/Scoll";



const Approutes:React.FC = ()=>{

    return(
       
        <Router>
            <ScrollToTop />
            <Routes>
                <Route path="/*" element={<User/>}/>
              
                <Route path="/admin/*" element={<Admin/>} />
            </Routes>
        </Router>
    )
}


export default Approutes