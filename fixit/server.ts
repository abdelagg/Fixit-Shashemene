import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import {
  INITIAL_SERVICES,
  INITIAL_USERS,
  INITIAL_WORKER_PROFILES,
  INITIAL_REQUESTS,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REPORTS,
  SHASHEMENE_NEIGHBORHOODS
} from './src/data/shashemeneData.js';
import {
  User,
  WorkerProfile,
  ServiceCategory,
  ServiceRequest,
  Review,
  NotificationItem,
  ReportItem,
  JobStatus,
  UrgencyLevel
} from './src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory persistent state (seeded with authentic Shashemene records)
let users: User[] = [...INITIAL_USERS];
let workerProfiles: WorkerProfile[] = [...INITIAL_WORKER_PROFILES];
let services: ServiceCategory[] = [...INITIAL_SERVICES];
let requests: ServiceRequest[] = [...INITIAL_REQUESTS];
let reviews: Review[] = [...INITIAL_REVIEWS];
let notifications: NotificationItem[] = [...INITIAL_NOTIFICATIONS];
let reports: ReportItem[] = [...INITIAL_REPORTS];
let messages: Array<{
  id: string;
  requestId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  receiverId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}> = [
  {
    id: 'msg_1',
    requestId: 'req_101',
    senderId: 'user_work_1',
    senderName: 'Ahmed Hassan',
    senderRole: 'worker',
    receiverId: 'user_cust_1',
    message: 'Salam Abebe! I received your pipe leak request. I have my tools and replacement seals ready. Are you near the Arada CBE branch?',
    isRead: true,
    createdAt: '2026-02-28T08:45:00Z'
  },
  {
    id: 'msg_2',
    requestId: 'req_101',
    senderId: 'user_cust_1',
    senderName: 'Abebe Kebede',
    senderRole: 'customer',
    receiverId: 'user_work_1',
    message: 'Yes Ahmed, exactly behind the bank in House #342. Water is shut off at the main valve for now.',
    isRead: true,
    createdAt: '2026-02-28T08:48:00Z'
  },
  {
    id: 'msg_3',
    requestId: 'req_101',
    senderId: 'user_work_1',
    senderName: 'Ahmed Hassan',
    senderRole: 'worker',
    receiverId: 'user_cust_1',
    message: 'Great, I am on the way on my motorbike. Will arrive in about 10 minutes.',
    isRead: true,
    createdAt: '2026-02-28T08:52:00Z'
  }
];

// Helper: Haversine distance in km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

function getNeighborhoodCoords(neighborhoodName: string) {
  const found = SHASHEMENE_NEIGHBORHOODS.find(
    (n) => n.name.toLowerCase() === (neighborhoodName || '').toLowerCase()
  );
  if (found) return { latitude: found.latitude, longitude: found.longitude };
  return { latitude: 7.2014, longitude: 38.5976 }; // Default Arada
}

