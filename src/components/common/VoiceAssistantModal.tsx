import React, { useState } from 'react';
import { Mic, MicOff, Volume2, X, Sparkles, Send, Bot, CheckCircle } from 'lucide-react';
import { Language } from '../../types';
import { dataStore } from '../../services/dataStore';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({ isOpen, onClose, language }) => {
  const [isListening, setIsListening] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartListening = () => {
    setIsListening(true);
    setResponse(null);

    // Check for native browser Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setQuery(transcript);
          setIsListening(false);
          processVoiceQuery(transcript);
        };
        recognition.onerror = () => {
          setIsListening(false);
          simulateSpeechRecognition();
        };
        recognition.start();
      } catch {
        simulateSpeechRecognition();
      }
    } else {
      simulateSpeechRecognition();
    }
  };

  const simulateSpeechRecognition = () => {
    setTimeout(() => {
      const defaultText = language === 'hi'
        ? 'मेरे धान के खेत में आज क्या करना चाहिए?'
        : 'What farming action should I take in my paddy field today?';
      setQuery(defaultText);
      setIsListening(false);
      processVoiceQuery(defaultText);
    }, 1500);
  };

  const processVoiceQuery = (text: string) => {
    const lower = text.toLowerCase();
    const weather = dataStore.getWeather();
    const mandi = dataStore.getMandiPrices();

    let ans = '';
    if (lower.includes('पानी') || lower.includes('सिंचाई') || lower.includes('irrigate') || lower.includes('water')) {
      ans = language === 'hi'
        ? `🌧️ आज आपके क्षेत्र में ${weather.rainProbabilityPercent}% बारिश की संभावना है। प्राकृतिक वर्षा से खेत में नमी बनी रहेगी, इसलिए आज सिंचाई करने की जरूरत नहीं है।`
        : `🌧️ There is a ${weather.rainProbabilityPercent}% rain probability today in your area. Avoid irrigating today to save water & power.`;
    } else if (lower.includes('भाव') || lower.includes('मंडी') || lower.includes('rate') || lower.includes('price') || lower.includes('market')) {
      const paddyMandi = mandi.find((m) => m.cropId === 'paddy') || mandi[0];
      ans = language === 'hi'
        ? `💰 पण्डरा कृषि बाजार में धान का आज का मॉडल भाव ₹${paddyMandi.modalPricePerQuintal} प्रति क्विंटल है (इस सप्ताह +${paddyMandi.priceDeltaPercent}% की तेजी)।`
        : `💰 Today's paddy rate at ${paddyMandi.mandiName} is ₹${paddyMandi.modalPricePerQuintal} / Quintal (+${paddyMandi.priceDeltaPercent}% this week).`;
    } else if (lower.includes('खाद') || lower.includes('यूरिया') || lower.includes('fertilizer')) {
      ans = language === 'hi'
        ? '🌿 आपकी धान 46 दिन की (कल्ले फूटने की अवस्था) हो चुकी है। निराई के बाद 30-35 किग्रा यूरिया प्रति एकड़ का पहला छिड़काव बारिश रुकने पर करें।'
        : '🌿 Your paddy is in active tillering stage (46 days). Apply 30-35 kg Urea per acre after weeding once rains subside.';
    } else {
      ans = language === 'hi'
        ? `🌾 नमस्ते रमेश जी! आज आपके खेत में 2 मुख्य कार्य हैं: (1) बारिश के कारण आज सिंचाई न करें, (2) धान के खेत में तना छेदक कीट की निगरानी करें।`
        : `🌾 Hello Ramesh! Today's top directives: (1) Skip irrigation due to rain forecast, (2) Scout tillering paddy for stem borer.`;
    }

    setResponse(ans);
    speakResponse(ans);
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', border: 'none', background: 'none', cursor: 'pointer' }}
        >
          <X size={20} color="#6B7280" />
        </button>

        {/* Assistant Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
          <Sparkles size={20} color="#1E5631" />
          <h2 style={{ fontSize: '1.25rem', color: '#12372A' }}>
            {language === 'hi' ? 'किसान सारथी आवाज सहायक' : 'Kisan Voice Assistant'}
          </h2>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '1.75rem' }}>
          {language === 'hi' ? 'माइक दबाकर अपनी भाषा में खेती से जुड़ा कोई भी सवाल पूछें' : 'Tap the mic and speak your farming query naturally'}
        </p>

        {/* Animated Mic Button */}
        <button
          type="button"
          onClick={handleStartListening}
          style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            background: isListening
              ? 'radial-gradient(circle, #DC2626 0%, #B91C1C 100%)'
              : 'linear-gradient(135deg, #1E5631 0%, #2D6A4F 100%)',
            color: '#FFFFFF',
            border: '4px solid #DCFCE7',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(30, 86, 49, 0.3)',
            animation: isListening ? 'pulse 1s infinite' : 'none',
            margin: '0 auto 1.5rem auto'
          }}
        >
          {isListening ? <Mic size={38} /> : <Mic size={38} />}
        </button>

        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: isListening ? '#DC2626' : '#1E5631', marginBottom: '1.25rem' }}>
          {isListening ? (language === 'hi' ? 'सुन रहा हूँ... बोलिए' : 'Listening...') : (language === 'hi' ? 'माइक पर टैप करें' : 'Tap to speak')}
        </div>

        {/* Sample Question Chips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF' }}>
            {language === 'hi' ? 'उदाहरण सवाल:' : 'Suggested queries:'}
          </span>
          <button
            onClick={() => {
              const q = language === 'hi' ? 'मेरे धान के खेत में आज क्या करना है?' : 'What action for paddy today?';
              setQuery(q);
              processVoiceQuery(q);
            }}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.8rem', justifyContent: 'flex-start', background: '#F8FAF7' }}
          >
            💬 {language === 'hi' ? '"मेरे धान के खेत में आज क्या करना है?"' : '"What action for paddy today?"'}
          </button>
          <button
            onClick={() => {
              const q = language === 'hi' ? 'क्या आज खेत में पानी देना चाहिए?' : 'Should I irrigate today?';
              setQuery(q);
              processVoiceQuery(q);
            }}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.8rem', justifyContent: 'flex-start', background: '#F8FAF7' }}
          >
            💬 {language === 'hi' ? '"क्या आज खेत में पानी देना चाहिए?"' : '"Should I irrigate today?"'}
          </button>
        </div>

        {/* Result Area */}
        {response && (
          <div
            style={{
              padding: '1.1rem',
              borderRadius: '12px',
              background: '#F0FDF4',
              border: '1.5px solid #BBF7D0',
              textAlign: 'left',
              animation: 'slideUp 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>
                KisanSaathi Voice Response
              </span>
              <button
                onClick={() => speakResponse(response)}
                className="btn btn-sm"
                style={{ padding: '0.2rem 0.5rem', minHeight: 'auto', background: '#DCFCE7', color: '#166534', border: 'none' }}
              >
                <Volume2 size={15} />
                <span>Audio</span>
              </button>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#14532D', lineHeight: 1.5 }}>
              {response}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
