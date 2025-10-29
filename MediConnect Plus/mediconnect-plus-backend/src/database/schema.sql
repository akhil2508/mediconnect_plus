-- Create Users table
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'doctor', 'patient', 'donor') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Appointments table
CREATE TABLE appointments (
  id VARCHAR(36) PRIMARY KEY,
  patient_id VARCHAR(36),
  doctor_id VARCHAR(36),
  date_time DATETIME NOT NULL,
  status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id),
  FOREIGN KEY (doctor_id) REFERENCES users(id)
);

-- Create Prescriptions table
CREATE TABLE prescriptions (
  id VARCHAR(36) PRIMARY KEY,
  patient_id VARCHAR(36),
  doctor_id VARCHAR(36),
  diagnosis TEXT NOT NULL,
  medications TEXT NOT NULL,
  date_prescribed DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id),
  FOREIGN KEY (doctor_id) REFERENCES users(id)
);

-- Create Blood Donations table
CREATE TABLE blood_donations (
  id VARCHAR(36) PRIMARY KEY,
  donor_id VARCHAR(36),
  blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
  amount_ml INT NOT NULL,
  donation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
  FOREIGN KEY (donor_id) REFERENCES users(id)
);

-- Create Blood Inventory table
CREATE TABLE blood_inventory (
  blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') PRIMARY KEY,
  units INT DEFAULT 0
);