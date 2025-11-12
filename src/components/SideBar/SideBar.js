import React from "react";
import { NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";
import styles from './SideBar.module.css';
import { ReactComponent as HomeIcon } from '../../assets/home.svg';
import { ReactComponent as UserIcon } from '../../assets/user.svg';

function SideBar() {
  return (
    <nav className={styles.sidebar}>
      <Nav className={`flex-column ${styles.navContainer}`}>

        <NavLink
          to="/homepage"
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ""}`
          }
        >
          <HomeIcon className={styles.logo} alt="Trang chủ" />
          <span className={styles.linkText}>Trang chủ</span>
        </NavLink>

        <NavLink
          to="/justanotherpage"
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ""}`
          }
        >
          <UserIcon className={styles.logo} alt="Hồ sơ" />
          <span className={styles.linkText}>Hồ sơ</span>
        </NavLink>
      </Nav>
    </nav>
  );
}

export default SideBar;