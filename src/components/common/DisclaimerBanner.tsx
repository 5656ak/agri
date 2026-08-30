import React from 'react';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';

interface DisclaimerBannerProps {
  type?: 'mandatory-ai' | 'warning' | 'info';
  customText?: string;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({
  type = 'mandatory-ai',
  customText
}) => {
  if (type === 'mandatory-ai') {
    return (
      <aside 
        className="disclaimer-banner danger" 
        role="note" 
        aria-label="AI Assessment Disclaimer"
      >
        <ShieldAlert className="disclaimer-icon" size={20} color="#DC2626" aria-hidden="true" />
        <div className="disclaimer-text">
          <strong>महत्वपूर्ण सूचना (Mandatory Notice):</strong> AI-assisted assessment — not a confirmed diagnosis. (यह एक AI-सहायित प्रारंभिक आकलन है, पक्का निदान नहीं। उच्च जोखिम या अनिश्चितता की स्थिति में नजदीकी KVK वैज्ञानिक से संपर्क करें।)
        </div>
      </aside>
    );
  }

  if (type === 'warning') {
    return (
      <aside 
        className="disclaimer-banner" 
        role="alert"
      >
        <AlertTriangle className="disclaimer-icon" size={20} color="#D97706" aria-hidden="true" />
        <div className="disclaimer-text">
          {customText || 'सावधानी: किसी भी कीटनाशक या रासायनिक दवा का प्रयोग करने से पहले लेबल पर दिए निर्देशों व सुरक्षा नियमों का पालन करें।'}
        </div>
      </aside>
    );
  }

  return (
    <aside 
      className="disclaimer-banner info" 
      role="note"
    >
      <Info className="disclaimer-icon" size={20} color="#16A34A" aria-hidden="true" />
      <div className="disclaimer-text">
        {customText || 'वैज्ञानिक सलाह: सभी सिफारिशें सत्यापित कृषि अनुसंधान आंकड़ों और पैकेज ऑफ प्रैक्टिसेज पर आधारित हैं।'}
      </div>
    </aside>
  );
};
