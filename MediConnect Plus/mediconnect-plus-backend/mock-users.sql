-- Add additional user details (We need to create these tables first)
CREATE TABLE IF NOT EXISTS doctor_details (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    specialization VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS patient_details (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    dob DATE,
    gender VARCHAR(10),
    phone_number VARCHAR(15),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS donor_details (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    blood_type VARCHAR(5),
    last_donation_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);