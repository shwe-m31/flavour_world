import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import addressService from '../../../services/addressService';
import productService from '../../../services/productService';
import AddressCard from '../../../components/AddressCard/AddressCard';
import Loader from '../../../components/Loader/Loader';
import './AddressPage.css';

export const AddressPage = ({ token, onSelectAddress, selectedAddressId }) => {
  const [addresses, setAddresses] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  // Form fields for new address
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [flatHouseNo, setFlatHouseNo] = useState('');
  const [areaStreetName, setAreaStreetName] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');

  const fetchAddressesAndStates = async () => {
    try {
      const [addrRes, statesRes] = await Promise.all([
        addressService.getAddresses(token),
        productService.getStates()
      ]);
      const loadedAddrs = addrRes.data || [];
      setAddresses(loadedAddrs);
      if (loadedAddrs.length > 0) {
        if (!selectedAddressId) {
          onSelectAddress(loadedAddrs[0].id);
        }
      } else {
        setShowForm(true);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch addresses or states list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddressesAndStates();
  }, [token]);

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    if (!name || !phone || !flatHouseNo || !areaStreetName || !city || !stateName || !pincode) {
      setError('Please fill in all required fields.');
      return;
    }

    setFormLoading(true);
    setError('');

    const newAddressData = {
      name,
      phone,
      flatHouseNo,
      areaStreetName,
      landmark,
      city,
      state: stateName,
      pincode
    };

    try {
      const response = await addressService.saveAddress(newAddressData, token);
      const savedAddress = response.data;
      
      // Add to list and set as selected
      setAddresses(prev => [...prev, savedAddress]);
      onSelectAddress(savedAddress.id);
      
      // Reset form
      setName('');
      setPhone('');
      setFlatHouseNo('');
      setAreaStreetName('');
      setLandmark('');
      setCity('');
      setStateName('');
      setPincode('');
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError('Failed to save the new address. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Fetching your saved addresses..." />;
  }

  return (
    <div className="address-page-sub-layout">
      {error && <div className="address-error-alert">{error}</div>}

      <div className="address-selection-section">
        <h3>Select Delivery Address</h3>
        
        {addresses.length === 0 ? (
          <p className="no-address-tag">No saved addresses found. Please add a new delivery address below.</p>
        ) : (
          <div className="address-cards-list">
            {addresses.map(addr => (
              <AddressCard
                key={addr.id}
                address={addr}
                isSelected={Boolean(selectedAddressId !== null && selectedAddressId !== undefined && String(selectedAddressId) === String(addr.id))}
                onSelect={(id) => onSelectAddress && onSelectAddress(id)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="add-address-trigger-area">
        {!showForm ? (
          <button className="toggle-address-form-btn" onClick={() => setShowForm(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} /> Add a New Address
          </button>
        ) : (
          <div className="new-address-form-container">
            <h4>Add a New Delivery Address</h4>
            <form onSubmit={handleAddNewAddress} className="address-form">
              <div className="form-input-group">
                <label>Receiver Name *</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-input-group">
                <label>Contact Phone Number *</label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-input-group flex-1">
                  <label>Flat/House/Apartment No *</label>
                  <input
                    type="text"
                    placeholder="e.g. H.No 123, 2nd Floor"
                    value={flatHouseNo}
                    onChange={(e) => setFlatHouseNo(e.target.value)}
                    required
                  />
                </div>
                <div className="form-input-group flex-1">
                  <label>Area/Street Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Green Valley Colony"
                    value={areaStreetName}
                    onChange={(e) => setAreaStreetName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-input-group">
                <label>Landmark (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Opposite City Park"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-input-group flex-1">
                  <label>City *</label>
                  <input
                    type="text"
                    placeholder="e.g. New Delhi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div className="form-input-group flex-1">
                  <label>State *</label>
                  <select
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    required
                  >
                    <option value="">Select State</option>
                    {states.map(s => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-input-group flex-1">
                  <label>Pincode *</label>
                  <input
                    type="text"
                    placeholder="e.g. 110001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-action-buttons">
                <button type="submit" className="save-address-btn" disabled={formLoading}>
                  {formLoading ? 'Saving...' : 'Save & Select Address'}
                </button>
                <button type="button" className="cancel-address-btn" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressPage;
