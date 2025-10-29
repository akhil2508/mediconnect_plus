import React, { useState } from 'react';
import { Appointment, Medicine } from '../../types';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';
import { useAuth } from '../auth/AuthContext';
import { Calendar, User, FileText, PlusCircle, Trash2, Eye, Pill } from 'lucide-react';

// FIX: Added missing patientId and doctorId properties to conform to the Appointment type.
const initialAppointments: Appointment[] = [
    { id: 'app1', patientId: 'patient-alice', doctorId: 'doc-self', patientName: 'Alice Johnson', doctorName: 'Dr. Me', doctorSpecialization: 'Cardiologist', date: 'Today', time: '10:00 AM', status: 'Pending' },
    { id: 'app2', patientId: 'patient-bob', doctorId: 'doc-self', patientName: 'Bob Williams', doctorName: 'Dr. Me', doctorSpecialization: 'Cardiologist', date: 'Today', time: '11:30 AM', status: 'Confirmed' },
    { id: 'app3', patientId: 'patient-charlie', doctorId: 'doc-self', patientName: 'Charlie Brown', doctorName: 'Dr. Me', doctorSpecialization: 'Cardiologist', date: 'Tomorrow', time: '09:00 AM', status: 'Confirmed' },
];

// --- Prescription Preview Modal Component ---
interface PrescriptionData {
    patientName: string;
    date: string;
    medicines: Medicine[];
    notes: string;
}

interface PrescriptionPreviewModalProps {
    prescription: PrescriptionData;
    doctorName: string;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    loading: boolean;
    isSigned: boolean;
    onSign: () => void;
}

const PrescriptionPreviewModal: React.FC<PrescriptionPreviewModalProps> = ({ prescription, doctorName, onClose, onConfirm, loading, isSigned, onSign }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl transform transition-all">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800 text-center">Prescription Preview</h2>
                </div>
                <div className="p-8 max-h-[70vh] overflow-y-auto">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="font-bold text-xl">{doctorName}</h3>
                            <p className="text-gray-600">MediConnect Plus Clinic</p>
                        </div>
                        <div>
                            <p className="font-semibold">Date: {new Date(prescription.date).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md mb-6 border">
                        <h4 className="font-semibold text-gray-700">Patient: <span className="font-normal">{prescription.patientName}</span></h4>
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
                            <h4 className="font-bold text-lg mb-3 flex items-center"><FileText className="h-5 w-5 mr-2 text-green-600"/> Additional Notes</h4>
                            <p className="text-gray-700 bg-green-50 p-4 rounded-md border border-green-200 whitespace-pre-wrap">{prescription.notes}</p>
                        </div>
                    )}
                    
                    <div className="mt-16 text-right">
                        {!isSigned ? (
                             <button
                                onClick={onSign}
                                className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Click to Sign Digitally
                            </button>
                        ) : (
                            <div className="inline-block">
                                <p 
                                    className="italic text-gray-700 pb-2 border-b-2 border-gray-400 text-2xl" 
                                    style={{ fontFamily: "'Caveat', cursive" }}
                                >
                                    {doctorName}
                                </p>
                                <p className="text-center font-semibold mt-2 text-gray-800">{doctorName}</p>
                                <p className="text-xs text-gray-500 text-center">Digitally Signed</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-b-lg flex justify-end gap-4">
                    <button onClick={onClose} className="px-6 py-2 rounded-md text-gray-800 bg-gray-200 hover:bg-gray-300 font-semibold transition">
                        Edit
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading || !isSigned}
                        className="px-6 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                    >
                        {loading ? 'Confirming...' : 'Confirm & Upload'}
                    </button>
                </div>
            </div>
        </div>
    );
};


