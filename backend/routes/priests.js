const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { upload, uploadFile, deleteFile } = require('../utils/fileStorage');

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM priests ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch priests' });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, specialization, experienceYears, languages, contact, bio } = req.body;
    let imageUrl = req.file ? await uploadFile(req.file) : null;
    const result = await db.query(
      'INSERT INTO priests (name, specialization, experience_years, languages, contact, bio, image_url) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [name, specialization, experienceYears, languages, contact, bio, imageUrl]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create priest' });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, specialization, experienceYears, languages, contact, bio } = req.body;
    let imageUrl = null;
    if (req.file) {
      const existing = await db.query('SELECT image_url FROM priests WHERE id = $1', [id]);
      if (existing.rows[0]?.image_url) await deleteFile(existing.rows[0].image_url);
      imageUrl = await uploadFile(req.file);
    }
    const result = await db.query(
      'UPDATE priests SET name=$1, specialization=$2, experience_years=$3, languages=$4, contact=$5, bio=$6' +
      (imageUrl ? ', image_url=$7 WHERE id=$8' : ' WHERE id=$7') + ' RETURNING *',
      imageUrl ? [name, specialization, experienceYears, languages, contact, bio, imageUrl, id] : [name, specialization, experienceYears, languages, contact, bio, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update priest' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const priest = await db.query('SELECT image_url FROM priests WHERE id = $1', [id]);
    if (priest.rows[0]?.image_url) await deleteFile(priest.rows[0].image_url);
    await db.query('DELETE FROM priests WHERE id = $1', [id]);
    res.json({ message: 'Priest deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete priest' });
  }
});

module.exports = router;
