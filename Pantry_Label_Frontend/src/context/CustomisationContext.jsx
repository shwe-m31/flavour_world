import React, { createContext, useState, useEffect } from 'react';
import { selectionService } from '../services/selectionService';
import { getThemeById } from '../pages/Customisation/labelCustomisationData';

export const CustomisationContext = createContext(null);

export const CustomisationProvider = ({ children }) => {
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  
  // Household / Kitchen Persona (Step 1)
  const [consumerCategory, setConsumerCategory] = useState('Family');

  // Browsing State ID (Step 2) - Defaults to 4 (Tamil Nadu)
  const [selectedStateId, setSelectedStateId] = useState('4');

  // Cooking Preference (Step 3) - 'Vegetarian', 'Non-Vegetarian', 'Both'
  const [cookingPreference, setCookingPreference] = useState('Vegetarian');

  // Containers / Sticker Sheet Capacity (Step 4)
  // For Square: 35, 70, 105, 140... For Rectangle: 40, 80, 120, 160...
  const [sheetQuantity, setSheetQuantity] = useState(35);

  // Luxury Theme Palette
  const [selectedTheme, setSelectedTheme] = useState('navy-gold');
  // Backward compatibility alias for selectedBackground
  const [selectedBackground, setSelectedBackground] = useState('Royal Navy & Gold');

  // Label Shape & Corner Treatment
  const [selectedShape, setSelectedShape] = useState('square'); // 'square', 'rectangle', 'oval'
  const [selectedCorner, setSelectedCorner] = useState('rounded'); // 'rounded', 'sharp'

  // Decorative Border Style
  const [selectedBorderStyle, setSelectedBorderStyle] = useState('decorative'); // 'decorative', 'double', 'inset', 'single', 'stitched', 'minimal'

  // Typography Font
  const [selectedFont, setSelectedFont] = useState('Playfair Display');

  // Botanical / Pantry Line-Art Illustration Visibility
  const [showIllustration, setShowIllustration] = useState(true);

  // Active Regional Language
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem('fw_selected_lang') || 'tamil';
  });

  // Automatically adjust sheet quantity when label shape changes (Square: 35, Rectangle: 40)
  const handleSetShape = (newShape) => {
    setSelectedShape(newShape);
    if (newShape === 'square') {
      setSheetQuantity(prev => {
        const sheets = Math.max(1, Math.round(prev / 40) || 1);
        return sheets * 35;
      });
    } else if (newShape === 'rectangle') {
      setSheetQuantity(prev => {
        const sheets = Math.max(1, Math.round(prev / 35) || 1);
        return sheets * 40;
      });
    }
  };

  // Keep selectedBackground synced with selectedTheme
  useEffect(() => {
    const t = getThemeById(selectedTheme);
    setSelectedBackground(t?.name || selectedTheme);
  }, [selectedTheme]);

  // Persist language choice
  useEffect(() => {
    if (selectedLanguage) {
      localStorage.setItem('fw_selected_lang', selectedLanguage);
    }
  }, [selectedLanguage]);

  const toggleProductSelection = (productId) => {
    setSelectedProductIds(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const proceedWithSelection = async (token) => {
    if (selectedProductIds.length === 0) {
      throw new Error('No ingredients selected');
    }
    const themeObj = getThemeById(selectedTheme);
    const shapeLabel = selectedShape === 'square'
      ? `Square (${selectedCorner})`
      : selectedShape === 'rectangle'
        ? `Rectangle (${selectedCorner})`
        : selectedShape;

    // Send selection to backend (compatible with SelectionRequest)
    const response = await selectionService.postSelections({
      productIds: selectedProductIds,
      font: selectedFont,
      shape: shapeLabel,
      background: themeObj?.name || selectedTheme
    }, token);
    return response.data;
  };

  const clearSelections = () => {
    setSelectedProductIds([]);
    setSelectedTheme('navy-gold');
    setSelectedShape('square');
    setSelectedCorner('rounded');
    setSelectedBorderStyle('decorative');
    setSelectedFont('Playfair Display');
    setShowIllustration(true);
  };

  const value = {
    selectedProductIds,
    setSelectedProductIds,
    toggleProductSelection,
    consumerCategory,
    setConsumerCategory,
    selectedStateId,
    setSelectedStateId,
    cookingPreference,
    setCookingPreference,
    sheetQuantity,
    setSheetQuantity,
    selectedTheme,
    setSelectedTheme,
    selectedShape,
    setSelectedShape,
    handleSetShape,
    selectedCorner,
    setSelectedCorner,
    selectedBorderStyle,
    setSelectedBorderStyle,
    selectedFont,
    setSelectedFont,
    showIllustration,
    setShowIllustration,
    selectedLanguage,
    setSelectedLanguage,
    selectedBackground,
    setSelectedBackground,
    proceedWithSelection,
    clearSelections
  };

  return (
    <CustomisationContext.Provider value={value}>
      {children}
    </CustomisationContext.Provider>
  );
};

export default CustomisationContext;
