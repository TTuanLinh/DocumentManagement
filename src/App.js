import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css';

import SideBar from "./components/SideBar/SideBar";
import HomePage from "./pages/HomePage/HomePage";
import Profile from "./pages/Profile/Profile";
import AuthHeader from "./components/AuthHeader/AuthHeader";
import RightColumn from "./components/RightColumn/RightColumn";

function App(){
  return(
    <BrowserRouter>
      <div className="rootLayout">
        <AuthHeader />
        <div className="appWrapper">
          <SideBar />
          <main className="mainContent">
            <Routes>
              <Route path="/" element={<Navigate to="/homepage" replace />} />
              <Route path="/homepage" element={<HomePage />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <RightColumn />
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App;
