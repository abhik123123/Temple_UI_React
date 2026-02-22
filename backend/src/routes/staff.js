const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all staff
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM staff ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

// GET staff by department
router.get('/department/:department', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM staff WHERE department = $1 ORDER BY id ASC', [req.params.department]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch staff by department' });
  }
});

// GET single staff member
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM staff WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Staff member not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch staff member' });
  }
});

// POST create staff member
router.post('/', async (req, res) => {
  try {
    const { fullName, role, department, phoneNumber, email, joiningDate, responsibilities, profileImageUrl } = req.body;
    if (!fullName || !role) return res.status(400).json({ error: 'fullName and role are required' });

    const result = await pool.query(
      `INSERT INTO staff (full_name, role, department, phone_number, email, joining_date, responsibilities, profile_image_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [fullName, role, department || '', phoneNumber || '', email || '', joiningDate || null, responsibilities || '', profileImageUrl || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating staff:', err);
    res.status(500).json({ error: 'Failed to create staff member' });
  }
});

// PUT update staff member
router.put('/:id', async (req, res) => {
  try {
    const { fullName, role, department, phoneNumber, email, joiningDate, responsibilities, profileImageUrl } = req.body;
    const result = await pool.query(
      `UPDATE staff SET full_name=$1, role=$2, department=$3, phone_number=$4, email=$5,
       joining_date=$6, responsibilities=$7, profile_image_url=$8, updated_at=CURRENT_TIMESTAMP
       WHERE id=$9 RETURNING *`,
      [fullName, role, department, phoneNumber, email, joiningDate, responsibilities, profileImageUrl, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Staff member not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update staff member' });
  }
});

// DELETE staff member
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM staff WHERE id=$1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Staff member not found' });
    res.json({ message: 'Staff member deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete staff member' });
  }
});

module.exports = router;
