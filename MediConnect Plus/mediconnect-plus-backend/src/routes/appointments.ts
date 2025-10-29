import express from 'express';
import { authenticateToken } from '../middleware/auth';
import pool from '../config/database';

const router = express.Router();

// Get all appointments for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let query;
    if (userRole === 'doctor') {
      query = 'SELECT * FROM appointments WHERE doctor_id = ?';
    } else if (userRole === 'patient') {
      query = 'SELECT * FROM appointments WHERE patient_id = ?';
    } else if (userRole === 'admin') {
      query = 'SELECT * FROM appointments';
    } else {
      return res.status(403).json({ message: 'Unauthorized role' });
    }

    const [appointments] = await pool.query(query, userRole === 'admin' ? [] : [userId]);
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new appointment
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { doctorId, dateTime, notes } = req.body;
    const patientId = req.user.id;

    const [result] = await pool.query(
      'INSERT INTO appointments (id, patient_id, doctor_id, date_time, notes) VALUES (UUID(), ?, ?, ?, ?)',
      [patientId, doctorId, dateTime, notes]
    );

    res.status(201).json({ message: 'Appointment created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update appointment status
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const [result] = await pool.query(
      'UPDATE appointments SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;