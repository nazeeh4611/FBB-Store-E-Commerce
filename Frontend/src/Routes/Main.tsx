import React from "react";
import {Route, BrowserRouter as Router, Routes } from "react-router-dom";
import User from "./User";
import Admin from "./Admin";



const Approutes:React.FC = ()=>{

    return(
       
        <Router>
            <Routes>
                <Route path="/*" element={<User/>}/>
              
                <Route path="/admin/*" element={<Admin/>} />
            </Routes>
        </Router>
    )
}


export default Approutes