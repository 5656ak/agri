import React, { useState } from 'react';
import { Sprout, X, PlusCircle } from 'lucide-react';
import { Language } from '../../types';
import { dataStore } from '../../services/dataStore';

interface AddCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const AddCropModal: React.FC<AddCropModalProps> = ({ isOpen, onClose, language }) => {
  const masterCrops = dataStore.getMasterCrops();
  const fields = dataStore.getFarm().fields;

  const [cropId, setCropId] = useState(masterCrops[0]?.id || 'paddy');
  const [variety, setVariety] = useState('');
  const [fieldId, setFieldId] = useState(fields[0]?.id || 'field-1');
  const [areaAcres, setAreaAcres] = useState<number>(2.0);
  const [sowingDate, setSowingDate] = useState(new Date().toISOString().split('T')[0]);
  const [soilType, setSoilType] = useState('Clay Loam (मटियारी दोमट)');
  const [irrigationType, setIrrigationType] = useState('Canal / Borewell');

  if (!isOpen) return null;

  const selectedMaster = masterCrops.find((c) => c.id === cropId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dataStore.addFarmerCrop({
      cropId,
      variety: variety || (selectedMaster?.varieties[0] || 'High Yield Variety'),
      fieldId,
      areaAcres,
      sowingDate,
      soilType,
      irrigationType
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sprout size={22} color="#1E5631" />
            <h2 style={{ fontSize: '1.2rem', color: '#12372A' }}>
              {language === 'hi' ? 'नई फसल जोड़ें (Add Crop)' : 'Add New Crop'}
            </h2>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
            <X size={20} color="#6B7280" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Crop Selector */}
          <div className="form-group">
            <label className="form-label">{language === 'hi' ? 'फसल चुनें (Crop):' : 'Crop:'}</label>
            <select
              className="form-control"
              value={cropId}
              onChange={(e) => {
                setCropId(e.target.value);
                const master = masterCrops.find((m) => m.id === e.target.value);
                if (master && master.varieties.length > 0) {
                  setVariety(master.varieties[0]);
                }
              }}
            >
              {masterCrops.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {language === 'hi' ? c.nameHi : c.nameEn} ({c.season} • {c.category})
                </option>
              ))}
            </select>
          </div>

          {/* Variety */}
          <div className="form-group">
            <label className="form-label">
              <span>{language === 'hi' ? 'किस्म / वैरायटी (Variety):' : 'Variety:'}</span>
              {selectedMaster?.varieties && selectedMaster.varieties.length > 0 && (
                <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                  सुझाव: {selectedMaster.varieties[0]}
                </span>
              )}
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="जैसे: Swarna, HD-2967, HQPM-1"
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
            />
          </div>

          {/* Field Selection & Area */}
          <div className="form-row two-col">
            <div className="form-group">
              <label className="form-label">{language === 'hi' ? 'खेत / प्लॉट (Field):' : 'Field:'}</label>
              <select
                className="form-control"
                value={fieldId}
                onChange={(e) => setFieldId(e.target.value)}
              >
                {fields.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.areaAcres} एकड़)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{language === 'hi' ? 'रकबा (Area in Acres):' : 'Area (Acres):'}</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="50"
                className="form-control"
                value={areaAcres}
                onChange={(e) => setAreaAcres(parseFloat(e.target.value) || 1)}
              />
            </div>
          </div>

          {/* Sowing Date */}
          <div className="form-group">
            <label className="form-label">{language === 'hi' ? 'बुवाई की तारीख (Sowing Date):' : 'Sowing Date:'}</label>
            <input
              type="date"
              className="form-control"
              value={sowingDate}
              onChange={(e) => setSowingDate(e.target.value)}
            />
          </div>

          {/* Soil & Irrigation */}
          <div className="form-row two-col">
            <div className="form-group">
              <label className="form-label">{language === 'hi' ? 'मृदा (Soil):' : 'Soil Type:'}</label>
              <select
                className="form-control"
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
              >
                <option value="Clay Loam (मटियारी दोमट)">मटियारी दोमट (Clay Loam)</option>
                <option value="Sandy Loam (बलुई दोमट)">बलुई दोमट (Sandy Loam)</option>
                <option value="Alluvial Soil (जलोढ़ मिट्टी)">जलोढ़ मिट्टी (Alluvial)</option>
                <option value="Black Cotton Soil (काली मिट्टी)">काली मिट्टी (Black Soil)</option>
                <option value="Red Sandy Soil (लाल मिट्टी)">लाल मिट्टी (Red Soil)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{language === 'hi' ? 'सिंचाई (Irrigation):' : 'Irrigation Method:'}</label>
              <select
                className="form-control"
                value={irrigationType}
                onChange={(e) => setIrrigationType(e.target.value)}
              >
                <option value="Canal / Flood">नहर / खुली नाली (Canal)</option>
                <option value="Borewell / Tube Well">नलकूप (Tube well)</option>
                <option value="Drip Irrigation">ड्रिप सिंचाई (Drip)</option>
                <option value="Sprinkler">फव्वारा (Sprinkler)</option>
                <option value="Rainfed (वर्षा आधारित)">वर्षा आधारित (Rainfed)</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: '0.5rem' }}>
            <PlusCircle size={18} />
            <span>{language === 'hi' ? 'फसल जोड़ें और कार्ययोजना बनाएं' : 'Add Crop & Generate Plan'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
