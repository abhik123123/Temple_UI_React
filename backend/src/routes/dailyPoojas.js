const express = require('express');
const router = express.Router();
const pool = require('../config/database');

const parseDetails = (row) => {
  if (row) row.details = Array.isArray(row.details) ? row.details : (row.details ? JSON.parse(row.details) : []);
  return row;
};

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM daily_poojas ORDER BY time ASC');
    res.json(result.rows.map(parseDetails));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch daily poojas' });
  }
});

router.get('/day/:day', async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM daily_poojas WHERE day=$1 OR day='Daily' ORDER BY time ASC",
      [req.params.day]
    );
    res.json(result.rows.map(parseDetails));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch poojas by day' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM daily_poojas WHERE id=$1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Pooja not found' });
    res.json(parseDetails(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pooja' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, time, duration, day, description, deity, details, icon } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const detailsArr = Array.isArray(details) ? details : (details ? details.split('\n').map(d => d.trim()).filter(Boolean) : []);
    const result = await pool.query(
      `INSERT INTO daily_poojas (name, time, duration, day, description, deity, details, icon)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [name, time||'', duration||'', day||'Daily', description||'', deity||'', JSON.stringify(detailsArr), icon||'🪔']
    );
    res.status(201).json(parseDetails(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: 'Failed to create pooja' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, time, duration, day, description, deity, details, icon } = req.body;
    const detailsArr = Array.isArray(details) ? details : (details ? details.split('\n').map(d => d.trim()).filter(Boolean) : []);
    const result = await pool.query(
      `UPDATE daily_poojas SET name=$1, time=$2, duration=$3, day=$4, description=$5,
       deity=$6, details=$7, icon=$8, updated_at=CURRENT_TIMESTAMP
       WHERE id=$9 RETURNING *`,
      [name, time, duration, day, description, deity, JSON.stringify(detailsArr), icon, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Pooja not found' });
    res.json(parseDetails(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: 'Failed to update pooja' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM daily_poojas WHERE id=$1 RETURNING *', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Pooja not found' });
    res.json({ message: 'Pooja deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete pooja' });
  }
});

module.exports = router;
