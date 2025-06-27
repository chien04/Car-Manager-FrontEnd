"use client"

import { useState } from "react"
import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom"

import CarManager from "./components/CarManager"
import BrandManager from "./components/BrandManager"
import RentalManager from "./components/RentalManager"
import UserManager from "./components/UserManager"
import UserRentCar from "./components/RentalByUser"
import Login from "./components/Login"
import "./App.css"

const adminTabs = [
  { id: "users", label: "Quản lý người dùng", icon: "👥", path: "/admin/users" },
  { id: "cars", label: "Quản lý xe", icon: "🚗", path: "/admin/cars" },
  { id: "brands", label: "Quản lý hãng xe", icon: "🏢", path: "/admin/brands" },
  { id: "rentals", label: "Quản lý thuê xe", icon: "📋", path: "/admin/rentals" },
]

const userTabs = [{ id: "rent", label: "Thuê xe", icon: "🚙", path: "/rentals" }]

// Component bảo vệ route
function RequireAuth({ children, role, requireRole }) {
  const token = localStorage.getItem("token")
  const userRole = localStorage.getItem("role")
  if (!token) return <Navigate to="/login" replace />
  if (requireRole && userRole !== requireRole) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"))
  const [role, setRole] = useState(localStorage.getItem("role") || "")

  // Xử lý đăng nhập thành công
  const handleLogin = (data) => {
    localStorage.setItem("token", data.token || data.jwt || "")
    localStorage.setItem("role", data.role || "")
    setIsLoggedIn(true)
    setRole(data.role || "")
  }

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    setIsLoggedIn(false)
    setRole("")
  }

  // Chọn tab theo role
  const tabs = role === "ROLE_ADMIN" ? adminTabs : userTabs

  return (
    <BrowserRouter>
      <div style={styles.container}>
        {/* Mobile Menu Button */}
        {isLoggedIn && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={styles.mobileMenuButton}
            className="mobile-menu-button"
          >
            {sidebarOpen ? "✕" : "☰"}
          </button>
        )}

        {/* Sidebar */}
        {isLoggedIn && (
          <div
            style={{
              ...styles.sidebar,
              ...(sidebarOpen ? styles.sidebarOpen : {}),
            }}
            className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}
          >
            <div style={styles.sidebarHeader}>
              <div style={styles.logo}>
                <span style={styles.logoIcon}>🚗</span>
              </div>
              <div style={styles.logoText}>
                <h2 style={styles.logoTitle}>Car Rental Pro</h2>
                <p style={styles.logoSubtitle}>Management System</p>
              </div>
            </div>

            <nav style={styles.nav}>
              {tabs.map((tab, index) => (
                <NavLink
                  key={tab.id}
                  to={tab.path}
                  style={({ isActive }) => ({
                    ...styles.navButton,
                    ...(isActive ? styles.navButtonActive : {}),
                    animationDelay: `${index * 0.1}s`,
                    textDecoration: "none",
                  })}
                  className={({ isActive }) => `nav-button${isActive ? " nav-button-active" : ""}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span style={styles.navIcon}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </NavLink>
              ))}
              <button onClick={handleLogout} style={styles.logoutButton}>
                <span style={styles.navIcon}>🚪</span>
                Đăng xuất
              </button>
            </nav>
          </div>
        )}

        {/* Overlay for mobile */}
        {sidebarOpen && isLoggedIn && <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />}

        {/* Main Content */}
        <div style={styles.main} className="main">
          {/* Header */}
          {isLoggedIn && (
            <header style={styles.header}>
              <div style={styles.headerContent}>
                <div style={styles.headerLeft}>
                  <h1 style={styles.headerTitle}>
                    {role === "ROLE_ADMIN" ? "🛠️ Admin Dashboard" : "🏠 Customer Portal"}
                  </h1>
                </div>
                <div style={styles.headerRight}>
                  <div style={styles.notificationButton}>
                    <span style={styles.notificationIcon}>🔔</span>
                    <span style={styles.notificationBadge}></span>
                  </div>
                  <div style={styles.userInfo}>
                    <div style={styles.userBadge}>
                      <span style={styles.userIcon}>{role === "ROLE_ADMIN" ? "👨‍💼" : "👤"}</span>
                      <span style={styles.userRole}>{role === "ROLE_ADMIN" ? "Admin" : "Customer"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </header>
          )}

          {/* Routes */}
          <main style={styles.content}>
            <Routes>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />

              {/* ADMIN ROUTES */}
              <Route
                path="/admin/users"
                element={
                  <RequireAuth role={role} requireRole="ROLE_ADMIN">
                    <div style={styles.pageWrapper}>
                      <UserManager apiPrefix="/api/admin" />
                    </div>
                  </RequireAuth>
                }
              />
              <Route
                path="/admin/cars"
                element={
                  <RequireAuth role={role} requireRole="ROLE_ADMIN">
                    <div style={styles.pageWrapper}>
                      <CarManager apiPrefix="/api/admin" />
                    </div>
                  </RequireAuth>
                }
              />
              <Route
                path="/admin/brands"
                element={
                  <RequireAuth role={role} requireRole="ROLE_ADMIN">
                    <div style={styles.pageWrapper}>
                      <BrandManager apiPrefix="/api/admin" />
                    </div>
                  </RequireAuth>
                }
              />
              <Route
                path="/admin/rentals"
                element={
                  <RequireAuth role={role} requireRole="ROLE_ADMIN">
                    <div style={styles.pageWrapper}>
                      <RentalManager apiPrefix="/api/admin" />
                    </div>
                  </RequireAuth>
                }
              />

              {/* USER ROUTES */}
              <Route
                path="/rentals"
                element={
                  <RequireAuth role={role} requireRole="ROLE_CUSTOMER">
                    <div style={styles.pageWrapper}>
                      <UserRentCar apiPrefix="/api/users" />
                    </div>
                  </RequireAuth>
                }
              />

              {/* Default redirect */}
              <Route
                path="*"
                element={
                  isLoggedIn ? (
                    role === "ROLE_ADMIN" ? (
                      <Navigate to="/admin/cars" replace />
                    ) : (
                      <Navigate to="/rentals" replace />
                    )
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f1f5f9",
    width: "100vw",
    maxWidth: "100%",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  mobileMenuButton: {
    position: "fixed",
    top: "20px",
    left: "20px",
    zIndex: 1001,
    display: "none",
    padding: "14px",
    backgroundColor: "#1e40af",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    boxShadow: "0 8px 25px rgba(30, 64, 175, 0.3)",
    transition: "all 0.3s ease",
    fontSize: "18px",
    fontWeight: "600",
  },
  sidebar: {
    width: "min(300px, 25vw)",
    backgroundColor: "#ffffff",
    color: "#1e293b",
    padding: "0",
    position: "fixed",
    height: "100vh",
    left: "-300px",
    top: 0,
    transition: "left 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    zIndex: 1000,
    overflowY: "auto",
    boxShadow: "8px 0 30px rgba(0, 0, 0, 0.12)",
    borderRight: "1px solid #e2e8f0",
  },
  sidebarOpen: {
    left: 0,
  },
  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "32px 24px",
    borderBottom: "2px solid #f1f5f9",
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
  },
  logo: {
    width: "56px",
    height: "56px",
    background: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)",
    transform: "rotate(-5deg)",
  },
  logoIcon: {
    fontSize: "28px",
    transform: "rotate(5deg)",
  },
  logoText: {
    flex: 1,
  },
  logoTitle: {
    fontSize: "22px",
    fontWeight: "800",
    margin: "0 0 4px 0",
    background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  logoSubtitle: {
    fontSize: "13px",
    color: "#64748b",
    margin: 0,
    fontWeight: "500",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    padding: "24px 16px",
  },
  navButton: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "16px 20px",
    backgroundColor: "transparent",
    color: "#475569",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    textAlign: "left",
    position: "relative",
    overflow: "hidden",
  },
  navButtonActive: {
    backgroundColor: "#3b82f6",
    color: "white",
    boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)",
    transform: "translateY(-2px)",
  },
  navIcon: {
    fontSize: "18px",
    width: "24px",
    textAlign: "center",
  },
  logoutButton: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "16px 20px",
    backgroundColor: "transparent",
    color: "#dc2626",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    textAlign: "left",
    marginTop: "32px",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    zIndex: 999,
    backdropFilter: "blur(8px)",
  },
  main: {
    flex: 1,
    marginLeft: "min(300px, 25vw)",
    transition: "margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    width: "calc(100vw - min(300px, 25vw))",
    maxWidth: "calc(100vw - min(300px, 25vw))",
    boxSizing: "border-box",
  },
  header: {
    backgroundColor: "#ffffff",
    borderBottom: "2px solid #f1f5f9",
    padding: "20px 32px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  headerContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {},
  headerTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e293b",
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  notificationButton: {
    position: "relative",
    padding: "12px",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "2px solid #e2e8f0",
  },
  notificationIcon: {
    fontSize: "20px",
  },
  notificationBadge: {
    position: "absolute",
    top: "8px",
    right: "8px",
    width: "10px",
    height: "10px",
    backgroundColor: "#ef4444",
    borderRadius: "50%",
    border: "2px solid white",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  userBadge: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 16px",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    border: "2px solid #e2e8f0",
  },
  userIcon: {
    fontSize: "18px",
  },
  userRole: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#475569",
  },
  content: {
    flex: 1,
    backgroundColor: "#f8fafc",
    overflowY: "auto",
    overflowX: "hidden",
  },
  pageWrapper: {
    padding: "32px",
    minHeight: "calc(100vh - 100px)",
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
  },
}

// CSS cho responsive
const mediaQueryCSS = `
@media (max-width: 1024px) {
  .main {
    margin-left: 0 !important;
    width: 100vw !important;
    max-width: 100vw !important;
  }
  
  .mobile-menu-button {
    display: flex !important;
  }
  
  .sidebar {
    width: 280px !important;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 100vw !important;
  }
}

/* Hover effects */
.nav-button:hover {
  background-color: #f1f5f9 !important;
  transform: translateX(4px);
}

.nav-button-active:hover {
  background-color: #2563eb !important;
  transform: translateY(-2px) translateX(0px) !important;
}

/* Animation cho sidebar items */
.nav-button {
  animation: slideInLeft 0.3s ease forwards;
  opacity: 0;
  transform: translateX(-20px);
}

@keyframes slideInLeft {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Smooth scrollbar */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
`

// Inject CSS
if (typeof document !== "undefined") {
  const style = document.createElement("style")
  style.textContent = mediaQueryCSS
  document.head.appendChild(style)
}
