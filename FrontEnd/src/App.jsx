import React from 'react';
import {Routes,Route} from "react-router-dom";
import LandingPage from './LandingPage';
import RegisterPage from './Register';
import LoginPage from './Login';

const App = () => {
  return (
    <Routes>
      
      <Route path="/" element={<LandingPage/>}/>
      <Route path="/register" element={<RegisterPage/>}/>
      <Route path="/login" element={<LoginPage/>}/>
    </Routes>
  )
}

export default App