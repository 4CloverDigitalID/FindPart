import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import GuestRoute from './components/frontend/GuestRoute'
import ProtectedRoute from './components/frontend/ProtectedRoute'
import ChatPage from './pages/ChatPage'
import Dashboard from './pages/Dashboard'
import MatchesPage from './pages/MatchesPage'
import ProfilePage from './pages/ProfilePage'
import SwipePage from './pages/SwipePage'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import StartupOnboarding from './pages/onboarding/StartupOnboarding'
import TalentOnboarding from './pages/onboarding/TalentOnboarding'
import SelectRole from './pages/onboarding/SelectRole'
import LandingPages from './pages/LandingPages'
import MainLayout from './layouts/MainLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPages />} />
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="/onboarding/role" element={<SelectRole />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding/startup" element={<StartupOnboarding />} />
          <Route path="/onboarding/talent" element={<TalentOnboarding />} />
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/swipe" element={<SwipePage />} />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/matches/:id/chat" element={<ChatPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
