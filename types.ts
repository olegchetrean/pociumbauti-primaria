// ═══════════════════════════════════════════════════════════════════════════════
//                         VIEW STATE - NAVIGARE
// ═══════════════════════════════════════════════════════════════════════════════

export type ViewState =
  | 'home'
  | 'administration'
  | 'documents'
  | 'history'
  | 'contact'
  | 'services'
  | 'transparency'
  | 'geography'
  | 'economy'
  | 'institutions'
  | 'admin'
  | 'admin-dashboard'
  | 'admin-publish-anunt'
  | 'admin-publish-decizie'
  | 'admin-publish-dispozitie';

// ═══════════════════════════════════════════════════════════════════════════════
//                         TIPURI BAZĂ DE DATE
// ═══════════════════════════════════════════════════════════════════════════════

export interface User {
  id: number;
  username: string;
  full_name: string;
  role: 'admin' | 'editor' | 'viewer';
  last_login?: string;
}

export interface Announcement {
  id: string;
  titlu: string;
  categorie: 'general' | 'sedinta' | 'eveniment' | 'info' | 'achizitie' | 'concurs' | 'urgenta';
  data_publicare: string;
  continut: string;
  continut_scurt: string;
  document_url?: string;
  imagine_url?: string;
  prioritate: boolean;
  views: number;
}

export interface Decision {
  id: string;
  numar: string;
  data_emitere: string;
  titlu: string;
  descriere: string;
  tip: 'normativ' | 'individual';
  document_pdf: string;
  publicat_rsal: boolean;
  status: 'Adoptat' | 'În proiect' | 'Abrogat';
}

export interface Disposition {
  id: string;
  numar: string;
  data_emitere: string;
  titlu: string;
  descriere: string;
  tip: 'normativ' | 'personal';
  document_pdf: string;
  depersonalizat: boolean;
  publicat_rsal: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  image?: string;
  bio?: string;
  previousActivity?: string;
  partid?: string;
  mandatStart?: string;
  mandatEnd?: string;
}

export interface CouncilMember {
  id: string;
  name: string;
  partid: string;
  functie: string;
  telefon?: string;
  email?: string;
  image?: string;
}

export interface ContactInfo {
  address: string;
  postalCode?: string;
  phoneMayor: string;
  phoneSecretary: string;
  email: string;
  emailMayor?: string;
  emailSecretary?: string;
  schedule: string;
  audiences: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  emergencyPhone?: string;
  distances?: {
    chisinau: string;
    riscani: string;
    balti: string;
    frontieraUcraina: string;
  };
}

export interface AdminLog {
  id: number;
  user: string;
  action: string;
  details: string;
  timestamp: string;
  ip: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
//                         TIPURI GEOGRAFIE
// ═══════════════════════════════════════════════════════════════════════════════

export interface GeographyData {
  numeOficial: string;
  numeCyrillic: string;
  alias: string;
  raion: string;
  regiune: string;
  fusOrar: string;

  coordonate: {
    lat: number;
    lng: number;
  };

  relief: {
    tip: string;
    altitudine: string;
    topografie: string;
    sol: string;
    cursuriApa: string;
  };

  climat: {
    tip: string;
    vara: string;
    iarna: string;
    precipitatii: string;
    vanturi: string;
  };

  peisaj: Array<{
    emoji: string;
    descriere: string;
  }>;

  flora: string[];
  fauna: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
//                         TIPURI DEMOGRAFIE
// ═══════════════════════════════════════════════════════════════════════════════

export interface DemographyData {
  populatieTotal: number;
  dataRecensament: string;
  populatieEstimata2024: number;
  gospodarii: number;

  structuraGen: {
    barbati: { numar: number; procent: number };
    femei: { numar: number; procent: number };
  };

  structuraVarsta: {
    copii: { interval: string; numar: number; procent: number };
    adulti: { interval: string; numar: number; procent: number };
    varstnici: { interval: string; numar: number; procent: number };
  };

  varstaMediana: number;

  componentaEtnica: Array<{
    etnie: string;
    numar: number;
    procent: number;
  }>;

  limbaMaterna: Array<{
    limba: string;
    procent: number;
  }>;

  religie: Array<{
    confesiune: string;
    procent: number;
  }>;

  educatie: Array<{
    nivel: string;
    procent: number;
  }>;

  migratie: {
    trend: string;
    evolutie: string;
    diaspora: string;
    destinatii: Array<{
      tara: string;
      procent: number;
      orase?: string;
    }>;
    remitente: string;
  };

  natalitate: {
    nasteriPeAn: string;
    decesePeAn: string;
    soldNatural: string;
  };

