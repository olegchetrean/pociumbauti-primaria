import React from 'react';
import { LATEST_DECISIONS } from '../constants';
import { FileText, Download, Filter } from 'lucide-react';

interface Props { highContrast: boolean; }

export const Documents: React.FC<Props> = ({ highContrast }) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className={`text-3xl font-bold mb-4 ${highContrast ? 'text-yellow-400' : 'text-gray-900'}`}>
          Decizii și Dispoziții
        </h1>
        <p className={`max-w-2xl mx-auto ${highContrast ? 'text-white' : 'text-gray-600'}`}>
          În conformitate cu Legea nr. 239/2008 privind transparența în procesul decizional, 
          aici sunt publicate actele normative adoptate de Primărie și Consiliul Local Pociumbăuți.
        </p>
      </div>

      <div className={`rounded-lg p-6 mb-8 border ${highContrast ? 'bg-gray-900 border-yellow-400' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <h2 className={`text-lg font-bold flex items-center gap-2 ${highContrast ? 'text-white' : 'text-gray-800'}`}>
            <FileText size={20} />
            Registrul Actelor Locale
          </h2>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm font-medium w-full justify-center md:w-auto text-gray-700">
              <Filter size={16} /> Filtrează
            </button>
            <input 
              type="text" 
              placeholder="Caută după număr sau titlu..." 
              className="px-4 py-2 border rounded text-sm w-full md:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`text-sm border-b-2 ${highContrast ? 'border-yellow-400 text-yellow-400' : 'border-gray-100 text-gray-500 bg-gray-50'}`}>
                <th className="p-4 font-semibold">Nr. / Data</th>
                <th className="p-4 font-semibold">Tip Document</th>
                <th className="p-4 font-semibold">Titlu / Descriere</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {LATEST_DECISIONS.map((doc) => (
                <tr key={doc.id} className={`border-b group hover:bg-opacity-5 ${highContrast ? 'border-gray-800 hover:bg-white text-white' : 'border-gray-100 hover:bg-blue-50 text-gray-800'}`}>
                  <td className="p-4 whitespace-nowrap font-mono">
                    {doc.numar}<br/>
                    <span className="text-xs opacity-70">{doc.data_emitere}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      doc.tip === 'normativ' ? 'bg-purple-100 text-purple-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {doc.tip}
                    </span>
                  </td>
                  <td className="p-4 max-w-md">
                    <p className="font-medium">{doc.titlu}</p>
                  </td>
                  <td className="p-4">
                     <span className={`flex items-center gap-1 text-xs font-bold ${
                        doc.status === 'Adoptat' ? 'text-green-600' : 'text-orange-600'
                     }`}>
                       <span className={`w-2 h-2 rounded-full ${doc.status === 'Adoptat' ? 'bg-green-600' : 'bg-orange-600'}`}></span>
                       {doc.status}
                     </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className={`inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-bold transition-colors ${highContrast ? 'bg-yellow-400 text-black' : 'bg-moldova-blue text-white hover:bg-blue-800'}`}>
                      <Download size={14} />
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 flex justify-center">
             <a href="https://actelocale.gov.md/" target="_blank" rel="noreferrer" className={`text-sm underline ${highContrast ? 'text-yellow-400' : 'text-blue-600'}`}>
                Vezi toate actele în Registrul de Stat al Actelor Locale
             </a>
        </div>
      </div>
    </div>
  );
};