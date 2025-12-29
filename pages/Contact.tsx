import React, { useEffect, useRef } from 'react';
import { CONTACT_INFO } from '../constants';
import { MapPin, Phone, Mail, Clock, UserCheck } from 'lucide-react';

// Leaflet types
declare global {
  interface Window {
    L: any;
  }
}

interface Props { highContrast: boolean; }

export const Contact: React.FC<Props> = ({ highContrast }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Load Leaflet CSS and JS dynamically
    const loadLeaflet = () => {
      if (window.L) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        // Load CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);

        // Load JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        script.onload = () => resolve();
        document.body.appendChild(script);
      });
    };

    if (mapRef.current && !mapInstanceRef.current) {
      loadLeaflet().then(() => {
        if (window.L && mapRef.current) {
          const map = window.L.map(mapRef.current).setView(
            [CONTACT_INFO.coordinates!.lat, CONTACT_INFO.coordinates!.lng],
            15
          );

          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
          }).addTo(map);

          window.L.marker([CONTACT_INFO.coordinates!.lat, CONTACT_INFO.coordinates!.lng])
            .addTo(map)
            .bindPopup(`<strong>Primăria Comunei Pociumbăuți</strong><br>${CONTACT_INFO.address}`)
            .openPopup();

          mapInstanceRef.current = map;
        }
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className={`text-3xl font-bold mb-8 text-center ${highContrast ? 'text-yellow-400' : 'text-gray-900'}`}>
        Contacte și Audiențe
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Info Block */}
        <div className="space-y-8">
          <div className={`p-6 rounded-xl border ${highContrast ? 'bg-gray-900 border-yellow-400 text-white' : 'bg-white border-gray-200 shadow-sm'}`}>
            <h2 className="text-xl font-bold mb-6 border-b pb-2">Date de Contact</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-moldova-red mt-1" />
                <div>
                  <span className="font-bold block text-sm opacity-70">Adresa</span>
                  <span>{CONTACT_INFO.address}</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="text-moldova-blue mt-1" />
                <div>
                  <span className="font-bold block text-sm opacity-70">Telefoane</span>
                  <p>Primar: <a href={`tel:${CONTACT_INFO.phoneMayor}`} className="hover:underline">{CONTACT_INFO.phoneMayor}</a></p>
                  <p>Secretar/Contabilitate: <a href={`tel:${CONTACT_INFO.phoneSecretary}`} className="hover:underline">{CONTACT_INFO.phoneSecretary}</a></p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="text-moldova-yellow mt-1" />
                <div>
                  <span className="font-bold block text-sm opacity-70">Email</span>
                  <a href={`mailto:${CONTACT_INFO.email}`} className="hover:underline">{CONTACT_INFO.email}</a>
                </div>
              </li>
            </ul>
          </div>

          <div className={`p-6 rounded-xl border ${highContrast ? 'bg-gray-900 border-yellow-400 text-white' : 'bg-blue-50 border-blue-100'}`}>
            <h2 className="text-xl font-bold mb-6 border-b pb-2 border-opacity-20 border-black">Program de Lucru</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Clock className="mt-1" />
                <div>
                  <span className="font-bold block text-sm opacity-70">Program Administrativ</span>
                  <span>{CONTACT_INFO.schedule}</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <UserCheck className="mt-1" />
                <div>
                  <span className="font-bold block text-sm opacity-70">Program Audiențe (Primar)</span>
                  <span>{CONTACT_INFO.audiences}</span>
                  <p className="text-xs mt-1 italic">Înscrierea la audiență se face la secretarul consiliului.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Map & Form */}
        <div className="space-y-8">
            <div className={`rounded-xl overflow-hidden border-2 ${highContrast ? 'border-yellow-400' : 'border-gray-200'}`}>
                <div 
                    ref={mapRef} 
                    style={{ height: '400px', width: '100%' }}
                    className="z-0"
                />
            </div>
            <div className="text-center">
                <a
                    href={`https://www.openstreetmap.org/?mlat=${CONTACT_INFO.coordinates!.lat}&mlon=${CONTACT_INFO.coordinates!.lng}&zoom=15`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm hover:underline ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}
                >
                    Vezi hartă mai mare →
                </a>
            </div>

            <div className={`p-6 rounded-xl border ${highContrast ? 'bg-gray-900 border-yellow-400 text-white' : 'bg-white border-gray-200 shadow-sm'}`}>
                <h2 className="text-xl font-bold mb-4">Scrieți-ne o Petiție</h2>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label className="block text-sm font-medium mb-1">Nume Prenume</label>
                        <input type="text" className={`w-full p-2 rounded border ${highContrast ? 'bg-black border-yellow-400' : 'border-gray-300'}`} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email sau Telefon</label>
                        <input type="text" className={`w-full p-2 rounded border ${highContrast ? 'bg-black border-yellow-400' : 'border-gray-300'}`} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Mesajul Dvs.</label>
                        <textarea rows={4} className={`w-full p-2 rounded border ${highContrast ? 'bg-black border-yellow-400' : 'border-gray-300'}`} required></textarea>
                    </div>
                    <button type="submit" className={`w-full py-2 rounded font-bold transition-colors ${highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-moldova-blue text-white hover:bg-blue-800'}`}>
                        Trimite Petiția
                    </button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};