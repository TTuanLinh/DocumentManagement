import React, { useState, useEffect, useCallback } from 'react'; // 1. Thêm useEffect và useCallback
import styles from './HomePage.module.css'; 
import UploadModal from './UploadModal/UploadModal';
import ViewModal from './ViewModal/ViewModal';
import { BrowserProvider, Contract } from 'ethers'; // 2. Import Ethers v6
import contractAbi from '../../abi.json'; // 3. Import ABI

// 4. ĐỊNH NGHĨA ĐỊA CHỈ CONTRACT (giống như UploadModal)
const CONTRACT_ADDRESS = "0x43dd59ac71f23b53c5422a60e37c327fb95e67f9";

function HomePage({ currentAccount, connectWallet }) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // 5. STATE MỚI ĐỂ LƯU DANH SÁCH GIẤY TỜ VÀ TRẠNG THÁI TẢI
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // 6. TẠO HÀM TẢI DỮ LIỆU
  // Chúng ta dùng useCallback để hàm này ổn định, tránh render lại không cần thiết
  const loadDocuments = useCallback(async () => {
    // Chỉ tải khi đã có tài khoản
    if (!currentAccount) {
      setDocuments([]); // Xóa list cũ nếu logout
      return;
    }

    setIsLoading(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      // **Quan trọng**: Dù là hàm "view", ta vẫn cần "signer"
      // vì hàm getDocuments() của bạn dùng "msg.sender"
      const signer = await provider.getSigner(); 
      const contract = new Contract(CONTRACT_ADDRESS, contractAbi, signer);

      const docs = await contract.getDocuments();

      // Ethers v6 trả về kết quả là một Mảng các "Struct"
      // Chúng ta có thể cần "dọn dẹp" nó một chút nếu cần
      console.log('Tải về:', docs);
      const formattedDocs = docs.map(doc => ({
        id: Number(doc.id), // Chuyển đổi
        docName: doc.docName,
        docType: doc.docType,
        ipfsHash: doc.ipfsHash,
        uploadTime: Number(doc.uploadTime) // Chuyển đổi
      }));
      setDocuments(formattedDocs);

    } catch (error) {
      console.error("Lỗi khi tải danh sách giấy tờ:", error);
      alert("Không thể tải danh sách giấy tờ. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }, [currentAccount]); // Phụ thuộc vào currentAccount

  // 7. GỌI HÀM TẢI DỮ LIỆU KHI COMPONENT LOAD HOẶC KHI TÀI KHOẢN THAY ĐỔI
  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]); // Gọi lại khi hàm loadDocuments thay đổi (tức là khi currentAccount thay đổi)

  const handleOpenModal = async () => {
    if (currentAccount) {
      setShowUploadModal(true);
    } else {
      alert("Vui lòng đăng nhập bằng ví để tiếp tục.");
      const connected = await connectWallet();
      if (connected) {
        setShowUploadModal(true);
      }
    }
  };

  // 8. HÀM ĐỂ TẢI LẠI DANH SÁCH SAU KHI UPLOAD THÀNH CÔNG
  const handleUploadSuccess = () => {
    setShowUploadModal(false); // Đóng modal
    loadDocuments(); // Tải lại dữ liệu
  };

  const handleViewClick = (doc) => {
    setSelectedDoc(doc); // Lưu lại tài liệu đã chọn
    setShowViewModal(true); // Mở ViewModal
  };

  // 9. HÀM RENDER NỘI DUNG BẢNG
  const renderTableBody = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan="4" style={{ textAlign: 'center' }}>Đang tải dữ liệu...</td>
        </tr>
      );
    }

    if (documents.length === 0) {
      return (
        <tr>
          <td colSpan="4" style={{ textAlign: 'center' }}>Không tìm thấy giấy tờ nào.</td>
        </tr>
      );
    }

    // Lặp qua mảng dữ liệu
    return documents.map((doc) => (
      <tr key={doc.id}> 
        <td>{doc.docName}</td>
        <td>{doc.docType}</td>
        <td>
          {/* Chuyển đổi timestamp (giây) sang ngày tháng */}
          {new Date(doc.uploadTime * 1000).toLocaleDateString()}
        </td>
        <td>
          <button className={styles.actionBtn} onClick={() => handleViewClick(doc)}>Xem</button>
          <button className={styles.actionBtnDanger}>Xóa</button>
        </td>
      </tr>
    ));
  };

  return (
    <div className={styles.HomeContent}>
      <div className={styles.HomeHeader}>
        <h2>Danh sách giấy tờ</h2>
        <button className={styles.addNewBtn} onClick={handleOpenModal}>
          + Thêm giấy tờ mới
        </button>
      </div>

      <div className={styles.documentList}>
        <table>
          <thead>
            <tr>
              <th>Tên giấy tờ</th>
              <th>Loại</th>
              <th>Ngày tải lên</th>
              <th>Hành động</th>
            </tr>
          </thead>
          {/* 10. SỬ DỤNG HÀM RENDER MỚI */}
          <tbody>
            {renderTableBody()}
          </tbody>
        </table>
      </div>
      
      <UploadModal 
        show={showUploadModal} 
        onHide={() => setShowUploadModal(false)} 
        onUploadSuccess={handleUploadSuccess} // 11. TRUYỀN PROP MỚI
      />
      <ViewModal 
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        doc={selectedDoc} // Truyền tài liệu đã chọn vào
      />
    </div>
  );
};

export default HomePage;