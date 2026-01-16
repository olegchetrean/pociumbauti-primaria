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
                  <p>Primar: <a href={`tel:${CONTACT_INFO.phoneMayor}`} className="hover:underline">{CONTACT_INFO.phoneMayor}</a>, <a href="tel:+37367611811" className="hover:underline">+373 676 11811</a></p>
                  <p>Secretar: <a href={`tel:${CONTACT_INFO.phoneSecretary}`} className="hover:underline">{CONTACT_INFO.phoneSecretary}</a></p>
                  <p>Contabilitate: <a href={`tel:${CONTACT_INFO.phoneContabilitate}`} className="hover:underline">{CONTACT_INFO.phoneContabilitate}</a></p>
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
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d562.9345978042137!2d27.32241973413662!3d47.99588339545808!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4734a9000bc85f2f%3A0x386458d7f0c65ea7!2zUHJpbcSDcmlhIFBvY2l1bWLEg3XFo2k!5e1!3m2!1sru!2s!4v1767943298942!5m2!1sru!2s" 
                    width="100%" 
                    height="450" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Harta Primăriei Satul Pociumbăuți"
                    className="w-full"
                />
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