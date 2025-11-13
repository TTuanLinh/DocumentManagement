// ViewModal.js
import React, { useState, useEffect } from 'react';
import styles from './ViewModal.module.css'; // Sẽ tạo ở bước 3
import axios from 'axios';
import CryptoJS from 'crypto-js';

// Hàm helper để render nội dung đã giải mã
const renderDecryptedContent = (dataUrl, docName) => {
  if (dataUrl.startsWith('data:image/')) {
    // Nếu là ảnh
    return <img src={dataUrl} alt={docName} className={styles.decryptedImage} />;
  }
  if (dataUrl.startsWith('data:application/pdf')) {
    // Nếu là PDF
    return <embed src={dataUrl} type="application/pdf" width="100%" height="400px" />;
  }
  // Nếu là các loại file khác (vd: .doc, .txt)
  return (
    <div>
      <p>Không thể hiển thị tệp này. Vui lòng tải về.</p>
      <a href={dataUrl} download={docName} className={styles.downloadLink}>
        Tải xuống {docName}
      </a>
    </div>
  );
};

function ViewModal({ show, onHide, doc }) {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState('');
  const [decryptedContent, setDecryptedContent] = useState(null); // Lưu data URL

  // Reset state mỗi khi modal được mở (hoặc doc thay đổi)
  useEffect(() => {
    if (show) {
      setPassword('');
      setIsLoading(false);
      setLoadingMessage('');
      setError('');
      setDecryptedContent(null);
    }
  }, [show]);

  if (!show || !doc) {
    return null;
  }

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  // HÀM XỬ LÝ GIẢI MÃ
  const handleDecrypt = async () => {
    if (!password) {
      setError('Vui lòng nhập mật khẩu giải mã.');
      return;
    }

    setIsLoading(true);
    setError('');
    setLoadingMessage('Đang tải tệp đã mã hóa từ IPFS...');

    // 1. Tải tệp đã mã hóa từ IPFS qua gateway của Pinata
    const url = `https://gateway.pinata.cloud/ipfs/${doc.ipfsHash}`;
    try {
      const res = await axios.get(url);
      const encryptedData = res.data; // Đây là chuỗi đã mã hóa

      setLoadingMessage('Đang giải mã tệp...');

      // 2. Giải mã tệp
      const bytes = CryptoJS.AES.decrypt(encryptedData, password);
      const decryptedDataUrl = bytes.toString(CryptoJS.enc.Utf8); // Ra lại data URL

      // 3. Kiểm tra xem giải mã có thành công không
      if (decryptedDataUrl && decryptedDataUrl.startsWith('data:')) {
        setDecryptedContent(decryptedDataUrl); // Thành công!
      } else {
        throw new Error('Mật khẩu sai hoặc tệp bị hỏng.');
      }
    } catch (e) {
      console.error('Lỗi giải mã:', e);
      setError('Lỗi: Mật khẩu sai hoặc không thể tải tệp.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={onHide}>
      <div className={styles.modalContent} onClick={handleModalClick}>
        <div className={styles.modalHeader}>
          <h2>Chi tiết giấy tờ</h2>
          <button className={styles.closeButton} onClick={onHide}>&times;</button>
        </div>

        <div className={styles.modalBody}>
          {/* Hiển thị thông tin cơ bản */}
          <div className={styles.docInfo}>
            <strong>Tên:</strong> {doc.docName}
          </div>
          <div className={styles.docInfo}>
            <strong>Loại:</strong> {doc.docType}
          </div>
          
          <hr />

          {/* Phần logic hiển thị */}
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <p>{loadingMessage}</p>
            </div>
          ) : decryptedContent ? (
            // 3. Đã giải mã thành công -> Hiển thị nội dung
            <div className={styles.decryptedArea}>
              <h4>Nội dung tệp:</h4>
              {renderDecryptedContent(decryptedContent, doc.docName)}
            </div>
          ) : (
            // 1. Ban đầu -> Yêu cầu mật khẩu
            <div className={styles.formGroup}>
              <label htmlFor="decryptPassword">Nhập mật khẩu để xem</label>
              <input 
                type="password" 
                id="decryptPassword" 
                className={styles.formInput} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <small className={styles.errorText}>{error}</small>}
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={onHide}>
            Đóng
          </button>
          {/* Chỉ hiển thị nút "Giải mã" khi chưa giải mã thành công */}
          {!decryptedContent && (
            <button 
              className={`${styles.btn} ${styles.btnPrimary}`} 
              onClick={handleDecrypt}
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : 'Giải mã & Xem'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewModal;