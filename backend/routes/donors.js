const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM donors ORDER BY donation_date DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch donors' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, amount, donationDate, message, isAnonymous } = req.body;
    const result = await db.query(
      'INSERT INTO donors (name, amount, donation_date, message, is_anonymous) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [name, amount, donationDate, message, isAnonymous || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create donor' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM donors WHERE id = $1', [req.params.id]);
    res.json({ message: 'Donor deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete donor' });
  }
});

module.exports = router;
