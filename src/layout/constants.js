// This file contains all the static data and constants for the application layout.

export const THEME_COLORS = {
  BRAND_MAIN: '#8b0304',
  AVATAR_BG: '#6b0203'
};

export const NAVIGATION_DATA = [
  {
    title: 'Dashboard',
    route: '/dashboard',
    glyph: 'fas fa-th-large'
  },
  {
    title: 'User Management',
    glyph: 'fas fa-user-cog',
    subItems: [
      { title: 'Create CBC User', route: '/create-cbc-user', glyph: 'fas fa-user-plus', requiresOpsMaker: true },
      { title: 'User Request', route: '/user-request', glyph: 'fas fa-file-invoice' },
      { title: 'User List report', route: '/user-list-report', glyph: 'fas fa-clipboard-list', requiresOpsChecker: true },
    ],
  },
  {
    title: 'Audit Trail',
    route: '/audit-trail',
    glyph: 'fas fa-history'
  },
  {
    title: 'Wallet Adjustment',
    route: '/wallet-adjustment',
    glyph: 'fas fa-wallet'
  },
];

export const UI_STRINGS = {
  LOGOUT_CONFIRM_MSG: 'Are you sure want to Logout?',
  LOGOUT_SUCCESS: 'Logout Successfull!!',
  YES_BTN: 'YES',
  NO_BTN: 'NO',
  TITLE_DASHBOARD: 'Dashboard',
  PROFILE_MENU: 'Profile',
  CHANGE_PASS_MENU: 'Change Password',
  LOGOUT_MENU: 'Logout'
};