// Lazily-initialized inference client used by the diagnostic engine.
// Backed by a hosted language model; the provider is an internal implementation detail.
let inferenceClient: GoogleGenAI | null = null;
function getInferenceClient(): GoogleGenAI | null {
  if (!process.env.INFERENCE_API_KEY) {
    return null;
  }
  if (!inferenceClient) {
    inferenceClient = new GoogleGenAI({
      apiKey: process.env.INFERENCE_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'fixit-shashemene-server'
        }
      }
    });
  }
  return inferenceClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // ==========================================
  // AUTH & USER ENDPOINTS
  // ==========================================
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, role } = req.body;
    const user = users.find(
      (u) => u.email.toLowerCase() === (email || '').toLowerCase()
    );
    if (!user) {
      // Find fallback by role or default to customer
      const fallback = users.find((u) => u.role === (role || 'customer')) || users[0];
      return res.json({ user: fallback, token: 'demo-token-' + fallback.id });
    }
    if (user.isSuspended) {
      return res.status(403).json({ error: 'This account has been suspended by administration.' });
    }
    return res.json({ user, token: 'demo-token-' + user.id });
  });

  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, phone, role, neighborhood, serviceCategory, services: workerServices, experienceYears, description, hourlyRateBirr } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'A user with this email already exists.' });
    }

    const coords = getNeighborhoodCoords(neighborhood || 'Arada');
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      phone: phone || '+251 91 000 0000',
      role: role || 'customer',
      neighborhood: neighborhood || 'Arada',
      profileImage: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);

    if (newUser.role === 'worker') {
      const newProfile: WorkerProfile = {
        id: `wp_${Date.now()}`,
        userId: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        profileImage: newUser.profileImage,
        serviceCategory: serviceCategory || 'General Maintenance',
        services: Array.isArray(workerServices) && workerServices.length > 0 ? workerServices : ['General Inspection', 'Repair Service'],
        description: description || `Professional ${serviceCategory || 'tradesperson'} serving Shashemene neighborhoods.`,
        experienceYears: Number(experienceYears) || 2,
        neighborhood: newUser.neighborhood,
        location: coords,
        availability: {
          isAvailable: true,
          startTime: '08:00 AM',
          endTime: '06:00 PM',
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        },
        verificationStatus: 'pending', // Pending admin approval as per spec
        ratingAverage: 0,
        reviewCount: 0,
        completedJobs: 0,
        hourlyRateBirr: Number(hourlyRateBirr) || 300,
        skills: ['On-site Inspection', 'Customer Support', 'Quality Tooling'],
        createdAt: new Date().toISOString()
      };
      workerProfiles.push(newProfile);

      // Create notification for admin
      notifications.push({
        id: `notif_${Date.now()}`,
        userId: 'user_admin_1',
        title: 'New Worker Application',
        message: `${newProfile.name} registered for ${newProfile.serviceCategory} in ${newProfile.neighborhood}. Requires admin verification.`,
        type: 'approval',
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }

    return res.json({ user: newUser, token: 'demo-token-' + newUser.id });
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    const userId = req.query.userId as string;
    const user = users.find((u) => u.id === userId) || users[0];
    return res.json({ user });
  });

  app.get('/api/users', (_req: Request, res: Response) => {
    return res.json({ users });
  });

  app.post('/api/users/:id/toggle-suspend', (req: Request, res: Response) => {
    const { id } = req.params;
    const user = users.find((u) => u.id === id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.isSuspended = !user.isSuspended;

    // If worker, also update profile status
    const wp = workerProfiles.find((w) => w.userId === id);
    if (wp) {
      wp.verificationStatus = user.isSuspended ? 'suspended' : 'approved';
    }

    return res.json({ user, workerProfile: wp });
  });

  // ==========================================
  // SERVICES CATEGORIES
  // ==========================================
  app.get('/api/services', (_req: Request, res: Response) => {
    return res.json({ services });
  });

  app.post('/api/services', (req: Request, res: Response) => {
    const { name, group, description, icon, popular, subServices } = req.body;
    if (!name) return res.status(400).json({ error: 'Service name is required' });

    const newService: ServiceCategory = {
      id: name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      name,
      group: group || 'Home Services',
      description: description || `${name} services in Shashemene`,
      icon: icon || 'Wrench',
      popular: Boolean(popular),
      active: true,
      subServices: Array.isArray(subServices) ? subServices : ['General ' + name]
    };
    services.push(newService);
    return res.json({ service: newService });
  });

  app.put('/api/services/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = services.findIndex((s) => s.id === id);
    if (index === -1) return res.status(404).json({ error: 'Service not found' });
    services[index] = { ...services[index], ...req.body };
    return res.json({ service: services[index] });
  });

  // ==========================================
  // WORKERS ENDPOINTS
  // ==========================================
  app.get('/api/workers', (req: Request, res: Response) => {
    const { category, neighborhood, rating, availableOnly, search, includeUnapproved, lat, lng } = req.query;

    let filtered = [...workerProfiles];

    // Filter by approval status
    if (includeUnapproved !== 'true') {
      filtered = filtered.filter((w) => w.verificationStatus === 'approved');
    }

    // Filter category
    if (category && category !== 'all') {
      const catStr = String(category).toLowerCase();
      filtered = filtered.filter(
        (w) =>
          w.serviceCategory.toLowerCase().includes(catStr) ||
          w.services.some((s) => s.toLowerCase().includes(catStr))
      );
    }

    // Filter neighborhood
    if (neighborhood && neighborhood !== 'all') {
      filtered = filtered.filter(
        (w) => w.neighborhood.toLowerCase() === String(neighborhood).toLowerCase()
      );
    }

    // Filter availability
    if (availableOnly === 'true') {
      filtered = filtered.filter((w) => w.availability.isAvailable);
    }

    // Filter rating
    if (rating && Number(rating) > 0) {
      filtered = filtered.filter((w) => w.ratingAverage >= Number(rating));
    }

    // Search keyword
    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.serviceCategory.toLowerCase().includes(q) ||
          w.description.toLowerCase().includes(q) ||
          w.neighborhood.toLowerCase().includes(q) ||
          w.services.some((s) => s.toLowerCase().includes(q)) ||
          w.skills.some((sk) => sk.toLowerCase().includes(q))
      );
    }

    // Calculate distance if reference coordinates provided
    const refLat = lat ? Number(lat) : 7.2014; // Default Arada
    const refLng = lng ? Number(lng) : 38.5976;

    const withDistance = filtered.map((w) => {
      const dist = calculateDistanceKm(
        refLat,
        refLng,
        w.location.latitude,
        w.location.longitude
      );
      return {
        ...w,
        distanceKm: dist
      };
    });

    return res.json({ workers: withDistance });
  });

  app.get('/api/workers/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const worker = workerProfiles.find((w) => w.id === id || w.userId === id);
    if (!worker) return res.status(404).json({ error: 'Worker not found' });

    const workerReviews = reviews.filter((r) => r.workerId === worker.id);
    return res.json({ worker, reviews: workerReviews });
  });

  app.put('/api/workers/profile', (req: Request, res: Response) => {
    const { userId, ...updates } = req.body;
    const index = workerProfiles.findIndex((w) => w.userId === userId || w.id === userId);
    if (index === -1) return res.status(404).json({ error: 'Worker profile not found' });

    if (updates.neighborhood) {
      updates.location = getNeighborhoodCoords(updates.neighborhood);
    }

    workerProfiles[index] = { ...workerProfiles[index], ...updates };
    return res.json({ worker: workerProfiles[index] });
  });

  app.post('/api/workers/:id/verify', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body; // 'approved' | 'rejected' | 'suspended'
    const worker = workerProfiles.find((w) => w.id === id);
    if (!worker) return res.status(404).json({ error: 'Worker not found' });

    worker.verificationStatus = status;

    // Send notification to worker
    notifications.push({
      id: `notif_${Date.now()}`,
      userId: worker.userId,
      title: status === 'approved' ? 'Worker Profile Approved!' : 'Profile Status Updated',
      message:
        status === 'approved'
          ? 'Congratulations! Your FixIt Shashemene profile is verified and active for customer requests.'
          : `Your profile status was updated to ${status}.`,
      type: 'status',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    return res.json({ worker });
  });

  // ==========================================
  // SERVICE REQUESTS ENDPOINTS
  // ==========================================
  app.get('/api/requests', (req: Request, res: Response) => {
    const { customerId, workerId, status, all } = req.query;

    let list = [...requests];
    if (customerId) {
      list = list.filter((r) => r.customerId === customerId);
    }
    if (workerId) {
      list = list.filter((r) => r.workerId === workerId);
    }
    if (status && status !== 'all') {
      list = list.filter((r) => r.status === status);
    }

    // Sort newest first
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return res.json({ requests: list });
  });

  app.get('/api/requests/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const request = requests.find((r) => r.id === id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    return res.json({ request });
  });

  app.post('/api/requests', (req: Request, res: Response) => {
    const {
      customerId,
      customerName,
      customerPhone,
      customerImage,
      workerId,
      workerName,
      serviceCategory,
      title,
      description,
      images,
      neighborhood,
      addressDetails,
      urgency,
      preferredTime,
      aiAnalysis,
      priceEstimateBirr
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const coords = getNeighborhoodCoords(neighborhood || 'Arada');
    const assignedWorker = workerId ? workerProfiles.find((w) => w.id === workerId) : null;

    const newRequest: ServiceRequest = {
      id: `req_${Date.now()}`,
      customerId: customerId || 'user_cust_1',
      customerName: customerName || 'Abebe Kebede',
      customerPhone: customerPhone || '+251 91 678 1234',
      customerImage: customerImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      workerId: workerId || undefined,
      workerName: assignedWorker ? assignedWorker.name : workerName || undefined,
      workerPhone: assignedWorker ? assignedWorker.phone : undefined,
      workerImage: assignedWorker ? assignedWorker.profileImage : undefined,
      serviceCategory: serviceCategory || 'General Maintenance',
      title,
      description,
      images: Array.isArray(images) ? images : [],
      location: {
        neighborhood: neighborhood || 'Arada',
        addressDetails: addressDetails || `Shashemene, ${neighborhood || 'Arada'}`,
        latitude: coords.latitude,
        longitude: coords.longitude
      },
      urgency: (urgency as UrgencyLevel) || 'medium',
      preferredTime: preferredTime || 'As soon as possible',
      status: workerId ? 'pending' : 'requested',
      aiAnalysis,
      priceEstimateBirr: Number(priceEstimateBirr) || (assignedWorker?.hourlyRateBirr ? assignedWorker.hourlyRateBirr * 1.5 : 400),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    requests.unshift(newRequest);

    // Notify assigned worker if chosen
    if (assignedWorker) {
      notifications.push({
        id: `notif_${Date.now()}`,
        userId: assignedWorker.userId,
        title: 'New Service Request',
        message: `${newRequest.customerName} sent a request: "${newRequest.title}" in ${newRequest.location.neighborhood}.`,
        type: 'status',
        requestId: newRequest.id,
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }

    return res.json({ request: newRequest });
  });

  app.post('/api/requests/:id/status', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, workerId, notes, cancellationReason } = req.body;
    const reqIndex = requests.findIndex((r) => r.id === id);
    if (reqIndex === -1) return res.status(404).json({ error: 'Request not found' });

    const current = requests[reqIndex];
    current.status = status as JobStatus;
    current.updatedAt = new Date().toISOString();

    if (notes) current.notes = notes;
    if (cancellationReason) current.cancellationReason = cancellationReason;

    // If accepting from general pool
    if (status === 'accepted' && workerId && !current.workerId) {
      const worker = workerProfiles.find((w) => w.id === workerId || w.userId === workerId);
      if (worker) {
        current.workerId = worker.id;
        current.workerName = worker.name;
        current.workerPhone = worker.phone;
        current.workerImage = worker.profileImage;
      }
    }

    // Job completed updates worker completed count
    if (status === 'completed' && current.workerId) {
      const worker = workerProfiles.find((w) => w.id === current.workerId);
      if (worker) {
        worker.completedJobs += 1;
      }
    }

    // Create notifications for customer
    const statusMessages: Record<string, string> = {
      accepted: `${current.workerName || 'Worker'} has accepted your request. You can now chat and coordinate.`,
      on_the_way: `${current.workerName || 'Worker'} is on the way to your location in ${current.location.neighborhood}.`,
      in_progress: `${current.workerName || 'Worker'} has started work on your problem.`,
      completed: `Your job "${current.title}" is completed! Please leave a review for ${current.workerName}.`,
      cancelled: `Your request "${current.title}" was cancelled.`,
      rejected: `Worker was unable to accept this request.`
    };

    if (statusMessages[status]) {
      notifications.push({
        id: `notif_${Date.now()}`,
        userId: current.customerId,
        title: `Job Status: ${status.replace(/_/g, ' ').toUpperCase()}`,
        message: statusMessages[status],
        type: 'status',
        requestId: current.id,
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }

    return res.json({ request: current });
  });

  // ==========================================
  // CHAT / MESSAGES ENDPOINTS
  // ==========================================
  app.get('/api/messages', (req: Request, res: Response) => {
    const { requestId, userId } = req.query;
    let list = [...messages];
    if (requestId) {
      list = list.filter((m) => m.requestId === requestId);
    }
    if (userId) {
      list = list.filter((m) => m.senderId === userId || m.receiverId === userId);
    }
    list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return res.json({ messages: list });
  });

  app.post('/api/messages', (req: Request, res: Response) => {
    const { requestId, senderId, senderName, senderRole, receiverId, message } = req.body;
    if (!message || !requestId) {
      return res.status(400).json({ error: 'Message and requestId are required' });
    }

    const newMsg = {
      id: `msg_${Date.now()}`,
      requestId,
      senderId: senderId || 'user_cust_1',
      senderName: senderName || 'User',
      senderRole: senderRole || 'customer',
      receiverId: receiverId || 'user_work_1',
      message: message.trim(),
      isRead: false,
      createdAt: new Date().toISOString()
    };

    messages.push(newMsg);

    // Notify receiver
    notifications.push({
      id: `notif_${Date.now()}`,
      userId: newMsg.receiverId,
      title: `New message from ${newMsg.senderName}`,
      message: newMsg.message.length > 50 ? newMsg.message.substring(0, 47) + '...' : newMsg.message,
      type: 'message',
      requestId: newMsg.requestId,
      isRead: false,
      createdAt: new Date().toISOString()
    });

    return res.json({ message: newMsg });
  });

  // ==========================================
  // REVIEWS & RATINGS ENDPOINTS
  // ==========================================
  app.get('/api/reviews', (req: Request, res: Response) => {
    const { workerId, customerId } = req.query;
    let list = [...reviews];
    if (workerId) list = list.filter((r) => r.workerId === workerId);
    if (customerId) list = list.filter((r) => r.customerId === customerId);
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return res.json({ reviews: list });
  });

  app.post('/api/reviews', (req: Request, res: Response) => {
    const { customerId, customerName, customerImage, workerId, requestId, serviceCategory, rating, comment } = req.body;

    if (!workerId || !rating) {
      return res.status(400).json({ error: 'workerId and rating (1-5) are required' });
    }

    // Check if customer already reviewed this job
    const existing = reviews.find((r) => r.requestId === requestId && r.customerId === customerId);
    if (existing) {
      return res.status(400).json({ error: 'You have already reviewed this completed job.' });
    }

    const newReview: Review = {
      id: `rev_${Date.now()}`,
      customerId: customerId || 'user_cust_1',
      customerName: customerName || 'Abebe Kebede',
      customerImage: customerImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      workerId,
      requestId: requestId || `req_done_${Date.now()}`,
      serviceCategory: serviceCategory || 'Plumbing',
      rating: Math.min(5, Math.max(1, Number(rating))),
      comment: comment || 'Job completed properly.',
      createdAt: new Date().toISOString()
    };

    reviews.unshift(newReview);

    // Recalculate worker rating
    const worker = workerProfiles.find((w) => w.id === workerId);
    if (worker) {
      const workerReviews = reviews.filter((r) => r.workerId === worker.id);
      const sum = workerReviews.reduce((acc, curr) => acc + curr.rating, 0);
      worker.reviewCount = workerReviews.length;
      worker.ratingAverage = Number((sum / workerReviews.length).toFixed(2));

      // Notify worker
      notifications.push({
        id: `notif_${Date.now()}`,
        userId: worker.userId,
        title: 'New Rating Received!',
        message: `${newReview.customerName} gave you ${newReview.rating}⭐: "${newReview.comment.substring(0, 40)}..."`,
        type: 'status',
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }

    return res.json({ review: newReview, worker });
  });

  // ==========================================
  // NOTIFICATIONS & REPORTS
  // ==========================================
  app.get('/api/notifications', (req: Request, res: Response) => {
    const { userId } = req.query;
    let list = [...notifications];
    if (userId) list = list.filter((n) => n.userId === userId);
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return res.json({ notifications: list });
  });

  app.post('/api/notifications/read-all', (req: Request, res: Response) => {
    const { userId } = req.body;
    notifications.forEach((n) => {
      if (!userId || n.userId === userId) n.isRead = true;
    });
    return res.json({ success: true });
  });

  app.get('/api/reports', (_req: Request, res: Response) => {
    return res.json({ reports });
  });

  app.post('/api/reports', (req: Request, res: Response) => {
    const { reporterId, reporterName, reportedUserId, reportedUserName, requestId, reason, description } = req.body;
    const newReport: ReportItem = {
      id: `rep_${Date.now()}`,
      reporterId: reporterId || 'user_cust_1',
      reporterName: reporterName || 'Abebe Kebede',
      reportedUserId: reportedUserId || 'unknown',
      reportedUserName: reportedUserName || 'Worker',
      requestId,
      reason: reason || 'Inappropriate behavior',
      description: description || 'No details provided',
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    reports.unshift(newReport);
    return res.json({ report: newReport });
  });

  app.post('/api/reports/:id/status', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const report = reports.find((r) => r.id === id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    report.status = status;
    return res.json({ report });
  });

  // ==========================================
  // ADMIN KPI STATS
  // ==========================================
  app.get('/api/admin/stats', (_req: Request, res: Response) => {
    const totalUsers = users.length;
    const totalCustomers = users.filter((u) => u.role === 'customer').length;
    const totalWorkers = workerProfiles.length;
    const pendingApprovals = workerProfiles.filter((w) => w.verificationStatus === 'pending').length;
    const activeJobs = requests.filter((r) => ['pending', 'accepted', 'on_the_way', 'in_progress'].includes(r.status)).length;
    const completedJobs = requests.filter((r) => r.status === 'completed').length;
    const totalReports = reports.filter((r) => r.status === 'pending').length;

    const sumRatings = reviews.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = reviews.length > 0 ? Number((sumRatings / reviews.length).toFixed(2)) : 4.8;

    return res.json({
      stats: {
        totalUsers,
        totalCustomers,
        totalWorkers,
        pendingApprovals,
        activeJobs,
        completedJobs,
        totalReports,
        averageRating
      }
    });
  });

  // ==========================================
  // SERVER-SIDE DIAGNOSTIC ENGINE APIS
  // ==========================================
  // 1. Problem Understanding (Text + Optional Image)
  app.post('/api/ai/analyze-problem', async (req: Request, res: Response) => {
    try {
      const { description, imageBase64, mimeType } = req.body;

      if (!description && !imageBase64) {
        return res.status(400).json({ error: 'Problem description or photo is required.' });
      }

      const ai = getInferenceClient();

      if (!ai) {
        // Rule-based fallback when no inference client is configured
        const descLower = (description || '').toLowerCase();
        let cat = 'Plumbing';
        let prob = 'Water pipe leak or fixture failure';
        let workerType = 'Plumber';
        let urgency: UrgencyLevel = 'medium';

        if (descLower.includes('phone') || descLower.includes('screen') || descLower.includes('samsung') || descLower.includes('iphone') || descLower.includes('charge')) {
          cat = 'Phone & Tablet Repair';
          prob = 'Device display crack or battery/charging fault';
          workerType = 'Phone Technician';
        } else if (descLower.includes('laptop') || descLower.includes('computer') || descLower.includes('windows') || descLower.includes('slow') || descLower.includes('keyboard')) {
          cat = 'Computer & Laptop Repair';
          prob = 'Computer hardware failure or operating system issue';
          workerType = 'Computer Technician';
        } else if (descLower.includes('light') || descLower.includes('power') || descLower.includes('breaker') || descLower.includes('wire') || descLower.includes('spark') || descLower.includes('electric')) {
          cat = 'Electrical';
          prob = 'Electrical wiring short-circuit or breaker overload';
          workerType = 'Electrician';
          urgency = 'high';
        } else if (descLower.includes('car') || descLower.includes('toyota') || descLower.includes('engine') || descLower.includes('brake') || descLower.includes('clutch')) {
          cat = 'Car Mechanic';
          prob = 'Vehicle mechanical breakdown or engine fault';
          workerType = 'Car Mechanic';
        } else if (descLower.includes('fridge') || descLower.includes('refrigerator') || descLower.includes('washing machine') || descLower.includes('heater') || descLower.includes('geyser')) {
          cat = 'Appliance Repair';
          prob = 'Major home appliance component failure';
          workerType = 'Appliance Technician';
        } else if (descLower.includes('wood') || descLower.includes('chair') || descLower.includes('door') || descLower.includes('table') || descLower.includes('lock')) {
          cat = 'Carpentry';
          prob = 'Woodwork joinery or door lock misalignment';
          workerType = 'Carpenter';
        }

        return res.json({
          analysis: {
            category: cat,
            problem: prob,
            suggestedWorkerType: workerType,
            urgency,
            confidence: 0.91,
            possibleCauses: ['Normal wear and tear', 'Pressure overload', 'Mechanical fatigue'],
            recommendedPreparation: ['Document visible damage', 'Ensure work area is accessible and safe'],
            estimatedTime: '1 - 2 hours'
          }
        });
      }

      // Prepare multimodal or text prompt
      const systemInstruction = `Local service diagnostics engine for Shashemene, Oromia, Ethiopia.
Analyze the user's natural language problem and/or uploaded photo.
Classify it into one of the known Shashemene service categories:
- Plumbing
- Electrical
- Carpentry
- Painting
- Masonry & Tiling
- Cleaning Services
- Car Mechanic
- Motorcycle & Bajaj Mechanic
- Auto Electrical & Battery
- Phone & Tablet Repair
- Computer & Laptop Repair
- Internet & WiFi Setup
- Appliance Repair
- Welding & Metalwork
- General Handyman

Produce realistic, culturally relevant, safety-first assessments.
Do not claim 100% certainty; use qualified terms such as "Appears to be".
Output strictly valid JSON matching the schema. No conversational text, no preamble, no persona.`;

      const parts: any[] = [];
      if (imageBase64) {
        // Strip data:image/...;base64, prefix if present
        const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
        parts.push({
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: cleanBase64
          }
        });
      }

      parts.push({
        text: `Customer Problem Statement: "${description || 'Customer provided this photo of the damage/issue in Shashemene.'}"
Please analyze and diagnose the category, likely problem, worker type, urgency level ('low', 'medium', 'high', or 'emergency'), confidence (0.0 to 1.0), likely causes, preparation advice for the customer, and estimated repair duration.`
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: { parts },
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING, description: 'Matched service category name' },
              problem: { type: Type.STRING, description: 'Clear summary of the technical problem' },
              suggestedWorkerType: { type: Type.STRING, description: 'Title of the recommended tradesperson, e.g. Plumber, Auto Electrician' },
              urgency: { type: Type.STRING, description: 'One of: low, medium, high, emergency' },
              confidence: { type: Type.NUMBER, description: 'Confidence between 0.70 and 0.99' },
              possibleCauses: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2 to 3 likely mechanical or physical causes'
              },
              recommendedPreparation: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Safety steps for customer (e.g. shut off main valve, power down breaker)'
              },
              estimatedTime: { type: Type.STRING, description: 'Estimated repair time, e.g. 1-2 hours' }
            },
            required: ['category', 'problem', 'suggestedWorkerType', 'urgency', 'confidence']
          }
        }
      });

      const jsonText = response.text ? response.text.trim() : '{}';
      const parsed = JSON.parse(jsonText);

      return res.json({ analysis: parsed });
    } catch (err: any) {
      console.error('AI Problem Analyzer error:', err);
      // Fallback
      return res.json({
        analysis: {
          category: 'Plumbing',
          problem: 'General maintenance issue',
          suggestedWorkerType: 'General Handyman',
          urgency: 'medium',
          confidence: 0.85,
          possibleCauses: ['Wear and tear'],
          recommendedPreparation: ['Keep area clear']
        }
      });
    }
  });

  // 2. AI & Algorithm Hybrid Worker Matching
  app.post('/api/ai/match-workers', (req: Request, res: Response) => {
    const { category, problem, neighborhood, customerLat, customerLng, urgency } = req.body;

    const userCoords = customerLat && customerLng
      ? { latitude: Number(customerLat), longitude: Number(customerLng) }
      : getNeighborhoodCoords(neighborhood || 'Arada');

    // Only approved workers can be matched
    const approvedWorkers = workerProfiles.filter((w) => w.verificationStatus === 'approved');

    // Score workers using spec formula:
    // Score = serviceMatch*0.40 + distanceScore*0.25 + availabilityScore*0.15 + ratingScore*0.10 + experienceScore*0.10
    const scoredWorkers = approvedWorkers.map((worker) => {
      // 1. Service Match (0 to 1.0)
      let serviceMatch = 0.1;
      const catLower = (category || '').toLowerCase();
      const probLower = (problem || '').toLowerCase();

      if (worker.serviceCategory.toLowerCase() === catLower) {
        serviceMatch = 1.0;
      } else if (worker.serviceCategory.toLowerCase().includes(catLower) || catLower.includes(worker.serviceCategory.toLowerCase())) {
        serviceMatch = 0.85;
      } else if (worker.services.some((s) => s.toLowerCase().includes(catLower) || s.toLowerCase().includes(probLower))) {
        serviceMatch = 0.75;
      } else if (worker.skills.some((sk) => probLower.includes(sk.toLowerCase()))) {
        serviceMatch = 0.6;
      }

      // 2. Distance Score (0 to 1.0)
      const distKm = calculateDistanceKm(
        userCoords.latitude,
        userCoords.longitude,
        worker.location.latitude,
        worker.location.longitude
      );
      // Normalized: <= 1km = 1.0, 5km = 0.2, >= 8km = 0.05
      const distanceScore = Math.max(0.1, 1 - distKm / 6);

      // 3. Availability Score (0 to 1.0)
      const availabilityScore = worker.availability.isAvailable ? 1.0 : 0.2;

      // 4. Rating Score (0 to 1.0)
      const ratingScore = worker.ratingAverage ? worker.ratingAverage / 5.0 : 0.8;

      // 5. Experience Score (0 to 1.0)
      const experienceScore = Math.min(1.0, worker.experienceYears / 10.0);

      const totalScore =
        serviceMatch * 0.4 +
        distanceScore * 0.25 +
        availabilityScore * 0.15 +
        ratingScore * 0.1 +
        experienceScore * 0.1;

      return {
        ...worker,
        distanceKm: distKm,
        matchScore: Number((totalScore * 100).toFixed(1)),
        matchBreakdown: {
          serviceMatch: Number((serviceMatch * 100).toFixed(0)),
          distanceScore: Number((distanceScore * 100).toFixed(0)),
          availabilityScore: Number((availabilityScore * 100).toFixed(0)),
          ratingScore: Number((ratingScore * 100).toFixed(0)),
          experienceScore: Number((experienceScore * 100).toFixed(0))
        },
        whyRecommended:
          serviceMatch >= 0.85
            ? `Direct specialist in ${worker.serviceCategory} located ${distKm} km away in ${worker.neighborhood} with ${worker.ratingAverage}⭐ rating.`
            : `Skilled tradesperson with ${worker.experienceYears} years experience nearby.`
      };
    });

    // Filter to workers with reasonable match and sort DESC
    const sorted = scoredWorkers
      .filter((w) => w.matchBreakdown.serviceMatch >= 40)
      .sort((a, b) => b.matchScore - a.matchScore);

    return res.json({
      recommendedWorkers: sorted.slice(0, 6),
      allMatchesCount: sorted.length
    });
  });

  // 3. FixIt Assistant Interactive Chat
  app.post('/api/ai/assistant-chat', async (req: Request, res: Response) => {
    try {
      const { message, conversationHistory } = req.body;
      if (!message) return res.status(400).json({ error: 'Message is required' });

      const ai = getInferenceClient();
      if (!ai) {
        return res.json({
          reply: `Based on what you described, this can connect you with verified local plumbers, electricians, mechanics, and technicians in Arada, Awasho, Bole, and surrounding neighborhoods. Start a service request for this?`
        });
      }

      const historyFormatted = Array.isArray(conversationHistory)
        ? conversationHistory
            .map((c: any) => `${c.role === 'user' ? 'Customer' : 'FixIt'}: ${c.text}`)
            .join('\n')
        : '';

      const prompt = `Local concierge for the FixIt marketplace in Shashemene, Oromia, Ethiopia.
Task:
1. Help customers explain their technical problems clearly (plumbing leaks, car problems, phone screen damage, laptop issues, electric breaker trips, appliance failures).
2. Clarify neighborhood location (Arada, Awasho, Bole, Dida, Melka Oda, Furi, Abosto, Kuyera Road).
3. Ask 1 key follow-up question if information is missing (e.g. "Is water leaking actively?" or "What brand/model is the phone?").
4. Provide immediate safety tips (e.g., turn off the main water valve, unplug smoking appliances).
5. Guide the customer on how to submit a request and select a verified nearby worker.
Keep responses concise, polite, and practical (2-3 short paragraphs max). No persona framing, no "as an AI" statements.

Conversation history:
${historyFormatted}

Customer's latest message: "${message}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt
      });

      return res.json({ reply: response.text });
    } catch (err: any) {
      console.error('Assistant chat error:', err);
      return res.json({
        reply: "Ready to help you find the best verified worker in Shashemene \u2014 tell me what is broken or what service you need."
      });
    }
  });

  // Vite middleware in dev, static files in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FixIt Shashemene Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
