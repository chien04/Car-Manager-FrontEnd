import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CarManager from "./components/CarManager";
import BrandManager from './components/BrandManager';
import RentalManager from "./components/RentalManager";
import UserManager from "./components/UserManager";
import { Car, Users, Building2, FileText, Menu, X } from "lucide-react"
import "./app.css" // Import CSS

export default function App() {
  const [activeTab, setActiveTab] = useState("rentals")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const tabs = [
    { id: "users", label: "Quản lý người dùng", icon: Users, component: UserManager },
    { id: "cars", label: "Quản lý xe", icon: Car, component: CarManager },
    { id: "brands", label: "Quản lý hãng xe", icon: Building2, component: BrandManager },
    { id: "rentals", label: "Quản lý thuê xe", icon: FileText, component: RentalManager }

  ]

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component

  return (
    <div style={styles.container}>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={styles.mobileMenuButton}
        className="mobile-menu-button"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        style={{
          ...styles.sidebar,
          ...(sidebarOpen ? styles.sidebarOpen : {}),
        }}
        className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}
      >
        <div style={styles.sidebarHeader}>
          <div style={styles.logo}>
            <Car size={32} color="white" />
          </div>
          <h2 style={styles.logoText}>Car Rental Pro</h2>
        </div>

        <nav style={styles.nav}>
          {tabs.map((tab, index) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setSidebarOpen(false)
                }}
                style={{
                  ...styles.navButton,
                  ...(activeTab === tab.id ? styles.navButtonActive : {}),
                  animationDelay: `${index * 0.1}s`,
                }}
                className={`nav-button ${activeTab === tab.id ? "nav-button-active" : ""}`}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <div style={styles.main} className="main">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    width: "100%",
    position: "relative",
  },
  mobileMenuButton: {
    position: "fixed",
    top: "20px",
    left: "20px",
    zIndex: 1001,
    display: "none",
    padding: "12px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    transition: "all 0.2s ease",
  },
  sidebar: {
    width: "280px",
    backgroundColor: "#1e293b",
    color: "white",
    padding: "24px",
    position: "fixed",
    height: "100vh",
    left: "-280px",
    top: 0,
    transition: "left 0.3s ease",
    zIndex: 1000,
    overflowY: "auto",
    boxShadow: "4px 0 20px rgba(0, 0, 0, 0.1)",
  },
  sidebarOpen: {
    left: 0,
  },
  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "32px",
    paddingBottom: "24px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  },
  logo: {
    width: "48px",
    height: "48px",
    backgroundColor: "#3b82f6",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
  },
  logoText: {
    fontSize: "20px",
    fontWeight: "700",
    margin: 0,
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  navButton: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    backgroundColor: "transparent",
    color: "rgba(255, 255, 255, 0.7)",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
    textAlign: "left",
    position: "relative",
    overflow: "hidden",
  },
  navButtonActive: {
    backgroundColor: "#3b82f6",
    color: "white",
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
    backdropFilter: "blur(4px)",
  },
  main: {
    flex: 1,
    marginLeft: "280px",
    transition: "margin-left 0.3s ease",
    minHeight: "100vh", // Thay đổi từ height
    overflowY: "auto", // Thêm scroll
    overflowX: "hidden", // Ẩn scroll ngang
    padding: "0", // Bỏ padding để tránh conflict
  },
}