"use client"

import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { Plus, Edit2, Trash2, Save, X, Car, Globe, Loader2 } from "lucide-react"

const CAR_API = "https://car-manager-kqaj.onrender.com/api/v1/brands"
// const API_URL = "http://localhost:8080/api/v1/brands"

function BrandManager() {
  const [brands, setBrands] = useState([])
  const [newBrand, setNewBrand] = useState({ name: "", country: "" })
  const [editingBrand, setEditingBrand] = useState(null)
  const [editBrandData, setEditBrandData] = useState({ name: "", country: "" })
  const [loading, setLoading] = useState(false)
  const [addingBrand, setAddingBrand] = useState(false)
  const [updatingBrand, setUpdatingBrand] = useState(false)
  const [deletingBrandId, setDeletingBrandId] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(API_URL)
      setBrands(response.data)
    } catch (error) {
      setError("Lỗi khi lấy danh sách hãng xe!")
      console.error("Fetch brands error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target
    setNewBrand((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleAddBrand = async (e) => {
    e.preventDefault()
    if (!newBrand.name.trim() || !newBrand.country.trim()) {
      setError("Vui lòng điền đầy đủ thông tin!")
      return
    }

    setAddingBrand(true)
    setError(null)
    try {
      await axios.post(API_URL, newBrand)
      setNewBrand({ name: "", country: "" })
      await fetchBrands()
    } catch (error) {
      setError("Lỗi khi thêm hãng xe!")
      console.error("Add brand error:", error)
    } finally {
      setAddingBrand(false)
    }
  }

  const handleEditClick = useCallback((brand) => {
    setEditingBrand(brand.id)
    setEditBrandData({ name: brand.name, country: brand.country })
    setError(null)
  }, [])

  const handleEditInputChange = useCallback((e) => {
    const { name, value } = e.target
    setEditBrandData((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleUpdateBrand = async (e) => {
    e.preventDefault()
    if (!editBrandData.name.trim() || !editBrandData.country.trim()) {
      setError("Vui lòng điền đầy đủ thông tin!")
      return
    }

    setUpdatingBrand(true)
    setError(null)
    try {
      await axios.put(`${API_URL}/${editingBrand}`, editBrandData)
      setEditingBrand(null)
      setEditBrandData({ name: "", country: "" })
      await fetchBrands()
    } catch (error) {
      setError("Lỗi khi cập nhật hãng xe!")
      console.error("Update brand error:", error)
    } finally {
      setUpdatingBrand(false)
    }
  }

  const handleCancelEdit = useCallback(() => {
    setEditingBrand(null)
    setEditBrandData({ name: "", country: "" })
    setError(null)
  }, [])

  const handleDeleteBrand = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa hãng xe này?")) return

    setDeletingBrandId(id)
    setError(null)
    try {
      await axios.delete(`${API_URL}/${id}`)
      await fetchBrands()
    } catch (error) {
      setError("Brand không thể xóa vì có xe liên kết!")
      console.error("Delete brand error:", error)
    } finally {
      setDeletingBrandId(null)
    }
  }

  const containerStyle = {
    maxWidth: "1200px",
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
    display: "flex",
    gap: "12px",
    alignItems: "end",
    flexWrap: "wrap",
  }

  const inputGroupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    minWidth: "200px",
  }

  const labelStyle = {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
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

  const buttonStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
    outline: "none",
  }

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#3b82f6",
    color: "white",
  }

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#f3f4f6",
    color: "#374151",
  }

  const dangerButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#ef4444",
    color: "white",
  }

  const successButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#10b981",
    color: "white",
  }

  const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#9ca3af",
    color: "white",
    cursor: "not-allowed",
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }

  const loadingStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    color: "#6b7280",
    gap: "12px",
  }

  const spinnerStyle = {
    animation: "spin 1s linear infinite",
  }

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>
        <Car size={32} />
        Quản lý hãng xe
      </h1>

      {error && (
        <div style={errorStyle}>
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            style={{
              background: "none",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
              color: "#dc2626",
            }}
          >
            ×
          </button>
        </div>
      )}

      <div style={cardStyle}>
        <h2 style={{ marginBottom: "20px", color: "#1e293b", fontSize: "20px", fontWeight: "600" }}>
          Thêm hãng xe mới
        </h2>
        <form onSubmit={handleAddBrand} style={formStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Tên hãng xe</label>
            <input
              type="text"
              name="name"
              placeholder="Nhập tên hãng xe"
              value={newBrand.name}
              onChange={handleInputChange}
              required
              style={inputStyle}
              disabled={addingBrand}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Quốc gia</label>
            <input
              type="text"
              name="country"
              placeholder="Nhập quốc gia"
              value={newBrand.country}
              onChange={handleInputChange}
              required
              style={inputStyle}
              disabled={addingBrand}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            />
          </div>
          <button
            type="submit"
            style={addingBrand ? disabledButtonStyle : primaryButtonStyle}
            disabled={addingBrand}
            onMouseEnter={(e) => !addingBrand && (e.target.style.backgroundColor = "#2563eb")}
            onMouseLeave={(e) => !addingBrand && (e.target.style.backgroundColor = "#3b82f6")}
          >
            {addingBrand ? (
              <>
                <Loader2 size={16} style={spinnerStyle} />
                Đang thêm...
              </>
            ) : (
              <>
                <Plus size={16} />
                Thêm hãng xe
              </>
            )}
          </button>
        </form>
      </div>

      <div style={cardStyle}>
        <h2 style={{ marginBottom: "20px", color: "#1e293b", fontSize: "20px", fontWeight: "600" }}>
          Danh sách hãng xe ({brands.length})
        </h2>

        {loading && brands.length === 0 ? (
          <div style={loadingStyle}>
            <Loader2 size={32} style={spinnerStyle} />
            <span>Đang tải...</span>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Tên hãng xe</th>
                  <th style={thStyle}>Quốc gia</th>
                  <th style={thStyle}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {brands.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ ...tdStyle, textAlign: "center", padding: "40px", color: "#6b7280" }}>
                      Chưa có hãng xe nào trong hệ thống
                    </td>
                  </tr>
                ) : (
                  brands.map((brand) => (
                    <tr key={brand.id}>
                      <td style={tdStyle}>#{brand.id}</td>
                      <td style={tdStyle}>
                        {editingBrand === brand.id ? (
                          <input
                            type="text"
                            name="name"
                            value={editBrandData.name}
                            onChange={handleEditInputChange}
                            style={inputStyle}
                            disabled={updatingBrand}
                            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                            autoFocus
                          />
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <Car size={16} />
                            {brand.name}
                          </div>
                        )}
                      </td>
                      <td style={tdStyle}>
                        {editingBrand === brand.id ? (
                          <input
                            type="text"
                            name="country"
                            value={editBrandData.country}
                            onChange={handleEditInputChange}
                            style={inputStyle}
                            disabled={updatingBrand}
                            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                          />
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <Globe size={16} />
                            {brand.country}
                          </div>
                        )}
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          {editingBrand === brand.id ? (
                            <>
                              <button
                                onClick={handleUpdateBrand}
                                style={updatingBrand ? disabledButtonStyle : successButtonStyle}
                                disabled={updatingBrand}
                                onMouseEnter={(e) => !updatingBrand && (e.target.style.backgroundColor = "#059669")}
                                onMouseLeave={(e) => !updatingBrand && (e.target.style.backgroundColor = "#10b981")}
                              >
                                {updatingBrand ? <Loader2 size={16} style={spinnerStyle} /> : <Save size={16} />}
                                {updatingBrand ? "Đang lưu..." : "Lưu"}
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                style={updatingBrand ? disabledButtonStyle : secondaryButtonStyle}
                                disabled={updatingBrand}
                                onMouseEnter={(e) => !updatingBrand && (e.target.style.backgroundColor = "#e5e7eb")}
                                onMouseLeave={(e) => !updatingBrand && (e.target.style.backgroundColor = "#f3f4f6")}
                              >
                                <X size={16} />
                                Hủy
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditClick(brand)}
                                style={deletingBrandId === brand.id ? disabledButtonStyle : secondaryButtonStyle}
                                disabled={deletingBrandId === brand.id}
                                onMouseEnter={(e) =>
                                  deletingBrandId !== brand.id && (e.target.style.backgroundColor = "#e5e7eb")
                                }
                                onMouseLeave={(e) =>
                                  deletingBrandId !== brand.id && (e.target.style.backgroundColor = "#f3f4f6")
                                }
                              >
                                <Edit2 size={16} />
                                Sửa
                              </button>
                              <button
                                onClick={() => handleDeleteBrand(brand.id)}
                                style={deletingBrandId === brand.id ? disabledButtonStyle : dangerButtonStyle}
                                disabled={deletingBrandId === brand.id}
                                onMouseEnter={(e) =>
                                  deletingBrandId !== brand.id && (e.target.style.backgroundColor = "#dc2626")
                                }
                                onMouseLeave={(e) =>
                                  deletingBrandId !== brand.id && (e.target.style.backgroundColor = "#ef4444")
                                }
                              >
                                {deletingBrandId === brand.id ? (
                                  <Loader2 size={16} style={spinnerStyle} />
                                ) : (
                                  <Trash2 size={16} />
                                )}
                                {deletingBrandId === brand.id ? "Đang xóa..." : "Xóa"}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// Add CSS animations
const styleSheet = document.createElement("style")
styleSheet.textContent = `
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`
document.head.appendChild(styleSheet)

export default BrandManager
