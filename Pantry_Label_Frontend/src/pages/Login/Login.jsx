import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, KeyRound, ChevronRight } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import authService from '../../services/authService';
import OTPInput from '../../components/OTPInput/OTPInput';
import Loader from '../../components/Loader/Loader';
import { otpTimer } from '../../utils/otpTimer';
import officialLogo from '../../assets/images/label_logo2.png';
import './Login.css';

export const Login = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Mode: null (Option Selection Screen), 'email_otp' (Method 2), or 'username' (Method 1)
  const [method, setMethod] = useState(null);

  // Method 2 (Email + OTP)
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = Email input, 2 = OTP input
  const [secondsLeft, setSecondsLeft] = useState(0);

  // Method 1 (Username + Password)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // If already authenticated, redirect to correct starting point
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.profileCompleted) {
        navigate('/dashboard');
      } else {
        navigate('/profile-setup');
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Handle browser Back button after logout (Requirement 2 & 4)
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

  // Handle OTP countdown timer
  useEffect(() => {
    let intervalId;
    if (secondsLeft > 0) {
      intervalId = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [secondsLeft]);

  // Handle Method 2: Send OTP (with strict invalid user check)
  const handleSendOtp = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Please enter a valid email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email format.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      // isLogin = true ensures we decline unregistered users
      await authService.sendOtp(cleanEmail, true);
      setStep(2);
      setSecondsLeft(300); // 5-minute countdown (300 seconds)
      setMessage('OTP has been successfully sent to your email.');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Method 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.verifyOtp(email.trim(), otp, true);
      const { user: userData, token } = response.data;

      // Save credentials in session
      await login(userData, token);

      if (userData.profileCompleted) {
        navigate('/dashboard');
      } else {
        navigate('/profile-setup');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Invalid or expired OTP. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (secondsLeft > 0) return;

    setLoading(true);
    setError('');
    setMessage('');
    try {
      await authService.sendOtp(email.trim(), true);
      setSecondsLeft(300); // reset countdown
      setOtp('');
      setMessage('A fresh verification code has been sent to your email.');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Method 1: Username + Password Sign In (with strict invalid user check)
  const handleUsernameLogin = async (e) => {
    e.preventDefault();
    const cleanUsername = username.trim();
    if (!cleanUsername || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await authService.loginWithUsername(cleanUsername, password);
      const { user: userData, token } = response.data;
      await login(userData, token);

      if (userData.profileCompleted) {
        navigate('/dashboard');
      } else {
        navigate('/profile-setup');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      {loading && (
        <Loader
          fullPage={true}
          message={
            method === 'email_otp'
              ? step === 1
                ? 'Sending OTP...'
                : 'Verifying code...'
              : 'Signing in...'
          }
        />
      )}

      <div className="login-card-layout">
        {/* STEP 0: OPTION SELECTION PAGE */}
        {method === null ? (
          <>
            <div className="auth-top-nav-row">
              <button
                type="button"
                className="auth-back-nav-btn"
                onClick={handleBackNavigation}
                title="Return to Landing page"
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
            </div>

            <div className="login-card-header">
              <img
                src={officialLogo}
                alt="FLAVOUR WORLD"
                className="login-logo-img"
                style={{
                  height: '80px',
                  width: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  margin: '0 auto 12px',
                  display: 'block',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                }}
              />
              <h2>Sign In</h2>
              <p className="subtitle">
                Choose how you would like to sign in to your FLAVOUR WORLD account:
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
                  <p>Sign in using your registered username and password</p>
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
                  <p>Sign in using your registered email and a 6-digit code</p>
                </div>
                <ChevronRight size={20} className="auth-option-arrow" />
              </button>
            </div>

            <div
              style={{
                textAlign: 'center',
                fontSize: '0.875rem',
                color: '#6b7280',
                borderTop: '1px solid #f3f4f6',
                paddingTop: '1rem'
              }}
            >
              New to FLAVOUR WORLD?
              <Link
                to="/register"
                style={{
                  color: '#10b981',
                  fontWeight: 700,
                  marginLeft: '4px',
                  textDecoration: 'none'
                }}
              >
                Create Account
              </Link>
            </div>
          </>
        ) : (
          /* SIGN IN FORMS (Username+Password or Email+OTP) */
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
                title="Change sign-in method"
              >
                <ArrowLeft size={16} />
                <span>Back to Options</span>
              </button>
            </div>

            <div className="login-card-header">
              <img
                src={officialLogo}
                alt="FLAVOUR WORLD"
                className="login-logo-img"
                style={{
                  height: '80px',
                  width: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  margin: '0 auto 12px',
                  display: 'block',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                }}
              />
              <h2>FLAVOUR WORLD</h2>
              <p className="subtitle">
                Sign in to access your saved ingredients and custom labels.
              </p>
            </div>

            {/* Method Toggle */}
            <div
              className="login-method-toggle"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '6px',
                background: '#f3f4f6',
                padding: '4px',
                borderRadius: '12px'
              }}
            >
              <button
                type="button"
                className={`login-toggle-btn ${method === 'username' ? 'active' : ''}`}
                onClick={() => {
                  setMethod('username');
                  setError('');
                  setMessage('');
                }}
                style={{
                  background: method === 'username' ? '#ffffff' : 'transparent',
                  color: method === 'username' ? '#111827' : '#6b7280',
                  border: 'none',
                  padding: '0.65rem 0.5rem',
                  borderRadius: '9px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: method === 'username' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                Username & Password
              </button>
              <button
                type="button"
                className={`login-toggle-btn ${method === 'email_otp' ? 'active' : ''}`}
                onClick={() => {
                  setMethod('email_otp');
                  setError('');
                  setMessage('');
                }}
                style={{
                  background: method === 'email_otp' ? '#ffffff' : 'transparent',
                  color: method === 'email_otp' ? '#111827' : '#6b7280',
                  border: 'none',
                  padding: '0.65rem 0.5rem',
                  borderRadius: '9px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: method === 'email_otp' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                Email & OTP
              </button>
            </div>

            {error && <div className="login-error-alert" role="alert">{error}</div>}
            {message && <div className="login-success-alert" role="status">{message}</div>}

            {/* METHOD 1: Username & Password */}
            {method === 'username' && (
              <form onSubmit={handleUsernameLogin} className="login-form">
                <div className="input-group">
                  <label htmlFor="login-username">Username or Email</label>
                  <input
                    id="login-username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="login-input-field"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="login-password">Password</label>
                  <input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="login-input-field"
                  />
                </div>

                <button
                  type="submit"
                  className="login-submit-btn"
                  disabled={!username.trim() || !password}
                >
                  SIGN IN
                </button>
              </form>
            )}

            {/* METHOD 2: Email & OTP */}
            {method === 'email_otp' && (
              <>
                {step === 1 ? (
                  <form onSubmit={handleSendOtp} className="login-form">
                    <div className="input-group">
                      <label htmlFor="email-input">Email Address</label>
                      <input
                        id="email-input"
                        type="email"
                        placeholder="e.g. name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="login-input-field"
                      />
                    </div>
                    <button type="submit" className="login-submit-btn">
                      Send OTP
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="login-form">
                    <div className="input-group">
                      <label>Enter 6-Digit OTP</label>
                      <OTPInput value={otp} onChange={setOtp} />
                    </div>

                    <div className="timer-resend-row">
                      <span className="otp-timer-text">
                        {secondsLeft > 0 ? `Time remaining: ${otpTimer(secondsLeft)}` : 'Code expired'}
                      </span>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="resend-otp-btn"
                        disabled={secondsLeft > 0}
                      >
                        Resend Code
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="login-submit-btn"
                      disabled={otp.length !== 6}
                    >
                      Verify & Sign In
                    </button>
                    <button
                      type="button"
                      className="login-back-btn"
                      onClick={() => {
                        setStep(1);
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

            <div
              style={{
                textAlign: 'center',
                fontSize: '0.875rem',
                color: '#6b7280',
                borderTop: '1px solid #f3f4f6',
                paddingTop: '1rem'
              }}
            >
              New to FLAVOUR WORLD?
              <Link
                to="/register"
                style={{
                  color: '#10b981',
                  fontWeight: 700,
                  marginLeft: '4px',
                  textDecoration: 'none'
                }}
              >
                Create Account
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
