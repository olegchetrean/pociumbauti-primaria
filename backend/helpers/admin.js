import pool from '../config/database.js';

export const logAction = async (userId, action, table = null, recordId = null, details = null, req = null) => {
  try {
    const ipAddress = req?.ip || req?.connection?.remoteAddress || 'unknown';
    const userAgent = req?.get('user-agent') || 'unknown';

    await pool.execute(
      `INSERT INTO logs (user_id, actiune, tabel, record_id, detalii, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        action,
        table,
        recordId,
        details ? JSON.stringify(details) : null,
        ipAddress,
        userAgent
      ]
    );
  } catch (error) {
    console.error('Error logging action:', error);
  }
};

export const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return 'Niciodată';
  
  const date = new Date(dateString);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return date.toLocaleDateString('ro-RO', options);
};

export const getDashboardStats = async () => {
  try {
    const [anunturi] = await pool.execute(
      'SELECT COUNT(*) as count FROM anunturi WHERE vizibil = 1'
    );

    return {
      anunturi_active: anunturi[0].count
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return { anunturi_active: 0 };
  }
};

export const escapeHtml = (text) => {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
};

