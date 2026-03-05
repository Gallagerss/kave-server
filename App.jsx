import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppState } from './context/AppContext'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import CustomerMenu from './pages/CustomerMenu'
import CashierDashboard from './pages/CashierDashboard'
import OwnerDashboard from './pages/OwnerDashboard'
import PricingPage from './pages/PricingPage'
import FeedbackPage from './pages/FeedbackPage'

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAppState();
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/menu" element={<CustomerMenu />} />
        <Route path="/kasir" element={<ProtectedRoute allowedRoles={['cashier']}><CashierDashboard /></ProtectedRoute>} />
        <Route path="/owner" element={<ProtectedRoute allowedRoles={['owner']}><OwnerDashboard /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default App