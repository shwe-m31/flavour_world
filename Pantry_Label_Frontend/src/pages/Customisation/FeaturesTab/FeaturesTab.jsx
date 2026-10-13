import React, { useState, useContext } from 'react';
import { CustomisationContext } from '../../../context/CustomisationContext';
import {
  STICKER_THEMES,
  STICKER_BORDERS,
  STICKER_SHAPES,
  CORNER_STYLES,
  TYPOGRAPHY_FONTS
} from '../labelCustomisationData';
import './FeaturesTab.css';

const FEATURE_CATEGORIES = [
  { id: 'palette', label: 'Palette' },
  { id: 'shape', label: 'Shape & Finish' },
  { id: 'border', label: 'Border Style' },
  { id: 'typography', label: 'Typography' },
  { id: 'artwork', label: 'Artwork' }
];

export const FeaturesTab = ({ onNext, onBack }) => {
  const [activeCategory, setActiveCategory] = useState('palette');
  const {
    selectedTheme,
    setSelectedTheme,
    selectedShape,
    setSelectedShape,
    selectedCorner,
    setSelectedCorner,
    selectedBorderStyle,
    setSelectedBorderStyle,
    selectedFont,
    setSelectedFont,
    showIllustration,
    setShowIllustration
  } = useContext(CustomisationContext);

  return (
    <div className="features-tab-container">
      {/* Horizontal Category Filter Pills Bar (Req 9) */}
      <div className="features-category-pills-bar">
        {FEATURE_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              className={`features-cat-pill ${isActive ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 1. Sticker Themes & Color Palettes */}
      {activeCategory === 'palette' && (
      <section className="customiser-option-section">
        <div className="section-header">
          <div className="section-title-wrap">
            <span className="section-step-badge">1</span>
            <div>
              <h3>Luxury Sticker Palette</h3>
              <p className="section-desc">
                Select a rich, coordinated color theme inspired by premium artisanal packaging.
              </p>
            </div>
          </div>
        </div>

        <div className="theme-palette-grid">
          {STICKER_THEMES.map((theme) => {
            const isActive = selectedTheme === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                className={`theme-palette-card ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedTheme(theme.id)}
                aria-pressed={isActive}
              >
                <div
                  className="theme-card-preview-swatch"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.borderColor
                  }}
                >
                  <div
                    className="swatch-inner-frame"
                    style={{ borderColor: theme.borderColor }}
                  >
                    <span className="swatch-accent-dot" style={{ backgroundColor: theme.accentColor }} />
                    <span className="swatch-sample-script" style={{ color: theme.primaryColor }}>
                      ஏலக்காய்
                    </span>
                    <span className="swatch-sample-en" style={{ color: theme.secondaryColor }}>
                      CARDAMOM
                    </span>
                  </div>
                </div>

                <div className="theme-card-info">
                  <span className="theme-card-name">{theme.name}</span>
                  <span className="theme-card-subtitle">{theme.subtitle}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
      )}

      {/* 2. Shape & Finish (Shape & Corner Finish) */}
      {activeCategory === 'shape' && (
        <>
          <section className="customiser-option-section">
            <div className="section-header">
              <div className="section-title-wrap">
                <span className="section-step-badge">2</span>
                <div>
                  <h3>Label Shape & Proportions</h3>
                  <p className="section-desc">
                    Choose the physical aspect ratio suited for your jars, tins, and containers.
                  </p>
                </div>
              </div>
            </div>

            <div className="choice-grid choice-grid-shapes">
              {STICKER_SHAPES.map((shape) => {
                const isActive = selectedShape === shape.id;
                return (
                  <button
                    key={shape.id}
                    type="button"
                    className={`choice-card shape-choice ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedShape(shape.id)}
                    aria-pressed={isActive}
                  >
                    <div className="shape-preview-box">
                      <div className={`shape-silhouette silhouette-${shape.id} corner-${selectedCorner}`} />
                      <span className="shape-ratio-pill">{shape.aspectLabel}</span>
                    </div>
                    <div className="choice-card-text">
                      <strong className="choice-title">{shape.name}</strong>
                      <span className="choice-description">{shape.description}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="customiser-option-section">
            <div className="section-header">
              <div className="section-title-wrap">
                <span className="section-step-badge">3</span>
                <div>
                  <h3>Corner Finish</h3>
                  <p className="section-desc">
                    Select clean 90° straight cut edges or smooth die-cut rounded corners.
                  </p>
                </div>
              </div>
            </div>

            <div className="choice-grid choice-grid-corners">
              {CORNER_STYLES.map((corner) => {
                const isActive = selectedCorner === corner.id;
                return (
                  <button
                    key={corner.id}
                    type="button"
                    className={`choice-card corner-choice ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedCorner(corner.id)}
                    aria-pressed={isActive}
                  >
                    <div className="corner-preview-box">
                      <div className={`corner-sample-icon corner-style-${corner.id}`} />
                    </div>
                    <div className="choice-card-text">
                      <strong className="choice-title">{corner.name}</strong>
                      <span className="choice-description">{corner.description}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </>
      )}

      {/* 4. Decorative Border Styles */}
      {activeCategory === 'border' && (
      <section className="customiser-option-section">
        <div className="section-header">
          <div className="section-title-wrap">
            <span className="section-step-badge">4</span>
            <div>
              <h3>Decorative Border Style</h3>
              <p className="section-desc">
                Refined physical framing lines and corner flourishes for an authentic printed finish.
              </p>
            </div>
          </div>
        </div>

        <div className="border-choice-grid">
          {STICKER_BORDERS.map((border) => {
            const isActive = selectedBorderStyle === border.id;
            return (
              <button
                key={border.id}
                type="button"
                className={`border-card-btn ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedBorderStyle(border.id)}
                aria-pressed={isActive}
              >
                <div className={`border-visual-sample border-sample-${border.id}`}>
                  {border.id === 'decorative' && <span className="sample-floret">❖</span>}
                  <span className="border-sample-content">LABEL</span>
                </div>
                <div className="border-card-details">
                  <strong className="border-card-title">{border.name}</strong>
                  <span className="border-card-desc">{border.subtitle}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
      )}

      {/* 5. Typography Font */}
      {activeCategory === 'typography' && (
      <section className="customiser-option-section">
        <div className="section-header">
          <div className="section-title-wrap">
            <span className="section-step-badge">5</span>
            <div>
              <h3>Typography Pairing</h3>
              <p className="section-desc">
                Curated typefaces ensuring prominent regional scripts and clear English secondary text.
              </p>
            </div>
          </div>
        </div>

        <div className="typography-choice-grid">
          {TYPOGRAPHY_FONTS.map((font) => {
            const isActive = selectedFont === font.id;
            return (
              <button
                key={font.id}
                type="button"
                className={`typography-card-btn ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedFont(font.id)}
                style={{ fontFamily: font.fontFamily }}
                aria-pressed={isActive}
              >
                <div className="typography-preview-sample">
                  <span className="sample-regional-specimen">மஞ்சள் தூள்</span>
                  <span className="sample-english-specimen">TURMERIC POWDER</span>
                </div>
                <div className="typography-meta-row">
                  <strong className="font-name">{font.name}</strong>
                  <span className="font-category-badge">{font.category}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
      )}

      {/* 6. Ingredient Artwork Toggle */}
      {activeCategory === 'artwork' && (
      <section className="customiser-option-section">
        <div className="section-header illustration-toggle-row">
          <div className="section-title-wrap">
            <span className="section-step-badge">6</span>
            <div>
              <h3>Botanical Line-Art Illustration</h3>
              <p className="section-desc">
                Display a delicate ingredient-specific line illustration at the top of each sticker.
              </p>
            </div>
          </div>

          <label className="artwork-switch-control" htmlFor="artwork-toggle-input">
            <input
              id="artwork-toggle-input"
              type="checkbox"
              checked={showIllustration}
              onChange={(e) => setShowIllustration(e.target.checked)}
              className="switch-checkbox"
            />
            <span className="switch-slider" />
            <span className="switch-status-text">
              {showIllustration ? 'Artwork Enabled' : 'Text-Only Mode'}
            </span>
          </label>
        </div>
      </section>
      )}

      {/* Bottom Step Navigation Bar */}
      <div className="tab-bottom-nav-bar">
        {onBack && (
          <button
            type="button"
            className="tab-nav-btn btn-back"
            onClick={onBack}
          >
            ← Back to Dashboard
          </button>
        )}
        {onNext && (
          <button
            type="button"
            className="tab-nav-btn btn-proceed"
            onClick={onNext}
          >
            Next: Live Preview Sheet →
          </button>
        )}
      </div>
    </div>
  );
};

export default FeaturesTab;
