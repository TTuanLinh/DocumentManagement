import React from 'react';
import { Navbar, Nav, Button, Badge } from 'react-bootstrap';

// Hàm tiện ích để rút gọn địa chỉ ví
function shortenAddress(address) {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

function AuthHeader({currentAccount, connectWallet}) {
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