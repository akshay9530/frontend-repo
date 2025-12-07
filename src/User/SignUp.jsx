import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../pages/Navbar';
import Footer from '../pages/Footer';
import Header from '../components/Header';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck, FiX, FiPhone } from 'react-icons/fi';

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    subscribeNewsletter: true,
  });
  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: '',
  });
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false,
    agreeTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Validation rules
  const validateField = (name, value) => {
    let error = '';
    
    switch(name) {
      case 'firstName':
        if (!value.trim()) {
          error = 'First name is required';
        } else if (value.trim().length < 2) {
          error = 'First name must be at least 2 characters';
        }
        break;
      case 'lastName':
        if (!value.trim()) {
          error = 'Last name is required';
        } else if (value.trim().length < 2) {
          error = 'Last name must be at least 2 characters';
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!emailRegex.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'phone':
        if (!value.trim()) {
          error = 'Phone number is required';
        } else if (!/^[0-9]{10}$/.test(value)) {
          error = 'Please enter a valid 10-digit phone number';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        } else if (!/[A-Z]/.test(value)) {
          error = 'Password must contain at least one uppercase letter';
        } else if (!/[0-9]/.test(value)) {
          error = 'Password must contain at least one number';
        }
        break;
      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password';
        } else if (value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;
      case 'agreeTerms':
        if (!value) {
          error = 'You must agree to the terms and conditions';
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
      firstName: validateField('firstName', formData.firstName),
      lastName: validateField('lastName', formData.lastName),
      email: validateField('email', formData.email),
      phone: validateField('phone', formData.phone),
      password: validateField('password', formData.password),
      confirmPassword: validateField('confirmPassword', formData.confirmPassword),
      agreeTerms: validateField('agreeTerms', formData.agreeTerms),
    };
    setFormErrors(errors);
    return !Object.values(errors).some(error => error !== '');
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
      const error = validateField(name, type === 'checkbox' ? checked : value);
      setFormErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }

    // Special handling for password confirmation
    if (name === 'password' && touched.confirmPassword && formData.confirmPassword) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword);
      setFormErrors(prev => ({
        ...prev,
        confirmPassword: confirmError
      }));
    }
  };

  // Handle blur (when user leaves a field)
  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, type === 'checkbox' ? checked : value);
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Check if form is valid
  const isFormValid = () => {
    return formData.firstName && 
           formData.lastName && 
           formData.email && 
           formData.phone &&
           formData.password && 
           formData.confirmPassword && 
           formData.agreeTerms && 
           !formErrors.firstName && 
           !formErrors.lastName && 
           !formErrors.email && 
           !formErrors.phone &&
           !formErrors.password && 
           !formErrors.confirmPassword;
  };

  // Handle form submission - ACTUAL API CALL
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
      agreeTerms: true,
    });

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSubmitError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
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
        setSubmitError(data.message || 'Registration failed. ' + (data.error || ''));
      }
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitError('Network error. Please check if backend server is running on port 5000');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = (password) => {
    if (!password) return { strength: 0, color: 'bg-gray-200', text: 'Very Weak', textColor: 'text-gray-600' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const strengthMap = [
      { strength: 0, color: 'bg-red-500', text: 'Very Weak', textColor: 'text-red-600' },
      { strength: 1, color: 'bg-red-400', text: 'Weak', textColor: 'text-red-500' },
      { strength: 2, color: 'bg-yellow-500', text: 'Fair', textColor: 'text-yellow-600' },
      { strength: 3, color: 'bg-green-400', text: 'Good', textColor: 'text-green-600' },
      { strength: 4, color: 'bg-green-600', text: 'Strong', textColor: 'text-green-700' },
    ];
    
    return strengthMap[strength];
  };

  const strengthInfo = passwordStrength(formData.password);

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
          <div className="max-w-2xl mx-auto w-full">
            {/* Header Section */}
            <div className="text-center mb-6 xs:mb-8 sm:mb-10">
              <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 xs:mb-3">
                Create Your Account
              </h1>
              <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600">
                Join thousands of happy customers shopping with us
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4 sm:gap-6 mb-4 xs:mb-5 sm:mb-6">
                  {/* First Name */}
                  <div>
                    <div className="flex items-center justify-between mb-1 xs:mb-2">
                      <label className="block text-xs xs:text-sm sm:text-base font-medium text-gray-700">
                        First Name
                      </label>
                      {touched.firstName && !formErrors.firstName && formData.firstName && (
                        <FiCheck className="w-3 h-3 xs:w-4 xs:h-4 text-green-500" />
                      )}
                    </div>
                    <div className="relative">
                      <FiUser className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${touched.firstName && formErrors.firstName ? 'text-red-500' : touched.firstName && !formErrors.firstName && formData.firstName ? 'text-green-500' : 'text-gray-400'} w-4 h-4 xs:w-5 xs:h-5`} />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={getInputClass('firstName')}
                        placeholder="Sanchit"
                        autoComplete="given-name"
                      />
                    </div>
                    {touched.firstName && formErrors.firstName && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <FiX className="w-3 h-3 mr-1" />
                        {formErrors.firstName}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <div className="flex items-center justify-between mb-1 xs:mb-2">
                      <label className="block text-xs xs:text-sm sm:text-base font-medium text-gray-700">
                        Last Name
                      </label>
                      {touched.lastName && !formErrors.lastName && formData.lastName && (
                        <FiCheck className="w-3 h-3 xs:w-4 xs:h-4 text-green-500" />
                      )}
                    </div>
                    <div className="relative">
                      <FiUser className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${touched.lastName && formErrors.lastName ? 'text-red-500' : touched.lastName && !formErrors.lastName && formData.lastName ? 'text-green-500' : 'text-gray-400'} w-4 h-4 xs:w-5 xs:h-5`} />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={getInputClass('lastName')}
                        placeholder="Patil"
                        autoComplete="family-name"
                      />
                    </div>
                    {touched.lastName && formErrors.lastName && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <FiX className="w-3 h-3 mr-1" />
                        {formErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
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

                {/* Phone */}
                <div className="mb-4 xs:mb-5 sm:mb-6">
                  <div className="flex items-center justify-between mb-1 xs:mb-2">
                    <label className="block text-xs xs:text-sm sm:text-base font-medium text-gray-700">
                      Phone Number
                    </label>
                    {touched.phone && !formErrors.phone && formData.phone && (
                      <FiCheck className="w-3 h-3 xs:w-4 xs:h-4 text-green-500" />
                    )}
                  </div>
                  <div className="relative">
                    <FiPhone className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${touched.phone && formErrors.phone ? 'text-red-500' : touched.phone && !formErrors.phone && formData.phone ? 'text-green-500' : 'text-gray-400'} w-4 h-4 xs:w-5 xs:h-5`} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getInputClass('phone')}
                      placeholder="1234567890"
                      autoComplete="tel"
                    />
                  </div>
                  {touched.phone && formErrors.phone && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <FiX className="w-3 h-3 mr-1" />
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                {/* Password */}
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
                      className={getInputClass('password')}
                      placeholder="••••••••"
                      autoComplete="new-password"
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
                  
                  {/* Password Strength Meter */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Password strength:</span>
                        <span className={`text-xs font-medium ${strengthInfo.textColor}`}>
                          {strengthInfo.text}
                        </span>
                      </div>
                      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${strengthInfo.color} transition-all duration-300`}
                          style={{ width: `${(strengthInfo.strength / 4) * 100}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-1">
                        <div className={`text-xs ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                          ✓ At least 8 characters
                        </div>
                        <div className={`text-xs ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                          ✓ One uppercase letter
                        </div>
                        <div className={`text-xs ${/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                          ✓ One number
                        </div>
                        <div className={`text-xs ${/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                          ✓ One special character
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-6 xs:mb-8">
                  <div className="flex items-center justify-between mb-1 xs:mb-2">
                    <label className="block text-xs xs:text-sm sm:text-base font-medium text-gray-700">
                      Confirm Password
                    </label>
                    {touched.confirmPassword && !formErrors.confirmPassword && formData.confirmPassword && (
                      <FiCheck className="w-3 h-3 xs:w-4 xs:h-4 text-green-500" />
                    )}
                  </div>
                  <div className="relative">
                    <FiLock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${touched.confirmPassword && formErrors.confirmPassword ? 'text-red-500' : touched.confirmPassword && !formErrors.confirmPassword && formData.confirmPassword ? 'text-green-500' : 'text-gray-400'} w-4 h-4 xs:w-5 xs:h-5`} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getInputClass('confirmPassword')}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff className="w-4 h-4 xs:w-5 xs:h-5" />
                      ) : (
                        <FiEye className="w-4 h-4 xs:w-5 xs:h-5" />
                      )}
                    </button>
                  </div>
                  {touched.confirmPassword && formErrors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <FiX className="w-3 h-3 mr-1" />
                      {formErrors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Checkboxes */}
                <div className="space-y-3 xs:space-y-4 mb-6 xs:mb-8">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`h-3 w-3 xs:h-4 xs:w-4 ${touched.agreeTerms && formErrors.agreeTerms ? 'border-red-500' : 'border-gray-300'} text-green-600 focus:ring-green-500 rounded mt-1`}
                      id="agreeTerms"
                    />
                    <label htmlFor="agreeTerms" className="ml-2 text-xs xs:text-sm text-gray-700">
                      I agree to the{' '}
                      <Link to="/signup" className="text-green-600 hover:text-green-700 font-medium hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/signup" className="text-green-600 hover:text-green-700 font-medium hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  {touched.agreeTerms && formErrors.agreeTerms && (
                    <p className="text-xs text-red-600 ml-6 flex items-center">
                      <FiX className="w-3 h-3 mr-1" />
                      {formErrors.agreeTerms}
                    </p>
                  )}
                  
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="subscribeNewsletter"
                      checked={formData.subscribeNewsletter}
                      onChange={handleChange}
                      className="h-3 w-3 xs:h-4 xs:w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
                      id="subscribeNewsletter"
                    />
                    <label htmlFor="subscribeNewsletter" className="ml-2 text-xs xs:text-sm text-gray-700">
                      Subscribe to our newsletter for exclusive deals and updates
                    </label>
                  </div>
                </div>

                {/* Sign Up Button */}
                <button
                  type="submit"
                  disabled={isLoading || !isFormValid()}
                  className={`w-full ${isFormValid() ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'} text-white font-semibold py-2 xs:py-3 rounded-lg text-sm xs:text-base transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 xs:h-5 xs:w-5 border-b-2 border-white mr-2"></div>
                      <span className="text-xs xs:text-sm">Creating Account...</span>
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              {/* Sign In Link */}
              <div className="mt-6 xs:mt-8 text-center pt-4 xs:pt-6 border-t border-gray-200">
                <p className="text-xs xs:text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link 
                    to="/signin" 
                    className="text-green-600 hover:text-green-700 font-semibold transition-colors hover:underline"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="mt-6 xs:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 xs:gap-4">
              <div className="bg-green-50 p-3 xs:p-4 rounded-lg text-center hover:shadow-md transition-shadow duration-300">
                <FiCheck className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-sm xs:text-base text-gray-900 mb-1">Secure Shopping</h3>
                <p className="text-xs xs:text-sm text-gray-600">256-bit SSL encryption</p>
              </div>
              <div className="bg-green-50 p-3 xs:p-4 rounded-lg text-center hover:shadow-md transition-shadow duration-300">
                <FiCheck className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-sm xs:text-base text-gray-900 mb-1">Free Shipping</h3>
                <p className="text-xs xs:text-sm text-gray-600">On orders over $50</p>
              </div>
              <div className="bg-green-50 p-3 xs:p-4 rounded-lg text-center hover:shadow-md transition-shadow duration-300">
                <FiCheck className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-sm xs:text-base text-gray-900 mb-1">Easy Returns</h3>
                <p className="text-xs xs:text-sm text-gray-600">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SignUp;