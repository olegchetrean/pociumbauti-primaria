import React, { useState, useEffect } from 'react';
import { Calendar, ArrowLeft, FileText } from 'lucide-react';
import { ViewState } from '../types';

interface Props {
  highContrast: boolean;
  setView: (view: ViewState) => void;
  announcementId: number;
}

interface AnnouncementDetail {
  id: number;
  titlu: string;
  categorie: string;
  data_publicare: string;
  continut: string;
  continut_scurt: string;
  imagine_url: string | null;
  document: string | null;
  prioritate: boolean;
  views: number;
}

export const AnnouncementDetail: React.FC<Props> = ({ highContrast, setView, announcementId }) => {
  const [announcement, setAnnouncement] = useState<AnnouncementDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/announcements/${announcementId}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Anunțul nu a fost găsit');
          } else {
            throw new Error('Failed to fetch announcement');
          }
          return;
        }
        const data = await response.json();
        setAnnouncement(data);
      } catch (error) {
        console.error('Error fetching announcement:', error);
        setError('Eroare la încărcarea anunțului');
      } finally {
        setLoading(false);
      }
    };

    if (announcementId) {
      fetchAnnouncement();
    }
  }, [announcementId]);

  if (loading) {
    return (
      <div className={`min-h-screen py-12 ${highContrast ? 'bg-black text-white' : 'bg-moldova-cloud'}`}>
        <div className="container mx-auto px-4">
          <p className={`text-center ${highContrast ? 'text-gray-400' : 'text-moldova-steel'}`}>Se încarcă anunțul...</p>
        </div>
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div className={`min-h-screen py-12 ${highContrast ? 'bg-black text-white' : 'bg-moldova-cloud'}`}>
        <div className="container mx-auto px-4">
          <button
            onClick={() => window.location.href = '/'}
            className={`mb-6 flex items-center gap-2 ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}
          >
            <ArrowLeft size={18} />
            Înapoi
          </button>
          <div className="text-center py-12">
            <p className={`${highContrast ? 'text-red-400' : 'text-red-600'}`}>{error || 'Anunțul nu a fost găsit'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-12 ${highContrast ? 'bg-black text-white' : 'bg-moldova-cloud'}`}>
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={() => {
            window.history.replaceState({}, '', '/');
            setView('home');
          }}
          className={`mb-6 flex items-center gap-2 ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}
        >
          <ArrowLeft size={18} />
          Înapoi
        </button>

        <article className={`rounded-lg p-8 ${highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-lg'}`}>
          <div className="mb-6">
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider text-white ${
                announcement.categorie === 'urgenta'
                  ? 'bg-moldova-red'
                  : announcement.categorie === 'sedinta' || announcement.categorie === 'info' || announcement.categorie === 'achizitie'
                  ? 'bg-moldova-blue'
                  : 'bg-moldova-gold text-moldova-charcoal'
              }`}
            >
              {announcement.categorie}
            </span>
          </div>

          <h1 className={`text-3xl md:text-4xl font-bold mb-6 ${highContrast ? 'text-white' : 'text-moldova-charcoal'}`}>
            {announcement.titlu}
          </h1>

          <div className={`flex items-center gap-2 text-sm mb-6 ${highContrast ? 'text-gray-400' : 'text-moldova-steel'}`}>
            <Calendar size={16} />
            <span>{announcement.data_publicare}</span>
            {announcement.views > 0 && (
              <>
                <span className="mx-2">•</span>
                <span>{announcement.views} vizualizări</span>
              </>
            )}
          </div>

          {announcement.imagine_url && (
            <div className="mb-6">
              <img
                src={announcement.imagine_url}
                alt={announcement.titlu}
                className="w-full h-auto rounded-lg object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          <div
            className={`prose prose-lg max-w-none mb-6 ${highContrast ? 'text-gray-300' : 'text-moldova-charcoal'}`}
            dangerouslySetInnerHTML={{ __html: announcement.continut.replace(/\n/g, '<br />') }}
          />

          {announcement.document && (
            <div className={`mt-6 p-4 rounded-lg ${highContrast ? 'bg-gray-800 border border-gray-700' : 'bg-moldova-cloud'}`}>
              <a
                href={`/uploads/documents/${announcement.document}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}
              >
                <FileText size={20} />
                <span className="font-semibold">Descarcă document</span>
              </a>
            </div>
          )}
        </article>
      </div>
    </div>
  );
};

