import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import profileService from '../../services/profileService';
import Loader from '../../components/Loader/Loader';
import './ProfileSetup.css';

export const ProfileSetup = () => {
  const { token, user, updateProfileStatus } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill profile if it is already partially completed or we have user info
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.gender) setGender(user.gender);
      if (user.age) setAge(user.age);
      if (user.phone) setPhone(user.phone);
      if (user.address) setAddress(user.address);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !gender || !age || !phone || !address) {
      setError('Please complete all form fields.');
      return;
    }

    // Validate phone number: 10 Indian digits starting with 6-9
    const cleanPhone = phone.replace(/^\+91/, '').replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit Indian phone number.');
      return;
    }
    const formattedPhone = `+91 ${cleanPhone}`;

    if (!address.trim() || address.trim().length < 5) {
      setError('Please enter your complete delivery address.');
      return;
    }

    setLoading(true);
    setError('');

    const profileData = {
      name: name.trim(),
      gender,
      age: parseInt(age, 10),
      phone: formattedPhone,
      address: address.trim()
    };

    try {
      await profileService.saveProfile(profileData, token);

      // Update profileCompleted context flag and sync with registered users
      updateProfileStatus(true, profileData);

      // Redirect to Dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-setup-container">
      {loading && <Loader fullPage={true} message="Saving your profile..." />}

      <div className="profile-card-layout">
        <div className="profile-top-nav-row">
          <button
            type="button"
            className="profile-back-nav-btn"
            onClick={() => navigate(-1)}
            title="Return to previous page"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
        </div>

        <div className="profile-card-header">
          <h2>Complete Your Profile</h2>
          <p className="subtitle">Tell us your contact details and address to tailor your pantry delivery.</p>
        </div>

        {error && <div className="profile-error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile-input-group">
            <label htmlFor="name-input">Full Name</label>
            <input
              id="name-input"
              type="text"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="profile-input"
            />
          </div>

          <div className="profile-row-inputs">
            <div className="profile-input-group flex-1">
              <label htmlFor="gender-select">Gender</label>
              <select
                id="gender-select"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                className="profile-input"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="profile-input-group flex-1">
              <label htmlFor="age-input">Age</label>
              <input
                id="age-input"
                type="number"
                min="5"
                max="120"
                placeholder="e.g. 28"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                className="profile-input"
              />
            </div>
          </div>

          <div className="profile-input-group">
            <label htmlFor="phone-input">Phone Number (+91 10-digit)</label>
            <input
              id="phone-input"
              type="tel"
              placeholder="e.g. 98401 23456"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="profile-input"
            />
            <span className="helper-text-info">
              Used for delivery coordination and order confirmation.
            </span>
          </div>

          <div className="profile-input-group">
            <label htmlFor="address-input">Complete Delivery Address</label>
            <textarea
              id="address-input"
              rows="3"
              placeholder="e.g. Flat 4B, Shanthi Apts, 14th Cross, Gandhi Nagar, Adyar, Chennai - 600020"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="profile-input"
              style={{ resize: 'vertical', minHeight: '80px' }}
            />
            <span className="helper-text-info">
              Your pantry labels will be safely shipped to this delivery address.
            </span>
          </div>

          <button type="submit" className="profile-submit-btn">
            Save & Continue to Dashboard
          </button>

          <button
            type="button"
            className="profile-secondary-back-btn"
            onClick={() => navigate(-1)}
          >
            Back to Previous Page
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
