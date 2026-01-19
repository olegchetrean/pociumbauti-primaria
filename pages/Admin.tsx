import React, { useState, useEffect } from 'react';
import { 
  Lock, LogOut, Check, AlertTriangle, Eye, EyeOff, 
  FileText, Clipboard, Megaphone, Image as ImageIcon, 
  Shield, Activity, Calendar, Upload, Save, X, ArrowLeft 
} from 'lucide-react';
import { ViewState } from '../types';

interface Props { highContrast: boolean; setView: (v: ViewState) => void; }

export const Admin: React.FC<Props> = ({ highContrast, setView }) => {
  const [internalView, setInternalView] = useState<'login' | 'dashboard' | 'form'>('login');
  const [activeForm, setActiveForm] = useState<string>('');
  
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [gdprConsent, setGdprConsent] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Announcement Form State
  const [formData, setFormData] = useState({
    titlu: '',
    categorie: 'general',
    data_publicare: new Date().toISOString().split('T')[0], // Auto-set to today
    continut: '',
    continut_scurt: '',
    prioritate: true, // Always true - show on homepage
    vizibil: true // Always true - published
  });
  const [formImage, setFormImage] = useState<File | null>(null);
  const [formImagePreview, setFormImagePreview] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Announcements list for dashboard
  const [announcementsList, setAnnouncementsList] = useState<any[]>([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);

  // Sync URL with internal view
  useEffect(() => {
    const path = window.location.pathname;
    
    // Update URL based on internal view
    if (internalView === 'login' && path !== '/admin') {
      window.history.replaceState({}, '', '/admin');
    } else if (internalView === 'dashboard' && path !== '/admin/dashboard') {
      window.history.replaceState({}, '', '/admin/dashboard');
    } else if (internalView === 'form' && activeForm) {
      const formPath = `/admin/${activeForm}`;
      if (path !== formPath) {
        window.history.replaceState({}, '', formPath);
      }
    }
  }, [internalView, activeForm]);

  // Handle URL changes (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      
      if (path === '/admin' || path === '/admin/') {
        if (isAuthenticated) {
          setInternalView('dashboard');
        } else {
          setInternalView('login');
        }
      } else if (path.startsWith('/admin/dashboard')) {
        if (isAuthenticated) {
          setInternalView('dashboard');
        } else {
          setInternalView('login');
          window.history.replaceState({}, '', '/admin');
        }
      } else if (path.startsWith('/admin/anunt')) {
        if (isAuthenticated) {
          setActiveForm('anunt');
          setInternalView('form');
        } else {
          setInternalView('login');
          window.history.replaceState({}, '', '/admin');
        }
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuthenticated]);

  // Fetch CSRF token on mount and when authenticated
  useEffect(() => {
    const fetchCsrf = async () => {
      try {
        // Try admin CSRF endpoint first if authenticated, otherwise use auth endpoint
        const endpoint = isAuthenticated ? '/admin/csrf' : '/auth/csrf';
        const res = await fetch(endpoint, {
          credentials: 'include', // Important: include cookies for session
          method: 'GET'
        });
        
        if (!res.ok) {
          console.error('CSRF fetch failed:', res.status);
          return;
        }
        
        const data = await res.json();
        if (data.csrf_token) {
          setCsrfToken(data.csrf_token);
        }
      } catch (err) {
        console.error('CSRF fetch error:', err);
      }
    };
    
    fetchCsrf();
  }, [isAuthenticated, internalView]); // Also refresh when view changes (e.g., opening form)

  // Check auth status
  useEffect(() => {
    fetch('/auth/status', { credentials: 'include' })
      .then(res => {
        if (!res.ok) {
          console.error('Auth status check failed:', res.status);
          return { authenticated: false };
        }
        return res.json();
      })
      .then(data => {
        if (data.authenticated) {
          setIsAuthenticated(true);
          setUser(data.user);
          // Check URL to determine initial view
          const path = window.location.pathname;
          if (path.startsWith('/admin/dashboard')) {
            setInternalView('dashboard');
          } else if (path.startsWith('/admin/anunt')) {
            setActiveForm('anunt');
            setInternalView('form');
          } else {
            setInternalView('dashboard');
            window.history.replaceState({}, '', '/admin/dashboard');
          }
        } else {
          setInternalView('login');
          window.history.replaceState({}, '', '/admin');
        }
      })
      .catch(err => {
        console.error('Auth check error:', err);
        // If backend is not available, show login page
        setInternalView('login');
        window.history.replaceState({}, '', '/admin');
      });
  }, []);

  // Fetch announcements for dashboard
  useEffect(() => {
    if (isAuthenticated && internalView === 'dashboard') {
      const fetchAnnouncements = async () => {
        try {
          setLoadingAnnouncements(true);
          const response = await fetch('/admin/anunturi', { credentials: 'include' });
          if (response.ok) {
            const data = await response.json();
            const anunturi = data.anunturi || [];
            // Explicitly sort by date (newest first), then by ID (highest first)
            const sorted = [...anunturi].sort((a, b) => {
              const dateA = new Date(a.data_publicare).getTime();
              const dateB = new Date(b.data_publicare).getTime();
              if (dateB !== dateA) {
                return dateB - dateA; // Newer dates first
              }
              return b.id - a.id; // Higher ID first if dates are equal
            });
            setAnnouncementsList(sorted);
            setCurrentPage(1); // Reset to first page when loading
          } else {
            console.error('Failed to fetch announcements:', response.status, response.statusText);
            const errorData = await response.json().catch(() => ({}));
            console.error('Error data:', errorData);
          }
        } catch (err) {
          console.error('Error fetching announcements:', err);
        } finally {
          setLoadingAnnouncements(false);
        }
      };
      fetchAnnouncements();
    }
  }, [isAuthenticated, internalView]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError("Completați ambele câmpuri.");
      return;
    }

    setLoading(true);

    try {
      
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Critical for session cookies
        body: JSON.stringify({
          username: username.trim(),
          password,
          remember: true,
          csrf_token: csrfToken
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsAuthenticated(true);
        setUser(data.user);
        setInternalView('dashboard');
        window.history.pushState({}, '', '/admin/dashboard');
        showNotification("Autentificare reușită! Sesiune securizată activă.");
      } else {
        setError(data.error || "Nume utilizator sau parolă incorectă.");
      }
    } catch (err) {
      setError("Eroare de conexiune. Verificați că backend-ul rulează pe portul 3001.");
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error('Logout error:', err);
    }
    
    setIsAuthenticated(false);
    setUser(null);
    setInternalView('login');
    setUsername('');
    setPassword('');
    setError(null);
    window.history.pushState({}, '', '/admin');
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const resetForm = () => {
    setFormData({
      titlu: '',
      categorie: 'general',
      data_publicare: new Date().toISOString().split('T')[0], // Auto-set to today
      continut: '',
      continut_scurt: '',
      prioritate: true, // Always true - show on homepage
      vizibil: true // Always true - published
    });
    setFormImage(null);
    setFormImagePreview(null);
    setError(null);
  };

  const openForm = (type: string) => {
    setActiveForm(type);
    setInternalView('form');
    resetForm();
    setEditingAnnouncement(null);
    window.history.pushState({}, '', `/admin/${type}`);
  };

  const handleEditAnnouncement = async (id: number) => {
    try {
      // Refresh CSRF token before editing
      const csrfRes = await fetch('/admin/csrf', { credentials: 'include' });
      if (csrfRes.ok) {
        const csrfData = await csrfRes.json();
        setCsrfToken(csrfData.csrf_token);
      }

      const response = await fetch(`/admin/anunturi/${id}`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        const ann = data.anunt;
        // Format date properly - extract only date part (YYYY-MM-DD)
        let formattedDate = ann.data_publicare;
        if (formattedDate) {
          // If it's a string with time, extract only date part
          if (typeof formattedDate === 'string') {
            formattedDate = formattedDate.split('T')[0].split(' ')[0];
          } else if (formattedDate instanceof Date) {
            // If it's a Date object, format it using local timezone
            const year = formattedDate.getFullYear();
            const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
            const day = String(formattedDate.getDate()).padStart(2, '0');
            formattedDate = `${year}-${month}-${day}`;
          }
        } else {
          // Fallback to today if no date
          const today = new Date();
          const year = today.getFullYear();
          const month = String(today.getMonth() + 1).padStart(2, '0');
          const day = String(today.getDate()).padStart(2, '0');
          formattedDate = `${year}-${month}-${day}`;
        }
        
        
        setFormData({
          titlu: ann.titlu || '',
          categorie: ann.categorie || 'general',
          data_publicare: formattedDate,
          continut: ann.continut || '',
          continut_scurt: ann.continut_scurt || '',
          prioritate: Boolean(ann.prioritate),
          vizibil: Boolean(ann.vizibil)
        });
        setEditingAnnouncement(ann);
        setActiveForm('anunt');
        setInternalView('form');
        window.history.pushState({}, '', `/admin/anunt`);
      } else {
        showNotification('Eroare la încărcarea anunțului');
      }
    } catch (err) {
      console.error('Error loading announcement:', err);
      showNotification('Eroare la încărcarea anunțului');
    }
  };

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFormLoading(true);

    try {
      // Get CSRF token if not available (use admin endpoint since we're authenticated)
      let token = csrfToken;
      if (!token) {
        const csrfRes = await fetch('/admin/csrf', { credentials: 'include' });
        if (!csrfRes.ok) {
          throw new Error('Failed to get CSRF token');
        }
        const csrfData = await csrfRes.json();
        token = csrfData.csrf_token;
        setCsrfToken(token);
      }

      // Prepare form data
      const formDataToSend = new FormData();
      formDataToSend.append('titlu', formData.titlu);
      formDataToSend.append('categorie', formData.categorie);
      // Always use today's date for new announcements, keep existing date for edits
      // Make sure date is in YYYY-MM-DD format (no time component)
      let dateToSend: string;
      if (editingAnnouncement) {
        // For edits, use the date from formData (which was set from editingAnnouncement)
        // Extract only date part if it contains time
        dateToSend = formData.data_publicare;
        if (dateToSend && dateToSend.includes('T')) {
          dateToSend = dateToSend.split('T')[0];
        }
        if (dateToSend && dateToSend.includes(' ')) {
          dateToSend = dateToSend.split(' ')[0];
        }
      } else {
        // For new announcements, always use today's date
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        dateToSend = `${year}-${month}-${day}`;
      }
      formDataToSend.append('data_publicare', dateToSend);
      formDataToSend.append('continut', formData.continut);
      formDataToSend.append('continut_scurt', formData.continut_scurt);
      formDataToSend.append('prioritate', '1'); // Always true - show on homepage
      formDataToSend.append('vizibil', '1'); // Always true - published
      formDataToSend.append('csrf_token', token);

      if (formImage) {
        formDataToSend.append('imagine', formImage);
      }

      // Use edit endpoint if editing, otherwise publish endpoint
      const endpoint = editingAnnouncement ? '/admin/anunturi/edit' : '/admin/anunturi/publish';
      if (editingAnnouncement) {
        formDataToSend.append('id', editingAnnouncement.id.toString());
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showNotification(editingAnnouncement ? 'Anunțul a fost actualizat cu succes!' : 'Anunțul a fost publicat cu succes!');
        resetForm();
        setEditingAnnouncement(null);
        // Refresh announcements list
        const refreshResponse = await fetch('/admin/anunturi', { credentials: 'include' });
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          setAnnouncementsList(refreshData.anunturi || []);
          setCurrentPage(1); // Reset to first page after update
        }
        setTimeout(() => {
          setInternalView('dashboard');
          window.history.pushState({}, '', '/admin/dashboard');
        }, 1500);
      } else {
        setError(data.error || (editingAnnouncement ? 'Eroare la actualizarea anunțului' : 'Eroare la publicarea anunțului'));
      }
    } catch (err) {
      console.error('Error submitting announcement:', err);
      setError('Eroare de conexiune. Verificați că backend-ul rulează.');
    } finally {
      setFormLoading(false);
    }
  };

  // --- LOGIN PAGE ---
  if (internalView === 'login') {
    return (
      <div className="min-h-screen flex bg-gray-100 font-sans">
        <div className={`w-full lg:w-[40%] flex items-center justify-center p-8 transition-colors ${highContrast ? 'bg-black text-white' : 'bg-white'}`}>
          <div className="w-full max-w-md space-y-8">
             <div className="text-center">
               <div className="flex justify-center mb-4">
                 <Shield className={`w-16 h-16 ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`} />
               </div>
               <h1 className="text-3xl font-bold tracking-tight">Primăria Pociumbăuți</h1>
               <p className="mt-2 text-sm text-gray-500 font-mono">PANOU DE ADMINISTRARE SECURIZAT</p>
               <p className="mt-1 text-xs text-gray-400">Versiune JavaScript Backend</p>
             </div>

             {error && (
               <div className="p-4 rounded-md bg-red-50 border border-red-200 flex items-start gap-3 text-red-700">
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
                   onChange={(e) => setUsername(e.target.value)}
                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-moldova-blue focus:border-transparent"
                   required
                   autoFocus
                 />
               </div>

               <div>
                 <label className="block text-sm font-bold mb-1">Parolă</label>
                 <div className="relative">
                   <input 
                     type={showPassword ? 'text' : 'password'}
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-moldova-blue focus:border-transparent pr-10"
                     required
                   />
                   <button
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                   >
                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                   </button>
                 </div>
               </div>

               <button
                 type="submit"
                 disabled={loading}
                 className={`w-full py-3 rounded-md font-bold text-white transition-colors ${
                   loading 
                     ? 'bg-gray-400 cursor-not-allowed' 
                     : highContrast 
                       ? 'bg-yellow-400 text-black hover:bg-yellow-500' 
                       : 'bg-moldova-blue hover:bg-blue-700'
                 }`}
               >
                 {loading ? 'Se autentifică...' : 'Autentificare'}
               </button>
             </form>

             <div className="text-center text-xs text-gray-500">
               <p>Gestionați cu încredere și siguranță informațiile pentru cei 593 de locuitori ai satul Pociumbăuți.</p>
             </div>
          </div>
        </div>

        <div className="hidden lg:flex lg:w-[60%] bg-gradient-to-br from-blue-600 to-blue-800 items-center justify-center p-12 text-white">
          <div className="text-center max-w-md">
            <Shield className="w-24 h-24 mx-auto mb-6 opacity-80" />
            <h2 className="text-4xl font-bold mb-4">Bine ați revenit!</h2>
            <p className="text-lg opacity-90 mb-6">
              Gestionați cu încredere informațiile satul Pociumbăuți
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD ---
  if (internalView === 'dashboard') {
    return (
      <div className={`min-h-screen p-8 ${highContrast ? 'bg-black text-white' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className={`text-3xl font-bold ${highContrast ? 'text-yellow-400' : 'text-gray-900'}`}>
                Panou de Administrare
              </h1>
              <p className={`mt-2 ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                Bine ați venit, {user?.full_name || user?.username}!
              </p>
            </div>
            <button
              onClick={handleLogout}
              className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                highContrast 
                  ? 'bg-yellow-400 text-black hover:bg-yellow-500' 
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              <LogOut size={18} />
              Deconectare
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={`p-6 rounded-lg ${highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>Anunțuri Active</p>
                  <p className={`text-2xl font-bold mt-2 ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>
                    {loadingAnnouncements ? '-' : announcementsList.filter(a => a.vizibil).length}
                  </p>
                </div>
                <Megaphone className={`w-12 h-12 ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'} opacity-50`} />
              </div>
            </div>
            <div className={`p-6 rounded-lg ${highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>Total Anunțuri</p>
                  <p className={`text-2xl font-bold mt-2 ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}>
                    {loadingAnnouncements ? '-' : announcementsList.length}
                  </p>
                </div>
                <FileText className={`w-12 h-12 ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'} opacity-50`} />
              </div>
            </div>
          </div>

          {/* Announcements List */}
          <div className={`p-6 rounded-lg ${highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow'} mb-8`}>
            <h2 className={`text-xl font-bold mb-4 ${highContrast ? 'text-yellow-400' : 'text-gray-900'}`}>
              Lista Anunțuri
            </h2>
            {loadingAnnouncements ? (
              <p className={`${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>Se încarcă...</p>
            ) : announcementsList.length === 0 ? (
              <p className={`${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>Nu există anunțuri.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${highContrast ? 'border-gray-700' : 'border-gray-200'}`}>
                      <th className={`text-left py-3 px-4 ${highContrast ? 'text-yellow-400' : 'text-gray-700'}`}>Titlu</th>
                      <th className={`text-left py-3 px-4 ${highContrast ? 'text-yellow-400' : 'text-gray-700'}`}>Categorie</th>
                      <th className={`text-left py-3 px-4 ${highContrast ? 'text-yellow-400' : 'text-gray-700'}`}>Data</th>
                      <th className={`text-left py-3 px-4 ${highContrast ? 'text-yellow-400' : 'text-gray-700'}`}>Status</th>
                      <th className={`text-left py-3 px-4 ${highContrast ? 'text-yellow-400' : 'text-gray-700'}`}>Vizualizări</th>
                      <th className={`text-left py-3 px-4 ${highContrast ? 'text-yellow-400' : 'text-gray-700'}`}>Acțiuni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {announcementsList
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((ann) => (
                      <tr key={ann.id} className={`border-b ${highContrast ? 'border-gray-800' : 'border-gray-100'}`}>
                        <td className={`py-3 px-4 ${highContrast ? 'text-white' : 'text-gray-900'}`}>{ann.titlu}</td>
                        <td className={`py-3 px-4 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                          <span className={`px-2 py-1 rounded text-xs ${highContrast ? 'bg-gray-800' : 'bg-gray-100'}`}>
                            {ann.categorie}
                          </span>
                        </td>
                        <td className={`py-3 px-4 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>{ann.data_publicare}</td>
                        <td className={`py-3 px-4 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                          {ann.vizibil ? (
                            <span className={`px-2 py-1 rounded text-xs ${highContrast ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'}`}>
                              Publicat
                            </span>
                          ) : (
                            <span className={`px-2 py-1 rounded text-xs ${highContrast ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                              Ciornă
                            </span>
                          )}
                        </td>
                        <td className={`py-3 px-4 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>{ann.vizualizari || 0}</td>
                        <td className={`py-3 px-4 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                          <button
                            onClick={() => handleEditAnnouncement(ann.id)}
                            className={`px-3 py-1 rounded text-sm ${highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                          >
                            Editează
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {announcementsList.length > itemsPerPage && (
              <div className="mt-6 flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === 1
                      ? 'opacity-50 cursor-not-allowed'
                      : highContrast
                        ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                        : 'bg-moldova-blue text-white hover:bg-blue-700'
                  }`}
                >
                  Anterior
                </button>
                <span className={`px-4 ${highContrast ? 'text-white' : 'text-gray-700'}`}>
                  Pagina {currentPage} din {Math.ceil(announcementsList.length / itemsPerPage)}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(Math.ceil(announcementsList.length / itemsPerPage), prev + 1))}
                  disabled={currentPage >= Math.ceil(announcementsList.length / itemsPerPage)}
                  className={`px-4 py-2 rounded-md ${
                    currentPage >= Math.ceil(announcementsList.length / itemsPerPage)
                      ? 'opacity-50 cursor-not-allowed'
                      : highContrast
                        ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                        : 'bg-moldova-blue text-white hover:bg-blue-700'
                  }`}
                >
                  Următor
                </button>
              </div>
            )}
          </div>

          <div className={`p-6 rounded-lg ${highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow'}`}>
            <h2 className={`text-xl font-bold mb-4 ${highContrast ? 'text-yellow-400' : 'text-gray-900'}`}>
              Acțiuni Rapide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => openForm('anunt')}
                className={`p-4 rounded-lg border-2 border-dashed flex flex-col items-center gap-2 transition-colors ${
                  highContrast 
                    ? 'border-yellow-400 text-yellow-400 hover:bg-gray-800' 
                    : 'border-moldova-blue text-moldova-blue hover:bg-moldova-cloud'
                }`}
              >
                <Megaphone size={24} />
                <span className="font-medium">Publică Anunț</span>
              </button>
            </div>
          </div>
        </div>

        {notification && (
          <div className="fixed bottom-4 right-4 p-4 bg-green-500 text-white rounded-lg shadow-lg z-50">
            {notification}
          </div>
        )}
      </div>
    );
  }

  // --- FORM VIEW ---
  return (
    <div className={`min-h-screen p-8 ${highContrast ? 'bg-black text-white' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => {
            setInternalView('dashboard');
            window.history.pushState({}, '', '/admin/dashboard');
          }}
          className={`mb-4 flex items-center gap-2 ${highContrast ? 'text-yellow-400' : 'text-moldova-blue'}`}
        >
          <ArrowLeft size={18} />
          Înapoi la Dashboard
        </button>

        <div className={`p-6 rounded-lg ${highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow'}`}>
          <h2 className={`text-2xl font-bold mb-6 ${highContrast ? 'text-yellow-400' : 'text-gray-900'}`}>
            {activeForm === 'anunt' ? (editingAnnouncement ? 'Editează Anunț' : 'Publică Anunț Nou') : 'Formular'}
          </h2>

          {activeForm === 'anunt' && (
            <form onSubmit={handleAnnouncementSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-md bg-red-50 border border-red-200 flex items-start gap-3 text-red-700">
                  <AlertTriangle className="flex-shrink-0 mt-0.5" size={18} />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              {/* Titlu */}
              <div>
                <label className={`block text-sm font-bold mb-2 ${highContrast ? 'text-white' : 'text-gray-700'}`}>
                  Titlu Anunț *
                </label>
                <input
                  type="text"
                  value={formData.titlu}
                  onChange={(e) => setFormData({ ...formData, titlu: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-moldova-blue focus:border-transparent ${
                    highContrast ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                  required
                  placeholder="Ex: Ședință Consiliu Local"
                />
              </div>

              {/* Categorie */}
              <div>
                <label className={`block text-sm font-bold mb-2 ${highContrast ? 'text-white' : 'text-gray-700'}`}>
                  Categorie *
                </label>
                <select
                  value={formData.categorie}
                  onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-moldova-blue focus:border-transparent ${
                    highContrast ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                  required
                >
                  <option value="general">General</option>
                  <option value="sedinta">Ședință</option>
                  <option value="eveniment">Eveniment</option>
                  <option value="info">Informație</option>
                  <option value="achizitie">Achiziție</option>
                  <option value="concurs">Concurs</option>
                  <option value="urgenta">Urgentă</option>
                </select>
              </div>

              {/* Continut Scurt */}
              <div>
                <label className={`block text-sm font-bold mb-2 ${highContrast ? 'text-white' : 'text-gray-700'}`}>
                  Rezumat (pentru listă) *
                </label>
                <textarea
                  value={formData.continut_scurt}
                  onChange={(e) => setFormData({ ...formData, continut_scurt: e.target.value })}
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-moldova-blue focus:border-transparent ${
                    highContrast ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                  required
                  placeholder="Scurtă descriere care va apărea în lista de anunțuri (max 500 caractere)"
                  maxLength={500}
                />
                <p className={`text-xs mt-1 ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formData.continut_scurt.length}/500 caractere
                </p>
              </div>

              {/* Continut Complet */}
              <div>
                <label className={`block text-sm font-bold mb-2 ${highContrast ? 'text-white' : 'text-gray-700'}`}>
                  Conținut Complet *
                </label>
                <textarea
                  value={formData.continut}
                  onChange={(e) => setFormData({ ...formData, continut: e.target.value })}
                  rows={8}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-moldova-blue focus:border-transparent ${
                    highContrast ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                  required
                  placeholder="Conținutul complet al anunțului"
                />
              </div>

              {/* Imagine */}
              <div>
                <label className={`block text-sm font-bold mb-2 ${highContrast ? 'text-white' : 'text-gray-700'}`}>
                  Imagine (opțional)
                </label>
                <div className="space-y-2">
                  {editingAnnouncement && editingAnnouncement.imagine && !formImagePreview && (
                    <div className="mb-2">
                      <p className={`text-sm mb-2 ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>Imagine actuală:</p>
                      <img
                        src={editingAnnouncement.imagine.startsWith('/') ? editingAnnouncement.imagine : `/uploads/anunturi/${editingAnnouncement.imagine}`}
                        alt="Current"
                        className="max-w-xs h-32 object-cover rounded-md border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormImage(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormImagePreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-moldova-blue focus:border-transparent ${
                      highContrast ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                  />
                  {formImagePreview && (
                    <div className="mt-2">
                      <p className={`text-sm mb-2 ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>Nouă imagine:</p>
                      <img
                        src={formImagePreview}
                        alt="Preview"
                        className="max-w-xs h-32 object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormImage(null);
                          setFormImagePreview(null);
                        }}
                        className="mt-2 text-sm text-red-600 hover:underline"
                      >
                        Șterge imagine nouă
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Butoane */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className={`px-6 py-3 rounded-md font-bold text-white transition-colors flex items-center gap-2 ${
                    formLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : highContrast
                        ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                        : 'bg-moldova-blue hover:bg-blue-700'
                  }`}
                >
                  {formLoading ? (
                    <>
                      <Activity size={18} className="animate-spin" />
                      {editingAnnouncement ? 'Se actualizează...' : 'Se publică...'}
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      {editingAnnouncement ? 'Actualizează Anunț' : 'Publică Anunț'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInternalView('dashboard');
                    window.history.pushState({}, '', '/admin/dashboard');
                    resetForm();
                  }}
                  className={`px-6 py-3 rounded-md font-bold border transition-colors ${
                    highContrast
                      ? 'border-yellow-400 text-yellow-400 hover:bg-gray-800'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <X size={18} className="inline mr-2" />
                  Anulează
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
