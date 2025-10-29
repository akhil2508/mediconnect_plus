const API_URL = 'http://localhost:8001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const appointmentService = {
  getAppointments: async () => {
    const response = await fetch(`${API_URL}/appointments`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch appointments');
    return response.json();
  },

  createAppointment: async (data: any) => {
    const response = await fetch(`${API_URL}/appointments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create appointment');
    return response.json();
  },

  updateAppointmentStatus: async (id: string, status: string) => {
    const response = await fetch(`${API_URL}/appointments/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update appointment');
    return response.json();
  }
};

export const prescriptionService = {
  getPrescriptions: async () => {
    const response = await fetch(`${API_URL}/prescriptions`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch prescriptions');
    return response.json();
  },

  createPrescription: async (data: any) => {
    const response = await fetch(`${API_URL}/prescriptions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create prescription');
    return response.json();
  }
};

export const doctorService = {
  getSpecializations: async () => {
    const response = await fetch(`${API_URL}/doctors/specializations`);
    if (!response.ok) throw new Error('Failed to fetch specializations');
    return response.json();
  },

  getDoctorsBySpecialization: async (specialization: string) => {
    const response = await fetch(`${API_URL}/doctors/by-specialization/${encodeURIComponent(specialization)}`);
    if (!response.ok) throw new Error('Failed to fetch doctors');
    return response.json();
  }
};

export const donationService = {
  getDonations: async () => {
    const response = await fetch(`${API_URL}/donations`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch donations');
    return response.json();
  },

  scheduleDonation: async (data: any) => {
    const response = await fetch(`${API_URL}/donations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to schedule donation');
    return response.json();
  },

  getBloodInventory: async () => {
    const response = await fetch(`${API_URL}/donations/inventory`);
    if (!response.ok) throw new Error('Failed to fetch blood inventory');
    return response.json();
  }
};