const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { upload, uploadFile, deleteFile } = require('../utils/fileStorage');

// GET all services
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM services ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// POST create service
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, price, duration, category, description } = req.body;
    let imageUrl = null;
    if (req.file) imageUrl = await uploadFile(req.file);
    
    const result = await db.query(
      'INSERT INTO services (name, price, duration, category, description, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, price, duration, category, description, imageUrl]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// PUT update service
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, duration, category, description } = req.body;
    
    let imageUrl = null;
    if (req.file) {
      const existing = await db.query('SELECT image_url FROM services WHERE id = $1', [id]);
      if (existing.rows[0]?.image_url) await deleteFile(existing.rows[0].image_url);
      imageUrl = await uploadFile(req.file);
    }
    
    const result = await db.query(
      'UPDATE services SET name=$1, price=$2, duration=$3, category=$4, description=$5' + 
      (imageUrl ? ', image_url=$6 WHERE id=$7' : ' WHERE id=$6') + ' RETURNING *',
      imageUrl ? [name, price, duration, category, description, imageUrl, id] : [name, price, duration, category, description, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// DELETE service
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const service = await db.query('SELECT image_url FROM services WHERE id = $1', [id]);
    if (service.rows[0]?.image_url) await deleteFile(service.rows[0].image_url);
    await db.query('DELETE FROM services WHERE id = $1', [id]);
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

module.exports = router;
