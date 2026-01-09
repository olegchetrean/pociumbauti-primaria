import React, { useState } from 'react';
import { HISTORY_EVENTS, OFFICIAL_SYMBOLS } from '../constants';
import { Clock, Flag, Award, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  highContrast: boolean;
}

const PERIOD_COLORS: Record<string, string> = {
  'Întemeiere': '#8B4513',
  'Imperiul Rus': '#4A90D9',
  'România Mare': '#FFD700',
  'Epoca Sovietică': '#C41E3A',
  'Independența': '#3498db',
  'Epoca Modernă': '#27ae60'
};

export const History: React.FC<Props> = ({ highContrast }) => {
  const [expandedPeriod, setExpandedPeriod] = useState<string | null>(null);

  const cardClass = `rounded-xl p-6 ${highContrast ? 'bg-gray-900 border border-yellow-400 text-white' : 'bg-white shadow-soft'}`;
  const textClass = highContrast ? 'text-gray-300' : 'text-moldova-steel';

  // Group events by period
  const eventsByPeriod = HISTORY_EVENTS.reduce((acc, event) => {
    if (!acc[event.period]) {
      acc[event.period] = [];
    }
    acc[event.period].push(event);
    return acc;
  }, {} as Record<string, typeof HISTORY_EVENTS>);

  const periods = Object.keys(eventsByPeriod);

  return (
    <div className={`min-h-screen ${highContrast ? 'bg-black' : 'bg-moldova-cloud'}`}>
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <img
          src="https://picsum.photos/1920/800?random=historic"
          alt="Istorie Pociumbăuți"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Istoric și Identitate</h1>
            <p className="text-2xl opacity-90 mb-4">
              Pociumbăuți: <span className="text-yellow-400 font-bold">255 ani</span> de istorie, tradiție și reziliență
            </p>
            <p className="text-lg opacity-80">
              De la prima atestare documentară în 1711 până în prezent - o comunitate mândră de rădăcinile sale.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-16">

        {/* Monument Section - Featured */}
        <section className={`rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row ${highContrast ? 'bg-gray-900 border-2 border-yellow-400' : 'bg-white'}`}>
          <div className="md:w-1/2 relative min-h-[400px]">
            <img
              src="https://picsum.photos/800/800?random=monument"
              alt="Monumentul Eroilor"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
              <div className="text-white">
                <span className="bg-moldova-red px-3 py-1 text-xs font-bold uppercase rounded mb-2 inline-block">
                  Proiect Major 2025
                </span>
                <h3 className="text-2xl font-bold">Monumentul Eroilor (1938-2025)</h3>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <h2 className={`text-3xl font-bold mb-6 ${highContrast ? 'text-white' : 'text-moldova-blue'}`}>
              Renașterea Memoriei
            </h2>
            <p className={`mb-4 leading-relaxed ${textClass}`}>
              În <strong>1938</strong>, Căminul Cultural "Regina Maria" a ridicat un monument dedicat eroilor
              din Primul Război Mondial - aproximativ <strong>40-50 soldați</strong> din Pociumbăuți care
              și-au dat viața pentru țară.
            </p>
            <p className={`mb-4 leading-relaxed ${textClass}`}>
              Distrus în perioada sovietică, piatra decorativă originală a fost păstrată eroic de
              <strong> Aurica Dumbravă</strong> timp de <strong>40 de ani</strong>.
            </p>
            <p className={`mb-6 leading-relaxed ${textClass}`}>
              Pe <strong className="text-moldova-red">18 iulie 2025</strong>, într-un parteneriat istoric
              între Primărie și Asociația "Monumentum", va fi inaugurat monumentul reconstruit fidel
              după planurile originale din 1938.
            </p>
            <div className={`p-4 rounded-lg border-l-4 ${highContrast ? 'bg-gray-800 border-yellow-400' : 'bg-blue-50 border-moldova-blue'}`}>
              <p className="font-serif italic">
                "Un popor care nu-și cunoaște istoria este ca un copil care nu-și cunoaște părinții."
              </p>
            </div>
          </div>
        </section>

        {/* Simboluri Oficiale */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className={`p-3 rounded-full ${highContrast ? 'bg-yellow-400 text-black' : 'bg-moldova-blue text-white'}`}>
              <Flag size={24} />
            </div>
            <h2 className={`text-3xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-charcoal'}`}>
              Simboluri Oficiale
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stema */}
            <div className={cardClass}>
              <div className="flex items-center gap-3 mb-4">
                <Award className="text-amber-500" size={32} />
                <h3 className={`text-2xl font-bold ${highContrast ? 'text-white' : 'text-moldova-charcoal'}`}>
                  Stema Satul
                </h3>
              </div>
              <p className={`mb-4 ${textClass}`}>{OFFICIAL_SYMBOLS.stema.descriere}</p>
              <div className="flex gap-2 mb-4">
                {OFFICIAL_SYMBOLS.stema.culori.map((culoare, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded-full text-sm ${idx === 0 ? 'bg-blue-100 text-blue-700' :
                        idx === 1 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                      }`}
                  >
                    {culoare}
                  </span>
                ))}
              </div>
              <p className={`text-sm ${textClass}`}>
                <strong>Aprobare:</strong> {OFFICIAL_SYMBOLS.stema.aprobare}
              </p>
              <p className={`text-sm ${textClass}`}>
                <strong>Semnificație:</strong> {OFFICIAL_SYMBOLS.stema.semnificatie}
              </p>
            </div>

            {/* Drapel */}
            <div className={cardClass}>
              <div className="flex items-center gap-3 mb-4">
                <Flag className="text-moldova-blue" size={32} />
                <h3 className={`text-2xl font-bold ${highContrast ? 'text-white' : 'text-moldova-charcoal'}`}>
                  Drapelul Satul
                </h3>
              </div>
              <p className={`mb-4 ${textClass}`}>{OFFICIAL_SYMBOLS.drapel.descriere}</p>
              <div className="flex gap-2 mb-4">
                {OFFICIAL_SYMBOLS.drapel.culori.map((culoare, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded-full text-sm ${idx === 0 ? 'bg-blue-100 text-blue-700' :
                        idx === 1 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                      }`}
                  >
                    {culoare}
                  </span>
                ))}
              </div>
              <p className={`text-sm ${textClass}`}>
                <strong>Aprobare:</strong> {OFFICIAL_SYMBOLS.drapel.aprobare}
              </p>
            </div>
          </div>

          {/* Motto */}
          <div className={`${cardClass} mt-6 text-center`}>
            <p className={`text-2xl font-serif italic ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>
              "{OFFICIAL_SYMBOLS.motto}"
            </p>
          </div>
        </section>

        {/* Timeline by Period */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className={`p-3 rounded-full ${highContrast ? 'bg-yellow-400 text-black' : 'bg-amber-500 text-white'}`}>
              <Clock size={24} />
            </div>
            <h2 className={`text-3xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-charcoal'}`}>
              Cronologia Localității (1711-2025)
            </h2>
          </div>

          {/* Period Legend */}
          <div className="flex flex-wrap gap-3 mb-8">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => setExpandedPeriod(expandedPeriod === period ? null : period)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${expandedPeriod === period
                    ? 'ring-2 ring-offset-2 ring-gray-400'
                    : 'hover:opacity-80'
                  }`}
                style={{
                  backgroundColor: PERIOD_COLORS[period] || '#666',
                  color: ['România Mare', 'Epoca Modernă'].includes(period) ? '#000' : '#fff'
                }}
              >
                {period} ({eventsByPeriod[period].length})
              </button>
            ))}
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className={`absolute left-4 md:left-1/2 top-0 bottom-0 w-1 ${highContrast ? 'bg-yellow-400' : 'bg-gray-300'}`} />

            {/* Events */}
            <div className="space-y-8">
              {HISTORY_EVENTS.map((event, idx) => {
                const isExpanded = expandedPeriod === null || expandedPeriod === event.period;
                const isLeft = idx % 2 === 0;

                return (
                  <div
                    key={idx}
                    className={`relative transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-30 scale-95'}`}
                  >
                    {/* Year Marker */}
                    <div
                      className={`absolute left-0 md:left-1/2 w-8 h-8 rounded-full border-4 border-white transform md:-translate-x-1/2 z-10 flex items-center justify-center text-xs font-bold text-white`}
                      style={{ backgroundColor: PERIOD_COLORS[event.period] || '#666' }}
                    >
                      {event.important && '★'}
                    </div>

                    {/* Content Card */}
                    <div className={`ml-12 md:ml-0 ${isLeft ? 'md:mr-[52%] md:pr-8' : 'md:ml-[52%] md:pl-8'}`}>
                      <div
                        className={`${cardClass} ${event.important ? 'ring-2 ring-amber-400' : ''}`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <span
                            className="text-sm font-bold px-2 py-1 rounded"
                            style={{
                              backgroundColor: PERIOD_COLORS[event.period] || '#666',
                              color: ['România Mare', 'Epoca Modernă'].includes(event.period) ? '#000' : '#fff'
                            }}
                          >
                            {event.year}
                          </span>
                          <span className={`text-xs ${textClass}`}>{event.period}</span>
                        </div>
                        <h3 className={`text-xl font-bold mb-2 ${highContrast ? 'text-white' : 'text-moldova-charcoal'}`}>
                          {event.title}
                        </h3>
                        <p className={textClass}>{event.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`${cardClass} text-center`}>
            <p className={`text-4xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>255</p>
            <p className={textClass}>Ani de istorie</p>
          </div>
          <div className={`${cardClass} text-center`}>
            <p className={`text-4xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>1711</p>
            <p className={textClass}>Prima atestare</p>
          </div>
          <div className={`${cardClass} text-center`}>
            <p className={`text-4xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>1815</p>
            <p className={textClass}>Biserica ctitorită</p>
          </div>
          <div className={`${cardClass} text-center`}>
            <p className={`text-4xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>952</p>
            <p className={textClass}>Vârf populație (1930)</p>
          </div>
        </section>

        {/* Eroii WWI */}
        <section className={`${cardClass} border-l-4 border-moldova-red`}>
          <h2 className={`text-2xl font-bold mb-4 ${highContrast ? 'text-yellow-400' : 'text-moldova-charcoal'}`}>
            Eroii din Primul Război Mondial
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className={`mb-4 leading-relaxed ${textClass}`}>
                Aproximativ <strong>150 de bărbați</strong> din Pociumbăuți au fost mobilizați în
                armata țaristă în Primul Război Mondial (1914-1918).
              </p>
              <p className={`mb-4 leading-relaxed ${textClass}`}>
                Din aceștia, <strong>40-50 soldați</strong> au căzut sau au dispărut pe fronturile
                est-europene din Germania și Austria-Ungaria.
              </p>
              <p className={textClass}>
                Monumentul ridicat în 1938 de Căminul Cultural "Regina Maria" le-a comemorat
                sacrificiul, iar reconstrucția din 2025 readuce memoria lor în centrul comunității.
              </p>
            </div>
            <div className={`p-6 rounded-lg ${highContrast ? 'bg-gray-800' : 'bg-red-50'}`}>
              <p className="text-center font-serif text-lg italic mb-4">
                "Celor care au dat viața pentru libertate"
              </p>
              <p className="text-center font-bold text-xl">1914 - 1918</p>
              <div className="mt-4 text-center">
                <span className={`text-sm ${textClass}`}>
                  Inscripție de pe Monumentul Eroilor
                </span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
