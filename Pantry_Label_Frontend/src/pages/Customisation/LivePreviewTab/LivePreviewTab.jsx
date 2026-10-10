import React, { useState, useContext, useEffect } from 'react';
import { CustomisationContext } from '../../../context/CustomisationContext';
import PantrySticker from '../PantrySticker';
import { LANGUAGES_LIST } from '../labelCustomisationData';
import './LivePreviewTab.css';

export const LivePreviewTab = ({ selectedProducts = [] }) => {
  const {
    selectedTheme,
    selectedShape,
    selectedCorner,
    selectedBorderStyle,
    selectedFont,
    showIllustration,
    selectedLanguage,
    setSelectedLanguage
  } = useContext(CustomisationContext);

  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState('single'); // 'single' or 'sheet'

  // Keep active index in bounds if selectedProducts array changes
  useEffect(() => {
    if (activeIndex >= selectedProducts.length && selectedProducts.length > 0) {
      setActiveIndex(0);
    }
  }, [selectedProducts.length, activeIndex]);

  if (selectedProducts.length === 0) {
    return (
      <div className="live-preview-empty">
        <div className="empty-state-icon">🏷️</div>
        <h3>No Ingredients Selected</h3>
        <p>Please return to the dashboard and pick your pantry ingredients first.</p>
      </div>
    );
  }

  const currentProduct = selectedProducts[activeIndex] || selectedProducts[0];

  const handleNext = () => {
    setActiveIndex(prev => (prev === selectedProducts.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveIndex(prev => (prev === 0 ? selectedProducts.length - 1 : prev - 1));
  };

  return (
    <div className="live-preview-tab-container">
      {/* Top Toolbar: Navigation & Preview Controls */}
      <div className="preview-toolbar-row">
        <div className="toolbar-left-group">
          <span className="sticker-count-badge">
            Sticker {activeIndex + 1} of {selectedProducts.length}
          </span>
          <h4 className="active-item-title">
            {currentProduct?.name || 'Selected Ingredient'}
          </h4>
        </div>

        <div className="toolbar-right-group">
          {/* Language Switcher */}
          <div className="preview-lang-select-wrap">
            <label htmlFor="preview-lang-select" className="preview-lang-label">
              Script:
            </label>
            <select
              id="preview-lang-select"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="preview-lang-select"
            >
              {LANGUAGES_LIST.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.native})
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle: Single vs Sheet */}
          <div className="view-mode-pill-toggle">
            <button
              type="button"
              className={`mode-btn ${viewMode === 'single' ? 'active' : ''}`}
              onClick={() => setViewMode('single')}
              title="Inspect single sticker close-up"
            >
              Single Sticker
            </button>
            <button
              type="button"
              className={`mode-btn ${viewMode === 'sheet' ? 'active' : ''}`}
              onClick={() => setViewMode('sheet')}
              title="View full sticker sheet grid"
            >
              Sheet View ({selectedProducts.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Preview Canvas Area */}
      {viewMode === 'single' ? (
        <div className="single-preview-viewport">
          {/* Navigation Arrows */}
          {selectedProducts.length > 1 && (
            <button
              type="button"
              className="canvas-arrow-btn arrow-prev"
              onClick={handlePrev}
              aria-label="Previous sticker"
            >
              ‹
            </button>
          )}

          {/* The Physical Sticker */}
          <div className="sticker-stage-anchor">
            <PantrySticker
              product={currentProduct}
              language={selectedLanguage}
              themeId={selectedTheme}
              shapeId={selectedShape}
              cornerId={selectedCorner}
              borderId={selectedBorderStyle}
              fontId={selectedFont}
              showIllustration={showIllustration}
            />
          </div>

          {selectedProducts.length > 1 && (
            <button
              type="button"
              className="canvas-arrow-btn arrow-next"
              onClick={handleNext}
              aria-label="Next sticker"
            >
              ›
            </button>
          )}
        </div>
      ) : (
        /* Sheet Grid View */
        <div className="sheet-preview-viewport">
          <div className="sheet-paper-container">
            <div className="sheet-header-meta">
              <span className="sheet-brand">FLAVOUR WORLD • PREMIUM PANTRY COLLECTION</span>
              <span className="sheet-spec">
                {selectedShape === 'square' ? 'Square Labels (1:1)' : 'Rectangular Labels (1.4:1)'} • {selectedProducts.length} Individual Die-Cut Stickers
              </span>
            </div>

            <div className="sheet-stickers-grid">
              {selectedProducts.map((prod, idx) => (
                <div
                  key={prod.id || idx}
                  className={`sheet-sticker-cell ${idx === activeIndex ? 'cell-active' : ''}`}
                  onClick={() => {
                    setActiveIndex(idx);
                    setViewMode('single');
                  }}
                  title="Click to inspect this sticker close-up"
                >
                  <PantrySticker
                    product={prod}
                    language={selectedLanguage}
                    themeId={selectedTheme}
                    shapeId={selectedShape}
                    cornerId={selectedCorner}
                    borderId={selectedBorderStyle}
                    fontId={selectedFont}
                    showIllustration={showIllustration}
                    className="sheet-mini-sticker"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Thumbnail Strip for Fast Navigation in Single Mode */}
      {selectedProducts.length > 1 && (
        <div className="preview-thumbnail-strip">
          <div className="strip-scroll-area">
            {selectedProducts.map((prod, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={prod.id || idx}
                  type="button"
                  className={`thumbnail-pill-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => setActiveIndex(idx)}
                >
                  <span className="thumb-index">{idx + 1}</span>
                  <span className="thumb-name">{prod.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Information Callout */}
      <div className="preview-information-card">
        <div className="info-icon">✨</div>
        <div className="info-text">
          <strong>Physical Print Specifications:</strong> Rendered with high-contrast{' '}
          {selectedLanguage ? `${selectedLanguage.toUpperCase()} script` : 'regional text'}, elegant
          secondary English naming, and professional die-cut corner styling. All labels will be printed on
          waterproof, grease-resistant vinyl label stock suitable for kitchen containers and glass jars.
        </div>
      </div>
    </div>
  );
};

export default LivePreviewTab;
