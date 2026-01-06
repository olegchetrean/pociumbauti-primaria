import React, { useState, useEffect } from 'react';
import { ViewState } from './types';
import { Navigation } from './components/Navigation';
import { AccessibilityMenu } from './components/AccessibilityMenu';
import { Home } from './pages/Home';
import { Administration } from './pages/Administration';
import { Decisions } from './pages/Decisions';
import { Contact } from './pages/Contact';
import { History } from './pages/History';
import { Services } from './pages/Services';
import { Admin } from './pages/Admin';
import { Transparency } from './pages/Transparency';
import { Geography } from './pages/Geography';
import { Economy } from './pages/Economy';
import { Institutions } from './pages/Institutions';
import { Shield, MapPin, Phone, Mail, Clock, ExternalLink, Heart } from 'lucide-react';
import { CONTACT_INFO, USEFUL_LINKS } from './constants';

// Internal CookieConsent Component
const CookieConsent = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900 text-white z-50 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-yellow-400 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] animate-fade-in-up">
      <div className="text-sm max-w-3xl">
        <p className="font-bold mb-1 text-yellow-400">Politica de Cookie-uri și GDPR</p>
        <p className="opacity-90 leading-relaxed">
          Acest site folosește cookie-uri tehnice strict necesare pentru a asigura funcționalitatea corectă și conformitatea cu HG 728/2023.
          Continuarea navigării implică acceptarea politicii noastre de confidențialitate și prelucrarea datelor cu caracter personal în scopuri administrative.
        </p>
      </div>
      <div className="flex gap-4 shrink-0">
        <button
          onClick={() => { localStorage.setItem('cookie_consent', 'true'); setShow(false); }}
          className="px-6 py-2 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500 transition-colors shadow-lg"
        >
          Accept și Continuă
        </button>
      </div>
    </div>
  );
};

