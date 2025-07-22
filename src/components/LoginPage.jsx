import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signUp, signIn, signInWithGoogle, createUserProfileDocument } from '../lib/firebase';
import { FcGoogle } from 'react-icons/fc';
import { FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const GlobalStyles = () => (
  <style jsx global>{`
    /* 
    ==============================================
                    Global Styles
    ==============================================
    */
    :root {
      --color-primary: 139, 92, 246;
      --color-primary-light: 167, 139, 250;
      --color-primary-dark: 99, 102, 241;
      --color-gray-900: 17, 24, 39;
      --color-gray-800: 31, 41, 55;
      --color-gray-700: 55, 65, 81;
      --color-gray-600: 75, 85, 99;
      --color-gray-500: 107, 114, 128;
      --color-gray-400: 156, 163, 175;
      --color-gray-300: 209, 213, 219;
      --color-gray-200: 229, 231, 235;
      --color-gray-100: 243, 244, 246;
      --color-error: 239, 68, 68;
      --color-success: 16, 185, 129;
    }

    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    ::-webkit-scrollbar-track {
      background: rgba(var(--color-gray-900), 0.8);
    }

    ::-webkit-scrollbar-thumb {
      background-color: rgba(var(--color-primary), 0.8);
      border-radius: 20px;
      border: 2px solid rgba(var(--color-gray-900), 0.8);
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background-color: rgba(var(--color-primary-light), 0.9);
    }

    /* Selection styling */
    ::selection {
      background: rgba(var(--color-primary), 0.3);
      color: rgba(var(--color-gray-200), 1);
    }

    /* 
    ==============================================
                    Input Styles
    ==============================================
    */
    .input-container {
      position: relative;
      width: 100%;
      margin-bottom: 1.5rem;
    }

    .input-label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: rgba(var(--color-gray-400), 1);
      transition: all 0.3s ease;
    }

    .input-field {
      --input-bg: rgba(var(--color-gray-800), 0.5);
      --input-border: rgba(var(--color-gray-700), 1);
      --input-text: rgba(var(--color-gray-200), 1);
      --input-focus-border: rgba(var(--color-primary), 1);
      --input-placeholder: rgba(var(--color-gray-500), 1);
      
      width: 100%;
      background-color: var(--input-bg);
      border: 1px solid var(--input-border);
      color: var(--input-text);
      padding: 0.875rem 1rem;
      border-radius: 0.75rem;
      font-size: 0.95rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      backdrop-filter: blur(4px);
    }

    .input-field:focus {
      outline: none;
      border-color: var(--input-focus-border);
      box-shadow: 0 0 0 3px rgba(var(--color-primary), 0.2);
    }
    
    .input-field::placeholder {
      color: var(--input-placeholder);
      opacity: 1;
    }

    .input-field:focus + .input-label,
    .input-field:not(:placeholder-shown) + .input-label {
      transform: translateY(-1.5rem) scale(0.85);
      color: rgba(var(--color-primary), 1);
    }

    /* Password toggle */
    .password-toggle {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      color: rgba(var(--color-gray-500), 1);
      transition: color 0.2s ease;
    }

    .password-toggle:hover {
      color: rgba(var(--color-primary), 1);
    }

    /* 
    ==============================================
            React Phone Number Input Styling
    ==============================================
    */
    .phone-input-container {
      display: flex;
      align-items: center;
      background-color: rgba(var(--color-gray-800), 0.5);
      border: 1px solid rgba(var(--color-gray-700), 1);
      border-radius: 0.75rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(4px);
      overflow: hidden;
    }

    .phone-input-container:focus-within {
      outline: none;
      border-color: rgba(var(--color-primary), 1);
      box-shadow: 0 0 0 3px rgba(var(--color-primary), 0.2);
    }

    /* Country select */
    .PhoneInputCountry {
      margin-left: 0.75rem;
      margin-right: 0.5rem;
    }
    
    .PhoneInputCountrySelect {
      -moz-appearance: none;
      -webkit-appearance: none;
      appearance: none;
      outline: none;
      border: none;
      background: transparent;
      color: rgba(var(--color-gray-200), 1);
      font-size: 0.875rem;
      padding: 0.5rem 1.5rem 0.5rem 0.5rem;
      cursor: pointer;
    }
    
    .PhoneInputCountryIcon {
      box-shadow: 0 1px 2px rgba(0,0,0,0.2);
      border-radius: 2px;
    }

    /* Phone number input */
    .PhoneInputInput {
      background-color: transparent;
      border: none;
      outline: none;
      color: rgba(var(--color-gray-200), 1);
      padding: 0.875rem 1rem;
      font-size: 0.95rem;
      width: 100%;
    }

    .PhoneInputInput::placeholder {
      color: rgba(var(--color-gray-500), 1);
    }

    /* 
    ==============================================
                    Button Styles
    ==============================================
    */
    .btn {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 0.875rem 1.5rem;
      font-size: 1rem;
      font-weight: 600;
      line-height: 1.5;
      color: white;
      text-align: center;
      text-decoration: none;
      white-space: nowrap;
      vertical-align: middle;
      cursor: pointer;
      user-select: none;
      border: none;
      border-radius: 0.75rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      z-index: 1;
    }

    .btn-primary {
      background: linear-gradient(135deg, 
        rgba(var(--color-primary), 1) 0%, 
        rgba(var(--color-primary-dark), 1) 100%);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 
                  0 1px 3px rgba(0, 0, 0, 0.08);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 
                  0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .btn-primary:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .btn-primary:disabled {
      background: rgba(var(--color-gray-700), 1);
      color: rgba(var(--color-gray-500), 1);
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    /* Ripple effect */
    .btn-ripple {
      position: absolute;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    }

    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }

    /* Social button */
    .btn-social {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 0.75rem 1.5rem;
      font-size: 0.9375rem;
      font-weight: 500;
      color: rgba(var(--color-gray-200), 1);
      background-color: rgba(var(--color-gray-800), 0.6);
      border: 1px solid rgba(var(--color-gray-700), 1);
      border-radius: 0.75rem;
      transition: all 0.3s ease;
      backdrop-filter: blur(4px);
    }

    .btn-social:hover {
      background-color: rgba(var(--color-gray-700), 0.8);
      border-color: rgba(var(--color-gray-600), 1);
    }

    .btn-social:active {
      transform: scale(0.98);
    }

    /* 
    ==============================================
                    Checkbox Styles
    ==============================================
    */
    .checkbox-container {
      display: flex;
      align-items: center;
      position: relative;
      padding-left: 2rem;
      margin-bottom: 1.5rem;
      cursor: pointer;
      user-select: none;
    }

    .checkbox-input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }

    .checkbox-custom {
      position: absolute;
      top: 0;
      left: 0;
      height: 1.25rem;
      width: 1.25rem;
      background-color: rgba(var(--color-gray-700), 1);
      border: 1px solid rgba(var(--color-gray-600), 1);
      border-radius: 0.25rem;
      transition: all 0.2s ease;
    }

    .checkbox-container:hover .checkbox-input ~ .checkbox-custom {
      background-color: rgba(var(--color-gray-600), 1);
    }

    .checkbox-input:checked ~ .checkbox-custom {
      background-color: rgba(var(--color-primary), 1);
      border-color: rgba(var(--color-primary-light), 1);
    }

    .checkbox-input:focus ~ .checkbox-custom {
      box-shadow: 0 0 0 3px rgba(var(--color-primary), 0.2);
    }

    .checkbox-custom:after {
      content: "";
      position: absolute;
      display: none;
    }

    .checkbox-input:checked ~ .checkbox-custom:after {
      display: block;
    }

    .checkbox-custom:after {
      left: 0.4375rem;
      top: 0.25rem;
      width: 0.3125rem;
      height: 0.625rem;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }

    .checkbox-label {
      font-size: 0.875rem;
      color: rgba(var(--color-gray-400), 1);
    }

    .checkbox-label a {
      color: rgba(var(--color-primary), 1);
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .checkbox-label a:hover {
      text-decoration: underline;
    }

    /* 
    ==============================================
                    Divider Styles
    ==============================================
    */
    .divider {
      display: flex;
      align-items: center;
      margin: 1.5rem 0;
    }

    .divider-line {
      flex-grow: 1;
      height: 1px;
      background-color: rgba(var(--color-gray-700), 1);
    }

    .divider-text {
      padding: 0 1rem;
      font-size: 0.75rem;
      color: rgba(var(--color-gray-500), 1);
      text-transform: uppercase;
    }

    /* 
    ==============================================
                    Alert Styles
    ==============================================
    */
    .alert {
      padding: 0.75rem 1rem;
      margin-bottom: 1rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
    }

    .alert-error {
      background-color: rgba(var(--color-error), 0.1);
      border: 1px solid rgba(var(--color-error), 0.2);
      color: rgba(var(--color-error), 1);
    }

    .alert-icon {
      margin-right: 0.5rem;
      font-size: 1rem;
    }

    /* 
    ==============================================
                    Animation Styles
    ==============================================
    */
    @keyframes float {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    .float-animation {
      animation: float 6s ease-in-out infinite;
    }

    /* 
    ==============================================
                    Layout Styles
    ==============================================
    */
    .auth-container {
      display: flex;
      min-height: 100vh;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      background-color: rgba(var(--color-gray-900), 1);
      position: relative;
      overflow: hidden;
    }

    .auth-bg-pattern {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: radial-gradient(circle at 25% 25%, rgba(var(--color-primary), 0.1) 0%, transparent 50%);
      z-index: 0;
    }

    .auth-card {
      position: relative;
      width: 100%;
      max-width: 28rem;
      padding: 2.5rem;
      background-color: rgba(var(--color-gray-800), 0.7);
      border-radius: 1.25rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
                  0 10px 10px -5px rgba(0, 0, 0, 0.04);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(var(--color-gray-700), 0.5);
      z-index: 1;
      overflow: hidden;
    }

    .auth-card::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(var(--color-primary), 0.1) 0%, transparent 70%);
      z-index: -1;
      opacity: 0.5;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .auth-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: rgba(var(--color-gray-200), 1);
      margin-bottom: 0.5rem;
      background: linear-gradient(to right, rgba(var(--color-primary), 1), rgba(var(--color-primary-light), 1));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .auth-subtitle {
      font-size: 0.9375rem;
      color: rgba(var(--color-gray-500), 1);
    }

    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      font-size: 0.875rem;
      color: rgba(var(--color-gray-500), 1);
    }

    .auth-footer a {
      color: rgba(var(--color-primary), 1);
      text-decoration: none;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }

    /* Responsive adjustments */
    @media (max-width: 640px) {
      .auth-card {
        padding: 1.5rem;
        border-radius: 1rem;
      }
      
      .auth-title {
        font-size: 1.5rem;
      }
    }
  `}</style>
);

const LoginPage = () => {
  const [isSigningUp, setIsSigningUp] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20 }
  };

  const itemVariants = {
    hover: { scale: 1.03 },
    tap: { scale: 0.98 }
  };

  // Helper: Validate email format
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Create ripple effect for buttons
  const createRipple = (event) => {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add("btn-ripple");

    const ripple = button.getElementsByClassName("btn-ripple")[0];
    if (ripple) ripple.remove();

    button.appendChild(circle);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!name.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!age || isNaN(Number(age))) {
      setError('Please enter a valid age.');
      return;
    }
    if (Number(age) < 18) {
      setError('You must be at least 18 years old to sign up.');
      return;
    }
    if (!phone || !isValidPhoneNumber(phone)) {
      setError('Please enter a valid phone number.');
      return;
    }
    if (!email || !isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }
    if (!agreed) {
      setError('You must agree to the terms and conditions to sign up.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // 1. Create the user in Firebase Auth
      const { user } = await signUp(email, password);
      // 2. Save profile data in Firestore
      await createUserProfileDocument(user, {
        displayName: name,
        phone,
        age: Number(age),
      });
      // Success: You may redirect or clear form here
    } catch (err) {
      switch (err.code) {
        case 'auth/weak-password': 
          setError('Password should be at least 6 characters.'); 
          break;
        case 'auth/email-already-in-use': 
          setError('This email is already registered. Please sign in.'); 
          break;
        case 'auth/invalid-email': 
          setError('Please enter a valid email address.'); 
          break;
        default: 
          setError('Failed to create account. Please try again.'); 
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signIn(email, password);
    } catch (err) {
      switch (err.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Invalid email or password.');
          break;
        case 'auth/too-many-requests':
          setError('Too many attempts. Please try again later.');
          break;
        default:
          setError('Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { user } = await signInWithGoogle();
      await createUserProfileDocument(user);
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <GlobalStyles />
      <div className="auth-container">
        <div className="auth-bg-pattern" />
        
        <motion.div 
          className="auth-card"
          variants={formVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          key={isSigningUp ? 'signup' : 'signin'}
        >
          <div className="auth-header">
            <h1 className="auth-title">
              {isSigningUp ? 'Create Your Account' : 'Welcome Back'}
            </h1>
            <p className="auth-subtitle">
              {isSigningUp ? 'Join our community today' : 'Sign in to access your account'}
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                className="alert alert-error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <FiX className="alert-icon" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={isSigningUp ? handleSignUp : handleSignIn}>
            <AnimatePresence mode="wait">
              {isSigningUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="input-container">
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder=" "
                      className="input-field"
                    />
                    <label htmlFor="name" className="input-label">Full Name</label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="input-container">
                      <input
                        id="age"
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                        placeholder=" "
                        className="input-field"
                        min="18"
                      />
                      <label htmlFor="age" className="input-label">Age</label>
                    </div>

                    <div className="input-container">
                      <PhoneInput
                        id="phone"
                        value={phone}
                        onChange={setPhone}
                        required
                        defaultCountry="US"
                        className="phone-input-container"
                        placeholder=" "
                      />
                      <label htmlFor="phone" className="input-label">Phone Number</label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="input-container">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder=" "
                className="input-field"
              />
              <label htmlFor="email" className="input-label">Email Address</label>
            </div>

            <div className="input-container">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder=" "
                className="input-field"
                minLength={6}
              />
              <label htmlFor="password" className="input-label">Password</label>
              <span 
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>

            <AnimatePresence>
              {isSigningUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="checkbox-container">
                    <input 
                      type="checkbox" 
                      checked={agreed} 
                      onChange={(e) => setAgreed(e.target.checked)} 
                      className="checkbox-input"
                      required
                    />
                    <span className="checkbox-custom"></span>
                    <span className="checkbox-label">
                      I agree to the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a>
                    </span>
                  </label>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              className="btn btn-primary"
              variants={itemVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={createRipple}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : isSigningUp ? 'Create Account' : 'Sign In'}
            </motion.button>
          </form>

          <div className="divider">
            <span className="divider-line"></span>
            <span className="divider-text">or</span>
            <span className="divider-line"></span>
          </div>

          <motion.button
            type="button"
            className="btn btn-social"
            variants={itemVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={(e) => {
              createRipple(e);
              handleGoogleSignIn(e);
            }}
            disabled={loading}
          >
            <FcGoogle className="w-5 h-5 mr-3" />
            Continue with Google
          </motion.button>

          <div className="auth-footer">
            {isSigningUp ? 'Already have an account?' : "Don't have an account?"}
            <button 
              onClick={() => {
                setIsSigningUp(!isSigningUp);
                setError(null);
              }} 
              className="ml-1"
            >
              {isSigningUp ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;