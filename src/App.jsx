import { Routes, Route, Navigate } from 'react-router-dom'
import IntroPage from './pages/IntroPage'
import OnboardingPage from './pages/OnboardingPage'
import DeployPage from './pages/DeployPage'
import StatusPage from './pages/StatusPage'
import ServersPage from './pages/ServersPage'
import TerraformPage from './pages/TerraformPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import { getToken } from './api/auth'

function PrivateRoute({ children }) {
  return getToken() ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<PrivateRoute><IntroPage /></PrivateRoute>} />
      <Route path="/onboarding" element={<PrivateRoute><OnboardingPage /></PrivateRoute>} />
      <Route path="/deploy" element={<PrivateRoute><DeployPage /></PrivateRoute>} />
      <Route path="/status/:jobId" element={<PrivateRoute><StatusPage /></PrivateRoute>} />
      <Route path="/servers" element={<PrivateRoute><ServersPage /></PrivateRoute>} />
      <Route path="/terraform/:jobId" element={<PrivateRoute><TerraformPage /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
    </Routes>
  )
}
