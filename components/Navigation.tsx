import React, { useState } from 'react';
import { Menu, X, ChevronDown, Home, FileText, Building2, Eye, Briefcase, Clock, MapPin, Wheat, Phone, Shield, ExternalLink } from 'lucide-react';
import { ViewState } from '../types';

interface NavProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  highContrast: boolean;
}

interface NavItem {
  id: ViewState;
  label: string;
  icon?: React.ReactNode;
  children?: { id: ViewState; label: string }[];
}

export const Navigation: React.FC<NavProps> = ({ currentView, setView, highContrast }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Extended navigation conforming to HG 728/2023
  const navItems: NavItem[] = [
    { id: 'home', label: 'Acasă', icon: <Home size={16} /> },
    {
      id: 'administration',
      label: 'Despre Noi',
      icon: <Building2 size={16} />,
      children: [
        { id: 'administration', label: 'Conducerea' },
        { id: 'geography', label: 'Geografie și Demografie' },
        { id: 'history', label: 'Istoric și Identitate' },
        { id: 'institutions', label: 'Instituții Publice' },
      ]
    },
    {
      id: 'documents',
      label: 'Acte Oficiale',
      icon: <FileText size={16} />,
      children: [
        { id: 'documents', label: 'Decizii Consiliu Local' },
        { id: 'documents', label: 'Dispoziții Primar' },
      ]
    },
    {
      id: 'transparency',
      label: 'Transparență',
      icon: <Eye size={16} />,
      children: [
        { id: 'transparency', label: 'Buget și Finanțe' },
        { id: 'economy', label: 'Economie Locală' },
      ]
    },
    { id: 'services', label: 'Servicii', icon: <Briefcase size={16} /> },
    { id: 'contact', label: 'Contact', icon: <Phone size={16} /> },
  ];

  // Flat nav items for mobile
  const flatNavItems: { id: ViewState; label: string; section?: string }[] = [
    { id: 'home', label: 'Acasă' },
    { id: 'administration', label: 'Conducerea', section: 'Despre Noi' },
    { id: 'geography', label: 'Geografie și Demografie', section: 'Despre Noi' },
    { id: 'history', label: 'Istoric și Identitate', section: 'Despre Noi' },
    { id: 'institutions', label: 'Instituții Publice', section: 'Despre Noi' },
    { id: 'documents', label: 'Decizii și Dispoziții', section: 'Acte Oficiale' },
    { id: 'transparency', label: 'Buget și Finanțe', section: 'Transparență' },
    { id: 'economy', label: 'Economie Locală', section: 'Transparență' },
    { id: 'services', label: 'Servicii Publice' },
    { id: 'contact', label: 'Contacte' },
  ];

  const handleNavClick = (view: ViewState) => {
    setView(view);
    setIsMobileOpen(false);
    setOpenDropdown(null);
  };

  const isActive = (item: NavItem): boolean => {
    if (item.id === currentView) return true;
    if (item.children) {
      return item.children.some(child => child.id === currentView);
    }
    return false;
  };

  const linkClass = (item: NavItem) => `
    px-4 py-4 font-medium transition-all cursor-pointer border-b-2 text-sm whitespace-nowrap flex items-center gap-2
    ${isActive(item)
      ? (highContrast ? 'border-yellow-400 text-yellow-400' : 'border-moldova-blue text-moldova-blue bg-moldova-cloud')
      : (highContrast ? 'border-transparent text-white hover:text-yellow-400' : 'border-transparent text-moldova-charcoal hover:bg-moldova-cloud hover:text-moldova-blue')}
  `;

  return (
    <>
      {/* Top Bar - Contact Info */}
      <div className={`hidden lg:block text-xs py-2 ${highContrast ? 'bg-gray-900 text-gray-400' : 'bg-moldova-charcoal text-white'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <Phone size={12} />
              +373 256 73421
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              Str. Pociumbăuțenilor 18
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://actelocale.gov.md" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
              RSAL <ExternalLink size={10} />
            </a>
            <a href="https://servicii.gov.md" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
              Servicii.gov.md <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`sticky top-0 z-40 transition-shadow ${highContrast ? 'bg-black border-b border-gray-800' : 'bg-white shadow-sm'}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16 lg:h-auto">

            {/* Logo / Brand */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${highContrast ? 'bg-yellow-400 text-black' : 'bg-moldova-blue text-white'}`}>
                P
              </div>
              <div className="hidden sm:block">
                <span className={`font-bold text-lg ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>
                  Primăria Pociumbăuți
                </span>
                <p className={`text-xs ${highContrast ? 'text-gray-400' : 'text-moldova-steel'}`}>
                  Raionul Rîșcani
                </p>
              </div>
            </div>

            {/* Desktop Nav with Dropdowns */}
            <div className="hidden lg:flex items-center">
              {navItems.map((item) => (
                <div key={item.id} className="relative group">
                  {item.children ? (
                    <>
                      <button
                        className={linkClass(item)}
                        onMouseEnter={() => setOpenDropdown(item.id)}
                        onClick={() => handleNavClick(item.id)}
                      >
                        {item.icon}
                        {item.label}
                        <ChevronDown size={14} className="opacity-50" />
                      </button>

                      {/* Dropdown Menu */}
                      <div
                        className={`absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200`}
                        onMouseLeave={() => setOpenDropdown(null)}
                      >
                        <div className={`min-w-[200px] rounded-lg shadow-lg py-2 ${highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-100'}`}>
                          {item.children.map((child, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleNavClick(child.id)}
                              className={`w-full text-left px-4 py-2 text-sm transition-colors ${currentView === child.id
                                  ? (highContrast ? 'bg-yellow-400 text-black' : 'bg-moldova-cloud text-moldova-blue')
                                  : (highContrast ? 'text-white hover:bg-gray-800' : 'text-moldova-charcoal hover:bg-moldova-cloud')
                                }`}
                            >
                              {child.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => handleNavClick(item.id)}
                      className={linkClass(item)}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-4">
              <button
                className={`lg:hidden p-2 rounded-md ${highContrast ? 'text-yellow-400' : 'text-moldova-charcoal'}`}
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                aria-label="Meniu principal"
              >
                {isMobileOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)}></div>
            <div className={`absolute right-0 top-0 bottom-0 w-80 shadow-2xl transition-transform overflow-y-auto ${highContrast ? 'bg-gray-900 text-white' : 'bg-white text-moldova-charcoal'}`}>
              <div className="sticky top-0 flex justify-between items-center p-4 border-b border-gray-200">
                <span className="font-bold">Meniu</span>
                <button onClick={() => setIsMobileOpen(false)} className="p-2">
                  <X size={24} />
                </button>
              </div>

              <div className="p-4">
                {/* Grouped navigation */}
                {(() => {
                  let currentSection = '';
                  return flatNavItems.map((item, idx) => {
                    const showSection = item.section && item.section !== currentSection;
                    if (item.section) currentSection = item.section;

                    return (
                      <React.Fragment key={idx}>
                        {showSection && (
                          <p className={`text-xs font-bold uppercase mt-4 mb-2 px-4 ${highContrast ? 'text-gray-500' : 'text-gray-400'}`}>
                            {item.section}
                          </p>
                        )}
                        <button
                          onClick={() => handleNavClick(item.id)}
                          className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${currentView === item.id
                              ? (highContrast ? 'bg-yellow-400 text-black' : 'bg-moldova-cloud text-moldova-blue')
                              : 'hover:bg-gray-100'}`}
                        >
                          {item.label}
                        </button>
                      </React.Fragment>
                    );
                  });
                })()}

                {/* External Links */}
                <div className="mt-4 space-y-2">
                  <a
                    href="https://actelocale.gov.md"
                    target="_blank"
                    rel="noreferrer"
                    className={`block px-4 py-2 text-sm rounded-lg flex items-center gap-2 ${highContrast ? 'text-gray-400 hover:text-yellow-400' : 'text-moldova-steel hover:bg-gray-100'}`}
                  >
                    <ExternalLink size={14} />
                    RSAL - Registrul Actelor Locale
                  </a>
                  <a
                    href="https://servicii.gov.md"
                    target="_blank"
                    rel="noreferrer"
                    className={`block px-4 py-2 text-sm rounded-lg flex items-center gap-2 ${highContrast ? 'text-gray-400 hover:text-yellow-400' : 'text-moldova-steel hover:bg-gray-100'}`}
                  >
                    <ExternalLink size={14} />
                    Servicii.gov.md
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};
