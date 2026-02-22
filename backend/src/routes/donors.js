const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM donors ORDER BY donation_date DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch donors' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM donors WHERE id=$1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Donor not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch donor' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { donor_name, in_memory_of, donation_type, amount, items, item_description, item_value, donation_date, phone, email, address } = req.body;
    if (!donor_name) return res.status(400).json({ error: 'donor_name is required' });
    const result = await pool.query(
      `INSERT INTO donors (donor_name, in_memory_of, donation_type, amount, items, item_description, item_value, donation_date, phone, email, address)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [donor_name, in_memory_of||null, donation_type||'cash', amount||0, items||null, item_description||null, item_value||null, donation_date||new Date(), phone||null, email||null, address||null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating donor:', err);
    res.status(500).json({ error: 'Failed to create donor' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { donor_name, in_memory_of, donation_type, amount, items, item_description, item_value, donation_date, phone, email, address } = req.body;
    const result = await pool.query(
      `UPDATE donors SET donor_name=$1, in_memory_of=$2, donation_type=$3, amount=$4, items=$5,
       item_description=$6, item_value=$7, donation_date=$8, phone=$9, email=$10, address=$11, updated_at=CURRENT_TIMESTAMP
       WHERE id=$12 RETURNING *`,
      [donor_name, in_memory_of||null, donation_type, amount, items||null, item_description||null, item_value||null, donation_date, phone||null, email||null, address||null, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Donor not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update donor' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM donors WHERE id=$1 RETURNING *', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Donor not found' });
    res.json({ message: 'Donor deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete donor' });
  }
});

module.exports = router;