const DoctorDashboard: React.FC = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
    const [patientName, setPatientName] = useState('Alice Johnson');
    const [prescriptionDate, setPrescriptionDate] = useState(new Date().toISOString().split('T')[0]);
    const [customNotes, setCustomNotes] = useState('');
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [newMedicineName, setNewMedicineName] = useState('');
    const [newMedicineFreq, setNewMedicineFreq] = useState('Once a day');
    const [loading, setLoading] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isSigned, setIsSigned] = useState(false);
    
    const handleConfirmAppointment = (appId: string) => {
        setAppointments(prev =>
            prev.map(app => (app.id === appId ? { ...app, status: 'Confirmed' } : app))
        );
    };

    const handleAddMedicine = () => {
        if (newMedicineName.trim() === '') return;
        const newMedicine: Medicine = {
            id: Date.now(),
            name: newMedicineName.trim(),
            frequency: newMedicineFreq,
        };
        setMedicines(prev => [...prev, newMedicine]);
        setNewMedicineName('');
        setNewMedicineFreq('Once a day');
    };

    const handleRemoveMedicine = (medId: number | string) => {
        setMedicines(prev => prev.filter(med => med.id !== medId));
    };
    
    const handleOpenPreview = () => {
        if (!patientName || medicines.length === 0) {
            alert("Please provide the patient's name and add at least one medicine before previewing.");
            return;
        }
        setIsSigned(false); // Reset signature state each time preview is opened
        setIsPreviewOpen(true);
    };
    
    const handleSign = () => {
        setIsSigned(true);
    };

    const handleConfirmUpload = async () => {
        setLoading(true);
        // Here you would typically have an API call
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network request
        setLoading(false);
        setIsPreviewOpen(false); // Close modal on success
        alert(`Prescription for ${patientName} has been uploaded and the patient notified.`);
        
        // Reset form state
        setMedicines([]);
        setCustomNotes('');
    }

    return (
        <>
             <style>
                @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');
            </style>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card title="Today's Appointments">
                        <div className="space-y-4">
                            {appointments.filter(a => a.date === 'Today').map(app => (
                                <div key={app.id} className={`p-4 rounded-lg border ${app.status === 'Confirmed' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                                    <p className="font-semibold text-gray-800">{app.patientName}</p>
                                    <div className="flex items-center text-sm text-gray-600 mt-1">
                                        <Calendar className="h-4 w-4 mr-2" /> {app.time}
                                    </div>
                                    <div className="mt-2 flex gap-2">
                                        <button className="text-xs bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600">View Details</button>
                                        {app.status === 'Pending' && (
                                            <button 
                                                onClick={() => handleConfirmAppointment(app.id)}
                                                className="text-xs bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600"
                                            >
                                                Confirm
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card title="Create Digital Prescription">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Patient Name</label>
                                    <input
                                        type="text" value={patientName}
                                        onChange={e => setPatientName(e.target.value)}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Prescription Date</label>
                                    <input
                                        type="date" value={prescriptionDate}
                                        onChange={e => setPrescriptionDate(e.target.value)}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Medicines</label>
                                <div className="space-y-2">
                                    {medicines.map(med => (
                                        <div key={med.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                            <span>{med.name} <span className="text-gray-500 text-sm">({med.frequency})</span></span>
                                            <button onClick={() => handleRemoveMedicine(med.id)} className="text-red-500 hover:text-red-700">
                                                <Trash2 className="h-4 w-4"/>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <input type="text" placeholder="Medicine Name" value={newMedicineName} onChange={e => setNewMedicineName(e.target.value)} className="flex-grow p-2 border border-gray-300 rounded-md"/>
                                    <select value={newMedicineFreq} onChange={e => setNewMedicineFreq(e.target.value)} className="p-2 border border-gray-300 rounded-md">
                                        <option>Once a day</option>
                                        <option>Twice a day</option>
                                        <option>Thrice a day</option>
                                        <option>As needed</option>
                                    </select>
                                    <button onClick={handleAddMedicine} className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
                                        <PlusCircle className="h-5 w-5"/>
                                    </button>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Custom Notes / Advice</label>
                                <textarea
                                    value={customNotes}
                                    onChange={e => setCustomNotes(e.target.value)}
                                    rows={4}
                                    placeholder="e.g., Drink plenty of water, avoid strenuous activity..."
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                />
                            </div>

                            <button
                                onClick={handleOpenPreview}
                                disabled={loading}
                                className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center justify-center"
                            >
                                <Eye className="h-5 w-5 mr-2" /> Preview Prescription
                            </button>
                        </div>
                    </Card>
                </div>
            </div>

            {isPreviewOpen && (
                <PrescriptionPreviewModal
                    prescription={{
                        patientName,
                        date: prescriptionDate,
                        medicines,
                        notes: customNotes
                    }}
                    doctorName={user?.name || 'Dr. Me'}
                    onClose={() => setIsPreviewOpen(false)}
                    onConfirm={handleConfirmUpload}
                    loading={loading}
                    isSigned={isSigned}
                    onSign={handleSign}
                />
            )}
        </>
    );
};

export default DoctorDashboard;