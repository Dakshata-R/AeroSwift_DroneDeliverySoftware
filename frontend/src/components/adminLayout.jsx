
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const AdminLayout = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
    }
  }, [user, navigate])

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (!user) return null

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="logo">
          <span className="logo-icon">✈️</span>
          <span className="logo-text">DroneDash</span>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/admin-dashboard" className="nav-button">
              <span className="button-icon">🏠</span>
              <span className="button-text">Admin Home</span>
            </Link>
          </li>
          <li>
            <Link to="/admin" className="nav-button admin-button">
              <span className="button-icon">🔒</span>
              <span className="button-text">Admin Dashboard</span>
            </Link>
          </li>
        </ul>
        <div className="user-info">
          <div className="user-avatar">👨‍💼</div>
          <p className="user-email">{user.email}</p>
          <p className="user-role">Role: {user.role}</p>
          <button onClick={handleLogout} className="logout-btn">
            <span className="logout-icon">🚪</span>
            Logout
          </button>
        </div>
      </nav>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout