const express = require('express');
const router = express.Router();
const pool = require('../config/database');

const parseDetails = (row) => {
  if (row) row.details = Array.isArray(row.details) ? row.details : (row.details ? JSON.parse(row.details) : []);
  return row;
};

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pooja_books ORDER BY id ASC');
    res.json(result.rows.map(parseDetails));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pooja books' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pooja_books WHERE id=$1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Pooja book not found' });
    res.json(parseDetails(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pooja book' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, category, description, details, icon, language, pages, level, downloadable } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });
    const detailsArr = Array.isArray(details) ? details : (details ? details.split(',').map(d => d.trim()).filter(Boolean) : []);
    const result = await pool.query(
      `INSERT INTO pooja_books (title, category, description, details, icon, language, pages, level, downloadable)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [title, category||'general', description||'', JSON.stringify(detailsArr), icon||'📚', language||'Sanskrit & English', pages||0, level||'beginner', downloadable !== false]
    );
    res.status(201).json(parseDetails(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: 'Failed to create pooja book' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, category, description, details, icon, language, pages, level, downloadable } = req.body;
    const detailsArr = Array.isArray(details) ? details : (details ? details.split(',').map(d => d.trim()).filter(Boolean) : []);
    const result = await pool.query(
      `UPDATE pooja_books SET title=$1, category=$2, description=$3, details=$4, icon=$5,
       language=$6, pages=$7, level=$8, downloadable=$9, updated_at=CURRENT_TIMESTAMP
       WHERE id=$10 RETURNING *`,
      [title, category, description, JSON.stringify(detailsArr), icon, language, pages, level, downloadable, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Pooja book not found' });
    res.json(parseDetails(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: 'Failed to update pooja book' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM pooja_books WHERE id=$1 RETURNING *', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Pooja book not found' });
    res.json({ message: 'Pooja book deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete pooja book' });
  }
});

module.exports = router;
