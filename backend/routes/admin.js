import express from 'express';
import pool from '../config/database.js';
import { checkAuthenticated, getCurrentUser } from '../helpers/auth.js';
import { generateToken, validateToken } from '../helpers/csrf.js';
import { logAction, getDashboardStats, formatDate } from '../helpers/admin.js';
import { uploadFields } from '../helpers/upload.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// All admin routes require authentication
router.use(checkAuthenticated);

// Dashboard
router.get('/dashboard', async (req, res) => {
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
router.get('/anunturi', async (req, res) => {
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
router.get('/anunturi/:id', async (req, res) => {
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
    // MySQL DATE type returns as string in format YYYY-MM-DD, but sometimes it can be Date object
    if (anunt.data_publicare) {
      if (anunt.data_publicare instanceof Date) {
        // Use local date, not UTC, to avoid timezone issues
        const year = anunt.data_publicare.getFullYear();
        const month = String(anunt.data_publicare.getMonth() + 1).padStart(2, '0');
        const day = String(anunt.data_publicare.getDate()).padStart(2, '0');
        anunt.data_publicare = `${year}-${month}-${day}`;
      } else if (typeof anunt.data_publicare === 'string') {
        // Extract only date part, remove time if present
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
router.post('/anunturi/publish', (req, res, next) => {
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
    // Get today's date in local timezone (YYYY-MM-DD format)
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    
    // For new announcements, always use today's date (ignore what was sent)
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

    // Verify file exists using multer's path
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
router.post('/anunturi/edit', uploadFields, async (req, res) => {
  try {
    if (!validateToken(req, req.body.csrf_token)) {
      return res.status(400).json({ error: 'Invalid CSRF token' });
    }

    const { id, titlu, categorie, data_publicare, continut, continut_scurt, prioritate, vizibil } = req.body;
    
    // For edits, always set prioritate and vizibil to true
    const finalPrioritate = 1;
    const finalVizibil = 1;
    const files = req.files || {};

    // Fix date format - extract only date part from ISO string if needed
    // For edits, keep the original date (don't change it to today)
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

    // If new image is uploaded, get old image filename to delete it later
    let oldImageFilename = null;
    if (files.imagine) {
      // Get old image filename before updating
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

    // Delete old image file if it was replaced
    if (oldImageFilename) {
      // Use the same upload directory path as in upload.js
      const oldImagePath = path.join(process.cwd(), 'public', 'uploads', 'anunturi', oldImageFilename);
      try {
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      } catch (err) {
        console.error(`[ANUNȚ] Error deleting old image ${oldImageFilename}:`, err);
        // Don't fail the request if file deletion fails
      }
    }

    await logAction(req.session.user_id, 'update', 'anunturi', id, { titlu }, req);

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get announcement by ID
router.get('/anunturi/:id', async (req, res) => {
  try {
    const [anunturi] = await pool.execute(
      'SELECT * FROM anunturi WHERE id = ?',
      [req.params.id]
    );

    if (anunturi.length === 0) {
      return res.status(404).json({ error: 'Anunțul nu a fost găsit' });
    }

    res.json({ anunt: anunturi[0] });
  } catch (error) {
    console.error('Error fetching announcement:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Audit log
router.get('/audit', async (req, res) => {
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

// Get CSRF token for admin
router.get('/csrf', (req, res) => {
  const token = generateToken(req);
  res.json({ csrf_token: token });
});

export default router;

