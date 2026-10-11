import React, { useMemo } from 'react';
import IngredientIllustration from './IngredientIllustration';
import { getThemeById, getShapeById, getCornerById, getFontById } from './labelCustomisationData';
import './PantrySticker.css';

/**
 * Universal Premium Luxury Pantry Sticker Component.
 * Reproduces the visual style of authentic, professionally printed Indian pantry labels:
 * - Rich luxury color palettes
 * - Delicate physical sticker borders (single, double, inset, stitched, decorative, minimal)
 * - True square (1:1) and rectangular (1.4:1) shapes with sharp or rounded die-cuts
 * - Prominent bold regional-language typography with smaller English secondary name
 * - Elegant ingredient line-art illustrations (no emoji, no photos)
 * - Realistic physical sticker paper sheen and die-cut shadows
 */
export const PantrySticker = ({
  product,
  language = 'tamil',
  themeId = 'navy-gold',
  shapeId = 'square',
  cornerId = 'rounded',
  borderId = 'decorative',
  fontId = 'Playfair Display',
  showIllustration = true,
  scale = 1,
  className = '',
  style = {}
}) => {
  const theme = useMemo(() => getThemeById(themeId), [themeId]);
  const shape = useMemo(() => getShapeById(shapeId), [shapeId]);
  const corner = useMemo(() => getCornerById(cornerId), [cornerId]);
  const font = useMemo(() => getFontById(fontId), [fontId]);

  // Clean English Name
  const englishName = useMemo(() => {
    if (!product?.name) return 'Ingredient Name';
    return String(product.name).replace(/\(cid:\d+\)/g, '').trim();
  }, [product?.name]);

  // Resolve Prominent Regional-Language Name
  const regionalName = useMemo(() => {
    if (!product) return englishName;

    const langKey = (language || 'tamil').toLowerCase().trim();
    let text = product[langKey] || product[`${langKey}Name`];

    // Fallbacks
    if (!text && langKey === 'tamil') {
      text = product.tamil || product.tamilName || product.bilingualName;
    }
    if (!text) {
      text = product.bilingualName || product.name;
    }

    // Clean CID and corruption artifacts
    const cleaned = String(text)
      .replace(/\(cid:\d+\)/g, '')
      .replace(/[?]{2,}/g, '')
      .trim()
      .replace(/^[()?,.-]+|[()?,.-]+$/g, '')
      .trim();

    return cleaned || englishName;
  }, [product, language, englishName]);

  // Calculate responsive typography scaling for regional names (supports Indian script combining marks)
  const regionalFontSize = useMemo(() => {
    const len = regionalName.length;
    if (len > 24) return 'clamp(0.95rem, 1.35vw, 1.15rem)';
    if (len > 18) return 'clamp(1.1rem, 1.6vw, 1.35rem)';
    if (len > 12) return 'clamp(1.25rem, 1.9vw, 1.55rem)';
    return 'clamp(1.4rem, 2.2vw, 1.75rem)';
  }, [regionalName]);

  const englishFontSize = useMemo(() => {
    const len = englishName.length;
    if (len > 24) return 'clamp(0.65rem, 0.8vw, 0.75rem)';
    if (len > 16) return 'clamp(0.72rem, 0.95vw, 0.82rem)';
    return 'clamp(0.8rem, 1.1vw, 0.92rem)';
  }, [englishName]);

  const cornerRadius = shape.id === 'square' ? corner.radiusSquare : corner.radiusRectangle;

  return (
    <div
      className={`pantry-sticker-wrapper shape-${shape.id} corner-${corner.id} border-${borderId} theme-${theme.id} ${className}`}
      style={{
        '--sticker-bg': theme.background,
        '--sticker-primary': theme.primaryColor,
        '--sticker-secondary': theme.secondaryColor,
        '--sticker-border': theme.borderColor,
        '--sticker-accent': theme.accentColor,
        '--sticker-radius': cornerRadius,
        '--sticker-font': font.fontFamily,
        '--sticker-ratio': shape.ratio,
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'center center',
        ...style
      }}
    >
      {/* Physical Die-cut Sticker Body */}
      <div className="pantry-sticker-surface">
        {/* Subtle Material Sheen Texture */}
        <div className="pantry-sticker-sheen" />

        {/* Outer Inset Framing */}
        <div className="pantry-sticker-outer-frame">
          {/* Inner Content Border based on borderId */}
          <div className="pantry-sticker-inner-border">
            {/* Corner Flourishes for Decorative Border */}
            {borderId === 'decorative' && (
              <>
                <span className="sticker-corner corner-tl">❖</span>
                <span className="sticker-corner corner-tr">❖</span>
                <span className="sticker-corner corner-bl">❖</span>
                <span className="sticker-corner corner-br">❖</span>
              </>
            )}

            {/* Corner Pips for Minimal Border */}
            {borderId === 'minimal' && (
              <>
                <span className="sticker-pip pip-tl" />
                <span className="sticker-pip pip-tr" />
                <span className="sticker-pip pip-bl" />
                <span className="sticker-pip pip-br" />
              </>
            )}

            <div className="pantry-sticker-content-flow">
              {/* Top: Delicate Botanical Line-Art Illustration */}
              {showIllustration && (
                <div className="pantry-sticker-illustration-row">
                  <span className="flourish-line left-line" />
                  <div className="illustration-holder">
                    <IngredientIllustration
                      ingredientName={englishName}
                      categoryId={product?.categoryId}
                      color={theme.accentColor}
                      size={shape.id === 'rectangle' ? 28 : 34}
                    />
                  </div>
                  <span className="flourish-line right-line" />
                </div>
              )}

              {/* Middle: Prominent Bold Regional-Language Ingredient Name */}
              <div className="pantry-sticker-heading-block">
                <h2
                  className="pantry-sticker-regional-title"
                  style={{ fontSize: regionalFontSize }}
                  title={regionalName}
                >
                  {regionalName}
                </h2>

                {/* Refined Divider */}
                <div className="pantry-sticker-divider">
                  <span className="divider-hairline" />
                  <span className="divider-floret">✦</span>
                  <span className="divider-hairline" />
                </div>

                {/* Subtitle: Smaller Legible English Name */}
                <span
                  className="pantry-sticker-english-title"
                  style={{ fontSize: englishFontSize }}
                  title={englishName}
                >
                  {englishName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PantrySticker;
