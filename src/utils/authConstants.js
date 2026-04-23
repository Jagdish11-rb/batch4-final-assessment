export const ROLES_PERMITTED = [
  'ROLE_OPS_CHECKER', 'ROLE_OPS_MAKER',
  'ROLE_UAM_CHECKER', 'ROLE_UAM_MAKER',
  'ROLE_SUPER_ADMIN', 'ROLE_BANK_REPORTING_ANALYST', 'ROLE_BUSINESS_SUPPORT',
]
export const REGEX_SECURE_PASS = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+\-]).{8,20}$/

export const MSGS = {
  UNAUTH_ACCESS: 'Unauthorised Access',
  DENIED_ACCESS: 'Access Denied',
  NETWORK_ERR: 'Network error — check connection or VPN.',
  SERVER_ERR: 'Server Error, Please try again.',
  GENERIC_ERR: 'Something went wrong!',
  OTP_INCOMPLETE: 'Enter complete OTP.',
  TEMP_PASS_SENT: 'Temporary password sent to your registered mobile.',
  PASS_MISMATCH: "Password & Confirm Password doesn't match!",
  PASS_SUCCESS: 'Password changed successfully!',
}
