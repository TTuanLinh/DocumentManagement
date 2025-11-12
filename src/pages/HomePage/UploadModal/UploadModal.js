import { useState } from 'react';
import React from 'react';
import styles from './UploadModal.module.css'; 
import axios from 'axios';
import CryptoJS from 'crypto-js';

import { BrowserProvider, Contract } from 'ethers';
import contractAbi from '../../../abi.json';

const CONTRACT_ADDRESS = "0x43dd59ac71f23b53c5422a60e37c327fb95e67f9"; 

function UploadModal({ show, onHide, onUploadSuccess }) {
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('');
  const [docFile, setDocFile] = useState(null);
  const [docPassword, setDocPassword] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!show) { return null; }
  const handleModalClick = (e) => { e.stopPropagation(); };
  const handleFileChange = (e) => {
    if (e.target.files) { setDocFile(e.target.files[0]); }
  };

  const handleUpload = async () => {
    if (!docFile || !docName || !docType || !docPassword) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    setIsLoading(true);

    try {
      // ===== BƯỚC A: MÃ HÓA FILE =====
      setLoadingMessage('Đang mã hóa file...');
      const fileReader = new FileReader();

      const fileData = await new Promise((resolve, reject) => {
        fileReader.onload = () => resolve(fileReader.result);
        fileReader.onerror = (err) => reject(err);
        fileReader.readAsDataURL(docFile);
      });
      
      const encrypted = CryptoJS.AES.encrypt(fileData, docPassword).toString();
      const encryptedFile = new Blob([encrypted]);

      // ===== BƯỚC B: TẢI LÊN PINATA =====
      setLoadingMessage('Đang tải file lên IPFS (Pinata)...');
      
      const formData = new FormData();
      formData.append('file', encryptedFile, `${docFile.name}.encrypted`);
      const metadata = JSON.stringify({ name: docName, type: docType });
      formData.append('pinataMetadata', metadata);

      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_PINATA_JWT}`,
          }
        }
      );

      const ipfsHash = res.data.IpfsHash;
      console.log("IPFS Hash (CID):", ipfsHash);

      // ===== BƯỚC C: GỬI GIAO DỊCH LÊN BLOCKCHAIN (v6) =====
      setLoadingMessage('Đang chờ xác nhận từ ví (Brave Wallet)...');
      
      if (typeof window.ethereum === 'undefined') {
        throw new Error('Không tìm thấy ví! Vui lòng cài đặt Brave Wallet.');
      }
      
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // ===== SỬA 2: PROVIDER & SIGNER CHO V6 =====
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(); // Thêm "await"

      // ===== SỬA 3: CONTRACT CHO V6 =====
      const contract = new Contract(CONTRACT_ADDRESS, contractAbi, signer);

      // 8. GỌI HÀM SMART CONTRACT
      const tx = await contract.addDocument(docName, docType, ipfsHash);

      setLoadingMessage('Đang xử lý giao dịch trên Blockchain...');
      
      await tx.wait();

      // ===== HOÀN TẤT =====
      setLoadingMessage('Hoàn tất! Đã lưu lên Blockchain.');
      alert('Tải lên và lưu trữ thành công!');
      setIsLoading(false);
      onUploadSuccess();
      onHide();
      
    } catch (error) {
      console.error('Lỗi trong quá trình tải lên:', error);
      if (error.code === 4001) {
        alert('Lỗi: Bạn đã từ chối giao dịch trên ví.');
      } else {
        alert(`Đã xảy ra lỗi: ${error.message}`);
      }
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  // ... (Phần return JSX của bạn giữ nguyên, không thay đổi) ...
  return (
    <div className={styles.modalBackdrop} onClick={onHide}>
      <div className={styles.modalContent} onClick={handleModalClick}>
        
        <div className={styles.modalHeader}>
          <h2>Thêm giấy tờ mới</h2>
          <button className={styles.closeButton} onClick={onHide} disabled={isLoading}>&times;</button>
        </div>

        <div className={styles.modalBody}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <p>{loadingMessage}</p>
            </div>
          ) : (
            <form>
              <div className={styles.formGroup}>
                <label htmlFor="docName">Tên giấy tờ</label>
                <input type="text" id="docName" className={styles.formInput} 
                  placeholder="Vd: Căn cước công dân" 
                  value={docName} 
                  onChange={(e) => setDocName(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="docType">Loại giấy tờ</label>
                <select id="docType" className={styles.formInput}
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}>
                  <option value="">-- Chọn loại --</option>
                  <option value="tuythan">Giấy tờ tùy thân</option>
                  <option value="bangcap">Bằng cấp</option>
                  <option value="hopdong">Hợp đồng</option>
                  <option value="suckhoe">Sức khỏe</option>
                  <option value="khac">Khác</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="docFile">Chọn File</label>
                <input type="file" id="docFile" className={styles.formInput} 
                  onChange={handleFileChange} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="docPassword">Mật khẩu mã hóa</label>
                <input type="password" id="docPassword" className={styles.formInput} 
                  value={docPassword}
                  onChange={(e) => setDocPassword(e.target.value)} />
                <small className={styles.formHint}>
                  Quan trọng: Mật khẩu này dùng để mã hóa file. 
                  Bạn PHẢI nhớ nó để xem lại file.
                </small>
              </div>
            </form>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button 
            className={`${styles.btn} ${styles.btnSecondary}`} 
            onClick={onHide}
            disabled={isLoading}>
            Hủy
          </button>
          <button 
            className={`${styles.btn} ${styles.btnPrimary}`} 
            onClick={handleUpload}
            disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : 'Tải lên'}
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default UploadModal;