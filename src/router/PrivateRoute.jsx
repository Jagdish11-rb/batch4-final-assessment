import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// This special component acts as a guard.
// It checks if a person is logged in before letting them see the page.
// If they are not logged in, it forces them back to the login screen.
export default function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? children : <Navigate to="/login" replace />
}
