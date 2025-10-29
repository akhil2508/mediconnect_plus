export enum Role {
  Patient = 'patient',
  Doctor = 'doctor',
  Donor = 'donor',
  Admin = 'admin'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string; // For registration form, not stored in active state
  role: Role;
  // Patient/Donor specific
  bloodGroup?: string;
  dob?: string;
  // Doctor specific
  specialization?: string;
  qualifications?: string;
  consultationFee?: number;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  qualifications?: string;
  consultationFee?: number;
  availability?: string[];  // Will be handled separately
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  doctorSpecialization: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

export interface Medicine {
    id: number | string;
    name: string;
    frequency: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  doctorName: string;
  patientName: string;
  date: string;
  notes: string;
  medicines: Medicine[];
}

export interface BloodDrive {
  id: string;
  name: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  slotsAvailable: number;
}

export interface Donation {
    id: string;
    driveName: string;
    location: string;
    date: string;
    status: 'Completed' | 'Scheduled';
}

export interface BloodInventory {
    bloodType: string;
    units: number;
}