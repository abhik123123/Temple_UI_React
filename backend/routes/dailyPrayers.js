const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM daily_prayers WHERE is_active = true ORDER BY time');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch daily prayers' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, time, description, language } = req.body;
    const result = await db.query(
      'INSERT INTO daily_prayers (name, time, description, language) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, time, description, language]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create prayer' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, time, description, language } = req.body;
    const result = await db.query(
      'UPDATE daily_prayers SET name=$1, time=$2, description=$3, language=$4 WHERE id=$5 RETURNING *',
      [name, time, description, language, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update prayer' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM daily_prayers WHERE id = $1', [req.params.id]);
    res.json({ message: 'Prayer deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete prayer' });
  }
});

module.exports = router;
