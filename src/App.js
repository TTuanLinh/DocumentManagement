import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import './App.css';

import SideBar from "./components/SideBar/SideBar";
import HomePage from "./pages/HomePage/HomePage";
import JustAnotherPage from "./pages/HomePage/JustAnotherPage";
import AuthHeader from "./components/AuthHeader/AuthHeader";
import RightColumn from "./components/RightColumn/RightColumn";

function App(){
  return(
    <BrowserRouter>
      <div className="rootLayout">
        <AuthHeader></AuthHeader>
        <div className="appWrapper">
          <SideBar></SideBar>
          <main className="mainContent">
            <Routes>
              <Route path="/" element={<HomePage></HomePage>} />
              <Route path="/homepage" element={<HomePage></HomePage>} />
              <Route path="/justanotherpage" element={<JustAnotherPage></JustAnotherPage>} />
            </Routes>
          </main>
          <RightColumn></RightColumn>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App;
