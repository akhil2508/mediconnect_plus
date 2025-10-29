
import React from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { Role } from '../types';
import PatientDashboard from '../features/dashboards/PatientDashboard';
import DoctorDashboard from '../features/dashboards/DoctorDashboard';
import DonorDashboard from '../features/dashboards/DonorDashboard';
import AdminDashboard from '../features/dashboards/AdminDashboard';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case Role.Patient:
        return <PatientDashboard />;
      case Role.Doctor:
        return <DoctorDashboard />;
      case Role.Donor:
        return <DonorDashboard />;
      case Role.Admin:
        return <AdminDashboard />;
      default:
        return <div className="text-center p-8">Invalid user role.</div>;
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.name}</h1>
        <p className="text-gray-600">Your {user?.role} Dashboard</p>
      </div>
      {renderDashboard()}
    </div>
  );
};

export default DashboardPage;
