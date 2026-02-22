const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all gallery items
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM gallery ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

// GET by type (image/video/youtube)
router.get('/type/:type', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM gallery WHERE type = $1 ORDER BY created_at DESC',
      [req.params.type]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gallery by type' });
  }
});

// GET single gallery item
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM gallery WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Gallery item not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gallery item' });
  }
});

// POST create gallery item
router.post('/', async (req, res) => {
  try {
    const { title, description, url, type } = req.body;
    if (!url) return res.status(400).json({ error: 'url is required' });

    const result = await pool.query(
      `INSERT INTO gallery (title, description, url, type)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [title || '', description || '', url, type || 'image']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating gallery item:', err);
    res.status(500).json({ error: 'Failed to create gallery item' });
  }
});

// PUT update gallery item
router.put('/:id', async (req, res) => {
  try {
    const { title, description, url, type } = req.body;
    const result = await pool.query(
      `UPDATE gallery SET title=$1, description=$2, url=$3, type=$4, updated_at=CURRENT_TIMESTAMP
       WHERE id=$5 RETURNING *`,
      [title, description, url, type, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Gallery item not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update gallery item' });
  }
});

// DELETE gallery item
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM gallery WHERE id=$1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Gallery item not found' });
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete gallery item' });
  }
});

module.exports = router;
