import React from "react";
import SearchBox from "../SearchBox/SearchBox";
import styles from './RightColumn.module.css';

function RightColumn(){
  return(
    <aside className={styles.rightColumn}>
      {/*Search box*/}
      <SearchBox></SearchBox>
    </aside>
  )
}

export default RightColumn;