import React, { useState, useContext, useEffect, useMemo, useRef } from 'react';
import { Tag, Scissors, Sparkles } from 'lucide-react';
import { CustomisationContext } from '../../../context/CustomisationContext';
import PantrySticker from '../PantrySticker';
import { LANGUAGES_LIST } from '../labelCustomisationData';
import './LivePreviewTab.css';

export const LivePreviewTab = ({ selectedProducts = [], onNext, onBack }) => {
  const {
    selectedTheme,
    selectedShape,
    selectedCorner,
    selectedBorderStyle,
    selectedFont,
    showIllustration,
    selectedLanguage,
    setSelectedLanguage,
    sheetQuantity = 35
  } = useContext(CustomisationContext);

  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState('sheet'); // Default to 'sheet' to highlight 5x7 / 5x8 layout!
  const [currentSheetIndex, setCurrentSheetIndex] = useState(0);

  // Responsive scale reference for adaptive mobile sheet view (Req 10)
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  const baseSheetWidth = selectedShape === 'square' ? 760 : 990;
  const baseSheetHeight = selectedShape === 'square' ? 1040 : 700;

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const availableWidth = containerRef.current.clientWidth - 20;
        if (availableWidth < baseSheetWidth) {
          setScale(Math.max(0.32, availableWidth / baseSheetWidth));
        } else {
          setScale(1);
        }
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [baseSheetWidth, selectedShape]);

  // Sheet layout constants matching Image 1 & 2
  // Square: 5 columns x 7 rows = 35 per sheet (Portrait)
  // Rectangle: 5 columns x 8 rows = 40 per sheet (Landscape)
  const capacityPerSheet = selectedShape === 'square' ? 35 : 40;
  const sheetCols = 5;
  const sheetRows = selectedShape === 'square' ? 7 : 8;

  // Calculate total sheets needed for ordered quantity or selected items
  const totalItemsCount = Math.max(selectedProducts.length, sheetQuantity);
  const totalSheets = Math.max(1, Math.ceil(totalItemsCount / capacityPerSheet));

  // Keep active index and current sheet in bounds
  useEffect(() => {
    if (activeIndex >= selectedProducts.length && selectedProducts.length > 0) {
      setActiveIndex(0);
    }
  }, [selectedProducts.length, activeIndex]);

  useEffect(() => {
    if (currentSheetIndex >= totalSheets) {
      setCurrentSheetIndex(0);
    }
  }, [totalSheets, currentSheetIndex]);

  if (selectedProducts.length === 0) {
    return (
      <div className="live-preview-empty">
        <div className="empty-state-icon"><Tag size={36} color="#c59f53" /></div>
        <h3>No Ingredients Selected</h3>
        <p>Please return to the dashboard and pick your pantry ingredients first.</p>
        {onBack && (
          <button type="button" className="tab-nav-btn btn-back" onClick={onBack} style={{ marginTop: '1rem' }}>
            ← Back to Dashboard
          </button>
        )}
      </div>
    );
  }

  const currentProduct = selectedProducts[activeIndex] || selectedProducts[0];

  const handleNextSticker = () => {
    setActiveIndex((prev) => (prev === selectedProducts.length - 1 ? 0 : prev + 1));
  };

  const handlePrevSticker = () => {
    setActiveIndex((prev) => (prev === 0 ? selectedProducts.length - 1 : prev - 1));
  };

  // Generate cells for the currently active sheet (strictly capacityPerSheet items)
  const sheetCells = useMemo(() => {
    const startIndex = currentSheetIndex * capacityPerSheet;
    const cells = [];

    for (let i = 0; i < capacityPerSheet; i++) {
      const globalIdx = startIndex + i;
      const product = selectedProducts[globalIdx] || null;
      cells.push({
        slotNumber: globalIdx + 1,
        globalIndex: globalIdx,
        product,
        isEmpty: !product
      });
    }

    return cells;
  }, [currentSheetIndex, capacityPerSheet, selectedProducts]);

  return (
    <div className="live-preview-tab-container">
      {/* Top Toolbar: Navigation & Preview Controls */}
      <div className="preview-toolbar-row">
        <div className="toolbar-left-group">
          <span className="sticker-count-badge">
            {viewMode === 'single'
              ? `Sticker ${activeIndex + 1} of ${selectedProducts.length}`
              : `Sheet View • ${selectedShape === 'square' ? '5 × 7 Grid (35/sheet)' : '5 × 8 Grid (40/sheet)'}`}
          </span>
          <h4 className="active-item-title">
            {viewMode === 'single'
              ? currentProduct?.name || 'Selected Ingredient'
              : `Physical Print Sheet (Sheet ${currentSheetIndex + 1} of ${totalSheets})`}
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
              className={`mode-btn ${viewMode === 'sheet' ? 'active' : ''}`}
              onClick={() => setViewMode('sheet')}
              title="View full sticker sheet grid (5x7 or 5x8)"
            >
              Full Sheet Grid ({capacityPerSheet}/sheet)
            </button>
            <button
              type="button"
              className={`mode-btn ${viewMode === 'single' ? 'active' : ''}`}
              onClick={() => setViewMode('single')}
              title="Inspect single sticker close-up"
            >
              Single Sticker
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
              onClick={handlePrevSticker}
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
              onClick={handleNextSticker}
              aria-label="Next sticker"
            >
              ›
            </button>
          )}
        </div>
      ) : (
        /* Sheet Grid View (Exact reproduction of hand-drawn Image 1 & 2) */
        <div className="sheet-preview-viewport" ref={containerRef}>
          <div
            className="sheet-scale-wrapper"
            style={{
              width: `${baseSheetWidth}px`,
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
              marginBottom: scale < 1 ? `${-(baseSheetHeight * (1 - scale))}px` : 0
            }}
          >
            <div className={`sheet-paper-container sheet-orientation-${selectedShape === 'square' ? 'portrait' : 'landscape'}`}>
              <div className="sheet-header-meta">
                <div className="sheet-meta-title-col">
                  <span className="sheet-brand">FLAVOUR WORLD • PHYSICAL DIE-CUT STICKER SHEET</span>
                  <span className="sheet-spec">
                    {selectedShape === 'square'
                      ? 'Square Die-Cut Labels (1:1) • 5 Columns × 7 Rows = 35 Labels/Sheet'
                      : 'Rectangular Die-Cut Labels (1.4:1) • 5 Columns × 8 Rows = 40 Labels/Sheet'}
                  </span>
                </div>

                {/* Sheet Navigation for multiple sheets (e.g. 70, 80, 105, 140 labels) */}
                {totalSheets > 1 && (
                  <div className="sheet-pagination-box">
                    <button
                      type="button"
                      className="sheet-nav-pill-btn"
                      disabled={currentSheetIndex === 0}
                      onClick={() => setCurrentSheetIndex((prev) => Math.max(0, prev - 1))}
                    >
                      ‹ Prev Sheet
                    </button>
                    <span className="sheet-nav-count">
                      Sheet {currentSheetIndex + 1} / {totalSheets}
                    </span>
                    <button
                      type="button"
                      className="sheet-nav-pill-btn"
                      disabled={currentSheetIndex >= totalSheets - 1}
                      onClick={() => setCurrentSheetIndex((prev) => Math.min(totalSheets - 1, prev + 1))}
                    >
                      Next Sheet ›
                    </button>
                  </div>
                )}
              </div>

              {/* The 5-Column Cutting Grid (5x7 for Square, 5x8 for Rectangle) */}
              <div
                className={`sheet-stickers-cutting-grid grid-shape-${selectedShape}`}
                style={{
                  '--grid-cols': sheetCols,
                  '--grid-rows': sheetRows
                }}
              >
                {sheetCells.map((cell) => {
                  if (cell.product) {
                    const isCellActive = cell.globalIndex === activeIndex;
                    return (
                      <div
                        key={`slot-${cell.slotNumber}`}
                        className={`sheet-sticker-cell shape-${selectedShape} ${isCellActive ? 'cell-active' : ''}`}
                        onClick={() => {
                          setActiveIndex(cell.globalIndex);
                          setViewMode('single');
                        }}
                        title={`Label #${cell.slotNumber}: ${cell.product.name} (Click for close-up view)`}
                      >
                        {/* Cutting Guideline Frame */}
                        <div className="sheet-cell-cut-frame">
                          <PantrySticker
                            product={cell.product}
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
                        <span className="sheet-slot-number-tag">#{cell.slotNumber}</span>
                      </div>
                    );
                  }

                  // Empty die-cut slot marker (matches hand-drawn empty rows in Image 1 & 2)
                  return (
                    <div
                      key={`slot-${cell.slotNumber}`}
                      className={`sheet-sticker-cell shape-${selectedShape} cell-empty-slot`}
                      title={`Slot #${cell.slotNumber}: Empty Die-Cut Slot / Cutting Guideline`}
                    >
                      <div className="sheet-cell-cut-frame">
                        <div className="empty-slot-diecut-placeholder">
                          <span className="empty-slot-icon"><Scissors size={12} /></span>
                          <span className="empty-slot-text">Cut Guide</span>
                          <span className="empty-slot-idx">Slot #{cell.slotNumber}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Sheet Footnote matching reference annotations */}
              <div className="sheet-footer-legend">
                <span className="cutting-guide-hint">
                  <Scissors size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                  Die-cut cutting guidelines between rows and columns (Margin gutter: 3mm)
                </span>
                <span className="sheet-calc-formula">
                  {selectedShape === 'square' ? '7 × 5 = 35 Labels' : '8 × 5 = 40 Labels'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Thumbnail Strip for Fast Navigation in Single Mode */}
      {viewMode === 'single' && selectedProducts.length > 1 && (
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
        <div className="info-icon"><Sparkles size={18} /></div>
        <div className="info-text">
          <strong>Physical Print Specifications:</strong> Rendered with high-contrast{' '}
          {selectedLanguage ? `${selectedLanguage.toUpperCase()} script` : 'regional text'}, elegant
          secondary English naming, and professional die-cut corner styling. All labels will be printed on
          waterproof, grease-resistant vinyl label stock suitable for kitchen containers and glass jars.
        </div>
      </div>

      {/* Bottom Step Navigation Bar */}
      <div className="tab-bottom-nav-bar">
        {onBack && (
          <button
            type="button"
            className="tab-nav-btn btn-back"
            onClick={onBack}
          >
            ← Back to Design Options
          </button>
        )}
        {onNext && (
          <button
            type="button"
            className="tab-nav-btn btn-proceed"
            onClick={onNext}
          >
            Proceed to Order Summary →
          </button>
        )}
      </div>
    </div>
  );
};

export default LivePreviewTab;
