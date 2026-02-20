import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Appointment {
  id: string;
  patientName: string;
  date: string;
  doctor: string;
  department: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No-Show';
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  contact: string;
  lastVisit: string;
  status: 'Active' | 'Discharged' | 'Critical';
  gender: string;
  bloodGroup: string;
}

export interface Doctor {
  id: string;
  name: string;
  department: string;
  availability: string;
  status: 'Available' | 'On Leave' | 'In Surgery';
  slotDuration: number;
}

export interface Resource {
  id: string;
  type: string;
  name: string;
  total: number;
  occupied: number;
  available: number;
  threshold?: number;
}

export interface ServiceRequest {
  id: string;
  resourceType: string;
  quantity: number;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  message: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  date: string;
}

export interface EmergencyCase {
  id: string;
  patientName: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  arrivalTime: string;
  assignedResource: string;
  status: 'Waiting' | 'In Treatment' | 'Resolved';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'appointment' | 'resource' | 'crisis' | 'service';
  time: string;
  read: boolean;
}

export interface AuditLog {
  id: string;
  action: string;
  module: string;
  timestamp: string;
  status: 'Success' | 'Failed';
  user: string;
}

interface AppContextType {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  doctors: Doctor[];
  setDoctors: React.Dispatch<React.SetStateAction<Doctor[]>>;
  resources: Resource[];
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
  serviceRequests: ServiceRequest[];
  setServiceRequests: React.Dispatch<React.SetStateAction<ServiceRequest[]>>;
  emergencyCases: EmergencyCase[];
  setEmergencyCases: React.Dispatch<React.SetStateAction<EmergencyCase[]>>;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  auditLogs: AuditLog[];
  addAuditLog: (action: string, module: string) => void;
  crisisMode: boolean;
  setCrisisMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};

const initialAppointments: Appointment[] = [
  { id: '1', patientName: 'Rahul Sharma', date: '2026-02-20 09:00', doctor: 'Dr. Priya Patel', department: 'Cardiology', status: 'Scheduled' },
  { id: '2', patientName: 'Anita Desai', date: '2026-02-20 10:30', doctor: 'Dr. Amit Singh', department: 'Neurology', status: 'Completed' },
  { id: '3', patientName: 'Vikram Joshi', date: '2026-02-20 11:00', doctor: 'Dr. Priya Patel', department: 'Cardiology', status: 'Scheduled' },
  { id: '4', patientName: 'Sneha Reddy', date: '2026-02-20 14:00', doctor: 'Dr. Neha Gupta', department: 'Orthopedics', status: 'Cancelled' },
  { id: '5', patientName: 'Arjun Mehta', date: '2026-02-20 15:30', doctor: 'Dr. Rajesh Kumar', department: 'Dermatology', status: 'Scheduled' },
];

const initialPatients: Patient[] = [
  { id: '1', name: 'Rahul Sharma', age: 45, contact: '+91 98765 11111', lastVisit: '2026-02-18', status: 'Active', gender: 'Male', bloodGroup: 'O+' },
  { id: '2', name: 'Anita Desai', age: 32, contact: '+91 98765 22222', lastVisit: '2026-02-20', status: 'Active', gender: 'Female', bloodGroup: 'A+' },
  { id: '3', name: 'Vikram Joshi', age: 58, contact: '+91 98765 33333', lastVisit: '2026-02-15', status: 'Critical', gender: 'Male', bloodGroup: 'B+' },
  { id: '4', name: 'Sneha Reddy', age: 27, contact: '+91 98765 44444', lastVisit: '2026-02-10', status: 'Discharged', gender: 'Female', bloodGroup: 'AB-' },
];

const initialDoctors: Doctor[] = [
  { id: '1', name: 'Dr. Priya Patel', department: 'Cardiology', availability: 'Mon-Fri 9AM-5PM', status: 'Available', slotDuration: 30 },
  { id: '2', name: 'Dr. Amit Singh', department: 'Neurology', availability: 'Mon-Sat 10AM-4PM', status: 'Available', slotDuration: 45 },
  { id: '3', name: 'Dr. Neha Gupta', department: 'Orthopedics', availability: 'Tue-Sat 8AM-2PM', status: 'In Surgery', slotDuration: 30 },
  { id: '4', name: 'Dr. Rajesh Kumar', department: 'Dermatology', availability: 'Mon-Fri 11AM-6PM', status: 'On Leave', slotDuration: 20 },
];

