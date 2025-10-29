import express from 'express';
import pool from '../config/database';

const router = express.Router();

// List of specializations
const SPECIALIZATIONS = [
    'Dermatologist',
    'Cardiologist',
    'Neurologist',
    'Oncologist',
    'Gastroenterologist',
    'Pediatrician',
    'Orthopedic Surgeon',
    'General Physician',
    'ENT Specialist',
    'Ophthalmologist',
    'Psychiatrist',
    'Gynecologist',
    'Urologist',
    'Dentist',
    'Pulmonologist'
];

// Get all specializations
router.get('/specializations', (req, res) => {
    res.json(SPECIALIZATIONS);
});

// Get doctors by specialization
router.get('/by-specialization/:specialization', async (req, res) => {
    try {
        const { specialization } = req.params;
        console.log(`Searching for doctors with specialization: ${specialization}`);
        
        // First, let's verify the database connection and create table if needed
        try {
            // Create doctor_details table if it doesn't exist
            await pool.query(`
                CREATE TABLE IF NOT EXISTS doctor_details (
                    id VARCHAR(36) PRIMARY KEY,
                    user_id VARCHAR(36) NOT NULL,
                    specialization VARCHAR(100) NOT NULL,
                    qualifications TEXT,
                    consultation_fee DECIMAL(10,2),
                    FOREIGN KEY (user_id) REFERENCES users(id)
                )
            `);
            console.log('doctor_details table is ready');
        } catch (error) {
            const dbError = error as Error;
            console.error('Database error:', dbError);
            return res.status(500).json({ message: 'Database error', details: process.env.NODE_ENV === 'development' ? dbError.message : undefined });
        }
        
        // Check if the specialization exists in our list
        if (!SPECIALIZATIONS.includes(specialization)) {
            console.log(`Invalid specialization: ${specialization}`);
            return res.status(400).json({ message: 'Invalid specialization' });
        }
        
        // Get only doctors with the specified specialization
        const query = `
            SELECT 
                u.id, 
                u.name, 
                u.email, 
                d.specialization,
                d.qualifications,
                d.consultation_fee
            FROM users u
            INNER JOIN doctor_details d ON u.id = d.user_id
            WHERE u.role = 'doctor' 
            AND d.specialization = ?
        `;
        console.log('Executing query:', query, 'with specialization:', specialization);
        
        const [doctorsResult] = await pool.query<any[]>(query, [specialization]);
        const doctors = doctorsResult as any[];
        console.log('Found doctors:', JSON.stringify(doctors, null, 2));
        
        // Return empty array if no doctors found for the specialization
        res.json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;