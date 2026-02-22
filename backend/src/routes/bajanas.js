const express = require('express');
const router = express.Router();
const pool = require('../config/database');

const parseDetails = (row) => {
  if (row) row.details = Array.isArray(row.details) ? row.details : (row.details ? JSON.parse(row.details) : []);
  return row;
};

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bajanas ORDER BY id ASC');
    res.json(result.rows.map(parseDetails));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bajanas' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bajanas WHERE id=$1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Bajana not found' });
    res.json(parseDetails(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bajana' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, artist, category, deity, schedule, description, details, icon, has_audio, has_lyrics } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });
    const detailsArr = Array.isArray(details) ? details : (details ? details.split(',').map(d => d.trim()) : []);
    const result = await pool.query(
      `INSERT INTO bajanas (title, artist, category, deity, schedule, description, details, icon, has_audio, has_lyrics)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [title, artist||'', category||'devotional', deity||'', schedule||'', description||'', JSON.stringify(detailsArr), icon||'🎵', has_audio||false, has_lyrics||false]
    );
    res.status(201).json(parseDetails(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: 'Failed to create bajana' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, artist, category, deity, schedule, description, details, icon, has_audio, has_lyrics } = req.body;
    const detailsArr = Array.isArray(details) ? details : (details ? details.split(',').map(d => d.trim()) : []);
    const result = await pool.query(
      `UPDATE bajanas SET title=$1, artist=$2, category=$3, deity=$4, schedule=$5, description=$6,
       details=$7, icon=$8, has_audio=$9, has_lyrics=$10, updated_at=CURRENT_TIMESTAMP
       WHERE id=$11 RETURNING *`,
      [title, artist, category, deity, schedule, description, JSON.stringify(detailsArr), icon, has_audio, has_lyrics, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Bajana not found' });
    res.json(parseDetails(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: 'Failed to update bajana' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM bajanas WHERE id=$1 RETURNING *', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Bajana not found' });
    res.json({ message: 'Bajana deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete bajana' });
  }
});

module.exports = router;
