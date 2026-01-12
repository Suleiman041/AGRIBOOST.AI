import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { supabase } from './supabase'
import {
  Sprout, Thermometer, MapPin, Newspaper, Zap, Menu, Plus,
  Trash2, Edit2, Settings as SettingsIcon, CreditCard, Smartphone, Search,
  ChevronRight, LogOut, User, Activity, AlertTriangle, X
} from 'lucide-react';

/* Mock Toaster Hook */
const useNotify = () => {
  const [notification, setNotification] = useState(null)
  const notify = (msg, type = 'success') => {
    setNotification({ msg, type })
    setTimeout(() => setNotification(null), 3000)
  }
  return { notification, notify }
}

const Notification = ({ data }) => (
  <div style={{
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    padding: '1rem 2rem',
    background: data.type === 'success' ? '#52B788' : '#FB8500',
    color: '#fff',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    animation: 'slideIn 0.3s ease-out'
  }}>
    <span>{data.type === 'success' ? '✅' : '🔔'}</span>
    {data.msg}
    <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
  </div>
)

const translations = {
  en: {
    app_name: 'AgriBoost',
    dashboard: 'Dashboard',
    location: 'Farm Location',
    scan: 'AI Crop Scan',
    market: 'Market Prices',
    advisor: 'AI Advisor',
    ussd: 'Offline (USSD)',
    upgrade: 'Upgrade to Pro',
    sub: 'Subscription',
    welcome: 'Welcome',
    status: 'Crop Status',
    weather: 'Weather',
    gps: 'GPS Farm View',
    check_health: 'Check Health',
    tap_scan: 'Tap to scan plants',
    map_active: 'Map Active',
    news: 'Live Agri-News',
    quick: 'Quick Actions',
    soil_analysis: 'AI Soil Analysis',
    check_prices: 'Check Prices',
    coming_soon: 'Coming soon to Pro tier',
    scan_title: 'AI Crop Scan',
    scan_desc: 'Point your camera or upload a photo for real-time AI diagnosis.',
    advisor_title: 'Real-time AI Advisor',
    advisor_desc: 'Agricultural expertise powered by Google Gemini, tailored to your farm\'s GPS.',
    advisor_chat_placeholder: 'Ask about pest control, weather, or crop yields...',
    market_title: 'Real-time Market Prices',
    market_desc: 'Live commodity tickers from Nigerian exchanges.',
    search_placeholder: 'Search crop (e.g. Maize, Rice)...',
    commodity: 'Commodity',
    price: 'Price',
    trend: 'Trend',
    loc: 'Location',
    settings: 'Settings',
    limit_reached: 'You’ve reached today’s free limit. Upgrade to AgriBoost Pro for unlimited access.',
    scan_limit: 'Daily Crop Scans',
    chat_limit: 'Daily AI Chats'
  },
  ha: {
    app_name: 'AgriBoost',
    dashboard: 'Taska',
    location: 'Wurin Gona',
    scan: 'Binciken Shuka',
    market: 'Farashin Kasuwa',
    advisor: 'Mai Ba da Shawara',
    ussd: 'Ba Intanet (USSD)',
    upgrade: 'Koma zuwa Pro',
    sub: 'Biyan Kuɗi',
    welcome: 'Barka da zuwa',
    status: 'Yanayin Shuka',
    weather: 'Yanayin Gari',
    gps: 'Taswirar Gona',
    check_health: 'Duba Lafiya',
    tap_scan: 'Tab don bincika tsire-tsire',
    map_active: 'Taswira tana aiki',
    news: 'Labaran Noma',
    quick: 'Matakan Gaggawa',
    soil_analysis: 'Binciken Kasa',
    check_prices: 'Duba Farashi',
    coming_soon: 'Yana zuwa ga Pro kawai',
    scan_title: 'Binciken Shuka na AI',
    scan_desc: 'Nuna kyamarar ka ko ɗaukar hoto don binciken gaggawa.',
    advisor_title: 'Mai Ba da Shawara na AI',
    advisor_desc: 'Kwararren masaniyar noma daga Google Gemini.',
    advisor_chat_placeholder: 'Yi tambaya game da kwari, yanayi, ko yawan amfanin gona...',
    market_title: 'Farashin Kasuwa na Yanzu',
    market_desc: 'Farashin kayayyaki kai tsaye daga kasuwannin Najeriya.',
    search_placeholder: 'Nemi amfanin gona (misali Masara, Shinkafa)...',
    commodity: 'Kaya',
    price: 'Farashi',
    trend: 'Yanayi',
    loc: 'Wuri',
    settings: 'Saituna',
    limit_reached: 'Ka kai iyaka kyauta ta yau. Haɓaka zuwa AgriBoost Pro don samun dama mara iyaka.',
    scan_limit: 'Binciken Shuka na Kullum',
    chat_limit: 'Tattaunawar AI na Kullum'
  },
  yo: {
    app_name: 'AgriBoost',
    dashboard: 'Dasibodu',
    location: 'Ipo Oko',
    scan: 'Ayewo Irugbin',
    market: 'Owo Oja',
    advisor: 'Olugbamoran AI',
    ussd: 'Aisi Intaneti (USSD)',
    upgrade: 'Igbega si Pro',
    sub: 'Isanwo',
    welcome: 'E kaabo',
    status: 'Ipo Irugbin',
    weather: 'Oju Ojo',
    gps: 'Ipo Oko GPS',
    check_health: 'Ayewo Ilera',
    tap_scan: 'Fọwọ ba lati ṣayẹwo eweko',
    map_active: 'Map Nṣiṣẹ',
    news: 'Iroyin Agbe',
    quick: 'Awọn Igbese Yara',
    soil_analysis: 'Ayewo Ile',
    check_prices: 'Ṣayẹwo Awọn Iye',
    coming_soon: 'Nbo laipẹ fun Pro',
    scan_title: 'Ayewo Irugbin AI',
    scan_desc: 'Toka kamẹra rẹ tabi gbe fọto kan si fun ayẹwo.',
    advisor_title: 'Olugbamoran AI Akoko-gidi',
    advisor_desc: 'Imọ-ogbin ti o ni agbara nipasẹ Google Gemini.',
    advisor_chat_placeholder: 'Beere nipa iṣakoso kokoro, oju ojo, tabi ikore...',
    market_title: 'Owo Oja Akoko-gidi',
    market_desc: 'Awọn iye owo ọja lati awọn ọja Naijiria.',
    search_placeholder: 'Wa irugbin (fun apẹẹrẹ Agbado, Irẹsi)...',
    commodity: 'Ọja',
    price: 'Iye',
    trend: 'Ojutole',
    loc: 'Ipo',
    settings: 'Eto',
    limit_reached: 'O ti de opin opin ofe oni. Ṣe igbesoke si AgriBoost Pro fun iraye ailopin.',
    scan_limit: 'Awọn Scans Irugbin Ojoojumọ',
    chat_limit: 'Awọn ibaraẹnisọrọ AI Ojoojumọ'
  },
  ig: {
    app_name: 'AgriBoost',
    dashboard: 'Dashbọdụ',
    location: 'Ebe Ugbo',
    scan: 'Nyocha Ihe Ọkụkụ',
    market: 'Ahịa Ahịa',
    advisor: 'Onye Ndụmọdụ AI',
    ussd: 'Na-anọghị n\'ịntanetị (USSD)',
    upgrade: 'Kwalite na Pro',
    sub: 'Ndebanye aha',
    welcome: 'Nnoo',
    status: 'Ọnọdụ Ihe Ọkụkụ',
    weather: 'Ihu Igwe',
    gps: 'Elele Ugbo GPS',
    check_health: 'Lelee Ahụike',
    tap_scan: 'Pịa ka inyochaa osisi',
    map_active: 'Map Na-arụ Ọrụ',
    news: 'Akụkọ Ugbo',
    quick: 'Omume Ngwa Ngwa',
    soil_analysis: 'Nyocha Ala',
    check_prices: 'Lelee Ahịa',
    coming_soon: 'Na-abịa na Pro tier',
    scan_title: 'Nyocha Ihe Ọkụkụ AI',
    scan_desc: 'Tụọ igwefoto gị ma ọ bụ bulite foto maka nyocha.',
    advisor_title: 'Onye Ndụmọdụ AI',
    advisor_desc: 'Ọkachamara ugbo kwadoro site na Google Gemini.',
    advisor_chat_placeholder: 'Jụọ maka njikwa ụmụ ahụhụ, ihu igwe, ma ọ bụ ihe ọkụkụ...',
    market_title: 'Ahịa Ahịa Akoko-gidi',
    market_desc: 'ọnụ ahịa ngwa ahịa sitere na mgbanwe Naịjirịa.',
    search_placeholder: 'Chọọ ihe ọkụkụ (dịka Ọka, Osikapa)...',
    commodity: 'Ngwaahịa',
    price: 'Ọnụahịa',
    trend: 'Omume',
    loc: 'Ebe',
    settings: 'Ntọala',
    limit_reached: 'I ruru oke n\'efu taa. Kwalite na AgriBoost Pro maka ohere na-akparaghị ókè.',
    scan_limit: 'Nyocha Ihe Ọkụkụ Kwa Ụbọchị',
    chat_limit: 'Mkparịta ụka AI Kwa Ụbọchị'
  }
};

