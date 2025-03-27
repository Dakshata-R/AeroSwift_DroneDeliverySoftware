import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import UserLayout from './components/Layout'
import AdminLayout from './components/adminLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import UserPage from './pages/UserPage'
import AdminPage from './pages/AdminPage'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import LoyaltyPoints from './pages/LoyaltyPoints'
import Contact from './pages/Contact'
import HowItWorks from './pages/HowItWorks'
import MyOrders from './pages/MyOrders'  
import UpiPayment from './pages/UpiPayment';
import TrackOrder from './pages/TrackOrder';


function App() {
  return (
    <Router>
      <Routes>
        {/* Root path redirects to login if not authenticated */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Login page - accessible to all */}
        <Route path="/login" element={<Login />} />
        
        {/* User Routes with UserLayout */}
        <Route element={<UserLayout />}>
        
<Route path="/upi-payment" element={<UpiPayment />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/track-order" element={<ProtectedRoute><TrackOrder /></ProtectedRoute>} />
          <Route path="/user" element={<ProtectedRoute allowedRoles={['user', 'admin']}><UserPage /></ProtectedRoute>} />
          <Route 
            path="/my-orders" 
            element={<ProtectedRoute allowedRoles={['user', 'admin']}><MyOrders /></ProtectedRoute>} 
          />
          <Route 
            path="/loyalty-points" 
            element={<ProtectedRoute allowedRoles={['user', 'admin']}><LoyaltyPoints /></ProtectedRoute>} 
          />
          <Route 
            path="/how-it-works" 
            element={<ProtectedRoute allowedRoles={['user', 'admin']}><HowItWorks /></ProtectedRoute>} 
          />
          <Route 
            path="/contact" 
            element={<ProtectedRoute allowedRoles={['user', 'admin']}><Contact /></ProtectedRoute>} 
          />
        </Route>
        
        {/* Admin Routes with AdminLayout */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminPage /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['admin']}><Dashboard /></ProtectedRoute>} />
        </Route>
        
        {/* Catch-all for undefined routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App