  sperantaViata: {
    barbati: number;
    femei: number;
    medie: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
//                         TIPURI INFRASTRUCTURĂ
// ═══════════════════════════════════════════════════════════════════════════════

export interface InfrastructureData {
  drumuri: {
    drumPrincipal: string;
    stare: string;
    lungimeRetea: string;
    trotuare: string;
    iluminatPublic: string;
  };

  transportPublic: Array<{
    ruta: string;
    frecventa: string;
    durata?: string;
  }>;

  apaCanalizare: {
    reteaApa: { acoperire: number; nota: string };
    apaDinFantani: { acoperire: number; nota: string };
    canalizare: { acoperire: number; nota: string };
    faraCanalizare: { acoperire: number; nota: string };
    statiiEpurare: string;
  };

  energieElectrica: {
    acoperire: number;
    furnizor: string;
    tensiune: string;
    intreruperi: string;
  };

  gazNatural: {
    reteaGaz: boolean;
    incalzire: Array<{
      tip: string;
      procent: number;
    }>;
    gatit: string;
  };

  telecomInternet: {
    telefonieFixa: { operator: string; penetrare: number };
    telefonieMobila: Array<{
      operator: string;
      acoperire: string;
    }>;
    internetFix: {
      operator: string;
      viteza: string;
      penetrare: number;
    };
    vitezaMedie: string;
    wifiPublic: string;
  };

  salubritate: {
    colectareGunoi: string;
    tomberoane: string;
    reciclare: string;
    gropaGunoi: string;
  };

  cimitir: {
    locatie: string;
    suprafata: string;
    capela: string;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
//                         TIPURI ISTORIC
// ═══════════════════════════════════════════════════════════════════════════════

export interface HistoryEvent {
  year: string;
  title: string;
  description: string;
  period: string;
  important?: boolean;
  image?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
//                         TIPURI ECONOMIE
// ═══════════════════════════════════════════════════════════════════════════════

export interface EconomyData {
  sectoare: Array<{
    sector: string;
    procent: number;
  }>;

  agricultura: {
    suprafataAgricola: string;
    terenArabil: string;
    pasuni: string;
    viiLivezi: string;

    culturiPrincipale: Array<{
      cultura: string;
      suprafata: number;
      randament: string;
      pret: string;
    }>;

    zootehnie: Array<{
      animal: string;
      numar: string;
      nota: string;
    }>;

    mecanizare: {
      tractoare: string;
      combine: string;
      probleme: string;
    };
  };

  agentiEconomici: {
    fermeFamiliale: string;
    srlAgricole: string;
    magazineAlimentare: number;
    barCafenea: number;
    brutarie: number;
    farmacie: number;
    statieBenzina: number;
  };

  venituri: {
    venitMediuGospodarie: string;
    surse: Array<{
      sursa: string;
      suma: string;
    }>;
  };

  salarii: Array<{
    functie: string;
    salariu: string;
  }>;

  pensii: {
    medie: string;
    maxima: string;
    minima: string;
  };

  probleme: string[];
  oportunitati: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
//                         TIPURI INSTITUȚII
// ═══════════════════════════════════════════════════════════════════════════════

export interface Institution {
  id: string;
  nume: string;
  tip: string;
  adresa?: string;
  telefon?: string;
  email?: string;
  program?: string;
  descriere: string;
  personal?: number;
  status?: string;
  detalii?: Record<string, any>;
}

// ═══════════════════════════════════════════════════════════════════════════════
//                         TIPURI SERVICII
// ═══════════════════════════════════════════════════════════════════════════════

export interface Service {
  id: string;
  icon: string;
  titlu: string;
  descriere: string;
  documente?: string[];
  program?: string;
  taxe?: boolean;
  linkExtern?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
//                         TIPURI BUGET
// ═══════════════════════════════════════════════════════════════════════════════

export interface BudgetItem {
  categorie: string;
  suma: number;
  procent: number;
}

export interface BudgetProject {
  nume: string;
  suma: number;
  status: 'planificat' | 'în execuție' | 'finalizat';
}

export interface BudgetData {
  an: number;
  total: number;
  moneda: string;
  venituri: BudgetItem[];
  cheltuieli: BudgetItem[];
  proiecte: BudgetProject[];
}

// ═══════════════════════════════════════════════════════════════════════════════
//                         TIPURI EVENIMENTE CULTURALE
// ═══════════════════════════════════════════════════════════════════════════════

export interface CulturalEvent {
  id: string;
  nume: string;
  data: string;
  descriere: string;
  traditie: boolean;
  imagine?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
//                         TIPURI LINK-URI UTILE
// ═══════════════════════════════════════════════════════════════════════════════

export interface UsefulLink {
  nume: string;
  url: string;
  descriere: string;
}

export interface UsefulLinkCategory {
  categorie: string;
  links: UsefulLink[];
}

// ═══════════════════════════════════════════════════════════════════════════════
//                         TIPURI SIMBOLURI OFICIALE
// ═══════════════════════════════════════════════════════════════════════════════

export interface OfficialSymbols {
  stema: {
    aprobare: string;
    descriere: string;
    culori: string[];
    semnificatie: string;
  };
  drapel: {
    aprobare: string;
    descriere: string;
    culori: string[];
  };
  motto: string;
}
