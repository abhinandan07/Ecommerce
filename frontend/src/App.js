import './App.css';
import Header from "./component/layout/Header/Header.js";
import {BrowserRouter , Route, Routes }  from "react-router-dom";
import WebFont from "webfontloader"
import React from 'react';
import Footer from "./component/layout/Footer/Footer.js"
import Home  from "./component/Home/Home.js";
import ProductDetails from "./component/Product/ProductDetails.js"



function App() {
  React.useEffect(()=>{
    WebFont.load({
      google:{
        families:["Roboto","Droid Sans","Chilanka"]
      }
    })
 },[])


  return( 
  <BrowserRouter>
  <div>
    <Header />
    <Routes>
    <Route exact path= "/" element={<Home />} />
    <Route exact path= "/product/:id" element={ <ProductDetails/>} />
    
    </Routes>
      <Footer />
      </div>
  </BrowserRouter> 
  );
    
    
  
}

export default App;
