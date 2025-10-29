import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        console.log('Registering user with role:', role);
        
        // Validate role
        const validRoles = ['doctor', 'patient', 'donor', 'admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
        }
        
        // Check if user exists
        const [existingUsers] = await pool.query(
          'SELECT * FROM users WHERE email = ?',
          [email]
        );    if ((existingUsers as any[]).length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const [userResult] = await pool.query(
      'INSERT INTO users (id, email, password, name, role) VALUES (UUID(), ?, ?, ?, ?)',
      [email, hashedPassword, name, role]
    );

    // If it's a doctor, add specialization details
    if (role === 'doctor') {
      const { specialization, qualifications, consultationFee } = req.body;
      if (!specialization) {
        return res.status(400).json({ message: 'Specialization is required for doctors' });
      }

      const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
      const userId = rows[0].id;

      await pool.query(
        'INSERT INTO doctor_details (id, user_id, specialization, qualifications, consultation_fee) VALUES (UUID(), ?, ?, ?, ?)',
        [userId, specialization, qualifications || null, consultationFee || null]
      );
    }

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if ((users as any[]).length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = (users as any[])[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;