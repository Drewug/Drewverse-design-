export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  stats?: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
}

export interface ServiceStep {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: string;
}

export interface ServicePackage {
  id: string;
  title: string;
  price: string;
  priceValue: number; // Numeric for feeds
  features: string[];
  description: string; // Added for feeds
  category: string; // Added for feeds (e.g., "Software > Web Design")
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'New' | 'Contacted' | 'Closed';
  date: string;
}

export interface StatMetric {
  label: string;
  value: string;
  trend: number; // positive is up, negative is down
  icon: any;
}

export interface Testimonial {
  id: string;
  company: string;
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

export interface BlogPost {
  id: string;
  date: string;
  readTime: string;
  title: string;
  image?: string;
  isFeatured?: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  serviceId: string;
  amount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR';
  source: 'ORDER_WORKER' | 'CRON_JOB' | 'EMAIL_SERVICE';
  message: string;
  metadata?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface TrafficAd {
  id: string;
  platform: 'Google' | 'Pinterest' | 'Bing' | 'Reddit';
  keyword: string;
  status: 'Active' | 'Paused';
  clicks: number;
  ctr: string;
  spend: string;
}

export interface ABTest {
  id: string;
  name: string;
  status: 'Running' | 'Paused' | 'Concluded';
  variantA: { label: string; views: number; clicks: number; conversion: number };
  variantB: { label: string; views: number; clicks: number; conversion: number };
  winner?: 'A' | 'B' | null;
}

export interface Invoice {
  id: string;
  client: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  date: string;
}

export interface Proposal {
  clientName: string;
  projectType: string;
  content: string; // Markdown
  value: string;
}

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: 'image' | 'video' | 'document';
  size: string;
  date: string;
}

export enum ViewMode {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD'
}

export enum PublicPage {
  HOME = 'HOME',
  ABOUT = 'ABOUT',
  SERVICES = 'SERVICES',
  PORTFOLIO = 'PORTFOLIO',
  CONTACT = 'CONTACT'
}