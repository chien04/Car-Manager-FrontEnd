"use client"

import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom"

import CarManager from "./components/CarManager"
import BrandManager from "./components/BrandManager"
import RentalManager from "./components/RentalManager"
import UserManager from "./components/UserManager"
import { Car, Users, Building2, FileText, Menu, X } from "lucide-react"
import "./App.css" // Import CSS

const tabs = [
  { id: "users", label: "Quản lý người dùng", icon: Users, path: "/users" },
  { id: "cars", label: "Quản lý xe", icon: Car, path: "/cars" },
  { id: "brands", label: "Quản lý hãng xe", icon: Building2, path: "/brands" },
  { id: "rentals", label: "Quản lý thuê xe", icon: FileText, path: "/rentals" },
]

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    // Thêm viewport meta tag nếu chưa có
    const viewport = document.querySelector('meta[name="viewport"]')
    if (!viewport) {
      const meta = document.createElement("meta")
      meta.name = "viewport"
      meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      document.head.appendChild(meta)
    }

    // Auto-scale nếu cần thiết
    const handleResize = () => {
      const screenWidth = window.innerWidth
      const minWidth = 1200 // Minimum width for full scale

      if (screenWidth < minWidth) {
        const scale = Math.max(0.8, screenWidth / minWidth)
        document.body.style.transform = `scale(${scale})`
        document.body.style.transformOrigin = "top left"
        document.body.style.width = `${100 / scale}%`
        document.body.style.height = `${100 / scale}%`
      } else {
        document.body.style.transform = "none"
        document.body.style.width = "100%"
        document.body.style.height = "100%"
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <BrowserRouter>
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
                <NavLink
                  key={tab.id}
                  to={tab.path}
                  style={({ isActive }) => ({
                    ...styles.navButton,
                    ...(isActive ? styles.navButtonActive : {}),
                    animationDelay: `${index * 0.1}s`,
                  })}
                  className={({ isActive }) => `nav-button${isActive ? " nav-button-active" : ""}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />}

        {/* Main Content */}
        <div style={styles.main} className="main">
          <Routes>
            <Route path="/users" element={<UserManager />} />
            <Route path="/cars" element={<CarManager />} />
            <Route path="/brands" element={<BrandManager />} />
            <Route path="/rentals" element={<RentalManager />} />
            <Route path="*" element={<RentalManager />} /> {/* Default route */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    width: "100vw",
    maxWidth: "100%",
    position: "relative",
    overflow: "hidden",
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
    width: "min(280px, 25vw)",
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
    marginLeft: "min(280px, 25vw)",
    transition: "margin-left 0.3s ease",
    minHeight: "100vh",
    maxHeight: "100vh",
    overflowY: "auto",
    overflowX: "hidden",
    padding: "20px",
    width: "calc(100vw - min(280px, 25vw))",
    maxWidth: "calc(100vw - min(280px, 25vw))",
    boxSizing: "border-box",
  },
}
