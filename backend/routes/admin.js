import express from 'express';
import pool from '../config/database.js';
import { checkAuthenticated, getCurrentUser } from '../helpers/auth.js';
import { generateToken, validateToken } from '../helpers/csrf.js';
import { logAction, getDashboardStats, formatDate } from '../helpers/admin.js';
import { uploadFields } from '../helpers/upload.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();


// router.use(checkAuthenticated);

// ✅ CSRF endpoint БЕЗ защиты - нужен для получения токена до логина
router.get('/csrf', (req, res) => {
  const token = generateToken(req);
  res.json({ csrf_token: token });
});

// ✅ ВСЕ остальные роуты защищены индивидуально
// Dashboard
router.get('/dashboard', checkAuthenticated, async (req, res) => {
  try {
    const stats = await getDashboardStats();
    const user = await getCurrentUser(req);
    
    res.json({
      stats,
      user,
      page_title: 'Panou Principal'
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get announcements list
router.get('/anunturi', checkAuthenticated, async (req, res) => {
  try {
    const [anunturi] = await pool.execute(
      `SELECT id, titlu, categorie, data_publicare, vizibil, prioritate, vizualizari
       FROM anunturi 
       ORDER BY data_publicare DESC, id DESC`
    );

    res.json({ anunturi });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get single announcement for editing
router.get('/anunturi/:id', checkAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      `SELECT id, titlu, categorie, data_publicare, continut, continut_scurt, 
              imagine, document, prioritate, vizibil, vizualizari
       FROM anunturi 
       WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Anunțul nu a fost găsit' });
    }

    const anunt = rows[0];
    // Format image URL
    if (anunt.imagine) {
      anunt.imagine = anunt.imagine.startsWith('/') ? anunt.imagine : `/uploads/anunturi/${anunt.imagine}`;
    }
    
    // Format date - extract only date part (YYYY-MM-DD)
    if (anunt.data_publicare) {
      if (anunt.data_publicare instanceof Date) {
        const year = anunt.data_publicare.getFullYear();
        const month = String(anunt.data_publicare.getMonth() + 1).padStart(2, '0');
        const day = String(anunt.data_publicare.getDate()).padStart(2, '0');
        anunt.data_publicare = `${year}-${month}-${day}`;
      } else if (typeof anunt.data_publicare === 'string') {
        anunt.data_publicare = anunt.data_publicare.split('T')[0].split(' ')[0];
      }
    }

    res.json({ anunt });
  } catch (error) {
    console.error('Error fetching announcement:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Publish announcement
router.post('/anunturi/publish', checkAuthenticated, (req, res, next) => {
  uploadFields(req, res, (err) => {
    if (err) {
      console.error('[ANUNȚ] Upload error:', err);
      return res.status(400).json({ error: err.message || 'File upload error' });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!validateToken(req, req.body.csrf_token)) {
      return res.status(400).json({ error: 'Invalid CSRF token' });
    }

    const { titlu, categorie, data_publicare, continut, continut_scurt, prioritate, vizibil } = req.body;
    const files = req.files || {};
    
    // Normalize date format - always use today's date for new announcements
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    
    let normalizedDate = todayStr;
    
    const imagine = files.imagine ? files.imagine[0].filename : null;
    const document = files.document ? files.document[0].filename : null;

    const [result] = await pool.execute(
      `INSERT INTO anunturi 
       (titlu, categorie, data_publicare, continut, continut_scurt, document, imagine, prioritate, vizibil, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        titlu,
        categorie || 'general',
        normalizedDate,
        continut,
        continut_scurt,
        document,
        imagine,
        prioritate ? 1 : 0,
        vizibil ? 1 : 0,
        req.session.user_id
      ]
    );

    await logAction(req.session.user_id, 'create', 'anunturi', result.insertId, { titlu }, req);

    if (imagine && files.imagine && files.imagine[0]) {
      const filePath = files.imagine[0].path;
      const exists = fs.existsSync(filePath);
    }

    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error publishing announcement:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Edit announcement
router.post('/anunturi/edit', checkAuthenticated, uploadFields, async (req, res) => {
  try {
    if (!validateToken(req, req.body.csrf_token)) {
      return res.status(400).json({ error: 'Invalid CSRF token' });
    }

    const { id, titlu, categorie, data_publicare, continut, continut_scurt, prioritate, vizibil } = req.body;
    
    const finalPrioritate = 1;
    const finalVizibil = 1;
    const files = req.files || {};

    let formattedDate = data_publicare;
    if (formattedDate) {
      if (formattedDate.includes('T')) {
        formattedDate = formattedDate.split('T')[0];
      }
      if (formattedDate.includes(' ')) {
        formattedDate = formattedDate.split(' ')[0];
      }
    }

    let updateFields = [
      'titlu = ?',
      'categorie = ?',
      'data_publicare = ?',
      'continut = ?',
      'continut_scurt = ?',
      'prioritate = ?',
      'vizibil = ?'
    ];
    
    let values = [titlu, categorie, formattedDate, continut, continut_scurt, finalPrioritate, finalVizibil];

    let oldImageFilename = null;
    if (files.imagine) {
      const [oldRows] = await pool.execute('SELECT imagine FROM anunturi WHERE id = ?', [id]);
      if (oldRows.length > 0 && oldRows[0].imagine) {
        oldImageFilename = oldRows[0].imagine;
      }
      
      updateFields.push('imagine = ?');
      values.push(files.imagine[0].filename);
    }

    if (files.document) {
      updateFields.push('document = ?');
      values.push(files.document[0].filename);
    }

    values.push(id);

    await pool.execute(
      `UPDATE anunturi SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );

    if (oldImageFilename) {
      const oldImagePath = path.join(process.cwd(), 'public', 'uploads', 'anunturi', oldImageFilename);
      try {
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      } catch (err) {
        console.error(`[ANUNȚ] Error deleting old image ${oldImageFilename}:`, err);
      }
    }

    await logAction(req.session.user_id, 'update', 'anunturi', id, { titlu }, req);

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Audit log
router.get('/audit', checkAuthenticated, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    
    const [logs] = await pool.execute(
      `SELECT l.*, u.username, u.full_name 
       FROM logs l 
       LEFT JOIN users u ON l.user_id = u.id 
       ORDER BY l.created_at DESC 
       LIMIT ?`,
      [limit]
    );

    res.json({ logs });
  } catch (error) {
    console.error('Error fetching audit log:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
