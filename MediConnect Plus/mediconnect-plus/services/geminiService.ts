import { GoogleGenerativeAI } from "@google/generative-ai";
import { Doctor, BloodDrive, BloodInventory } from '../types';

const ai = new GoogleGenerativeAI(process.env.API_KEY as string);
const model = ai.getGenerativeModel({ model: "gemini-pro" });

export const generateDoctors = async (specialty: string): Promise<Doctor[]> => {
  try {
    const prompt = `Generate a list of 5 fictional doctors specializing in ${specialty} practicing in Kanpur, India. Provide authentic-sounding Indian names. Include their name, common Indian medical qualifications (e.g., MD, MBBS, DNB), a list of 3 available time slots for tomorrow, and a fictional consultation fee in INR. Return the response in JSON format.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const parsedResponse = JSON.parse(text);
    return parsedResponse as Doctor[];
  } catch (error) {
    console.error("Error generating doctors:", error);
    return [];
  }
};

export const generateBloodDrives = async (): Promise<BloodDrive[]> => {
  try {
    const prompt = `Generate a list of 3 fictional upcoming blood donation drives. Include a creative name, location, date, start time, end time, and number of available slots. Return the response in JSON format.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const parsedResponse = JSON.parse(text);
    return parsedResponse as BloodDrive[];
  } catch (error) {
    console.error("Error generating blood drives:", error);
    return [];
  }
};

export const generatePrescriptionText = async (patientName: string, doctorName: string, diagnosis: string): Promise<string> => {
  try {
    const prompt = `Generate a brief, fictional medical prescription for a patient named ${patientName} from Dr. ${doctorName}. The diagnosis is a ${diagnosis}. Include medication, dosage, and advice. Keep it under 100 words.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating prescription text:", error);
    return "Could not generate prescription. Please try again.";
  }
}

export const generateBloodInventory = async (): Promise<BloodInventory[]> => {
  // This is mocked as Gemini might not give consistent simple JSON for this
  return Promise.resolve([
    { bloodType: 'A+', units: 50 },
    { bloodType: 'A-', units: 25 },
    { bloodType: 'B+', units: 40 },
    { bloodType: 'B-', units: 15 },
    { bloodType: 'AB+', units: 10 },
    { bloodType: 'AB-', units: 5 },
    { bloodType: 'O+', units: 80 },
    { bloodType: 'O-', units: 30 },
  ]);
}