-- Add doctor_details table for specializations
CREATE TABLE IF NOT EXISTS doctor_details (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    qualifications TEXT,
    consultation_fee DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(id)
);