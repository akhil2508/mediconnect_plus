import express from 'express';
import { authenticateToken } from '../middleware/auth';
import pool from '../config/database';

const router = express.Router();

// Get prescriptions for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let query;
    if (userRole === 'doctor') {
      query = 'SELECT * FROM prescriptions WHERE doctor_id = ?';
    } else if (userRole === 'patient') {
      query = 'SELECT * FROM prescriptions WHERE patient_id = ?';
    } else if (userRole === 'admin') {
      query = 'SELECT * FROM prescriptions';
    } else {
      return res.status(403).json({ message: 'Unauthorized role' });
    }

    const [prescriptions] = await pool.query(query, userRole === 'admin' ? [] : [userId]);
    res.json(prescriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new prescription
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { patientId, diagnosis, medications } = req.body;
    const doctorId = req.user.id;

    // Verify the user is a doctor
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can create prescriptions' });
    }

    const [result] = await pool.query(
      'INSERT INTO prescriptions (id, patient_id, doctor_id, diagnosis, medications) VALUES (UUID(), ?, ?, ?, ?)',
      [patientId, doctorId, diagnosis, medications]
    );

    res.status(201).json({ message: 'Prescription created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;