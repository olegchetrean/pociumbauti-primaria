import React, { useState, useEffect } from 'react';
import { Camera, Image, X, ChevronLeft, ChevronRight, Filter, Folder } from 'lucide-react';
import { PhotoAlbum, AlbumCategory } from '../types';

interface Props {
  highContrast: boolean;
}

const CATEGORY_LABELS: Record<AlbumCategory, string> = {
  evenimente: 'Evenimente',
  sarbatori: 'Sărbători',
  proiecte: 'Proiecte',
  sat: 'Satul Nostru',
  cultura: 'Cultură',
  sport: 'Sport',
  altele: 'Altele'
};

const CATEGORY_COLORS: Record<AlbumCategory, string> = {
  evenimente: 'bg-blue-100 text-blue-800',
  sarbatori: 'bg-red-100 text-red-800',
  proiecte: 'bg-green-100 text-green-800',
  sat: 'bg-amber-100 text-amber-800',
  cultura: 'bg-purple-100 text-purple-800',
  sport: 'bg-orange-100 text-orange-800',
  altele: 'bg-gray-100 text-gray-800'
};

interface PhotoData {
  id: number;
  filename: string;
  url: string;
  titlu?: string;
  descriere?: string;
}

export const Gallery: React.FC<Props> = ({ highContrast }) => {
  const [albums, setAlbums] = useState<PhotoAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState<PhotoAlbum | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<PhotoData[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [filterCategory, setFilterCategory] = useState<AlbumCategory | 'all'>('all');

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const res = await fetch('/api/gallery/albums');
      if (res.ok) {
        const data = await res.json();
        setAlbums(data);
      }
    } catch (error) {
      console.error('Error fetching albums:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAlbum = async (album: PhotoAlbum) => {
    setSelectedAlbum(album);
    try {
      const res = await fetch(`/api/gallery/albums/${album.id}`);
      if (res.ok) {
        const data = await res.json();
        setAlbumPhotos(data.photos);
      }
    } catch (error) {
      console.error('Error fetching album photos:', error);
    }
  };

  const closeAlbum = () => {
    setSelectedAlbum(null);
    setAlbumPhotos([]);
  };

  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % albumPhotos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + albumPhotos.length) % albumPhotos.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, albumPhotos.length]);

  const filteredAlbums = filterCategory === 'all' 
    ? albums 
    : albums.filter(a => a.categorie === filterCategory);

  const categories = Array.from(new Set(albums.map(a => a.categorie)));

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-moldova-blue mx-auto"></div>
        <p className="mt-4 text-gray-500">Se încarcă galeria...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className={`text-3xl font-bold mb-4 flex items-center justify-center gap-3 ${highContrast ? 'text-yellow-400' : 'text-gray-900'}`}>
          <Camera size={32} />
          Galerie Foto
        </h1>
        <p className={`max-w-2xl mx-auto ${highContrast ? 'text-white' : 'text-gray-600'}`}>
          Momente importante din viața satului Pociumbăuți - evenimente culturale, sărbători, 
          proiecte comunitare și frumusețea locurilor noastre.
        </p>
      </div>

      {/* Album View */}
      {selectedAlbum ? (
        <div>
          {/* Album Header */}
          <div className="mb-6">
            <button
              onClick={closeAlbum}
              className={`flex items-center gap-2 mb-4 px-4 py-2 rounded-lg transition-colors ${
                highContrast 
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ChevronLeft size={20} />
              Înapoi la albume
            </button>
            
            <h2 className={`text-2xl font-bold mb-2 ${highContrast ? 'text-white' : 'text-gray-900'}`}>
              {selectedAlbum.titlu}
            </h2>
            {selectedAlbum.descriere && (
              <p className={highContrast ? 'text-gray-300' : 'text-gray-600'}>
                {selectedAlbum.descriere}
              </p>
            )}
            <div className="flex items-center gap-4 mt-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${CATEGORY_COLORS[selectedAlbum.categorie]}`}>
                {CATEGORY_LABELS[selectedAlbum.categorie]}
              </span>
              <span className={`text-sm ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                {albumPhotos.length} fotografii
              </span>
            </div>
          </div>

          {/* Photo Grid */}
          {albumPhotos.length === 0 ? (
            <div className={`text-center py-16 rounded-lg border-2 border-dashed ${
              highContrast ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'
            }`}>
              <Image size={48} className="mx-auto mb-4 opacity-50" />
              <p>Acest album nu conține încă fotografii.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {albumPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  onClick={() => openLightbox(index)}
                  className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                >
                  <img
                    src={photo.url}
                    alt={photo.titlu || `Fotografie ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/90 rounded-full p-3">
                        <Image size={24} className="text-gray-800" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Category Filter */}
          {categories.length > 1 && (
            <div className="mb-8 flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  filterCategory === 'all'
                    ? (highContrast ? 'bg-yellow-400 text-black' : 'bg-moldova-blue text-white')
                    : (highContrast ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                }`}
              >
                <Filter size={16} />
                Toate ({albums.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filterCategory === cat
                      ? (highContrast ? 'bg-yellow-400 text-black' : 'bg-moldova-blue text-white')
                      : (highContrast ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                  }`}
                >
                  {CATEGORY_LABELS[cat]} ({albums.filter(a => a.categorie === cat).length})
                </button>
              ))}
            </div>
          )}

          {/* Albums Grid */}
          {filteredAlbums.length === 0 ? (
            <div className={`text-center py-16 rounded-lg border-2 border-dashed ${
              highContrast ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'
            }`}>
              <Folder size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Nu există albume încă</p>
              <p className="text-sm">Albumele foto vor apărea aici în curând.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAlbums.map((album) => (
                <div
                  key={album.id}
                  onClick={() => openAlbum(album)}
                  className={`rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                    highContrast 
                      ? 'bg-gray-900 border border-gray-700 hover:border-yellow-400' 
                      : 'bg-white shadow-md hover:shadow-xl'
                  }`}
                >
                  {/* Cover Image */}
                  <div className="relative aspect-[4/3] bg-gray-200">
                    {album.cover_photo ? (
                      <img
                        src={album.cover_photo}
                        alt={album.titlu}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${
                        highContrast ? 'bg-gray-800' : 'bg-gradient-to-br from-gray-100 to-gray-200'
                      }`}>
                        <Camera size={48} className={highContrast ? 'text-gray-600' : 'text-gray-400'} />
                      </div>
                    )}
                    
                    {/* Photo count badge */}
                    <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Image size={12} />
                      {album.photos_count}
                    </div>
                    
                    {/* Category badge */}
                    <div className="absolute bottom-3 left-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${CATEGORY_COLORS[album.categorie]}`}>
                        {CATEGORY_LABELS[album.categorie]}
                      </span>
                    </div>
                  </div>

                  {/* Album Info */}
                  <div className="p-4">
                    <h3 className={`font-bold text-lg mb-1 line-clamp-1 ${highContrast ? 'text-white' : 'text-gray-900'}`}>
                      {album.titlu}
                    </h3>
                    {album.descriere && (
                      <p className={`text-sm line-clamp-2 ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                        {album.descriere}
                      </p>
                    )}
                    <p className={`text-xs mt-2 ${highContrast ? 'text-gray-500' : 'text-gray-400'}`}>
                      {new Date(album.data_creare).toLocaleDateString('ro-RO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Lightbox */}
      {lightboxOpen && albumPhotos.length > 0 && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 z-10"
          >
            <X size={32} />
          </button>

          {/* Navigation */}
          {albumPhotos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          {/* Image */}
          <div 
            className="max-w-[90vw] max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={albumPhotos[currentPhotoIndex].url}
              alt={albumPhotos[currentPhotoIndex].titlu || `Fotografie ${currentPhotoIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain"
            />
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-black/50 px-4 py-2 rounded-full">
            {currentPhotoIndex + 1} / {albumPhotos.length}
          </div>

          {/* Photo title */}
          {albumPhotos[currentPhotoIndex].titlu && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white text-center max-w-md">
              <p className="font-medium">{albumPhotos[currentPhotoIndex].titlu}</p>
              {albumPhotos[currentPhotoIndex].descriere && (
                <p className="text-sm text-white/70 mt-1">{albumPhotos[currentPhotoIndex].descriere}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

