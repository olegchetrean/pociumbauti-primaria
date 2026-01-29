import React from 'react';
import { INSTITUTIONS, CULTURAL_EVENTS } from '../constants';
import { Building2, GraduationCap, Heart, Church, BookOpen, Music, Calendar, Phone, Mail, Clock, Users, MapPin } from 'lucide-react';

interface Props {
  highContrast: boolean;
}

const getIconForType = (tip: string) => {
  switch (tip) {
    case 'Administrație publică locală': return Building2;
    case 'Instituție de învățământ': return GraduationCap;
    case 'Instituție medicală': return Heart;
    case 'Lăcaș de cult': return Church;
    case 'Instituție culturală': return tip.includes('Bibliotecă') ? BookOpen : Music;
    default: return Building2;
  }
};

const getColorForType = (tip: string) => {
  switch (tip) {
    case 'Administrație publică locală': return 'blue';
    case 'Instituție de învățământ': return 'green';
    case 'Instituție medicală': return 'red';
    case 'Lăcaș de cult': return 'purple';
    case 'Instituție culturală': return 'amber';
    default: return 'gray';
  }
};

export const Institutions: React.FC<Props> = ({ highContrast }) => {
  const cardClass = `rounded-xl p-6 ${highContrast ? 'bg-gray-900 border border-yellow-400 text-white' : 'bg-white shadow-soft'}`;
  const headingClass = `text-2xl font-bold mb-4 ${highContrast ? 'text-yellow-400' : 'text-moldova-charcoal'}`;
  const subheadingClass = `text-lg font-semibold mb-3 ${highContrast ? 'text-yellow-300' : 'text-moldova-blue'}`;
  const textClass = highContrast ? 'text-gray-300' : 'text-moldova-steel';

  return (
    <div className={`min-h-screen ${highContrast ? 'bg-black' : 'bg-moldova-cloud'}`}>
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <img
          src="/uploads/photos/thumbs/cultura.jpg"
          alt="Instituții Pociumbăuți"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Instituții și Viață Culturală</h1>
            <p className="text-xl opacity-90">Școală, biserică, bibliotecă - inima comunității noastre</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-12">

        {/* Instituții Principale */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className={`p-3 rounded-full ${highContrast ? 'bg-yellow-400 text-black' : 'bg-moldova-blue text-white'}`}>
              <Building2 size={24} />
            </div>
            <h2 className={`text-3xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-charcoal'}`}>
              Instituții Publice
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {INSTITUTIONS.map((inst) => {
              const Icon = getIconForType(inst.tip);
              const color = getColorForType(inst.tip);
              const isClosed = inst.status === 'închis';

              return (
                <div
                  key={inst.id}
                  className={`${cardClass} ${isClosed ? 'opacity-60' : ''} relative overflow-hidden`}
                >
                  {isClosed && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      ÎNCHIS
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600 flex-shrink-0`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold mb-2 ${highContrast ? 'text-white' : 'text-moldova-charcoal'}`}>
                        {inst.nume}
                      </h3>
                      <span className={`inline-block px-2 py-1 rounded text-xs mb-3 ${highContrast ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                        {inst.tip}
                      </span>
                      <p className={`mb-4 ${textClass}`}>{inst.descriere}</p>

                      {/* Contact Info */}
                      <div className="space-y-2 text-sm">
                        {inst.adresa && (
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="opacity-70" />
                            <span className={textClass}>{inst.adresa}</span>
                          </div>
                        )}
                        {inst.telefon && (
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="opacity-70" />
                            <a href={`tel:${inst.telefon}`} className="hover:underline">{inst.telefon}</a>
                          </div>
                        )}
                        {inst.email && (
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="opacity-70" />
                            <a href={`mailto:${inst.email}`} className="hover:underline">{inst.email}</a>
                          </div>
                        )}
                        {inst.program && (
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="opacity-70" />
                            <span className={textClass}>{inst.program}</span>
                          </div>
                        )}
                        {inst.personal && (
                          <div className="flex items-center gap-2">
                            <Users size={14} className="opacity-70" />
                            <span className={textClass}>{inst.personal} angajați</span>
                          </div>
                        )}
                      </div>

                      {/* Detalii Suplimentare */}
                      {inst.detalii && (
                        <div className={`mt-4 p-3 rounded-lg ${highContrast ? 'bg-gray-800' : 'bg-gray-50'}`}>
                          {inst.detalii.elevi && (
                            <p className={`text-sm ${textClass}`}><strong>Elevi:</strong> {inst.detalii.elevi}</p>
                          )}
                          {inst.detalii.limbiPredare && (
                            <p className={`text-sm ${textClass}`}><strong>Limbi:</strong> {inst.detalii.limbiPredare}</p>
                          )}
                          {inst.detalii.volum && (
                            <p className={`text-sm ${textClass}`}><strong>Fond:</strong> {inst.detalii.volum}</p>
                          )}
                          {inst.detalii.enoriasi && (
                            <p className={`text-sm ${textClass}`}><strong>Enoriași:</strong> {inst.detalii.enoriasi}</p>
                          )}
                          {inst.detalii.ctitor && (
                            <p className={`text-sm ${textClass}`}><strong>Ctitor:</strong> {inst.detalii.ctitor}</p>
                          )}
                          {inst.detalii.constructie && (
                            <p className={`text-sm ${textClass}`}><strong>Construcție:</strong> {inst.detalii.constructie}</p>
                          )}
                          {inst.detalii.stil && (
                            <p className={`text-sm ${textClass}`}><strong>Stil:</strong> {inst.detalii.stil}</p>
                          )}
                          {inst.detalii.probleme && (
                            <p className={`text-sm text-red-500 mt-2`}><strong>Probleme:</strong> {inst.detalii.probleme}</p>
                          )}
                          {inst.detalii.activitati && Array.isArray(inst.detalii.activitati) && (
                            <div className="mt-2">
                              <p className="text-sm font-semibold">Activități:</p>
                              <ul className="text-sm list-disc list-inside">
                                {inst.detalii.activitati.map((act: string, idx: number) => (
                                  <li key={idx} className={textClass}>{act}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Biserica - Secțiune Specială */}
        <section className={`${cardClass} border-l-4 border-purple-500`}>
          <div className="flex items-center gap-3 mb-6">
            <Church className="text-purple-500" size={32} />
            <h2 className={`text-3xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-charcoal'}`}>
              Biserica "Sfinții Arhangheli Mihail și Gavriil"
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img
                src="/uploads/photos/thumbs/biserica1.jpg"
                alt="Biserica Sfinții Arhangheli Mihail și Gavriil"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div>
              <p className={`mb-4 leading-relaxed ${textClass}`}>
                Ctitorită în anul 1815 de către Vasile Stroescu, biserica din piatră în stil moldovenesc-bizantin
                reprezintă centrul spiritual al comunității Pociumbăuți de peste 200 de ani.
              </p>
              <p className={`mb-4 leading-relaxed ${textClass}`}>
                În perioada sovietică (1960-1989), biserica a fost închisă și folosită ca depozit.
                După redeschidere, a fost renovată în 1990 și 2010, fiind astăzi în stare funcțională
                și bine întreținută de comunitate.
              </p>
              <div className={`p-4 rounded-lg ${highContrast ? 'bg-gray-800' : 'bg-purple-50'}`}>
                <p className="font-semibold">Hramul Bisericii</p>
                <p className={textClass}>8 Noiembrie - Ziua Sfinților Arhangheli Mihail și Gavriil</p>
              </div>
            </div>
          </div>
        </section>

        {/* Evenimente Culturale */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className={`p-3 rounded-full ${highContrast ? 'bg-yellow-400 text-black' : 'bg-amber-500 text-white'}`}>
              <Calendar size={24} />
            </div>
            <h2 className={`text-3xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-charcoal'}`}>
              Evenimente Culturale și Tradiții
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CULTURAL_EVENTS.map((event) => (
              <div key={event.id} className={`${cardClass} hover:shadow-lg transition-shadow`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${event.traditie
                      ? (highContrast ? 'bg-yellow-400 text-black' : 'bg-amber-100 text-amber-700')
                      : (highContrast ? 'bg-blue-400 text-black' : 'bg-blue-100 text-blue-700')
                    }`}>
                    {event.traditie ? 'Tradiție' : 'Sărbătoare'}
                  </div>
                  <span className={`text-sm font-mono ${textClass}`}>{event.data}</span>
                </div>
                <h3 className={`text-xl font-bold mb-3 ${highContrast ? 'text-white' : 'text-moldova-charcoal'}`}>
                  {event.nume}
                </h3>
                <p className={textClass}>{event.descriere}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Hramul Satului - Featured */}
        <section className={`relative rounded-2xl overflow-hidden`}>
          <img
            src="/uploads/photos/thumbs/biserica2.jpg"
            alt="Hramul Satului"
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex items-center">
            <div className="p-8 md:p-12 max-w-2xl">
              <span className="inline-block px-3 py-1 bg-amber-500 text-black text-sm font-bold rounded mb-4">
                EVENIMENT PRINCIPAL
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Hramul Satului - 21 Noiembrie
              </h2>
              <p className="text-white/90 mb-6 leading-relaxed">
                Cea mai importantă sărbătoare a comunității Pociumbăuți coincide cu Ziua Sfântului
                Arhangheli Mihail și Gavriil, patronii bisericii noastre. Întreaga comunitate se reunește pentru
                liturghie specială, procesiune religioasă, masă comună în curtea bisericii și
                petrecere cu muzică populară și dansuri tradiționale.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-white/20 text-white rounded text-sm">Liturghie</span>
                <span className="px-3 py-1 bg-white/20 text-white rounded text-sm">Procesiune</span>
                <span className="px-3 py-1 bg-white/20 text-white rounded text-sm">Masă comună</span>
                <span className="px-3 py-1 bg-white/20 text-white rounded text-sm">Muzică populară</span>
              </div>
            </div>
          </div>
        </section>

        {/* Festival Nunta Moldovenească */}
        <section className={cardClass}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-pink-100 text-pink-700 text-sm font-bold rounded mb-4">
                FESTIVAL ANUAL
              </span>
              <h2 className={`text-3xl font-bold mb-4 ${highContrast ? 'text-yellow-400' : 'text-moldova-charcoal'}`}>
                Festival "Nunta Moldovenească"
              </h2>
              <p className={`mb-4 leading-relaxed ${textClass}`}>
                În fiecare august, Pociumbăuți găzduiește Festivalul "Nunta Moldovenească" - o
                reconstituire autentică a nunților tradiționale moldovenești.
              </p>
              <ul className={`space-y-2 ${textClass}`}>
                <li className="flex items-center gap-2">
                  <span className="text-pink-500">●</span>
                  Costume populare tradiționale
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-pink-500">●</span>
                  Hore și dansuri autentice
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-pink-500">●</span>
                  Cântece și muzică populară
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-pink-500">●</span>
                  Participanți din întregul raion
                </li>
              </ul>
            </div>
            <div>
              <img
                src="/uploads/photos/thumbs/nunta.jpg"
                alt="Festival Nunta Moldovenească"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
