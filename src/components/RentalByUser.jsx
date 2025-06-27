"use client"

import { useEffect, useState } from "react"
import axios from "../AxiosConfig"

const API_CARS = "http://localhost:8080/api/cars"
const API_RENT = "http://localhost:8080/api/rentals"

export default function UserRentCar() {
  const [cars, setCars] = useState([])
  const [carId, setCarId] = useState("")
  const [rentalDate, setRentalDate] = useState("")
  const [days, setDays] = useState(1)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const fetchCars = () => {
    axios
      .get(API_CARS)
      .then((res) => setCars(res.data))
      .catch(() => setError("Không lấy được danh sách xe!"))
  }

  useEffect(() => {
    fetchCars()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setError("")

    try {
      await axios.post(API_RENT, {
        carId,
        rentalDate,
        days,
      })
      setMessage("Thuê xe thành công!")
      setCarId("")
      setRentalDate("")
      setDays(1)
      fetchCars()
    } catch (err) {
      setError("Thuê xe thất bại!")
      setMessage("")
    } finally {
      setLoading(false)
    }
  }

  const selectedCar = cars.find((car) => car.id === carId)

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>🚗 Thuê xe</h1>
          <p style={styles.subtitle}>Chọn xe và thời gian thuê phù hợp với bạn</p>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>
              <span style={styles.icon}>🚙</span>
              Thông tin thuê xe
            </h2>
            <p style={styles.cardDescription}>Vui lòng điền đầy đủ thông tin để thuê xe</p>
          </div>

          <div style={styles.cardContent}>
            {error && (
              <div style={styles.alertError}>
                <span style={styles.alertIcon}>⚠️</span>
                {error}
              </div>
            )}

            {message && (
              <div style={styles.alertSuccess}>
                <span style={styles.alertIcon}>✅</span>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>🚗</span>
                  Chọn xe
                </label>
                <select value={carId} onChange={(e) => setCarId(e.target.value)} required style={styles.select}>
                  <option value="">-- Chọn xe --</option>
                  {cars.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.model} (Còn {car.amount})
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>📅</span>
                  Ngày thuê
                </label>
                <input
                  type="date"
                  value={rentalDate}
                  onChange={(e) => setRentalDate(e.target.value)}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>⏰</span>
                  Số ngày thuê
                </label>
                <input
                  type="number"
                  value={days}
                  min={1}
                  max={30}
                  onChange={(e) => setDays(Number(e.target.value))}
                  required
                  style={styles.input}
                />
              </div>

              {selectedCar && (
                <div style={styles.selectedCarCard}>
                  <h4 style={styles.selectedCarTitle}>Thông tin xe đã chọn</h4>
                  <div style={styles.selectedCarInfo}>
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Mẫu xe:</span>
                      <span style={styles.infoValue}>{selectedCar.model}</span>
                    </div>
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Số lượng còn:</span>
                      <span style={styles.infoValue}>{selectedCar.amount} xe</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !carId || !rentalDate}
                style={{
                  ...styles.submitButton,
                  ...(loading || !carId || !rentalDate ? styles.submitButtonDisabled : {}),
                }}
              >
                {loading ? (
                  <>
                    <span style={styles.spinner}></span>
                    Đang gửi yêu cầu...
                  </>
                ) : (
                  "🚗 Thuê xe ngay"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e3f2fd 0%, #e8eaf6 100%)",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  wrapper: {
    maxWidth: "600px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  header: {
    textAlign: "center",
    marginBottom: "8px",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#1a202c",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#4a5568",
    margin: 0,
  },
  card: {
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  cardHeader: {
    padding: "24px 24px 16px 24px",
    borderBottom: "1px solid #e2e8f0",
  },
  cardTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#2d3748",
    margin: "0 0 8px 0",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  cardDescription: {
    fontSize: "0.95rem",
    color: "#718096",
    margin: 0,
  },
  cardContent: {
    padding: "24px",
  },
  icon: {
    fontSize: "1.2rem",
  },
  alertError: {
    backgroundColor: "#fed7d7",
    border: "1px solid #fc8181",
    color: "#c53030",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.9rem",
  },
  alertSuccess: {
    backgroundColor: "#c6f6d5",
    border: "1px solid #68d391",
    color: "#2f855a",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "16px",
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
    gap: "6px",
  },
  labelIcon: {
    fontSize: "1rem",
  },
  input: {
    padding: "12px 16px",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "1rem",
    transition: "all 0.2s ease",
    outline: "none",
    backgroundColor: "white",
  },
  select: {
    padding: "12px 16px",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "1rem",
    transition: "all 0.2s ease",
    outline: "none",
    backgroundColor: "white",
    cursor: "pointer",
  },
  selectedCarCard: {
    backgroundColor: "#ebf8ff",
    border: "2px solid #bee3f8",
    borderRadius: "12px",
    padding: "16px",
  },
  selectedCarTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#2c5282",
    margin: "0 0 12px 0",
  },
  selectedCarInfo: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  infoLabel: {
    fontSize: "0.85rem",
    color: "#4a5568",
  },
  infoValue: {
    fontSize: "0.95rem",
    fontWeight: "500",
    color: "#2d3748",
  },
  submitButton: {
    padding: "16px 24px",
    backgroundColor: "#3182ce",
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
    boxShadow: "0 4px 12px rgba(49, 130, 206, 0.3)",
  },
  submitButtonDisabled: {
    backgroundColor: "#a0aec0",
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
