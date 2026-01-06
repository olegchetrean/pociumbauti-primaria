import React, { useState, useEffect } from 'react';
import { ANNOUNCEMENTS } from '../constants';
import { ArrowRight, Calendar, FileText, MapPin, ChevronRight, AlertCircle, Phone, Clock } from 'lucide-react';
import { ViewState } from '../types';

interface HomeProps {
  setView: (view: ViewState) => void;
  highContrast: boolean;
}

const HERO_IMAGES = [
  "https://picsum.photos/1920/1080?random=1", // Wheat fields representation
  "https://picsum.photos/1920/1080?random=2", // Monument representation
  "https://picsum.photos/1920/1080?random=3"  // Village center representation
];

export const Home: React.FC<HomeProps> = ({ setView, highContrast }) => {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000); // 6s per slide
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`space-y-16 pb-12 ${highContrast ? 'bg-black' : 'bg-white'}`}>
      
      {/* HERO SECTION - "Pociumbăuți Greeting" */}
      <section className="relative h-[600px] md:h-[700px] w-full overflow-hidden bg-gray-900">
        {HERO_IMAGES.map((img, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${index === currentHeroIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <img 
              src={img} 
              alt={`Pociumbăuți peisaj ${index + 1}`} 
              className={`w-full h-full object-cover ${index === currentHeroIndex ? 'animate-ken-burns' : ''}`}
            />
          </div>
        ))}
        
        {/* Living Painting Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: highContrast 
              ? 'rgba(0,0,0,0.8)' 
              : 'linear-gradient(135deg, rgba(52,152,219,0.4) 0%, rgba(44,62,80,0.6) 100%)'
          }}
        ></div>
        
        {/* Gradient Veil for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">
          <div className="animate-fade-in-up max-w-4xl mx-auto">
            <h1 className={`text-4xl md:text-6xl font-bold mb-4 tracking-tight leading-tight drop-shadow-lg ${highContrast ? 'text-yellow-400' : 'text-white'}`} style={{ letterSpacing: '0.05em' }}>
              Bine ați venit în satul Pociumbăuți
            </h1>
            <p className={`text-xl md:text-2xl mb-12 tracking-widest uppercase font-light drop-shadow-md ${highContrast ? 'text-white' : 'text-white/90'}`} style={{ letterSpacing: '0.1em' }}>
              Raionul Rîșcani • Nordul Moldovei
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {/* Primary Button - Irina's Priority */}
              <button 
                onClick={() => setView('documents')}
                className={`group relative overflow-hidden px-8 py-3 rounded-md font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${highContrast ? 'bg-yellow-400 text-black' : 'bg-moldova-blue text-white shadow-soft'}`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <FileText size={20} />
                  Decizii și Dispoziții
                </span>
                <div className={`absolute inset-0 h-full w-full scale-0 rounded-md transition-all duration-300 group-hover:scale-100 group-hover:bg-blue-600/50`}></div>
              </button>

              {/* Secondary Button */}
              <button 
                onClick={() => setView('contact')}
                className={`px-8 py-3 rounded-md font-semibold text-lg border-2 transition-all duration-300 hover:bg-white/10 ${highContrast ? 'border-white text-white' : 'border-white text-white'}`}
              >
                Contact
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3">
          {HERO_IMAGES.map((_, idx) => (
            <div 
              key={idx} 
              className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentHeroIndex ? (highContrast ? 'bg-yellow-400 w-6' : 'bg-moldova-gold w-6') : 'bg-white/50'}`}
            />
          ))}
        </div>
      </section>

      <div className="container mx-auto px-4 relative z-20 -mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT COLUMN: Quick Links & Info (Glassmorphism) */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            <div className={`p-6 rounded-xl ${highContrast ? 'bg-gray-900 border border-yellow-400' : 'glass-card bg-white'}`}>
              <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>
                <AlertCircle size={20} /> Informații Rapide
              </h3>
              <div className={`space-y-4 text-sm ${highContrast ? 'text-gray-300' : 'text-moldova-steel'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${highContrast ? 'bg-yellow-400 text-black' : 'bg-moldova-cloud text-moldova-blue'}`}>
                     <Phone size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-xs uppercase tracking-wider text-gray-400">Telefon Urgență</p>
                    <p className="font-medium text-base">112</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${highContrast ? 'bg-yellow-400 text-black' : 'bg-moldova-cloud text-moldova-blue'}`}>
                     <Clock size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-xs uppercase tracking-wider text-gray-400">Program Primărie</p>
                    <p className="font-medium">08:00 - 17:00</p>
                  </div>
                </div>
              </div>
            </div>

             <div className={`p-6 rounded-xl ${highContrast ? 'bg-gray-900 border border-yellow-400' : 'bg-white shadow-soft'}`}>
               <h3 className={`font-bold text-lg mb-4 border-b pb-2 ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>
                 Meniu Rapid
               </h3>
               <ul className="space-y-1">
                 <li><button onClick={() => setView('documents')} className="w-full text-left py-2 px-3 rounded hover:bg-moldova-cloud flex justify-between items-center group transition-colors text-moldova-charcoal"><span>Decizii Consiliu</span> <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 text-moldova-blue" /></button></li>
                 <li><button onClick={() => setView('documents')} className="w-full text-left py-2 px-3 rounded hover:bg-moldova-cloud flex justify-between items-center group transition-colors text-moldova-charcoal"><span>Dispoziții Primar</span> <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 text-moldova-blue" /></button></li>
                 <li><button onClick={() => setView('administration')} className="w-full text-left py-2 px-3 rounded hover:bg-moldova-cloud flex justify-between items-center group transition-colors text-moldova-charcoal"><span>Organigrama</span> <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 text-moldova-blue" /></button></li>
                 <li><button onClick={() => setView('history')} className="w-full text-left py-2 px-3 rounded hover:bg-moldova-cloud flex justify-between items-center group transition-colors text-moldova-charcoal"><span>Istoric</span> <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 text-moldova-blue" /></button></li>
               </ul>
             </div>
          </div>

          {/* MIDDLE COLUMN: Mayor's Greeting "Voice of Leadership" - Reordered for Mobile flow usually, but keeping layout */}
          <div className="lg:col-span-2">
            
            {/* Mayor Card */}
            <div className={`relative mb-12 rounded-lg p-8 md:p-10 transition-transform duration-300 hover:-translate-y-1 ${highContrast ? 'bg-gray-900 border-l-4 border-yellow-400' : 'bg-white shadow-soft border-l-4 border-moldova-blue'}`}>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                 <div className="flex-shrink-0 relative group">
                    <div className={`absolute inset-0 rounded-full blur opacity-40 group-hover:opacity-70 transition-opacity duration-500 ${highContrast ? 'bg-yellow-400' : 'bg-moldova-blue'}`}></div>
                    <img 
                      src="https://picsum.photos/400/400?random=mayor" 
                      alt="Primar Lorentii Lisevici" 
                      className={`relative w-32 h-32 rounded-full object-cover border-4 shadow-lg ${highContrast ? 'border-yellow-400' : 'border-moldova-blue'}`}
                    />
                 </div>
                 <div className="flex-1 text-center md:text-left">
                    <span className="absolute top-6 left-8 text-6xl opacity-10 font-serif text-moldova-blue">"</span>
                    <h2 className={`text-2xl font-bold mb-1 ${highContrast ? 'text-yellow-400' : 'text-moldova-charcoal'}`}>Lorentii Lisevici</h2>
                    <p className={`text-sm font-medium mb-6 ${highContrast ? 'text-gray-400' : 'text-moldova-steel'}`}>Primarul satul Pociumbăuți</p>
                    
                    <p className={`text-lg italic font-serif leading-relaxed mb-6 ${highContrast ? 'text-gray-200' : 'text-moldova-charcoal'}`}>
                      Bine ați venit pe pagina oficială a Primăriei Pociumbăuți. 
                      Ne dedicăm transparenței, dezvoltării comunității și 
                      păstrării valorilor care ne definesc ca sat.
                    </p>

                    <button 
                      onClick={() => setView('contact')}
                      className={`inline-flex items-center px-6 py-2 rounded-md border transition-colors ${highContrast ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black' : 'border-moldova-cloud bg-moldova-cloud text-moldova-blue hover:bg-moldova-blue hover:text-white'}`}
                    >
                      Contactează Primarul
                    </button>
                 </div>
              </div>
            </div>

            {/* ANNOUNCEMENT CARDS - "Community Pulse" */}
            <div className="mb-8 flex justify-between items-end">
               <h2 className={`text-2xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-charcoal'}`}>Pulsul Comunității</h2>
               <button className={`text-sm font-semibold hover:underline ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>Vezi toate noutățile</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ANNOUNCEMENTS.map((item) => (
                <article 
                  key={item.id} 
                  className={`flex flex-col h-full rounded-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-hover ${highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-soft'}`}
                >
                  <div className="mb-4">
                     <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white ${
                        item.categorie === 'urgenta' ? 'bg-moldova-red' : 
                        (item.categorie === 'sedinta' || item.categorie === 'info' || item.categorie === 'achizitie') ? 'bg-moldova-blue' : 
                        'bg-moldova-gold text-moldova-charcoal'
                      }`}>
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

                  <button className={`text-sm font-bold flex items-center gap-1 mt-auto transition-transform hover:translate-x-1 ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>
                    Citește mai mult <ArrowRight size={14} />
                  </button>
                </article>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* FULL WIDTH CARDS - Transparency & Services */}
      <section className={`py-16 ${highContrast ? 'bg-gray-900' : 'bg-moldova-cloud'}`}>
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className={`p-8 rounded-xl text-center transition-all hover:-translate-y-2 ${highContrast ? 'bg-black border border-yellow-400' : 'bg-white shadow-soft'}`}>
                 <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-moldova-blue">
                    <FileText size={32} />
                 </div>
                 <h3 className={`text-xl font-bold mb-3 ${highContrast ? 'text-white' : 'text-moldova-charcoal'}`}>Transparență</h3>
                 <p className={`text-sm mb-6 ${highContrast ? 'text-gray-400' : 'text-moldova-steel'}`}>Acces la decizii, buget și rapoarte de activitate.</p>
                 <a href="https://actelocale.gov.md" target="_blank" rel="noreferrer" className={`text-sm font-bold hover:underline ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>Vezi Registrul de Stat &rarr;</a>
              </div>

              <div className={`p-8 rounded-xl text-center transition-all hover:-translate-y-2 ${highContrast ? 'bg-black border border-yellow-400' : 'bg-white shadow-soft'}`}>
                 <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-moldova-blue">
                    <MapPin size={32} />
                 </div>
                 <h3 className={`text-xl font-bold mb-3 ${highContrast ? 'text-white' : 'text-moldova-charcoal'}`}>Servicii Online</h3>
                 <p className={`text-sm mb-6 ${highContrast ? 'text-gray-400' : 'text-moldova-steel'}`}>Solicită acte și certificate prin portalul guvernamental.</p>
                 <a href="https://servicii.gov.md" target="_blank" rel="noreferrer" className={`text-sm font-bold hover:underline ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>Accesează Portalul &rarr;</a>
              </div>

              <div className={`p-8 rounded-xl text-center transition-all hover:-translate-y-2 ${highContrast ? 'bg-black border border-yellow-400' : 'bg-white shadow-soft'}`}>
                 <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-moldova-blue">
                    <AlertCircle size={32} />
                 </div>
                 <h3 className={`text-xl font-bold mb-3 ${highContrast ? 'text-white' : 'text-moldova-charcoal'}`}>Semnalează o Problemă</h3>
                 <p className={`text-sm mb-6 ${highContrast ? 'text-gray-400' : 'text-moldova-steel'}`}>Ai observat o neregulă în sat? Trimite o petiție online.</p>
                 <button onClick={() => setView('contact')} className={`text-sm font-bold hover:underline ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>Scrie Petiție &rarr;</button>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};