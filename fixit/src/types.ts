export type UserRole = 'customer' | 'worker' | 'admin';

export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export type JobStatus =
  | 'requested'
  | 'pending'
  | 'accepted'
  | 'on_the_way'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'emergency';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface NeighborhoodLocation {
  city?: string;
  neighborhood: string;
  addressDetails?: string;
  latitude?: number;
  longitude?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  profileImage: string;
  neighborhood: string;
  createdAt: string;
  isSuspended?: boolean;
}

export interface WorkerProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  serviceCategory: string; // e.g. "Plumbing"
  services: string[]; // e.g. ["Pipe repair", "Leak detection", "Water tank installation"]
  description: string;
  experienceYears: number;
  neighborhood: string;
  location: LocationCoords;
  availability: {
    isAvailable: boolean;
    startTime: string;
    endTime: string;
    days: string[];
  };
  verificationStatus: VerificationStatus;
  ratingAverage: number;
  reviewCount: number;
  completedJobs: number;
  hourlyRateBirr?: number;
  skills: string[];
  createdAt: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  group: 'Home Services' | 'Vehicle Services' | 'Technology' | 'Other';
  description: string;
  icon: string; // Lucide icon name
  popular: boolean;
  subServices: string[];
  active: boolean;
}

export interface AIProblemAnalysis {
  category: string;
  problem: string;
  suggestedWorkerType: string;
  urgency: UrgencyLevel;
  confidence: number;
  possibleCauses?: string[];
  recommendedPreparation?: string[];
  estimatedTime?: string;
}

export interface ServiceRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerImage?: string;
  workerId?: string;
  workerName?: string;
  workerPhone?: string;
  workerImage?: string;
  serviceCategory: string;
  title: string;
  description: string;
  images: string[];
  location: NeighborhoodLocation;
  urgency: UrgencyLevel;
  preferredTime: string;
  status: JobStatus;
  aiAnalysis?: AIProblemAnalysis;
  priceEstimateBirr?: number;
  notes?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  requestId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  customerImage?: string;
  workerId: string;
  requestId: string;
  serviceCategory: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'status' | 'message' | 'approval' | 'system';
  isRead: boolean;
  requestId?: string;
  link?: string;
  createdAt: string;
}

export interface ReportItem {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedUserId: string;
  reportedUserName: string;
  requestId?: string;
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalCustomers: number;
  totalWorkers: number;
  pendingApprovals: number;
  activeJobs: number;
  completedJobs: number;
  totalReports: number;
  averageRating: number;
}

export type Report = ReportItem;
