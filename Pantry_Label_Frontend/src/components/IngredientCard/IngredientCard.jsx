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

  const cleanBilingualName = React.useMemo(() => {
    if (!bilingualName) return '';
    const cleaned = String(bilingualName)
      .replace(/\(cid:\d+\)/g, '')
      .replace(/[?]{2,}/g, '')
      .trim()
      .replace(/^[()?,.-]+|[()?,.-]+$/g, '')
      .trim();
    if (!cleaned || cleaned.length < 2 || /^[?\s\-()]+$/.test(cleaned) || cleaned === name) {
      return '';
    }
    return cleaned;
  }, [bilingualName, name]);

  const cleanEnglishName = React.useMemo(() => {
    if (!name) return '';
    return String(name)
      .replace(/\(cid:\d+\)/g, '')
      .trim()
      .replace(/^[()?,.-]+|[()?,.-]+$/g, '')
      .trim();
  }, [name]);

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
            alt={cleanEnglishName}
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
          {cleanBilingualName ? (
            <>
              <h3 className="ingredient-name ingredient-name--translated">{cleanBilingualName}</h3>
              <span className="ingredient-english-name">{cleanEnglishName}</span>
            </>
          ) : (
            <h3 className="ingredient-name">{cleanEnglishName}</h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default IngredientCard;
