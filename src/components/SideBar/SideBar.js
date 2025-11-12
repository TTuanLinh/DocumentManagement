import React from "react";
import { NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";
import styles from './SideBar.module.css';
import { ReactComponent as HomeIcon } from '../../assets/home.svg';
import { ReactComponent as UserIcon } from '../../assets/user.svg';
import { ReactComponent as SignOutIcon } from '../../assets/cross.svg';

function SideBar({ handleSignOut }) {
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
          to="/profile"
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ""}`
          }
        >
          <UserIcon className={styles.logo} alt="Hồ sơ" />
          <span className={styles.linkText}>Hồ sơ</span>
        </NavLink>

        <Nav.Link 
          className={styles.navLinkOut}
          onClick={handleSignOut}
        >
          <SignOutIcon className={styles.logo} alt="Đăng xuất" />
          <span className={styles.linkText}>Đăng xuất</span>
        </Nav.Link>
      </Nav>
    </nav>
  );
}

export default SideBar;