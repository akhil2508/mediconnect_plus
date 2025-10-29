import React, { useState, useCallback, useEffect } from 'react';
import { Doctor, Appointment, Prescription } from '../../types';
import { appointmentService, prescriptionService, doctorService } from '../../services/apiService';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';
import { Calendar, Stethoscope, Pill, Clock, X, FileText, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

// FIX: Added missing patientId and doctorId properties to conform to the Appointment type.
const initialAppointments: Appointment[] = [
  { id: 'app1', patientId: 'user-johndoe', doctorId: 'doc-gupta', patientName: 'Abhishek Dwivedi', doctorName: 'Dr. Naveen Gupta', doctorSpecialization: 'Cardiologist', date: '2024-08-15', time: '10:00 AM', status: 'Confirmed' },
  { id: 'app2', patientId: 'user-johndoe', doctorId: 'doc-sengar', patientName: 'Abhishek Dwivedi', doctorName: 'Dr. Vikas Sengar', doctorSpecialization: 'Gastroenterologist', date: '2025-10-15', time: '02:30 PM', status: 'Confirmed' },
];

const mockPrescriptions: Prescription[] = [
    { 
        id: 'pre1', 
        appointmentId: 'app1', 
        doctorName: 'Dr. Naveen Gupta', 
        patientName: 'Abhishek Dwivedi',
        date: '2024-08-15', 
        notes: 'Take medication after meals. Get plenty of rest and drink fluids. Follow up in 2 weeks.',
        medicines: [
            { id: 1, name: 'Lisinopril 10mg', frequency: 'Once a day' },
            { id: 2, name: 'Aspirin 81mg', frequency: 'Once a day' },
        ]
    },
    { 
        id: 'pre2', 
        appointmentId: 'app2', 
        doctorName: 'Dr. Vikas Sengar', 
        patientName: 'Abhishek Dwivedi',
        date: '2025-07-20', 
        notes: 'Apply ointment to the affected area. Avoid heavy lifting for a month.',
        medicines: [
            { id: 1, name: 'Ibuprofen 400mg', frequency: 'As needed for pain' },
            { id: 2, name: 'Topical steroid cream', frequency: 'Twice a day' },
        ]
    },
];

interface BookingModalProps {
    doctor: Doctor;
    onClose: () => void;
    onConfirm: (doctor: Doctor, slot: string) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ doctor, onClose, onConfirm }) => {
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    const handleConfirm = () => {
        if (selectedSlot) {
            onConfirm(doctor, selectedSlot);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                    <X className="h-6 w-6" />
                </button>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Book Appointment</h3>
                <p className="text-gray-700">with <span className="font-semibold">{doctor.name}</span> ({doctor.specialization})</p>
                
                <div className="my-6">
                    <h4 className="text-md font-semibold text-gray-700 mb-3">Select an available slot for tomorrow:</h4>
                    <div className="flex flex-wrap gap-3">
                        {doctor.availability.map(slot => (
                            <button 
                                key={slot}
                                onClick={() => setSelectedSlot(slot)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                    selectedSlot === slot 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {slot}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold">
                        Cancel
                    </button>
                    <button 
                        onClick={handleConfirm}
                        disabled={!selectedSlot}
                        className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Confirm Booking
                    </button>
                </div>
            </div>
        </div>
    );
};

interface PrescriptionDetailModalProps {
    prescription: Prescription;
    onClose: () => void;
}

const PrescriptionDetailModal: React.FC<PrescriptionDetailModalProps> = ({ prescription, onClose }) => {
    const { user } = useAuth();
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl transform transition-all relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X className="h-6 w-6" />
                </button>
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800 text-center">Prescription Details</h2>
                </div>
                <div className="p-8 max-h-[70vh] overflow-y-auto">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="font-bold text-xl">{prescription.doctorName}</h3>
                            <p className="text-gray-600">MediConnect Plus Clinic</p>
                        </div>
                        <div>
                            <p className="font-semibold">Date: {new Date(prescription.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md mb-6 border">
                        <h4 className="font-semibold text-gray-700">Patient: <span className="font-normal">{user?.name}</span></h4>
                    </div>
                    <div className="mb-6">
                        <h4 className="font-bold text-lg mb-3 flex items-center"><Pill className="h-5 w-5 mr-2 text-blue-600"/> Medications</h4>
                        <div className="space-y-2 border-l-4 border-blue-200 pl-4">
                            {prescription.medicines.map(med => (
                                <div key={med.id}>
                                    <p className="font-semibold text-gray-800">{med.name}</p>
                                    <p className="text-sm text-gray-600 ml-4">↳ Frequency: {med.frequency}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    {prescription.notes && (
                        <div className="mb-8">
                            <h4 className="font-bold text-lg mb-3 flex items-center"><FileText className="h-5 w-5 mr-2 text-green-600"/> Doctor's Notes</h4>
                            <p className="text-gray-700 bg-green-50 p-4 rounded-md border border-green-200 whitespace-pre-wrap">{prescription.notes}</p>
                        </div>
                    )}
                </div>
                <div className="p-6 bg-gray-50 rounded-b-lg flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 font-semibold transition">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const AppointmentStatusBadge: React.FC<{ status: Appointment['status'] }> = ({ status }) => {
    const baseClasses = "text-xs font-bold inline-flex items-center px-2.5 py-0.5 rounded-full";
    if (status === 'Confirmed') {
        return <span className={`${baseClasses} bg-green-100 text-green-800`}><CheckCircle className="h-3 w-3 mr-1" />Confirmed</span>;
    }
    if (status === 'Pending') {
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}><AlertCircle className="h-3 w-3 mr-1" />Pending</span>;
    }
    return <span className={`${baseClasses} bg-red-100 text-red-800`}>Cancelled</span>;
};

const getAppointmentCardClasses = (status: Appointment['status']) => {
    switch(status) {
        case 'Confirmed': return 'bg-green-50 border-green-200';
        case 'Pending': return 'bg-yellow-50 border-yellow-200';
        case 'Cancelled': return 'bg-red-50 border-red-200';
    }
}


const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [selectedSpec, setSelectedSpec] = useState<string>('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Start with loading true
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [appointmentsData, prescriptionsData] = await Promise.all([
          appointmentService.getAppointments(),
          prescriptionService.getPrescriptions()
        ]);

        setAppointments(appointmentsData);
        setPrescriptions(prescriptionsData);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  // Fetch specializations on component mount
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        setLoading(true);
        const specs = await doctorService.getSpecializations();
        setSpecializations(specs || []); // Ensure we always set an array
        if (specs && specs.length > 0) {
          setSelectedSpec(specs[0]);
        }
      } catch (err) {
        console.error('Failed to fetch specializations:', err);
        setError('Failed to load doctor specializations');
        setSpecializations([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchSpecializations();
  }, []);

  // Find doctors by specialization
  const findDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setDoctors([]);
      const result = await doctorService.getDoctorsBySpecialization(selectedSpec);
      setDoctors(result);
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
      setError('Failed to find doctors. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedSpec]);

  const handleOpenBookingModal = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setSelectedDoctor(null);
    setIsBookingModalOpen(false);
  };

  const handleConfirmBooking = async (doctor: Doctor, slot: string) => {
    try {
      setLoading(true);
      const appointment = await appointmentService.createAppointment({
        doctorId: doctor.id,
        dateTime: slot,
        notes: ''
      });
      setAppointments(prev => [appointment, ...prev]);
      handleCloseBookingModal();
      alert('Appointment scheduled successfully!');
    } catch (err) {
      alert('Failed to schedule appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
  };

  const handleClosePrescriptionModal = () => {
      setSelectedPrescription(null);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Appointments and Prescriptions */}
      <div className="lg:col-span-1 space-y-8">
        <Card title="Upcoming Appointments">
           {(appointments || []).map(app => (
               <div key={app.id} className={`p-4 mb-2 rounded-lg border ${getAppointmentCardClasses(app.status)}`}>
                   <div className="flex justify-between items-start">
                    <p className="font-semibold text-gray-800">{app.doctorName} <span className="text-sm font-normal text-gray-600">({app.doctorSpecialization})</span></p>
                    <AppointmentStatusBadge status={app.status} />
                   </div>
                   <div className="flex items-center text-sm text-gray-700 mt-1">
                       <Calendar className="h-4 w-4 mr-2" /> {app.date} at {app.time}
                   </div>
               </div>
           ))}
           {(!appointments || appointments.length === 0) && <p className="text-gray-500">No upcoming appointments.</p>}
        </Card>
        <Card title="My Prescriptions">
            {(prescriptions || []).map(pre => (
                 <div key={pre.id} className="p-4 mb-2 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="font-semibold text-blue-800">From: {pre.doctorName}</p>
                    <div className="flex items-center text-sm text-gray-700 mt-1">
                        <Calendar className="h-4 w-4 mr-2" /> {pre.date}
                    </div>
                     <button 
                        onClick={() => handleViewPrescription(pre)}
                        className="text-sm text-blue-600 hover:underline mt-2">
                        View Details
                     </button>
                 </div>
            ))}
            {(!prescriptions || prescriptions.length === 0) && <p className="text-gray-500">No prescriptions found.</p>}
        </Card>
      </div>

      {/* Right Column: Find a Doctor */}
      <div className="lg:col-span-2">
        <Card title="Find and Book a Doctor">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <select
              value={selectedSpec}
              onChange={(e) => setSelectedSpec(e.target.value)}
              className="w-full md:w-1/2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!specializations.length}
            >
              <option value="">Select a specialization</option>
              {(specializations || []).map(spec => <option key={spec} value={spec}>{spec}</option>)}
            </select>
            <button
              onClick={findDoctors}
              disabled={loading || !selectedSpec}
              className="w-full md:w-auto bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
            >
              {loading ? 'Searching...' : 'Find Doctors'}
            </button>
          </div>
          {loading && <Spinner />}
          {!loading && (
            <div className="space-y-4">
              {(doctors || []).map(doc => (
                <div key={doc.id} className="p-4 border rounded-lg bg-white shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-bold text-lg text-gray-800">{doc.name}</h4>
                        <p className="text-sm text-gray-600 flex items-center mt-1"><Stethoscope className="h-4 w-4 mr-2" />{doc.specialization} - {doc.qualifications}</p>
                        <p className="text-sm text-gray-800 flex items-center font-semibold mt-1"><CreditCard className="h-4 w-4 mr-2 text-green-600" />₹{doc.consultationFee} Consultation Fee</p>
                    </div>
                    <button onClick={() => handleOpenBookingModal(doc)} className="bg-green-500 text-white text-sm font-semibold py-1 px-3 rounded-full hover:bg-green-600 flex-shrink-0 ml-4">Book Now</button>
                  </div>
                  <div className="mt-4">
                    <h5 className="text-sm font-semibold mb-2 text-gray-700">Available Slots:</h5>
                    <div className="flex flex-wrap gap-2">
                      {(doc.availability || []).map(slot => (
                        <div key={slot} className="flex items-center bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1.5 rounded-full">
                          <Clock className="h-3 w-3 mr-1.5" /> {slot}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {(!doctors || doctors.length === 0) && !loading && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No doctors found for this specialization.</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
      {isBookingModalOpen && selectedDoctor && (
        <BookingModal 
            doctor={selectedDoctor}
            onClose={handleCloseBookingModal}
            onConfirm={handleConfirmBooking}
        />
      )}
      {selectedPrescription && (
        <PrescriptionDetailModal 
            prescription={selectedPrescription}
            onClose={handleClosePrescriptionModal}
        />
      )}
    </div>
  );
};

export default PatientDashboard;