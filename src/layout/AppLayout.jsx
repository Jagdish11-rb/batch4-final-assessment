import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AppSidebar from './AppSidebar'
import AppHeader from './AppHeader'

/**
 * The main frame of the app. It holds the side menu, top bar, and the main screen area.
 */
export default function AppLayout() {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false)

  // Opens and closes the side menu
  function handleLayoutToggle() {
    setIsSidebarMinimized(function(prevState) {
      return !prevState;
    });
  }

  return (
    <div className="flex min-h-screen">
      {/* The side menu on the left */}
      <AppSidebar 
        isMinimized={isSidebarMinimized} 
        handleToggleVisibility={handleLayoutToggle} 
      />
      
      {/* The rest of the screen (top bar and main page) */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarMinimized ? 'ml-16' : 'ml-60'}`}>
        {/* The top bar */}
        <AppHeader isSidebarCollapsed={isSidebarMinimized} />
        
        {/* This is where the actual page content is shown (like the dashboard) */}
        <main className="mt-14 p-6 overflow-y-auto bg-nsdl-bg" style={{ height: 'calc(100vh - 3.5rem)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
