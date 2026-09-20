import {
  User,
  WorkerProfile,
  ServiceCategory,
  ServiceRequest,
  Review,
  NotificationItem,
  ReportItem,
  AdminStats,
  AIProblemAnalysis,
  JobStatus
} from '../types';

const BASE_URL = '/api';

export const api = {
  // Auth & Users
  async login(email: string, role?: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role })
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Login failed');
    }
    return res.json();
  },

  async register(userData: any): Promise<{ user: User; token: string }> {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Registration failed');
    }
    return res.json();
  },

  async getCurrentUser(userId: string): Promise<{ user: User }> {
    const res = await fetch(`${BASE_URL}/auth/me?userId=${userId}`);
    return res.json();
  },

  async getUsers(): Promise<{ users: User[] }> {
    const res = await fetch(`${BASE_URL}/users`);
    return res.json();
  },

  async toggleSuspendUser(userId: string): Promise<{ user: User; workerProfile?: WorkerProfile }> {
    const res = await fetch(`${BASE_URL}/users/${userId}/toggle-suspend`, {
      method: 'POST'
    });
    return res.json();
  },

  // Services
  async getServices(): Promise<{ services: ServiceCategory[]; categories: ServiceCategory[] }> {
    const res = await fetch(`${BASE_URL}/services`);
    const data = await res.json();
    return {
      services: data.services || [],
      categories: data.services || []
    };
  },

  async createService(serviceData: Partial<ServiceCategory>): Promise<{ service: ServiceCategory }> {
    const res = await fetch(`${BASE_URL}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceData)
    });
    return res.json();
  },

  async createServiceCategory(serviceData: Partial<ServiceCategory>): Promise<{ service: ServiceCategory }> {
    return this.createService(serviceData);
  },

  async updateService(id: string, updates: Partial<ServiceCategory>): Promise<{ service: ServiceCategory }> {
    const res = await fetch(`${BASE_URL}/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  // Workers
  async getWorkers(params?: {
    category?: string;
    neighborhood?: string;
    rating?: number;
    availableOnly?: boolean;
    search?: string;
    includeUnapproved?: boolean;
    lat?: number;
    lng?: number;
  }): Promise<{ workers: (WorkerProfile & { distanceKm?: number })[] }> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.neighborhood) searchParams.append('neighborhood', params.neighborhood);
    if (params?.rating) searchParams.append('rating', String(params.rating));
    if (params?.availableOnly) searchParams.append('availableOnly', 'true');
    if (params?.search) searchParams.append('search', params.search);
    if (params?.includeUnapproved) searchParams.append('includeUnapproved', 'true');
    if (params?.lat) searchParams.append('lat', String(params.lat));
    if (params?.lng) searchParams.append('lng', String(params.lng));

    const res = await fetch(`${BASE_URL}/workers?${searchParams.toString()}`);
    return res.json();
  },

  async getWorkerById(id: string): Promise<{ worker: WorkerProfile; reviews: Review[] }> {
    const res = await fetch(`${BASE_URL}/workers/${id}`);
    if (!res.ok) throw new Error('Worker not found');
    return res.json();
  },

  async updateWorkerProfile(userId: string, updates: Partial<WorkerProfile>): Promise<{ worker: WorkerProfile }> {
    const res = await fetch(`${BASE_URL}/workers/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...updates })
    });
    return res.json();
  },

  async updateWorkerAvailability(workerId: string, isAvailable: boolean): Promise<{ availability: any }> {
    const res = await fetch(`${BASE_URL}/workers/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workerId, isAvailable })
    });
    const data = await res.json();
    return {
      availability: data.worker?.availability || { isAvailable, startTime: '08:00', endTime: '18:30', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] }
    };
  },

  async verifyWorker(
    id: string,
    status: 'approved' | 'rejected' | 'suspended',
    notes?: string
  ): Promise<{ worker: WorkerProfile }> {
    const res = await fetch(`${BASE_URL}/workers/${id}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes })
    });
    return res.json();
  },

  // Service Requests
  async getRequests(params?: {
    customerId?: string;
    workerId?: string;
    status?: string;
  }): Promise<{ requests: ServiceRequest[] }> {
    const searchParams = new URLSearchParams();
    if (params?.customerId) searchParams.append('customerId', params.customerId);
    if (params?.workerId) searchParams.append('workerId', params.workerId);
    if (params?.status) searchParams.append('status', params.status);

    const res = await fetch(`${BASE_URL}/requests?${searchParams.toString()}`);
    return res.json();
  },

  async getAllRequests(): Promise<{ requests: ServiceRequest[] }> {
    return this.getRequests();
  },

  async getCustomerRequests(customerId: string): Promise<{ requests: ServiceRequest[] }> {
    return this.getRequests({ customerId });
  },

  async getWorkerRequests(workerId: string): Promise<{ requests: ServiceRequest[] }> {
    return this.getRequests({ workerId });
  },

  async getRequestById(id: string): Promise<{ request: ServiceRequest }> {
    const res = await fetch(`${BASE_URL}/requests/${id}`);
    if (!res.ok) throw new Error('Request not found');
    return res.json();
  },

  async createRequest(reqData: Partial<ServiceRequest> & { neighborhood?: string; addressDetails?: string }): Promise<{ request: ServiceRequest }> {
    const res = await fetch(`${BASE_URL}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqData)
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to submit request');
    }
    return res.json();
  },

  async updateRequestStatus(
    id: string,
    statusOrPayload: JobStatus | { status: JobStatus; cancellationReason?: string; workerId?: string; workerName?: string; workerPhone?: string; workerImage?: string; notes?: string },
    extra?: { workerId?: string; notes?: string; cancellationReason?: string }
  ): Promise<{ request: ServiceRequest }> {
    const payload =
      typeof statusOrPayload === 'string'
        ? { status: statusOrPayload, ...extra }
        : { ...statusOrPayload, ...extra };

    const res = await fetch(`${BASE_URL}/requests/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Messages & Real-Time Chat
  async getMessages(requestId: string): Promise<{ messages: any[] }> {
    const res = await fetch(`${BASE_URL}/messages?requestId=${requestId}`);
    return res.json();
  },

  async sendMessage(msgData: {
    requestId: string;
    senderId: string;
    senderName: string;
    senderRole: string;
    receiverId: string;
    message: string;
  }): Promise<{ message: any }> {
    const res = await fetch(`${BASE_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msgData)
    });
    return res.json();
  },

  // Reviews
  async getReviews(workerId?: string, customerId?: string): Promise<{ reviews: Review[] }> {
    const searchParams = new URLSearchParams();
    if (workerId) searchParams.append('workerId', workerId);
    if (customerId) searchParams.append('customerId', customerId);
    const res = await fetch(`${BASE_URL}/reviews?${searchParams.toString()}`);
    return res.json();
  },

  async getWorkerReviews(workerId: string): Promise<{ reviews: Review[] }> {
    return this.getReviews(workerId);
  },

  async createReview(reviewData: {
    customerId: string;
    customerName: string;
    customerImage?: string;
    workerId: string;
    requestId: string;
    serviceCategory: string;
    rating: number;
    comment: string;
  }): Promise<{ review: Review; worker: WorkerProfile }> {
    const res = await fetch(`${BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to submit review');
    }
    return res.json();
  },

  // Notifications
  async getNotifications(userId: string): Promise<{ notifications: NotificationItem[] }> {
    const res = await fetch(`${BASE_URL}/notifications?userId=${userId}`);
    return res.json();
  },

  async markNotificationsRead(userId: string): Promise<{ success: boolean }> {
    const res = await fetch(`${BASE_URL}/notifications/read-all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  },

  // Reports
  async getReports(): Promise<{ reports: ReportItem[] }> {
    const res = await fetch(`${BASE_URL}/reports`);
    return res.json();
  },

  async createReport(reportData: {
    reporterId: string;
    reporterName: string;
    reportedUserId: string;
    reportedUserName: string;
    requestId?: string;
    reason: string;
    description: string;
  }): Promise<{ report: ReportItem }> {
    const res = await fetch(`${BASE_URL}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData)
    });
    return res.json();
  },

  async updateReportStatus(id: string, status: 'reviewed' | 'dismissed'): Promise<{ report: ReportItem }> {
    const res = await fetch(`${BASE_URL}/reports/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  async resolveReport(id: string, notes?: string): Promise<{ report: ReportItem }> {
    return this.updateReportStatus(id, 'reviewed');
  },

  // Admin Stats
  async getAdminStats(): Promise<{ stats: AdminStats }> {
    const res = await fetch(`${BASE_URL}/admin/stats`);
    return res.json();
  },

  // Diagnostic Engine Endpoints
  async analyzeProblem(data: {
    description?: string;
    imageBase64?: string;
    mimeType?: string;
  }): Promise<{ analysis: AIProblemAnalysis }> {
    const res = await fetch(`${BASE_URL}/ai/analyze-problem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to analyze problem with AI');
    }
    return res.json();
  },

  async matchWorkersWithAI(data: {
    category: string;
    problem: string;
    neighborhood: string;
    customerLat?: number;
    customerLng?: number;
    urgency?: string;
  }): Promise<{
    recommendedWorkers: (WorkerProfile & {
      distanceKm: number;
      matchScore: number;
      matchBreakdown: {
        serviceMatch: number;
        distanceScore: number;
        availabilityScore: number;
        ratingScore: number;
        experienceScore: number;
      };
      whyRecommended: string;
    })[];
    allMatchesCount: number;
  }> {
    const res = await fetch(`${BASE_URL}/ai/match-workers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async chatWithAIAssistant(data: {
    message: string;
    conversationHistory?: Array<{ role: 'user' | 'assistant'; text: string }>;
  }): Promise<{ reply: string }> {
    const res = await fetch(`${BASE_URL}/ai/assistant-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};
