/**
 * Complete and official list of all 28 Indian States and 8 Union Territories (Total: 36).
 * Includes regional metadata to power state-specific culinary suggestions and language defaults.
 */

export const INDIAN_STATES = [
  // Preserving original database IDs 1-5 for compatibility
  {
    id: 1,
    name: 'Delhi',
    type: 'Union Territory',
    region: 'North',
    language: 'Hindi',
    langCode: 'hindi',
    cuisine: 'Mughlai & North Indian',
    topIngredients: 'Basmati Rice, Rajma, Garam Masala, Atta, Ghee'
  },
  {
    id: 2,
    name: 'Maharashtra',
    type: 'State',
    region: 'West',
    language: 'Marathi',
    langCode: 'marathi',
    cuisine: 'Maharashtrian & Konkani',
    topIngredients: 'Poha, Besan, Groundnut, Goda Masala, Jaggery'
  },
  {
    id: 3,
    name: 'Karnataka',
    type: 'State',
    region: 'South',
    language: 'Kannada',
    langCode: 'kannada',
    cuisine: 'Kannada & Udupi',
    topIngredients: 'Toor Dal, Ragi, Bisi Bele Bath Masala, Coconut Oil, Byadgi Chilli'
  },
  {
    id: 4,
    name: 'Tamil Nadu',
    type: 'State',
    region: 'South',
    language: 'Tamil',
    langCode: 'tamil',
    cuisine: 'South Indian & Chettinad',
    topIngredients: 'Rice, Sambar Powder, Rasam Powder, Toor Dal, Gingelly Oil, Curry Leaves'
  },
  {
    id: 5,
    name: 'West Bengal',
    type: 'State',
    region: 'East',
    language: 'Bengali',
    langCode: 'bengali',
    cuisine: 'Bengali Cuisine',
    topIngredients: 'Mustard Oil, Panch Phoron, Gobindobhog Rice, Posto, Kalonji'
  },
  {
    id: 6,
    name: 'Andhra Pradesh',
    type: 'State',
    region: 'South',
    language: 'Telugu',
    langCode: 'telugu',
    cuisine: 'Andhra & Telugu Cuisine',
    topIngredients: 'Guntur Chilli, Toor Dal, Tamarind, Gingelly Oil, Mustard'
  },
  {
    id: 7,
    name: 'Arunachal Pradesh',
    type: 'State',
    region: 'Northeast',
    language: 'English / Hindi',
    langCode: 'hindi',
    cuisine: 'Northeastern Cuisine',
    topIngredients: 'Rice, Bamboo Shoots, Ginger, Mustard Leaves, Black Sesame'
  },
  {
    id: 8,
    name: 'Assam',
    type: 'State',
    region: 'Northeast',
    language: 'Assamese',
    langCode: 'assamese',
    cuisine: 'Assamese Cuisine',
    topIngredients: 'Johaa Rice, Mustard Oil, Panch Phoron, Ginger, Turmeric'
  },
  {
    id: 9,
    name: 'Bihar',
    type: 'State',
    region: 'East',
    language: 'Hindi',
    langCode: 'hindi',
    cuisine: 'Bihari Cuisine',
    topIngredients: 'Sattu, Mustard Oil, Chana Dal, Mangrella, Bay Leaf'
  },
  {
    id: 10,
    name: 'Chhattisgarh',
    type: 'State',
    region: 'Central',
    language: 'Hindi',
    langCode: 'hindi',
    cuisine: 'Chhattisgarhi Cuisine',
    topIngredients: 'Rice, Urad Dal, Mahuwa, Mustard Oil, Red Chilli'
  },
  {
    id: 11,
    name: 'Goa',
    type: 'State',
    region: 'West',
    language: 'Konkani / Marathi',
    langCode: 'marathi',
    cuisine: 'Goan & Konkani',
    topIngredients: 'Kokum, Coconut Oil, Kashmiri Chilli, Toddy Vinegar, Pepper'
  },
  {
    id: 12,
    name: 'Gujarat',
    type: 'State',
    region: 'West',
    language: 'Gujarati',
    langCode: 'gujarati',
    cuisine: 'Gujarati Cuisine',
    topIngredients: 'Besan, Groundnut Oil, Sesame Seeds, Cumin, Jaggery, Turmeric'
  },
  {
    id: 13,
    name: 'Haryana',
    type: 'State',
    region: 'North',
    language: 'Hindi',
    langCode: 'hindi',
    cuisine: 'Haryanvi & North Indian',
    topIngredients: 'Atta, Desi Ghee, Bajra, Mustard, Garam Masala'
  },
  {
    id: 14,
    name: 'Himachal Pradesh',
    type: 'State',
    region: 'North',
    language: 'Hindi',
    langCode: 'hindi',
    cuisine: 'Pahari Cuisine',
    topIngredients: 'Rajma, Mustard Oil, Cardamom, Cloves, Coriander Seeds'
  },
  {
    id: 15,
    name: 'Jharkhand',
    type: 'State',
    region: 'East',
    language: 'Hindi',
    langCode: 'hindi',
    cuisine: 'Jharkhandi Cuisine',
    topIngredients: 'Rice, Chana Dal, Mustard Oil, Panch Phoron, Garlic'
  },
  {
    id: 16,
    name: 'Kerala',
    type: 'State',
    region: 'South',
    language: 'Malayalam',
    langCode: 'malayalam',
    cuisine: 'Kerala Traditional',
    topIngredients: 'Coconut Oil, Matta Rice, Cardamom, Black Pepper, Mustard, Curry Leaves'
  },
  {
    id: 17,
    name: 'Madhya Pradesh',
    type: 'State',
    region: 'Central',
    language: 'Hindi',
    langCode: 'hindi',
    cuisine: 'Malwi & Bundelkhandi',
    topIngredients: 'Poha, Wheat Flour, Coriander, Garam Masala, Groundnut'
  },
  {
    id: 18,
    name: 'Manipur',
    type: 'State',
    region: 'Northeast',
    language: 'Manipuri / English',
    langCode: 'hindi',
    cuisine: 'Manipuri Cuisine',
    topIngredients: 'Black Rice, Mustard Seeds, Ginger, Dried Fish, Chillies'
  },
  {
    id: 19,
    name: 'Meghalaya',
    type: 'State',
    region: 'Northeast',
    language: 'English / Khasi',
    langCode: 'hindi',
    cuisine: 'Khasi & Garo Cuisine',
    topIngredients: 'Black Sesame, Ginger, Garlic, Mustard Oil, Red Rice'
  },
  {
    id: 20,
    name: 'Mizoram',
    type: 'State',
    region: 'Northeast',
    language: 'Mizo / English',
    langCode: 'hindi',
    cuisine: 'Mizo Cuisine',
    topIngredients: 'Rice, Mustard Oil, Ginger, Garlic, Cardamom'
  },
  {
    id: 21,
    name: 'Nagaland',
    type: 'State',
    region: 'Northeast',
    language: 'English',
    langCode: 'hindi',
    cuisine: 'Naga Cuisine',
    topIngredients: 'Bhut Jolokia, Bamboo Shoots, Fermented Soyabean, Ginger'
  },
  {
    id: 22,
    name: 'Odisha',
    type: 'State',
    region: 'East',
    language: 'Odia',
    langCode: 'odia',
    cuisine: 'Odia Cuisine',
    topIngredients: 'Mustard Oil, Panch Phoron, Arua Rice, Moong Dal, Turmeric'
  },
  {
    id: 23,
    name: 'Punjab',
    type: 'State',
    region: 'North',
    language: 'Punjabi',
    langCode: 'punjabi',
    cuisine: 'Punjabi Cuisine',
    topIngredients: 'Basmati Rice, Rajma, Chole, Desi Ghee, Kasuri Methi, Garam Masala'
  },
  {
    id: 24,
    name: 'Rajasthan',
    type: 'State',
    region: 'North',
    language: 'Hindi',
    langCode: 'hindi',
    cuisine: 'Rajasthani & Marwari',
    topIngredients: 'Besan, Bajra, Amchur, Mathania Chilli, Ghee, Cumin, Hing'
  },
  {
    id: 25,
    name: 'Sikkim',
    type: 'State',
    region: 'Northeast',
    language: 'Nepali / English',
    langCode: 'hindi',
    cuisine: 'Sikkimese Cuisine',
    topIngredients: 'Large Cardamom, Mustard Seeds, Ginger, Garlic, Dalle Chilli'
  },
  {
    id: 26,
    name: 'Telangana',
    type: 'State',
    region: 'South',
    language: 'Telugu',
    langCode: 'telugu',
    cuisine: 'Telangana & Hyderabadi',
    topIngredients: 'Biryani Masala, Toor Dal, Tamarind, Sesame Seeds, Shahi Jeera'
  },
  {
    id: 27,
    name: 'Tripura',
    type: 'State',
    region: 'Northeast',
    language: 'Bengali',
    langCode: 'bengali',
    cuisine: 'Tripuri & Bengali',
    topIngredients: 'Rice, Mustard Oil, Panch Phoron, Turmeric, Ginger'
  },
  {
    id: 28,
    name: 'Uttar Pradesh',
    type: 'State',
    region: 'North',
    language: 'Hindi / Urdu',
    langCode: 'hindi',
    cuisine: 'Awadhi & UP Cuisine',
    topIngredients: 'Wheat Flour, Basmati Rice, Garam Masala, Mustard Oil, Cardamom'
  },
  {
    id: 29,
    name: 'Uttarakhand',
    type: 'State',
    region: 'North',
    language: 'Hindi',
    langCode: 'hindi',
    cuisine: 'Garhwali & Kumaoni',
    topIngredients: 'Gahat Dal, Jakhya, Mustard Oil, Mandua Flours, Red Chilli'
  },

  // 8 Union Territories
  {
    id: 30,
    name: 'Andaman and Nicobar Islands',
    type: 'Union Territory',
    region: 'South',
    language: 'Hindi / English / Tamil',
    langCode: 'tamil',
    cuisine: 'Island & Coastal Seafood',
    topIngredients: 'Coconut Oil, Black Pepper, Cardamom, Rice, Curry Leaves'
  },
  {
    id: 31,
    name: 'Chandigarh',
    type: 'Union Territory',
    region: 'North',
    language: 'Punjabi / Hindi',
    langCode: 'punjabi',
    cuisine: 'Punjabi & North Indian',
    topIngredients: 'Basmati Rice, Chole, Rajma, Desi Ghee, Garam Masala'
  },
  {
    id: 32,
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    type: 'Union Territory',
    region: 'West',
    language: 'Gujarati / Hindi',
    langCode: 'gujarati',
    cuisine: 'Gujarati & Coastal',
    topIngredients: 'Groundnut Oil, Besan, Cumin, Mustard, Kokum'
  },
  {
    id: 33,
    name: 'Jammu and Kashmir',
    type: 'Union Territory',
    region: 'North',
    language: 'Urdu / Hindi',
    langCode: 'urdu',
    cuisine: 'Kashmiri Wazwan',
    topIngredients: 'Kashmiri Chilli, Saffron, Fennel Powder, Dry Ginger (Sonth), Cloves'
  },
  {
    id: 34,
    name: 'Ladakh',
    type: 'Union Territory',
    region: 'North',
    language: 'Ladakhi / Hindi',
    langCode: 'hindi',
    cuisine: 'Ladakhi & Tibetan',
    topIngredients: 'Barley (Tsampa), Black Pepper, Garlic, Cardamom, Butter'
  },
  {
    id: 35,
    name: 'Lakshadweep',
    type: 'Union Territory',
    region: 'South',
    language: 'Malayalam',
    langCode: 'malayalam',
    cuisine: 'Malabar & Island Coastal',
    topIngredients: 'Coconut Oil, Black Pepper, Rice, Coriander, Turmeric'
  },
  {
    id: 36,
    name: 'Puducherry',
    type: 'Union Territory',
    region: 'South',
    language: 'Tamil',
    langCode: 'tamil',
    cuisine: 'French-Tamil Fusion',
    topIngredients: 'Rice, Sambar Masala, Black Pepper, Gingelly Oil, Bay Leaf'
  }
];

export const getIndianStateById = (id) => {
  if (!id) return INDIAN_STATES[3]; // Default to Tamil Nadu
  return INDIAN_STATES.find(s => String(s.id) === String(id)) || INDIAN_STATES[3];
};

export const getIndianStateByName = (name) => {
  if (!name) return INDIAN_STATES[3];
  const query = String(name).trim().toLowerCase();
  return INDIAN_STATES.find(s => s.name.toLowerCase() === query) || INDIAN_STATES[3];
};

export default INDIAN_STATES;