const initialResources: Resource[] = [
  { id: '1', type: 'bed', name: 'General Ward', total: 120, occupied: 95, available: 25 },
  { id: '2', type: 'bed', name: 'ICU', total: 30, occupied: 27, available: 3, threshold: 5 },
  { id: '3', type: 'bed', name: 'Private Room', total: 40, occupied: 32, available: 8 },
  { id: '4', type: 'oxygen', name: 'Oxygen Cylinders', total: 200, occupied: 145, available: 55, threshold: 30 },
  { id: '5', type: 'blood', name: 'A+', total: 50, occupied: 35, available: 15, threshold: 10 },
  { id: '6', type: 'blood', name: 'B+', total: 40, occupied: 28, available: 12, threshold: 8 },
  { id: '7', type: 'blood', name: 'O+', total: 60, occupied: 48, available: 12, threshold: 15 },
  { id: '8', type: 'blood', name: 'AB-', total: 20, occupied: 18, available: 2, threshold: 5 },
  { id: '9', type: 'ventilator', name: 'Ventilators', total: 50, occupied: 38, available: 8, threshold: 10 },
];

const initialEmergency: EmergencyCase[] = [
  { id: '1', patientName: 'Emergency Patient 1', severity: 'Critical', arrivalTime: '08:15 AM', assignedResource: 'ICU Bed 3', status: 'In Treatment' },
  { id: '2', patientName: 'Emergency Patient 2', severity: 'High', arrivalTime: '09:30 AM', assignedResource: 'ER Bay 5', status: 'Waiting' },
  { id: '3', patientName: 'Emergency Patient 3', severity: 'Medium', arrivalTime: '10:00 AM', assignedResource: 'General Ward', status: 'In Treatment' },
];

const initialNotifications: Notification[] = [
  { id: '1', title: 'ICU Near Capacity', message: 'ICU occupancy has reached 90%. Consider resource allocation.', type: 'resource', time: '5 min ago', read: false },
  { id: '2', title: 'New Appointment', message: 'Rahul Sharma has booked an appointment with Dr. Priya Patel.', type: 'appointment', time: '15 min ago', read: false },
  { id: '3', title: 'Blood Bank Alert', message: 'AB- blood units are critically low (2 units remaining).', type: 'crisis', time: '1 hour ago', read: true },
  { id: '4', title: 'Service Request Approved', message: 'Request for 10 oxygen cylinders has been approved.', type: 'service', time: '2 hours ago', read: true },
];

const initialServiceRequests: ServiceRequest[] = [
  { id: 'SR001', resourceType: 'Oxygen Cylinders', quantity: 10, urgency: 'High', message: 'ICU running low', status: 'Approved', date: '2026-02-20' },
  { id: 'SR002', resourceType: 'Blood Units (O+)', quantity: 5, urgency: 'Critical', message: 'Emergency surgery scheduled', status: 'Pending', date: '2026-02-20' },
  { id: 'SR003', resourceType: 'Ventilators', quantity: 2, urgency: 'Medium', message: 'Preventive maintenance replacement', status: 'Completed', date: '2026-02-19' },
];

const initialAuditLogs: AuditLog[] = [
  { id: '1', action: 'Created Appointment', module: 'Appointments', timestamp: '2026-02-20 09:00:00', status: 'Success', user: 'Admin' },
  { id: '2', action: 'Updated Bed Status', module: 'Resources', timestamp: '2026-02-20 08:45:00', status: 'Success', user: 'Admin' },
  { id: '3', action: 'Activated Crisis Mode', module: 'Crisis Panel', timestamp: '2026-02-19 22:30:00', status: 'Success', user: 'Admin' },
  { id: '4', action: 'Service Request Created', module: 'Service Requests', timestamp: '2026-02-19 20:15:00', status: 'Success', user: 'Admin' },
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(initialServiceRequests);
  const [emergencyCases, setEmergencyCases] = useState<EmergencyCase[]>(initialEmergency);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [crisisMode, setCrisisMode] = useState(false);

  const addAuditLog = (action: string, module: string) => {
    const log: AuditLog = {
      id: Date.now().toString(),
      action,
      module,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: 'Success',
      user: 'Admin',
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      appointments, setAppointments,
      patients, setPatients,
      doctors, setDoctors,
      resources, setResources,
      serviceRequests, setServiceRequests,
      emergencyCases, setEmergencyCases,
      notifications, setNotifications,
      auditLogs, addAuditLog,
      crisisMode, setCrisisMode,
    }}>
      {children}
    </AppContext.Provider>
  );
};
