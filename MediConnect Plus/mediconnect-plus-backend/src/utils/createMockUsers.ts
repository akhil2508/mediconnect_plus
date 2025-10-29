import bcrypt from 'bcryptjs';
import pool from '../config/database';

async function createMockUsers() {
    try {
        const salt = await bcrypt.genSalt(10);
        
        // Hash passwords
        const doctorPassword = await bcrypt.hash('Doctor@2023', salt);
        const gopalPassword = await bcrypt.hash('Gopal@1998', salt);
        const mohanPassword = await bcrypt.hash('Mohan@1998', salt);
        const donorPassword = await bcrypt.hash('Donor@2023', salt);

        // Insert Doctors
        const [doctorVikas] = await pool.query(
            'INSERT INTO users (id, email, password, name, role) VALUES (UUID(), ?, ?, ?, ?)',
            ['dr.vikas.sengar@mediconnect.com', doctorPassword, 'Dr. Vikas Sengar', 'doctor']
        );

        const [doctorSangeeta] = await pool.query(
            'INSERT INTO users (id, email, password, name, role) VALUES (UUID(), ?, ?, ?, ?)',
            ['dr.sangeeta.sengar@mediconnect.com', doctorPassword, 'Dr. Sangeeta Sengar', 'doctor']
        );

        // Insert Patients
        const [gopalDixit] = await pool.query(
            'INSERT INTO users (id, email, password, name, role) VALUES (UUID(), ?, ?, ?, ?)',
            ['dixitgopal786@gmail.com', gopalPassword, 'Gopal Dixit', 'patient']
        );

        const [krishnaMohan] = await pool.query(
            'INSERT INTO users (id, email, password, name, role) VALUES (UUID(), ?, ?, ?, ?)',
            ['yadavkrishnamohan26@gmail.com', mohanPassword, 'Krishna Mohan Yadav', 'patient']
        );

        // Insert Blood Donors
        const [ritikShukla] = await pool.query(
            'INSERT INTO users (id, email, password, name, role) VALUES (UUID(), ?, ?, ?, ?)',
            ['ritik.shukla@mediconnect.com', donorPassword, 'Ritik Shukla', 'donor']
        );

        const [tusharShukla] = await pool.query(
            'INSERT INTO users (id, email, password, name, role) VALUES (UUID(), ?, ?, ?, ?)',
            ['tushar.shukla@mediconnect.com', donorPassword, 'Tushar Shukla', 'donor']
        );

        console.log('Mock users created successfully!');
    } catch (error) {
        console.error('Error creating mock users:', error);
    }
}

createMockUsers();