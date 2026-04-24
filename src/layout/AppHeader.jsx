import userAvatarFallback from '../assets/loginimage.png'
import { UI_STRINGS, THEME_COLORS } from './constants'
import { useHeaderLogic } from './hooks'

/**
 * The top bar of the application.
 * Shows the user's name and has a menu to log out or change the password.
 */
export default function AppHeader({ isSidebarCollapsed }) {
  const { 
    userNameDisplay,
    isMenuVisible, setIsMenuVisible,
    isLogoutPromptOpen, setIsLogoutPromptOpen,
    isPasswordModalOpen, setIsPasswordModalOpen,
    menuContainerRef,
    executeLogout,
    routerNav
  } = useHeaderLogic();

  return (
    <header
      className={`fixed top-0 right-0 z-10 flex items-center justify-between px-6 h-14 shadow-sm transition-all duration-300 ${isSidebarCollapsed ? 'left-16' : 'left-60'}`}
      style={{ background: THEME_COLORS.BRAND_MAIN }}
    >
      {/* The title shown on the left side of the top bar */}
      <span className="text-base font-semibold text-white tracking-wide">{UI_STRINGS.TITLE_DASHBOARD}</span>

      {/* Right side: Bell icon and User menu */}
      <div className="flex items-center gap-3">
        {/* A bell icon for notifications */}
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition">
          <i className="fas fa-bell text-sm" />
        </button>

        {/* A button that opens a menu when you click the user's name or picture */}
        <div className="relative" ref={menuContainerRef}>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={function() { setIsMenuVisible(function(old) { return !old }); }}
          >
            {/* The user's profile picture */}
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/60 flex-shrink-0">
              <img src={userAvatarFallback} alt="avatar" className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-medium text-white hidden sm:inline">{userNameDisplay}</span>
            {/* The small arrow pointing down */}
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
              style={{ background: THEME_COLORS.AVATAR_BG }}
            >
              <i className={`fas fa-chevron-down text-xs text-white transition-transform ${isMenuVisible ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* The menu that pops open (Profile, Password, Logout) */}
          {isMenuVisible && (
            <div className="absolute right-0 top-12 w-52 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
              <button
                onClick={function() { setIsMenuVisible(false); routerNav('/profile'); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                <i className="fas fa-user-circle text-gray-400 w-4" />
                {UI_STRINGS.PROFILE_MENU}
              </button>
              <div className="border-t border-gray-100" />
              <button
                onClick={function() { setIsMenuVisible(false); routerNav('/change-password'); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                <i className="fas fa-key text-gray-400 w-4" />
                {UI_STRINGS.CHANGE_PASS_MENU}
              </button>
              <div className="border-t border-gray-100" />
              <button
                onClick={function() { setIsMenuVisible(false); setIsLogoutPromptOpen(true); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                <i className="fas fa-sign-out-alt text-gray-400 w-4" style={{ transform: 'scaleX(-1)' }} />
                {UI_STRINGS.LOGOUT_MENU}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* The menu that pops open (Profile, Password, Logout) */}

      {isLogoutPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.35)' }}>
          <div className="bg-white rounded-xl flex flex-col items-center gap-7" style={{ border: '1px solid rgb(216, 216, 216)', borderRadius: '4px', padding: '10px', minWidth: '420px', textAlign: 'center', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 4px 24px' }}>
            <p className="text-base font-semibold text-gray-800">{UI_STRINGS.LOGOUT_CONFIRM_MSG}</p>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>
              <button
                onClick={executeLogout}
                className="px-10 py-2.5 rounded-md text-sm font-bold text-white"
                style={{ background: THEME_COLORS.BRAND_MAIN, height: '40px', width: '20px', alignItems: 'center', justifyContent: 'center', display: 'flex' }}
              >
                {UI_STRINGS.YES_BTN}
              </button>
              <button
                onClick={function() { setIsLogoutPromptOpen(false); }}
                className="px-10 py-2.5 rounded-md text-sm font-bold border-2"
                style={{ color: THEME_COLORS.BRAND_MAIN, borderColor: THEME_COLORS.BRAND_MAIN, height: '40px', width: '20px', alignItems: 'center', justifyContent: 'center', display: 'flex' }}
              >
                {UI_STRINGS.NO_BTN}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
