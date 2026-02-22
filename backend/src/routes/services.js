const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all services
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// GET single service
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Service not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

// POST create service
router.post('/', async (req, res) => {
  try {
    const { name, description, price, icon, details } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });

    const detailsArray = Array.isArray(details) ? details : (details ? details.split(',').map(d => d.trim()) : []);

    const result = await pool.query(
      `INSERT INTO services (name, description, price, icon, details)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name, description || '', price || 'Free', icon || '🙏', JSON.stringify(detailsArray)]
    );
    const row = result.rows[0];
    row.details = typeof row.details === 'string' ? JSON.parse(row.details) : row.details;
    res.status(201).json(row);
  } catch (err) {
    console.error('Error creating service:', err);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// PUT update service
router.put('/:id', async (req, res) => {
  try {
    const { name, description, price, icon, details } = req.body;
    const detailsArray = Array.isArray(details) ? details : (details ? details.split(',').map(d => d.trim()) : []);

    const result = await pool.query(
      `UPDATE services SET name=$1, description=$2, price=$3, icon=$4, details=$5, updated_at=CURRENT_TIMESTAMP
       WHERE id=$6 RETURNING *`,
      [name, description, price, icon, JSON.stringify(detailsArray), req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Service not found' });
    const row = result.rows[0];
    row.details = typeof row.details === 'string' ? JSON.parse(row.details) : row.details;
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// DELETE service
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM services WHERE id=$1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Service not found' });
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

module.exports = router;
