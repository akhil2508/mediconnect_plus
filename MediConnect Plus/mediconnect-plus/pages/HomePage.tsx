
import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Droplets, UserCheck, CalendarDays } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-blue-50">
        <div className="container mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Integrated Healthcare, <br />
            <span className="text-blue-600">Simplified for You.</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            MediConnect Plus brings doctor appointments and blood donation into one seamless platform. Your health, your community, all in one place.
          </p>
          <div className="mt-8">
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800">Our Services</h2>
            <p className="text-gray-600 mt-2">Connecting patients, doctors, and donors effectively.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            {/* Doctor Appointments */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
                <Stethoscope className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Doctor Appointments</h3>
              <p className="text-gray-600 mb-4">
                Easily find specialists, check their availability, and book your appointments online. Manage your health with digital prescriptions and records.
              </p>
              <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start"><UserCheck className="h-5 w-5 text-blue-500 mr-2 mt-1 flex-shrink-0" /> Find Doctors by Specialization</li>
                  <li className="flex items-start"><CalendarDays className="h-5 w-5 text-blue-500 mr-2 mt-1 flex-shrink-0" /> Book & Reschedule with Ease</li>
              </ul>
            </div>

            {/* Blood Donation */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                <Droplets className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Blood Donation</h3>
              <p className="text-gray-600 mb-4">
                Become a hero. Find nearby blood donation drives, book your slot, and save lives. Get timely reminders and be a part of a noble cause.
              </p>
               <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start"><UserCheck className="h-5 w-5 text-red-500 mr-2 mt-1 flex-shrink-0" /> Register as a Donor</li>
                  <li className="flex items-start"><CalendarDays className="h-5 w-5 text-red-500 mr-2 mt-1 flex-shrink-0" /> Find & Book Donation Slots</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
