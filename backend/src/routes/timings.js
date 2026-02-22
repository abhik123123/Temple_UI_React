const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all timings
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.id, t.day, t.notes,
        json_agg(json_build_object('id', ts.id, 'openTime', ts.open_time, 'closeTime', ts.close_time)
          ORDER BY ts.open_time) AS slots
       FROM timings t
       LEFT JOIN timing_slots ts ON ts.timing_id = t.id
       GROUP BY t.id, t.day, t.notes
       ORDER BY CASE t.day
         WHEN 'Monday' THEN 1 WHEN 'Tuesday' THEN 2 WHEN 'Wednesday' THEN 3
         WHEN 'Thursday' THEN 4 WHEN 'Friday' THEN 5 WHEN 'Saturday' THEN 6
         WHEN 'Sunday' THEN 7 END`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching timings:', err);
    res.status(500).json({ error: 'Failed to fetch timings' });
  }
});

// PUT update a day's timings (replace all slots for that day)
router.put('/:day', async (req, res) => {
  const client = await pool.connect();
  try {
    const { day } = req.params;
    const { notes, slots } = req.body;

    await client.query('BEGIN');

    // Upsert the timing row
    const timingResult = await client.query(
      `INSERT INTO timings (day, notes) VALUES ($1, $2)
       ON CONFLICT (day) DO UPDATE SET notes = EXCLUDED.notes
       RETURNING *`,
      [day, notes || '']
    );
    const timingId = timingResult.rows[0].id;

    // Delete existing slots and re-insert
    await client.query('DELETE FROM timing_slots WHERE timing_id = $1', [timingId]);

    if (Array.isArray(slots) && slots.length > 0) {
      for (const slot of slots) {
        await client.query(
          'INSERT INTO timing_slots (timing_id, open_time, close_time) VALUES ($1, $2, $3)',
          [timingId, slot.openTime, slot.closeTime]
        );
      }
    }

    await client.query('COMMIT');

    // Return updated timing with slots
    const updated = await pool.query(
      `SELECT t.id, t.day, t.notes,
        json_agg(json_build_object('id', ts.id, 'openTime', ts.open_time, 'closeTime', ts.close_time)
          ORDER BY ts.open_time) AS slots
       FROM timings t
       LEFT JOIN timing_slots ts ON ts.timing_id = t.id
       WHERE t.day = $1
       GROUP BY t.id, t.day, t.notes`,
      [day]
    );
    res.json(updated.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error updating timings:', err);
    res.status(500).json({ error: 'Failed to update timings' });
  } finally {
    client.release();
  }
});

module.exports = router;
