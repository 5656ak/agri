import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  X,
  Search,
  CheckCircle2,
  Sparkles,
  Compass,
  Building,
  RefreshCw,
  Layers,
  AlertCircle
} from 'lucide-react';
import { Language, LocationInfo } from '../../types';
import { dataStore } from '../../services/dataStore';
import { getTranslation } from '../../i18n/translations';
import { locationService, ALL_INDIAN_STATES_DISTRICTS } from '../../services/locationService';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose, language }) => {
  const t = getTranslation(language);
  const currentLoc = dataStore.getFarmerProfile().location;

  const [activeMode, setActiveMode] = useState<'gps' | 'manual' | 'pincode'>('gps');
  const [selectedState, setSelectedState] = useState(currentLoc.state || 'Jharkhand');
  const [selectedDistrict, setSelectedDistrict] = useState(currentLoc.district || 'Ranchi');
  const [block, setBlock] = useState(currentLoc.block || 'Kanke');
  const [village, setVillage] = useState(currentLoc.village || 'Sukhurhutu');
  const [pincode, setPincode] = useState(currentLoc.pincode || '');
  const [searchFilter, setSearchFilter] = useState('');

  // GPS State
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lon: number } | null>(
    currentLoc.latitude && currentLoc.longitude ? { lat: currentLoc.latitude, lon: currentLoc.longitude } : null
  );
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  if (!isOpen) return null;

  const districts = ALL_INDIAN_STATES_DISTRICTS[selectedState] || [];

  // Filter districts based on search query
  const filteredDistricts = searchFilter.trim()
    ? districts.filter((d) => d.toLowerCase().includes(searchFilter.toLowerCase()))
    : districts;

  // 1. High-Accuracy Hardware GPS Detection Handler
  const handleDetectGPS = async () => {
    setIsDetectingGPS(true);
    setStatusMessage({
      type: 'info',
      text: language === 'hi' ? '🛰️ उपग्रह GPS से उच्च-सटीक स्थान खोजा जा रहा है...' : '🛰️ Calibrating high-accuracy satellite GPS...'
    });

    try {
      const result = await locationService.fetchCurrentGPSLocation();
      setIsDetectingGPS(false);
      setGpsAccuracy(result.accuracyMeters);
      setGpsCoords({ lat: result.latitude, lon: result.longitude });

      setSelectedState(result.state);
      setSelectedDistrict(result.district);
      if (result.block) setBlock(result.block);
      if (result.village) setVillage(result.village);
      if (result.pincode) setPincode(result.pincode);

      const newLoc: LocationInfo = {
        latitude: result.latitude,
        longitude: result.longitude,
        state: result.state,
        district: result.district,
        block: result.block,
        village: result.village,
        pincode: result.pincode,
        formattedAddress: result.formattedAddress
      };

      dataStore.updateLocation(newLoc);

      setStatusMessage({
        type: 'success',
        text: language === 'hi'
          ? `✓ GPS स्थान प्राप्त (सटीकता: ±${result.accuracyMeters}m): ${result.district}, ${result.state}`
          : `✓ High-accuracy GPS verified (±${result.accuracyMeters}m): ${result.district}, ${result.state}`
      });

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setIsDetectingGPS(false);
      setStatusMessage({
        type: 'error',
        text: language === 'hi'
          ? 'GPS अनुमति नहीं मिली या सिग्नल कमजोर है। कृपया पिनकोड या नीचे से जिला चुनें।'
          : 'GPS timeout or permission denied. Please enter PIN code or select manually below.'
      });
    }
  };

  // 2. 6-Digit Indian PIN Code Lookup Handler
  const handlePincodeLookup = async (pin: string) => {
    setPincode(pin);
    if (pin.replace(/\D/g, '').length === 6) {
      setStatusMessage({
        type: 'info',
        text: language === 'hi' ? 'पिनकोड से जिला व ब्लॉक खोजा जा रहा है...' : 'Resolving postal district & block...'
      });

      const res = await locationService.lookupPincode(pin);
      if (res) {
        setSelectedState(res.state);
        setSelectedDistrict(res.district);
        setBlock(res.block);
        setVillage(res.village);
        setStatusMessage({
          type: 'success',
          text: language === 'hi'
            ? `✓ पिनकोड सत्यापित: ${res.village}, ${res.district} (${res.state})`
            : `✓ PIN Code verified: ${res.village}, ${res.district} (${res.state})`
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: language === 'hi' ? 'अमान्य पिनकोड या नेटवर्क त्रुटि।' : 'Invalid Indian PIN code or postal server busy.'
        });
      }
    }
  };

  // 3. Manual Form Submit Handler
  const handleSaveManual = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = [village, block, selectedDistrict, selectedState, pincode ? `PIN: ${pincode}` : '']
      .filter(Boolean)
      .join(', ');

    const newLoc: LocationInfo = {
      latitude: gpsCoords?.lat,
      longitude: gpsCoords?.lon,
      state: selectedState,
      district: selectedDistrict,
      block,
      village,
      pincode,
      formattedAddress: formatted || `${selectedDistrict}, ${selectedState}`
    };

    dataStore.updateLocation(newLoc);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px', padding: '1.5rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Compass size={20} color="#1E5631" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', color: '#12372A' }}>
                {language === 'hi' ? 'खेत का सटीक स्थान (Farm Location)' : 'Set Farm Location'}
              </h2>
              <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                उच्च-सटीक मौसम व स्थानीय मंडी भाव हेतु
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }}>
            <X size={20} color="#6B7280" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => setActiveMode('gps')}
            className="btn btn-sm"
            style={{
              background: activeMode === 'gps' ? '#1E5631' : '#F9FAFB',
              color: activeMode === 'gps' ? '#FFFFFF' : '#374151',
              border: activeMode === 'gps' ? '1px solid #1E5631' : '1px solid #E5E7EB',
              fontWeight: 700,
              fontSize: '0.8rem',
              borderRadius: '8px'
            }}
          >
            <Navigation size={14} />
            <span>🛰️ GPS ऑटो</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('pincode')}
            className="btn btn-sm"
            style={{
              background: activeMode === 'pincode' ? '#1E5631' : '#F9FAFB',
              color: activeMode === 'pincode' ? '#FFFFFF' : '#374151',
              border: activeMode === 'pincode' ? '1px solid #1E5631' : '1px solid #E5E7EB',
              fontWeight: 700,
              fontSize: '0.8rem',
              borderRadius: '8px'
            }}
          >
            <Building size={14} />
            <span>📮 पिन कोड</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('manual')}
            className="btn btn-sm"
            style={{
              background: activeMode === 'manual' ? '#1E5631' : '#F9FAFB',
              color: activeMode === 'manual' ? '#FFFFFF' : '#374151',
              border: activeMode === 'manual' ? '1px solid #1E5631' : '1px solid #E5E7EB',
              fontWeight: 700,
              fontSize: '0.8rem',
              borderRadius: '8px'
            }}
          >
            <Layers size={14} />
            <span>📋 राज्य/जिला</span>
          </button>
        </div>

        {/* Live Feedback Status Alert */}
        {statusMessage && (
          <div
            style={{
              padding: '0.7rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: statusMessage.type === 'success' ? '#F0FDF4' : statusMessage.type === 'error' ? '#FEF2F2' : '#EFF6FF',
              color: statusMessage.type === 'success' ? '#166534' : statusMessage.type === 'error' ? '#991B1B' : '#1E40AF',
              border: `1px solid ${statusMessage.type === 'success' ? '#BBF7D0' : statusMessage.type === 'error' ? '#FECACA' : '#BFDBFE'}`
            }}
          >
            {statusMessage.type === 'success' ? <CheckCircle2 size={16} /> : statusMessage.type === 'error' ? <AlertCircle size={16} /> : <RefreshCw size={16} className="animate-spin" />}
            <span style={{ flex: 1 }}>{statusMessage.text}</span>
          </div>
        )}

        {/* 1. GPS Mode View */}
        {activeMode === 'gps' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: '#F8FAF7', border: '1.5px dashed #1E5631', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#E8F5E9', margin: '0 auto 0.75rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Navigation size={28} color="#1E5631" />
              </div>
              <h3 style={{ fontSize: '1.05rem', color: '#12372A', marginBottom: '0.25rem' }}>
                {language === 'hi' ? 'उपग्रह GPS ऑटो-डिटेक्शन' : 'High-Accuracy Satellite GPS'}
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#4B5563', maxWidth: '380px', margin: '0 auto 1.25rem auto' }}>
                {language === 'hi'
                  ? 'आपके स्मार्टफोन या ब्राउज़र के GPS से खेत के अक्षांश, देशांतर व गांव का स्तर स्वतः ज्ञात करें।'
                  : 'Retrieves micro-level coordinates, Tehsil, and Village directly via hardware GPS.'}
              </p>

              <button
                type="button"
                onClick={handleDetectGPS}
                disabled={isDetectingGPS}
                className="btn btn-primary btn-block btn-lg"
                style={{ background: 'linear-gradient(135deg, #1E5631 0%, #2D6A4F 100%)', boxShadow: '0 4px 14px rgba(30, 86, 49, 0.25)' }}
              >
                <Navigation size={18} />
                <span>{isDetectingGPS ? (language === 'hi' ? 'GPS सिग्नल खोज रहे हैं...' : 'Acquiring GPS Signal...') : (language === 'hi' ? '🛰️ लाइव GPS से स्थान प्राप्त करें' : '🛰️ Detect Live High-Accuracy Location')}</span>
              </button>
            </div>

            {/* Current Active Location Card Preview */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1E5631', textTransform: 'uppercase' }}>
                  वर्तमान चयनित स्थान:
                </span>
                {gpsAccuracy && (
                  <span className="badge badge-verified" style={{ fontSize: '0.65rem' }}>
                    ±{gpsAccuracy}m GPS सटीकता
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#12372A' }}>
                📍 {currentLoc.formattedAddress}
              </div>
              {gpsCoords && (
                <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.2rem' }}>
                  अक्षांश: {gpsCoords.lat.toFixed(4)}°, देशांतर: {gpsCoords.lon.toFixed(4)}°
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. Pincode Mode View */}
        {activeMode === 'pincode' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">
                <span>{language === 'hi' ? '6-अंकों का डाक पिनकोड दर्ज करें:' : 'Enter 6-Digit Postal PIN Code:'}</span>
                <span style={{ fontSize: '0.75rem', color: '#1E5631' }}>जैसे: 834006, 141004, 221005</span>
              </label>
              <input
                type="text"
                maxLength={6}
                className="form-control"
                placeholder="6-Digit PIN Code (e.g. 834006)"
                value={pincode}
                onChange={(e) => handlePincodeLookup(e.target.value)}
                autoFocus
              />
            </div>

            {selectedDistrict && (
              <div style={{ background: '#F8FAF7', padding: '0.85rem', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
                  प्राप्त भौगोलिक विवरण:
                </span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#12372A', marginTop: '0.2rem' }}>
                  {village ? `${village}, ` : ''}{block ? `${block}, ` : ''}{selectedDistrict} ({selectedState})
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleSaveManual}
              className="btn btn-primary btn-block btn-lg"
              style={{ marginTop: '0.5rem' }}
            >
              <CheckCircle2 size={18} />
              <span>{language === 'hi' ? 'स्थान की पुष्टि करें और सहेजें' : 'Confirm & Save Location'}</span>
            </button>
          </div>
        )}

        {/* 3. Comprehensive Manual Hierarchy Mode View */}
        {activeMode === 'manual' && (
          <form onSubmit={handleSaveManual} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* State Selection */}
            <div className="form-group">
              <label className="form-label">{language === 'hi' ? 'राज्य (State):' : 'State:'}</label>
              <select
                className="form-control"
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  const firstDist = ALL_INDIAN_STATES_DISTRICTS[e.target.value]?.[0] || '';
                  setSelectedDistrict(firstDist);
                  setSearchFilter('');
                }}
              >
                {Object.keys(ALL_INDIAN_STATES_DISTRICTS).map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick District Filter Search Bar */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                <span>{language === 'hi' ? 'जिला चुनें (District):' : 'District:'}</span>
                <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                  {filteredDistricts.length} जिले उपलब्ध
                </span>
              </label>
              <div style={{ position: 'relative', marginBottom: '0.4rem' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder={language === 'hi' ? 'जिला खोजें (जैसे: Ranchi, Varanasi)...' : 'Filter district...'}
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  style={{ paddingLeft: '2.4rem' }}
                />
                <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>

              <select
                className="form-control"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                size={Math.min(5, Math.max(2, filteredDistricts.length))}
                style={{ maxHeight: '120px' }}
              >
                {filteredDistricts.map((dst) => (
                  <option key={dst} value={dst} style={{ padding: '0.35rem' }}>
                    {dst}
                  </option>
                ))}
              </select>
            </div>

            {/* Block & Village Input */}
            <div className="form-row two-col">
              <div className="form-group">
                <label className="form-label">{language === 'hi' ? 'प्रखंड / तहसील (Block):' : 'Block / Tehsil:'}</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="जैसे: Kanke, Sadar"
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{language === 'hi' ? 'गांव / क्षेत्र (Village):' : 'Village / Area:'}</label>
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
              <CheckCircle2 size={18} />
              <span>{language === 'hi' ? 'स्थान सहेजें और मौसम अपडेट करें' : 'Save Location & Sync Weather'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
