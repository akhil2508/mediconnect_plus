
import React, { useState, useEffect } from 'react';
import { BloodDrive, Donation } from '../../types';
import { generateBloodDrives } from '../../services/geminiService';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';
import { Droplets, MapPin, Calendar, CheckCircle, Clock, X, AlertCircle } from 'lucide-react';

const mockDonations: Donation[] = [
    { id: 'don1', driveName: 'Community Blood Drive', location: 'City Hall', date: '2024-03-10', status: 'Completed' },
    { id: 'don2', driveName: 'University Blood Drive', location: 'Campus Center', date: '2023-09-22', status: 'Completed' },
];

// Helper to generate mock time slots for a drive
const generateTimeSlots = (startTime: string, slotsAvailable: number): string[] => {
    const slots = [];
    // Simplified time parsing
    const startHour = parseInt(startTime.split(':')[0]);
    const isPM = startTime.toLowerCase().includes('pm');
    
    let currentHour = startHour;
    if (isPM && currentHour !== 12) {
        currentHour += 12;
    }
    if (!isPM && currentHour === 12) { // 12 AM case
        currentHour = 0;
    }

    // Generate up to 12 slots for display purposes, 20 minutes apart
    for (let i = 0; i < Math.min(slotsAvailable, 12); i++) {
        const date = new Date();
        date.setHours(currentHour, i * 20, 0, 0); 
        slots.push(date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    }
    return slots;
};

// --- Booking Modal Component ---
interface BookingModalProps {
    drive: BloodDrive;
    onClose: () => void;
    onConfirm: (drive: BloodDrive, slot: string) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ drive, onClose, onConfirm }) => {
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const availableSlots = generateTimeSlots(drive.startTime, drive.slotsAvailable);

    const handleConfirm = () => {
        if (selectedSlot) {
            onConfirm(drive, selectedSlot);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative animate-fade-in-up">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                    <X className="h-6 w-6" />
                </button>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Book Donation Slot</h3>
                <p className="text-gray-700">for <span className="font-semibold">{drive.name}</span></p>
                <p className="text-sm text-gray-500">{drive.date}</p>
                
                <div className="my-6">
                    <h4 className="text-md font-semibold text-gray-700 mb-3">Select an available time:</h4>
                    {availableSlots.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                            {availableSlots.map(slot => (
                                <button 
                                    key={slot}
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                        selectedSlot === slot 
                                        ? 'bg-red-600 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                    ) : <p className="text-gray-500">No slots available for this drive.</p>}
                </div>

                <div className="flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold">
                        Cancel
                    </button>
                    <button 
                        onClick={handleConfirm}
                        disabled={!selectedSlot}
                        className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Confirm Booking
                    </button>
                </div>
            </div>
        </div>
    );
};

const DonationStatusBadge: React.FC<{ status: Donation['status'] }> = ({ status }) => {
    const baseClasses = "text-xs font-bold inline-flex items-center px-2.5 py-0.5 rounded-full";
    if (status === 'Completed') {
        return <span className={`${baseClasses} bg-green-100 text-green-800`}><CheckCircle className="h-3 w-3 mr-1" />Completed</span>;
    }
    return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}><AlertCircle className="h-3 w-3 mr-1" />Scheduled</span>;
};


const DonorDashboard: React.FC = () => {
    const [drives, setDrives] = useState<BloodDrive[]>([]);
    const [loading, setLoading] = useState(true);
    const [donations, setDonations] = useState<Donation[]>(mockDonations);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedDrive, setSelectedDrive] = useState<BloodDrive | null>(null);

    useEffect(() => {
        const fetchDrives = async () => {
            setLoading(true);
            const result = await generateBloodDrives();
            setDrives(result);
            setLoading(false);
        };
        fetchDrives();
    }, []);

    const handleOpenBookingModal = (drive: BloodDrive) => {
        setSelectedDrive(drive);
        setIsBookingModalOpen(true);
    };

    const handleCloseBookingModal = () => {
        setSelectedDrive(null);
        setIsBookingModalOpen(false);
    };

    const handleConfirmBooking = (drive: BloodDrive, slot: string) => {
        const newDonation: Donation = {
            id: `don-${Date.now()}`,
            driveName: drive.name,
            location: drive.location,
            date: `${drive.date} at ${slot}`,
            status: 'Scheduled',
        };
        setDonations(prev => [newDonation, ...prev]);

        setDrives(prevDrives => prevDrives.map(d => 
            d.id === drive.id ? { ...d, slotsAvailable: d.slotsAvailable - 1 } : d
        ));

        handleCloseBookingModal();
        alert(`Slot booked successfully for ${drive.name} on ${newDonation.date}! Check your history for details.`);
    };

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card title="Upcoming Blood Donation Drives">
                        {loading ? <Spinner /> : (
                            <div className="space-y-4">
                                {drives.map(drive => {
                                    const isBooked = donations.some(d => d.driveName === drive.name && d.status === 'Scheduled');
                                    const isFull = drive.slotsAvailable === 0;

                                    return (
                                        <div key={drive.id} className="p-4 border rounded-lg bg-white shadow-sm">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-lg text-red-700">{drive.name}</h4>
                                                    <p className="text-sm text-gray-600 flex items-center mt-1"><MapPin className="h-4 w-4 mr-2" />{drive.location}</p>
                                                    <p className="text-sm text-gray-600 flex items-center mt-1"><Calendar className="h-4 w-4 mr-2" />{drive.date} from {drive.startTime} to {drive.endTime}</p>
                                                </div>
                                                <button 
                                                    onClick={() => handleOpenBookingModal(drive)}
                                                    disabled={isBooked || isFull}
                                                    className={`font-semibold py-2 px-4 rounded-full text-sm transition-colors ${
                                                        isBooked ? 'bg-green-500 text-white cursor-not-allowed' :
                                                        isFull ? 'bg-gray-400 text-white cursor-not-allowed' :
                                                        'bg-red-500 text-white hover:bg-red-600'
                                                    }`}
                                                >
                                                    {isBooked ? 'Booked' : isFull ? 'Full' : 'Book Slot'}
                                                </button>
                                            </div>
                                            <p className="text-sm font-medium text-gray-800 mt-3">{drive.slotsAvailable} slots available</p>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </Card>
                </div>
                <div className="lg:col-span-1">
                    <Card title="My Donation History">
                        <div className="space-y-3">
                            {donations.map(donation => (
                                <div key={donation.id} className={`p-3 rounded-lg border ${donation.status === 'Completed' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                                    <div className="flex justify-between items-start">
                                        <p className="font-semibold text-gray-800">{donation.driveName}</p>
                                        <DonationStatusBadge status={donation.status} />
                                    </div>
                                    <div className="text-sm text-gray-600">{donation.date}</div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
            {isBookingModalOpen && selectedDrive && (
                <BookingModal 
                    drive={selectedDrive}
                    onClose={handleCloseBookingModal}
                    onConfirm={handleConfirmBooking}
                />
            )}
            <style>
            {`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
            `}
            </style>
        </>
    );
};

export default DonorDashboard;
