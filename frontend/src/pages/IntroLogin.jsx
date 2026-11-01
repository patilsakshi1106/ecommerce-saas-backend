import React, { useState } from 'react';
import axios from 'axios';
export default function IntroLogin({ onNavigateHome, onstartShopping, onstartBusiness }) {
    // Portal Control: 'shopper' (B2C) or 'business' (B2B)
    const [activeStream, setActiveStream] = useState('shopper');

    // Form Fields State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [authenticatedUser, setAuthenticatedUser] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    // Form Submission Handling
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        
        const errors = {};
        if (!email) errors.email = 'Email address is required';
        if (!password) errors.password = 'Password is required';
        
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }
        // Choose the correct URL based on the selected portal.
        const loginUrl = activeStream === 'business'
            ? 'http://localhost:5000/api/auth/login'
            : 'http://localhost:5000/api/auth/customer/login';

        try {
            const response = await axios.post(loginUrl, { email, password });
            setFieldErrors({});
            setAuthenticatedUser({ message: response.data.message || 'Login successful' });
        } catch (error) {
            setFieldErrors({
                form: error.response?.data?.message || 'Unable to sign in. Please check your credentials and try again.'
            });
        }
    };

    // Forgot Password Handling
    const handleForgotPasswordSubmit = async (e) => {
  // If there is an event passed, prevent default behavior
  if (e && e.preventDefault) {
    e.preventDefault();
  }

  // 1. CRUCIAL TEST LOGS: These must print in the browser console
  console.log("====================================");
  console.log("BUTTON CLICK DETECTED SUCCESSFULLY!");
  console.log("Current activeStream selected:", activeStream);
  console.log("Email entered by user:", email);
  console.log("====================================");

  try {
    const forgotPasswordUrl = activeStream === 'business'
      ? 'http://localhost:5000/api/auth/forgot-password'
      : 'http://localhost:5000/api/auth/customer/forgot-password';

    console.log("Sending Axios Request to URL:", forgotPasswordUrl);

    const response = await axios.post(forgotPasswordUrl, { email });
    
    console.log("Server Response Data:", response.data);
    alert("Reset link successfully printed/sent!");

  } catch (error) {
    console.error("Axios Error Details:", error.response || error);
    alert("Error occurred: " + (error.response?.data?.message || error.message));
  }
};
           

    return (
        <div className="w-full max-w-md mx-auto px-4 flex flex-col items-stretch">
            
            {/* --- PORTAL TABS SWITCH --- */}
            <div className="flex w-full bg-gray-100 p-1 rounded-xl mb-6">
                <button
                    type="button"
                    onClick={() => { setActiveStream('shopper'); setFieldErrors({}); }}
                    className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                        activeStream === 'shopper'
                            ? 'bg-white text-black shadow-sm'
                            : 'text-gray-500 hover:text-gray-900'
                    }`}
                >
                    Shopper (B2C)
                </button>
                <button
                    type="button"
                    onClick={() => { setActiveStream('business'); setFieldErrors({}); }}
                    className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                        activeStream === 'business'
                            ? 'bg-white text-black shadow-sm'
                            : 'text-gray-500 hover:text-gray-900'
                    }`}
                >
                    Business (B2B)
                </button>
            </div>

            {/* --- Authenticated Banner --- */}
            {authenticatedUser && (
                <div role="status" className="w-full mb-5 p-4 rounded-xl bg-[#2E4F3E]/15 border border-[#2E4F3E] flex flex-col">
                    <strong className="block font-semibold">{authenticatedUser.message}</strong>
                    <p className="text-xs text-[#57524B] mt-0.5">
                        Logged into <strong>{activeStream.toUpperCase()}</strong> portal.
                    </p>
                </div>
            )}

            {/* --- Form Error Message --- */}
            {fieldErrors.form && (
                <div className="w-full mb-4 p-3 rounded-lg bg-red-50 text-xs text-red-600 border border-red-200">
                    {fieldErrors.form}
                </div>
            )}

            {/* --- MAIN LOGIN FORM --- */}
            <form onSubmit={handleLoginSubmit} noValidate className="w-full flex flex-col items-stretch">
                {/* --- EMAIL --- */}
                <div className="flex flex-col w-full mb-4">
                    <label htmlFor="intro-login-email" className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                        Email Address
                    </label>
                    <input
                        id="intro-login-email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                        }}
                        placeholder="patilsakshi6333@gmail.com"
                        className={`maison-input w-full p-2.5 border rounded-lg ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {fieldErrors.email && <p className="text-xs text-red-500 mt-1 text-left">{fieldErrors.email}</p>}
                </div>

        {/* --- LOGO SECTION --- */}
        <div className="w-full flex justify-center mb-6">
          <div 
            onClick={onNavigateHome} 
            style={{ cursor: 'pointer' }} 
            className="font-editorial text-4xl font-semibold tracking-wider text-black"
          >
            MAISON
          </div>
        </div>

                {/* --- PASSWORD --- */}
                <div className="flex flex-col w-full mb-4">
                    <div className="flex items-center justify-between mb-1.5 w-full">
                        <label htmlFor="intro-login-password" className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Password
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowForgotPasswordModal(true)}
                            className="text-xs font-semibold text-[#9A5B3E] hover:underline"
                        >
                            Forgot password?
                        </button>
                    </div>
                    <div className="relative w-full">
                        <input
                            id="intro-login-password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' });
                            }}
                            placeholder="Enter password"
                            className={`maison-input w-full p-2.5 border rounded-lg pr-16 ${fieldErrors.password ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500"
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    {fieldErrors.password && <p className="text-xs text-red-500 mt-1 text-left">{fieldErrors.password}</p>}
                </div>

                {/* --- SUBMIT --- */}
                <button
                    type="submit"
                    className="w-full bg-[#1C1B1F] text-white py-3.5 rounded-xl font-medium tracking-wide hover:bg-opacity-90 transition-all mt-2"
                >
                    Sign In To {activeStream === 'business' ? 'Business Account' : 'Shopping Account'}
                </button>
            </form>

            {/* --- MODAL WINDOW OVERLAY --- */}
            {showForgotPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-2xl max-w-sm w-full mx-4 shadow-2xl border border-gray-100 flex flex-col">
                        <h3 className="text-base font-bold text-gray-900 mb-1">Reset Password</h3>
                        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                            Our database backend will search both Merchant and Customer directories to send you a secure recovery link.
                        </p>
                        
                        <div className="flex justify-end space-x-2.5 w-full">
                            <button
                                type="button"
                                disabled={modalLoading}
                                onClick={() => setShowForgotPasswordModal(false)}
                                className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={modalLoading}
                                onClick={handleForgotPasswordSubmit}
                                className="px-4 py-2 text-xs font-semibold bg-[#9A5B3E] text-white rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50"
                            >
                                {modalLoading ? 'Searching...' : 'Send Recovery Link'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
    }