/* AI INITIALIZATION - Groq */
/* AI INITIALIZATION - Groq */
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
/* STRIPE CONFIG */
const STRIPE_LINK = import.meta.env.VITE_STRIPE_PAYMENT_LINK || ""; // e.g. https://buy.stripe.com/test_...


const callGroqAI = async (messages) => {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: messages, // Send full history
      max_tokens: 1000,
      temperature: 0.7
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || `HTTP ${response.status}`);
  }

  const result = await response.json();
  return result.choices[0]?.message?.content || "No response received";
};

const callGroqVisionAI = async (text, base64Image) => {
  // Llama 4 Scout Vision on Groq (latest model per docs)
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct", // Updated to Llama 4 Scout
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: text },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
            ]
          }
        ],
        max_completion_tokens: 1024,
        temperature: 1,
        top_p: 1
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.warn("Groq Vision API Error:", error); // Log for debugging
      return "Error: Model unavailable";
    }

    const result = await response.json();
    return result.choices[0]?.message?.content || "No response received";
  } catch (err) {
    console.error("Vision API Network Error:", err);
    return "Error: Connection failed";
  }
};

/* AUTH COMPONENT - EMAIL/PASSWORD ONLY */
const Auth = ({ setSession }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (isSignUp) {
        result = await supabase.auth.signUp({
          email,
          password,
        });

        if (result.error) throw result.error;

        // If signup successful but no session, it means email confirmation is ON
        if (result.data.user && !result.data.session) {
          alert("Account created! Please check your email to verify before logging in.");
          setIsSignUp(false); // Switch back to login mode
        } else if (result.data.session) {
          // Auto-login success (Email confirm disabled)
          // onAuthStateChange in App.jsx will catch this update automatically
        }
      } else {
        result = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (result.error) throw result.error;
        // Login success - App will re-render automatically
      }

    } catch (error) {
      alert(error.error_description || error.message);
      setLoading(false); // Only stop loading on error. On success, keep loading until unmount.
    } finally {
      // Do NOT set loading false on success, to avoid "flash" of button before unmount
      // We only set it false if we didn't log in (error or verify email)
    }
  }

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '1rem'
    }}>
      <div className="glass" style={{
        maxWidth: '450px',
        width: '100%',
        textAlign: 'center',
        padding: '3rem 2rem',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(15px)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
        <h1 style={{ marginBottom: '0.5rem', color: '#fff', fontSize: '2rem' }}>AgriBoost <span style={{ color: 'var(--primary-glow)' }}>AI</span></h1>
        <p style={{ marginBottom: '2.5rem', color: '#ccc', fontSize: '0.95rem' }}>
          {isSignUp ? 'Join the future of farming.' : 'Welcome back, Farmer.'}
        </p>

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', opacity: 0.7 }}>✉️</span>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '1rem 1rem 1rem 3rem',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
                outline: 'none',
                fontSize: '1rem',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary-glow)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', opacity: 0.7 }}>🔒</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '1rem 1rem 1rem 3rem',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary-glow)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%',
              marginTop: '1rem',
              padding: '1rem',
              fontSize: '1.1rem',
              fontWeight: 600,
              letterSpacing: '0.5px',
              borderRadius: '12px'
            }}
          >
            {loading ? <span className="spinner">↻</span> : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ fontSize: '0.9rem', color: '#888' }}>
            {isSignUp ? "Already a member?" : "New to AgriBoost?"}
          </p>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--primary-glow)',
              cursor: 'pointer',
              marginTop: '0.5rem',
              fontWeight: 600,
              fontSize: '1rem'
            }}
          >
            {isSignUp ? 'Login to Account' : 'Create Free Account'}
          </button>
        </div>
      </div>
    </div>
  )
}

