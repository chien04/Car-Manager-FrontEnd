"use client"

import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { Plus, Edit, Trash2, Car, DollarSign, Package, X } from "lucide-react"

const API_URL = "http://localhost:8080/api/v1/cars"

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e3f2fd 0%, #e8eaf6 100%)",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
  },
  maxWidth: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "32px",
  },
  headerTitle: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "8px",
  },
  iconContainer: {
    padding: "8px",
    backgroundColor: "#1976d2",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#1a1a1a",
    margin: 0,
  },
  subtitle: {
    color: "#666",
    fontSize: "16px",
    margin: 0,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "24px",
    marginBottom: "32px",
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    border: "1px solid #e0e0e0",
  },
  statContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statText: {
    fontSize: "14px",
    color: "#666",
    margin: "0 0 4px 0",
  },
  statNumber: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#1a1a1a",
    margin: 0,
  },
  statIcon: {
    padding: "12px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  mainCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    border: "1px solid #e0e0e0",
  },
  cardHeader: {
    padding: "24px",
    borderBottom: "1px solid #e0e0e0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1a1a1a",
    margin: "0 0 4px 0",
  },
  cardSubtitle: {
    color: "#666",
    fontSize: "14px",
    margin: 0,
  },
  button: {
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    padding: "12px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.2s",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "12px 16px",
    fontWeight: "600",
    color: "#1a1a1a",
    borderBottom: "1px solid #e0e0e0",
  },
  td: {
    padding: "12px 16px",
    borderBottom: "1px solid #f0f0f0",
  },
  tr: {
    transition: "background-color 0.2s",
  },
  badge: {
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "500",
  },
  badgeGreen: {
    backgroundColor: "#e8f5e8",
    color: "#2e7d32",
  },
  badgeRed: {
    backgroundColor: "#ffebee",
    color: "#c62828",
  },
  badgeGray: {
    backgroundColor: "#f5f5f5",
    color: "#424242",
  },
  actionButton: {
    padding: "8px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    margin: "0 2px",
    transition: "background-color 0.2s",
  },
  editButton: {
    backgroundColor: "#e3f2fd",
    color: "#1976d2",
  },
  deleteButton: {
    backgroundColor: "#ffebee",
    color: "#d32f2f",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    width: "100%",
    maxWidth: "400px",
    margin: "16px",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
  },
  modalTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1a1a1a",
    margin: 0,
  },
  closeButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#666",
    padding: "4px",
  },
  formGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#333",
    marginBottom: "4px",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
    marginTop: "24px",
  },
  cancelButton: {
    flex: 1,
    padding: "12px",
    border: "1px solid #ddd",
    backgroundColor: "white",
    color: "#666",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.2s",
  },
  submitButton: {
    flex: 1,
    padding: "12px",
    border: "none",
    backgroundColor: "#1976d2",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.2s",
  },
}

