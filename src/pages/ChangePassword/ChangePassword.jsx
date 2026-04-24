import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { initiatePasswordChange, finalizePasswordChange } from '../../api/auth';
import { showSuccess, showError } from '../../utils/toast';

const SecureInput = ({ label, value, onChange, disabled, placeholder }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-gray-800 mb-2">{label} <span className="text-red-500">*</span></label>
      <div className="relative flex items-center">
        <input
          type={isVisible ? "text" : "password"}
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-red-900 focus:border-red-900 outline-none transition-shadow pr-12 text-gray-700"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
        <button 
          type="button" 
          onClick={() => setIsVisible(!isVisible)}
          className="absolute right-3 text-gray-500 hover:text-gray-800 focus:outline-none p-1"
          aria-label={isVisible ? "Hide password" : "Show password"}
        >
          {isVisible ? (
            <i className="fas fa-eye-slash text-sm"></i>
          ) : (
            <i className="fas fa-eye text-sm"></i>
          )}
        </button>
      </div>
    </div>
  );
};

export default function ChangePassword() {
  const { token } = useAuth();
  
  const [passData, setPassData] = useState({ currentPass: '', nextPass: '' });
  const [authCode, setAuthCode] = useState('');
  
  const [viewState, setViewState] = useState('REQUEST_OTP'); // 'REQUEST_OTP' | 'VERIFY_OTP'
  const [loadingAction, setLoadingAction] = useState(false);

  const triggerOtpRequest = async (e) => {
    e.preventDefault();
    if (!passData.currentPass.trim() || !passData.nextPass.trim()) {
      showError('Please complete all password fields.');
      return;
    }

    setLoadingAction(true);
    try {
      const response = await initiatePasswordChange(token, passData.currentPass, passData.nextPass);
      const isSuccess = response?.statusCode == 200 || response?.status === 'SUCCESS' || (response?.statusDesc || '').toLowerCase().includes('success');
      
      if (isSuccess) {
        showSuccess(response?.statusDesc || 'Verification code sent to your registered contact.');
        setViewState('VERIFY_OTP');
      } else {
        showError(response?.statusDesc || response?.message || 'Could not send verification code.');
      }
    } catch (exception) {
      console.error('OTP Request Exception:', exception);
      const errorMessage = exception.response?.data?.statusDesc || exception.response?.data?.message || exception.message || 'An unexpected error occurred.';
      showError(errorMessage);
    } finally {
      setLoadingAction(false);
    }
  };

  const confirmPasswordUpdate = async (e) => {
    e.preventDefault();
    if (!authCode.trim()) {
      showError('Verification code is required.');
      return;
    }

    setLoadingAction(true);
    try {
      const requestPayload = { 
        oldPassword: passData.currentPass, 
        newPassword: passData.nextPass, 
        otp: authCode 
      };
      
      const response = await finalizePasswordChange(token, requestPayload);
      const isSuccess = response?.statusCode == 200 || response?.status === 'SUCCESS' || (response?.statusDesc || '').toLowerCase().includes('success');
      
      if (isSuccess) {
        showSuccess(response?.statusDesc || 'Password successfully updated.');
        // Reset states
        setPassData({ currentPass: '', nextPass: '' });
        setAuthCode('');
        setViewState('REQUEST_OTP');
      } else {
        showError(response?.statusDesc || response?.message || 'Verification failed. Please try again.');
      }
    } catch (exception) {
      console.error('Update Confirmation Exception:', exception);
      const errorMessage = exception.response?.data?.statusDesc || exception.response?.data?.message || exception.message || 'Failed to verify code.';
      showError(errorMessage);
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-60px)] bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Security Settings</h2>
          <p className="text-sm text-gray-500 mt-2">Update your account password securely</p>
        </div>

        {viewState === 'REQUEST_OTP' ? (
          <form onSubmit={triggerOtpRequest}>
            <SecureInput 
              label="Current Password" 
              placeholder="Enter your existing password"
              value={passData.currentPass}
              onChange={(e) => setPassData(prev => ({ ...prev, currentPass: e.target.value }))}
              disabled={loadingAction}
            />

            <SecureInput 
              label="New Password" 
              placeholder="Enter a strong new password"
              value={passData.nextPass}
              onChange={(e) => setPassData(prev => ({ ...prev, nextPass: e.target.value }))}
              disabled={loadingAction}
            />

            <button
              type="submit"
              disabled={loadingAction}
              className="mt-4 w-full bg-[#810e0e] hover:bg-[#600a0a] text-white font-bold py-3 px-4 rounded-md transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 shadow-md"
            >
              {loadingAction ? (
                <><i className="fas fa-spinner fa-spin"></i> Processing...</>
              ) : (
                <><i className="fas fa-paper-plane"></i> Send Auth Code</>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={confirmPasswordUpdate}>
            <div className="bg-green-50 border-l-4 border-green-500 text-green-800 p-4 rounded mb-6 flex gap-3 shadow-sm">
              <i className="fas fa-check-circle mt-1 text-green-600 text-lg"></i>
              <span className="text-sm leading-relaxed">
                We've sent a 6-digit authentication code to your registered contact. Enter it below to finalize the update.
              </span>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-800 mb-2">Authentication Code <span className="text-red-500">*</span></label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#810e0e] focus:border-[#810e0e] outline-none transition-shadow text-center tracking-[0.75em] font-bold text-lg text-gray-800"
                placeholder="------"
                maxLength={6}
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value.replace(/\D/g, ''))}
                disabled={loadingAction}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setViewState('REQUEST_OTP')}
                disabled={loadingAction}
                className="w-1/3 bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 font-bold py-3 rounded-md transition-colors disabled:opacity-50"
              >
                Go Back
              </button>
              <button
                type="submit"
                disabled={loadingAction || authCode.length < 4}
                className="w-2/3 bg-[#810e0e] hover:bg-[#600a0a] text-white font-bold py-3 rounded-md transition-all duration-200 disabled:opacity-60 flex items-center justify-center shadow-md"
              >
                {loadingAction ? (
                  <><i className="fas fa-spinner fa-spin mr-2"></i> Verifying...</>
                ) : 'Confirm Update'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
