import React from "react";
import SearchBox from "../SearchBox/SearchBox";
import styles from './RightColumn.module.css';

function RightColumn(){
  return(
    <aside className={styles.rightColumn}>
      {/*Search box*/}
      <SearchBox></SearchBox>

      {/*Other component*/}
      <div className={styles.widget}>
        <h5>Sắp hết hạn</h5>
        <p>Bằng lái xe - Hết hạn sau 30 ngày</p>
        <p>...</p>
      </div>

      {/*Other component*/}
      <div className={styles.widget}>
        <h5>Lọc theo tag</h5>
        <p>Tag1, Tag2, Tag2, ...</p>
        <p>...</p>
      </div>
    </aside>
  )
}

export default RightColumn;