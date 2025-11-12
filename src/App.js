import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, redirect } from "react-router-dom";
import './App.css';

import SideBar from "./components/SideBar/SideBar";
import HomePage from "./pages/HomePage/HomePage";
import Profile from "./pages/Profile/Profile";
import AuthHeader from "./components/AuthHeader/AuthHeader";
import RightColumn from "./components/RightColumn/RightColumn";

function App(){
  const [currentAccount, setCurrentAccount] = useState(null);

  // 1. LOGIC TỪ AUTHHEADER ĐƯỢC CHUYỂN LÊN ĐÂY
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Bạn cần cài đặt MetaMask!");
      return;
    }
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    if (accounts.length !== 0) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log("Chưa có tài khoản nào được kết nối.");
    }
  };

  // 2. LOGIC CONNECT (Trả về true/false để báo thành công)
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Bạn cần cài đặt Wallet!");
        return false;
      }
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentAccount(accounts[0]);
      return true; // Kết nối thành công
    } catch (error) {
      console.error(error);
      return false; // Kết nối thất bại
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []); // Chạy 1 lần

  const handleSignOut = () => {
    setCurrentAccount(null);
    alert("Đã đăng xuất!");
    redirect("/");
  };

  return(
    <BrowserRouter>
      <div className="rootLayout">
        <AuthHeader currentAccount={currentAccount} connectWallet={connectWallet}/>
        <div className="appWrapper">
          <SideBar handleSignOut={handleSignOut}/>
          <main className="mainContent">
            <Routes>
              <Route path="/" element={<Navigate to="/homepage" replace />} />
              <Route path="/homepage" element={<HomePage currentAccount={currentAccount} connectWallet={connectWallet}/>} />
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
