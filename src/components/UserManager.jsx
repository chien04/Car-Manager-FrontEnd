"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Plus, Edit2, Trash2, Save, X, User, Users, Eye, EyeOff, Loader2 } from "lucide-react"

const USER_API = "https://car-manager-kqaj.onrender.com/api/v1/users"
// const API_URL = "http://localhost:8080/api/v1/users"

function UserManager() {
  const [users, setUsers] = useState([])
  const [newUser, setNewUser] = useState({ userName: "", password: "" })
  const [editingUser, setEditingUser] = useState(null)
  const [editUserData, setEditUserData] = useState({ userName: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [addingUser, setAddingUser] = useState(false)
  const [updatingUser, setUpdatingUser] = useState(false)
  const [deletingUserId, setDeletingUserId] = useState(null)
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState({})
  const [expandedUser, setExpandedUser] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get(API_URL)
      setUsers(res.data)
    } catch (err) {
      setError("Lỗi khi lấy danh sách người dùng!")
      console.error("Fetch users error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value })
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    if (!newUser.userName.trim() || !newUser.password.trim()) {
      setError("Vui lòng điền đầy đủ thông tin!")
      return
    }

    setAddingUser(true)
    setError(null)
    try {
      await axios.post(API_URL, newUser)
      setNewUser({ userName: "", password: "" })
      setShowPassword({ ...showPassword, new: false })
      await fetchUsers()
    } catch (err) {
      setError("Lỗi khi thêm người dùng!")
      console.error("Add user error:", err)
    } finally {
      setAddingUser(false)
    }
  }

  const handleEditClick = (user) => {
    setEditingUser(user.id)
    setEditUserData({ userName: user.username, password: "" })
    setError(null)
  }

  const handleEditInputChange = (e) => {
    setEditUserData({ ...editUserData, [e.target.name]: e.target.value })
  }

  const handleUpdateUser = async (e) => {
    e.preventDefault()
    if (!editUserData.userName.trim()) {
      setError("Tên đăng nhập không được để trống!")
      return
    }

    setUpdatingUser(true)
    setError(null)
    try {
      await axios.put(`${API_URL}/${editingUser}`, editUserData)
      setEditingUser(null)
      setEditUserData({ userName: "", password: "" })
      await fetchUsers()
    } catch (err) {
      setError("Lỗi khi cập nhật người dùng!")
      console.error("Update user error:", err)
    } finally {
      setUpdatingUser(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingUser(null)
    setEditUserData({ userName: "", password: "" })
    setError(null)
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá người dùng này?")) return

    setDeletingUserId(id)
    setError(null)
    try {
      await axios.delete(`${API_URL}/${id}`)
      await fetchUsers()
    } catch (err) {
      setError("Lỗi khi xoá người dùng!")
      console.error("Delete user error:", err)
    } finally {
      setDeletingUserId(null)
    }
  }

  const togglePasswordVisibility = (userId) => {
    setShowPassword((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }))
  }

  const toggleUserExpansion = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId)
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.iconWrapper}>
            <Users size={32} color="white" />
          </div>
          <div>
            <h1 style={styles.title}>Quản lý người dùng</h1>
            <p style={styles.subtitle}>Quản lý thông tin người dùng và quyền truy cập</p>
          </div>
        </div>
      </div>

      {error && (
        <div style={styles.errorAlert}>
          <span>{error}</span>
          <button onClick={() => setError(null)} style={styles.closeButton}>
            ×
          </button>
        </div>
      )}

      {/* Add User Form */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Thêm người dùng mới</h2>
        <form onSubmit={handleAddUser} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <User size={16} />
              Tên đăng nhập
            </label>
            <input
              type="text"
              name="userName"
              placeholder="Nhập tên đăng nhập"
              value={newUser.userName}
              onChange={handleInputChange}
              required
              style={styles.input}
              disabled={addingUser}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <Eye size={16} />
              Mật khẩu
            </label>
            <div style={styles.passwordContainer}>
              <input
                type={showPassword.new ? "text" : "password"}
                name="password"
                placeholder="Nhập mật khẩu"
                value={newUser.password}
                onChange={handleInputChange}
                required
                style={styles.passwordInput}
                disabled={addingUser}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                style={styles.passwordToggle}
                disabled={addingUser}
              >
                {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            style={{
              ...styles.primaryButton,
              ...(addingUser ? styles.buttonDisabled : {}),
            }}
            disabled={addingUser}
          >
            {addingUser ? (
              <>
                <Loader2 size={16} style={styles.spinner} />
                Đang thêm...
              </>
            ) : (
              <>
                <Plus size={16} />
                Thêm người dùng
              </>
            )}
          </button>
        </form>
      </div>

      {/* Users Table */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Danh sách người dùng ({users.length})</h2>

        {loading && users.length === 0 ? (
          <div style={styles.loadingContainer}>
            <Loader2 size={32} style={styles.spinner} />
            <span>Đang tải...</span>
          </div>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Tên đăng nhập</th>
                  <th style={styles.th}>Lượt thuê</th>
                  <th style={styles.th}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ ...styles.td, textAlign: "center", padding: "40px", color: "#6b7280" }}>
                      Chưa có người dùng nào trong hệ thống
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <>
                      <tr
                        key={user.id}
                        style={{
                          ...styles.tr,
                          animationDelay: `${index * 0.1}s`,
                        }}
                      >
                        <td style={styles.td}>#{user.id}</td>
                        <td style={styles.td}>
                          {editingUser === user.id ? (
                            <input
                              type="text"
                              name="userName"
                              value={editUserData.userName}
                              onChange={handleEditInputChange}
                              style={styles.inlineInput}
                              autoFocus
                              disabled={updatingUser}
                            />
                          ) : (
                            <div style={styles.cellContent}>
                              <User size={16} color="#6b7280" />
                              {user.username}
                            </div>
                          )}
                        </td>
                        <td style={styles.td}>
                          {user.rentalDTOS && user.rentalDTOS.length > 0 ? (
                            <div>
                              <button onClick={() => toggleUserExpansion(user.id)} style={styles.expandButton}>
                                {user.rentalDTOS.length} lượt thuê
                                <span
                                  style={{
                                    transform: expandedUser === user.id ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: "transform 0.2s ease",
                                  }}
                                >
                                  ▼
                                </span>
                              </button>
                            </div>
                          ) : (
                            <span style={styles.noRentals}>0 lượt thuê</span>
                          )}
                        </td>
                        <td style={styles.td}>
                          <div style={styles.actionButtons}>
                            {editingUser === user.id ? (
                              <>
                                <div style={styles.passwordContainer}>
                                  <input
                                    type={showPassword[user.id] ? "text" : "password"}
                                    name="password"
                                    placeholder="Mật khẩu mới (tùy chọn)"
                                    value={editUserData.password}
                                    onChange={handleEditInputChange}
                                    style={styles.passwordInput}
                                    disabled={updatingUser}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility(user.id)}
                                    style={styles.passwordToggle}
                                    disabled={updatingUser}
                                  >
                                    {showPassword[user.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                                  </button>
                                </div>
                                <button onClick={handleUpdateUser} style={styles.saveButton} disabled={updatingUser}>
                                  {updatingUser ? <Loader2 size={16} style={styles.spinner} /> : <Save size={16} />}
                                </button>
                                <button onClick={handleCancelEdit} style={styles.cancelButton} disabled={updatingUser}>
                                  <X size={16} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEditClick(user)}
                                  style={styles.editButton}
                                  disabled={deletingUserId === user.id}
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  style={styles.deleteButton}
                                  disabled={deletingUserId === user.id}
                                >
                                  {deletingUserId === user.id ? (
                                    <Loader2 size={16} style={styles.spinner} />
                                  ) : (
                                    <Trash2 size={16} />
                                  )}
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                      {expandedUser === user.id && user.rentalDTOS && (
                        <tr style={styles.expandedRow}>
                          <td colSpan={4} style={styles.expandedCell}>
                            <div style={styles.rentalsList}>
                              <h4 style={styles.rentalsTitle}>Chi tiết lượt thuê:</h4>
                              {user.rentalDTOS.map((rental) => (
                                <div key={rental.id} style={styles.rentalItem}>
                                  <div style={styles.rentalInfo}>
                                    <span style={styles.carModel}>{rental.carModel}</span>
                                    <span style={styles.rentalDate}>
                                      {rental.rentalDate} - {rental.returnDate}
                                    </span>
                                    <span style={styles.totalPrice}>
                                      {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                      }).format(rental.totalPrice)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
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

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "24px",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    marginBottom: "32px",
  },
  headerContent: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  iconWrapper: {
    width: "64px",
    height: "64px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(10px)",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "white",
    margin: "0 0 4px 0",
  },
  subtitle: {
    fontSize: "16px",
    color: "rgba(255, 255, 255, 0.8)",
    margin: 0,
  },
  errorAlert: {
    maxWidth: "1400px",
    margin: "0 auto 24px auto",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    padding: "16px 20px",
    borderRadius: "12px",
    border: "1px solid #fecaca",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    animation: "slideIn 0.3s ease-out",
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "#dc2626",
    padding: "0 4px",
  },
  card: {
    maxWidth: "1400px",
    margin: "0 auto 32px auto",
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    animation: "fadeInUp 0.6s ease-out",
  },
  cardTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0 0 24px 0",
  },
  form: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr auto",
    gap: "20px",
    alignItems: "end",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  input: {
    padding: "12px 16px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    transition: "all 0.2s ease",
    outline: "none",
    backgroundColor: "white",
  },
  passwordContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  passwordInput: {
    padding: "12px 40px 12px 16px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    transition: "all 0.2s ease",
    outline: "none",
    backgroundColor: "white",
    width: "100%",
  },
  passwordToggle: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#6b7280",
    padding: "4px",
  },
  primaryButton: {
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
    transition: "all 0.2s ease",
    outline: "none",
    backgroundColor: "#3b82f6",
    color: "white",
    minHeight: "44px",
  },
  buttonDisabled: {
    backgroundColor: "#9ca3af",
    cursor: "not-allowed",
  },
  spinner: {
    animation: "spin 1s linear infinite",
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    padding: "60px",
    color: "#6b7280",
    fontSize: "16px",
  },
  tableContainer: {
    overflowX: "auto",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
  },
  th: {
    padding: "16px",
    textAlign: "left",
    backgroundColor: "#f8fafc",
    fontWeight: "600",
    color: "#374151",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "14px",
  },
  td: {
    padding: "16px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px",
  },
  tr: {
    transition: "background-color 0.2s ease",
    animation: "fadeInUp 0.4s ease-out",
  },
  cellContent: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  inlineInput: {
    padding: "8px 12px",
    border: "2px solid #3b82f6",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    width: "100%",
  },
  expandButton: {
    background: "none",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: "12px",
    color: "#3b82f6",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s ease",
  },
  noRentals: {
    color: "#6b7280",
    fontSize: "12px",
  },
  actionButtons: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  editButton: {
    padding: "8px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    backgroundColor: "#e0f2fe",
    color: "#0369a1",
    transition: "all 0.2s ease",
  },
  deleteButton: {
    padding: "8px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    transition: "all 0.2s ease",
  },
  saveButton: {
    padding: "8px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    backgroundColor: "#dcfce7",
    color: "#16a34a",
    transition: "all 0.2s ease",
  },
  cancelButton: {
    padding: "8px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
    transition: "all 0.2s ease",
  },
  expandedRow: {
    backgroundColor: "#f8fafc",
  },
  expandedCell: {
    padding: "20px",
    borderBottom: "1px solid #e5e7eb",
  },
  rentalsList: {
    animation: "fadeIn 0.3s ease-out",
  },
  rentalsTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    margin: "0 0 12px 0",
  },
  rentalItem: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "8px",
    border: "1px solid #e5e7eb",
  },
  rentalInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  carModel: {
    fontWeight: "500",
    color: "#1e293b",
  },
  rentalDate: {
    fontSize: "12px",
    color: "#6b7280",
  },
  totalPrice: {
    fontWeight: "600",
    color: "#10b981",
  },
}

// Add CSS animations
const styleSheet = document.createElement("style")
styleSheet.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  /* Hover effects */
  .primary-button:hover:not(:disabled) {
    background-color: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }
  
  .input:focus, .password-input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .table tr:hover {
    background-color: #f8fafc;
  }
  
  .edit-button:hover:not(:disabled) {
    background-color: #bae6fd;
    transform: scale(1.05);
  }
  
  .delete-button:hover:not(:disabled) {
    background-color: #fecaca;
    transform: scale(1.05);
  }
  
  .save-button:hover:not(:disabled) {
    background-color: #bbf7d0;
    transform: scale(1.05);
  }
  
  .cancel-button:hover:not(:disabled) {
    background-color: #e5e7eb;
    transform: scale(1.05);
  }
  
  .expand-button:hover {
    background-color: #f0f9ff;
    border-color: #3b82f6;
  }
`
document.head.appendChild(styleSheet)

export default UserManager
