import express from 'express';
import { authenticateToken } from '../middleware/auth';
import pool from '../config/database';

const router = express.Router();

// Get blood donations
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let query;
    if (userRole === 'donor') {
      query = 'SELECT * FROM blood_donations WHERE donor_id = ?';
    } else if (userRole === 'admin') {
      query = 'SELECT * FROM blood_donations';
    } else {
      return res.status(403).json({ message: 'Unauthorized role' });
    }

    const [donations] = await pool.query(query, userRole === 'admin' ? [] : [userId]);
    res.json(donations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Schedule blood donation
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { bloodType, amount_ml } = req.body;
    const donorId = req.user.id;

    // Verify the user is a donor
    if (req.user.role !== 'donor') {
      return res.status(403).json({ message: 'Only donors can schedule donations' });
    }

    const [result] = await pool.query(
      'INSERT INTO blood_donations (id, donor_id, blood_type, amount_ml) VALUES (UUID(), ?, ?, ?)',
      [donorId, bloodType, amount_ml]
    );

    // Update blood inventory after successful donation
    await pool.query(
      'INSERT INTO blood_inventory (blood_type, units) VALUES (?, ?) ON DUPLICATE KEY UPDATE units = units + ?',
      [bloodType, Math.floor(amount_ml / 450), Math.floor(amount_ml / 450)]
    );

    res.status(201).json({ message: 'Blood donation scheduled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get blood inventory
router.get('/inventory', async (req, res) => {
  try {
    const [inventory] = await pool.query('SELECT * FROM blood_inventory');
    res.json(inventory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;