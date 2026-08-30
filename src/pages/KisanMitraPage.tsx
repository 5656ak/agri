import React, { useState } from 'react';
import { Bot, Mic, Send, Sparkles, BookOpen, Volume2, ShieldCheck, HelpCircle } from 'lucide-react';
import { Language, NavigationTab } from '../types';
import { DEMO_RESEARCH_SOURCE } from '../data/demoData';
import { ResearchSourcePanel } from '../components/common/ResearchSourcePanel';

interface KisanMitraPageProps {
  onSelectTab: (tab: NavigationTab) => void;
  language: Language;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sourceId?: string;
}

export const KisanMitraPage: React.FC<KisanMitraPageProps> = ({ language }) => {
  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: language === 'hi' 
        ? 'नमस्ते किसान! मैं आपका किसान मित्र AI सहायक हूँ। आप मुझसे फसलों की बीमारी, खाद, सिंचाई या फसल अवस्था से जुड़े सवाल हिंदी या अंग्रेजी में पूछ सकते हैं।' 
        : 'Hello Farmer! I am your Kisan Mitra AI assistant. Ask me questions regarding crop health, fertilizer scheduling, irrigation, or growth stages.',
      timestamp: '10:00 AM'
    },
    {
      id: 'msg-2',
      sender: 'user',
      text: 'गेहूं में पहला पानी (CRI) कब देना चाहिए और क्या सावधानियां हैं?',
      timestamp: '10:02 AM'
    },
    {
      id: 'msg-3',
      sender: 'assistant',
      text: 'गेहूं में पहला पानी बुवाई के 20 से 25 दिन बाद सीआरआई (Crown Root Initiation / कल्ले फूटने) अवस्था पर देना सबसे अनिवार्य है। यदि इस समय सिंचाई न की जाए तो उपज में 25-30% तक भारी कमी आ सकती है। सिंचाई के तुरंत बाद यूरिया की पहली टॉप-ड्रेसिंग करें।',
      timestamp: '10:02 AM',
      sourceId: 'SRC_ICAR_IIWBR'
    }
  ]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      sender: 'assistant',
      text: `(Demo Response - AI Model not connected yet): आपका प्रश्न "${query}" प्राप्त हुआ। पूर्ण RAG इंजन कनेक्ट होने के बाद ICAR एवं KVK सत्यापित अनुसंधान से सटीक उत्तर और खुराक यहां प्रदर्शित होगी।`,
      timestamp: 'Just now',
      sourceId: 'SRC_ICAR_IIWBR'
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInputQuery('');
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        handleSend('गेहूं में पीला रतुआ दिखने पर तुरंत क्या करें?');
      }, 2000);
    }
  };

  const sampleChips = [
    'गेहूं में पीले धब्बे क्यों हैं?',
    'मिट्टी जांच के बाद खाद कैसे तय करें?',
    'मेरी फसल की अगली अवस्था क्या है?',
    'टमाटर में पत्ती मुड़ने (Leaf Curl) का जैविक उपचार?'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: 'calc(100vh - 180px)', minHeight: '550px' }}>
      {/* Header Bar */}
      <div className="section-header" style={{ marginBottom: '0.25rem' }}>
        <h1 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>{language === 'hi' ? 'Kisan Mitra AI (किसान मित्र)' : 'Kisan Mitra AI Assistant'}</span>
          <span className="badge badge-demo">DEMO SHELL</span>
        </h1>
        <p className="section-subtitle">
          {language === 'hi'
            ? 'वैज्ञानिक कृषि सहायक - बोलकर या लिखकर सवाल पूछें'
            : 'Conversational assistant grounded in verified agricultural research'}
        </p>
      </div>

      {/* Mandatory Grounding Banner */}
      <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '0.65rem 0.85rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ShieldCheck size={18} color="#16A34A" />
        <span style={{ fontSize: '0.85rem', color: '#14532D', fontWeight: 600 }}>
          Scientific answers will be grounded in the verified agricultural knowledge base. (No hallucinations).
        </span>
      </div>

      {/* Chat Messages Log Area */}
      <div 
        className="card" 
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '1rem',
          background: '#F8FAFC'
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%'
            }}
          >
            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                background: msg.sender === 'user' ? '#1E5631' : '#FFFFFF',
                color: msg.sender === 'user' ? '#FFFFFF' : '#1E293B',
                border: msg.sender === 'user' ? 'none' : '1px solid #E2E8F0',
                boxShadow: 'var(--shadow-sm)',
                fontSize: '0.92rem',
                lineHeight: 1.5
              }}
            >
              {msg.sender === 'assistant' && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.35rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1E5631', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Bot size={14} />
                    <span>Kisan Mitra AI (DEMO)</span>
                  </span>
                  <button 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
                    title="Audio Listen"
                  >
                    <Volume2 size={15} />
                  </button>
                </div>
              )}
              {msg.text}
            </div>

            {/* If message has research sources attached */}
            {msg.sourceId && (
              <div style={{ marginTop: '0.4rem' }}>
                <ResearchSourcePanel sourceId={msg.sourceId} />
              </div>
            )}

            <span style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.2rem', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.timestamp}
            </span>
          </div>
        ))}
      </div>

      {/* Suggested Prompt Chips */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {sampleChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '9999px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#334155',
              fontSize: '0.8rem',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            💡 {chip}
          </button>
        ))}
      </div>

      {/* Input Box with Voice & Send Controls */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <input
          type="text"
          className="form-control"
          placeholder={language === 'hi' ? 'फसल, खाद या रोग के बारे में सवाल लिखें...' : 'Ask a question about crop, fertilizer, or disease...'}
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          style={{ flex: 1, minHeight: '48px' }}
        />

        <button
          onClick={handleVoiceToggle}
          className={`btn ${isListening ? 'btn-primary' : 'btn-secondary'}`}
          style={{
            minWidth: '48px',
            height: '48px',
            padding: 0,
            borderRadius: '12px',
            background: isListening ? '#DC2626' : undefined,
            color: isListening ? '#FFFFFF' : undefined
          }}
          title={isListening ? 'Listening...' : 'Voice Input (बोलकर पूछें)'}
        >
          <Mic size={20} />
        </button>

        <button
          onClick={() => handleSend()}
          className="btn btn-primary"
          style={{ minWidth: '48px', height: '48px', padding: 0, borderRadius: '12px' }}
          title="Send Question"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};
