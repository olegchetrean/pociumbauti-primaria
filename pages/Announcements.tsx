import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { Announcement } from '../types';
import { ViewState } from '../types';

interface Props {
  highContrast: boolean;
  setView: (view: ViewState) => void;
}

export const Announcements: React.FC<Props> = ({ highContrast, setView }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/announcements?limit=100');
        if (!response.ok) {
          throw new Error('Failed to fetch announcements');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          // Explicitly sort by date (newest first), then by ID (highest first)
          // This ensures correct order even if API returns data in wrong order
          const sorted = [...data].sort((a, b) => {
            const dateA = new Date(a.data_publicare).getTime();
            const dateB = new Date(b.data_publicare).getTime();
            if (dateB !== dateA) {
              return dateB - dateA; // Newer dates first
            }
            return b.id - a.id; // Higher ID first if dates are equal
          });
          setAnnouncements(sorted);
        } else {
          setAnnouncements([]);
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleAnnouncementClick = (id: number) => {
    window.history.pushState({}, '', `/anunt/${id}`);
    window.location.reload();
  };

  return (
    <div className={`min-h-screen py-12 ${highContrast ? 'bg-black text-white' : 'bg-moldova-cloud'}`}>
      <div className="container mx-auto px-4">
        <button
          onClick={() => {
            window.history.replaceState({}, '', '/');
            setView('home');
          }}
          className={`mb-6 flex items-center gap-2 ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}
        >
          <ArrowLeft size={18} />
          Înapoi la Acasă
        </button>

        <h1 className={`text-4xl font-bold mb-8 ${highContrast ? 'text-yellow-400' : 'text-moldova-charcoal'}`}>
          Toate Anunțurile
        </h1>

        {loading ? (
          <div className="text-center py-12">
            <p className={`${highContrast ? 'text-gray-400' : 'text-moldova-steel'}`}>Se încarcă anunțurile...</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-12">
            <p className={`${highContrast ? 'text-gray-400' : 'text-moldova-steel'}`}>Nu există anunțuri disponibile momentan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {announcements.map((item) => (
              <article
                key={item.id}
                onClick={() => handleAnnouncementClick(item.id)}
                className={`flex flex-col h-full rounded-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-hover cursor-pointer ${
                  highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-soft'
                }`}
              >
                {item.imagine_url && (
                  <div className="mb-4 -mx-6 -mt-6">
                    <img
                      src={item.imagine_url}
                      alt={item.titlu}
                      className="w-full h-48 object-cover rounded-t-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <div className="mb-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white ${
                      item.categorie === 'urgenta'
                        ? 'bg-moldova-red'
                        : item.categorie === 'sedinta' || item.categorie === 'info' || item.categorie === 'achizitie'
                        ? 'bg-moldova-blue'
                        : 'bg-moldova-gold text-moldova-charcoal'
                    }`}
                  >
                    {item.categorie}
                  </span>
                </div>

                <h3 className={`text-xl font-bold mb-3 leading-snug line-clamp-2 ${highContrast ? 'text-white' : 'text-moldova-charcoal'}`}>
                  {item.titlu}
                </h3>

                <div className={`flex items-center gap-2 text-sm mb-4 ${highContrast ? 'text-gray-400' : 'text-moldova-steel'}`}>
                  <Calendar size={14} />
                  <span>{item.data_publicare}</span>
                </div>

                <p className={`text-sm leading-relaxed line-clamp-3 mb-6 flex-grow ${highContrast ? 'text-gray-300' : 'text-moldova-steel'}`}>
                  {item.continut_scurt}
                </p>

                <button
                  className={`text-sm font-bold flex items-center gap-1 mt-auto transition-transform hover:translate-x-1 ${
                    highContrast ? 'text-yellow-400' : 'text-moldova-blue'
                  }`}
                >
                  Citește mai mult <ArrowRight size={14} />
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

