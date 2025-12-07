import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../pages/Navbar';
import Footer from '../pages/Footer';
import Header from '../components/Header';
import { FiMail, FiLock, FiEye, FiEyeOff, FiFacebook, FiTwitter, FiCheck, FiX } from 'react-icons/fi';

const SignIn = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Validation rules
  const validateField = (name, value) => {
    let error = '';
    
    switch(name) {
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  // Validate all fields
  const validateForm = () => {
    const errors = {
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
    };
    setFormErrors(errors);
    return !errors.email && !errors.password;
  };

  // Handle field changes with validation
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Validate the field immediately if it's been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setFormErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  // Handle blur (when user leaves a field)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Check if form is valid
  const isFormValid = () => {
    return formData.email && formData.password && !formErrors.email && !formErrors.password;
  };

  // Handle form submission - ACTUAL API CALL
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      email: true,
      password: true,
    });

    // Validate form
    if (!validateForm()) {
      return;
    }

    setSubmitError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Check if user is admin
        if (data.user.role === 'admin') {
          // Store admin token separately
          localStorage.setItem('adminToken', data.token);
          localStorage.setItem('adminUser', JSON.stringify(data.user));
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setSubmitError(data.message || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setSubmitError('Network error. Please check if backend server is running on port 5000');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Sign in with ${provider}`);
    // Social login implementation would go here
  };

  // Show error border if field is touched and has error
  const getInputClass = (fieldName) => {
    const baseClass = "w-full pl-10 pr-10 xs:pl-12 xs:pr-12 py-2 xs:py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 text-sm xs:text-base";
    
    if (touched[fieldName] && formErrors[fieldName]) {
      return `${baseClass} border-red-500`;
    } else if (touched[fieldName] && !formErrors[fieldName] && formData[fieldName]) {
      return `${baseClass} border-green-500`;
    }
    return `${baseClass} border-gray-300`;
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white flex flex-col">
      {/* Header */}
      <Header />

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="grow flex items-center justify-center py-6 xs:py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20">
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto w-full">
            {/* Header Section */}
            <div className="text-center mb-6 xs:mb-8 sm:mb-10">
              <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 xs:mb-3">
                Welcome Back
              </h1>
              <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600">
                Sign in to your account to continue shopping
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-lg xs:rounded-xl sm:rounded-2xl shadow-lg p-4 xs:p-5 sm:p-6 md:p-8">
              {/* Submit Error Message */}
              {submitError && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                  <div className="flex items-start">
                    <FiX className="w-4 h-4 xs:w-5 xs:h-5 text-red-600 mt-0.5 shrink-0" />
                    <p className="text-xs xs:text-sm text-red-600 ml-2">{submitError}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Email Input */}
                <div className="mb-4 xs:mb-5 sm:mb-6">
                  <div className="flex items-center justify-between mb-1 xs:mb-2">
                    <label className="block text-xs xs:text-sm sm:text-base font-medium text-gray-700">
                      Email Address
                    </label>
                    {touched.email && !formErrors.email && formData.email && (
                      <FiCheck className="w-3 h-3 xs:w-4 xs:h-4 text-green-500" />
                    )}
                  </div>
                  <div className="relative">
                    <FiMail className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${touched.email && formErrors.email ? 'text-red-500' : touched.email && !formErrors.email && formData.email ? 'text-green-500' : 'text-gray-400'} w-4 h-4 xs:w-5 xs:h-5`} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={getInputClass('email')}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </div>
                  {touched.email && formErrors.email && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <FiX className="w-3 h-3 mr-1" />
                      {formErrors.email}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div className="mb-4 xs:mb-5 sm:mb-6">
                  <div className="flex items-center justify-between mb-1 xs:mb-2">
                    <label className="block text-xs xs:text-sm sm:text-base font-medium text-gray-700">
                      Password
                    </label>
                    {touched.password && !formErrors.password && formData.password && (
                      <FiCheck className="w-3 h-3 xs:w-4 xs:h-4 text-green-500" />
                    )}
                  </div>
                  <div className="relative">
                    <FiLock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${touched.password && formErrors.password ? 'text-red-500' : touched.password && !formErrors.password && formData.password ? 'text-green-500' : 'text-gray-400'} w-4 h-4 xs:w-5 xs:h-5`} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={getInputClass('password')}
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <FiEyeOff className="w-4 h-4 xs:w-5 xs:h-5" />
                      ) : (
                        <FiEye className="w-4 h-4 xs:w-5 xs:h-5" />
                      )}
                    </button>
                  </div>
                  {touched.password && formErrors.password && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <FiX className="w-3 h-3 mr-1" />
                      {formErrors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between mb-6 xs:mb-8">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="h-3 w-3 xs:h-4 xs:w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      id="rememberMe"
                    />
                    <label htmlFor="rememberMe" className="ml-2 text-xs xs:text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <Link 
                    to="/forgot-password" 
                    className="text-xs xs:text-sm text-green-600 hover:text-green-700 font-medium transition-colors hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading || !isFormValid()}
                  className={`w-full ${isFormValid() ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'} text-white font-semibold py-2 xs:py-3 rounded-lg text-sm xs:text-base transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 xs:h-5 xs:w-5 border-b-2 border-white mr-2"></div>
                      <span className="text-xs xs:text-sm">Signing in...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 xs:my-8 flex items-center">
                <div className="grow border-t border-gray-300"></div>
                <span className="mx-3 xs:mx-4 text-xs xs:text-sm text-gray-500">Or continue with</span>
                <div className="grow border-t border-gray-300"></div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-3 gap-2 xs:gap-3 sm:gap-4 mb-6 xs:mb-8">
                <button
                  onClick={() => handleSocialLogin('google')}
                  className="flex items-center justify-center p-2 xs:p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 hover:shadow-sm"
                  aria-label="Sign in with Google"
                >
                  <svg className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleSocialLogin('facebook')}
                  className="flex items-center justify-center p-2 xs:p-3 border border-gray-300 rounded-lg hover:bg-blue-50 transition-all duration-300 hover:shadow-sm"
                  aria-label="Sign in with Facebook"
                >
                  <FiFacebook className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-blue-600" />
                </button>
                <button
                  onClick={() => handleSocialLogin('twitter')}
                  className="flex items-center justify-center p-2 xs:p-3 border border-gray-300 rounded-lg hover:bg-blue-50 transition-all duration-300 hover:shadow-sm"
                  aria-label="Sign in with Twitter"
                >
                  <FiTwitter className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-blue-400" />
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center pt-4 xs:pt-6 border-t border-gray-200">
                <p className="text-xs xs:text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link 
                    to="/signup" 
                    className="text-green-600 hover:text-green-700 font-semibold transition-colors hover:underline"
                  >
                    Sign up now
                  </Link>
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-4 xs:mt-6 sm:mt-8 text-center">
              <p className="text-xs xs:text-sm text-gray-500">
                By signing in, you agree to our{' '}
                <Link 
                  to="/signin" 
                  className="text-green-600 hover:text-green-700 hover:underline"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link 
                  to="/signin" 
                  className="text-green-600 hover:text-green-700 hover:underline"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>

            {/* Quick Links */}
            <div className="mt-6 xs:mt-8 grid grid-cols-2 gap-3 xs:gap-4">
              <Link 
                to="/help" 
                className="text-center p-3 xs:p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <p className="text-xs xs:text-sm font-medium text-gray-700">Need Help?</p>
                <p className="text-xs text-gray-500 mt-1">Visit Help Center</p>
              </Link>
              <Link 
                to="/signin" 
                className="text-center p-3 xs:p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <p className="text-xs xs:text-sm font-medium text-gray-700">Continue as Guest</p>
                <p className="text-xs text-gray-500 mt-1">Checkout without account</p>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SignIn;