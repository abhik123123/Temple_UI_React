const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { upload, uploadFile, deleteFile } = require('../utils/fileStorage');

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM board_members ORDER BY order_index, name');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch board members' });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, position, email, phone, bio, orderIndex } = req.body;
    let imageUrl = req.file ? await uploadFile(req.file) : null;
    const result = await db.query(
      'INSERT INTO board_members (name, position, email, phone, bio, image_url, order_index) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [name, position, email, phone, bio, imageUrl, orderIndex || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create board member' });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, email, phone, bio, orderIndex } = req.body;
    let imageUrl = null;
    if (req.file) {
      const existing = await db.query('SELECT image_url FROM board_members WHERE id = $1', [id]);
      if (existing.rows[0]?.image_url) await deleteFile(existing.rows[0].image_url);
      imageUrl = await uploadFile(req.file);
    }
    const result = await db.query(
      'UPDATE board_members SET name=$1, position=$2, email=$3, phone=$4, bio=$5, order_index=$6' +
      (imageUrl ? ', image_url=$7 WHERE id=$8' : ' WHERE id=$7') + ' RETURNING *',
      imageUrl ? [name, position, email, phone, bio, orderIndex, imageUrl, id] : [name, position, email, phone, bio, orderIndex, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update board member' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const member = await db.query('SELECT image_url FROM board_members WHERE id = $1', [id]);
    if (member.rows[0]?.image_url) await deleteFile(member.rows[0].image_url);
    await db.query('DELETE FROM board_members WHERE id = $1', [id]);
    res.json({ message: 'Board member deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete board member' });
  }
});

module.exports = router;
