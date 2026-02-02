import express from 'express';
import pool from '../config/database.js';
import { checkAuthenticated } from '../helpers/auth.js';
import { validateToken } from '../helpers/csrf.js';
import { logAction } from '../helpers/admin.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Upload directory for project documents
const PROJECT_ROOT = path.join(__dirname, '../..');
const UPLOAD_DIR = path.join(PROJECT_ROOT, 'public', 'uploads', 'proiecte');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure multer for document uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = 'proiect-' + uniqueSuffix + ext;
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tip de fișier invalid. Sunt permise doar PDF, DOC, DOCX.'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter
});

// ═══════════════════════════════════════════════════════════════════════════════
//                              PUBLIC ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// Get all visible project documents (public)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, titlu, descriere, document, data_publicare
       FROM proiecte_decizii
       WHERE vizibil = 1
       ORDER BY data_publicare DESC, id DESC`
    );

    // Add full URL to documents
    const proiecte = rows.map(p => ({
      ...p,
      document_url: `/uploads/proiecte/${p.document}`
    }));

    res.json({ proiecte });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//                              ADMIN ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// Get all projects (admin - includes hidden)
router.get('/admin', checkAuthenticated, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, titlu, descriere, document, data_publicare, vizibil, created_at
       FROM proiecte_decizii
       ORDER BY data_publicare DESC, id DESC`
    );

    const proiecte = rows.map(p => ({
      ...p,
      document_url: `/uploads/proiecte/${p.document}`
    }));

    res.json({ proiecte });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Create new project document
router.post('/admin', checkAuthenticated, upload.single('document'), async (req, res) => {
  try {
    if (!validateToken(req, req.body.csrf_token)) {
      return res.status(400).json({ error: 'Invalid CSRF token' });
    }

    const { titlu, descriere, vizibil } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Documentul este obligatoriu' });
    }

    if (!titlu || titlu.trim() === '') {
      return res.status(400).json({ error: 'Titlul este obligatoriu' });
    }

    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const [result] = await pool.execute(
      `INSERT INTO proiecte_decizii (titlu, descriere, document, data_publicare, vizibil, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        titlu.trim(),
        descriere || null,
        req.file.filename,
        dateStr,
        vizibil === 'true' || vizibil === '1' ? 1 : 0,
        req.session.user_id
      ]
    );

    await logAction(req.session.user_id, 'create', 'proiecte_decizii', result.insertId, { titlu }, req);

    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update project
router.put('/admin/:id', checkAuthenticated, upload.single('document'), async (req, res) => {
  try {
    if (!validateToken(req, req.body.csrf_token)) {
      return res.status(400).json({ error: 'Invalid CSRF token' });
    }

    const { id } = req.params;
    const { titlu, descriere, vizibil } = req.body;

    if (!titlu || titlu.trim() === '') {
      return res.status(400).json({ error: 'Titlul este obligatoriu' });
    }

    // Get old document filename if we're updating it
    let oldDocument = null;
    if (req.file) {
      const [oldRows] = await pool.execute('SELECT document FROM proiecte_decizii WHERE id = ?', [id]);
      if (oldRows.length > 0) {
        oldDocument = oldRows[0].document;
      }
    }

    let updateFields = ['titlu = ?', 'descriere = ?', 'vizibil = ?'];
    let values = [titlu.trim(), descriere || null, vizibil === 'true' || vizibil === '1' ? 1 : 0];

    if (req.file) {
      updateFields.push('document = ?');
      values.push(req.file.filename);
    }

    values.push(id);

    await pool.execute(
      `UPDATE proiecte_decizii SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );

    // Delete old file if replaced
    if (oldDocument && req.file) {
      const oldPath = path.join(UPLOAD_DIR, oldDocument);
      try {
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      } catch (err) {
        console.error('Error deleting old document:', err);
      }
    }

    await logAction(req.session.user_id, 'update', 'proiecte_decizii', id, { titlu }, req);

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete project
router.delete('/admin/:id', checkAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;

    // Get document filename before deleting
    const [rows] = await pool.execute('SELECT document, titlu FROM proiecte_decizii WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Proiectul nu a fost găsit' });
    }

    const { document, titlu } = rows[0];

    // Delete from database
    await pool.execute('DELETE FROM proiecte_decizii WHERE id = ?', [id]);

    // Delete file
    const filePath = path.join(UPLOAD_DIR, document);
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error('Error deleting document file:', err);
    }

    await logAction(req.session.user_id, 'delete', 'proiecte_decizii', id, { titlu }, req);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
