import React from 'react';
import { Phone } from 'lucide-react';
import './AddressCard.css';

export const AddressCard = ({ address, isSelected, onSelect }) => {
  if (!address) return null;

  const {
    id,
    name,
    phone,
    flatHouseNo,
    areaStreetName,
    landmark,
    city,
    state,
    pincode
  } = address;

  return (
    <div
      className={`address-card-container ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect && onSelect(id)}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onSelect) {
          e.preventDefault();
          onSelect(id);
        }
      }}
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
    >
      <div className="address-card-selection">
        <input
          type="radio"
          name="checkoutDeliveryAddress"
          checked={Boolean(isSelected)}
          onChange={() => onSelect && onSelect(id)}
          className="address-radio-input"
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
          aria-label={`Select delivery address for ${name}`}
        />
        <span className="address-radio-circle"></span>
      </div>

      <div className="address-card-details">
        <div className="address-card-header">
          <strong className="address-recipient-name">{name}</strong>
          {isSelected && <span className="default-badge">Deliver Here</span>}
        </div>
        <p className="address-phone-line"><Phone size={13} style={{ verticalAlign: 'middle', marginRight: '6px', color: '#6b7280' }} />{phone}</p>
        <p className="address-text-line">
          {flatHouseNo}, {areaStreetName}
          {landmark && <span className="landmark-span"><br />Landmark: {landmark}</span>}
          <br />
          {city}, {state} - <strong>{pincode}</strong>
        </p>
      </div>
    </div>
  );
};

export default AddressCard;
