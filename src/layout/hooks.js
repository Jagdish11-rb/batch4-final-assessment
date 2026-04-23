// Hooks specifically meant for layout logic
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { doLogout } from '../api/auth'
import { showSuccess } from '../utils/toast'
import { UI_STRINGS } from './constants'

/**
 * This hook controls the side menu (like keeping track of which folders are open).
 */
export function useSidebarLogic(navigationData) {
  const { user } = useAuth()
  const currentUrl = useLocation()
  
  // Check if a page inside a folder is currently being viewed
  function isChildPathActive(subItems) {
    if (!subItems) return false;
    return subItems.some(function(item) {
      return currentUrl.pathname.startsWith(item.route)
    });
  }

  const [expandedSections, setExpandedSections] = useState(function() {
    const defaultState = {};
    navigationData.forEach(function(navItem, index) {
      if (navItem.subItems && isChildPathActive(navItem.subItems)) {
        defaultState[index] = true;
      }
    });
    return defaultState;
  });

  const toggleSection = function(index) {
    setExpandedSections(function(oldState) {
      return { ...oldState, [index]: !oldState[index] }
    });
  }

  // Find out what kind of user is logged in so we can hide/show certain menu items
  let pureRole = '';
  if (user && user.authorities && user.authorities[0]) pureRole = user.authorities[0];
  else if (user && user.roleName) pureRole = user.roleName;
  else if (user && user.role) pureRole = user.role;
  
  pureRole = pureRole.toUpperCase().replace(/^ROLE_/, '');
  const hasOpsMakerPrivilege = (pureRole === 'OPS_MAKER');

  return {
    hasOpsMakerPrivilege,
    expandedSections,
    toggleSection,
    isChildPathActive,
    currentUrl
  };
}

/**
 * This hook controls the top bar (like opening the profile menu or logging out).
 */
export function useHeaderLogic() {
  const authContext = useAuth()
  const routerNav = useNavigate()
  
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const [isLogoutPromptOpen, setIsLogoutPromptOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  
  const menuContainerRef = useRef(null)

  // Automatically close the menu if the user clicks somewhere else on the screen
  useEffect(function() {
    function clickListener(event) {
      if (menuContainerRef.current && !menuContainerRef.current.contains(event.target)) {
        setIsMenuVisible(false)
      }
    }
    document.addEventListener('mousedown', clickListener)
    return function() {
      document.removeEventListener('mousedown', clickListener)
    }
  }, [])

  const executeLogout = async function() {
    setIsLogoutPromptOpen(false)
    try { 
      if (authContext.token) {
        await doLogout(authContext.token) 
      }
    } catch (err) { 
      // If logging out fails on the server, we just ignore it and log them out anyway
    }
    authContext.logout()
    showSuccess(UI_STRINGS.LOGOUT_SUCCESS)
    routerNav('/login')
  }

  // Find the best name to show for the user (username, email, etc.)
  const u = authContext.user;
  const userNameDisplay = (u && u.user_name) || (u && u.username) || (u && u.sub) || 'User';

  return {
    userNameDisplay,
    isMenuVisible, setIsMenuVisible,
    isLogoutPromptOpen, setIsLogoutPromptOpen,
    isPasswordModalOpen, setIsPasswordModalOpen,
    menuContainerRef,
    executeLogout,
    routerNav
  };
}
