import React, { useState } from 'react';
import { Grid, Plus, Sprout, MapPin, Droplets, Compass } from 'lucide-react';
import { Language, NavigationTab } from '../types';
import { dataStore } from '../services/dataStore';

interface FarmPageProps {
  onSelectTab: (tab: NavigationTab) => void;
  onOpenCropDetail: (cropId: string) => void;
  onOpenAddCrop: () => void;
  language: Language;
}

export const FarmPage: React.FC<FarmPageProps> = ({
  onSelectTab,
  onOpenCropDetail,
  onOpenAddCrop,
  language
}) => {
  const farm = dataStore.getFarm();
  const farmer = dataStore.getFarmerProfile();
  const farmerCrops = dataStore.getFarmerCrops();

  const [showAddField, setShowAddField] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldArea, setNewFieldArea] = useState(1.0);
  const [newFieldSoil, setNewFieldSoil] = useState('Alluvial Loam (दोमट मिट्टी)');
  const [newFieldIrrigation, setNewFieldIrrigation] = useState('Borewell (नलकूप)');

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldName.trim()) return;
    dataStore.addField({
      name: newFieldName,
      areaAcres: newFieldArea,
      soilType: newFieldSoil,
      irrigationType: newFieldIrrigation
    });
    setNewFieldName('');
    setShowAddField(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#12372A', fontWeight: 800 }}>
            🏡 {language === 'hi' ? 'मेरा प्रक्षेत्र व भू-खंड (My Farm & Fields)' : 'My Farm & Land Parcels'}
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#4B5563' }}>
            📍 {farm.name} • कुल रकबा: {farm.totalAreaAcres} एकड़ ({farm.fields.length} भूखंड)
          </p>
        </div>

        <button onClick={() => setShowAddField(true)} className="btn btn-outline btn-sm">
          <Plus size={16} />
          <span>नया खेत प्लॉट जोड़ें</span>
        </button>
      </div>

      {/* Add Field Modal / Form */}
      {showAddField && (
        <div className="card" style={{ border: '2px solid #1E5631', background: '#F0FDF4' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#14532D', marginBottom: '0.75rem' }}>
            नया खेत / प्लॉट विवरण दर्ज करें:
          </h3>
          <form onSubmit={handleAddField}>
            <div className="form-row two-col">
              <div className="form-group">
                <label className="form-label">खेत का नाम (Field Name):</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="जैसे: पश्चिमी बाड़ी, नदी वाला खेत"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">रकबा (Area in Acres):</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  className="form-control"
                  value={newFieldArea}
                  onChange={(e) => setNewFieldArea(parseFloat(e.target.value) || 1)}
                  required
                />
              </div>
            </div>

            <div className="form-row two-col">
              <div className="form-group">
                <label className="form-label">मिट्टी का प्रकार (Soil):</label>
                <input
                  type="text"
                  className="form-control"
                  value={newFieldSoil}
                  onChange={(e) => setNewFieldSoil(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">सिंचाई साधन (Irrigation):</label>
                <input
                  type="text"
                  className="form-control"
                  value={newFieldIrrigation}
                  onChange={(e) => setNewFieldIrrigation(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary">खेत जोड़ें</button>
              <button type="button" onClick={() => setShowAddField(false)} className="btn btn-secondary">रद्द करें</button>
            </div>
          </form>
        </div>
      )}

      {/* Fields List */}
      <div className="grid-responsive three-col" style={{ gap: '1.25rem' }}>
        {farm.fields.map((fld) => {
          const plantedCrop = farmerCrops.find((c) => c.fieldId === fld.id || c.fieldName === fld.name);

          return (
            <div
              key={fld.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1.5px solid #E5E7EB',
                padding: '1.25rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span className="badge badge-verified">
                    {fld.areaAcres} एकड़ रकबा
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                    {fld.soilType.split(' ')[0]}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', color: '#12372A', marginBottom: '0.35rem' }}>
                  {fld.name}
                </h3>

                <div style={{ fontSize: '0.82rem', color: '#4B5563', display: 'flex', flexDirection: 'column', gap: '0.25rem', margin: '0.75rem 0' }}>
                  <div>💧 <strong>सिंचाई:</strong> {fld.irrigationType}</div>
                  <div>🌱 <strong>मृदा प्रकार:</strong> {fld.soilType}</div>
                </div>

                {/* Planted Crop Status */}
                {plantedCrop ? (
                  <div
                    onClick={() => onOpenCropDetail(plantedCrop.id)}
                    className="card-clickable"
                    style={{
                      background: '#F0FDF4',
                      border: '1px solid #BBF7D0',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      marginTop: '0.5rem'
                    }}
                  >
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>
                      बोई गई फसल (Active Crop):
                    </span>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#14532D', marginTop: '2px' }}>
                      🌾 {plantedCrop.variety}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#15803D' }}>
                      {plantedCrop.currentStageName} ({plantedCrop.calculatedAgeDays} दिन)
                    </div>
                  </div>
                ) : (
                  <div style={{ background: '#F8FAF7', padding: '0.75rem', borderRadius: '8px', border: '1px dashed #D1D5DB', textAlign: 'center', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>इस भूखंड पर अभी कोई फसल नहीं है</span>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #E5E7EB' }}>
                {!plantedCrop ? (
                  <button onClick={onOpenAddCrop} className="btn btn-outline btn-sm btn-block">
                    <Plus size={14} />
                    <span>इस खेत में फसल लगाएं</span>
                  </button>
                ) : (
                  <button onClick={() => onOpenCropDetail(plantedCrop.id)} className="btn btn-secondary btn-sm btn-block">
                    <span>फसल विवरण देखें</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
