import React, { useState } from 'react';
import { MapPin, Navigation, X, Search, CheckCircle } from 'lucide-react';
import { Language, LocationInfo } from '../../types';
import { dataStore } from '../../services/dataStore';
import { getTranslation } from '../../i18n/translations';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const INDIAN_STATES_DISTRICTS: Record<string, string[]> = {
  Jharkhand: ['Ranchi', 'Ramgarh', 'Hazaribagh', 'Dhanbad', 'Bokaro', 'East Singhbhum (Jamshedpur)', 'Palamu', 'Deoghar'],
  Bihar: ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Nalanda', 'Rohtas', 'Vaishali', 'Purnia'],
  'Uttar Pradesh': ['Varanasi', 'Lucknow', 'Kanpur', 'Prayagraj', 'Meerut', 'Gorakhpur', 'Agra', 'Bareilly'],
  Punjab: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Sangrur', 'Firozpur'],
  Haryana: ['Karnal', 'Kurukshetra', 'Hisar', 'Ambala', 'Rohtak', 'Sirsa', 'Panipat'],
  Rajasthan: ['Jaipur', 'Alwar', 'Kota', 'Jodhpur', 'Bikaner', 'Udaipur', 'Sriganganagar'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Ujjain', 'Gwalior', 'Sagar', 'Rewa'],
  Maharashtra: ['Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Kolhapur', 'Solapur', 'Amravati']
};

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose, language }) => {
  const t = getTranslation(language);
  const currentLoc = dataStore.getFarmerProfile().location;

  const [selectedState, setSelectedState] = useState(currentLoc.state || 'Jharkhand');
  const [selectedDistrict, setSelectedDistrict] = useState(currentLoc.district || 'Ranchi');
  const [block, setBlock] = useState(currentLoc.block || 'Kanke');
  const [village, setVillage] = useState(currentLoc.village || 'Sukhurhutu');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const districts = INDIAN_STATES_DISTRICTS[selectedState] || [];

  const handleDetectGPS = () => {
    setIsDetecting(true);
    setMessage(null);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Simulated accurate Indian location resolution
          setIsDetecting(false);
          const detectedLoc: LocationInfo = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            state: selectedState,
            district: selectedDistrict,
            block: block,
            village: village,
            formattedAddress: `${selectedDistrict}, ${selectedState} (GPS Auto-detected)`
          };
          dataStore.updateLocation(detectedLoc);
          setMessage(language === 'hi' ? '✓ स्थान सफलतापूर्वक अपडेट हो गया!' : '✓ Location updated successfully!');
          setTimeout(() => {
            onClose();
          }, 800);
        },
        () => {
          setIsDetecting(false);
          // Fallback gracefully
          setMessage(language === 'hi' ? 'GPS अनुमति नहीं मिली, कृपया नीचे से जिला चुनें।' : 'GPS permission denied, please select your district manually below.');
        }
      );
    } else {
      setIsDetecting(false);
      setMessage('Geolocation not supported in this browser.');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newLoc: LocationInfo = {
      state: selectedState,
      district: selectedDistrict,
      block: block,
      village: village,
      formattedAddress: `${village ? `${village}, ` : ''}${selectedDistrict}, ${selectedState}`
    };
    dataStore.updateLocation(newLoc);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={22} color="#1E5631" />
            <h2 style={{ fontSize: '1.2rem', color: '#12372A' }}>
              {language === 'hi' ? 'अपना कृषि क्षेत्र / स्थान चुनें' : 'Select Farm Location'}
            </h2>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }}>
            <X size={20} color="#6B7280" />
          </button>
        </div>

        {/* GPS Detection Button */}
        <button
          type="button"
          onClick={handleDetectGPS}
          disabled={isDetecting}
          className="btn btn-primary btn-block"
          style={{ marginBottom: '1rem', background: 'linear-gradient(135deg, #1E5631 0%, #2D6A4F 100%)' }}
        >
          <Navigation size={18} />
          <span>{isDetecting ? 'Detecting GPS...' : t.detectLocation}</span>
        </button>

        {message && (
          <div style={{ padding: '0.6rem 0.85rem', borderRadius: '8px', background: '#F0FDF4', color: '#166534', fontSize: '0.85rem', marginBottom: '1rem', border: '1px solid #BBF7D0' }}>
            {message}
          </div>
        )}

        <div style={{ textAlign: 'center', margin: '0.75rem 0', color: '#6B7280', fontSize: '0.85rem', fontWeight: 600 }}>
          {language === 'hi' ? '— या मैनुअल रूप से चुनें —' : '— OR SELECT MANUALLY —'}
        </div>

        {/* Manual Form */}
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">
              <span>{language === 'hi' ? 'राज्य (State):' : 'State:'}</span>
            </label>
            <select
              className="form-control"
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict(INDIAN_STATES_DISTRICTS[e.target.value]?.[0] || '');
              }}
            >
              {Object.keys(INDIAN_STATES_DISTRICTS).map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>{language === 'hi' ? 'जिला (District):' : 'District:'}</span>
            </label>
            <select
              className="form-control"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              {districts.map((dst) => (
                <option key={dst} value={dst}>
                  {dst}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row two-col">
            <div className="form-group">
              <label className="form-label">
                <span>{language === 'hi' ? 'प्रखंड / ब्लॉक (Block):' : 'Block:'}</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="जैसे: Kanke, Sadar"
                value={block}
                onChange={(e) => setBlock(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>{language === 'hi' ? 'गांव / क्षेत्र (Village):' : 'Village:'}</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="जैसे: Sukhurhutu"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: '0.5rem' }}>
            <CheckCircle size={18} />
            <span>{language === 'hi' ? 'स्थान सहेजें' : 'Save Location'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