const Sidebar = ({ activeView, setView, isOpen, setOpen, isPro, lang, setLang, t }) => (
  <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
    <div className="logo" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <Sprout size={28} color="var(--primary-glow)" />
      <div>
        <h2 style={{ color: 'var(--primary-glow)', marginBottom: 0, lineHeight: 1 }}>AgriBoost<span style={{ color: '#fff' }}>AI</span></h2>
        <p style={{ fontSize: '0.7rem', opacity: 0.7 }}>Agricultural Intelligence</p>
      </div>
    </div>

    {/* Language Switcher */}
    <div style={{ marginBottom: '1rem', padding: '0 0.5rem' }}>
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        style={{
          width: '100%',
          padding: '0.5rem',
          borderRadius: '8px',
          background: 'rgba(255,255,255,0.1)',
          color: '#fff',
          border: '1px solid var(--glass-border)',
          outline: 'none',
          cursor: 'pointer'
        }}
      >
        <option value="en" style={{ color: '#000' }}>🇺🇸 English</option>
        <option value="ha" style={{ color: '#000' }}>🇳🇬 Hausa</option>
        <option value="yo" style={{ color: '#000' }}>🇳🇬 Yoruba</option>
        <option value="ig" style={{ color: '#000' }}>🇳🇬 Igbo</option>
      </select>
    </div>

    {isPro && (
      <div className="badge" style={{
        marginBottom: '1rem',
        width: '100%',
        textAlign: 'center',
        background: 'var(--pro-gradient)',
        color: '#fff',
        border: 'none',
        padding: '0.6rem',
        borderRadius: '12px',
        fontWeight: 'bold'
      }}>
        PRO MEMBER
      </div>
    )}

    <nav className="nav-links">
      {[
        { id: 'dashboard', label: t.dashboard, icon: <Activity size={18} /> },
        { id: 'identity', label: t.location, icon: <MapPin size={18} /> },
        { id: 'diagnosis', label: t.scan, icon: <Sprout size={18} /> },
        { id: 'market', label: t.market, icon: <Newspaper size={18} /> },
        { id: 'advisory', label: t.advisor, icon: <Zap size={18} /> },
        { id: 'ussd', label: t.ussd, icon: <Smartphone size={18} /> },
        { id: 'settings', label: t.settings, icon: <SettingsIcon size={18} /> },
        { id: 'subscription', label: isPro ? t.sub : t.upgrade, icon: <CreditCard size={18} /> },
      ].map(item => (
        <a
          key={item.id}
          href="#"
          className={`nav-item ${activeView === item.id ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setView(item.id); setOpen(false); }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}
        >
          {item.icon} {item.label}
        </a>
      ))}
    </nav>
    <div style={{ marginTop: 'auto' }} className="glass card">
      {!GROQ_API_KEY && <p style={{ color: '#ff4444', fontSize: '0.7rem', marginBottom: '0.5rem' }}>⚠️ API Key Missing</p>}
      <p style={{ fontSize: '0.9rem', color: '#fff' }}>System Status</p>
      <div className="stat-value" style={{ fontSize: '1.2rem' }}>All Systems Go</div>
      <div className="badge badge-success">Online (Groq AI)</div>
    </div>
  </aside>
)

const Dashboard = ({ recentActivity, weather, location, user, setView, t }) => (
  <div className="animate-fade">
    <header style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem' }}>{t.welcome}, {user ? user.name.split(' ')[0] : 'Farmer'}</h1>
        <p style={{ opacity: 0.8 }}>Real-time agricultural intelligence active.</p>
      </div>
      <div className="glass" style={{ padding: '0.5rem 1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <MapPin size={16} /> {location.city || 'Locating...'}
      </div>
    </header>

    {/* Classic 3-Card Grid */}
    <div className="grid">
      <div className="glass card" onClick={() => setView('diagnosis')} style={{ cursor: 'pointer', textAlign: 'center' }}>
        <div className="icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}><Sprout size={32} color="var(--success)" /></div>
        <h3>{t.status}</h3>
        <div className="stat-value" style={{ fontSize: '1.5rem', margin: '0.5rem 0' }}>{t.check_health}</div>
        <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>{t.tap_scan}</p>
      </div>
      <div className="glass card" style={{ textAlign: 'center' }}>
        <div className="icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}><Thermometer size={32} color="#f39c12" /></div>
        <h3>{t.weather}</h3>
        <div className="stat-value" style={{ fontSize: '1.5rem', margin: '0.5rem 0' }}>{weather.temp}{typeof weather.temp === 'number' ? '°C' : ''}</div>
        <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>{weather.condition} • {weather.humidity}% Hum</p>
      </div>
      <div className="glass card" onClick={() => setView('identity')} style={{ cursor: 'pointer', textAlign: 'center' }}>
        <div className="icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}><MapPin size={32} color="#3498db" /></div>
        <h3>{t.gps}</h3>
        <div className="stat-value" style={{ fontSize: '1.5rem', margin: '0.5rem 0' }}>{location.lat ? 'Live Feed' : 'Waiting'}</div>
        <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>{location.lat ? t.map_active : 'Syncing...'}</p>
      </div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
      {/* Live News */}
      <div>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><Newspaper size={20} /> {t.news}</h2>
        <div className="glass" style={{ height: 'auto', minHeight: '300px', padding: '1.5rem', overflowY: 'auto', maxHeight: '500px' }}>
          {recentActivity.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '8px' }}>
                <AlertTriangle size={20} color="var(--secondary)" />
              </div>
              <div>
                <p style={{ color: '#fff', fontSize: '0.9rem', margin: 0, lineHeight: 1.4 }}>{item.msg}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.3rem 0 0 0' }}>{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions / Promo Side */}
      <div>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><Zap size={20} /> {t.quick}</h2>
        <div className="glass card" style={{ height: 'auto', minHeight: '300px', background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.3) 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}><Sprout size={48} strokeWidth={1} /></div>
          <h3>{t.soil_analysis}</h3>
          <p style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '2rem' }}>{t.coming_soon}</p>
          <button className="btn btn-outline" onClick={() => setView('market')}>{t.check_prices} <ChevronRight size={16} /></button>
        </div>
      </div>
    </div>
  </div>
)

const Diagnosis = ({ setView, notify, t, lang, checkUsage }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      notify("Cannot access camera. Please check permissions.", "warn");
    }
  }

  /* Combined Analysis Function for both Camera and Upload */
  const analyzeImageBase64 = async (base64Data) => {
    // Check Daily Limit
    if (!checkUsage('scan')) return;

    if (!GROQ_API_KEY) {
      notify("AI API Key Missing. Using simulated analysis.", "warn");
      simulateAnalysis();
      return;
    }

    setAnalyzing(true);
    try {
      // Call Groq Vision AI (Llama 3.2 Vision)
      const prompt = `You are an expert plant pathologist. Analyze this plant image. Identify any disease, pest, or deficiency. 
      Return ONLY valid JSON: {"disease": "Name", "severity": "Low/Moderate/High", "recommendation": "Specific concise remedy", "confidence": "e.g. 92%"} 
      If healthy, say "Healthy Crop".
      Translate all text (disease, recommendation, etc.) to ${lang === 'ha' ? 'Hausa' : lang === 'yo' ? 'Yoruba' : lang === 'ig' ? 'Igbo' : 'English'}.`;

      const responseText = await callGroqVisionAI(prompt, base64Data);
      console.log("AI Vision Response:", responseText);

      // Check if the Vision API returned an error
      if (responseText.startsWith("Error:")) {
        notify("AI Vision unavailable. Using simulator.", "warn");
        simulateAnalysis();
        return;
      }

      // Clean JSON string (handle backticks)
      const cleanJson = responseText.replace(/```json|```/g, '').trim();

      // Try parsing, fallback to text if model fails to output strict JSON
      try {
        const aiResult = JSON.parse(cleanJson);
        setResult(aiResult);
      } catch (e) {
        // Fallback if model chatted instead of JSON
        setResult({
          disease: "Analysis Complete",
          severity: "Check Details",
          recommendation: cleanJson.substring(0, 150) + "...",
          confidence: "Check Text"
        });
      }
    } catch (err) {
      console.error("AI Scan Error Details:", err);
      // Give more specific feedback
      const errMsg = err.message.includes('404') ? 'AI Model Unavailable (404). Using Simulator.' :
        err.message.includes('400') ? 'Bad Request. Image too large?' :
          'Connection Error. Using Simulator.';
      notify(errMsg, "warn");

      // Fallback only if strictly necessary or requested, but let's try to be helpful
      simulateAnalysis();
    } finally {
      setAnalyzing(false);
    }
  }

  const simulateAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        disease: 'Early Blight Detected',
        confidence: '89%',
        recommendation: 'Increase soil drainage and apply copper-based fungicide. Remove infected lower leaves.',
        severity: 'Moderate'
      });
    }, 2000);
  }

  return (
    <div className="animate-fade">
      <h1>{t.scan_title}</h1>
      <p>{t.scan_desc}</p>

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: '2rem' }} className="diagnosis-grid">
        <div className="glass card" style={{ height: '450px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

          {/* Main Action Buttons (Camera or Upload) */}
          {!cameraActive && !result && !analyzing && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              <div onClick={startCamera} style={{ textAlign: 'center', cursor: 'pointer', padding: '1rem', border: '1px dashed var(--primary-glow)', borderRadius: '12px' }}>
                <span style={{ fontSize: '3rem' }}>📸</span>
                <p>Use Camera</p>
              </div>
              <p>- OR -</p>
              <label className="btn btn-outline" style={{ cursor: 'pointer' }}>
                📁 Upload from Gallery
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                  if (e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      const img = new Image();
                      img.onload = () => {
                        const canvas = canvasRef.current;
                        canvas.width = img.width;
                        canvas.height = img.height;
                        canvas.getContext('2d').drawImage(img, 0, 0);
                        // Simulate capture flow from here
                        setCameraActive(false);
                        setResult(null); // clear prev
                        // We can auto-analyze or show preview. Let's show preview in canvas naturally.
                        // But for simplicity of logic reuse, we'll just trigger analyze immediately or set 'preview' state.
                        // To keep it simple, we'll store the base64 and show it, adding a 'Analyze' button overlay.
                        // Actually, reusing the 'result' view for preview is tricky. Let's just create a quick 'previewMode'.
                      }
                      img.src = ev.target.result;
                      // Trigger analysis immediately on upload for ease
                      analyzeImageBase64(ev.target.result.split(',')[1]);
                    };
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }} />
              </label>
            </div>
          )}

          {cameraActive && (
            <>
              <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={() => {
                const canvas = canvasRef.current;
                const video = videoRef.current;
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0);
                const imageData = canvas.toDataURL('image/jpeg', 0.8);

                // Stop camera
                video.srcObject.getTracks().forEach(track => track.stop());
                setCameraActive(false);

                analyzeImageBase64(imageData.split(',')[1]);
              }} className="btn btn-primary" style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)' }}>Capture & Analyze</button>
            </>
          )}

          {analyzing && (
            <div style={{ textAlign: 'center', zIndex: 10 }}>
              <div className="floating" style={{ fontSize: '5rem' }}>🔍</div>
              <p style={{ marginTop: '1rem' }}>AI Vision is analyzing leaf tissue...</p>
              <div style={{ width: '200px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '1rem', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'var(--primary-glow)', animation: 'slide 2s infinite linear' }}></div>
              </div>
            </div>
          )}

          {/* Show Canvas (Image Preview) always if we have content, but hide if empty to show buttons */}
          <canvas ref={canvasRef} style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: (analyzing || result || (!cameraActive && !result && !analyzing)) ? 1 : -1,
            display: (cameraActive || (!result && !analyzing && !cameraActive)) ? 'none' : 'block' // hide canvas when camera is active or initial state
          }} />

          {/* Correction: The canvas logic above is a bit messy. Let's simplify: 
              Canvas holds the captured/uploaded image. It should be visible when NOT cameraActive and NOT initial state.
          */}
          <canvas ref={canvasRef} style={{
            width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0,
            display: (result || analyzing) ? 'block' : 'none'
          }} />

          {result && !analyzing && (
            <button onClick={() => { setResult(null); setCameraActive(false); }} className="btn btn-outline" style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', zIndex: 5, background: 'rgba(0,0,0,0.8)' }}>Scan Another</button>
          )}
        </div>

        <div className="glass card" style={{ padding: '2rem' }}>
          <h3>Analysis Report</h3>
          {!result && !analyzing && <p style={{ marginTop: '2rem' }}>Awaiting camera capture...</p>}
          {analyzing && <p style={{ marginTop: '2rem' }}>Neural network diagnostic in progress...</p>}
          {result && (
            <div style={{ marginTop: '1rem' }} className="animate-fade">
              <div className={`badge ${result.severity === 'High' ? 'badge-danger' : 'badge-warning'}`} style={{ marginBottom: '1rem' }}>Severity: {result.severity}</div>
              <h2 style={{ color: 'var(--primary-glow)' }}>{result.disease}</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1rem 0', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                <span>AI Confidence</span>
                <span style={{ fontWeight: 800 }}>{result.confidence}</span>
              </div>
              <h4>Prescribed Action</h4>
              <div style={{ marginTop: '0.5rem', color: '#fff', fontSize: '0.95rem', lineHeight: '1.6' }}>
                <ReactMarkdown>{result.recommendation}</ReactMarkdown>
              </div>
              <button className="btn btn-primary" style={{ marginTop: '2rem', width: '100%' }} onClick={() => setView('market')}>Check Local Pesticide Prices</button>
            </div>
          )}
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <style>{`@keyframes slide { from { transform: translateX(-100%); } to { transform: translateX(100%); } }`}</style>
    </div>
  )
}

const MarketPrices = ({ t }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLoc, setFilterLoc] = useState('All');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Massive Initial Dataset
  const initialData = [
    { id: 1, item: 'White Maize (100kg)', price: 34500, location: 'Kaduna', trend: 'up' },
    { id: 2, item: 'Yellow Maize (100kg)', price: 36000, location: 'Lagos', trend: 'steady' },
    { id: 3, item: 'Soybeans (Ton)', price: 685000, location: 'Benue', trend: 'down' },
    { id: 4, item: 'Cassava (Bag)', price: 12500, location: 'Edo', trend: 'up' },
    { id: 5, item: 'Local Rice (50kg)', price: 45000, location: 'Kano', trend: 'steady' },
    { id: 6, item: 'Yam (Large Tuber)', price: 3500, location: 'Benue', trend: 'up' },
    { id: 7, item: 'Sorghum (100kg)', price: 28000, location: 'Kaduna', trend: 'steady' },
    { id: 8, item: 'Cocoa (Ton)', price: 1200000, location: 'Ondo', trend: 'up' },
    { id: 9, item: 'Palm Oil (25L)', price: 22000, location: 'Imo', trend: 'down' },
    { id: 10, item: 'Tomatoes (Basket)', price: 18000, location: 'Kano', trend: 'up' },
    { id: 11, item: 'Irish Potatoes (50kg)', price: 25000, location: 'Plateau', trend: 'steady' },
    { id: 12, item: 'Ginger (Ton)', price: 850000, location: 'Kaduna', trend: 'up' },
    { id: 13, item: 'Sesame Seeds (Ton)', price: 950000, location: 'Jigawa', trend: 'up' },
    { id: 14, item: 'Groundnut (100kg)', price: 42000, location: 'Kano', trend: 'down' },
    { id: 15, item: 'Onions (Bag)', price: 15000, location: 'Sokoto', trend: 'up' },
    { id: 16, item: 'Pepper (Bag)', price: 19500, location: 'Oyo', trend: 'up' },
    { id: 17, item: 'Millet (100kg)', price: 26000, location: 'Borno', trend: 'steady' },
    { id: 18, item: 'Wheat (Ton)', price: 410000, location: 'Bauchi', trend: 'down' },
    { id: 19, item: 'Cashew Nuts (Ton)', price: 750000, location: 'Kogi', trend: 'up' },
    { id: 20, item: 'Plantain (Bunch)', price: 2500, location: 'Rivers', trend: 'steady' }
  ];

  const [prices, setPrices] = useState(initialData);

  // Live Market Simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(currentPrices => {
        // Randomly update 3-5 items each tick to simulate live trading
        return currentPrices.map(item => {
          if (Math.random() > 0.7) { // 30% chance to update each item
            const change = Math.floor(Math.random() * 500) - 200; // Fluchuate by -200 to +300
            const newPrice = Math.max(100, item.price + change);
            const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'steady';
            return { ...item, price: newPrice, trend };
          }
          return item;
        });
      });
      setLastUpdate(new Date());
    }, 2500); // Update every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  // Filter Logic
  const filteredPrices = prices.filter(p => {
    const matchesSearch = p.item.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLoc = filterLoc === 'All' || p.location === filterLoc;
    return matchesSearch && matchesLoc;
  });

  // Get unique locations for dropdown
  const locations = ['All', ...new Set(prices.map(p => p.location))].sort();

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>{t.market_title}</h1>
          <p>{t.market_desc}</p>
        </div>
        <div className="badge badge-outline" style={{ fontSize: '0.8rem' }}>
          <span style={{ color: '#0f0', marginRight: '0.5rem' }}>●</span>
          Live: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
          <input
            type="text"
            placeholder={t.search_placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }}
          />
        </div>
        <select
          value={filterLoc}
          onChange={(e) => setFilterLoc(e.target.value)}
          style={{ padding: '0 1rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: '#111', color: '#fff', outline: 'none', cursor: 'pointer', minWidth: '150px' }}
        >
          {locations.map(loc => <option key={loc} value={loc}>{loc === 'All' ? 'All Locations' : loc}</option>)}
        </select>
      </div>

      <div className="glass card" style={{ marginTop: '1rem', padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', color: '#fff' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
              <th style={{ padding: '1.2rem' }}>{t.commodity}</th>
              <th style={{ padding: '1.2rem' }}>{t.price}</th>
              <th style={{ padding: '1.2rem' }}>{t.loc}</th>
              <th style={{ padding: '1.2rem' }}>{t.trend}</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrices.length > 0 ? filteredPrices.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '1.2rem' }}>{p.item}</td>
                <td style={{ padding: '1.2rem', fontWeight: 800, fontFamily: 'monospace', fontSize: '1.1rem', color: p.trend === 'up' ? '#52B788' : p.trend === 'down' ? '#FF4D4D' : '#fff' }}>
                  ₦{p.price.toLocaleString()}
                </td>
                <td style={{ padding: '1.2rem' }}>{p.location}</td>
                <td style={{ padding: '1.2rem' }}>
                  <span className={`badge ${p.trend === 'up' ? 'badge-success' : p.trend === 'down' ? 'badge-warning' : 'badge-outline'}`}>
                    {p.trend === 'up' ? '▲' : p.trend === 'down' ? '▼' : '●'} {p.trend.toUpperCase()}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>No crops found matching "{searchTerm}" in {filterLoc}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const AIAdvisor = ({ location, t, lang, checkUsage }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: `Hello! I have calibrated my data for ${location.city || 'your region'}. How can I assist your farm today?` }
    // ... (rest of AI advisor) logic is updated in next chunk or assumed same

  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => scrollToBottom(), [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    // Check Daily Limit
    if (!checkUsage('chat')) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    if (!GROQ_API_KEY) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'ai', content: "Simulated AI: I recommend checking your irrigation as soil moisture is expected to drop in " + (location.city || "your area") + "." }]);
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      // Construct Context + History
      const systemPrompt = `You are AgriBoost AI, a professional agricultural advisor in Nigeria. 
      User Location: ${location.city || 'Nigeria'} (${location.lat || 'Unknown'}, ${location.lon || 'Unknown'}).
      Tone: Professional, Concise, Helpful.
      Format: Markdown (bold key terms, use bullet points). 
      Language: Respond in ${lang === 'ha' ? 'Hausa' : lang === 'yo' ? 'Yoruba' : lang === 'ig' ? 'Igbo' : 'English'}.
      
      Maintain context of the conversation.`;

      // Create conversation history payload
      // Filter out 'System' messages if we want to add fresh system prompt every time, 
      // or just prepend system prompt to the API call array.
      const apiMessages = [
        { role: "system", content: systemPrompt },
        ...messages.map(m => ({ role: m.role === 'ai' ? 'assistant' : m.role, content: m.content })), // Map 'ai' -> 'assistant'
        { role: "user", content: userMsg } // Current Message
      ];

      const response = await callGroqAI(apiMessages);
      setMessages(prev => [...prev, { role: 'ai', content: response }]);
    } catch (err) {
      console.error("AI Advisor Error Details:", err);
      setMessages(prev => [...prev, { role: 'ai', content: `Technical Error: ${err.message}. Please try again later.` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '85vh' }}>
      <div style={{ padding: '0 0.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>{t.advisor_title}</h1>
        <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '1rem' }}>{t.advisor_desc}</p>
      </div>

      <div className="glass card" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        overflow: 'hidden',
        border: '1px solid var(--glass-border)'
      }}>
        {/* Chat Scroll Area */}
        <div className="chat-container" style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {messages.map((msg, i) => (
            <div key={i} className={`bubble ${msg.role === 'ai' ? 'bubble-ai' : 'bubble-user'}`} style={{
              alignSelf: msg.role === 'ai' ? 'flex-start' : 'flex-end',
              background: msg.role === 'ai' ? 'rgba(255,255,255,0.1)' : 'var(--primary-glow)',
              color: msg.role === 'ai' ? '#fff' : '#000',
              padding: '1rem 1.2rem',
              borderRadius: msg.role === 'ai' ? '12px 12px 12px 0' : '12px 12px 0 12px',
              maxWidth: '85%',
              lineHeight: '1.5',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              {msg.role === 'ai' && <div style={{ fontSize: '0.7rem', opacity: 0.7, marginBottom: '0.3rem', fontWeight: 'bold' }}>🤖 AgriBoost AI</div>}
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          ))}
          {loading && (
            <div className="bubble bubble-ai" style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px' }}>
              <span className="typing-dot">●</span><span className="typing-dot">●</span><span className="typing-dot">●</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Fixed Input Area */}
        <div style={{
          padding: '1rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(0,0,0,0.3)',
          display: 'flex',
          gap: '0.8rem',
          alignItems: 'center'
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.advisor_chat_placeholder}
            style={{
              flex: 1,
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid var(--glass-border)',
              borderRadius: '24px',
              padding: '0.8rem 1.2rem',
              color: '#fff',
              outline: 'none',
              fontSize: '16px' // Critical: Prevents iOS zoom on focus
            }}
          />
          <button
            className="btn btn-primary"
            onClick={handleSend}
            disabled={loading}
            style={{
              borderRadius: '50%',
              width: '45px',
              height: '45px',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ➤
          </button>
        </div>
      </div>
      <style>{`
        .typing-dot { animation: bg 1.4s infinite ease-in-out both; margin: 0 2px; font-size: 1.5rem; }
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes bg { 0%, 80%, 100% { opacity: 0; } 40% { opacity: 1; } }
      `}</style>
    </div>
  )
}

const USSDPreview = ({ location, t }) => {
  const [screen, setScreen] = useState('LOCK'); // LOCK, DIAL, LOADING, MENU, RESPONSE
  const [inputCode, setInputCode] = useState('');
  const [sessionText, setSessionText] = useState('');
  const [menuDepth, setMenuDepth] = useState('MAIN'); // MAIN, 1_DOC, 2_MARKET

  // Mock "Offline" Database
  const offlineData = {
    weather: `Weather (${location.city || 'Local'}):\nTemp: 29C\nRain: 30%\nWind: Mild\nPlanting: Good conditions.`,
    market: `Market Prices:\n1. Maize: N35,000\n2. Rice: N48,000\n3. Yam: N3,500\n\n0. Back`,
    doc_main: `AI Doctor Offline:\nDescribe symptom:\n1. Yellow Leaves\n2. Holes in Leaves\n3. Rotten Roots\n0. Back`,
    doc_1: `Yellow Leaves:\nCould be Nitrogen deficiency.\nRemedy: Apply urea or manure.\n\n00. Home`
  };

  const handleKey = (key) => {
    if (screen === 'LOCK') {
      setScreen('DIAL');
      setInputCode(key);
      return;
    }
    if (screen === 'DIAL') {
      setInputCode(prev => prev + key);
      return;
    }
    // In Menu Mode, key presses send "replies"
    handleMenuResponse(key);
  };

  const handleCall = () => {
    if (screen === 'DIAL') {
      if (inputCode === '*347*88#') {
        setScreen('LOADING');
        setTimeout(() => {
          setScreen('MENU');
          setSessionText(`Welcome to AgriBoost AI\n1. AI Doctor (Offline)\n2. Market Prices\n3. Weather Report\n4. My Account`);
          setMenuDepth('MAIN');
        }, 1500);
      } else {
        setScreen('LOADING');
        setTimeout(() => {
          setSessionText("Connection Error\nInvalid MMI Code");
          setScreen('RESPONSE');
        }, 1000);
      }
    }
  };

  const handleMenuResponse = (key) => {
    if (screen !== 'MENU' && screen !== 'RESPONSE') return;

    // Simulate network delay
    setScreen('LOADING');
    setTimeout(() => {
      setScreen('MENU');
      processMenuLogic(key);
    }, 800);
  };

  const processMenuLogic = (key) => {
    if (menuDepth === 'MAIN') {
      if (key === '1') {
        setSessionText(offlineData.doc_main);
        setMenuDepth('DOC');
      } else if (key === '2') {
        setSessionText(offlineData.market);
        setMenuDepth('MARKET');
      } else if (key === '3') {
        setSessionText(offlineData.weather + "\n\n0. Back");
        setMenuDepth('End');
      } else {
        setSessionText("Invalid Option\n" + sessionText);
      }
    } else if (menuDepth === 'DOC') {
      if (key === '1') setSessionText(offlineData.doc_1);
      if (key === '0') {
        setSessionText(`Welcome to AgriBoost AI\n1. AI Doctor (Offline)\n2. Market Prices\n3. Weather Report`);
        setMenuDepth('MAIN');
      }
    } else {
      // General back logic
      setSessionText(`Welcome to AgriBoost AI\n1. AI Doctor (Offline)\n2. Market Prices\n3. Weather Report`);
      setMenuDepth('MAIN');
    }
  };

  return (
    <div className="animate-fade">
      <h1>{t.ussd}</h1>
      <p>Simulating USSD access for feature phones (No Internet Required).</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginTop: '2rem' }}>
        {/* Phone Body */}
        <div style={{
          width: '300px',
          background: '#333',
          borderRadius: '30px',
          padding: '20px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.5)',
          border: '4px solid #444'
        }}>
          {/* Screen */}
          <div style={{
            height: '220px',
            background: '#9ea7a1', // Old Nokia screen color
            border: '8px solid #222',
            borderRadius: '10px',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.2)',
            padding: '10px',
            fontFamily: 'monospace',
            color: '#000',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Start Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', borderBottom: '1px solid #000', paddingBottom: '2px', marginBottom: '5px' }}>
              <span>📶 MTN NG</span>
              <span>🔋 100%</span>
            </div>

            {/* Screen Content */}
            <div style={{ fontSize: '14px', lineHeight: '1.2', whiteSpace: 'pre-wrap' }}>
              {screen === 'LOCK' && <div style={{ textAlign: 'center', marginTop: '50px' }}>Unlock Keypad<br />Enter Code</div>}
              {screen === 'DIAL' && <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{inputCode}<span className="blink">|</span></div>}
              {screen === 'LOADING' && <div style={{ textAlign: 'center', marginTop: '60px' }}>Running USSD code...<br />Please wait</div>}
              {(screen === 'MENU' || screen === 'RESPONSE') && <div>{sessionText}</div>}
            </div>

            {(screen === 'MENU' || screen === 'RESPONSE') && (
              <div style={{ position: 'absolute', bottom: '5px', left: '5px', fontSize: '10px' }}>Type & Wait...</div>
            )}
          </div>

          {/* Keypad */}
          <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <button style={{ padding: '10px', borderRadius: '5px', background: '#222', color: '#fff', border: 'none', boxShadow: '0 4px 0 #000' }} onClick={() => setScreen('MENU')}>-</button>
            <button style={{ padding: '10px', borderRadius: '5px', background: '#222', color: '#fff', border: 'none', boxShadow: '0 4px 0 #000' }} onClick={() => { setScreen('LOCK'); setInputCode(''); }}>HOME</button>
            <button style={{ padding: '10px', borderRadius: '5px', background: '#222', color: '#fff', border: 'none', boxShadow: '0 4px 0 #000' }} onClick={() => setInputCode(prev => prev.slice(0, -1))}>DEL</button>

            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(key => (
              <button
                key={key}
                onClick={() => handleKey(key)}
                style={{
                  padding: '15px',
                  borderRadius: '10px',
                  background: '#444',
                  color: '#fff',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 0 #222',
                }}
              >
                {key}
              </button>
            ))}
          </div>

          <button
            onClick={handleCall}
            style={{
              width: '100%',
              marginTop: '15px',
              padding: '15px',
              background: '#2ecc71',
              color: '#fff',
              border: 'none',
              borderRadius: '20px',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              boxShadow: '0 5px 0 #27ae60',
              cursor: 'pointer'
            }}
          >
            📞 CALL
          </button>

          <p style={{ textAlign: 'center', color: '#888', fontSize: '0.8rem', marginTop: '1rem' }}>Dial: *347*88#</p>
        </div>

        {/* Go Live Info */}
        <div>
          <div className="glass card" style={{ height: '100%' }}>
            <h2>🚀 Go Live to Real Phones</h2>
            <p style={{ color: '#aaa', marginBottom: '1rem' }}>Currently running in <b>Simulation Mode</b>. To enable this on real devices (Nokia, Tecno, etc) without internet:</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ background: 'var(--primary-glow)', color: '#000', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</div>
                <div>
                  <strong>Get USSD Gateway</strong>
                  <div style={{ fontSize: '0.8rem', color: '#888' }}>Create account with Africa's Talking or Twilio.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ background: 'var(--primary-glow)', color: '#000', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</div>
                <div>
                  <strong>Deploy Backend</strong>
                  <div style={{ fontSize: '0.8rem', color: '#888' }}>Host this logic on a Node.js server (AWS/Heroku).</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ background: 'var(--primary-glow)', color: '#000', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</div>
                <div>
                  <strong>Register Shortcode</strong>
                  <div style={{ fontSize: '0.8rem', color: '#888' }}>Acquire a code like *347# from NCC.</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,0,0.1)', border: '1px solid rgba(255,255,0,0.3)', borderRadius: '10px' }}>
              <strong style={{ color: '#ffcc00' }}>⚠️ Developer Note:</strong>
              <p style={{ fontSize: '0.8rem', margin: '0.5rem 0' }}>This simulator proves the logic works. The real-world deployment requires telecom licensing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const FarmerIdentity = ({ isPro, location, setLocation, user, setUser, t }) => {
  const fileInputRef = useRef(null);

  // Local state for manual input before committing
  const [manualLat, setManualLat] = useState(location.lat || '');
  const [manualLon, setManualLon] = useState(location.lon || '');

  // Update local state when global location changes (e.g. initial GPS fix)
  useEffect(() => {
    if (location.lat) setManualLat(location.lat);
    if (location.lon) setManualLon(location.lon);
  }, [location.lat, location.lon]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = (val) => {
    setUser(prev => ({ ...prev, name: val }));
  };

  const handleManualUpdate = () => {
    const lat = parseFloat(manualLat);
    const lon = parseFloat(manualLon);
    if (!isNaN(lat) && !isNaN(lon)) {
      setLocation(prev => ({ ...prev, lat, lon }));
      // reverse geocode again if needed, or just let lat/lon drive the map
      alert("Farm Location Updated! Checking Satellite View...");
    } else {
      alert("Invalid Coordinates");
    }
  }

  return (
    <div className="animate-fade">
      <h1>{t.location}</h1>
      <p>Using on-device Geolocation API for real-time farm mapping.</p>
      <div className="glass card identity-grid" style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'minmax(150px, auto) 1fr minmax(200px, auto)', gap: '2rem', padding: '2rem', alignItems: 'center' }}>

        {/* Profile Image Section */}
        <div style={{ position: 'relative', width: '150px', height: '150px' }}>
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: '#111',
            overflow: 'hidden',
            border: '2px solid var(--primary-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {user.image ? (
              <img src={user.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Profile" />
            ) : (
              <span style={{ fontSize: '4rem', opacity: 0.5 }}>👤</span>
            )}
          </div>
          <button
            onClick={() => fileInputRef.current.click()}
            className="btn-icon"
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              background: 'var(--primary-glow)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              border: 'none',
              color: '#000',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
            }}
          >
            ✏️
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>

        {/* User Info Section */}
        <div>
          <label style={{ fontSize: '0.8rem', color: '#888' }}>FARMER NAME</label>
          <input
            value={user.name}
            onChange={(e) => handleNameChange(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid #444',
              color: '#fff',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              width: '100%',
              marginBottom: '0.5rem',
              padding: '0.2rem 0'
            }}
          />

          <p>Verified City: <span style={{ color: 'var(--primary-glow)' }}>{location.city || user.city}</span></p>
          <p>Active Lat: <span style={{ color: '#fff' }}>{location.lat ? location.lat.toFixed(6) : 'Fetching...'}</span></p>
          <p>Active Lon: <span style={{ color: '#fff' }}>{location.lon ? location.lon.toFixed(6) : 'Fetching...'}</span></p>
          <p style={{ marginTop: '1rem', color: 'var(--primary-glow)', fontWeight: 800 }}>LIVE GPS SYNC: {location.lat ? 'ACTIVE' : 'SEARCHING'}</p>
        </div>

        {/* Stats Section with Map */}
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="badge badge-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-end', cursor: 'pointer' }} onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((pos) => {
                const { latitude, longitude } = pos.coords;
                setLocation(prev => ({ ...prev, lat: latitude, lon: longitude }));
                setManualLat(latitude);
                setManualLon(longitude);
                alert(`GPS Updated: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
              });
            }
          }}>
            📍 Auto-Locate
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
            <p style={{ fontSize: '0.7rem', color: '#aaa' }}>Manual Coordinates</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                placeholder="Lat"
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                style={{ width: '90px', background: '#222', border: '1px solid #444', color: '#fff', padding: '0.4rem', borderRadius: '6px' }}
              />
              <input
                placeholder="Lon"
                value={manualLon}
                onChange={(e) => setManualLon(e.target.value)}
                style={{ width: '90px', background: '#222', border: '1px solid #444', color: '#fff', padding: '0.4rem', borderRadius: '6px' }}
              />
            </div>
            <button onClick={handleManualUpdate} className="btn-sm" style={{ background: 'var(--primary-glow)', color: '#000', border: 'none', borderRadius: '6px', padding: '0.3rem 0.8rem', cursor: 'pointer', fontSize: '0.8rem' }}>Set Farm Location</button>
          </div>
        </div>
      </div>

      {/* Real Satellite Map View */}
      <h3 style={{ marginTop: '3rem', marginBottom: '1rem' }}>Farm Satellite Imagery</h3>
      <div className="glass card" style={{ padding: 0, height: '400px', overflow: 'hidden', position: 'relative' }}>
        {location.lat && location.lon ? (
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0, filter: 'contrast(1.2) saturate(1.2)' }}
            src={`https://maps.google.com/maps?q=${location.lat},${location.lon}&t=k&z=19&ie=UTF8&iwloc=&output=embed`}
            allowFullScreen
          ></iframe>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <p>Waiting for GPU/Location...</p>
          </div>
        )}

        <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(0,0,0,0.7)', padding: '0.5rem 1rem', borderRadius: '20px', backdropFilter: 'blur(5px)' }}>
          <span style={{ color: '#0f0' }}>●</span> Live Satellite Feed
        </div>

        {location.lat && location.lon && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lon}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{
              position: 'absolute',
              bottom: '1rem',
              right: '1rem',
              fontSize: '0.8rem',
              padding: '0.5rem 1rem',
              textDecoration: 'none'
            }}
          >
            🗺️ Open Map App
          </a>
        )}
      </div>
    </div>
  )
}

