import React from 'react'
import { Navigate } from 'react-router-dom'
import { authService } from '../../services/auth.service'

interface Props {
  children: React.ReactElement
}

/**
 * Simple route guard that checks localStorage for a user object.
 * The backend enforces privileges and token validation; this guard is
 * a frontend UX convenience to hide protected views for unauthenticated users.
 */
const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const user = authService.getCurrentUser()

  if (!user) {
    // Not authenticated, redirect to login page
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute