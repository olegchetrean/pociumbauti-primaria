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
import { Announcements } from './pages/Announcements';
import { AnnouncementDetail } from './pages/AnnouncementDetail';
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
              "255 ani de istorie, o comunitate mândră care merge înainte"
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
                  <p>Primar: <a href={`tel:${CONTACT_INFO.phoneMayor}`} className="hover:underline">{CONTACT_INFO.phoneMayor}</a>, <a href="tel:+37367611811" className="hover:underline">+373 676 11811</a></p>
                  <p>Secretar: <a href={`tel:${CONTACT_INFO.phoneSecretary}`} className="hover:underline">{CONTACT_INFO.phoneSecretary}</a></p>
                  <p>Contabilitate: <a href={`tel:${CONTACT_INFO.phoneContabilitate}`} className="hover:underline">{CONTACT_INFO.phoneContabilitate}</a></p>
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
            Dezvoltat de <a className='text-white' href="https://megapromoting.com/" target="_blank" rel="noopener noreferrer">MegaPromoting</a>
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
  // Initialize view from URL immediately to prevent redirects
  const getInitialView = (): ViewState => {
    if (typeof window === 'undefined') return 'home';
    const path = window.location.pathname;
    if (path.startsWith('/admin')) return 'admin';
    const routeMap: Record<string, ViewState> = {
      '/': 'home',
      '/home': 'home',
      '/administration': 'administration',
      '/documents': 'documents',
      '/transparency': 'transparency',
      '/contact': 'contact',
      '/history': 'history',
      '/services': 'services',
      '/geography': 'geography',
      '/economy': 'economy',
      '/institutions': 'institutions',
    };
    return routeMap[path] || 'home';
  };

  const [view, setView] = useState<ViewState>(getInitialView());
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [routingInitialized, setRoutingInitialized] = useState(false);

  // URL-based routing - sync on mount and when URL changes
  useEffect(() => {
    const path = window.location.pathname;
    
    // Handle /admin routes
    if (path.startsWith('/admin')) {
      setView('admin');
      setRoutingInitialized(true);
      return;
    }
    
    // Handle announcement routes
    if (path.startsWith('/anunt/')) {
      const id = parseInt(path.split('/anunt/')[1]);
      if (!isNaN(id)) {
        setView({ type: 'announcement-detail', id } as any);
        setRoutingInitialized(true);
        return;
      }
    }
    
    if (path === '/anunturi' || path === '/anunturi/') {
      setView('announcements' as any);
      setRoutingInitialized(true);
      return;
    }
    
    // Map other routes
    const routeMap: Record<string, ViewState> = {
      '/': 'home',
      '/home': 'home',
      '/administration': 'administration',
      '/documents': 'documents',
      '/transparency': 'transparency',
      '/contact': 'contact',
      '/history': 'history',
      '/services': 'services',
      '/geography': 'geography',
      '/economy': 'economy',
      '/institutions': 'institutions',
    };
    
    const mappedView = routeMap[path];
    if (mappedView) {
      setView(mappedView);
    } else {
      setView('home');
    }
    setRoutingInitialized(true);
  }, []);

  // Update URL when view changes (except for admin which handles its own routing)
  useEffect(() => {
    // Don't update URL until routing is initialized
    if (!routingInitialized) {
      return;
    }
    
    const currentPath = window.location.pathname;
    
    // Don't update URL if view is admin - admin handles its own routing
    if (view === 'admin' || (typeof view === 'string' && view.startsWith('admin-'))) {
      return;
    }
    
    // Don't update URL if view is an object (announcement detail) - handled separately
    if (typeof view === 'object' && view !== null) {
      return;
    }
    
    // Map view to path
    const pathMap: Record<string, string> = {
      'home': '/',
      'administration': '/administration',
      'documents': '/documents',
      'transparency': '/transparency',
      'contact': '/contact',
      'history': '/history',
      'services': '/services',
      'geography': '/geography',
      'economy': '/economy',
      'institutions': '/institutions',
      'announcements': '/anunturi',
      'admin': '/admin',
      'admin-dashboard': '/admin',
      'admin-publish-anunt': '/admin',
      'admin-publish-decizie': '/admin',
      'admin-publish-dispozitie': '/admin',
    };
    
    const newPath = pathMap[view as string] || '/';
    
    // Always update URL when view changes, especially when going to 'home'
    if (currentPath !== newPath) {
      window.history.replaceState({}, '', newPath);
    }
  }, [view, routingInitialized]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      
      if (path.startsWith('/admin')) {
        setView('admin');
        return;
      }
      
      // Handle announcement routes
      if (path.startsWith('/anunt/')) {
        const id = parseInt(path.split('/anunt/')[1]);
        if (!isNaN(id)) {
          setView({ type: 'announcement-detail', id } as any);
          return;
        }
      }
      
      if (path === '/anunturi' || path === '/anunturi/') {
        setView('announcements' as any);
        return;
      }
      
      const routeMap: Record<string, ViewState> = {
        '/': 'home',
        '/home': 'home',
        '/administration': 'administration',
        '/documents': 'documents',
        '/transparency': 'transparency',
        '/contact': 'contact',
        '/history': 'history',
        '/services': 'services',
        '/geography': 'geography',
        '/economy': 'economy',
        '/institutions': 'institutions',
      };
      
      const mappedView = routeMap[path] || 'home';
      setView(mappedView);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
    // Handle announcement detail view (object with type and id)
    if (typeof view === 'object' && view !== null && 'type' in view && (view as any).type === 'announcement-detail') {
      const announcementId = (view as any).id;
      if (announcementId && !isNaN(announcementId)) {
        return <AnnouncementDetail highContrast={highContrast} setView={setView} announcementId={announcementId} />;
      }
    }

    // Handle string views
    if (typeof view === 'string') {
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
        case 'announcements':
          return <Announcements highContrast={highContrast} setView={setView} />;
        case 'admin':
        case 'admin-dashboard':
        case 'admin-publish-anunt':
        case 'admin-publish-decizie':
        case 'admin-publish-dispozitie':
          return <Admin highContrast={highContrast} setView={setView} />;
        default:
          return <Home setView={setView} highContrast={highContrast} />;
      }
    }

    // Fallback
    return <Home setView={setView} highContrast={highContrast} />;
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
