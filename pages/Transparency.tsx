import React from 'react';
import { FileText, PieChart, Users, Download } from 'lucide-react';

interface Props { highContrast: boolean; }

export const Transparency: React.FC<Props> = ({ highContrast }) => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className={`text-4xl font-bold mb-8 text-center ${highContrast ? 'text-yellow-400' : 'text-gray-900'}`}>
        Transparență Decizională
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Budget Section */}
         <div className={`p-8 rounded-xl shadow-lg border-t-4 ${highContrast ? 'bg-gray-900 border-yellow-400 text-white' : 'bg-white border-moldova-blue'}`}>
            <div className="flex items-center gap-4 mb-6">
               <div className="p-3 bg-blue-100 rounded-full text-moldova-blue">
                 <PieChart size={28} />
               </div>
               <h2 className="text-2xl font-bold">Buget Local</h2>
            </div>
            <p className="mb-6 opacity-80">
              Bugetul satului Pociumbăuți pentru anul 2026.
              Principalele surse de venit și direcții de cheltuieli.
            </p>
            <ul className="space-y-3 mb-6">
               <li className="flex justify-between items-center p-3 rounded bg-gray-50 dark:bg-gray-800">
                  <span className="font-medium text-sm">Buget Local 2026 cu Anexe</span>
                  <a 
                    href="/uploads/file/06-06 buget cu anexe semnat.pdf" 
                    download 
                    className="flex items-center gap-1 text-xs font-bold text-moldova-blue hover:underline"
                  >
                    <Download size={14} />
                    Descarcă PDF
                  </a>
               </li>
               <li className="flex justify-between items-center p-3 rounded bg-gray-50 dark:bg-gray-800">
                  <span className="font-medium text-sm">Taxe Locale 2026</span>
                  <a 
                    href="/uploads/file/06-04 taxe.signed.signed.signed.pdf" 
                    download 
                    className="flex items-center gap-1 text-xs font-bold text-moldova-blue hover:underline"
                  >
                    <Download size={14} />
                    Descarcă PDF
                  </a>
               </li>
               <li className="flex justify-between items-center p-3 rounded bg-gray-50 dark:bg-gray-800">
                  <span className="font-medium text-sm">Impozite Locale 2026</span>
                  <a 
                    href="/uploads/file/06-05 impozite.signed.signed.signed.pdf" 
                    download 
                    className="flex items-center gap-1 text-xs font-bold text-moldova-blue hover:underline"
                  >
                    <Download size={14} />
                    Descarcă PDF
                  </a>
               </li>
            </ul>
         </div>

         {/* Procurement Section */}
         <div className={`p-8 rounded-xl shadow-lg border-t-4 ${highContrast ? 'bg-gray-900 border-green-500 text-white' : 'bg-white border-green-500'}`}>
            <div className="flex items-center gap-4 mb-6">
               <div className="p-3 bg-green-100 rounded-full text-green-600">
                 <FileText size={28} />
               </div>
               <h2 className="text-2xl font-bold">Achiziții Publice</h2>
            </div>
            <p className="mb-6 opacity-80">
              Planul anual de achiziții și contractele atribuite. Transparență totală în cheltuirea banilor publici.
            </p>
            <p className="text-sm opacity-70 mb-4">
              Informațiile despre achizițiile publice sunt disponibile pe portalul național.
            </p>
            <a href="https://mtender.gov.md" target="_blank" rel="noreferrer" className="text-sm font-bold text-green-600 hover:underline">
              Vezi pe mtender.gov.md &rarr;
            </a>
         </div>

         {/* Consultations Section */}
         <div className={`md:col-span-2 p-8 rounded-xl shadow-lg border-t-4 ${highContrast ? 'bg-gray-900 border-yellow-400 text-white' : 'bg-white border-moldova-gold'}`}>
            <div className="flex items-center gap-4 mb-6">
               <div className="p-3 bg-yellow-100 rounded-full text-yellow-700">
                 <Users size={28} />
               </div>
               <h2 className="text-2xl font-bold">Consultări Publice</h2>
            </div>
            <p className="mb-6 opacity-80">
              Participă la luarea deciziilor. Primăria organizează consultări publice pentru toate proiectele majore.
            </p>
            <div className="bg-yellow-50 dark:bg-gray-800 p-4 rounded-lg border border-yellow-200 dark:border-gray-700">
               <h3 className="font-bold mb-2">🟢 CONSULTARE ACTIVĂ: Proiect Buget 2026</h3>
               <p className="text-sm mb-4">Așteptăm propunerile dumneavoastră. Contactați-ne la primaria.pociumbauti@gmail.com</p>
               <a 
                 href="mailto:primaria.pociumbauti@gmail.com?subject=Propunere Buget 2026"
                 className={`inline-block px-4 py-2 rounded font-bold text-sm ${highContrast ? 'bg-yellow-400 text-black' : 'bg-moldova-blue text-white'}`}
               >
                  Trimite Opinie
               </a>
            </div>
         </div>
      </div>
    </div>
  );
};