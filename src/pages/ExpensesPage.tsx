import React, { useState } from 'react';
import { Wallet, Plus, TrendingUp, ArrowUpRight, ArrowDownRight, Trash2, PieChart } from 'lucide-react';
import { Language } from '../types';
import { dataStore } from '../services/dataStore';

interface ExpensesPageProps {
  language: Language;
}

export const ExpensesPage: React.FC<ExpensesPageProps> = ({ language }) => {
  const expenses = dataStore.getExpenses();
  const summary = dataStore.getFinancialSummary();

  const [showAddForm, setShowAddForm] = useState(false);
  const [category, setCategory] = useState<'Seeds' | 'Fertilizer' | 'Pesticide' | 'Labour' | 'Machinery' | 'Diesel' | 'Irrigation' | 'Other'>('Fertilizer');
  const [amount, setAmount] = useState<number>(1500);
  const [cropName, setCropName] = useState('धान (Paddy)');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;

    dataStore.addExpense({
      category,
      amount,
      cropName,
      notes,
      date
    });

    setNotes('');
    setShowAddForm(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#12372A', fontWeight: 800 }}>
            💰 {language === 'hi' ? 'खर्च, आय व मुनाफा ट्रैकर' : 'Farm Expenses & Profit Tracker'}
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#4B5563' }}>
            {language === 'hi'
              ? 'खाद, बीज, जुताई व मजदूरी का हिसाब रखें और फसलवार शुद्ध मुनाफा जानें'
              : 'Record farm operational inputs and calculate projected net harvest profit'}
          </p>
        </div>

        <button onClick={() => setShowAddForm(true)} className="btn btn-primary">
          <Plus size={18} />
          <span>+ नया खर्च दर्ज करें</span>
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid-responsive three-col" style={{ gap: '1rem' }}>
        {/* Total Cost */}
        <div className="card" style={{ background: '#FFF1F2', border: '1.5px solid #FECDD3' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9F1239', textTransform: 'uppercase' }}>
            कुल लागत (Total Investment)
          </span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#BE123C', marginTop: '0.2rem' }}>
            ₹{summary.totalExpense.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#881337' }}>
            {expenses.length} खर्च प्रविष्टियां दर्ज
          </span>
        </div>

        {/* Expected Harvest Revenue */}
        <div className="card" style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
            अनुमानित कुल उपज आय (Expected Revenue)
          </span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#15803D', marginTop: '0.2rem' }}>
            ₹{summary.estimatedRevenue.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#14532D' }}>
            वर्तमान मंडी भाव पर अनुमानित
          </span>
        </div>

        {/* Projected Net Profit */}
        <div className="card" style={{ background: '#EFF6FF', border: '1.5px solid #BFDBFE' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1E40AF', textTransform: 'uppercase' }}>
            अनुमानित शुद्ध मुनाफा (Net Profit)
          </span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1D4ED8', marginTop: '0.2rem' }}>
            ₹{summary.projectedProfit.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#1E3A8A', fontWeight: 600 }}>
            लगभग {Math.round((summary.projectedProfit / summary.estimatedRevenue) * 100)}% मार्जिन
          </span>
        </div>
      </div>

      {/* Add Expense Form Drawer */}
      {showAddForm && (
        <div className="card" style={{ border: '2px solid #1E5631', background: '#F8FAF7' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#12372A', marginBottom: '0.75rem' }}>
            नया कृषि खर्च दर्ज करें (Add New Expense):
          </h3>
          <form onSubmit={handleAddExpense}>
            <div className="form-row two-col">
              <div className="form-group">
                <label className="form-label">खर्च की श्रेणी (Category):</label>
                <select
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                >
                  <option value="Fertilizer">खाद / उर्वरक (Fertilizer)</option>
                  <option value="Seeds">बीज (Seeds)</option>
                  <option value="Pesticide">कीटनाशक / दवा (Pesticide)</option>
                  <option value="Labour">मजदूरी (Labour)</option>
                  <option value="Machinery">ट्रैक्टर / जुताई (Machinery)</option>
                  <option value="Diesel">डीजल / ईंधन (Diesel)</option>
                  <option value="Irrigation">सिंचाई बिजली/पानी (Irrigation)</option>
                  <option value="Other">अन्य फुटकर खर्च (Other)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">राशि (Amount in ₹):</label>
                <input
                  type="number"
                  className="form-control"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
            </div>

            <div className="form-row two-col">
              <div className="form-group">
                <label className="form-label">संबंधित फसल (Crop):</label>
                <input
                  type="text"
                  className="form-control"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">दिनांक (Date):</label>
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">विवरण / नोट (Notes):</label>
              <input
                type="text"
                className="form-control"
                placeholder="जैसे: 2 बोरी यूरिया + जिंक सल्फेट खरीदा"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary">खर्च सहेजें</button>
              <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary">रद्द करें</button>
            </div>
          </form>
        </div>
      )}

      {/* Category Breakdown & Recent Expenses List Grid */}
      <div className="grid-responsive two-col" style={{ gap: '1.5rem', alignItems: 'start' }}>
        {/* Category Breakdown Bar Chart */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', color: '#12372A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <PieChart size={18} color="#1E5631" />
            <span>मद-वार खर्च विभाजन (Category Breakdown)</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {summary.categoryBreakdown.map((cat, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontWeight: 600, color: '#374151' }}>{cat.category}</span>
                  <span style={{ fontWeight: 700, color: '#111827' }}>
                    ₹{cat.amount.toLocaleString()} ({cat.percentage}%)
                  </span>
                </div>
                <div style={{ height: '8px', background: '#F3F4F6', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${cat.percentage}%`,
                      background: i % 2 === 0 ? '#1E5631' : '#52B788',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expenses Table / List */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', color: '#12372A', marginBottom: '0.75rem' }}>
            हाल के दर्ज खर्च (Recent Expenses)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '350px', overflowY: 'auto' }}>
            {expenses.map((exp) => (
              <div
                key={exp.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.65rem 0.75rem',
                  background: '#F8FAF7',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#12372A' }}>
                    {exp.category} {exp.cropName ? `• ${exp.cropName}` : ''}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                    {exp.date} {exp.notes ? `• ${exp.notes}` : ''}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#BE123C' }}>
                    ₹{exp.amount.toLocaleString()}
                  </span>
                  <button
                    onClick={() => dataStore.deleteExpense(exp.id)}
                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
