import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mediconnect',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection established successfully');
    
    // Test if we can query the database
    const [result] = await connection.query('SHOW TABLES');
    console.log('Available tables:', result);
    
    // Test if doctor_details table exists
    const [tables] = await connection.query('SHOW TABLES LIKE "doctor_details"');
    if (Array.isArray(tables) && tables.length === 0) {
      console.error('doctor_details table does not exist');
    } else {
      console.log('doctor_details table exists');
      // Check table structure
      const [columns] = await connection.query('DESCRIBE doctor_details');
      console.log('doctor_details table structure:', columns);
    }
    
    connection.release();
  } catch (err) {
    console.error('Error connecting to the database:', err);
    throw err;
  }
};

testConnection().catch(err => {
  console.error('Database connection test failed:', err);
});

export default pool;