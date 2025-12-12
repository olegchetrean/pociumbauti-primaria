import React from 'react';
import { CONTACT_INFO } from '../constants';
import { MapPin, Phone, Mail, Clock, UserCheck } from 'lucide-react';

interface Props { highContrast: boolean; }

export const Contact: React.FC<Props> = ({ highContrast }) => {
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

        {/* Map Placeholder & Form */}
        <div className="space-y-8">
            <div className={`h-64 rounded-xl overflow-hidden flex items-center justify-center border-2 ${highContrast ? 'bg-gray-800 border-yellow-400' : 'bg-gray-200 border-white'}`}>
                {/* Embed OpenStreetMap via iframe in real usage, placeholder here */}
                <div className="text-center p-4">
                    <MapPin size={48} className="mx-auto mb-2 opacity-50" />
                    <p className="font-bold">Harta Satului Pociumbăuți</p>
                    <p className="text-sm">Lat: 47.9958° N, Long: 27.3236° E</p>
                </div>
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