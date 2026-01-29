import React from 'react';
import { ECONOMY_DATA } from '../constants';
import { Wheat, TrendingUp, Store, Coins, AlertTriangle, Lightbulb, MapPin } from 'lucide-react';

interface Props {
  highContrast: boolean;
}

export const Economy: React.FC<Props> = ({ highContrast }) => {
  const cardClass = `rounded-xl p-6 ${highContrast ? 'bg-gray-900 border border-yellow-400 text-white' : 'bg-white shadow-soft'}`;
  const headingClass = `text-2xl font-bold mb-4 ${highContrast ? 'text-yellow-400' : 'text-moldova-charcoal'}`;
  const subheadingClass = `text-lg font-semibold mb-3 ${highContrast ? 'text-yellow-300' : 'text-moldova-blue'}`;
  const textClass = highContrast ? 'text-gray-300' : 'text-moldova-steel';

  const sectorColors = ['#3498db', '#27ae60', '#e74c3c', '#9b59b6'];

  return (
    <div className={`min-h-screen ${highContrast ? 'bg-black' : 'bg-moldova-cloud'}`}>
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <img
          src="/uploads/photos/thumbs/economie.jpg"
          alt="Câmpuri agricole Pociumbăuți"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Economie și Agricultură</h1>
            <p className="text-xl opacity-90">Agricultura - backbone-ul economic al satul Pociumbăuți</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-12">

        {/* Structura Economică */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className={`p-3 rounded-full ${highContrast ? 'bg-yellow-400 text-black' : 'bg-moldova-blue text-white'}`}>
              <TrendingUp size={24} />
            </div>
            <h2 className={`text-3xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-charcoal'}`}>
              Structura Economică
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pie Chart Representation */}
            <div className={cardClass}>
              <h3 className={subheadingClass}>Sectoare Economice</h3>
              <div className="flex items-center justify-center py-8">
                <div className="relative w-48 h-48">
                  {/* Simple visual representation */}
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    {ECONOMY_DATA.sectoare.reduce((acc, sector, idx) => {
                      const startAngle = acc.totalAngle;
                      const angle = (sector.procent / 100) * 360;
                      const endAngle = startAngle + angle;
                      const largeArc = angle > 180 ? 1 : 0;

                      const startX = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                      const startY = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                      const endX = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                      const endY = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

                      acc.paths.push(
                        <path
                          key={idx}
                          d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArc} 1 ${endX} ${endY} Z`}
                          fill={sectorColors[idx]}
                          stroke="white"
                          strokeWidth="1"
                        />
                      );
                      acc.totalAngle = endAngle;
                      return acc;
                    }, { paths: [] as React.ReactElement[], totalAngle: 0 }).paths}
                  </svg>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {ECONOMY_DATA.sectoare.map((sector, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: sectorColors[idx] }} />
                    <span className={`text-sm ${textClass}`}>{sector.sector}: {sector.procent}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resurse Funciare */}
            <div className={cardClass}>
              <h3 className={subheadingClass}>Resurse Funciare</h3>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${highContrast ? 'bg-gray-800' : 'bg-green-50'}`}>
                  <p className="text-3xl font-bold text-green-600">{ECONOMY_DATA.agricultura.suprafataTotala}</p>
                  <p className={`text-sm ${textClass}`}>Suprafața totală a satului</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <p className={`text-xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>
                      {ECONOMY_DATA.agricultura.terenArabil}
                    </p>
                    <p className={`text-xs ${textClass}`}>Teren arabil</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>
                      {ECONOMY_DATA.agricultura.pasuni}
                    </p>
                    <p className={`text-xs ${textClass}`}>Pășuni</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>
                      {ECONOMY_DATA.agricultura.livezi}
                    </p>
                    <p className={`text-xs ${textClass}`}>Livezi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Culturi Principale */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className={`p-3 rounded-full ${highContrast ? 'bg-yellow-400 text-black' : 'bg-amber-500 text-white'}`}>
              <Wheat size={24} />
            </div>
            <h2 className={`text-3xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-charcoal'}`}>
              Culturi Principale
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ECONOMY_DATA.agricultura.culturiPrincipale.map((cultura, idx) => (
              <div key={idx} className={cardClass}>
                <div className="text-center mb-4">
                  <span className="text-4xl">
                    {cultura.cultura.includes('Grâu') ? '🌾' :
                      cultura.cultura.includes('Porumb') ? '🌽' :
                        cultura.cultura.includes('Floarea') ? '🌻' : '🥬'}
                  </span>
                </div>
                <h3 className={`text-lg font-bold text-center mb-4 ${highContrast ? 'text-white' : 'text-moldova-charcoal'}`}>
                  {cultura.cultura}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={textClass}>Suprafață:</span>
                    <strong>{cultura.suprafata}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className={textClass}>Randament:</span>
                    <strong>{cultura.randament}</strong>
                  </div>
                  <div className={`mt-3 p-2 rounded text-center ${highContrast ? 'bg-gray-800' : 'bg-green-50'}`}>
                    <p className={`text-xs ${textClass}`}>Preț</p>
                    <p className="font-bold text-green-600">{cultura.pret}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Zootehnie */}
        <section>
          <h2 className={headingClass}>Zootehnie</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {ECONOMY_DATA.agricultura.zootehnie.map((animal, idx) => (
              <div key={idx} className={`${cardClass} text-center`}>
                <span className="text-3xl mb-2 block">
                  {animal.animal === 'Bovine' ? '🐄' :
                    animal.animal === 'Porcine' ? '🐷' :
                      animal.animal === 'Păsări' ? '🐔' :
                        animal.animal === 'Ovine' ? '🐑' : '🐝'}
                </span>
                <h4 className="font-semibold">{animal.animal}</h4>
                <p className={`text-lg font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>
                  {animal.numar}
                </p>
                <p className={`text-xs ${textClass}`}>{animal.nota}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Agenți Economici */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className={`p-3 rounded-full ${highContrast ? 'bg-yellow-400 text-black' : 'bg-purple-600 text-white'}`}>
              <Store size={24} />
            </div>
            <h2 className={`text-3xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-charcoal'}`}>
              Agenți Economici
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={cardClass}>
              <p className={`text-3xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>
                {ECONOMY_DATA.agentiEconomici.fermeFamiliale}
              </p>
              <p className={textClass}>Ferme familiale</p>
            </div>
            <div className={cardClass}>
              <p className={`text-3xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>
                {ECONOMY_DATA.agentiEconomici.srlAgricole}
              </p>
              <p className={textClass}>SRL-uri agricole</p>
            </div>
            <div className={cardClass}>
              <p className={`text-3xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>
                {ECONOMY_DATA.agentiEconomici.magazineAlimentare}
              </p>
              <p className={textClass}>Magazine alimentare</p>
            </div>
            <div className={cardClass}>
              <p className={`text-3xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>
                {ECONOMY_DATA.agentiEconomici.barCafenea}
              </p>
              <p className={textClass}>Bar/Cafenea</p>
            </div>
          </div>

          <div className={`${cardClass} mt-6`}>
            <h3 className={subheadingClass}>Servicii Lipsă</h3>
            <div className="flex flex-wrap gap-3">
              {ECONOMY_DATA.agentiEconomici.brutarie === 0 && (
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">Brutărie - INEXISTENTĂ</span>
              )}
              {ECONOMY_DATA.agentiEconomici.farmacie === 0 && (
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">Farmacie - INEXISTENTĂ</span>
              )}
              {ECONOMY_DATA.agentiEconomici.statieBenzina === 0 && (
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">Stație benzină - INEXISTENTĂ</span>
              )}
            </div>
            <p className={`text-sm mt-3 ${textClass}`}>
              Aceste servicii sunt disponibile în Rîșcani (~15 km) sau Bălți (~45 km).
            </p>
          </div>
        </section>

        {/* Venituri și Salarii */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className={`p-3 rounded-full ${highContrast ? 'bg-yellow-400 text-black' : 'bg-green-600 text-white'}`}>
              <Coins size={24} />
            </div>
            <h2 className={`text-3xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-charcoal'}`}>
              Venituri și Salarii
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Venituri */}
            <div className={cardClass}>
              <h3 className={subheadingClass}>Venituri Medii Gospodărie</h3>
              <div className={`p-4 rounded-lg mb-4 ${highContrast ? 'bg-gray-800' : 'bg-green-50'}`}>
                <p className="text-3xl font-bold text-green-600">{ECONOMY_DATA.venituri.venitMediuGospodarie}</p>
              </div>
              <h4 className="font-semibold mb-3">Surse de venit:</h4>
              <div className="space-y-3">
                {ECONOMY_DATA.venituri.surse.map((sursa, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className={textClass}>{sursa.sursa}</span>
                    <span className="font-semibold">{sursa.suma}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Salarii */}
            <div className={cardClass}>
              <h3 className={subheadingClass}>Salarii Locale</h3>
              <div className="space-y-3">
                {ECONOMY_DATA.salarii.map((sal, idx) => (
                  <div key={idx} className={`flex justify-between items-center p-3 rounded ${highContrast ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <span className={textClass}>{sal.functie}</span>
                    <span className={`font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>{sal.salariu}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="font-semibold mb-3">Pensii:</h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-sm text-gray-500">Minimă</p>
                    <p className="font-bold">{ECONOMY_DATA.pensii.minima}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Medie</p>
                    <p className="font-bold text-green-600">{ECONOMY_DATA.pensii.medie}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Maximă</p>
                    <p className="font-bold">{ECONOMY_DATA.pensii.maxima}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Probleme și Oportunități */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Probleme */}
          <div className={`${cardClass} border-l-4 border-red-500`}>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="text-red-500" size={24} />
              <h3 className={headingClass}>Probleme Economice</h3>
            </div>
            <ul className="space-y-3">
              {ECONOMY_DATA.probleme.map((problema, idx) => (
                <li key={idx} className={`flex items-start gap-2 ${textClass}`}>
                  <span className="text-red-500 mt-1">●</span>
                  {problema}
                </li>
              ))}
            </ul>
          </div>

          {/* Oportunități */}
          <div className={`${cardClass} border-l-4 border-green-500`}>
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="text-green-500" size={24} />
              <h3 className={headingClass}>Oportunități</h3>
            </div>
            <ul className="space-y-3">
              {ECONOMY_DATA.oportunitati.map((oportunitate, idx) => (
                <li key={idx} className={`flex items-start gap-2 ${textClass}`}>
                  <span className="text-green-500 mt-1">●</span>
                  {oportunitate}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Mecanizare */}
        <section className={cardClass}>
          <h3 className={headingClass}>Mecanizare Agricolă</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <span className="text-5xl">🚜</span>
              <p className={`mt-2 font-bold text-lg ${highContrast ? 'text-white' : ''}`}>Tractoare</p>
              <p className={textClass}>{ECONOMY_DATA.agricultura.mecanizare.tractoare}</p>
            </div>
            <div className="text-center">
              <span className="text-5xl">🌾</span>
              <p className={`mt-2 font-bold text-lg ${highContrast ? 'text-white' : ''}`}>Combine</p>
              <p className={textClass}>{ECONOMY_DATA.agricultura.mecanizare.combine}</p>
            </div>
            <div className={`text-center p-4 rounded-lg ${highContrast ? 'bg-gray-800' : 'bg-red-50'}`}>
              <AlertTriangle className="mx-auto text-red-500" size={32} />
              <p className={`mt-2 font-bold text-lg ${highContrast ? 'text-white' : ''}`}>Problemă</p>
              <p className={`text-sm ${textClass}`}>{ECONOMY_DATA.agricultura.mecanizare.probleme}</p>
            </div>
          </div>
        </section>

        {/* Amplasare Geografică */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className={`p-3 rounded-full ${highContrast ? 'bg-yellow-400 text-black' : 'bg-moldova-blue text-white'}`}>
              <MapPin size={24} />
            </div>
            <h2 className={`text-3xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-charcoal'}`}>
              Amplasare Geografică
            </h2>
          </div>
          <div className={cardClass}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5629.345978042137!2d27.32241973413662!3d47.99588339545808!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4734a9000bc85f2f%3A0x386458d7f0c65ea7!2zUHJpbcSDcmlhIFBvY2l1bWLEg3XFo2k!5e1!3m2!1sro!2s!4v1767943298942!5m2!1sro!2s"
                  width="100%"
                  height="350"
                  style={{ border: 0, borderRadius: '8px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Harta satului Pociumbăuți"
                />
              </div>
              <div className="space-y-4">
                <h3 className={subheadingClass}>Date Geografice</h3>
                <div className={`p-4 rounded-lg ${highContrast ? 'bg-gray-800' : 'bg-blue-50'}`}>
                  <p className={`text-sm ${textClass}`}>Suprafață totală</p>
                  <p className={`text-2xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>1454,83 ha</p>
                </div>
                <div className="space-y-2">
                  <p className={textClass}><strong>Raion:</strong> Rîșcani</p>
                  <p className={textClass}><strong>Distanța până la Rîșcani:</strong> ~15 km</p>
                  <p className={textClass}><strong>Distanța până la Bălți:</strong> ~45 km</p>
                  <p className={textClass}><strong>Coordonate:</strong> 47°59'N, 27°19'E</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
