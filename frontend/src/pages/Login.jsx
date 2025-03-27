import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const users = [
  { email: 'user@example.com', password: 'user', role: 'user' },
  { email: 'admin@example.com', password: 'admin', role: 'admin' }
]

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const user = users.find(u => u.email === email && u.password === password)
   
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
      if (user.role === 'admin') {
        navigate('/admin') // Navigate to admin dashboard
      } else {
        navigate('/home') // Navigate to user home
      }
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-btn">Login</button>
      </form>
    </div>
  )
}

export default Login