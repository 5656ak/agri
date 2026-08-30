import React, { useState } from 'react';
import { Plus, Trash2, TrendingUp, Edit } from 'lucide-react';
import { MandiPrice, Language } from '../../types';
import { dataStore } from '../../services/dataStore';

interface AdminMarketViewProps {
  language: Language;
}

export const AdminMarketView: React.FC<AdminMarketViewProps> = () => {
  const mandiPrices = dataStore.getMandiPrices();
  const masterCrops = dataStore.getMasterCrops();

  const [showAddForm, setShowAddForm] = useState(false);
  const [cropId, setCropId] = useState('paddy');
  const [mandiName, setMandiName] = useState('पण्डरा कृषि बाजार समिति, रांची');
  const [district, setDistrict] = useState('Ranchi');
  const [state, setState] = useState('Jharkhand');
  const [modalPrice, setModalPrice] = useState(2350);
  const [minPrice, setMinPrice] = useState(2200);
  const [maxPrice, setMaxPrice] = useState(2480);
  const [priceDelta, setPriceDelta] = useState(3.5);

  const handleAddMandi = (e: React.FormEvent) => {
    e.preventDefault();
    const crop = masterCrops.find((c) => c.id === cropId);

    const newMandi: MandiPrice = {
      id: `mp-${Date.now()}`,
      cropId,
      cropNameHi: crop ? crop.nameHi : 'धान',
      cropNameEn: crop ? crop.nameEn : 'Paddy',
      mandiName,
      district,
      state,
      modalPricePerQuintal: modalPrice,
      minPrice,
      maxPrice,
      priceDeltaPercent: priceDelta,
      updatedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      history: [
        { date: '10 Aug', price: modalPrice - 100 },
        { date: '20 Aug', price: modalPrice - 50 },
        { date: '30 Aug', price: modalPrice }
      ]
    };

    dataStore.saveMandiPrice(newMandi);
    setShowAddForm(false);
    alert('मंडी भाव सफलतापूर्वक अपडेट हुआ! किसान के मार्केट पेज पर तुरंत दिखेगा।');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#12372A' }}>
          💰 दैनिक मंडी भाव प्रबंधन (Mandi Rates DB)
        </h2>
        <button onClick={() => setShowAddForm(true)} className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>नया मंडी भाव जोड़ें</span>
        </button>
      </div>

      {showAddForm && (
        <div className="card" style={{ border: '2px solid #1E5631', background: '#F8FAF7' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#14532D', marginBottom: '0.75rem' }}>
            मंडी दर रिकॉर्ड जोड़ें / संशोधित करें:
          </h3>
          <form onSubmit={handleAddMandi}>
            <div className="form-row two-col">
              <div className="form-group">
                <label className="form-label">फसल (Crop):</label>
                <select className="form-control" value={cropId} onChange={(e) => setCropId(e.target.value)}>
                  {masterCrops.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameHi}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">मंडी का नाम (Mandi Name):</label>
                <input type="text" className="form-control" value={mandiName} onChange={(e) => setMandiName(e.target.value)} required />
              </div>
            </div>

            <div className="form-row two-col">
              <div className="form-group">
                <label className="form-label">जिला (District):</label>
                <input type="text" className="form-control" value={district} onChange={(e) => setDistrict(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">राज्य (State):</label>
                <input type="text" className="form-control" value={state} onChange={(e) => setState(e.target.value)} required />
              </div>
            </div>

            <div className="form-row two-col">
              <div className="form-group">
                <label className="form-label">मॉडल भाव (Modal Price ₹/Q):</label>
                <input type="number" className="form-control" value={modalPrice} onChange={(e) => setModalPrice(parseFloat(e.target.value) || 0)} required />
              </div>
              <div className="form-group">
                <label className="form-label">साप्ताहिक बदलाव (+% Delta):</label>
                <input type="number" step="0.1" className="form-control" value={priceDelta} onChange={(e) => setPriceDelta(parseFloat(e.target.value) || 0)} required />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary">भाव प्रकाशित करें</button>
              <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary">रद्द करें</button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {mandiPrices.map((m) => (
          <div key={m.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#12372A' }}>{m.cropNameHi}</h3>
                <span className="badge badge-verified">{m.district}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                {m.mandiName} • अद्यतन: {m.updatedDate}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E5631' }}>
                  ₹{m.modalPricePerQuintal}
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: m.priceDeltaPercent >= 0 ? '#15803D' : '#DC2626' }}>
                  {m.priceDeltaPercent >= 0 ? `▲ +${m.priceDeltaPercent}%` : `▼ ${m.priceDeltaPercent}%`}
                </span>
              </div>

              <button onClick={() => dataStore.deleteMandiPrice(m.id)} className="btn btn-sm" style={{ color: '#DC2626', background: '#FEE2E2', border: 'none' }}>
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
