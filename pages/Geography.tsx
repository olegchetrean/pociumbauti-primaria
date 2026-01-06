import React from 'react';
import { GEOGRAPHY_DATA, DEMOGRAPHY_DATA, INFRASTRUCTURE_DATA, CONTACT_INFO } from '../constants';
import { MapPin, Thermometer, Cloud, Droplets, Users, TrendingDown, Wifi, Zap, Bus, Home } from 'lucide-react';

interface Props {
  highContrast: boolean;
}

export const Geography: React.FC<Props> = ({ highContrast }) => {
  const cardClass = `rounded-xl p-6 ${highContrast ? 'bg-gray-900 border border-yellow-400 text-white' : 'bg-white shadow-soft'}`;
  const headingClass = `text-2xl font-bold mb-4 ${highContrast ? 'text-yellow-400' : 'text-moldova-charcoal'}`;
  const subheadingClass = `text-lg font-semibold mb-3 ${highContrast ? 'text-yellow-300' : 'text-moldova-blue'}`;
  const textClass = highContrast ? 'text-gray-300' : 'text-moldova-steel';

  return (
    <div className={`min-h-screen ${highContrast ? 'bg-black' : 'bg-moldova-cloud'}`}>
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <img
          src="https://picsum.photos/1920/600?random=geography"
          alt="Peisaj Pociumbăuți"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Geografie și Demografie</h1>
            <p className="text-xl opacity-90">Descoperă satul Pociumbăuți - 313 ani de istorie în nordul Moldovei</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-12">

        {/* Localizare */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className={`p-3 rounded-full ${highContrast ? 'bg-yellow-400 text-black' : 'bg-moldova-blue text-white'}`}>
              <MapPin size={24} />
            </div>
            <h2 className={`text-3xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-charcoal'}`}>
              Localizare Geografică
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={cardClass}>
              <h3 className={subheadingClass}>Date Oficiale</h3>
              <ul className={`space-y-3 ${textClass}`}>
                <li><strong>Nume oficial:</strong> {GEOGRAPHY_DATA.numeOficial}</li>
                <li><strong>Denumire chirilică:</strong> {GEOGRAPHY_DATA.numeCyrillic}</li>
                <li><strong>Raion:</strong> {GEOGRAPHY_DATA.raion}</li>
                <li><strong>Regiune:</strong> {GEOGRAPHY_DATA.regiune}</li>
                <li><strong>Cod poștal:</strong> {CONTACT_INFO.postalCode}</li>
                <li><strong>Fus orar:</strong> {GEOGRAPHY_DATA.fusOrar}</li>
              </ul>
            </div>

            <div className={cardClass}>
              <h3 className={subheadingClass}>Coordonate GPS</h3>
              <div className="text-center py-4">
                <p className={`text-4xl font-mono font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>
                  {GEOGRAPHY_DATA.coordonate.lat}°N
                </p>
                <p className={`text-4xl font-mono font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>
                  {GEOGRAPHY_DATA.coordonate.lng}°E
                </p>
              </div>
              <div className={`mt-4 p-3 rounded-lg ${highContrast ? 'bg-gray-800' : 'bg-moldova-cloud'}`}>
                <p className={`text-sm ${textClass}`}>
                  Situat în nordul Republicii Moldova, la intersecția dintre câmpiile agricole și dealurile blânde ale regiunii.
                </p>
              </div>
            </div>

            <div className={cardClass}>
              <h3 className={subheadingClass}>Distanțe</h3>
              <ul className={`space-y-3 ${textClass}`}>
                <li className="flex justify-between">
                  <span>Chișinău (capitală):</span>
                  <strong>{CONTACT_INFO.distances?.chisinau}</strong>
                </li>
                <li className="flex justify-between">
                  <span>Rîșcani (centru raional):</span>
                  <strong>{CONTACT_INFO.distances?.riscani}</strong>
                </li>
                <li className="flex justify-between">
                  <span>Bălți:</span>
                  <strong>{CONTACT_INFO.distances?.balti}</strong>
                </li>
                <li className="flex justify-between">
                  <span>Frontiera Ucraina:</span>
                  <strong>{CONTACT_INFO.distances?.frontieraUcraina}</strong>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Relief și Climat */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className={`p-3 rounded-full ${highContrast ? 'bg-yellow-400 text-black' : 'bg-green-600 text-white'}`}>
              <Thermometer size={24} />
            </div>
            <h2 className={`text-3xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-charcoal'}`}>
              Relief și Climat
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={cardClass}>
              <h3 className={subheadingClass}>Relief</h3>
              <ul className={`space-y-3 ${textClass}`}>
                <li><strong>Tip:</strong> {GEOGRAPHY_DATA.relief.tip}</li>
                <li><strong>Altitudine:</strong> {GEOGRAPHY_DATA.relief.altitudine}</li>
                <li><strong>Topografie:</strong> {GEOGRAPHY_DATA.relief.topografie}</li>
                <li><strong>Sol:</strong> {GEOGRAPHY_DATA.relief.sol}</li>
                <li><strong>Cursuri de apă:</strong> {GEOGRAPHY_DATA.relief.cursuriApa}</li>
              </ul>
            </div>

            <div className={cardClass}>
              <h3 className={subheadingClass}>Climat</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${highContrast ? 'bg-gray-800' : 'bg-red-50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Thermometer className="text-red-500" size={20} />
                    <span className="font-semibold">Vara</span>
                  </div>
                  <p className={`text-sm ${textClass}`}>{GEOGRAPHY_DATA.climat.vara}</p>
                </div>
                <div className={`p-4 rounded-lg ${highContrast ? 'bg-gray-800' : 'bg-blue-50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Cloud className="text-blue-500" size={20} />
                    <span className="font-semibold">Iarna</span>
                  </div>
                  <p className={`text-sm ${textClass}`}>{GEOGRAPHY_DATA.climat.iarna}</p>
                </div>
                <div className={`p-4 rounded-lg ${highContrast ? 'bg-gray-800' : 'bg-cyan-50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets className="text-cyan-500" size={20} />
                    <span className="font-semibold">Precipitații</span>
                  </div>
                  <p className={`text-sm ${textClass}`}>{GEOGRAPHY_DATA.climat.precipitatii}</p>
                </div>
                <div className={`p-4 rounded-lg ${highContrast ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">Vânturi</span>
                  </div>
                  <p className={`text-sm ${textClass}`}>{GEOGRAPHY_DATA.climat.vanturi}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Peisaj */}
          <div className={`${cardClass} mt-6`}>
            <h3 className={subheadingClass}>Peisaj Caracteristic</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {GEOGRAPHY_DATA.peisaj.map((item, idx) => (
                <div key={idx} className={`p-4 rounded-lg text-center ${highContrast ? 'bg-gray-800' : 'bg-moldova-cloud'}`}>
                  <span className="text-3xl mb-2 block">{item.emoji}</span>
                  <p className={`text-sm ${textClass}`}>{item.descriere}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Demografie */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className={`p-3 rounded-full ${highContrast ? 'bg-yellow-400 text-black' : 'bg-purple-600 text-white'}`}>
              <Users size={24} />
            </div>
            <h2 className={`text-3xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-charcoal'}`}>
              Date Demografice (Recensământ {DEMOGRAPHY_DATA.dataRecensament})
            </h2>
          </div>

          {/* Statistici principale */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className={`${cardClass} text-center`}>
              <p className={`text-4xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>
                {DEMOGRAPHY_DATA.populatieTotal}
              </p>
              <p className={textClass}>Locuitori (2014)</p>
            </div>
            <div className={`${cardClass} text-center`}>
              <p className={`text-4xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>
                ~{DEMOGRAPHY_DATA.populatieEstimata2024}
              </p>
              <p className={textClass}>Estimat 2024</p>
            </div>
            <div className={`${cardClass} text-center`}>
              <p className={`text-4xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>
                {DEMOGRAPHY_DATA.gospodarii}
              </p>
              <p className={textClass}>Gospodării</p>
            </div>
            <div className={`${cardClass} text-center`}>
              <p className={`text-4xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>
                {DEMOGRAPHY_DATA.varstaMediana}
              </p>
              <p className={textClass}>Vârstă mediană</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Structura pe gen */}
            <div className={cardClass}>
              <h3 className={subheadingClass}>Structura pe Gen</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className={textClass}>Bărbați</span>
                    <span className="font-semibold">{DEMOGRAPHY_DATA.structuraGen.barbati.numar} ({DEMOGRAPHY_DATA.structuraGen.barbati.procent}%)</span>
                  </div>
                  <div className={`h-3 rounded-full ${highContrast ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${DEMOGRAPHY_DATA.structuraGen.barbati.procent}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className={textClass}>Femei</span>
                    <span className="font-semibold">{DEMOGRAPHY_DATA.structuraGen.femei.numar} ({DEMOGRAPHY_DATA.structuraGen.femei.procent}%)</span>
                  </div>
                  <div className={`h-3 rounded-full ${highContrast ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div
                      className="h-full rounded-full bg-pink-500"
                      style={{ width: `${DEMOGRAPHY_DATA.structuraGen.femei.procent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Structura pe vârstă */}
            <div className={cardClass}>
              <h3 className={subheadingClass}>Structura pe Vârstă</h3>
              <div className="space-y-4">
                {Object.entries(DEMOGRAPHY_DATA.structuraVarsta).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-1">
                      <span className={textClass}>{value.interval}</span>
                      <span className="font-semibold">{value.numar} ({value.procent}%)</span>
                    </div>
                    <div className={`h-3 rounded-full ${highContrast ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div
                        className={`h-full rounded-full ${key === 'copii' ? 'bg-green-500' : key === 'adulti' ? 'bg-blue-500' : 'bg-orange-500'}`}
                        style={{ width: `${value.procent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Componență etnică */}
            <div className={cardClass}>
              <h3 className={subheadingClass}>Componență Etnică</h3>
              <div className="space-y-3">
                {DEMOGRAPHY_DATA.componentaEtnica.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className={textClass}>{item.etnie}</span>
                    <span className={`font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>
                      {item.procent}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Migrație */}
          <div className={`${cardClass} mt-6`}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="text-red-500" size={24} />
              <h3 className={subheadingClass}>Migrație și Diaspora</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className={`mb-4 ${textClass}`}>
                  <strong>Trend:</strong> {DEMOGRAPHY_DATA.migratie.trend}
                </p>
                <p className={`mb-4 ${textClass}`}>
                  <strong>Evoluție:</strong> {DEMOGRAPHY_DATA.migratie.evolutie}
                </p>
                <p className={`mb-4 ${textClass}`}>
                  <strong>Diaspora:</strong> {DEMOGRAPHY_DATA.migratie.diaspora}
                </p>
                <p className={textClass}>
                  <strong>Remitențe:</strong> {DEMOGRAPHY_DATA.migratie.remitente}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Destinații Principale:</h4>
                <div className="space-y-2">
                  {DEMOGRAPHY_DATA.migratie.destinatii.slice(0, 5).map((dest, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className={`flex-1 h-6 rounded ${highContrast ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <div
                          className="h-full rounded bg-moldova-blue flex items-center px-2"
                          style={{ width: `${dest.procent * 2}%` }}
                        >
                          <span className="text-xs text-white truncate">{dest.tara}</span>
                        </div>
                      </div>
                      <span className="text-sm font-semibold w-12">{dest.procent}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Infrastructură */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className={`p-3 rounded-full ${highContrast ? 'bg-yellow-400 text-black' : 'bg-orange-600 text-white'}`}>
              <Home size={24} />
            </div>
            <h2 className={`text-3xl font-bold ${highContrast ? 'text-yellow-400' : 'text-moldova-charcoal'}`}>
              Infrastructură și Utilități
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Drumuri */}
            <div className={cardClass}>
              <div className="flex items-center gap-2 mb-4">
                <Bus className="text-gray-600" size={20} />
                <h3 className={subheadingClass}>Drumuri și Transport</h3>
              </div>
              <ul className={`space-y-2 text-sm ${textClass}`}>
                <li><strong>Drum principal:</strong> {INFRASTRUCTURE_DATA.drumuri.drumPrincipal}</li>
                <li><strong>Stare:</strong> {INFRASTRUCTURE_DATA.drumuri.stare}</li>
                <li><strong>Rețea stradală:</strong> {INFRASTRUCTURE_DATA.drumuri.lungimeRetea}</li>
                <li><strong>Iluminat:</strong> {INFRASTRUCTURE_DATA.drumuri.iluminatPublic}</li>
              </ul>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="font-semibold text-sm mb-2">Transport public:</p>
                {INFRASTRUCTURE_DATA.transportPublic.map((t, idx) => (
                  <p key={idx} className={`text-sm ${textClass}`}>
                    {t.ruta}: {t.frecventa} {t.durata && `(${t.durata})`}
                  </p>
                ))}
              </div>
            </div>

            {/* Apă și Canalizare */}
            <div className={cardClass}>
              <div className="flex items-center gap-2 mb-4">
                <Droplets className="text-blue-500" size={20} />
                <h3 className={subheadingClass}>Apă și Canalizare</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Rețea apă</span>
                    <span className="font-semibold">{INFRASTRUCTURE_DATA.apaCanalizare.reteaApa.acoperire}%</span>
                  </div>
                  <div className={`h-2 rounded-full ${highContrast ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${INFRASTRUCTURE_DATA.apaCanalizare.reteaApa.acoperire}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Canalizare</span>
                    <span className="font-semibold text-red-500">{INFRASTRUCTURE_DATA.apaCanalizare.canalizare.acoperire}%</span>
                  </div>
                  <div className={`h-2 rounded-full ${highContrast ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div className="h-full rounded-full bg-red-500" style={{ width: `${INFRASTRUCTURE_DATA.apaCanalizare.canalizare.acoperire}%` }} />
                  </div>
                </div>
              </div>
              <p className={`text-xs mt-3 ${textClass}`}>
                {INFRASTRUCTURE_DATA.apaCanalizare.faraCanalizare.acoperire}% gospodării fără canalizare
              </p>
            </div>

            {/* Energie și Gaz */}
            <div className={cardClass}>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="text-yellow-500" size={20} />
                <h3 className={subheadingClass}>Energie și Gaz</h3>
              </div>
              <div className="space-y-3">
                <div className={`p-3 rounded-lg ${highContrast ? 'bg-gray-800' : 'bg-green-50'}`}>
                  <p className="font-semibold text-green-600">Electricitate: {INFRASTRUCTURE_DATA.energieElectrica.acoperire}%</p>
                  <p className={`text-sm ${textClass}`}>Furnizor: {INFRASTRUCTURE_DATA.energieElectrica.furnizor}</p>
                </div>
                <div className={`p-3 rounded-lg ${highContrast ? 'bg-gray-800' : 'bg-red-50'}`}>
                  <p className="font-semibold text-red-600">Gaz natural: INEXISTENT</p>
                  <p className={`text-sm ${textClass}`}>Încălzire: Lemne (70%), Cărbune (20%), Electric (10%)</p>
                </div>
              </div>
            </div>

            {/* Internet */}
            <div className={cardClass}>
              <div className="flex items-center gap-2 mb-4">
                <Wifi className="text-purple-500" size={20} />
                <h3 className={subheadingClass}>Telecom și Internet</h3>
              </div>
              <ul className={`space-y-2 text-sm ${textClass}`}>
                <li><strong>Internet fix:</strong> {INFRASTRUCTURE_DATA.telecomInternet.internetFix.operator} ({INFRASTRUCTURE_DATA.telecomInternet.internetFix.penetrare}%)</li>
                <li><strong>Viteză medie:</strong> {INFRASTRUCTURE_DATA.telecomInternet.vitezaMedie}</li>
                <li><strong>Mobil:</strong> Orange 4G, Moldcell 3G/4G</li>
                <li><strong>WiFi public:</strong> {INFRASTRUCTURE_DATA.telecomInternet.wifiPublic}</li>
              </ul>
            </div>

            {/* Salubritate */}
            <div className={cardClass}>
              <h3 className={subheadingClass}>Salubritate</h3>
              <ul className={`space-y-2 text-sm ${textClass}`}>
                <li><strong>Colectare gunoi:</strong> {INFRASTRUCTURE_DATA.salubritate.colectareGunoi}</li>
                <li><strong>Puncte colectare:</strong> {INFRASTRUCTURE_DATA.salubritate.tomberoane}</li>
                <li><strong>Reciclare:</strong> {INFRASTRUCTURE_DATA.salubritate.reciclare}</li>
              </ul>
            </div>

            {/* Cimitir */}
            <div className={cardClass}>
              <h3 className={subheadingClass}>Cimitir</h3>
              <ul className={`space-y-2 text-sm ${textClass}`}>
                <li><strong>Locație:</strong> {INFRASTRUCTURE_DATA.cimitir.locatie}</li>
                <li><strong>Suprafață:</strong> {INFRASTRUCTURE_DATA.cimitir.suprafata}</li>
                <li><strong>Capelă:</strong> {INFRASTRUCTURE_DATA.cimitir.capela}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Flora și Fauna */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={cardClass}>
            <h3 className={headingClass}>Flora</h3>
            <ul className={`space-y-2 ${textClass}`}>
              {GEOGRAPHY_DATA.flora.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-green-500">●</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className={cardClass}>
            <h3 className={headingClass}>Fauna</h3>
            <ul className={`space-y-2 ${textClass}`}>
              {GEOGRAPHY_DATA.fauna.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500">●</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

      </div>
    </div>
  );
};
