import React, { useState, useEffect } from 'react';
import { 
  Lock, LogOut, Check, AlertTriangle, Eye, EyeOff, 
  FileText, Clipboard, Megaphone, Image as ImageIcon, 
  Shield, Activity, Calendar, Upload, Save, X, ArrowLeft 
} from 'lucide-react';
import { ViewState } from '../types';
import { MOCK_LOGS } from '../constants';

interface Props { highContrast: boolean; setView: (v: ViewState) => void; }

// --- SECURITY UTILITIES SIMULATION ---
const sanitizeInput = (text: string) => {
  return text.replace(/[<>&"']/g, (match) => {
    switch (match) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return match;
    }
  });
};

export const Admin: React.FC<Props> = ({ highContrast, setView }) => {
  // State
  const [internalView, setInternalView] = useState<'login' | 'dashboard' | 'form'>('login');
  const [activeForm, setActiveForm] = useState<string>('');
  
  // Login State - PRE-FILLED FOR TESTING
  const [username, setUsername] = useState('irina');
  const [password, setPassword] = useState('admin');
  const [gdprConsent, setGdprConsent] = useState(false); // GDPR State

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  // Check Lockout on Mount
  useEffect(() => {
    const storedLockout = localStorage.getItem('admin_lockout');
    if (storedLockout) {
      const lockoutTime = parseInt(storedLockout);
      if (Date.now() < lockoutTime) {
        setLockoutUntil(lockoutTime);
        setError("Cont blocat temporar din motive de securitate.");
      } else {
        localStorage.removeItem('admin_lockout');
        setFailedAttempts(0);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // GDPR Check
    if (!gdprConsent) {
      setError("Este necesar acordul GDPR pentru procesarea datelor de autentificare.");
      return;
    }

    // Check Lockout
    if (lockoutUntil) {
      if (Date.now() < lockoutUntil) {
        setError(`Cont blocat. Încercați din nou în ${Math.ceil((lockoutUntil - Date.now()) / 60000)} minute.`);
        return;
      } else {
        setLockoutUntil(null);
        localStorage.removeItem('admin_lockout');
        setFailedAttempts(0);
      }
    }

    setLoading(true);

    // Simulate Network Delay for Security (prevent timing attacks)
    setTimeout(() => {
      // Mock Credentials: irina / admin
      if (username.toLowerCase() === 'irina' && password === 'admin') {
        setInternalView('dashboard');
        setFailedAttempts(0);
        showNotification("Autentificare reușită! Sesiune securizată activă.");
      } else {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        
        if (newAttempts >= 5) {
          const lockoutTime = Date.now() + 15 * 60 * 1000; // 15 mins
          setLockoutUntil(lockoutTime);
          localStorage.setItem('admin_lockout', lockoutTime.toString());
          setError("Prea multe încercări eșuate. Cont blocat pentru 15 minute.");
        } else {
          setError("Nume utilizator sau parolă incorectă.");
        }
      }
      setLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    setInternalView('login');
    setUsername('irina');
    setPassword('admin');
    setGdprConsent(false);
    setError(null);
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const openForm = (type: string) => {
    setActiveForm(type);
    setInternalView('form');
  };

  // --- LOGIN PAGE (SPLIT SCREEN) ---
  if (internalView === 'login') {
    return (
      <div className="min-h-screen flex bg-gray-100 font-sans">
        {/* Left Side - Form */}
        <div className={`w-full lg:w-[40%] flex items-center justify-center p-8 transition-colors ${highContrast ? 'bg-black text-white' : 'bg-white'}`}>
          <div className="w-full max-w-md space-y-8">
             <div className="text-center">
               <div className="flex justify-center mb-4">
                 <Shield className={`w-16 h-16 ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`} />
               </div>
               <h1 className="text-3xl font-bold tracking-tight">Primăria Pociumbăuți</h1>
               <p className="mt-2 text-sm text-gray-500 font-mono">PANOU DE ADMINISTRARE SECURIZAT</p>
             </div>

             {error && (
               <div className="p-4 rounded-md bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 animate-pulse">
                 <AlertTriangle className="flex-shrink-0 mt-0.5" size={18} />
                 <span className="text-sm font-medium">{error}</span>
               </div>
             )}

             <form onSubmit={handleLogin} className="space-y-6">
               <div>
                 <label className="block text-sm font-bold mb-1">Nume Utilizator</label>
                 <input 
                   type="text" 
                   value={username}
                   onChange={e => setUsername(sanitizeInput(e.target.value))}
                   className={`w-full p-3 rounded-lg border outline-none focus:ring-2 transition-all ${highContrast ? 'bg-gray-900 border-yellow-400 text-white' : 'bg-gray-50 border-gray-300 focus:ring-moldova-blue focus:border-transparent'}`}
                   placeholder="Ex: irina"
                   disabled={!!lockoutUntil}
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-bold mb-1">Parolă</label>
                 <div className="relative">
                   <input 
                     type={showPassword ? "text" : "password"}
                     value={password}
                     onChange={e => setPassword(e.target.value)}
                     className={`w-full p-3 rounded-lg border outline-none focus:ring-2 transition-all ${highContrast ? 'bg-gray-900 border-yellow-400 text-white' : 'bg-gray-50 border-gray-300 focus:ring-moldova-blue focus:border-transparent'}`}
                     placeholder="••••••••"
                     disabled={!!lockoutUntil}
                   />
                   <button 
                     type="button" 
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                   >
                     {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                   </button>
                 </div>
               </div>

               {/* GDPR Consent Checkbox */}
               <div className={`p-3 rounded border flex items-start gap-3 ${highContrast ? 'bg-gray-900 border-yellow-400' : 'bg-blue-50 border-blue-100'}`}>
                 <input 
                    type="checkbox" 
                    id="gdpr-consent" 
                    checked={gdprConsent}
                    onChange={(e) => setGdprConsent(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                 />
                 <label htmlFor="gdpr-consent" className="text-xs opacity-80 cursor-pointer">
                    Sunt de acord cu prelucrarea datelor mele personale (IP, username, acțiuni) în jurnalul de audit (Logs) conform Legii nr. 133/2011 privind protecția datelor cu caracter personal.
                 </label>
               </div>

               <div className="flex items-center">
                 <input id="remember" type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300" />
                 <label htmlFor="remember" className="ml-2 text-sm text-gray-500">Ține-mă minte pe acest dispozitiv</label>
               </div>

               <button 
                 type="submit" 
                 disabled={loading || !!lockoutUntil}
                 className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 flex justify-center items-center gap-2
                   ${loading || !!lockoutUntil ? 'bg-gray-400 cursor-not-allowed' : (highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-moldova-blue hover:bg-blue-700')}
                 `}
               >
                 {loading ? <span className="animate-spin-slow h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : <Lock size={18} />}
                 {loading ? 'Se verifică...' : 'Autentificare'}
               </button>
             </form>

             <div className="text-center pt-4 border-t border-gray-100">
               <button onClick={() => setView('home')} className="text-sm text-gray-500 hover:text-gray-900 hover:underline">
                 &larr; Înapoi la site-ul public
               </button>
             </div>
          </div>
        </div>

        {/* Right Side - Branding Image */}
        <div className="hidden lg:block lg:w-[60%] relative overflow-hidden bg-blue-900">
           <img 
             src="https://picsum.photos/1920/1080?random=admin" 
             alt="Pociumbăuți Peisaj" 
             className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
           />
           <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-purple-900/80 flex flex-col justify-center px-16 text-white">
              <h2 className="text-5xl font-bold mb-6">Bine ați revenit!</h2>
              <p className="text-xl max-w-lg leading-relaxed text-blue-100">
                Gestionați cu încredere și siguranță informațiile pentru cei 593 de locuitori ai satul Pociumbăuți.
              </p>
              <div className="mt-12 flex items-center gap-4 text-sm font-mono opacity-60">
                <Shield size={16} /> CONEXIUNE SECURIZATĂ TLS 1.3
              </div>
           </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD & FORMS WRAPPER ---
  return (
    <div className={`min-h-screen ${highContrast ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Top Bar */}
      <header className={`sticky top-0 z-30 shadow-sm ${highContrast ? 'bg-gray-900 border-b border-yellow-400' : 'bg-white'}`}>
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
           <div className="flex items-center gap-3">
             <div className={`p-2 rounded-lg ${highContrast ? 'bg-yellow-400 text-black' : 'bg-blue-50 text-moldova-blue'}`}>
               <Shield size={20} />
             </div>
             <div>
               <h1 className="font-bold leading-tight">Admin Pociumbăuți</h1>
               <p className="text-[10px] opacity-60 font-mono uppercase tracking-wider">Mod Administrator</p>
             </div>
           </div>

           <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 text-sm opacity-70">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Irina (Editor)
             </div>
             <button 
               onClick={handleLogout}
               className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${highContrast ? 'bg-red-900 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}
             >
               <LogOut size={16} /> <span className="hidden sm:inline">Deconectare</span>
             </button>
           </div>
        </div>
      </header>

      {/* Notifications */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 animate-fade-in-up">
           <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3">
              <div className="p-1 bg-white/20 rounded-full"><Check size={20} /></div>
              <span className="font-medium">{notification}</span>
           </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        
        {internalView === 'dashboard' ? (
          <div className="space-y-12">
            
            {/* Welcome */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b pb-8 border-gray-200 dark:border-gray-700">
               <div>
                 <h2 className="text-3xl font-bold mb-2">Bună, Irina!</h2>
                 <p className="opacity-60 flex items-center gap-2">
                   <Calendar size={16} /> {new Date().toLocaleDateString('ro-RO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                 </p>
               </div>
               <div className="flex gap-2">
                 <button className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                   <Activity size={16} /> Vezi Jurnal Activitate
                 </button>
               </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <ActionCard 
                 icon={<Megaphone size={32} />} 
                 title="Publică Anunț" 
                 desc="Noutăți și evenimente" 
                 color="blue" 
                 onClick={() => openForm('anunt')} 
                 highContrast={highContrast}
               />
               <ActionCard 
                 icon={<FileText size={32} />} 
                 title="Publică Decizie" 
                 desc="Acte Consiliul Local" 
                 color="gold" 
                 onClick={() => openForm('decizie')} 
                 highContrast={highContrast}
               />
               <ActionCard 
                 icon={<Clipboard size={32} />} 
                 title="Dispoziție" 
                 desc="Acte Primar" 
                 color="green" 
                 onClick={() => openForm('dispozitie')} 
                 highContrast={highContrast}
               />
               <ActionCard 
                 icon={<ImageIcon size={32} />} 
                 title="Fotografii" 
                 desc="Galerie Media" 
                 color="purple" 
                 onClick={() => openForm('foto')} 
                 highContrast={highContrast}
               />
            </div>

            {/* Stats & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Stats */}
               <div className={`p-6 rounded-xl border ${highContrast ? 'bg-gray-900 border-yellow-400' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <h3 className="font-bold text-lg mb-6">Statistici Astăzi</h3>
                  <div className="space-y-6">
                    <StatRow label="Vizitatori Unici" value="42" change="+5%" />
                    <StatRow label="Vizualizări Anunțuri" value="128" change="+12%" />
                    <StatRow label="Documente Descărcate" value="15" change="-2%" />
                  </div>
               </div>

               {/* Activity Log */}
               <div className={`lg:col-span-2 p-6 rounded-xl border ${highContrast ? 'bg-gray-900 border-yellow-400' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                    <Activity size={20} className="text-gray-400" /> Activitate Recentă
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left opacity-50 border-b">
                          <th className="pb-3 font-medium">Ora</th>
                          <th className="pb-3 font-medium">Utilizator</th>
                          <th className="pb-3 font-medium">Acțiune</th>
                          <th className="pb-3 font-medium">Detalii</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {MOCK_LOGS.map(log => (
                          <tr key={log.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800">
                             <td className="py-3 font-mono text-xs opacity-70">{log.timestamp.split(' ')[1]}</td>
                             <td className="py-3 font-bold">{log.user}</td>
                             <td className="py-3">
                               <span className="px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-700 font-medium">
                                 {log.action}
                               </span>
                             </td>
                             <td className="py-3 opacity-80">{log.details}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>
            </div>

          </div>
        ) : (
          <FormView 
            type={activeForm} 
            onBack={() => setInternalView('dashboard')} 
            onSuccess={() => {
              showNotification("Salvat cu succes! (Simulare)");
              setInternalView('dashboard');
            }}
            highContrast={highContrast}
          />
        )}

      </main>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const ActionCard = ({ icon, title, desc, color, onClick, highContrast }: any) => {
  const colorClasses: Record<string, string> = {
    blue: highContrast ? 'bg-blue-900 border-yellow-400' : 'bg-blue-600',
    gold: highContrast ? 'bg-yellow-600 border-yellow-400' : 'bg-yellow-500',
    green: highContrast ? 'bg-green-900 border-yellow-400' : 'bg-green-600',
    purple: highContrast ? 'bg-purple-900 border-yellow-400' : 'bg-purple-600',
  };

  return (
    <button 
      onClick={onClick}
      className={`relative overflow-hidden p-6 rounded-2xl text-white text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group ${colorClasses[color]} ${highContrast ? 'border-2' : 'shadow-lg'}`}
    >
      <div className="relative z-10 flex flex-col h-full justify-between h-32">
        <div className="p-3 bg-white/20 rounded-xl w-fit backdrop-blur-sm">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-sm opacity-90">{desc}</p>
        </div>
      </div>
      <div className="absolute -right-4 -bottom-4 opacity-10 transform rotate-12 scale-150 group-hover:scale-175 transition-transform duration-500">
        {icon}
      </div>
    </button>
  );
};

const StatRow = ({ label, value, change }: any) => (
  <div className="flex justify-between items-center">
    <span className="opacity-70 font-medium">{label}</span>
    <div className="text-right">
      <span className="block text-2xl font-bold">{value}</span>
      <span className={`text-xs font-bold ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
        {change} față de ieri
      </span>
    </div>
  </div>
);

// --- SIMULATED FORM VIEW (Replaces TinyMCE with secure layout) ---
const FormView = ({ type, onBack, onSuccess, highContrast }: any) => {
  const [loading, setLoading] = useState(false);
  const titleMap: Record<string, string> = {
    anunt: "Publică Anunț Nou",
    decizie: "Înregistrează Decizie CL",
    dispozitie: "Înregistrează Dispoziție Primar",
    foto: "Încarcă Fotografii"
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate server processing
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1500);
  };

  return (
    <div className="animate-fade-in-up">
      <button onClick={onBack} className="flex items-center gap-2 mb-6 opacity-60 hover:opacity-100 font-bold">
        <ArrowLeft size={20} /> Anulează și Îmapoi
      </button>

      <div className={`p-8 rounded-2xl shadow-xl ${highContrast ? 'bg-gray-900 border border-yellow-400' : 'bg-white'}`}>
         <div className="flex justify-between items-start mb-8 border-b pb-4">
            <h2 className="text-2xl font-bold">{titleMap[type]}</h2>
            <div className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded opacity-60">
               SECURE FORM
            </div>
         </div>

         <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Conditional Fields based on Type */}
            {(type === 'decizie' || type === 'dispozitie') && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-2">Număr Document</label>
                    <input type="text" className="w-full p-3 rounded-lg border bg-gray-50 focus:bg-white transition-colors" placeholder="ex: 24/05" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Data Emiterii</label>
                    <input type="date" className="w-full p-3 rounded-lg border bg-gray-50 focus:bg-white transition-colors" required />
                  </div>
               </div>
            )}

            <div>
               <label className="block text-sm font-bold mb-2">Titlu / Subiect</label>
               <input type="text" className="w-full p-3 rounded-lg border bg-gray-50 focus:bg-white transition-colors font-medium text-lg" placeholder="Introduceți titlul complet..." required />
            </div>

            {type === 'anunt' && (
               <div>
                  <label className="block text-sm font-bold mb-2">Categorie</label>
                  <select className="w-full p-3 rounded-lg border bg-gray-50 focus:bg-white transition-colors">
                     <option>Alege Categoria...</option>
                     <option>Ședință Publică</option>
                     <option>Eveniment Cultural</option>
                     <option>Anunț Important</option>
                     <option>Achiziție Publică</option>
                  </select>
               </div>
            )}

            {type !== 'foto' && (
               <div>
                  <label className="block text-sm font-bold mb-2">Conținut (Editor Text)</label>
                  <div className="border rounded-lg overflow-hidden focus-within:ring-2 ring-blue-500 transition-shadow">
                     <div className="bg-gray-50 border-b p-2 flex gap-2">
                        <button type="button" className="p-1 hover:bg-gray-200 rounded font-bold">B</button>
                        <button type="button" className="p-1 hover:bg-gray-200 rounded italic">I</button>
                        <button type="button" className="p-1 hover:bg-gray-200 rounded underline">U</button>
                        <div className="w-px h-6 bg-gray-300 mx-2"></div>
                        <button type="button" className="p-1 hover:bg-gray-200 rounded text-sm">Listă</button>
                     </div>
                     <textarea 
                       className="w-full p-4 h-48 outline-none resize-y" 
                       placeholder="Scrieți textul aici..." 
                       required
                     ></textarea>
                  </div>
                  <p className="text-xs mt-1 opacity-60">Toate caracterele speciale vor fi sanitizate automat.</p>
               </div>
            )}

            {/* File Upload Simulation */}
            <div className="bg-blue-50/50 dark:bg-gray-800 p-6 rounded-xl border-2 border-dashed border-blue-200 dark:border-gray-700 text-center">
               <Upload className="mx-auto mb-2 text-blue-500" size={32} />
               <h4 className="font-bold mb-1">Atașează Fișiere</h4>
               <p className="text-sm opacity-70 mb-4">
                 {type === 'foto' ? 'JPG, PNG (Max 5MB)' : 'PDF, DOCX (Max 10MB)'}
               </p>
               <button type="button" className="px-4 py-2 bg-white dark:bg-black border rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50">
                 Selectează de pe Calculator
               </button>
            </div>

            {/* Security Notice */}
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 p-3 rounded">
               <Lock size={12} />
               <span>Acțiunea va fi înregistrată în jurnalul de audit cu IP-ul dvs.</span>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t">
               <button 
                 type="submit" 
                 disabled={loading}
                 className={`flex-1 py-4 rounded-lg font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all hover:-translate-y-1
                   ${loading ? 'bg-gray-400 cursor-not-allowed' : (highContrast ? 'bg-yellow-400 text-black' : 'bg-moldova-blue text-white hover:bg-blue-700')}
                 `}
               >
                 {loading ? 'Se procesează...' : (
                   <><Save size={20} /> Publică Acum</>
                 )}
               </button>
            </div>

         </form>
      </div>
    </div>
  );
};