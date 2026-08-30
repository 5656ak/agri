import { Language } from '../types';

export const translations = {
  hi: {
    // Brand & Header
    appName: 'KisanSaathi',
    tagline: 'आपके खेत का स्मार्ट साथी',
    greeting: 'नमस्ते, किसान 👋',
    changeLocation: 'स्थान बदलें',
    detectLocation: 'GPS से खोजें',
    searchLocation: 'जिला या गांव खोजें...',
    notification: 'सूचनाएं',
    profile: 'प्रोफाइल',
    adminPanel: 'एडमिन पैनल',
    farmerView: 'किसान डैशबोर्ड',

    // Bottom Navigation
    navHome: 'होम',
    navCrops: 'फसलें',
    navScan: 'स्कैन',
    navFarm: 'मेरा खेत',
    navMore: 'अन्य',

    // Section Titles
    todayAdviceTitle: '🌱 आज आपके खेत में (Today\'s Advice)',
    todayAdviceSubtitle: 'मौसम, फसल अवस्था और वैज्ञानिकों के परामर्श अनुसार आज के मुख्य कार्य:',
    myCropsTitle: '🌾 मेरी सक्रिय फसलें',
    quickActionsTitle: '⚡ मुख्य सेवाएं (Quick Actions)',
    mandiTitle: '💰 आज के मंडी भाव',
    schemesTitle: '🏛️ आपके लिए सरकारी योजनाएं',
    activitiesTitle: '📅 आगामी कृषि कार्य',

    // Quick Actions
    qaScan: 'फसल स्कैन करें',
    qaIrrigation: 'सिंचाई सलाहकार',
    qaFertilizer: 'खाद कैलकुलेटर',
    qaMandi: 'मंडी भाव',
    qaSchemes: 'सरकारी योजनाएं',
    qaCalendar: 'फसल कैलेंडर',
    qaExpenses: 'खर्च व मुनाफा',
    qaExpert: 'वैज्ञानिक से पूछें',

    // Statuses
    statusHealthy: 'उत्कृष्ट व स्वस्थ',
    statusAttention: 'निगरानी जरूरी',
    statusCritical: 'तुरंत उपचार आवश्यक',
    irrigationNotRequired: 'सिंचाई की जरूरत नहीं है',
    irrigationSoon: 'शीघ्र सिंचाई की तैयारी रखें',
    irrigationRequired: 'आज सिंचाई आवश्यक है',

    // Buttons & Form
    viewDetails: 'विवरण देखें',
    addCrop: '+ नई फसल जोड़ें',
    addActivity: 'कार्य जोड़ें',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    calculate: 'गणना करें',
    exploreMore: 'सभी देखें',
    askVoice: 'बोलकर पूछें',
    applyNow: 'आवेदन पोर्टल देखें',
    callKisanHelpline: 'किसान कॉल सेंटर (1800-180-1551)',

    // Empty States
    noCropsTitle: '🌱 आपने अभी कोई फसल नहीं जोड़ी है',
    noCropsDesc: 'अपनी फसल और बुवाई की तारीख जोड़कर व्यक्तिगत दैनिक परामर्श प्राप्त करें।',
    noExpensesTitle: '💰 अभी कोई खर्च दर्ज नहीं है',
    noExpensesDesc: 'खाद, बीज या जुताई का खर्च जोड़कर अपने खेत का सही मुनाफा जानें।',

    // Error & Loading
    loading: 'लोड हो रहा है...',
    errorTitle: '😕 कुछ समस्या आई',
    errorDesc: 'कृपया थोड़ा इंतजार करें या दोबारा प्रयास करें।',
    disclaimer: 'यह एक निर्णय-सहायक प्रणाली है। जटिल रोग की स्थिति में नजदीकी कृषि विज्ञान केंद्र (KVK) से संपर्क करें।'
  },
  en: {
    // Brand & Header
    appName: 'KisanSaathi',
    tagline: 'Your Smart Farming Assistant',
    greeting: 'Namaste, Kisan 👋',
    changeLocation: 'Change Location',
    detectLocation: 'Detect via GPS',
    searchLocation: 'Search District or Village...',
    notification: 'Notifications',
    profile: 'Profile',
    adminPanel: 'Admin Panel',
    farmerView: 'Farmer Dashboard',

    // Bottom Navigation
    navHome: 'Home',
    navCrops: 'Crops',
    navScan: 'Scan',
    navFarm: 'My Farm',
    navMore: 'Menu',

    // Section Titles
    todayAdviceTitle: '🌱 Today in Your Field',
    todayAdviceSubtitle: 'Actionable farm directives computed from weather, crop stage & agronomist rules:',
    myCropsTitle: '🌾 My Active Crops',
    quickActionsTitle: '⚡ Quick Actions',
    mandiTitle: '💰 Local Mandi Prices',
    schemesTitle: '🏛️ Government Schemes for You',
    activitiesTitle: '📅 Upcoming Farm Activities',

    // Quick Actions
    qaScan: 'Scan Crop',
    qaIrrigation: 'Irrigation Advisor',
    qaFertilizer: 'Fertilizer Advisor',
    qaMandi: 'Mandi Rates',
    qaSchemes: 'Govt Schemes',
    qaCalendar: 'Farming Calendar',
    qaExpenses: 'Expense & Profit',
    qaExpert: 'Ask Agronomist',

    // Statuses
    statusHealthy: 'Healthy & Thriving',
    statusAttention: 'Monitoring Required',
    statusCritical: 'Immediate Action Needed',
    irrigationNotRequired: 'Irrigation Not Required',
    irrigationSoon: 'Prepare for Irrigation Soon',
    irrigationRequired: 'Irrigation Needed Today',

    // Buttons & Form
    viewDetails: 'View Details',
    addCrop: '+ Add New Crop',
    addActivity: 'Add Activity',
    save: 'Save',
    cancel: 'Cancel',
    calculate: 'Calculate',
    exploreMore: 'Explore All',
    askVoice: 'Ask with Voice',
    applyNow: 'Open Official Portal',
    callKisanHelpline: 'Kisan Call Center (1800-180-1551)',

    // Empty States
    noCropsTitle: '🌱 No crops added yet',
    noCropsDesc: 'Add your crop and sowing date to unlock customized daily field directives.',
    noExpensesTitle: '💰 No expenses recorded yet',
    noExpensesDesc: 'Record your seed, fertilizer, and labour costs to track net farm profit.',

    // Error & Loading
    loading: 'Loading...',
    errorTitle: '😕 Something went wrong',
    errorDesc: 'Please try again in a few moments.',
    disclaimer: 'This is an agricultural decision-support tool. For complex infestations, consult your district KVK scientist.'
  }
};

export const getTranslation = (lang: Language) => {
  return translations[lang] || translations.hi;
};
