import React from "react";
import { BrowserRouter, Routes, Router, Route } from "react-router";
import './App.css';

import SideBar from "./components/SideBar/SideBar";
import HomePage from "./pages/HomePage/HomePage";
import JustAnotherPage from "./pages/HomePage/JustAnotherPage";

function App(){
  return(
    <BrowserRouter>
      <div className="appWrapper">
        <SideBar />
        <main className="mainContent">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/justanotherpage" element={<JustAnotherPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App;
