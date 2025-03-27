import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const Layout = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    if (!user) {
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
          <span className="logo-text">AeroSwift</span>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/home" className="nav-button">
              <span className="button-icon">🏠</span>
              <span className="button-text">Home</span>
            </Link>
          </li>
          <li>
            <Link to="/my-orders" className="nav-button">
              <span className="button-icon">📦</span>
              <span className="button-text">My Orders</span>
            </Link>
          </li>
          <li>
            <Link to="/loyalty-points" className="nav-button">
              <span className="button-icon">🏆</span>
              <span className="button-text">Loyalty Points</span>
            </Link>
          </li>
          <li>
            <Link to="/how-it-works" className="nav-button">
              <span className="button-icon">❓</span>
              <span className="button-text">How it Works?</span>
            </Link>
          </li>
          <li>
            <Link to="/contact" className="nav-button">
              <span className="button-icon">📞</span>
              <span className="button-text">Contact</span>
            </Link>
          </li>
          {user.role === 'admin' && (
            <li>
              <Link to="/admin" className="nav-button admin-button">
                <span className="button-icon">🔒</span>
                <span className="button-text">Admin Page</span>
              </Link>
            </li>
          )}
        </ul>
        <div className="user-info">
          <div className="user-avatar">
            {user.role === 'admin' ? '👨‍💼' : '👤'}
          </div>
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

export default Layout