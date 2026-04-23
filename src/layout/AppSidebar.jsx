import { NavLink } from 'react-router-dom'
import { NAVIGATION_DATA, THEME_COLORS } from './constants'
import { useSidebarLogic } from './hooks'
import appLogo from '../assets/nsdlheading.png'

/**
 * The side menu component that lets users navigate between pages.
 */
export default function AppSidebar({ isMinimized, handleToggleVisibility }) {
  const { hasOpsMakerPrivilege, expandedSections, toggleSection, isChildPathActive } = useSidebarLogic(NAVIGATION_DATA);

  // Hide certain menu items if the user doesn't have permission to see them
  const refinedNavigation = NAVIGATION_DATA.map(function(item) {
    if (item.subItems) {
      return {
        ...item,
        subItems: item.subItems.filter(function(sub) {
          return sub.requiresOpsMaker ? hasOpsMakerPrivilege : true;
        })
      };
    }
    return item;
  });

  return (
    <aside
      className={`flex flex-col transition-all duration-300 min-h-screen fixed top-0 left-0 z-20 bg-white border-r border-gray-200 ${isMinimized ? 'w-16' : 'w-60'}`}
    >
      {/* The top section showing the Bank's Logo */}
      <div className={`flex items-center border-b border-gray-100 h-14 flex-shrink-0 ${isMinimized ? 'justify-center px-2' : 'px-4 gap-2'}`}>
        {isMinimized ? (
          <img src="/nsdl_icon_logo.png" alt="Brand Logo Mini" className="w-8 h-8 object-contain" />
        ) : (
          <img src={appLogo} alt="Full Brand Logo" className="h-8 object-contain" />
        )}
      </div>

      {/* The main list of links to click */}
      <nav className="flex-1 py-3 overflow-y-auto relative">
        {refinedNavigation.map(function(navItem, index) {
          if (navItem.subItems && navItem.subItems.length > 0) {
            const isSectionActive = isChildPathActive(navItem.subItems);
            const isExpanded = !!expandedSections[index];
            
            return (
              <div key={`parent-${index}`}>
                <button
                  onClick={function() {
                    if (!isMinimized) toggleSection(index);
                  }}
                  title={isMinimized ? navItem.title : ''}
                  className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all border-l-4 ${
                    isSectionActive
                      ? 'border-transparent text-red-800'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <i className={`${navItem.glyph} text-sm flex-shrink-0 w-4 text-center`} style={isSectionActive ? { color: THEME_COLORS.BRAND_MAIN } : {}} />
                  {!isMinimized && (
                    <>
                      <span className="truncate flex-1 text-left">{navItem.title}</span>
                      <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-xs text-gray-400`} />
                    </>
                  )}
                </button>

                {!isMinimized && isExpanded && (
                  <div className="bg-gray-50">
                    {navItem.subItems.map(function(subNode) {
                      return (
                        <NavLink
                          key={subNode.route}
                          to={subNode.route}
                          className={function(navData) {
                            return `flex items-center gap-3 pl-10 pr-4 py-3 text-sm font-medium transition-all border-l-4 ${
                              navData.isActive
                                ? 'border-red-800 text-white pl-9'
                                : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                            }`;
                          }}
                          style={function(navData) {
                            return navData.isActive ? { background: THEME_COLORS.BRAND_MAIN } : {};
                          }}
                        >
                          <i className={`${subNode.glyph} text-xs flex-shrink-0 w-4 text-center`} />
                          <span className="truncate">{subNode.title}</span>
                        </NavLink>
                      )
                    })}
                  </div>
                )}
              </div>
            );
          }

          // Single Item Output
          return (
            <NavLink
              key={navItem.route}
              to={navItem.route}
              title={isMinimized ? navItem.title : ''}
              className={function(navData) {
                return `flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all ${
                  navData.isActive
                    ? 'text-red-800 border-l-4 border-red-800 bg-red-50 pl-4'
                    : 'text-gray-600 border-l-4 border-transparent hover:bg-gray-50 hover:text-gray-800'
                }`;
              }}
            >
              <i className={`${navItem.glyph} text-sm flex-shrink-0 w-4 text-center`} />
              {!isMinimized && <span className="truncate">{navItem.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* The small round button that opens and closes the side menu */}
      <button
        onClick={handleToggleVisibility}
        className="absolute -right-4 top-20 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md transition hover:opacity-90 z-30"
        style={{ background: THEME_COLORS.BRAND_MAIN }}
      >
        <i className={`fas ${isMinimized ? 'fa-angle-double-right' : 'fa-angle-double-left'} text-xs`} />
      </button>
    </aside>
  );
}
