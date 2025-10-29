import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { Role, User } from '../types';
import { User as UserIcon, Stethoscope, Droplets, Building } from 'lucide-react';

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

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: Role.Patient,
    bloodGroup: '',
    dob: '',
    specialization: '',
    qualifications: '',
    consultationFee: '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role: Role) => {
    setFormData(prev => ({
        ...prev,
        role,
        bloodGroup: '',
        dob: '',
        specialization: '',
        qualifications: '',
    }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const userData: Omit<User, 'id'> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: formData.role,
    };
    
    if (formData.role === Role.Patient) {
        userData.bloodGroup = formData.bloodGroup;
        userData.dob = formData.dob;
    } else if (formData.role === Role.Doctor) {
        userData.specialization = formData.specialization;
        userData.qualifications = formData.qualifications;
        userData.consultationFee = parseFloat(formData.consultationFee);
    } else if (formData.role === Role.Donor) {
        userData.bloodGroup = formData.bloodGroup;
    }

    const success = register(userData);
    if (success) {
      alert('Registration successful! Please log in.');
      navigate('/login');
    } else {
      setError('An account with this email already exists.');
    }
  };

  const roleOptions = [
    { role: Role.Patient, icon: <UserIcon className="h-6 w-6" /> },
    { role: Role.Doctor, icon: <Stethoscope className="h-6 w-6" /> },
    { role: Role.Donor, icon: <Droplets className="h-6 w-6" /> },
    { role: Role.Admin, icon: <Building className="h-6 w-6" /> },
  ];

  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case Role.Patient:
        return (
          <>
            <input name="dob" type="date" required title="Date of Birth" className="input-field" value={formData.dob} onChange={handleInputChange} />
            <input name="bloodGroup" type="text" required className="input-field rounded-b-md" placeholder="Blood Group (e.g., A+)" value={formData.bloodGroup} onChange={handleInputChange} />
          </>
        );
      case Role.Doctor:
        return (
          <>
            <select 
              name="specialization" 
              required 
              className="input-field"
              value={formData.specialization} 
              onChange={handleInputChange}
            >
              <option value="">Select Specialization</option>
              {SPECIALIZATIONS.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
            <input 
              name="qualifications" 
              type="text" 
              required 
              className="input-field" 
              placeholder="Qualifications (e.g., MBBS, MD)" 
              value={formData.qualifications} 
              onChange={handleInputChange} 
            />
            <input 
              name="consultationFee" 
              type="number" 
              required 
              className="input-field rounded-b-md" 
              placeholder="Consultation Fee (₹)" 
              value={formData.consultationFee} 
              onChange={handleInputChange} 
            />
          </>
        );
      case Role.Donor:
        return (
          <>
            <input name="bloodGroup" type="text" required className="input-field rounded-b-md" placeholder="Blood Group (e.g., O-)" value={formData.bloodGroup} onChange={handleInputChange} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Register as a...</label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {roleOptions.map(({ role, icon }) => (
                <button
                  key={role} type="button" onClick={() => handleRoleChange(role)}
                  className={`flex flex-col items-center justify-center p-3 border rounded-lg transition-colors duration-200 ${
                    formData.role === role ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {icon}
                  <span className="mt-2 text-xs font-medium text-center">{role}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="rounded-md shadow-sm -space-y-px">
             <input name="name" type="text" required className="input-field rounded-t-md" placeholder="Full Name" value={formData.name} onChange={handleInputChange} />
             <input name="email" type="email" required className="input-field" placeholder="Email address" value={formData.email} onChange={handleInputChange} />
             <input name="phone" type="tel" required className="input-field" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} />
             <input name="password" type="password" required className={`input-field ${!renderRoleSpecificFields() ? 'rounded-b-md' : ''}`} placeholder="Password" value={formData.password} onChange={handleInputChange} />
             {renderRoleSpecificFields()}
          </div>
          
          <style>{`.input-field { appearance: none; border-radius: 0; position: relative; display: block; width: 100%; padding: 0.75rem; border: 1px solid #D1D5DB; placeholder-color: #6B7280; color: #111827; outline: none; } .input-field:focus { z-index: 10; ring: 2px; ring-color: #3B82F6; border-color: #3B82F6; }`}</style>
          
          <div>
            <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
