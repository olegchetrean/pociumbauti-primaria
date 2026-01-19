import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get announcements
router.get('/announcements', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const prioritate = req.query.prioritate !== undefined ? parseInt(req.query.prioritate) : null;

    let sql = `SELECT id, titlu, categorie, data_publicare, continut, continut_scurt, 
       imagine, prioritate, vizualizari as views 
       FROM anunturi 
       WHERE vizibil = 1`;
    
    let params = [];
    
    if (prioritate !== null) {
      sql += ` AND prioritate = ?`;
      params.push(prioritate);
    }
    
    // LIMIT cannot be a parameter in MySQL prepared statements - use direct value
    const safeLimit = Math.max(1, Math.min(100, parseInt(limit) || 6)); // Clamp between 1-100
    // Sort ONLY by date (newest first), then by ID (highest first) - category must NOT influence order
    // Use explicit date sorting - convert to DATE type for proper comparison
    sql += ` ORDER BY data_publicare DESC, id DESC LIMIT ${safeLimit}`;

    const [announcements] = await pool.execute(sql, params);


    // Adjust image paths and format dates
    const formatted = announcements.map(item => {
      // Format date - extract only date part (YYYY-MM-DD) from DATE or DATETIME
      let formattedDate = item.data_publicare;
      if (formattedDate) {
        // If it's a Date object, convert to string
        if (formattedDate instanceof Date) {
          formattedDate = formattedDate.toISOString().split('T')[0];
        } else if (typeof formattedDate === 'string') {
          // If it's a string with time, extract only date part
          formattedDate = formattedDate.split('T')[0].split(' ')[0];
        }
      }
      
      return {
        id: item.id,
        titlu: item.titlu,
        categorie: item.categorie,
        data_publicare: formattedDate,
        continut: item.continut,
        continut_scurt: item.continut_scurt || item.continut.substring(0, 150) + '...',
        imagine_url: item.imagine 
          ? (item.imagine.startsWith('/') ? item.imagine : `/uploads/anunturi/${item.imagine}`)
          : null,
        prioritate: Boolean(item.prioritate),
        views: item.views
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    console.error('Error stack:', error.stack);
      res.status(500).json({ error: 'Database error', details: error.message });
    }
  });

// Get single announcement by ID
router.get('/announcements/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid announcement ID' });
    }

    const [announcements] = await pool.execute(
      `SELECT id, titlu, categorie, data_publicare, continut, continut_scurt, 
       imagine, document, prioritate, vizualizari as views 
       FROM anunturi 
       WHERE id = ? AND vizibil = 1`,
      [id]
    );

    if (announcements.length === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    const item = announcements[0];

    // Increment view count
    await pool.execute(
      'UPDATE anunturi SET vizualizari = vizualizari + 1 WHERE id = ?',
      [id]
    );

    // Format date - extract only date part (YYYY-MM-DD)
    let formattedDate = item.data_publicare;
    if (formattedDate) {
      if (formattedDate instanceof Date) {
        formattedDate = formattedDate.toISOString().split('T')[0];
      } else if (typeof formattedDate === 'string') {
        formattedDate = formattedDate.split('T')[0].split(' ')[0];
      }
    }

    const formatted = {
      id: item.id,
      titlu: item.titlu,
      categorie: item.categorie,
      data_publicare: formattedDate,
      continut: item.continut,
      continut_scurt: item.continut_scurt || item.continut.substring(0, 150) + '...',
      imagine_url: item.imagine 
        ? (item.imagine.startsWith('/') ? item.imagine : `/uploads/anunturi/${item.imagine}`)
        : null,
      document: item.document,
      prioritate: Boolean(item.prioritate),
      views: item.vizualizari + 1
    };

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching announcement:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

export default router;

