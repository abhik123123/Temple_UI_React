const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM timings ORDER BY CASE day_of_week WHEN \'Monday\' THEN 1 WHEN \'Tuesday\' THEN 2 WHEN \'Wednesday\' THEN 3 WHEN \'Thursday\' THEN 4 WHEN \'Friday\' THEN 5 WHEN \'Saturday\' THEN 6 WHEN \'Sunday\' THEN 7 END');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch timings' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { dayOfWeek, openTime, closeTime, notes } = req.body;
    const result = await db.query(
      'INSERT INTO timings (day_of_week, open_time, close_time, notes) VALUES ($1,$2,$3,$4) RETURNING *',
      [dayOfWeek, openTime, closeTime, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create timing' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { dayOfWeek, openTime, closeTime, notes } = req.body;
    const result = await db.query(
      'UPDATE timings SET day_of_week=$1, open_time=$2, close_time=$3, notes=$4 WHERE id=$5 RETURNING *',
      [dayOfWeek, openTime, closeTime, notes, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update timing' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM timings WHERE id = $1', [req.params.id]);
    res.json({ message: 'Timing deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete timing' });
  }
});

module.exports = router;
