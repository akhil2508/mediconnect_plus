import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import appointmentRoutes from './routes/appointments';
import prescriptionRoutes from './routes/prescriptions';
import donationRoutes from './routes/donations';
import doctorRoutes from './routes/doctors';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '8000', 10);

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Allow both localhost and IP
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization']
}));

// Add OPTIONS handling for preflight requests
app.options('*', cors());

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/doctors', doctorRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
try {
  app.listen(port, '0.0.0.0', () => {
    console.log('=================================');
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📝 API URL: http://localhost:${port}/api`);
    console.log('=================================');
  });
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}