// Footer Component (HG 728/2023 Compliant)
const Footer = ({ highContrast, setView }: { highContrast: boolean, setView: (v: ViewState) => void }) => {
  return (
    <footer className={`mt-auto border-t-4 ${highContrast ? 'bg-black text-white border-yellow-400' : 'bg-moldova-charcoal text-white border-moldova-blue'}`}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Column 1: Identity */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${highContrast ? 'bg-yellow-400 text-black' : 'bg-moldova-blue text-white'}`}>
                P
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">Primăria Satul Pociumbăuți</h3>
                <p className="text-xs opacity-70">Raionul Rîșcani, Republica Moldova</p>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Website oficial, conform cu HG 728/2023.
              Transparență totală în administrația publică locală.
            </p>
            <p className="text-sm italic opacity-70">
              "313 ani de istorie, o comunitate mândră care merge înainte"
            </p>
          </div>

          {/* Column 2: Contacts */}
          <div className="space-y-4">
            <h4 className={`font-bold border-b pb-2 ${highContrast ? 'border-yellow-400 text-yellow-400' : 'border-gray-600'}`}>
              Contacte
            </h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li className="flex gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span>{CONTACT_INFO.address}</span>
              </li>
              <li className="flex gap-2">
                <Phone size={16} className="mt-0.5 shrink-0" />
                <div>
                  <p>Primar: <a href={`tel:${CONTACT_INFO.phoneMayor}`} className="hover:underline">{CONTACT_INFO.phoneMayor}</a></p>
                  <p>Secretar: <a href={`tel:${CONTACT_INFO.phoneSecretary}`} className="hover:underline">{CONTACT_INFO.phoneSecretary}</a></p>
                </div>
              </li>
              <li className="flex gap-2">
                <Mail size={16} className="mt-0.5 shrink-0" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:underline">{CONTACT_INFO.email}</a>
              </li>
              <li className="flex gap-2">
                <Clock size={16} className="mt-0.5 shrink-0" />
                <span>{CONTACT_INFO.schedule}</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Navigation */}
          <div className="space-y-4">
            <h4 className={`font-bold border-b pb-2 ${highContrast ? 'border-yellow-400 text-yellow-400' : 'border-gray-600'}`}>
              Navigare Rapidă
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <button onClick={() => setView('home')} className="text-left opacity-80 hover:opacity-100 hover:underline">Acasă</button>
              <button onClick={() => setView('documents')} className="text-left opacity-80 hover:opacity-100 hover:underline">Decizii</button>
              <button onClick={() => setView('administration')} className="text-left opacity-80 hover:opacity-100 hover:underline">Conducerea</button>
              <button onClick={() => setView('transparency')} className="text-left opacity-80 hover:opacity-100 hover:underline">Transparență</button>
              <button onClick={() => setView('geography')} className="text-left opacity-80 hover:opacity-100 hover:underline">Geografie</button>
              <button onClick={() => setView('economy')} className="text-left opacity-80 hover:opacity-100 hover:underline">Economie</button>
              <button onClick={() => setView('history')} className="text-left opacity-80 hover:opacity-100 hover:underline">Istoric</button>
              <button onClick={() => setView('institutions')} className="text-left opacity-80 hover:opacity-100 hover:underline">Instituții</button>
              <button onClick={() => setView('services')} className="text-left opacity-80 hover:opacity-100 hover:underline">Servicii</button>
              <button onClick={() => setView('contact')} className="text-left opacity-80 hover:opacity-100 hover:underline">Contact</button>
            </div>
          </div>

          {/* Column 4: External Links */}
          <div className="space-y-4">
            <h4 className={`font-bold border-b pb-2 ${highContrast ? 'border-yellow-400 text-yellow-400' : 'border-gray-600'}`}>
              Linkuri Utile
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://actelocale.gov.md" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1 opacity-80 hover:opacity-100">
                  <ExternalLink size={12} /> RSAL - Registrul Actelor Locale
                </a>
              </li>
              <li>
                <a href="https://servicii.gov.md" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1 opacity-80 hover:opacity-100">
                  <ExternalLink size={12} /> Servicii.gov.md
                </a>
              </li>
              <li>
                <a href="https://gov.md" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1 opacity-80 hover:opacity-100">
                  <ExternalLink size={12} /> Guvernul RM
                </a>
              </li>
              <li>
                <a href="https://particip.gov.md" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1 opacity-80 hover:opacity-100">
                  <ExternalLink size={12} /> Consultări Publice
                </a>
              </li>
              <li>
                <a href="https://mtender.gov.md" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1 opacity-80 hover:opacity-100">
                  <ExternalLink size={12} /> Achiziții Publice
                </a>
              </li>
            </ul>

            <div className="pt-4">
              <button
                onClick={() => setView('admin')}
                className={`text-xs px-3 py-1.5 rounded border opacity-50 hover:opacity-100 transition-opacity flex items-center gap-1 ${highContrast ? 'border-yellow-400 text-yellow-400' : 'border-gray-500 text-gray-400'}`}
              >
                <Shield size={12} />
                Acces Funcționari
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Bar */}
      <div className={`py-4 text-center text-xs border-t ${highContrast ? 'bg-gray-900 border-gray-800 text-gray-400' : 'bg-black/20 border-white/10 text-white/60'}`}>
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <p>
            &copy; {new Date().getFullYear()} Primăria Pociumbăuți. Toate drepturile rezervate.
          </p>
          <p className="flex items-center gap-1">
            Dezvoltat cu <Heart size={12} className="text-red-500" /> conform HG 728/2023
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Politică GDPR</a>
            <a href="#" className="hover:underline">Accesibilitate</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function App() {
  const [view, setView] = useState<ViewState>('home');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('normal');
  const [highContrast, setHighContrast] = useState(false);

  // Apply font size to body
  useEffect(() => {
    const root = document.documentElement;
    if (fontSize === 'normal') root.style.fontSize = '16px';
    if (fontSize === 'large') root.style.fontSize = '18px';
    if (fontSize === 'xl') root.style.fontSize = '20px';
  }, [fontSize]);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  const renderView = () => {
    switch (view) {
      case 'home':
        return <Home setView={setView} highContrast={highContrast} />;
      case 'administration':
        return <Administration highContrast={highContrast} />;
      case 'documents':
        return <Decisions highContrast={highContrast} />;
      case 'transparency':
        return <Transparency highContrast={highContrast} />;
      case 'contact':
        return <Contact highContrast={highContrast} />;
      case 'history':
        return <History highContrast={highContrast} />;
      case 'services':
        return <Services highContrast={highContrast} />;
      case 'geography':
        return <Geography highContrast={highContrast} />;
      case 'economy':
        return <Economy highContrast={highContrast} />;
      case 'institutions':
        return <Institutions highContrast={highContrast} />;
      case 'admin':
      case 'admin-dashboard':
      case 'admin-publish-anunt':
      case 'admin-publish-decizie':
      case 'admin-publish-dispozitie':
        return <Admin highContrast={highContrast} setView={setView} />;
      default:
        return <Home setView={setView} highContrast={highContrast} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${highContrast ? 'bg-black text-white' : 'bg-white text-moldova-charcoal'}`}>

      {/* Accessibility Tools */}
      <AccessibilityMenu
        onFontSizeChange={setFontSize}
        onContrastChange={setHighContrast}
        highContrast={highContrast}
      />

      {/* Main Navigation */}
      <Navigation
        currentView={view}
        setView={setView}
        highContrast={highContrast}
      />

      {/* Dynamic Content */}
      <main className="flex-grow">
        {renderView()}
      </main>

      {/* Mandatory Footer */}
      <Footer highContrast={highContrast} setView={setView} />

      {/* Cookie Consent Banner */}
      <CookieConsent />

    </div>
  );
}

export default App;
