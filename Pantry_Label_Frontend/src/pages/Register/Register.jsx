import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, KeyRound, ChevronRight } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import authService from '../../services/authService';
import OTPInput from '../../components/OTPInput/OTPInput';
import Loader from '../../components/Loader/Loader';
import { otpTimer } from '../../utils/otpTimer';
import officialLogo from '../../assets/images/label_logo2.png';
import './Register.css';

export const Register = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Mode: null (Option Selection Screen), 'username' (Method 1), or 'email_otp' (Method 2)
  const [method, setMethod] = useState(null);

  // Method 1 Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  // Method 2 Form State
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpStep, setOtpStep] = useState(1); // 1 = Email entry, 2 = OTP entry
  const [secondsLeft, setSecondsLeft] = useState(0);

  // Shared Status State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // If already logged in: send to profile-setup if incomplete, else dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.profileCompleted) {
        navigate('/dashboard');
      } else {
        navigate('/profile-setup');
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Handle OTP countdown timer for Method 2
  useEffect(() => {
    let intervalId;
    if (secondsLeft > 0) {
      intervalId = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [secondsLeft]);

  // Handle browser Back button after logout (Requirement 4)
  useEffect(() => {
    const isLoggedOut = sessionStorage.getItem('flavour_world_logged_out') === 'true';
    if (!isLoggedOut) return;

    const handlePopState = () => {
      sessionStorage.removeItem('flavour_world_logged_out');
      navigate('/', { replace: true });
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  const handleBackNavigation = () => {
    sessionStorage.removeItem('flavour_world_logged_out');
    navigate('/');
  };

  // Validation logic for Method 1
  const isUsernameValid = username.trim().length >= 3 && /^[a-zA-Z0-9_]+$/.test(username.trim());

  // Password strength calculation
  const calculateStrength = (pwd) => {
    if (!pwd) return { level: '', score: 0 };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score === 1) return { level: 'weak', label: 'Weak' };
    if (score === 2) return { level: 'medium', label: 'Moderate' };
    return { level: 'strong', label: 'Strong' };
  };

  const passwordStrength = calculateStrength(password);
  const isPasswordValid = password.length >= 6;
  const isConfirmValid = confirmPassword.length > 0 && confirmPassword === password;
  const isMethod1Valid = isUsernameValid && isPasswordValid && isConfirmValid;

  // Validation for Method 2 Email
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // Handle Method 1 Submission (Username + Password)
  const handleRegisterUsername = async (e) => {
    e.preventDefault();
    setUsernameTouched(true);
    setPasswordTouched(true);
    setConfirmTouched(true);

    if (!isMethod1Valid) {
      setError('Please review and correct form fields before submitting.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await authService.registerWithUsername(username.trim(), password);
      const { user: userData, token } = response.data;
      
      // Ensure user has profile completed flag set to false
      const profilePendingUser = { ...userData, profileCompleted: false };
      await login(profilePendingUser, token);

      // Explicitly redirect to profile setup page
      navigate('/profile-setup');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Method 2 Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!isEmailValid) {
      setError('Please enter a valid email address (e.g. name@gmail.com).');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      await authService.sendOtp(email.trim(), false);
      setOtpStep(2);
      setSecondsLeft(300); // 5 minutes
      setMessage('A verification code has been dispatched to your email.');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Method 2 Verify OTP & Register
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.verifyOtp(email.trim(), otp, false);
      const { user: userData, token } = response.data;

      // Ensure user goes to profile setup
      const profilePendingUser = { ...userData, profileCompleted: false };
      await login(profilePendingUser, token);

      navigate('/profile-setup');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Invalid or expired OTP. Please verify and retry.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    if (secondsLeft > 0) return;

    setLoading(true);
    setError('');
    setMessage('');
    try {
      await authService.sendOtp(email.trim(), false);
      setSecondsLeft(300);
      setOtp('');
      setMessage('A fresh verification code has been sent.');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Could not resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page-container">
      {loading && <Loader fullPage={true} message="Setting up your account..." />}

      <div className="register-card-layout">
        {/* STEP 0: OPTION SELECTION PAGE */}
        {method === null ? (
          <>
            <div className="auth-top-nav-row">
              <button
                type="button"
                className="auth-back-nav-btn"
                onClick={handleBackNavigation}
                title="Return to previous page"
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
            </div>

            <div className="register-card-header">
              <img src={officialLogo} alt="FLAVOUR WORLD" className="register-logo-img" />
              <h2>Create Account</h2>
              <p className="register-subtitle">
                Choose how you would like to register with FLAVOUR WORLD:
              </p>
            </div>

            <div className="auth-options-container">
              <button
                type="button"
                className="auth-option-card"
                onClick={() => {
                  setMethod('username');
                  setError('');
                  setMessage('');
                }}
              >
                <div className="auth-option-icon-box">
                  <KeyRound size={22} />
                </div>
                <div className="auth-option-text">
                  <h3>Username & Password</h3>
                  <p>Register using a unique username and a password</p>
                </div>
                <ChevronRight size={20} className="auth-option-arrow" />
              </button>

              <button
                type="button"
                className="auth-option-card"
                onClick={() => {
                  setMethod('email_otp');
                  setError('');
                  setMessage('');
                }}
              >
                <div className="auth-option-icon-box">
                  <Mail size={22} />
                </div>
                <div className="auth-option-text">
                  <h3>Email & OTP</h3>
                  <p>Register using your email address and a 6-digit code</p>
                </div>
                <ChevronRight size={20} className="auth-option-arrow" />
              </button>
            </div>

            <div className="register-footer-prompt">
              Already have a FLAVOUR WORLD account?
              <Link to="/login">Sign In</Link>
            </div>
          </>
        ) : (
          /* REGISTRATION FORMS (Username+Password or Email+OTP) */
          <>
            <div className="auth-top-nav-row">
              <button
                type="button"
                className="auth-back-nav-btn"
                onClick={() => {
                  setMethod(null);
                  setError('');
                  setMessage('');
                }}
                title="Change registration method"
              >
                <ArrowLeft size={16} />
                <span>Back to Options</span>
              </button>
            </div>

            <div className="register-card-header">
              <img src={officialLogo} alt="FLAVOUR WORLD" className="register-logo-img" />
              <h2>Create Account</h2>
              <p className="register-subtitle">
                Join FLAVOUR WORLD to personalize bilingual pantry labels.
              </p>
            </div>

            {/* Method Toggle Tabs */}
            <div className="register-method-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={method === 'username'}
                className={`register-tab-btn ${method === 'username' ? 'active' : ''}`}
                onClick={() => {
                  setMethod('username');
                  setError('');
                  setMessage('');
                }}
              >
                Username & Password
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={method === 'email_otp'}
                className={`register-tab-btn ${method === 'email_otp' ? 'active' : ''}`}
                onClick={() => {
                  setMethod('email_otp');
                  setError('');
                  setMessage('');
                }}
              >
                Email & OTP
              </button>
            </div>

            {error && <div className="register-error-alert" role="alert">{error}</div>}
            {message && <div className="register-success-alert" role="status">{message}</div>}

            {/* METHOD 1: Username + Password */}
            {method === 'username' && (
              <form onSubmit={handleRegisterUsername} className="register-form" noValidate>
                <div className="register-input-group">
                  <label htmlFor="reg-username">Username</label>
                  <input
                    id="reg-username"
                    type="text"
                    placeholder="Choose a unique username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setUsernameTouched(true);
                    }}
                    className={`register-input-field ${usernameTouched && !isUsernameValid ? 'input-error' : ''}`}
                    required
                  />
                  {usernameTouched && !isUsernameValid && (
                    <span className="field-error-msg">
                      Username must be at least 3 characters and contain only letters, numbers, or underscores.
                    </span>
                  )}
                </div>

                <div className="register-input-group">
                  <label htmlFor="reg-password">Password</label>
                  <input
                    id="reg-password"
                    type="password"
                    placeholder="Enter password (min 6 characters)"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordTouched(true);
                    }}
                    className={`register-input-field ${passwordTouched && !isPasswordValid ? 'input-error' : ''}`}
                    required
                  />
                  {password && (
                    <div className="password-strength-container">
                      <div className="strength-bar-track">
                        <div className={`strength-bar-fill ${passwordStrength.level}`} />
                      </div>
                      <div className="strength-text">
                        <span>Password Strength:</span>
                        <strong>{passwordStrength.label}</strong>
                      </div>
                    </div>
                  )}
                  {passwordTouched && !isPasswordValid && (
                    <span className="field-error-msg">Password must be at least 6 characters long.</span>
                  )}
                </div>

                <div className="register-input-group">
                  <label htmlFor="reg-confirm-password">Confirm Password</label>
                  <input
                    id="reg-confirm-password"
                    type="password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setConfirmTouched(true);
                    }}
                    className={`register-input-field ${confirmTouched && !isConfirmValid ? 'input-error' : ''}`}
                    required
                  />
                  {confirmTouched && !isConfirmValid && (
                    <span className="field-error-msg">Passwords do not match.</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="register-submit-btn"
                  disabled={!isMethod1Valid || loading}
                >
                  CREATE ACCOUNT
                </button>
              </form>
            )}

            {/* METHOD 2: Email + OTP Verification */}
            {method === 'email_otp' && (
              <>
                {otpStep === 1 ? (
                  <form onSubmit={handleSendOtp} className="register-form" noValidate>
                    <div className="register-input-group">
                      <label htmlFor="reg-email">Email Address</label>
                      <input
                        id="reg-email"
                        type="email"
                        placeholder="e.g. yourname@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="register-input-field"
                        required
                      />
                      <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                        We will send a 6-digit verification code to this email.
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="register-submit-btn"
                      disabled={!isEmailValid || loading}
                    >
                      SEND OTP
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="register-form">
                    <div className="register-input-group">
                      <label>OTP Verification Code</label>
                      <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: '0 0 8px 0' }}>
                        Enter the 6-digit verification code sent to <strong>{email}</strong>
                      </p>
                      <OTPInput value={otp} onChange={setOtp} />
                    </div>

                    <div className="timer-resend-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                      <span className="otp-timer-text" style={{ color: '#6b7280' }}>
                        {secondsLeft > 0 ? `Time remaining: ${otpTimer(secondsLeft)}` : 'Code expired'}
                      </span>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="resend-otp-btn"
                        disabled={secondsLeft > 0}
                        style={{ background: 'none', border: 'none', color: '#10b981', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Resend OTP
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="register-submit-btn"
                      disabled={otp.length !== 6 || loading}
                    >
                      Verify Email & Create Account
                    </button>

                    <button
                      type="button"
                      className="register-back-btn"
                      onClick={() => {
                        setOtpStep(1);
                        setOtp('');
                        setError('');
                        setMessage('');
                      }}
                    >
                      Change Email
                    </button>
                  </form>
                )}
              </>
            )}

            <div className="register-footer-prompt">
              Already have a FLAVOUR WORLD account?
              <Link to="/login">Sign In</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
