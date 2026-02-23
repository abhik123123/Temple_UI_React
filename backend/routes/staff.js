const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { upload, uploadFile, deleteFile } = require('../utils/fileStorage');

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM staff ORDER BY position');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

router.post('/', upload.single('profileImage'), async (req, res) => {
  try {
    const { fullName, position, email, phone, experience, description } = req.body;
    let profileImageUrl = req.file ? await uploadFile(req.file) : null;
    const result = await db.query(
      'INSERT INTO staff (full_name, position, email, phone, experience, description, profile_image_url) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [fullName, position, email, phone, experience, description, profileImageUrl]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create staff' });
  }
});

router.put('/:id', upload.single('profileImage'), async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, position, email, phone, experience, description } = req.body;
    let profileImageUrl = null;
    if (req.file) {
      const existing = await db.query('SELECT profile_image_url FROM staff WHERE id = $1', [id]);
      if (existing.rows[0]?.profile_image_url) await deleteFile(existing.rows[0].profile_image_url);
      profileImageUrl = await uploadFile(req.file);
    }
    const result = await db.query(
      'UPDATE staff SET full_name=$1, position=$2, email=$3, phone=$4, experience=$5, description=$6' +
      (profileImageUrl ? ', profile_image_url=$7 WHERE id=$8' : ' WHERE id=$7') + ' RETURNING *',
      profileImageUrl ? [fullName, position, email, phone, experience, description, profileImageUrl, id] : [fullName, position, email, phone, experience, description, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update staff' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await db.query('SELECT profile_image_url FROM staff WHERE id = $1', [id]);
    if (staff.rows[0]?.profile_image_url) await deleteFile(staff.rows[0].profile_image_url);
    await db.query('DELETE FROM staff WHERE id = $1', [id]);
    res.json({ message: 'Staff deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete staff' });
  }
});

module.exports = router;
