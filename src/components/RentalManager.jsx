"use client"

import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { Plus, Calendar, Clock, User, Car, DollarSign, FileText } from "lucide-react"

const RENTAL_API = "http://localhost:8080/api/v1/rentals"
const CAR_API = "http://localhost:8080/api/v1/cars"
const USER_API = "http://localhost:8080/api/v1/users"

function RentalManager() {
  const [rentals, setRentals] = useState([])
  const [cars, setCars] = useState([])
  const [users, setUsers] = useState([])
  const [newRental, setNewRental] = useState({
    userId: "",
    carId: "",
    rentalDate: "",
    rentalDays: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchRentals()
    fetchCars()
    fetchUsers()
  }, [])

  const fetchRentals = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(RENTAL_API)
      setRentals(response.data)
    } catch (error) {
      setError("Lỗi khi lấy danh sách thuê xe!")
    } finally {
      setLoading(false)
    }
  }

  const fetchCars = async () => {
    try {
      const response = await axios.get(CAR_API)
      setCars(response.data)
    } catch (error) {
      setError("Lỗi khi lấy danh sách xe!")
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await axios.get(USER_API)
      setUsers(response.data)
    } catch (error) {
      // Nếu không có API user thì bỏ qua
      console.warn("Không thể lấy danh sách người dùng")
    }
  }

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target
    setNewRental((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleRentCar = async (e) => {
    e.preventDefault()
    if (!newRental.userId || !newRental.carId || !newRental.rentalDate || !newRental.rentalDays) {
      setError("Vui lòng điền đầy đủ thông tin!")
      return
    }

    setLoading(true)
    setError(null)
    try {
      const payload = {
        userId: Number.parseInt(newRental.userId, 10),
        carId: Number.parseInt(newRental.carId, 10),
        rentalDate: newRental.rentalDate,
        rentalDays: Number.parseInt(newRental.rentalDays, 10),
      }
      await axios.post(RENTAL_API, payload)
      setNewRental({ userId: "", carId: "", rentalDate: "", rentalDays: "" })
      fetchRentals()
    } catch (error) {
      setError("Lỗi khi thuê xe!")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  const containerStyle = {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "24px",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  }

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "32px",
    color: "#1e293b",
    fontSize: "28px",
    fontWeight: "700",
  }

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    marginBottom: "24px",
  }

  const formStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    alignItems: "end",
  }

  const inputGroupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  }

  const labelStyle = {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  }

  const inputStyle = {
    padding: "12px 16px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    transition: "all 0.2s",
    outline: "none",
  }

  const inputFocusStyle = {
    ...inputStyle,
    borderColor: "#3b82f6",
    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
  }

  const selectStyle = {
    ...inputStyle,
    cursor: "pointer",
  }

  const buttonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "12px 24px",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
    outline: "none",
    backgroundColor: "#3b82f6",
    color: "white",
  }

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  }

  const thStyle = {
    padding: "16px",
    textAlign: "left",
    backgroundColor: "#f8fafc",
    fontWeight: "600",
    color: "#374151",
    borderBottom: "1px solid #e5e7eb",
  }

  const tdStyle = {
    padding: "16px",
    borderBottom: "1px solid #f1f5f9",
  }

  const errorStyle = {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "16px",
    border: "1px solid #fecaca",
  }

  const loadingStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    color: "#6b7280",
  }

  const statsStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  }

  const statCardStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  }

  const totalRentals = rentals.length
  const totalRevenue = rentals.reduce((sum, rental) => sum + rental.totalPrice, 0)

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>
        <FileText size={32} />
        Quản lý thuê xe
      </h1>

      {error && <div style={errorStyle}>{error}</div>}

      {/* Statistics */}
      <div style={statsStyle}>
        <div style={statCardStyle}>
          <div style={{ padding: "12px", backgroundColor: "#dbeafe", borderRadius: "8px" }}>
            <FileText size={24} color="#3b82f6" />
          </div>
          <div>
            <div style={{ fontSize: "24px", fontWeight: "700", color: "#1e293b" }}>{totalRentals}</div>
            <div style={{ fontSize: "14px", color: "#6b7280" }}>Tổng số thuê xe</div>
          </div>
        </div>
        <div style={statCardStyle}>
          <div style={{ padding: "12px", backgroundColor: "#dcfce7", borderRadius: "8px" }}>
            <DollarSign size={24} color="#10b981" />
          </div>
          <div>
            <div style={{ fontSize: "24px", fontWeight: "700", color: "#1e293b" }}>{formatCurrency(totalRevenue)}</div>
            <div style={{ fontSize: "14px", color: "#6b7280" }}>Tổng doanh thu</div>
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <h2 style={{ marginBottom: "20px", color: "#1e293b", fontSize: "20px", fontWeight: "600" }}>
          Tạo đơn thuê xe mới
        </h2>
        <form onSubmit={handleRentCar} style={formStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              <User size={16} />
              Người thuê
            </label>
            <select
              name="userId"
              value={newRental.userId}
              onChange={handleInputChange}
              required
              style={selectStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, selectStyle)}
            >
              <option value="">Chọn người thuê</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              <Car size={16} />
              Xe
            </label>
            <select
              name="carId"
              value={newRental.carId}
              onChange={handleInputChange}
              required
              style={selectStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, selectStyle)}
            >
              <option value="">Chọn xe</option>
              {cars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.model}
                </option>
              ))}
            </select>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              <Calendar size={16} />
              Ngày thuê
            </label>
            <input
              type="date"
              name="rentalDate"
              value={newRental.rentalDate}
              onChange={handleInputChange}
              required
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              <Clock size={16} />
              Số ngày thuê
            </label>
            <input
              type="number"
              name="rentalDays"
              placeholder="Nhập số ngày"
              value={newRental.rentalDays}
              onChange={handleInputChange}
              required
              min="1"
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            />
          </div>

          <button
            type="submit"
            style={buttonStyle}
            disabled={loading}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#2563eb")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#3b82f6")}
          >
            <Plus size={16} />
            {loading ? "Đang xử lý..." : "Tạo đơn thuê"}
          </button>
        </form>
      </div>

      <div style={cardStyle}>
        <h2 style={{ marginBottom: "20px", color: "#1e293b", fontSize: "20px", fontWeight: "600" }}>
          Danh sách thuê xe
        </h2>

        {loading && rentals.length === 0 ? (
          <div style={loadingStyle}>Đang tải...</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Ngày thuê</th>
                  <th style={thStyle}>Số ngày thuê</th>
                  <th style={thStyle}>Ngày trả</th>
                  <th style={thStyle}>Người thuê</th>
                  <th style={thStyle}>Tên xe</th>
                  <th style={thStyle}>Tổng tiền</th>
                </tr>
              </thead>
              <tbody>
                {rentals.map((rental) => (
                  <tr key={rental.id}>
                    <td style={tdStyle}>#{rental.id}</td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Calendar size={16} color="#6b7280" />
                        {formatDate(rental.rentalDate)}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Clock size={16} color="#6b7280" />
                        {rental.rentalDays} ngày
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Calendar size={16} color="#6b7280" />
                        {formatDate(rental.returnDate)}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <User size={16} color="#6b7280" />
                        {rental.username}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Car size={16} color="#6b7280" />
                        {rental.carName}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontWeight: "600",
                          color: "#10b981",
                        }}
                      >
                        {formatCurrency(rental.totalPrice)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default RentalManager
