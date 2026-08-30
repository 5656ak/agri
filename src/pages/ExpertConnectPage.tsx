import React, { useState } from 'react';
import { Phone, PhoneCall, Mail, MapPin, Send, Camera, Mic, CheckCircle2, Building } from 'lucide-react';
import { Language } from '../types';
import { dataStore } from '../services/dataStore';

interface ExpertConnectPageProps {
  language: Language;
}

export const ExpertConnectPage: React.FC<ExpertConnectPageProps> = ({ language }) => {
  const farmer = dataStore.getFarmerProfile();
  const [cropName, setCropName] = useState('धान (Paddy)');
  const [questionText, setQuestionText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    setIsSubmitted(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="section-header">
        <h1 style={{ fontSize: '1.5rem', color: '#12372A', fontWeight: 800 }}>
          👨‍🌾 {language === 'hi' ? 'कृषि विशेषज्ञ व KVK वैज्ञानिक परामर्श' : 'Agronomist & KVK Expert Connect'}
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#4B5563' }}>
          {language === 'hi'
            ? 'फसल की समस्या लिखकर, फोटो भेजकर या सीधे राष्ट्रीय किसान हेल्पलाइन पर कॉल करके समाधान पाएं'
            : 'Direct consultation with district KVK scientists and national agricultural helplines'}
        </p>
      </div>

      {/* National Kisan Call Center Spotlight Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #1E5631 0%, #12372A 100%)',
          color: '#FFFFFF',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#4E9F3D', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <PhoneCall size={26} color="#FFFFFF" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', color: '#FFFFFF', marginBottom: '0.2rem' }}>
              {language === 'hi' ? 'राष्ट्रीय किसान कॉल सेंटर (Kisan Call Center)' : 'National Kisan Call Center'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#86EFAC' }}>
              निःशुल्क टोल-फ्री नंबर: सुबह 6:00 से रात 10:00 बजे तक
            </p>
          </div>
        </div>

        <a
          href="tel:18001801551"
          className="btn btn-lg"
          style={{ background: '#FFFFFF', color: '#12372A', fontWeight: 800, textDecoration: 'none' }}
        >
          <Phone size={20} />
          <span>1800-180-1551</span>
        </a>
      </div>

      {/* Consultation Request Form & KVK Directory */}
      <div className="grid-responsive two-col" style={{ gap: '1.5rem', alignItems: 'start' }}>
        {/* Form Card */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', color: '#12372A', marginBottom: '0.75rem' }}>
            विशेषज्ञ से प्रश्न पूछें (Ask an Expert)
          </h3>

          {isSubmitted ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', background: '#F0FDF4', borderRadius: '12px', border: '1.5px solid #BBF7D0' }}>
              <CheckCircle2 size={44} color="#16A34A" style={{ margin: '0 auto 0.75rem auto' }} />
              <h4 style={{ fontSize: '1.15rem', color: '#166534', fontWeight: 700 }}>
                परामर्श अनुरोध प्राप्त हुआ!
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#14532D', marginTop: '0.4rem' }}>
                आपका सवाल <strong>{farmer.location.district} KVK विशेषज्ञ</strong> को प्रेषित किया गया है। 24 घंटे के भीतर आपको फोन पर परामर्श मिलेगा।
              </p>
              <button onClick={() => { setIsSubmitted(false); setQuestionText(''); }} className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
                दूसरा प्रश्न पूछें
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">प्रभावित फसल (Affected Crop):</label>
                <input
                  type="text"
                  className="form-control"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">समस्या का विवरण (Describe the Issue):</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="जैसे: धान की पत्तियों पर भूरे धब्बे पड़ रहे हैं और गोभ सूख रही है। क्या करें?"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', flex: 1 }}>
                  <Camera size={16} />
                  <span>फोटो संलग्न करें</span>
                  <input type="file" accept="image/*" style={{ display: 'none' }} />
                </label>

                <button
                  type="button"
                  onClick={() => alert('आवाज रिकॉर्डिंग मोड सक्रिय!')}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                >
                  <Mic size={16} />
                  <span>आवाज संदेश जोड़ें</span>
                </button>
              </div>

              <button type="submit" className="btn btn-primary btn-block btn-lg">
                <Send size={18} />
                <span>परामर्श अनुरोध भेजें</span>
              </button>
            </form>
          )}
        </div>

        {/* District KVK Information Card */}
        <div className="card" style={{ border: '1.5px solid #E5E7EB' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#12372A' }}>
              आपके जिले का KVK केंद्र
            </h3>
            <span className="badge badge-verified">VERIFIED KVK</span>
          </div>

          <div style={{ background: '#F8FAF7', padding: '1rem', borderRadius: '10px', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#374151' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#12372A' }}>
              कृषि विज्ञान केंद्र (KVK), रांची
            </div>
            <div>
              <Building size={15} color="#1E5631" style={{ display: 'inline', marginRight: '4px' }} />
              संस्थान: <strong>बिरसा कृषि विश्वविद्यालय (BAU), कांके, रांची</strong>
            </div>
            <div>
              <MapPin size={15} color="#1E5631" style={{ display: 'inline', marginRight: '4px' }} />
              पता: KVK Kanke Campus, Ranchi, Jharkhand - 834006
            </div>
            <div>
              <Mail size={15} color="#1E5631" style={{ display: 'inline', marginRight: '4px' }} />
              ईमेल: kvkranchi@icar.gov.in
            </div>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <a
              href="tel:18001801551"
              className="btn btn-primary btn-block"
              style={{ textDecoration: 'none' }}
            >
              <Phone size={16} />
              <span>कॉल करें (1800-180-1551)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