// Component Modal riêng biệt để tránh re-render
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>{title}</h3>
          <button onClick={onClose} style={styles.closeButton}>
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function CarManager() {
  const [cars, setCars] = useState([])
  const [newCar, setNewCar] = useState({
    model: "",
    price: "",
    amount: "",
    brandId: "",
  })
  const [editingCar, setEditingCar] = useState(null)
  const [editCarData, setEditCarData] = useState({
    model: "",
    price: "",
    amount: "",
  })
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async () => {
    try {
      const response = await axios.get(API_URL)
      setCars(response.data)
    } catch (error) {
      alert("Lỗi khi lấy danh sách xe!")
    }
  }

  // Sử dụng useCallback để tránh re-render không cần thiết
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target
    setNewCar((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleEditInputChange = useCallback((e) => {
    const { name, value } = e.target
    setEditCarData((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleAddCar = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...newCar,
        price: Number.parseInt(newCar.price, 10),
        amount: Number.parseInt(newCar.amount, 10),
        brandId: Number.parseInt(newCar.brandId, 10),
      }
      await axios.post(API_URL, payload)
      setNewCar({ model: "", price: "", amount: "", brandId: "" })
      setIsAddModalOpen(false)
      fetchCars()
    } catch (error) {
      alert("Lỗi khi thêm xe mới!")
    }
  }

  const handleDeleteCar = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa xe này?")) {
      try {
        await axios.delete(`${API_URL}/${id}`)
        fetchCars()
      } catch (error) {
        console.error("Error deleting car:", error)
        alert("Xe đang được thuê không thể xoá!")
      }
    }
  }

  const handleEditClick = (car) => {
    setEditingCar(car.id)
    setEditCarData({
      model: car.model,
      price: car.price.toString(),
      amount: car.amount.toString(),
    })
    setIsEditModalOpen(true)
  }

  const handleUpdateCar = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        model: editCarData.model,
        price: Number.parseInt(editCarData.price, 10),
        amount: Number.parseInt(editCarData.amount, 10),
      }
      await axios.put(`${API_URL}/${editingCar}`, payload)
      setEditingCar(null)
      setIsEditModalOpen(false)
      fetchCars()
    } catch (error) {
      alert("Lỗi khi cập nhật xe!")
    }
  }

  const handleCancelEdit = () => {
    setEditingCar(null)
    setIsEditModalOpen(false)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerTitle}>
            <div style={styles.iconContainer}>
              <Car size={24} color="white" />
            </div>
            <h1 style={styles.title}>Quản lý xe</h1>
          </div>
          <p style={styles.subtitle}>Quản lý danh sách xe và thông tin chi tiết</p>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statContent}>
              <div>
                <p style={styles.statText}>Tổng số xe</p>
                <p style={styles.statNumber}>{cars.length}</p>
              </div>
              <div style={{ ...styles.statIcon, backgroundColor: "#e3f2fd" }}>
                <Car size={24} color="#1976d2" />
              </div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statContent}>
              <div>
                <p style={styles.statText}>Tổng số lượng</p>
                <p style={styles.statNumber}>{cars.reduce((sum, car) => sum + car.amount, 0)}</p>
              </div>
              <div style={{ ...styles.statIcon, backgroundColor: "#e8f5e8" }}>
                <Package size={24} color="#2e7d32" />
              </div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statContent}>
              <div>
                <p style={styles.statText}>Giá trị trung bình</p>
                <p style={styles.statNumber}>
                  {cars.length > 0
                    ? formatPrice(cars.reduce((sum, car) => sum + car.price, 0) / cars.length)
                    : formatPrice(0)}
                </p>
              </div>
              <div style={{ ...styles.statIcon, backgroundColor: "#fff3e0" }}>
                <DollarSign size={24} color="#f57c00" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.mainCard}>
          <div style={styles.cardHeader}>
            <div>
              <h2 style={styles.cardTitle}>Danh sách xe</h2>
              <p style={styles.cardSubtitle}>Quản lý thông tin các loại xe trong hệ thống</p>
            </div>
            <button onClick={() => setIsAddModalOpen(true)} style={styles.button}>
              <Plus size={16} />
              Thêm xe mới
            </button>
          </div>

          <div style={{ padding: "24px" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Model</th>
                    <th style={styles.th}>Giá</th>
                    <th style={styles.th}>Số lượng</th>
                    <th style={styles.th}>Brand</th>
                    <th style={{ ...styles.th, textAlign: "right" }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ ...styles.td, textAlign: "center", padding: "32px", color: "#666" }}>
                        Chưa có xe nào trong hệ thống
                      </td>
                    </tr>
                  ) : (
                    cars.map((car) => (
                      <tr key={car.id} style={styles.tr}>
                        <td style={{ ...styles.td, fontWeight: "500" }}>#{car.id}</td>
                        <td style={{ ...styles.td, fontWeight: "500" }}>{car.model}</td>
                        <td style={{ ...styles.td, color: "#2e7d32", fontWeight: "600" }}>{formatPrice(car.price)}</td>
                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.badge,
                              ...(car.amount > 0 ? styles.badgeGreen : styles.badgeRed),
                            }}
                          >
                            {car.amount} xe
                          </span>
                        </td>
                        <td style={styles.td}>
                          <span style={{ ...styles.badge, ...styles.badgeGray }}>{car.brand}</span>
                        </td>
                        <td style={{ ...styles.td, textAlign: "right" }}>
                          <button
                            onClick={() => handleEditClick(car)}
                            style={{ ...styles.actionButton, ...styles.editButton }}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCar(car.id)}
                            style={{ ...styles.actionButton, ...styles.deleteButton }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add Car Modal */}
        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Thêm xe mới">
          <form onSubmit={handleAddCar}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Model xe</label>
              <input
                type="text"
                name="model"
                placeholder="Nhập model xe"
                value={newCar.model}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Giá (VND)</label>
              <input
                type="number"
                name="price"
                placeholder="Nhập giá xe"
                value={newCar.price}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Số lượng</label>
              <input
                type="number"
                name="amount"
                placeholder="Nhập số lượng"
                value={newCar.amount}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Brand ID</label>
              <input
                type="number"
                name="brandId"
                placeholder="Nhập Brand ID"
                value={newCar.brandId}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.buttonGroup}>
              <button type="button" onClick={() => setIsAddModalOpen(false)} style={styles.cancelButton}>
                Hủy
              </button>
              <button type="submit" style={styles.submitButton}>
                Thêm xe
              </button>
            </div>
          </form>
        </Modal>

        {/* Edit Car Modal */}
        <Modal isOpen={isEditModalOpen} onClose={handleCancelEdit} title="Chỉnh sửa xe">
          <form onSubmit={handleUpdateCar}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Model xe</label>
              <input
                type="text"
                name="model"
                placeholder="Nhập model xe"
                value={editCarData.model}
                onChange={handleEditInputChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Giá (VND)</label>
              <input
                type="number"
                name="price"
                placeholder="Nhập giá xe"
                value={editCarData.price}
                onChange={handleEditInputChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Số lượng</label>
              <input
                type="number"
                name="amount"
                placeholder="Nhập số lượng"
                value={editCarData.amount}
                onChange={handleEditInputChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.buttonGroup}>
              <button type="button" onClick={handleCancelEdit} style={styles.cancelButton}>
                Hủy
              </button>
              <button type="submit" style={styles.submitButton}>
                Cập nhật
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  )
}

export default CarManager
