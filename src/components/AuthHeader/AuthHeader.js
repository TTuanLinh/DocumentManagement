import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Button, Badge } from 'react-bootstrap';
import { ethers } from 'ethers'; // Import ethers

// Hàm tiện ích để rút gọn địa chỉ ví
function shortenAddress(address) {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

function AuthHeader() {
  const [currentAccount, setCurrentAccount] = useState(null);

  // 1. Hàm kiểm tra xem ví đã kết nối chưa
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Bạn cần cài đặt MetaMask!");
      return;
    }
    
    // Lấy danh sách tài khoản
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      setCurrentAccount(accounts[0]); // Đặt tài khoản nếu đã có
    } else {
      console.log("Chưa có tài khoản nào được kết nối.");
    }
  };

  // 2. Hàm kết nối ví khi nhấn nút
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Bạn cần cài đặt MetaMask!");
        return;
      }
      
      // Yêu cầu kết nối ví
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      
      setCurrentAccount(accounts[0]); // Đặt tài khoản sau khi kết nối
    } catch (error) {
      console.error(error);
    }
  };

  // 3. Chạy hàm kiểm tra 1 lần khi component được tải
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []); // Mảng rỗng đảm bảo nó chỉ chạy 1 lần

  return (
    <Navbar bg="white" variant="white" expand="lg">
      <Navbar.Brand href="#home" className="ms-3">
        Quản lý giấy tờ
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        {/* ms-auto đẩy nội dung sang phải */}
        <Nav className="ms-auto me-3">
          
          {/* 4. Logic hiển thị:
              - Nếu 'currentAccount' là null (chưa kết nối), hiển thị Button
              - Nếu 'currentAccount' có giá trị (đã kết nối), hiển thị Badge
          */}
          {currentAccount ? (
            <Badge pill bg="dark" text="white" className="p-2">
              Đã kết nối: {shortenAddress(currentAccount)}
            </Badge>
          ) : (
            <Button variant="primary" onClick={connectWallet}>
              Đăng nhập
            </Button>
          )}

        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AuthHeader;