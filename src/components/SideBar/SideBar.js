import React from "react";
import { Link } from "react-router";
import { Nav } from "react-bootstrap";
import styles from './SideBar.module.css'
import menuIcon from '../../assets/menu.png'
import homeIcon from '../../assets/home.png'
import accIcon from '../../assets/user.png'

function SideBar(){
  return(
    <Nav className={styles.sidebar}>
      <Nav.Link href="#menu" className={styles.menu}>
        <img src={menuIcon} className={styles.logo} alt="Menu"/>
        <span className={styles.linkText}>Danh mục</span>
      </Nav.Link>

      <Nav.Link as={Link} to="/homepage" className={styles.navLink}>
        <img src={homeIcon} className={styles.logo} alt="Trang chủ"/>
        <span className={styles.linkText}>Trang chủ</span>
      </Nav.Link>

      <Nav.Link as={Link} to="/justanotherpage" className={styles.navLink}>
        <img src={accIcon} className={styles.logo} alt="Hồ sơ"/>
        <span className={styles.linkText}>Hồ sơ</span>
      </Nav.Link>
    </Nav>
  )
}

export default SideBar;