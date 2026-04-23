import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider as IdentityProvider } from './context/AuthContext';
import { ModalProvider as DialogProvider } from './context/ModalContext';
import PrivateRoute from './router/PrivateRoute';
import AppLayout from './layout/AppLayout';

import AuthScreen from './pages/Authentication/AuthScreen';
import DashboardScreen from './views/MainDashboard/DashboardScreen';
import OnboardCBC from './pages/CBC/OnboardCBC';
import OnboardCBCMaker from './pages/CBCMaker/OnboardCBCMaker';
import OnboardAgent from './pages/Agent/OnboardAgent';
import ComingSoon from './pages/ComingSoon/ComingSoon';
import Profile from './pages/Profile/Profile';
import ChangePassword from './pages/ChangePassword/ChangePassword';
import UserRequest from './pages/UserManagement/UserRequest';
import CreateCBCUser from './pages/CBC/CreateCBCUser';
import WalletAdjustment from './pages/WalletAdjustment/WalletAdjustment';
import AuditTrail from './pages/AuditTrail/AuditTrail';
import UserListReport from './pages/UserManagement/UserListReport';

/**
 * Main App Component
 * This is the starting point of the application.
 * It provides necessary data and sets up all the page paths.
 */
const RootApp = function() {
  return (
    <IdentityProvider>
      <DialogProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<AuthScreen />} />

            <Route
              path="/"
              element={
                <PrivateRoute>
                  <AppLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardScreen />} />
              <Route path="onboard-cbc" element={<OnboardCBC />} />
              <Route path="onboard-cbc-maker" element={<OnboardCBCMaker />} />
              <Route path="onboard-agent" element={<OnboardAgent />} />
              <Route path="users/:type" element={<ComingSoon />} />
              <Route path="users/:type/:id" element={<ComingSoon />} />
              <Route path="account-lookup" element={<ComingSoon />} />
              <Route path="create-cbc-user" element={<CreateCBCUser />} />
              <Route path="user-request" element={<UserRequest />} />
              <Route path="user-list-report" element={<UserListReport />} />
              <Route path="audit-trail" element={<AuditTrail />} />
              <Route path="wallet-adjustment" element={<WalletAdjustment />} />
              <Route path="profile" element={<Profile />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
        
        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar={false} 
          newestOnTop 
          closeOnClick 
          pauseOnHover 
        />
      </DialogProvider>
    </IdentityProvider>
  );
};

export default RootApp;
