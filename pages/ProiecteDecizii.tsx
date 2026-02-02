import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Eye, FileIcon, Loader2 } from 'lucide-react';

interface Props { highContrast: boolean; }

interface ProiectDecizie {
  id: number;
  titlu: string;
  descriere: string | null;
  document: string;
  document_url: string;
  data_publicare: string;
}

export const ProiecteDecizii: React.FC<Props> = ({ highContrast }) => {
  const [proiecte, setProiecte] = useState<ProiectDecizie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProiecte = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/proiecte-decizii');
        if (response.ok) {
          const data = await response.json();
          setProiecte(data.proiecte || []);
        } else {
          setError('Nu s-au putut încărca proiectele de decizii');
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Eroare de conexiune');
      } finally {
        setLoading(false);
      }
    };

    fetchProiecte();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getFileExtension = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    return ext.toUpperCase();
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    if (ext === 'pdf') {
      return <FileText size={20} className="text-red-500" />;
    }
    if (ext === 'doc' || ext === 'docx') {
      return <FileIcon size={20} className="text-blue-500" />;
    }
    return <FileText size={20} />;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className={`text-3xl font-bold mb-4 ${highContrast ? 'text-yellow-400' : 'text-gray-900'}`}>
          Proiecte de Decizii
        </h1>
        <p className={`max-w-2xl mx-auto ${highContrast ? 'text-white' : 'text-gray-600'}`}>
          În conformitate cu Legea nr. 239/2008 privind transparența în procesul decizional,
          aici sunt publicate proiectele de decizii ale Consiliului Local Pociumbăuți pentru consultare publică.
        </p>
      </div>

      <div className={`rounded-lg p-6 mb-8 border ${highContrast ? 'bg-gray-900 border-yellow-400' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <h2 className={`text-lg font-bold flex items-center gap-2 ${highContrast ? 'text-white' : 'text-gray-800'}`}>
            <FileText size={20} />
            Proiecte Disponibile pentru Consultare
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 size={32} className={`animate-spin ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`} />
          </div>
        ) : error ? (
          <div className={`text-center py-16 ${highContrast ? 'text-red-400' : 'text-red-600'}`}>
            {error}
          </div>
        ) : proiecte.length === 0 ? (
          <div className={`text-center py-16 ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p>Nu există proiecte de decizii publicate în acest moment.</p>
            <p className="text-sm mt-2">Verificați mai târziu pentru actualizări.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`text-sm border-b-2 ${highContrast ? 'border-yellow-400 text-yellow-400' : 'border-gray-100 text-gray-500 bg-gray-50'}`}>
                  <th className="p-4 font-semibold">Nr.</th>
                  <th className="p-4 font-semibold">Data</th>
                  <th className="p-4 font-semibold">Titlu</th>
                  <th className="p-4 font-semibold">Format</th>
                  <th className="p-4 font-semibold text-right">Acțiuni</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {proiecte.map((proiect, index) => (
                  <tr
                    key={proiect.id}
                    className={`border-b group hover:bg-opacity-5 ${highContrast ? 'border-gray-800 hover:bg-white text-white' : 'border-gray-100 hover:bg-blue-50 text-gray-800'}`}
                  >
                    <td className="p-4 whitespace-nowrap font-mono">
                      {index + 1}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="flex items-center gap-1 text-xs">
                        <Calendar size={12} className="opacity-50" />
                        {formatDate(proiect.data_publicare)}
                      </span>
                    </td>
                    <td className="p-4 max-w-md">
                      <p className="font-medium">{proiect.titlu}</p>
                      {proiect.descriere && (
                        <p className={`text-xs mt-1 ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                          {proiect.descriere}
                        </p>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-2">
                        {getFileIcon(proiect.document)}
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          proiect.document.endsWith('.pdf')
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {getFileExtension(proiect.document)}
                        </span>
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <a
                          href={proiect.document_url}
                          target="_blank"
                          rel="noreferrer"
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-bold transition-colors ${highContrast ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                          title="Vizualizează"
                        >
                          <Eye size={14} />
                          Vezi
                        </a>
                        <a
                          href={proiect.document_url}
                          download
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-bold transition-colors ${highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-300' : 'bg-moldova-blue text-white hover:bg-blue-800'}`}
                          title="Descarcă"
                        >
                          <Download size={14} />
                          Descarcă
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className={`mt-6 p-4 rounded-lg ${highContrast ? 'bg-gray-800 border border-gray-700' : 'bg-blue-50 border border-blue-100'}`}>
          <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-blue-800'}`}>
            <strong>Aveți observații sau propuneri?</strong> Puteți trimite comentarii la adresa de email{' '}
            <a
              href="mailto:primaria.pociumbauti@gmail.com"
              className={`underline ${highContrast ? 'text-yellow-400' : 'text-blue-600'}`}
            >
              primaria.pociumbauti@gmail.com
            </a>
            {' '}sau la sediul Primăriei.
          </p>
        </div>
      </div>
    </div>
  );
};
