import express from 'express';
import pool from '../config/database.js';
import { checkAuthenticated } from '../helpers/auth.js';
import { validateToken } from '../helpers/csrf.js';
import { logAction } from '../helpers/admin.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer for gallery uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'gallery');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'photo-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error('Doar imagini (JPG, PNG, GIF, WebP) sunt permise'));
    }
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//                         PUBLIC API - PENTRU VIZITATORI
// ═══════════════════════════════════════════════════════════════════════════════

// Get all visible albums with photo count
router.get('/albums', async (req, res) => {
  try {
    const categorie = req.query.categorie;
    
    let sql = `
      SELECT 
        a.id, a.titlu, a.descriere, a.categorie, a.cover_photo, a.data_creare,
        COUNT(p.id) as photos_count
      FROM photo_albums a
      LEFT JOIN photos p ON p.album_id = a.id
      WHERE a.vizibil = 1
    `;
    
    const params = [];
    if (categorie) {
      sql += ' AND a.categorie = ?';
      params.push(categorie);
    }
    
    sql += ' GROUP BY a.id ORDER BY a.data_creare DESC';
    
    const [albums] = await pool.execute(sql, params);
    
    // Format cover photo URLs
    const formatted = albums.map(album => ({
      ...album,
      cover_photo: album.cover_photo 
        ? `/uploads/gallery/${album.cover_photo}`
        : null
    }));
    
    res.json(formatted);
  } catch (error) {
    console.error('Error fetching albums:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get single album with all photos
router.get('/albums/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get album
    const [albums] = await pool.execute(
      `SELECT id, titlu, descriere, categorie, cover_photo, data_creare
       FROM photo_albums 
       WHERE id = ? AND vizibil = 1`,
      [id]
    );
    
    if (albums.length === 0) {
      return res.status(404).json({ error: 'Album not found' });
    }
    
    const album = albums[0];
    
    // Get photos
    const [photos] = await pool.execute(
      `SELECT id, filename, titlu, descriere, ordine
       FROM photos 
       WHERE album_id = ?
       ORDER BY ordine ASC, id ASC`,
      [id]
    );
    
    // Format URLs
    album.cover_photo = album.cover_photo 
      ? `/uploads/gallery/${album.cover_photo}` 
      : null;
    
    const formattedPhotos = photos.map(photo => ({
      ...photo,
      url: `/uploads/gallery/${photo.filename}`
    }));
    
    res.json({
      album,
      photos: formattedPhotos
    });
  } catch (error) {
    console.error('Error fetching album:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get categories with album counts
router.get('/categories', async (req, res) => {
  try {
    const [categories] = await pool.execute(`
      SELECT categorie, COUNT(*) as count
      FROM photo_albums
      WHERE vizibil = 1
      GROUP BY categorie
      ORDER BY count DESC
    `);
    
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//                         ADMIN API - PENTRU ADMINISTRARE
// ═══════════════════════════════════════════════════════════════════════════════

// Get all albums for admin (including hidden)
router.get('/admin/albums', checkAuthenticated, async (req, res) => {
  try {
    const [albums] = await pool.execute(`
      SELECT 
        a.id, a.titlu, a.descriere, a.categorie, a.cover_photo, 
        a.vizibil, a.data_creare,
        COUNT(p.id) as photos_count
      FROM photo_albums a
      LEFT JOIN photos p ON p.album_id = a.id
      GROUP BY a.id
      ORDER BY a.data_creare DESC
    `);
    
    const formatted = albums.map(album => ({
      ...album,
      cover_photo: album.cover_photo 
        ? `/uploads/gallery/${album.cover_photo}`
        : null
    }));
    
    res.json({ albums: formatted });
  } catch (error) {
    console.error('Error fetching albums:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Create new album
router.post('/admin/albums', checkAuthenticated, async (req, res) => {
  try {
    if (!validateToken(req, req.body.csrf_token)) {
      return res.status(400).json({ error: 'Invalid CSRF token' });
    }
    
    const { titlu, descriere, categorie, vizibil } = req.body;
    
    const [result] = await pool.execute(
      `INSERT INTO photo_albums (titlu, descriere, categorie, vizibil, created_by)
       VALUES (?, ?, ?, ?, ?)`,
      [titlu, descriere || '', categorie || 'altele', vizibil ? 1 : 0, req.session.user_id]
    );
    
    await logAction(req.session.user_id, 'create', 'photo_albums', result.insertId, { titlu }, req);
    
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error creating album:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update album
router.put('/admin/albums/:id', checkAuthenticated, async (req, res) => {
  try {
    if (!validateToken(req, req.body.csrf_token)) {
      return res.status(400).json({ error: 'Invalid CSRF token' });
    }
    
    const { id } = req.params;
    const { titlu, descriere, categorie, vizibil } = req.body;
    
    await pool.execute(
      `UPDATE photo_albums SET titlu = ?, descriere = ?, categorie = ?, vizibil = ?
       WHERE id = ?`,
      [titlu, descriere || '', categorie, vizibil ? 1 : 0, id]
    );
    
    await logAction(req.session.user_id, 'update', 'photo_albums', id, { titlu }, req);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating album:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete album
router.delete('/admin/albums/:id', checkAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get all photos to delete files
    const [photos] = await pool.execute(
      'SELECT filename FROM photos WHERE album_id = ?',
      [id]
    );
    
    // Delete photo files
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'gallery');
    for (const photo of photos) {
      const filePath = path.join(uploadDir, photo.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    // Get cover photo
    const [albums] = await pool.execute(
      'SELECT cover_photo FROM photo_albums WHERE id = ?',
      [id]
    );
    
    if (albums.length > 0 && albums[0].cover_photo) {
      const coverPath = path.join(uploadDir, albums[0].cover_photo);
      if (fs.existsSync(coverPath)) {
        fs.unlinkSync(coverPath);
      }
    }
    
    // Delete album (cascades to photos)
    await pool.execute('DELETE FROM photo_albums WHERE id = ?', [id]);
    
    await logAction(req.session.user_id, 'delete', 'photo_albums', id, {}, req);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting album:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Upload photos to album
router.post('/admin/albums/:id/photos', checkAuthenticated, upload.array('photos', 20), async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files;
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    // Get current max order
    const [maxOrder] = await pool.execute(
      'SELECT MAX(ordine) as max_ordine FROM photos WHERE album_id = ?',
      [id]
    );
    let nextOrder = (maxOrder[0].max_ordine || 0) + 1;
    
    // Insert photos
    const insertedPhotos = [];
    for (const file of files) {
      const [result] = await pool.execute(
        'INSERT INTO photos (album_id, filename, ordine) VALUES (?, ?, ?)',
        [id, file.filename, nextOrder++]
      );
      insertedPhotos.push({
        id: result.insertId,
        filename: file.filename,
        url: `/uploads/gallery/${file.filename}`
      });
    }
    
    // Set first photo as cover if no cover exists
    const [album] = await pool.execute(
      'SELECT cover_photo FROM photo_albums WHERE id = ?',
      [id]
    );
    
    if (!album[0].cover_photo && files.length > 0) {
      await pool.execute(
        'UPDATE photo_albums SET cover_photo = ? WHERE id = ?',
        [files[0].filename, id]
      );
    }
    
    await logAction(req.session.user_id, 'upload', 'photos', id, { count: files.length }, req);
    
    res.json({ success: true, photos: insertedPhotos });
  } catch (error) {
    console.error('Error uploading photos:', error);
    res.status(500).json({ error: 'Upload error' });
  }
});

// Delete single photo
router.delete('/admin/photos/:id', checkAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get photo info
    const [photos] = await pool.execute(
      'SELECT filename, album_id FROM photos WHERE id = ?',
      [id]
    );
    
    if (photos.length === 0) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    
    const photo = photos[0];
    
    // Delete file
    const filePath = path.join(process.cwd(), 'public', 'uploads', 'gallery', photo.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Check if this was the cover photo
    const [album] = await pool.execute(
      'SELECT cover_photo FROM photo_albums WHERE id = ?',
      [photo.album_id]
    );
    
    // Delete from database
    await pool.execute('DELETE FROM photos WHERE id = ?', [id]);
    
    // If this was the cover, set another photo as cover
    if (album[0].cover_photo === photo.filename) {
      const [nextPhoto] = await pool.execute(
        'SELECT filename FROM photos WHERE album_id = ? ORDER BY ordine ASC LIMIT 1',
        [photo.album_id]
      );
      
      await pool.execute(
        'UPDATE photo_albums SET cover_photo = ? WHERE id = ?',
        [nextPhoto.length > 0 ? nextPhoto[0].filename : null, photo.album_id]
      );
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Set album cover
router.post('/admin/albums/:albumId/cover/:photoId', checkAuthenticated, async (req, res) => {
  try {
    const { albumId, photoId } = req.params;
    
    // Get photo filename
    const [photos] = await pool.execute(
      'SELECT filename FROM photos WHERE id = ? AND album_id = ?',
      [photoId, albumId]
    );
    
    if (photos.length === 0) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    
    await pool.execute(
      'UPDATE photo_albums SET cover_photo = ? WHERE id = ?',
      [photos[0].filename, albumId]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error setting cover:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;

