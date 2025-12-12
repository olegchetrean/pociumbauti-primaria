import React from 'react';
import { FileText, Home, Truck, Users } from 'lucide-react';

interface Props { highContrast: boolean; }

export const Services: React.FC<Props> = ({ highContrast }) => {
  const services = [
    { icon: <FileText size={32}/>, title: "Acte și Certificate", desc: "Eliberare certificate de urbanism, componență familie, titluri de proprietate." },
    { icon: <Users size={32}/>, title: "Asistență Socială", desc: "Suport pentru persoane vârstnice, ajutor social, compensații pentru perioada rece." },
    { icon: <Home size={32}/>, title: "Fond Funciar", desc: "Înregistrare contracte arendă, modificări titluri, cadastru." },
    { icon: <Truck size={32}/>, title: "Salubritate", desc: "Gestionare deșeuri, iluminat stradal, întreținere drumuri locale." }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className={`text-4xl font-bold mb-6 ${highContrast ? 'text-yellow-400' : 'text-gray-900'}`}>
          Servicii Publice
        </h1>
        <p className={`text-lg ${highContrast ? 'text-white' : 'text-gray-600'}`}>
          Primăria Pociumbăuți oferă servicii administrative pentru cetățeni. 
          Majoritatea serviciilor necesită prezența fizică, însă lucrăm la digitalizare.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {services.map((service, idx) => (
          <div key={idx} className={`p-8 rounded-xl flex items-start gap-6 transition-all hover:-translate-y-1 ${highContrast ? 'bg-gray-900 border border-yellow-400 text-white' : 'bg-white shadow-md border border-gray-100 hover:shadow-xl'}`}>
             <div className={`p-4 rounded-full ${highContrast ? 'bg-yellow-400 text-black' : 'bg-blue-50 text-moldova-blue'}`}>
               {service.icon}
             </div>
             <div>
               <h3 className="text-xl font-bold mb-2">{service.title}</h3>
               <p className={highContrast ? 'text-gray-300' : 'text-gray-600'}>{service.desc}</p>
             </div>
          </div>
        ))}
      </div>

      <div className={`rounded-2xl p-8 md:p-12 text-center ${highContrast ? 'bg-blue-900 text-white' : 'bg-gradient-to-r from-moldova-blue to-blue-700 text-white'}`}>
         <h2 className="text-3xl font-bold mb-4">Portalul Serviciilor Publice</h2>
         <p className="mb-8 max-w-2xl mx-auto opacity-90">
           Pentru servicii guvernamentale electronice (cazier judiciar, acte stare civilă, apostile), 
           vă rugăm să accesați portalul național.
         </p>
         <a 
           href="https://servicii.gov.md" 
           target="_blank" 
           rel="noreferrer" 
           className={`inline-block px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-lg ${highContrast ? 'bg-yellow-400 text-black' : 'bg-white text-moldova-blue'}`}
         >
           Accesați servicii.gov.md
         </a>
      </div>
    </div>
  );
};