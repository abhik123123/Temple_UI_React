const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { upload, uploadFile, deleteFile } = require('../utils/fileStorage');

// GET all gallery items (images, videos, youtube)
router.get('/', async (req, res) => {
  try {
    const images = await db.query('SELECT * FROM gallery_images ORDER BY upload_date DESC');
    const videos = await db.query('SELECT * FROM gallery_videos ORDER BY upload_date DESC');
    const youtube = await db.query('SELECT * FROM youtube_links ORDER BY added_date DESC');
    
    res.json({
      images: images.rows,
      videos: videos.rows,
      youtubeLinks: youtube.rows
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

// POST upload image
router.post('/images', upload.single('image'), async (req, res) => {
  try {
    const { title, description, category } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    const imageUrl = await uploadFile(req.file);
    const result = await db.query(
      'INSERT INTO gallery_images (title, description, image_url, category, file_size) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [title, description, imageUrl, category, req.file.size]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// POST upload video
router.post('/videos', upload.single('video'), async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    const videoUrl = await uploadFile(req.file);
    const result = await db.query(
      'INSERT INTO gallery_videos (title, description, video_url) VALUES ($1,$2,$3) RETURNING *',
      [title, description, videoUrl]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload video' });
  }
});

// POST add YouTube link
router.post('/youtube', async (req, res) => {
  try {
    const { title, description, youtubeUrl } = req.body;
    const result = await db.query(
      'INSERT INTO youtube_links (title, description, youtube_url) VALUES ($1,$2,$3) RETURNING *',
      [title, description, youtubeUrl]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add YouTube link' });
  }
});

// DELETE image
router.delete('/images/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const image = await db.query('SELECT image_url FROM gallery_images WHERE id = $1', [id]);
    if (image.rows[0]?.image_url) await deleteFile(image.rows[0].image_url);
    await db.query('DELETE FROM gallery_images WHERE id = $1', [id]);
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// DELETE video
router.delete('/videos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const video = await db.query('SELECT video_url FROM gallery_videos WHERE id = $1', [id]);
    if (video.rows[0]?.video_url) await deleteFile(video.rows[0].video_url);
    await db.query('DELETE FROM gallery_videos WHERE id = $1', [id]);
    res.json({ message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

// DELETE YouTube link
router.delete('/youtube/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM youtube_links WHERE id = $1', [req.params.id]);
    res.json({ message: 'YouTube link deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete YouTube link' });
  }
});

module.exports = router;