const Subscription = ({ isPro, setIsPro, notify, t, usage, user }) => {
  const handleUpgrade = () => {
    if (!STRIPE_LINK) {
      notify("Stripe Link missing in .env", "error");
      return;
    }
    notify("Redirecting to Stripe Secure Checkout...", "info");

    // Append client_reference_id to track which user is paying (supported by Stripe Payment Links)
    // Also append prefilled_email if available
    const separator = STRIPE_LINK.includes('?') ? '&' : '?';
    const checkoutUrl = `${STRIPE_LINK}${separator}client_reference_id=${user.id}&prefilled_email=${encodeURIComponent(user.email)}`;

    setTimeout(() => {
      window.location.href = checkoutUrl;
    }, 1500);
  }

  // Handle "Simulated" upgrade for when no Stripe link is present in DEV
  const handleSimulatedUpgrade = () => {
    notify("Simulating Upgrade (Dev Mode)...", "info");
    setTimeout(() => {
      setIsPro(true);
      notify("AgriBoost Pro Activated!", "success");
    }, 2000);
  }

  return (
    <div className="animate-fade">
      <h1>{t.sub}</h1>
      <p>Unlock unlimited AI-powered farming tools.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }} className="diagnosis-grid">
        <div className="glass card" style={{ padding: '2rem', opacity: isPro ? 0.6 : 1, border: !isPro ? '2px solid var(--primary-glow)' : '1px solid var(--glass-border)' }}>
          <div className="badge badge-outline" style={{ marginBottom: '1rem' }}>FREE</div>
          <h2>Basic Farmer</h2>
          <div className="stat-value" style={{ fontSize: '1.5rem', margin: '0.5rem 0' }}>₦0</div>
          <ul style={{ listStyle: 'none', marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li>✅ {t.scan_limit}: <b>{usage?.scans || 0} / 1</b> per day</li>
            <li>✅ {t.chat_limit}: <b>{usage?.chats || 0} / 5</b> per day</li>
            <li>✅ Daily Market Price Feed</li>
            <li>✅ Live Agri-News Updates</li>
            <li style={{ opacity: 0.4 }}>❌ Unlimited AI Access</li>
            <li style={{ opacity: 0.4 }}>❌ Priority Support</li>
          </ul>
          {!isPro && <button className="btn btn-outline" style={{ marginTop: '2rem', width: '100%' }} disabled>Current Plan</button>}
        </div>

        <div className="glass card pro-card" style={{ padding: '2rem' }}>
          <div className="badge" style={{ background: '#fff', color: '#000', marginBottom: '1rem' }}>PRO</div>
          <h2>AgriBoost Pro</h2>
          <div className="stat-value" style={{ color: '#fff', WebkitTextFillColor: '#fff' }}>₦2,500 <span style={{ fontSize: '1rem' }}>/ month</span></div>
          <ul style={{ listStyle: 'none', marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', color: '#fff' }}>
            <li>✅ <b>Unlimited</b> AI Crop Scans</li>
            <li>✅ <b>Unlimited</b> AI Advisor Chats</li>
            <li>✅ No Daily Limits</li>
            <li>✅ Priority AI Response</li>
            <li>✅ Full Market Price Access</li>
            <li>✅ Priority Email Support</li>
          </ul>
          <button className="btn" style={{ marginTop: '2rem', width: '100%', background: '#fff', color: '#000' }} onClick={STRIPE_LINK ? handleUpgrade : handleSimulatedUpgrade} disabled={isPro}>
            {isPro ? '✓ You are Pro!' : 'Upgrade Now'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* Settings Component Definition */
const Settings = ({ user, setUser, t, lang, setLang, notify }) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(user.name || '');

  // Custom Farmer Avatars
  const AVATARS = [
    'https://cdn-icons-png.flaticon.com/512/3063/3063822.png', // Farmer M
    'https://cdn-icons-png.flaticon.com/512/3063/3063824.png', // Farmer F
    'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', // Older Farmer M
    'https://cdn-icons-png.flaticon.com/512/3135/3135768.png', // Older Farmer F
  ];

  /* Avatar Selection */
  const selectAvatar = async (url) => {
    try {
      setLoading(true);
      // Update Profile
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({ id: user.id, image: url, updated_at: new Date() });

      if (updateError) {
        if (updateError.code === '42P01') throw new Error("Table 'profiles' missing. Run SQL script.");
        throw updateError;
      }

      setUser(prev => ({ ...prev, image: url }));
      notify("Avatar updated!", "success");

    } catch (error) {
      console.error(error);
      notify(error.message, "danger");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const updates = {
        id: user.id,
        full_name: username,
        language: lang,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);
      if (error) {
        if (error.code === '42P01') throw new Error("Table 'profiles' missing. Run SQL script.");
        throw error;
      }

      setUser({ ...user, name: username });
      notify("Profile updated!", "success");
    } catch (error) {
      console.error(error);
      notify(error.message, "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  }

  return (
    <div className="animate-fade">
      <h1>Settings</h1>
      <p>Customize your experience.</p>

      <div className="glass card" style={{ maxWidth: '600px', marginTop: '2rem', padding: '2rem' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ position: 'relative', width: '80px', height: '80px', minWidth: '80px', minHeight: '80px' }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#333', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {user.image ? <img src={user.image} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : <span style={{ fontSize: '2rem' }}>👤</span>}
            </div>
          </div>
          <div style={{ minWidth: 0, flex: 1 }}> {/* Allow shrinking */}
            <h3 style={{ fontSize: '1rem', wordBreak: 'break-all', marginBottom: '0.2rem' }}>{user.email}</h3>
            <div className="badge badge-outline">Farmer Account</div>
          </div>
        </div>

        {/* Avatar Selection Grid */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Choose Avatar</label>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {AVATARS.map((url, i) => (
              <div
                key={i}
                onClick={() => selectAvatar(url)}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  border: user.image === url ? '3px solid var(--primary-glow)' : '2px solid transparent',
                  padding: '2px',
                  transition: 'transform 0.2s',
                  background: 'rgba(255,255,255,0.1)'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <img src={url} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Display Name</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '1rem', background: '#222', border: '1px solid #444', borderRadius: '12px', color: '#fff' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Language Preference</label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={{ width: '100%', padding: '1rem', background: '#222', border: '1px solid #444', borderRadius: '12px', color: '#fff' }}
          >
            <option value="en">English (US)</option>
            <option value="ha">Hausa (Nigeria)</option>
            <option value="yo">Yoruba (Nigeria)</option>
            <option value="ig">Igbo (Nigeria)</option>
          </select>
        </div>

        <button onClick={updateProfile} className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>

        <hr style={{ margin: '2rem 0', borderColor: '#444' }} />

        <button onClick={handleSignOut} className="btn" style={{ background: 'var(--danger)', color: '#fff' }}>
          Sign Out
        </button>
      </div>
    </div>
  )
}

const SuccessPage = ({ setView, user, isPro }) => {
  useEffect(() => {
    // Fire confetti logic or sound here if desired
  }, []);

  return (
    <div className="animate-fade" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '80vh',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '5rem', marginBottom: '1rem', animation: 'bounce 2s infinite' }}>🎉</div>
      <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-glow)', marginBottom: '0.5rem' }}>Full Access Unlocked!</h1>
      <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
        You are now an <b>AgriBoost Pro</b> member. Your support helps us bring AI to every farm in Nigeria.
      </p>

      <div className="glass card" style={{ padding: '2rem', textAlign: 'left', display: 'inline-block', minWidth: '300px' }}>
        <h3>Your Pro Benefits:</h3>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <li>✅ Unlimited AI Crop Scans</li>
          <li>✅ Priority Agronomist Chat</li>
          <li>✅ Satellite Field Mapping</li>
          <li>✅ 15-Day Weather Forecasts</li>
        </ul>
      </div>

      <button
        className="btn btn-primary"
        style={{ marginTop: '3rem', padding: '1rem 3rem', fontSize: '1.2rem' }}
        onClick={() => setView('dashboard')}
      >
        Go to Dashboard
      </button>

      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
          40% {transform: translateY(-20px);}
          60% {transform: translateY(-10px);}
        }
      `}</style>
    </div>
  )
}

function App() {
  const [view, setView] = useState('dashboard')
  const [isMenuOpen, setMenuOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const [location, setLocation] = useState({ lat: null, lon: null, city: '' })

  const { notification, notify } = useNotify()

  /* Language State */
  const [lang, setLang] = useState(() => localStorage.getItem('agriboost_lang') || 'en');
  useEffect(() => localStorage.setItem('agriboost_lang', lang), [lang]);
  const t = translations[lang];

  /* Global User State with Persistence */
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('agriboost_user');
    return saved ? JSON.parse(saved) : {
      name: 'Guest Farmer',
      city: 'Detecting...',
      image: null,
      joined: new Date().toLocaleDateString()
    };
  });

  useEffect(() => {
    localStorage.setItem('agriboost_user', JSON.stringify(user));
  }, [user]);

  /* Sync Pro state with User state */
  const [isPro, setIsPro] = useState(false);

  /* Usage Limits State (Daily Reset) - Scope to User ID */
  const [usage, setUsage] = useState({ date: new Date().toDateString(), chats: 0, scans: 0 });

  // Load/Save Usage per User
  useEffect(() => {
    if (!user || user.name === 'Guest Farmer') return;

    const key = `agriboost_usage_${user.id}`;
    const saved = localStorage.getItem(key);
    const today = new Date().toDateString();

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.date !== today) {
          // Reset for new day
          const newUsage = { date: today, chats: 0, scans: 0 };
          setUsage(newUsage);
          localStorage.setItem(key, JSON.stringify(newUsage));
        } else {
          setUsage(parsed);
        }
      } catch (e) {
        setUsage({ date: today, chats: 0, scans: 0 });
      }
    } else {
      setUsage({ date: today, chats: 0, scans: 0 });
    }
  }, [user.id]); // Reload when user changes

  // Persist usage change
  useEffect(() => {
    if (user.id) {
      localStorage.setItem(`agriboost_usage_${user.id}`, JSON.stringify(usage));
    }
  }, [usage, user.id]);

  /* Limit Checker */
  const checkUsage = (type) => {
    if (isPro) return true;

    // Limits: 5 Chats, 1 Scan per day
    const limits = { chat: 5, scan: 1 };

    if (type === 'chat' && usage.chats >= limits.chat) {
      notify(t.limit_reached, "info");
      setView('subscription');
      return false;
    }
    if (type === 'scan' && usage.scans >= limits.scan) {
      notify(t.limit_reached, "info");
      setView('subscription');
      return false;
    }

    // Increment Usage if allowed
    setUsage(prev => ({
      ...prev,
      chats: type === 'chat' ? prev.chats + 1 : prev.chats,
      scans: type === 'scan' ? prev.scans + 1 : prev.scans
    }));
    return true;
  };

  const [weather, setWeather] = useState({ temp: '--', condition: 'Fetching...', humidity: '--' })
  const [recentActivity, setRecentActivity] = useState([
    { msg: 'Connecting to Agri-Intelligence Network...', time: 'Just now', icon: '📡' }
  ])
  /* Auth Session State */
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  /* Load Profile on Session */
  useEffect(() => {
    if (session) {
      const getProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (data) {
          setUser(prev => ({ ...prev, name: data.full_name || session.user.email, id: session.user.id, email: session.user.email }));
          if (data.language) setLang(data.language);
          // Set Pro from DB, defaulting to false if undefined
          setIsPro(!!data.is_pro);
        } else {
          // Init profile if new
          setUser(prev => ({ ...prev, name: session.user.user_metadata.full_name || 'Farmer', id: session.user.id, email: session.user.email, image: session.user.user_metadata.avatar_url }));
          setIsPro(false);
        }
      }
      getProfile();
    } else {
      // No session = Guest = No Pro
      setIsPro(false);
    }
  }, [session]);


  // 3. AI-Powered Real-Time News Feed
  const generateLiveInsights = async (city, weatherCond) => {
    if (!GROQ_API_KEY || !city || city === 'Detecting...') return;

    try {
      const prompt = `Generate 3 short, urgent, real-time agricultural advisories or market tips for a farmer in ${city}, Nigeria, given that the current weather is "${weatherCond}". 
      
      RULES:
      1. Do NOT make up fake events (e.g. do not say "Government bans fertilizer").
      2. Focus on PRACTICAL ADVICE (e.g. "High humidity detected. Watch out for fungal diseases on Maize").
      3. Focus on MARKET TRENDS (e.g. "Yam prices are stable this week").
      4. Make them sound like urgent ticker alerts.

      Return ONLY valid JSON array of objects: [{"msg": "headline text", "icon": "emoji like 🌧️, 📉, 🦠, 🚜"}]
      Translate the headlines to ${lang === 'ha' ? 'Hausa' : lang === 'yo' ? 'Yoruba' : lang === 'ig' ? 'Igbo' : 'English'}.`;

      const response = await callGroqAI([{ role: "user", content: prompt }]);
      // Clean JSON string (handle backticks)
      const cleanJson = response.replace(/```json|```/g, '').trim();
      const insights = JSON.parse(cleanJson);

      // Add timestamps
      const taggedInsights = insights.map(item => ({
        ...item,
        time: 'Live Feed'
      }));

      setRecentActivity(taggedInsights);
    } catch (e) {
      console.error("News gen failed", e);
    }
  };


  /* Payment Success Handler */
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('payment') === 'success') {
      const activatePro = async () => {
        if (!user || !user.id) return;

        notify("Payment Verified! Activating Pro...", "success");
        setIsPro(true);

        // Persist to Supabase
        // Note: checking session is safer
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await supabase.from('profiles').upsert({
            id: session.user.id,
            is_pro: true,
            updated_at: new Date()
          });
        }

        // Show Success View
        setShowSuccess(true);
        setView('success'); // virtual view

        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      };

      activatePro();
    }
  }, [user.id]); // Run when user is loaded

  useEffect(() => {
    /* REAL GEOLOCATION & WEATHER & CITY */
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation(prev => ({ ...prev, lat: latitude, lon: longitude }));

        // 1. Fetch Real Weather (Open-Meteo Free API)
        let currentCondition = 'Clear';
        try {
          const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code`);
          const weatherData = await weatherRes.json();
          const w = weatherData.current;

          // Map WMO codes to text/icons
          const getWeatherLabel = (code) => {
            if (code === 0) return "Clear Sky";
            if (code < 4) return "Partly Cloudy";
            if (code < 50) return "Foggy";
            if (code < 80) return "Rainy";
            return "Thunderstorm";
          }
          currentCondition = getWeatherLabel(w.weather_code);

          setWeather({
            temp: w.temperature_2m,
            humidity: w.relative_humidity_2m,
            condition: currentCondition
          });
        } catch (e) {
          console.error("Weather fetch failed", e);
        }

        // 2. Real Reverse Geocoding (BigDataCloud Free API)
        try {
          const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const geoData = await geoRes.json();
          const city = geoData.city || geoData.locality || "Nigeria";

          setLocation(prev => ({ ...prev, city }));

          // Update user city if it was default
          if (user.city === 'Detecting...' || user.city === 'Kaduna') {
            setUser(prev => ({ ...prev, city }));
          }

          // Trigger AI News Generation
          generateLiveInsights(city, currentCondition);

        } catch (e) {
          console.error("Geocoding failed", e);
        }
      });
    }
  }, [lang]); // Re-fetch news when lang changes

  return (
    <div className="app-container">
      {notification && <Notification data={notification} />}
      {!session ? (
        <Auth setSession={setSession} />
      ) : (
        <>
          <Sidebar activeView={view} setView={setView} isOpen={isMenuOpen} setOpen={setMenuOpen} isPro={isPro} lang={lang} setLang={setLang} t={t} />

          <main className="main-content">
            <header className="mobile-header">
              <h2 style={{ margin: 0 }}>AgriBoost<span style={{ color: 'var(--primary-glow)' }}>AI</span></h2>
              <button
                className="menu-btn"
                onClick={() => setMenuOpen(!isMenuOpen)}
                style={{ background: 'transparent', border: 'none', color: '#fff' }}
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </header>

            {view === 'dashboard' && !showSuccess && <Dashboard recentActivity={recentActivity} weather={weather} location={location} user={user} setView={setView} t={t} />}
            {showSuccess && <SuccessPage setView={(v) => { setShowSuccess(false); setView(v); }} />}
            {view === 'identity' && !showSuccess && <FarmerIdentity isPro={isPro} location={location} setLocation={setLocation} user={user} setUser={setUser} t={t} />}
            {view === 'diagnosis' && !showSuccess && <Diagnosis setView={setView} notify={notify} t={t} lang={lang} checkUsage={checkUsage} />}
            {view === 'market' && !showSuccess && <MarketPrices t={t} />}
            {view === 'advisory' && !showSuccess && <AIAdvisor location={location} t={t} lang={lang} checkUsage={checkUsage} />}
            {view === 'ussd' && !showSuccess && <USSDPreview location={location} t={t} />}
            {view === 'settings' && !showSuccess && <Settings user={user} setUser={setUser} t={t} lang={lang} setLang={setLang} notify={notify} />}
            {view === 'subscription' && !showSuccess && <Subscription isPro={isPro} setIsPro={setIsPro} notify={notify} t={t} usage={usage} user={user} />}
          </main>
        </>
      )}
    </div>
  )
}

export default App
