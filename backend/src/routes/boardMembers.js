const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all board members
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM board_members ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching board members:', error);
    res.status(500).json({ error: 'Failed to fetch board members' });
  }
});

// Get board member by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM board_members WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Board member not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching board member:', error);
    res.status(500).json({ error: 'Failed to fetch board member' });
  }
});

// Get board members by department
router.get('/department/:department', async (req, res) => {
  try {
    const { department } = req.params;
    const result = await pool.query(
      'SELECT * FROM board_members WHERE department = $1 ORDER BY id ASC',
      [department]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching board members by department:', error);
    res.status(500).json({ error: 'Failed to fetch board members' });
  }
});

// Create new board member
router.post('/', async (req, res) => {
  try {
    const { fullName, position, department, email, phoneNumber, biography, profileImageUrl } = req.body;
    
    // Validation
    if (!fullName || !position || !department || !email || !phoneNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const result = await pool.query(
      `INSERT INTO board_members 
       (full_name, position, department, email, phone_number, biography, profile_image_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [fullName, position, department, email, phoneNumber, biography || '', profileImageUrl || null]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating board member:', error);
    res.status(500).json({ error: 'Failed to create board member' });
  }
});

// Update board member
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, position, department, email, phoneNumber, biography, profileImageUrl } = req.body;
    
    const result = await pool.query(
      `UPDATE board_members 
       SET full_name = $1, position = $2, department = $3, email = $4, 
           phone_number = $5, biography = $6, profile_image_url = $7, 
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $8 
       RETURNING *`,
      [fullName, position, department, email, phoneNumber, biography, profileImageUrl, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Board member not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating board member:', error);
    res.status(500).json({ error: 'Failed to update board member' });
  }
});

// Delete board member
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM board_members WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Board member not found' });
    }
    
    res.json({ message: 'Board member deleted successfully', deletedMember: result.rows[0] });
  } catch (error) {
    console.error('Error deleting board member:', error);
    res.status(500).json({ error: 'Failed to delete board member' });
  }
});

module.exports = router;
