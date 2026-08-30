import { ActionRecommendation, Language } from '../types';
import { dataStore } from './dataStore';

export const recommendationEngine = {
  getTodayRecommendations(language: Language = 'hi'): ActionRecommendation[] {
    const farmer = dataStore.getFarmerProfile();
    const crops = dataStore.getFarmerCrops();
    const weather = dataStore.getWeather();
    const advisories = dataStore.getActiveAdvisoriesForFarmer();
    const mandiPrices = dataStore.getMandiPrices();

    const recommendations: ActionRecommendation[] = [];

    // 1. Weather-based Irrigation Action Directive
    if (weather.rainProbabilityPercent >= 50) {
      recommendations.push({
        id: 'rec-irrigation-rain',
        type: 'IRRIGATION',
        severity: 'INFO',
        titleEn: '💧 Do NOT Irrigate Today',
        titleHi: '💧 आज सिंचाई की आवश्यकता नहीं है',
        actionTextEn: `Rain probability is ${weather.rainProbabilityPercent}% in ${farmer.location.district}. Conserve water and power.`,
        actionTextHi: `आपके क्षेत्र (${farmer.location.district}) में आज ${weather.rainProbabilityPercent}% बारिश की संभावना है। पानी व बिजली की बचत करें।`,
        reasonEn: 'Upcoming precipitation will sufficiently maintain root zone moisture.',
        reasonHi: 'प्राकृतिक वर्षा से पौधों की जड़ों को पर्याप्त नमी मिल जाएगी।',
        targetTab: 'irrigation',
        icon: '🌧️'
      });
    } else {
      recommendations.push({
        id: 'rec-irrigation-needed',
        type: 'IRRIGATION',
        severity: 'WARNING',
        titleEn: '💧 Irrigation Recommended Tomorrow Morning',
        titleHi: '💧 कल सुबह हल्की सिंचाई करें',
        actionTextEn: 'No significant rain expected for the next 4 days. Irrigate vegetative plots.',
        actionTextHi: 'अगले 4 दिनों तक बारिश की संभावना कम है। कल्ले फूटने वाली धान व मक्का में नमी बनाए रखें।',
        reasonEn: 'Clear sunny conditions will increase crop evapotranspiration.',
        reasonHi: 'धूप व शुष्क मौसम में मिट्टी की नमी तेजी से घटती है।',
        targetTab: 'irrigation',
        icon: '💧'
      });
    }

    // 2. Active High-Priority Admin Advisories (ICAR / KVK Verified Broadcasts)
    advisories.forEach((adv) => {
      recommendations.push({
        id: `rec-adv-${adv.id}`,
        type: 'PEST',
        severity: adv.severity === 'CRITICAL' ? 'CRITICAL' : 'WARNING',
        titleEn: `🐛 ${adv.titleEn}`,
        titleHi: `🐛 ${adv.titleHi}`,
        actionTextEn: adv.actionEn,
        actionTextHi: adv.actionHi,
        reasonEn: adv.descriptionEn,
        reasonHi: adv.descriptionHi,
        targetTab: 'pests',
        icon: '⚠️'
      });
    });

    // 3. Crop Stage-Specific Fertilizer Directives
    const paddyCrop = crops.find((c) => c.cropId === 'paddy');
    if (paddyCrop && (paddyCrop.calculatedAgeDays || 0) >= 35 && (paddyCrop.calculatedAgeDays || 0) <= 55) {
      recommendations.push({
        id: 'rec-fert-paddy-tillering',
        type: 'FERTILIZER',
        severity: 'INFO',
        titleEn: '🌿 1st Nitrogen Top-Dress Due Soon',
        titleHi: '🌿 धान में पहली टॉप-ड्रेसिंग का समय',
        actionTextEn: 'Apply 30-35 kg Urea per acre after weeding, right after rains subside.',
        actionTextHi: 'निराई के उपरांत 30-35 किग्रा यूरिया प्रति एकड़ का संतुलित छिड़काव करें (बारिश रुकने पर)।',
        reasonEn: 'Tillering stage requires nitrogen boost to maximize productive tillers per hill.',
        reasonHi: 'कल्ले फूटने के समय नाइट्रोजन पौधों में अधिक बालियां बनाने में सहायक होती है।',
        cropName: paddyCrop.variety,
        targetTab: 'fertilizer',
        icon: '🌾'
      });
    }

    // 4. Tomato / Vegetable Scouting Directive
    const tomatoCrop = crops.find((c) => c.cropId === 'tomato');
    if (tomatoCrop) {
      recommendations.push({
        id: 'rec-pest-tomato-foliar',
        type: 'PEST',
        severity: 'INFO',
        titleEn: '🍅 Inspect Lower Tomato Leaves for Spots',
        titleHi: '🍅 टमाटर में निचली पत्तियों की जांच करें',
        actionTextEn: 'Check for early blight circular rings. Remove infected bottom leaves.',
        actionTextHi: 'झुलसा रोग के भूरे छल्लेदार धब्बों की जांच करें। रोगग्रस्त पत्तियों को तोड़कर नष्ट करें।',
        reasonEn: 'High humidity favours fungal spore germination in solanaceous vegetables.',
        reasonHi: 'हवा में अधिक नमी फफूंद जनित रोगों को बढ़ावा देती है।',
        cropName: tomatoCrop.variety,
        targetTab: 'pests',
        icon: '🍅'
      });
    }

    // 5. Market Opportunity Alert
    const highMandi = mandiPrices.find((m) => m.priceDeltaPercent >= 5.0);
    if (highMandi) {
      recommendations.push({
        id: `rec-mandi-${highMandi.id}`,
        type: 'MARKET',
        severity: 'SUCCESS',
        titleEn: `💰 Good Time to Sell: ${highMandi.cropNameEn}`,
        titleHi: `💰 बाजार अवसर: ${highMandi.cropNameHi} के भाव में तेजी`,
        actionTextEn: `Current rate in ${highMandi.mandiName} reached ₹${highMandi.modalPricePerQuintal}/Q (+${highMandi.priceDeltaPercent}% this week).`,
        actionTextHi: `${highMandi.mandiName} में भाव ₹${highMandi.modalPricePerQuintal}/क्विंटल पहुंच गया है (+${highMandi.priceDeltaPercent}% तेजी)।`,
        reasonEn: 'High demand in local mandis ensures better profit margin for fresh harvest.',
        reasonHi: 'स्थानीय मंडियों में मांग बढ़ने से बेहतर मुनाफा मिल रहा है।',
        targetTab: 'market',
        icon: '📈'
      });
    }

    // Return top 3–5 recommendations maximum for uncluttered UX
    return recommendations.slice(0, 4);
  }
};
