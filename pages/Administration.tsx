import React from 'react';
import { STAFF, COUNCIL_MEMBERS, COUNCIL_COMPOSITION, OFFICIAL_SYMBOLS } from '../constants';
import { Phone, Mail, Users, Award, Flag, Calendar, Building2, UserCheck } from 'lucide-react';

interface Props { highContrast: boolean; }

export const Administration: React.FC<Props> = ({ highContrast }) => {
  const cardClass = `rounded-xl p-6 ${highContrast ? 'bg-gray-900 border border-yellow-400 text-white' : 'bg-white shadow-soft'}`;
  const headingClass = `text-2xl font-bold mb-4 ${highContrast ? 'text-yellow-400' : 'text-moldova-charcoal'}`;
  const textClass = highContrast ? 'text-gray-300' : 'text-moldova-steel';

  return (
    <div className={`min-h-screen ${highContrast ? 'bg-black' : 'bg-moldova-cloud'}`}>
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <img
          src="/uploads/photos/thumbs/gerb.jpg"
          alt="Administrația Pociumbăuți"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Administrația Satul</h1>
            <p className="text-xl opacity-90">Conducerea aleasă democratic, în slujba comunității</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-12">

        {/* Conducerea Primăriei */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className={`p-3 rounded-full ${highContrast ? 'bg-yellow-400 text-black' : 'bg-moldova-blue text-white'}`}>
              <Building2 size={24} />
            </div>
            <h2 className={`text-3xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-charcoal'}`}>
              Conducerea Primăriei
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {STAFF.map((person) => (
              <div key={person.id} className={`${cardClass} flex flex-col`}>
                <div className="flex flex-col sm:flex-row gap-6">
                  <img
                    src={person.image}
                    alt={person.name}
                    className={`w-32 h-32 rounded-full object-cover ${person.id === "mayor" ? "object-[50%_25%]" : person.id === "secretary" ? "object-[50%_25%]" : ""} mx-auto sm:mx-0 border-4 ${highContrast ? 'border-yellow-400' : 'border-moldova-blue'}`}
                  />
                  <div className="text-center sm:text-left flex-1">
                    <h3 className={`text-xl font-bold mb-1 ${highContrast ? 'text-white' : 'text-moldova-charcoal'}`}>
                      {person.name}
                    </h3>
                    <p className={`font-semibold mb-2 ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>
                      {person.role}
                    </p>
                    {person.partid && (
                      <span className={`inline-block px-2 py-1 rounded text-xs mb-3 ${highContrast ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                        {person.partid}
                      </span>
                    )}
                    {person.mandatStart && person.mandatEnd && (
                      <p className={`text-sm mb-3 flex items-center justify-center sm:justify-start gap-1 ${textClass}`}>
                        <Calendar size={14} />
                        Mandat: {person.mandatStart} - {person.mandatEnd}
                      </p>
                    )}

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <Phone size={16} className="opacity-70" />
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                        <a href={`tel:${person.phone}`} className="hover:underline">{person.phone}</a>
                          {person.id === "mayor" && (
                            <>
                              <span>,</span>
                              <a href="tel:+37367611811" className="hover:underline">+373 676 11811</a>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <Mail size={16} className="opacity-70" />
                        <a href={`mailto:${person.email}`} className="hover:underline">{person.email}</a>
                      </div>
                    </div>
                  </div>
                </div>
                {person.bio && (
                  <p className={`mt-4 pt-4 border-t text-sm leading-relaxed ${highContrast ? 'border-gray-700' : 'border-gray-200'} ${textClass}`}>
                    {person.bio}
                  </p>
                )}
                {person.previousActivity && (
                  <p className={`mt-3 text-sm leading-relaxed ${textClass}`}>
                    <span className="font-semibold">Activitatea până la mandat de primar: </span>
                    {person.previousActivity}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Consiliul Local */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className={`p-3 rounded-full ${highContrast ? 'bg-yellow-400 text-black' : 'bg-green-600 text-white'}`}>
              <Users size={24} />
            </div>
            <h2 className={`text-3xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-charcoal'}`}>
              Consiliul Local (2023-2027)
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Componența Politică */}
            <div className={`${cardClass} lg:col-span-1`}>
              <h3 className={headingClass}>Componența Politică</h3>
              <p className={`mb-6 ${textClass}`}>
                Ales la 5 noiembrie 2023. Total: 9 mandate.
              </p>

              {/* Vizualizare Grafică */}
              <div className="flex h-8 rounded-lg overflow-hidden mb-6">
                {COUNCIL_COMPOSITION.map((comp, idx) => (
                  <div
                    key={idx}
                    style={{ width: `${comp.procent}%`, backgroundColor: comp.culoare }}
                    className="flex items-center justify-center text-white text-xs font-bold"
                    title={`${comp.partid}: ${comp.mandate} mandate`}
                  >
                    {comp.mandate}
                  </div>
                ))}
              </div>

              {/* Legendă */}
              <div className="space-y-3">
                {COUNCIL_COMPOSITION.map((comp, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: comp.culoare }}
                      />
                      <span className={textClass}>{comp.partid}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-semibold ${highContrast ? 'text-white' : 'text-moldova-charcoal'}`}>
                        {comp.mandate} mandate
                      </span>
                      <span className={`text-sm ${textClass}`}>
                        ({comp.procent}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lista Consilierilor */}
            <div className={`${cardClass} lg:col-span-2`}>
              <h3 className={headingClass}>Consilierii Locali</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {COUNCIL_MEMBERS.map((member) => {
                  const partyColor = COUNCIL_COMPOSITION.find(c => c.partid === member.partid)?.culoare || '#666';
                  return (
                    <div
                      key={member.id}
                      className={`p-4 rounded-lg border-l-4 ${highContrast ? 'bg-gray-800' : 'bg-gray-50'}`}
                      style={{ borderLeftColor: partyColor }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: partyColor }}
                        >
                          <UserCheck size={18} />
                        </div>
                        <div>
                          <p className={`font-semibold ${highContrast ? 'text-white' : 'text-moldova-charcoal'}`}>
                            {member.name}
                          </p>
                          <p className={`text-xs ${textClass}`}>{member.partid}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Simboluri Oficiale */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className={`p-3 rounded-full ${highContrast ? 'bg-yellow-400 text-black' : 'bg-amber-500 text-white'}`}>
              <Award size={24} />
            </div>
            <h2 className={`text-3xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-charcoal'}`}>
              Simboluri Oficiale
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Stema */}
            <div className={cardClass}>
              <div className="flex items-center gap-3 mb-4">
                <Award className="text-amber-500" size={32} />
                <h3 className={`text-xl font-bold ${highContrast ? 'text-white' : 'text-moldova-charcoal'}`}>
                  Stema Satul
                </h3>
              </div>
              <p className={`mb-4 ${textClass}`}>{OFFICIAL_SYMBOLS.stema.descriere}</p>
              <div className="flex gap-2 mb-4 flex-wrap">
                {OFFICIAL_SYMBOLS.stema.culori.map((culoare, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded-full text-sm ${
                      idx === 0 ? 'bg-blue-100 text-blue-700' :
                      idx === 1 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {culoare}
                  </span>
                ))}
              </div>
              <div className={`text-sm space-y-1 ${textClass}`}>
                <p><strong>Aprobare:</strong> {OFFICIAL_SYMBOLS.stema.aprobare}</p>
                <p><strong>Semnificație:</strong> {OFFICIAL_SYMBOLS.stema.semnificatie}</p>
              </div>
            </div>

            {/* Drapel */}
            <div className={cardClass}>
              <div className="flex items-center gap-3 mb-4">
                <Flag className="text-moldova-blue" size={32} />
                <h3 className={`text-xl font-bold ${highContrast ? 'text-white' : 'text-moldova-charcoal'}`}>
                  Drapelul Satul
                </h3>
              </div>
              <p className={`mb-4 ${textClass}`}>{OFFICIAL_SYMBOLS.drapel.descriere}</p>
              <div className="flex gap-2 mb-4 flex-wrap">
                {OFFICIAL_SYMBOLS.drapel.culori.map((culoare, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded-full text-sm ${
                      idx === 0 ? 'bg-blue-100 text-blue-700' :
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
          <div className={`${cardClass} text-center`}>
            <p className={`text-2xl font-serif italic ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>
              "{OFFICIAL_SYMBOLS.motto}"
            </p>
          </div>
        </section>

        {/* Informații Mandat */}
        <section className={`${cardClass} border-l-4 ${highContrast ? 'border-yellow-400' : 'border-moldova-blue'}`}>
          <h3 className={headingClass}>Informații despre Mandatul Actual</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className={`text-4xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>2023</p>
              <p className={textClass}>Anul alegerii</p>
            </div>
            <div className="text-center">
              <p className={`text-4xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>9</p>
              <p className={textClass}>Consilieri locali</p>
            </div>
            <div className="text-center">
              <p className={`text-4xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>2027</p>
              <p className={textClass}>Sfârșitul mandatului</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
