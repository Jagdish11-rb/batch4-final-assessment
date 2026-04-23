import { createContext, useContext, useState, useCallback } from 'react'
import { decodeJwt } from '../utils/helpers'

const AuthContext = createContext(null)

// The main provider component that wraps our app and manages the login state
export function AuthProvider({ children }) {
  const [token, setToken]   = useState(() => localStorage.getItem('token'))
  const [user, setUser]     = useState(() => {
    const t = localStorage.getItem('token')
    return t ? decodeJwt(t) : null
  })

  // Function to save the token and user details when someone successfully logs in
  const loginUser = useCallback((jwtToken) => {
    localStorage.setItem('token', jwtToken)
    setToken(jwtToken)
    setUser(decodeJwt(jwtToken))
  }, [])

  // Function to completely clear all saved data when someone logs out
  const logout = useCallback(() => {
    localStorage.clear()
    sessionStorage.clear()
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ token, user, loginUser, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

// A handy shortcut to access all the login data and functions from anywhere
export const useAuth = () => useContext(AuthContext)
