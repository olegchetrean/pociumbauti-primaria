import { ContactInfo, Decision, Announcement, Disposition, StaffMember, AdminLog, CouncilMember, GeographyData, DemographyData, InfrastructureData, HistoryEvent, EconomyData, Institution, Service } from './types';

// ═══════════════════════════════════════════════════════════════════════════════
//                         INFORMAȚII DE CONTACT
// ═══════════════════════════════════════════════════════════════════════════════

export const CONTACT_INFO: ContactInfo = {
  address: "MD-5632, Pociumbăuți, Raionul Rîșcani, Republica Moldova",
  postalCode: "MD-5632",
  phoneMayor: "+373 256 73421",
  phoneSecretary: "+373 256 73196",
  email: "primaria.pociumbauti@gov.md",
  emailMayor: "primar.pociumbauti@gov.md",
  emailSecretary: "secretar.pociumbauti@gov.md",
  schedule: "Luni - Vineri: 08:00 - 17:00 (Pauză 12:00-13:00)",
  audiences: "Marți și Joi: 14:00 - 16:00",
  coordinates: {
    lat: 47.9958,
    lng: 27.3236
  },
  emergencyPhone: "112",
  distances: {
    chisinau: "~180 km (3.5 ore)",
    riscani: "~15 km (20 min)",
    balti: "~45 km (45 min)",
    frontieraUcraina: "~30 km"
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
//                         GEOGRAFIE ȘI LOCALIZARE
// ═══════════════════════════════════════════════════════════════════════════════

export const GEOGRAPHY_DATA: GeographyData = {
  numeOficial: "Comuna Pociumbăuți",
  numeCyrillic: "Почумбэуць",
  alias: "Pocembeuți",
  raion: "Rîșcani",
  regiune: "Nord Moldova",
  fusOrar: "UTC+2 (EET), UTC+3 (EEST vara)",

  coordonate: {
    lat: 47.9958,
    lng: 27.3236
  },

  relief: {
    tip: "Deal moderat ondulat (toltre moldovenești)",
    altitudine: "150-200 metri deasupra nivelului mării",
    topografie: "Câmpii agricole cu dealuri blânde",
    sol: "Cernoziom fertil (ideal pentru agricultură)",
    cursuriApa: "Pârâu mic (afluent indirect Prut)"
  },

  climat: {
    tip: "Continental temperat",
    vara: "Călduroasă (25-30°C), perioade secetoase",
    iarna: "Rece (-5 la -15°C), zăpadă moderată",
    precipitatii: "450-550 mm/an (concentrat primăvară-vară)",
    vanturi: "Predominant nord-est (crivăț iarna)"
  },

  peisaj: [
    { emoji: "🌾", descriere: "Câmpii de grâu auriu la apus (iunie-iulie)" },
    { emoji: "🌻", descriere: "Lanuri de floarea-soarelui (iulie-august)" },
    { emoji: "🌳", descriere: "Centuri forestiere de protecție (salcâm, stejar)" },
    { emoji: "⛰️", descriere: "Dealuri blânde cu vii mici" },
    { emoji: "🏡", descriere: "Case tradiționale moldovenești (curte cu vie, grădină)" }
  ],

  flora: [
    "Grâu, porumb, floarea-soarelui (culturi principale)",
    "Salcâm, stejar, arțar (păduri și perdele)",
    "Nuci, pruni, cireși, meri (livezi gospodărești)",
    "Stepă: salvie, troscot, măcrișuri"
  ],

  fauna: [
    "Păsări: rândunele, cucuvele, ciocârlii, barze",
    "Mamifere mici: iepuri, nevăstuici, arici",
    "Domestice: vaci, porci, oi, găini",
    "Insecte: albine (apicultură tradițională)"
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
//                         DATE DEMOGRAFICE (RECENSĂMÂNT 2014)
// ═══════════════════════════════════════════════════════════════════════════════

export const DEMOGRAPHY_DATA: DemographyData = {
  populatieTotal: 593,
  dataRecensament: "14 mai 2014",
  populatieEstimata2024: 520,
  gospodarii: 244,

  structuraGen: {
    barbati: { numar: 285, procent: 48.1 },
    femei: { numar: 308, procent: 51.9 }
  },

  structuraVarsta: {
    copii: { interval: "0-14 ani", numar: 83, procent: 14.0 },
    adulti: { interval: "15-64 ani", numar: 386, procent: 65.1 },
    varstnici: { interval: "65+ ani", numar: 124, procent: 20.9 }
  },

  varstaMediana: 42.4,

  componentaEtnica: [
    { etnie: "Moldoveni/Români", numar: 578, procent: 97.5 },
    { etnie: "Ucraineni", numar: 12, procent: 2.0 },
    { etnie: "Ruși", numar: 3, procent: 0.5 }
  ],

  limbaMaterna: [
    { limba: "Română/Moldovenească", procent: 97.8 },
    { limba: "Rusă", procent: 1.7 },
    { limba: "Ucraineană", procent: 0.5 }
  ],

  religie: [
    { confesiune: "Ortodocși (Biserica Ortodoxă Moldovenească)", procent: 99.5 },
    { confesiune: "Alții/Nicio religie", procent: 0.5 }
  ],

  educatie: [
    { nivel: "Fără educație", procent: 1.2 },
    { nivel: "Primară (1-4 clase)", procent: 8.5 },
    { nivel: "Gimnazială (5-9 clase)", procent: 32.8 },
    { nivel: "Liceu (10-12 clase)", procent: 41.3 },
    { nivel: "Profesională", procent: 11.7 },
    { nivel: "Superioară", procent: 4.5 }
  ],

  migratie: {
    trend: "Depopulare treptată",
    evolutie: "2004: ~850 → 2014: 593 → 2024: ~520 (estimat)",
    diaspora: "~150-200 persoane",
    destinatii: [
      { tara: "Rusia", procent: 40, orase: "Moscova, Sankt Petersburg" },
      { tara: "Italia", procent: 25, orase: "Îngrijire bătrâni, agricultură" },
      { tara: "Franța", procent: 10 },
      { tara: "Germania", procent: 10 },
      { tara: "Israel", procent: 8 },
      { tara: "România", procent: 5 },
      { tara: "Altele", procent: 2 }
    ],
    remitente: "~30-40% din bugetul familiilor primesc bani din diaspora"
  },

  natalitate: {
    nasteriPeAn: "4-6 copii",
    decesePeAn: "10-12 persoane",
    soldNatural: "NEGATIV (-5 la -7 persoane/an)"
  },

  sperantaViata: {
    barbati: 65,
    femei: 73,
    medie: 69
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
//                         INFRASTRUCTURĂ ȘI UTILITĂȚI
// ═══════════════════════════════════════════════════════════════════════════════

export const INFRASTRUCTURE_DATA: InfrastructureData = {
  drumuri: {
    drumPrincipal: "M3 (Chișinău - Bălți - Edineț) → R41 → drum local",
    stare: "Asfalt pe drum național, piatră spartă pe străzile satului",
    lungimeRetea: "~8 km (6 străzi principale)",
    trotuare: "Parțiale, doar pe artere principale",
    iluminatPublic: "Existant, dar insuficient (50% acoperire)"
  },

  transportPublic: [
    { ruta: "Pociumbăuți → Rîșcani", frecventa: "2-3 curse/zi" },
    { ruta: "Rîșcani → Chișinău", frecventa: "4-5 curse/zi", durata: "~3.5 ore (via Bălți)" }
  ],

  apaCanalizare: {
    reteaApa: { acoperire: 65.6, nota: "gospodării conectate" },
    apaDinFantani: { acoperire: 34.4, nota: "risc calitate apă" },
    canalizare: { acoperire: 12.7, nota: "FOARTE SCĂZUT" },
    faraCanalizare: { acoperire: 87.3, nota: "toalete în curte, fose septice" },
    statiiEpurare: "INEXISTENTE"
  },

  energieElectrica: {
    acoperire: 100,
    furnizor: "Premier Energy",
    tensiune: "220V/50Hz",
    intreruperi: "Rare, dar posibile iarna (viscol, gheață)"
  },

  gazNatural: {
    reteaGaz: false,
    incalzire: [
      { tip: "Lemne", procent: 70 },
      { tip: "Cărbune", procent: 20 },
      { tip: "Electric", procent: 10 }
    ],
    gatit: "Butelii GPL (gaz propan), electrice, sobă lemne"
  },

  telecomInternet: {
    telefonieFixa: { operator: "Moldtelecom", penetrare: 30 },
    telefonieMobila: [
      { operator: "Orange", acoperire: "4G (cel mai bun semnal)" },
      { operator: "Moldcell", acoperire: "3G/4G (bună)" },
      { operator: "Unite", acoperire: "3G (moderată)" }
    ],
    internetFix: {
      operator: "Moldtelecom ADSL",
      viteza: "~10 Mbps",
      penetrare: 50
    },
    vitezaMedie: "5-15 Mbps (LENT comparativ urban)",
    wifiPublic: "INEXISTENT (doar primărie și școală)"
  },

  salubritate: {
    colectareGunoi: "Contract privat (1x săptămână)",
    tomberoane: "10 puncte colectare în sat",
    reciclare: "INEXISTENTĂ",
    gropaGunoi: "La marginea satului (problemă ecologică)"
  },

  cimitir: {
    locatie: "La ieșirea din sat (spre nord)",
    suprafata: "~2 hectare",
    capela: "Existentă, renovată 2018"
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
//                         ISTORIC COMPLET 1711-2024
// ═══════════════════════════════════════════════════════════════════════════════

export const HISTORY_EVENTS: HistoryEvent[] = [
  {
    year: "1711",
    title: "Prima Atestare Documentară",
    description: "Satul este menționat documentar pentru prima dată în luna februarie, în timpul războaielor ruso-otomane. Numele provine probabil de la 'pociumb' (țăruș) sau un curs de apă dispărut.",
    period: "Întemeiere",
    important: true
  },
  {
    year: "1812",
    title: "Anexarea Basarabiei",
    description: "Prin Tratatul de la București, Basarabia este anexată de Imperiul Rus. Pociumbăuți trece sub administrație rusească.",
    period: "Imperiul Rus"
  },
  {
    year: "1815",
    title: "Construcția Bisericii 'Sf. Arhanghel Mihail'",
    description: "Ctitorită de Vasile Stroescu, biserica din piatră în stil moldovenesc-bizantin devine centrul spiritual al comunității. Renovată în 1925, 1990 și 2010, rămâne funcțională până astăzi.",
    period: "Imperiul Rus",
    important: true
  },
  {
    year: "1817",
    title: "Primul Recensământ",
    description: "Sunt înregistrate 51 de gospodării și 65 capete de familie pe moșia lui Nicolai Rosetti.",
    period: "Imperiul Rus"
  },
  {
    year: "1918",
    title: "Unirea cu România",
    description: "La 27 martie, Basarabia se unește cu România. Pociumbăuți devine parte din Județul Soroca, România Mare.",
    period: "România Mare",
    important: true
  },
  {
    year: "1930",
    title: "Vârful Demografic",
    description: "952 de locuitori - cel mai mare număr din istoria satului. Comunitatea avea 3 mori de apă, carieră de piatră și o cooperativă agricolă prosperă.",
    period: "România Mare",
    important: true
  },
  {
    year: "1938",
    title: "Monumentul Eroilor WWI",
    description: "Căminul Cultural 'Regina Maria' ridică un monument dedicat eroilor căzuți în Primul Război Mondial (~40-50 soldați din sat).",
    period: "România Mare",
    important: true
  },
  {
    year: "1940",
    title: "Ocupația Sovietică",
    description: "Prin Pactul Ribbentrop-Molotov, Basarabia este ocupată de URSS. Începe perioada sovietică.",
    period: "Epoca Sovietică"
  },
  {
    year: "1944",
    title: "Reocuparea Sovietică",
    description: "Armata Roșie reconchestează Basarabia. Urmează deportări NKVD în Siberia (1949, 1951) - ~10-15 familii din sat.",
    period: "Epoca Sovietică"
  },
  {
    year: "1948-1950",
    title: "Colectivizarea",
    description: "Pământurile sunt confiscate și organizate în colhoz. Biserica este închisă în 1960, folosită ca depozit până în 1989.",
    period: "Epoca Sovietică"
  },
  {
    year: "1965",
    title: "Casa de Cultură",
    description: "Construcția Casei de Cultură în stil sovietic, cu capacitate de ~150 persoane.",
    period: "Epoca Sovietică"
  },
  {
    year: "1991",
    title: "Independența Moldovei",
    description: "La 27 august, Moldova își declară independența. Colhozul este desființat treptat, pământul fiind împărțit familiilor (1998-2000).",
    period: "Independența",
    important: true
  },
  {
    year: "2014",
    title: "Recensământul Populației",
    description: "Se înregistrează oficial 593 de locuitori în 244 de gospodării. Populația scăzuse de la ~850 în 2004.",
    period: "Epoca Modernă"
  },
  {
    year: "2023",
    title: "Simboluri Oficiale",
    description: "La 14 decembrie, Consiliul Local aprobă oficial Stema și Drapelul comunei, incluzând trandafirii familiei Rosetti și potcoava familiei Stroescu.",
    period: "Epoca Modernă",
    important: true
  },
  {
    year: "2023",
    title: "Alegeri Locale",
    description: "La 5 noiembrie, Lorentii Lisevici (PSRM) este ales primar. Consiliul Local are 9 membri din 4 formațiuni politice.",
    period: "Epoca Modernă"
  },
  {
    year: "2025",
    title: "Reconstrucția Monumentului",
    description: "Pe 18 iulie, într-un parteneriat istoric între Primărie și Asociația 'Monumentum', va fi inaugurat monumentul reconstruit fidel după planurile din 1938. Piatra decorativă originală, păstrată eroic de Aurica Dumbravă timp de 40 de ani.",
    period: "Epoca Modernă",
    important: true
  }
];

// Pentru compatibilitate cu codul existent
export const HISTORY_HIGHLIGHTS = HISTORY_EVENTS.filter(e => e.important).map(e => ({
  year: e.year,
  text: e.description
}));

// ═══════════════════════════════════════════════════════════════════════════════
//                         ECONOMIE ȘI AGRICULTURĂ
// ═══════════════════════════════════════════════════════════════════════════════

export const ECONOMY_DATA: EconomyData = {
  sectoare: [
    { sector: "Agricultură", procent: 70 },
    { sector: "Servicii", procent: 15 },
    { sector: "Comerț", procent: 10 },
    { sector: "Altele", procent: 5 }
  ],

  agricultura: {
    suprafataAgricola: "~800-1000 hectare",
    terenArabil: "950 ha",
    pasuni: "50 ha",
    viiLivezi: "30 ha (abandonate parțial)",

    culturiPrincipale: [
      { cultura: "Grâu de toamnă", suprafata: 40, randament: "2.5-3.5 tone/ha", pret: "3,500-4,000 MDL/tonă" },
      { cultura: "Porumb", suprafata: 30, randament: "3-4 tone/ha", pret: "2,500-3,000 MDL/tonă" },
      { cultura: "Floarea-soarelui", suprafata: 20, randament: "1.5-2 tone/ha", pret: "7,000-8,000 MDL/tonă" },
      { cultura: "Legume", suprafata: 5, randament: "variabil", pret: "piețele locale" }
    ],

    zootehnie: [
      { animal: "Bovine", numar: "150-200 capete", nota: "vaci de lapte, 3000-4000 litri/vacă/an" },
      { animal: "Porcine", numar: "300-400 capete", nota: "crescuți în gospodării individuale" },
      { animal: "Păsări", numar: "5000-7000", nota: "găini ouătoare, rațe, gâște" },
      { animal: "Ovine", numar: "100-150 capete", nota: "în declin" },
      { animal: "Stupine", numar: "30-40", nota: "miere de salcâm" }
    ],

    mecanizare: {
      tractoare: "15-20 (vechi sovietice și moderne)",
      combine: "3-5 (folosite cooperativ)",
      probleme: "Lipsa capitalului pentru modernizare"
    }
  },

  agentiEconomici: {
    fermeFamiliale: "230-240 (95% economie agricolă)",
    srlAgricole: "2-3 (fermieri mari, >50 ha)",
    magazineAlimentare: 3,
    barCafenea: 1,
    brutarie: 0,
    farmacie: 0,
    statieBenzina: 0
  },

  venituri: {
    venitMediuGospodarie: "30,000-40,000 MDL/an",
    surse: [
      { sursa: "Agricultură", suma: "15,000-20,000 MDL" },
      { sursa: "Remitențe diaspora", suma: "10,000-15,000 MDL" },
      { sursa: "Salarii", suma: "5,000-10,000 MDL" },
      { sursa: "Pensii", suma: "3,000-5,000 MDL" }
    ]
  },

  salarii: [
    { functie: "Primar", salariu: "~12,000 MDL/lună" },
    { functie: "Secretar primărie", salariu: "~8,000 MDL/lună" },
    { functie: "Profesor", salariu: "7,000-9,000 MDL/lună" },
    { functie: "Asistent medical", salariu: "~6,000 MDL/lună" },
    { functie: "Muncitor necalificat", salariu: "4,000-5,000 MDL/lună" }
  ],

  pensii: {
    medie: "~2,500 MDL/lună",
    maxima: "~4,000 MDL/lună",
    minima: "~1,500 MDL/lună"
  },

  probleme: [
    "Dependență de agricultură (vulnerabil la secetă, prețuri)",
    "Mecanizare insuficientă (productivitate scăzută)",
    "Lipsa industriei (zero locuri muncă industriale)",
    "Migrație tinerilor (pierdere forță de muncă calificată)",
    "Infrastructură slabă (drumuri, internet)",
    "Acces limitat la credite (bănci refuză fermierii mici)"
  ],

  oportunitati: [
    "Agricultura ecologică (cerere europeană)",
    "Turism rural (case de oaspeți, agroturism)",
    "Valorificarea tradițiilor (festivaluri, meșteșuguri)",
    "Internet rapid (telemuncă, freelancing)",
    "Investiții diaspora (antreprenoriat local)"
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
//                         INSTITUȚII PUBLICE
// ═══════════════════════════════════════════════════════════════════════════════

export const INSTITUTIONS: Institution[] = [
  {
    id: "primaria",
    nume: "Primăria Comunei Pociumbăuți",
    tip: "Administrație publică locală",
    adresa: "MD-5632, Pociumbăuți, Raionul Rîșcani",
    telefon: "+373 256 73421",
    email: "primaria.pociumbauti@gov.md",
    program: "Luni-Vineri: 08:00-17:00 (Pauză 12:00-13:00)",
    descriere: "Autoritatea administrației publice locale care gestionează treburile publice ale comunei.",
    personal: 5
  },
  {
    id: "scoala",
    nume: "Școala Generală Pociumbăuți",
    tip: "Instituție de învățământ",
    adresa: "Pociumbăuți, Raionul Rîșcani",
    descriere: "Școală primară + gimnazială (clase I-IX). Clădire renovată 2010, echipament basic IT.",
    personal: 14,
    detalii: {
      elevi: "60-80 (în scădere)",
      limbiPredare: "Română (principal), Rusă (opțional)",
      probleme: "Număr elevi scade, risc închidere clase"
    }
  },
  {
    id: "gradinita",
    nume: "Grădinița (ÎNCHISĂ)",
    tip: "Instituție de învățământ",
    descriere: "Închisă din 2015 din cauza lipsei copiilor. Clădirea este folosită ca depozit sau sală evenimente.",
    status: "închis"
  },
  {
    id: "dispensar",
    nume: "Oficiul Medicului de Familie",
    tip: "Instituție medicală",
    adresa: "Pociumbăuți",
    descriere: "Consultații de bază, vaccinări, prim ajutor. Medic de la Rîșcani vine 1x/săptămână.",
    personal: 1,
    detalii: {
      personal: "1 asistent medical (feldșer)",
      medic: "Vine 1x/săptămână din Rîșcani",
      urgente: "Ambulanță din Rîșcani (~20-30 min răspuns)",
      probleme: "Fără medic permanent, fără farmacie"
    }
  },
  {
    id: "casa-cultura",
    nume: "Casa de Cultură Pociumbăuți",
    tip: "Instituție culturală",
    adresa: "Pociumbăuți, centru",
    descriere: "Construită în 1965 (stil sovietic), renovată 2005 și 2018. Capacitate ~150 persoane.",
    personal: 2,
    detalii: {
      activitati: [
        "Festival 'Nunta Moldovenească' (august)",
        "Hramul satului (noiembrie)",
        "Spectacole copii (Crăciun, Paște)",
        "Ședințe consiliu local",
        "Cinematograf ocazional"
      ]
    }
  },
  {
    id: "biblioteca",
    nume: "Biblioteca Publică Pociumbăuți",
    tip: "Instituție culturală",
    adresa: "Pociumbăuți",
    program: "Luni-Vineri 09:00-17:00",
    descriere: "~3,000 cărți, majoritar sovietice. Cititori activi: 30-40 persoane.",
    personal: 1,
    detalii: {
      volum: "~3,000 cărți",
      probleme: "Cărți vechi, lipsa achiziții noi, umiditate"
    }
  },
  {
    id: "biserica",
    nume: "Biserica 'Sfântul Arhanghel Mihail'",
    tip: "Lăcaș de cult",
    adresa: "Pociumbăuți, centru",
    descriere: "Construită în 1815, ctitorită de Vasile Stroescu. Stil moldovenesc-bizantin. Renovată în 1925, 1990 și 2010.",
    detalii: {
      constructie: "1815 (piatra)",
      ctitor: "Vasile Stroescu",
      stil: "Moldovenesc-bizantin",
      enoriasi: "~400-450 (85% din populație)",
      slujbe: "Duminică și sărbători religioase",
      stare: "Funcțională, bine întreținută"
    }
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
//                         CONDUCEREA ȘI PERSONALUL
// ═══════════════════════════════════════════════════════════════════════════════

export const STAFF: StaffMember[] = [
  {
    id: "mayor",
    name: "Lorentii Lisevici",
    role: "Primar",
    phone: "+373 256 73421",
    email: "primar.pociumbauti@gov.md",
    image: "https://picsum.photos/200/200?random=1",
    bio: "Fermier din generație și lider ales al comunității, Lorentii Lisevici conduce Pociumbăuți cu dedicare și viziune pentru viitor. Ales în noiembrie 2023 pe listele PSRM.",
    partid: "PSRM",
    mandatStart: "2023",
    mandatEnd: "2027"
  },
  {
    id: "secretary",
    name: "Irina",
    role: "Secretarul Consiliului Local",
    phone: "+373 256 73196",
    email: "secretar.pociumbauti@gov.md",
    image: "https://picsum.photos/200/200?random=2",
    bio: "Cu peste 20 de ani experiență în administrația publică locală, Irina asigură funcționarea zilnică a primăriei și legătura cu cetățenii."
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
//                         CONSILIUL LOCAL (2023-2027)
// ═══════════════════════════════════════════════════════════════════════════════

export const COUNCIL_MEMBERS: CouncilMember[] = [
  { id: "c1", name: "Consilier 1", partid: "PSRM", functie: "Consilier" },
  { id: "c2", name: "Consilier 2", partid: "PSRM", functie: "Consilier" },
  { id: "c3", name: "Consilier 3", partid: "PSRM", functie: "Consilier" },
  { id: "c4", name: "Consilier 4", partid: "PAS", functie: "Consilier" },
  { id: "c5", name: "Consilier 5", partid: "PAS", functie: "Consilier" },
  { id: "c6", name: "Consilier 6", partid: "PAS", functie: "Consilier" },
  { id: "c7", name: "Consilier 7", partid: "PSDE", functie: "Consilier" },
  { id: "c8", name: "Consilier 8", partid: "PSDE", functie: "Consilier" },
  { id: "c9", name: "Guzun Artur", partid: "Independent", functie: "Consilier" }
];

export const COUNCIL_COMPOSITION = [
  { partid: "PSRM", mandate: 3, procent: 33.3, culoare: "#C8102E" },
  { partid: "PAS", mandate: 3, procent: 33.3, culoare: "#FFD700" },
  { partid: "PSDE", mandate: 2, procent: 22.2, culoare: "#3498db" },
  { partid: "Independent", mandate: 1, procent: 11.1, culoare: "#7F8C8D" }
];

// ═══════════════════════════════════════════════════════════════════════════════
//                         SERVICII PUBLICE
// ═══════════════════════════════════════════════════════════════════════════════

export const SERVICES: Service[] = [
  {
    id: "acte",
    icon: "FileText",
    titlu: "Acte și Certificate",
    descriere: "Eliberare certificate de urbanism, componență familie, titluri de proprietate.",
    documente: ["Certificat de urbanism", "Certificat de componență a familiei", "Extras din registrul agricol"],
    program: "Luni-Vineri 08:00-17:00",
    taxe: true
  },
  {
    id: "social",
    icon: "Users",
    titlu: "Asistență Socială",
    descriere: "Suport pentru persoane vârstnice, ajutor social, compensații pentru perioada rece.",
    documente: ["Cerere ajutor social", "Compensații BASS"],
    program: "Luni-Vineri 08:00-17:00"
  },
  {
    id: "funciar",
    icon: "Home",
    titlu: "Fond Funciar",
    descriere: "Înregistrare contracte arendă, modificări titluri, cadastru.",
    documente: ["Contract de arendă", "Certificat de proprietate", "Extras cadastral"],
    program: "Luni-Vineri 08:00-17:00",
    taxe: true
  },
  {
    id: "salubritate",
    icon: "Truck",
    titlu: "Salubritate",
    descriere: "Gestionare deșeuri, iluminat stradal, întreținere drumuri locale.",
    program: "Permanent"
  },
  {
    id: "stare-civila",
    icon: "Heart",
    titlu: "Stare Civilă",
    descriere: "Înregistrare nașteri, căsătorii, decese. Certificate duplicate.",
    documente: ["Certificat naștere", "Certificat căsătorie", "Certificat deces"],
    program: "Luni-Vineri 08:00-17:00",
    linkExtern: "https://servicii.gov.md"
  },
  {
    id: "autorizatii",
    icon: "FileCheck",
    titlu: "Autorizații și Avize",
    descriere: "Autorizații de construcție, avize pentru activități comerciale.",
    documente: ["Autorizație de construire", "Aviz activitate comercială"],
    program: "Luni-Vineri 08:00-17:00",
    taxe: true
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
//                         EVENIMENTE CULTURALE
// ═══════════════════════════════════════════════════════════════════════════════

export const CULTURAL_EVENTS = [
  {
    id: "hram",
    nume: "Hramul Satului",
    data: "8 noiembrie",
    descriere: "Ziua Sfântului Arhanghel Mihail - patronul bisericii. Liturghie specială, procesiune religioasă, masă comună în curtea bisericii, muzică populară și dansuri tradiționale.",
    traditie: true
  },
  {
    id: "nunta",
    nume: "Festival 'Nunta Moldovenească'",
    data: "August (anual)",
    descriere: "Reconstituire nunți tradiționale cu costume populare, hore, cântece. Participă întreaga comunitate și invitați din raion.",
    traditie: true
  },
  {
    id: "eroi",
    nume: "Ziua Eroilor",
    data: "Mai",
    descriere: "Comemorarea soldaților căzuți în războaie. Depuneri de flori la monument.",
    traditie: true
  },
  {
    id: "craciun",
    nume: "Crăciunul",
    data: "7 ianuarie (stil vechi)",
    descriere: "Sărbătoare religioasă ortodoxă cu colinde tradiționale.",
    traditie: true
  },
  {
    id: "independenta",
    nume: "Ziua Independenței",
    data: "27 august",
    descriere: "Sărbătoare națională cu evenimente în centrul satului.",
    traditie: false
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
//                         BUGET LOCAL
// ═══════════════════════════════════════════════════════════════════════════════

export const BUDGET_DATA = {
  an: 2025,
  total: 3200000, // MDL
  moneda: "MDL",

  venituri: [
    { categorie: "Impozite și taxe locale", suma: 800000, procent: 25 },
    { categorie: "Transferuri de la bugetul de stat", suma: 1600000, procent: 50 },
    { categorie: "Venituri proprii", suma: 400000, procent: 12.5 },
    { categorie: "Alte venituri", suma: 400000, procent: 12.5 }
  ],

  cheltuieli: [
    { categorie: "Administrație publică", suma: 640000, procent: 20 },
    { categorie: "Învățământ", suma: 960000, procent: 30 },
    { categorie: "Cultură", suma: 320000, procent: 10 },
    { categorie: "Infrastructură", suma: 800000, procent: 25 },
    { categorie: "Asistență socială", suma: 320000, procent: 10 },
    { categorie: "Rezervă", suma: 160000, procent: 5 }
  ],

  proiecte: [
    { nume: "Reparație drumuri locale", suma: 400000, status: "planificat" },
    { nume: "Extindere iluminat public", suma: 200000, status: "în execuție" },
    { nume: "Reparație Casa de Cultură", suma: 150000, status: "planificat" }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
//                         DECIZII ȘI DISPOZIȚII (MOCK DATA)
// ═══════════════════════════════════════════════════════════════════════════════

export const LATEST_DECISIONS: Decision[] = [
  {
    id: "dec-24",
    numar: "24",
    data_emitere: "2024-11-30",
    titlu: "Cu privire la aprobarea bugetului local pentru anul 2025",
    descriere: "Consiliul Local aprobă bugetul local pentru anul 2025 în sumă totală de 3.200.000 MDL, conform anexelor la prezenta decizie.",
    tip: "normativ",
    document_pdf: "/documents/decizii/decizie_24_2024.pdf",
    publicat_rsal: true,
    status: "Adoptat"
  },
  {
    id: "dec-23",
    numar: "23",
    data_emitere: "2024-11-15",
    titlu: "Cu privire la înființarea comisiei pentru sărbătorile de iarnă",
    descriere: "Se înființează comisia pentru organizarea sărbătorilor de iarnă în componența a 7 membri, conform anexei.",
    tip: "normativ",
    document_pdf: "/documents/decizii/decizie_23_2024.pdf",
    publicat_rsal: true,
    status: "Adoptat"
  },
  {
    id: "dec-22",
    numar: "22",
    data_emitere: "2024-10-20",
    titlu: "Cu privire la aprobarea Planului de achiziții pentru anul 2025",
    descriere: "Se aprobă Planul anual de achiziții publice pentru anul 2025 conform anexei.",
    tip: "normativ",
    document_pdf: "/documents/decizii/decizie_22_2024.pdf",
    publicat_rsal: true,
    status: "Adoptat"
  },
  {
    id: "dec-21",
    numar: "21",
    data_emitere: "2024-09-25",
    titlu: "Cu privire la reparația drumurilor locale",
    descriere: "Se alocă suma de 400.000 MDL pentru reparația drumurilor locale în anul 2025.",
    tip: "normativ",
    document_pdf: "/documents/decizii/decizie_21_2024.pdf",
    publicat_rsal: true,
    status: "Adoptat"
  }
];

export const LATEST_DISPOSITIONS: Disposition[] = [
  {
    id: "disp-45",
    numar: "45",
    data_emitere: "2024-12-05",
    titlu: "Cu privire la aprobarea graficului de lucru pentru sărbătorile de iarnă",
    descriere: "Se aprobă graficul de funcționare a primăriei în perioada sărbătorilor de iarnă 2024-2025.",
    tip: "normativ",
    document_pdf: "/documents/dispozitii/dispozitie_45_2024.pdf",
    depersonalizat: false,
    publicat_rsal: true
  },
  {
    id: "disp-44",
    numar: "44",
    data_emitere: "2024-11-28",
    titlu: "Cu privire la convocarea ședinței Consiliului Local",
    descriere: "Se convoacă ședința ordinară a Consiliului Local pentru data de 15 decembrie 2024.",
    tip: "normativ",
    document_pdf: "/documents/dispozitii/dispozitie_44_2024.pdf",
    depersonalizat: false,
    publicat_rsal: true
  },
  {
    id: "disp-43",
    numar: "43",
    data_emitere: "2024-11-15",
    titlu: "Cu privire la constituirea comisiei de inventariere",
    descriere: "Se constituie comisia de inventariere a bunurilor primăriei pentru anul 2024.",
    tip: "normativ",
    document_pdf: "/documents/dispozitii/dispozitie_43_2024.pdf",
    depersonalizat: false,
    publicat_rsal: true
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
//                         ANUNȚURI
// ═══════════════════════════════════════════════════════════════════════════════

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "news-1",
    titlu: "Ședința Consiliului Local - 15 decembrie 2024",
    categorie: "sedinta",
    data_publicare: "2024-12-11",
    continut: "Consiliul Local al comunei Pociumbăuți vă invită la ședința ordinară care va avea loc pe data de 15 decembrie 2024, ora 15:00, în sala de ședințe a Primăriei. Pe ordinea de zi: raport de activitate, proiecte pentru 2025, diverse.",
    continut_scurt: "Consiliul Local al comunei Pociumbăuți vă invită la ședința ordinară care va avea loc pe data de 15 decembrie 2024...",
    prioritate: true,
    views: 45
  },
  {
    id: "news-2",
    titlu: "Festival 'Nunta Moldovenească' - ediția 2025",
    categorie: "eveniment",
    data_publicare: "2024-12-10",
    continut: "Grupul de inițiativă 'Pociumbăuțenii' vă invită la Festivalul tradițional 'Nunta Moldovenească', ediția 2025. Evenimentul va avea loc în luna august. Înscrierile pentru participanți sunt deschise!",
    continut_scurt: "Grupul de inițiativă 'Pociumbăuțenii' vă invită la Festivalul tradițional...",
    imagine_url: "https://picsum.photos/800/400?random=11",
    prioritate: true,
    views: 120
  },
  {
    id: "news-3",
    titlu: "Consultări Publice: Buget 2025",
    categorie: "info",
    data_publicare: "2024-12-05",
    continut: "Primăria invită toți locuitorii la dezbateri publice privind proiectul bugetului local pentru anul 2025. Propunerile pot fi depuse până la data de 20 decembrie 2024 la sediul primăriei sau prin email.",
    continut_scurt: "Primăria invită toți locuitorii la dezbateri publice privind proiectul bugetului local...",
    prioritate: true,
    views: 80
  },
  {
    id: "news-4",
    titlu: "Reconstrucția Monumentului Eroilor - Actualizare",
    categorie: "info",
    data_publicare: "2024-12-01",
    continut: "Lucrările de reconstrucție a Monumentului Eroilor din Primul Război Mondial avansează conform planului. Inaugurarea este programată pentru 18 iulie 2025. Mulțumim tuturor donatorilor și voluntarilor!",
    continut_scurt: "Lucrările de reconstrucție a Monumentului Eroilor avansează conform planului...",
    imagine_url: "https://picsum.photos/800/400?random=monument",
    prioritate: false,
    views: 250
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
//                         LINK-URI UTILE (HG 728/2023)
// ═══════════════════════════════════════════════════════════════════════════════

export const USEFUL_LINKS = [
  {
    categorie: "Registre de Stat",
    links: [
      { nume: "RSAL - Registrul de Stat al Actelor Locale", url: "https://actelocale.gov.md", descriere: "Decizii și dispoziții publicate" },
      { nume: "Registrul de Stat", url: "https://asp.gov.md", descriere: "Agenția Servicii Publice" }
    ]
  },
  {
    categorie: "Servicii Electronice",
    links: [
      { nume: "Servicii.gov.md", url: "https://servicii.gov.md", descriere: "Portalul serviciilor publice" },
      { nume: "MTender", url: "https://mtender.gov.md", descriere: "Achiziții publice" },
      { nume: "Particip.gov.md", url: "https://particip.gov.md", descriere: "Consultări publice" },
      { nume: "Cariere.gov.md", url: "https://cariere.gov.md", descriere: "Locuri de muncă în sectorul public" }
    ]
  },
  {
    categorie: "Autorități",
    links: [
      { nume: "Consiliul Raional Rîșcani", url: "https://riscani.md", descriere: "Administrația raională" },
      { nume: "Guvernul Republicii Moldova", url: "https://gov.md", descriere: "Portal guvernamental" },
      { nume: "Cancelaria de Stat", url: "https://cancelaria.gov.md", descriere: "Acte normative" }
    ]
  },
  {
    categorie: "Urgențe",
    links: [
      { nume: "112 - Număr unic de urgență", url: "tel:112", descriere: "Ambulanță, Pompieri, Poliție" },
      { nume: "Poliția Rîșcani", url: "tel:+373256223333", descriere: "Inspectoratul de Poliție" }
    ]
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
//                         ADMIN LOGS (MOCK)
// ═══════════════════════════════════════════════════════════════════════════════

export const MOCK_LOGS: AdminLog[] = [
  { id: 1, user: "Irina", action: "login_success", details: "Autentificare cu succes", timestamp: "2024-12-11 08:30:00", ip: "192.168.1.5" },
  { id: 2, user: "Irina", action: "create_anunt", details: "Publicat anunț: Ședința CL 15.12.2024", timestamp: "2024-12-11 08:45:12", ip: "192.168.1.5" },
  { id: 3, user: "Irina", action: "create_decizie", details: "Publicat decizia nr. 24/2024", timestamp: "2024-12-10 14:20:00", ip: "192.168.1.5" },
  { id: 4, user: "Admin", action: "backup_db", details: "Backup automat baza de date", timestamp: "2024-12-11 00:00:00", ip: "System" },
  { id: 5, user: "Irina", action: "upload_photo", details: "Încărcat 5 fotografii eveniment", timestamp: "2024-12-09 10:15:00", ip: "192.168.1.5" }
];

// ═══════════════════════════════════════════════════════════════════════════════
//                         SIMBOLURI OFICIALE
// ═══════════════════════════════════════════════════════════════════════════════

export const OFFICIAL_SYMBOLS = {
  stema: {
    aprobare: "14 decembrie 2023",
    descriere: "Stema comunei include simboluri agricole (spice de grâu, soare) și elemente istorice (trandafirii familiei Rosetti, potcoava familiei Stroescu).",
    culori: ["Albastru", "Aur", "Verde"],
    semnificatie: "Moldova, prosperitate, natură"
  },
  drapel: {
    aprobare: "14 decembrie 2023",
    descriere: "Drapelul comunei reflectă culorile și simbolurile stemei.",
    culori: ["Albastru", "Aur", "Verde"]
  },
  motto: "Pociumbăuți - 313 ani istorie, o comunitate mândră care merge înainte"
};
