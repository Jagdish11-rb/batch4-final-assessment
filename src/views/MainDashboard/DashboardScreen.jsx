import React from 'react'
import { DASHBOARD_STRINGS } from './constants'

/**
 * The main dashboard page.
 * This is the first page users see after logging in successfully.
 */
const DashboardScreen = function() {
  return (
    <section className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-56px)]">
      {/* The big welcome text */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        {DASHBOARD_STRINGS.GREETING}
      </h1>
      {/* The smaller text underneath the welcome text */}
      <p className="text-gray-500 text-base">
        {DASHBOARD_STRINGS.SUBTEXT}
      </p>
    </section>
  )
}

export default DashboardScreen;
