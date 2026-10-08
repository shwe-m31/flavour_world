import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import profileService from '../../services/profileService';
import productService from '../../services/productService';
import Loader from '../../components/Loader/Loader';
import './ProfileSetup.css';

export const ProfileSetup = () => {
  const { token, user, updateProfileStatus } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [kitchenType, setKitchenType] = useState('');
  const [stateId, setStateId] = useState('');

  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statesLoading, setStatesLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch states list on load
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await productService.getStates();
        setStates(response.data || []);
      } catch (err) {
        console.error('Failed to fetch states list:', err);
        setError('Could not load states list. Please try reloading.');
      } finally {
        setStatesLoading(false);
      }
    };
    fetchStates();
  }, []);

  // Pre-fill profile if it is already partially completed or we have user info
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.gender) setGender(user.gender);
      if (user.age) setAge(user.age);
      if (user.kitchenType) setKitchenType(user.kitchenType);
      if (user.stateId) setStateId(user.stateId);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !gender || !age || !kitchenType || !stateId) {
      setError('Please complete all form fields.');
      return;
    }

    setLoading(true);
    setError('');

    const selectedStateObj = states.find((s) => String(s.id) === String(stateId));

    const profileData = {
      name: name.trim(),
      gender,
      age: parseInt(age, 10),
      kitchenType,
      stateId: parseInt(stateId, 10),
      stateName: selectedStateObj ? selectedStateObj.name : 'Selected Region'
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

  if (statesLoading) {
    return <Loader fullPage={true} message="Loading profile settings..." />;
  }

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
          <p className="subtitle">Tell us about your kitchen to tailor your pantry ingredients.</p>
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
            <label htmlFor="kitchen-select">Kitchen/Food Preference</label>
            <select
              id="kitchen-select"
              value={kitchenType}
              onChange={(e) => setKitchenType(e.target.value)}
              required
              className="profile-input"
            >
              <option value="">Select Kitchen Type</option>
              <option value="Vegetarian">Pure Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Gluten-Free">Gluten-Free</option>
            </select>
          </div>

          <div className="profile-input-group">
            <label htmlFor="state-select">Home State (for State-wise Ingredients)</label>
            <select
              id="state-select"
              value={stateId}
              onChange={(e) => setStateId(e.target.value)}
              required
              className="profile-input"
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
            <span className="helper-text-info">
              We customize labels and language depending on state-wise ingredients list.
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
