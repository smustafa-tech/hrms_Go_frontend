import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
    Home, 
    UsersRound,
    UserRoundPlus,
    UserCircle2,
    Wallet,
    Menu,
    X,
} from "lucide-react";
import styles from "./Navigation.module.css";
import { Button } from "@/components/ui/Button";

import logo from "/logo.png";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/", icon: Home},
    { name: "HR Management", href: "/hrmanagement", icon: UsersRound},
    { name: "Hiring management", href: "/hiringmanagement", icon: UserRoundPlus},
    { name: "Pricing", href: "/pricing", icon: Wallet},
    { name: "About", href: "/about", icon: UserCircle2},
  ]

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.navContent}>

          <div className={styles.navLogo}>
            <Link to="/" className={styles.navBrandLink}>
              <img src={logo} alt="" />
              <span className={styles.navBrandText}>Lean.HR</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className={styles.desktopNav}>
            { navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link 
                  key={item.name} 
                  to={item.href} 
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <Link to={"/login"}>
              <Button variant="outline">Login</Button>
            </Link>
            <Link to={"/register"}>
              <Button>Get Started</Button>  
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={styles.mobileMenuButton}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className={styles.mobileMenu}>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`${styles.mobileNavLink} ${
                    isActive ? styles.mobileNavLinkActive : ""
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className={styles.mobileButtonContainer}>
              <Link to={"/register"}>
                <Button
                  onClick={() => setIsOpen(false)}
                  style={{ width: "100%" }}
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}