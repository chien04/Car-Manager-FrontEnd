"use client"

import { useState } from "react"
import axios from "axios"

const API_URL = "http://localhost:8080/auth/login"

export default function Login({ onLogin }) {
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await axios.post(API_URL, { userName, password })
      if (onLogin) onLogin(res.data)
    } catch (err) {
      setError("Sai tài khoản hoặc mật khẩu!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* Logo and Brand */}
        <div style={styles.brandSection}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🚗</span>
          </div>
          <div style={styles.brandText}>
            <h1 style={styles.brandTitle}>Car Rental Pro</h1>
            <p style={styles.brandSubtitle}>Đăng nhập để tiếp tục</p>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Đăng nhập</h2>
            <p style={styles.cardDescription}>Nhập thông tin tài khoản của bạn</p>
          </div>

          <div style={styles.cardContent}>
            {error && (
              <div style={styles.alertError}>
                <span style={styles.alertIcon}>⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>👤</span>
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>🔒</span>
                  Mật khẩu
                </label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.submitButton,
                  ...(loading ? styles.submitButtonDisabled : {}),
                }}
              >
                {loading ? (
                  <>
                    <span style={styles.spinner}></span>
                    Đang đăng nhập...
                  </>
                ) : (
                  "🚀 Đăng nhập"
                )}
              </button>
            </form>

            <div style={styles.footer}>
              <p style={styles.footerText}>
                Chưa có tài khoản? <span style={styles.footerLink}>Đăng ký ngay</span>
              </p>
            </div>
          </div>
        </div>

        <div style={styles.copyright}>
          <p>© 2024 Car Rental Pro. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  wrapper: {
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  brandSection: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
  },
  logo: {
    width: "80px",
    height: "80px",
    background: "linear-gradient(135deg, #3182ce 0%, #2c5282 100%)",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
  },
  logoIcon: {
    fontSize: "2.5rem",
  },
  brandText: {
    color: "white",
  },
  brandTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    margin: "0 0 8px 0",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
  },
  brandSubtitle: {
    fontSize: "1rem",
    margin: 0,
    opacity: 0.9,
  },
  card: {
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  cardHeader: {
    padding: "32px 32px 16px 32px",
    textAlign: "center",
  },
  cardTitle: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#2d3748",
    margin: "0 0 8px 0",
  },
  cardDescription: {
    fontSize: "1rem",
    color: "#718096",
    margin: 0,
  },
  cardContent: {
    padding: "16px 32px 32px 32px",
  },
  alertError: {
    backgroundColor: "#fed7d7",
    border: "1px solid #fc8181",
    color: "#c53030",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.9rem",
  },
  alertIcon: {
    fontSize: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "0.95rem",
    fontWeight: "500",
    color: "#2d3748",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  labelIcon: {
    fontSize: "1rem",
  },
  input: {
    padding: "16px 20px",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "1rem",
    transition: "all 0.2s ease",
    outline: "none",
    backgroundColor: "white",
  },
  submitButton: {
    padding: "16px 24px",
    background: "linear-gradient(135deg, #3182ce 0%, #2c5282 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    boxShadow: "0 4px 15px rgba(49, 130, 206, 0.4)",
    marginTop: "8px",
  },
  submitButtonDisabled: {
    background: "#a0aec0",
    cursor: "not-allowed",
    boxShadow: "none",
  },
  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid transparent",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  footer: {
    textAlign: "center",
    marginTop: "24px",
    paddingTop: "20px",
    borderTop: "1px solid #e2e8f0",
  },
  footerText: {
    fontSize: "0.9rem",
    color: "#718096",
    margin: 0,
  },
  footerLink: {
    color: "#3182ce",
    fontWeight: "500",
    cursor: "pointer",
    textDecoration: "underline",
  },
  copyright: {
    textAlign: "center",
    color: "white",
    fontSize: "0.8rem",
    opacity: 0.8,
  },
}

// CSS Animation for spinner
const spinKeyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`

// Inject CSS animation
if (typeof document !== "undefined") {
  const style = document.createElement("style")
  style.textContent = spinKeyframes
  document.head.appendChild(style)
}
