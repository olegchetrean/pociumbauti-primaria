import React, { useState } from 'react';
import { LATEST_DECISIONS, LATEST_DISPOSITIONS } from '../constants';
import { FileText, Download, Filter, Search, ShieldCheck } from 'lucide-react';

interface Props { highContrast: boolean; }

export const Decisions: React.FC<Props> = ({ highContrast }) => {
  const [activeTab, setActiveTab] = useState<'decizii' | 'dispozitii'>('decizii');

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-12 text-center">
        <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${highContrast ? 'text-yellow-400' : 'text-gray-900'}`}>
          Decizii și Dispoziții
        </h1>
        <p className={`max-w-2xl mx-auto text-lg ${highContrast ? 'text-white' : 'text-gray-600'}`}>
          Registrul Actelor Locale. Documente oficiale adoptate de Consiliul Local și Primăria Pociumbăuți, 
          disponibile publicului conform Legii nr. 239/2008.
        </p>
      </div>

      <div className={`rounded-xl shadow-lg overflow-hidden border ${highContrast ? 'bg-gray-900 border-yellow-400' : 'bg-white border-gray-100'}`}>
        {/* Toolbar */}
        <div className={`p-6 border-b flex flex-col md:flex-row justify-between items-center gap-4 ${highContrast ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gray-50'}`}>
           <div className="flex bg-gray-200 rounded-lg p-1 w-full md:w-auto">
              <button 
                onClick={() => setActiveTab('decizii')}
                className={`px-6 py-2 rounded-md font-bold text-sm transition-all flex-1 md:flex-none ${activeTab === 'decizii' ? 'bg-white text-moldova-blue shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Decizii Consiliu
              </button>
              <button 
                onClick={() => setActiveTab('dispozitii')}
                className={`px-6 py-2 rounded-md font-bold text-sm transition-all flex-1 md:flex-none ${activeTab === 'dispozitii' ? 'bg-white text-moldova-blue shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Dispoziții Primar
              </button>
           </div>
           
           <div className="relative w-full md:w-auto">
             <input 
               type="text" 
               placeholder="Caută document..." 
               className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 w-full md:w-64 focus:ring-2 focus:ring-moldova-blue focus:border-transparent outline-none"
             />
             <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
           </div>
        </div>

        {/* Content Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`text-xs font-bold uppercase tracking-wider ${highContrast ? 'text-yellow-400 border-b border-gray-700' : 'text-gray-500 bg-gray-50/50 border-b border-gray-100'}`}>
                <th className="p-4 w-32">Nr. / Data</th>
                <th className="p-4 w-32">Tip</th>
                <th className="p-4">Titlu și Descriere</th>
                <th className="p-4 w-32">Status</th>
                <th className="p-4 w-32 text-right">Descarcă</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {activeTab === 'decizii' 
                ? LATEST_DECISIONS.map((doc) => (
                    <tr key={doc.id} className={`border-b last:border-0 group transition-colors ${highContrast ? 'border-gray-800 hover:bg-gray-800 text-white' : 'border-gray-100 hover:bg-blue-50/50 text-gray-700'}`}>
                      <td className="p-4 whitespace-nowrap font-mono text-xs">
                        <span className="text-base font-bold">№ {doc.numar}</span><br/>
                        <span className="opacity-70">{doc.data_emitere}</span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase ${doc.tip === 'normativ' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                          {doc.tip}
                        </span>
                      </td>
                      <td className="p-4 max-w-lg">
                        <p className={`font-bold text-base mb-1 ${highContrast ? 'text-yellow-400' : 'text-moldova-charcoal'}`}>{doc.titlu}</p>
                        <p className="text-xs opacity-80 line-clamp-2">{doc.descriere}</p>
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-1.5 text-green-600 font-bold text-xs">
                          <ShieldCheck size={14} /> Adoptat
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-colors ${highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-moldova-blue text-white hover:bg-blue-700 shadow-md hover:shadow-lg'}`}>
                          <Download size={14} /> PDF
                        </button>
                      </td>
                    </tr>
                  ))
                : LATEST_DISPOSITIONS.map((doc) => (
                    <tr key={doc.id} className={`border-b last:border-0 group transition-colors ${highContrast ? 'border-gray-800 hover:bg-gray-800 text-white' : 'border-gray-100 hover:bg-blue-50/50 text-gray-700'}`}>
                      <td className="p-4 whitespace-nowrap font-mono text-xs">
                        <span className="text-base font-bold">№ {doc.numar}</span><br/>
                        <span className="opacity-70">{doc.data_emitere}</span>
                      </td>
                      <td className="p-4">
                        <span className="inline-block px-2 py-1 rounded text-xs font-bold uppercase bg-orange-100 text-orange-700">
                          {doc.tip}
                        </span>
                      </td>
                      <td className="p-4 max-w-lg">
                        <p className={`font-bold text-base mb-1 ${highContrast ? 'text-yellow-400' : 'text-moldova-charcoal'}`}>{doc.titlu}</p>
                        <p className="text-xs opacity-80 line-clamp-2">{doc.descriere}</p>
                        {doc.depersonalizat && <span className="text-xs italic text-gray-400 mt-1 block">Date cu caracter personal anonimizate</span>}
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-1.5 text-green-600 font-bold text-xs">
                          <ShieldCheck size={14} /> Emis
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-colors ${highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-moldova-blue text-white hover:bg-blue-700 shadow-md hover:shadow-lg'}`}>
                          <Download size={14} /> PDF
                        </button>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
        
        <div className={`p-4 text-center border-t text-sm ${highContrast ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
           <p className="opacity-70 mb-2">Toate actele sunt sincronizate automat cu Registrul de Stat al Actelor Locale.</p>
           <a href="https://actelocale.gov.md/" target="_blank" rel="noreferrer" className={`font-bold underline ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>
              Verifică pe actelocale.gov.md
           </a>
        </div>
      </div>
    </div>
  );
};