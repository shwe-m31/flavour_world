import React from 'react';
import placeholderImg from '../../assets/images/ingredient-placeholder.svg';
import { getIngredientImage } from '../../utils/ingredientImageMap.js';
import './IngredientCard.css';

export const IngredientCard = ({ ingredient, isChecked, onToggle }) => {
  const { id, name, bilingualName, imageUrl } = ingredient;
  const displayImage = imageUrl || getIngredientImage(ingredient);

  const handleCardClick = () => {
    onToggle(id);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle(id);
    }
  };

  return (
    <div
      className={`ingredient-card ${isChecked ? 'selected' : ''}`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="checkbox"
      aria-checked={isChecked}
      tabIndex={0}
    >
      <div className="card-selection-indicator">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => onToggle(id)}
          onClick={(e) => e.stopPropagation()}
          id={`checkbox-${id}`}
          className="card-checkbox"
        />
        <label htmlFor={`checkbox-${id}`} className="checkbox-visual-label" onClick={(e) => e.stopPropagation()}></label>
      </div>

      <div className="ingredient-image-container">
        {displayImage ? (
          <img
            src={displayImage}
            alt={name}
            className="ingredient-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              if (e.target.nextSibling) {
                e.target.nextSibling.style.display = 'flex';
              }
            }}
          />
        ) : null}
        <div className="fallback-container" style={{ display: displayImage ? 'none' : 'flex' }}>
          <img src={placeholderImg} alt="" className="ingredient-placeholder-img" />
        </div>
      </div>

      <div className="ingredient-info">
        <div className="name-block">
          {bilingualName ? (
            <>
              <h3 className="ingredient-name ingredient-name--translated">{bilingualName}</h3>
              <span className="ingredient-english-name">{name}</span>
            </>
          ) : (
            <h3 className="ingredient-name">{name}</h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default IngredientCard;
