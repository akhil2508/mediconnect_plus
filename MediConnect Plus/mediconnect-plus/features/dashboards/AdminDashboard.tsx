
import React, { useState, useEffect } from 'react';
import { BloodInventory, BloodDrive } from '../../types';
import { generateBloodInventory, generateBloodDrives } from '../../services/geminiService';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';
import { Droplet, PlusCircle, Trash2 } from 'lucide-react';

const AdminDashboard: React.FC = () => {
    const [inventory, setInventory] = useState<BloodInventory[]>([]);
    const [drives, setDrives] = useState<BloodDrive[]>([]);
    const [loadingInventory, setLoadingInventory] = useState(true);
    const [loadingDrives, setLoadingDrives] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoadingInventory(true);
            const invResult = await generateBloodInventory();
            setInventory(invResult);
            setLoadingInventory(false);

            setLoadingDrives(true);
            const driveResult = await generateBloodDrives();
            setDrives(driveResult);
            setLoadingDrives(false);
        };
        fetchData();
    }, []);

    const getBarColor = (units: number) => {
        if (units < 20) return 'bg-red-500';
        if (units < 50) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                <Card title="Real-time Blood Inventory">
                    {loadingInventory ? <Spinner /> : (
                        <div className="space-y-4">
                            {inventory.map(item => (
                                <div key={item.bloodType}>
                                    <div className="flex justify-between items-center mb-1">
                                        <div className="flex items-center">
                                            <Droplet className="h-5 w-5 mr-2 text-red-500" />
                                            <span className="font-bold text-lg text-gray-700">{item.bloodType}</span>
                                        </div>
                                        <span className="font-semibold text-gray-800">{item.units} units</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-4">
                                        <div 
                                            className={`h-4 rounded-full ${getBarColor(item.units)}`} 
                                            style={{ width: `${Math.min(item.units, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
            <div>
                <Card title="Manage Donation Drives">
                    <div className="mb-6">
                         <button className="w-full flex items-center justify-center bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition">
                            <PlusCircle className="h-5 w-5 mr-2" /> Create New Drive
                        </button>
                    </div>
                    {loadingDrives ? <Spinner /> : (
                        <div className="space-y-3">
                            {drives.map(drive => (
                                <div key={drive.id} className="p-3 bg-gray-50 rounded-lg border flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-gray-800">{drive.name}</p>
                                        <p className="text-sm text-gray-600">{drive.location} - {drive.date}</p>
                                    </div>
                                    <div>
                                        <button className="p-2 text-gray-500 hover:text-red-600">
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
