import React from 'react';
import styles from './HomePage.module.css'; 

function HomePage() {
  return (
    <div className={styles.HomeContent}>
      <div className={styles.HomeHeader}>
        <h2>Danh sách giấy tờ</h2>
        <button className={styles.addNewBtn}>
          + Thêm giấy tờ mới
        </button>
      </div>

      {/* Table */}
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
          <tbody>
            <tr>
              <td>Căn cước công dân</td>
              <td>Giấy tờ tùy thân</td>
              <td>10/11/2025</td>
              <td>
                <button className={styles.actionBtn}>Xem</button>
                <button className={styles.actionBtnDanger}>Xóa</button>
              </td>
            </tr>
            <tr>
              <td>Bằng lái xe A1</td>
              <td>Giấy tờ tùy thân</td>
              <td>05/10/2025</td>
              <td>
                <button className={styles.actionBtn}>Xem</button>
                <button className={styles.actionBtnDanger}>Xóa</button>
              </td>
            </tr>
            <tr>
              <td>Hợp đồng lao động</td>
              <td>Hợp đồng</td>
              <td>01/01/2025</td>
              <td>
                <button className={styles.actionBtn}>Xem</button>
                <button className={styles.actionBtnDanger}>Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HomePage;