import { ExperienceItem, Project, ServiceStep, Inquiry, StatMetric, Testimonial, BlogPost, LogEntry, ServicePackage, TrafficAd, Invoice, MediaItem } from '../types';
import { Users, DollarSign, Briefcase, Activity } from 'lucide-react';

export const EXPERIENCE_DATA: ExperienceItem[] = [
  { role: 'Lead Engineer', company: 'Notion', period: '2023 - Now' },
  { role: 'Senior Software Engineer', company: 'Google', period: '2019 - 2023' },
  { role: 'Mid-Level Software Engineer', company: 'Data Soft', period: '2017 - 2019' },
  { role: 'Software Engineer', company: 'Prime Car', period: '2015 - 2017' },
];

export const RECENT_WORK: Project[] = [
  {
    id: '1',
    title: 'Chronoswiss - Watch E-com',
    category: 'Frontend Development',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop',
    description: 'A high-performance e-commerce experience for luxury timepieces.'
  },
  {
    id: '2',
    title: 'Scalable CMS for Donation Portal',
    category: 'Webflow CMS Dashboard',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop',
    description: 'Custom CMS solution handling thousands of concurrent users.'
  },
  {
    id: '3',
    title: 'Architected MVP for Health Tech',
    category: 'HIPAA-compliant React/Node.js',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop',
    description: 'Secure, compliant, and user-friendly medical data interface.'
  },
  {
    id: '4',
    title: 'Revamped Legacy Codebase',
    category: 'Refactoring',
    image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2070&auto=format&fit=crop',
    description: 'Refactored 10k+ lines of spaghetti code into modular architecture.'
  }
];

export const PROCESS_STEPS: ServiceStep[] = [
  { id: '1', number: '01', title: 'Discovery', description: 'Align on goals, scope, and timeline.', icon: 'search' },
  { id: '2', number: '02', title: 'Planning', description: 'Milestones and deliverables mapped out.', icon: 'map' },
  { id: '3', number: '03', title: 'Design', description: 'Mockups, interactions, and feedback rounds.', icon: 'pen' },
  { id: '4', number: '04', title: 'Build', description: 'Sprint-driven coding with weekly demos.', icon: 'code' },
  { id: '5', number: '05', title: 'Test', description: 'Performance checks, Bug fixes, UX polish.', icon: 'check' },
  { id: '6', number: '06', title: 'Launch', description: 'Go live, docs, and support.', icon: 'rocket' },
];

export const SERVICE_PACKAGES: ServicePackage[] = [
  { 
    id: 'svc-1',
    title: "MVP Development", 
    price: "Starts at $5k", 
    priceValue: 5000.00,
    features: ["React/Node.js Stack", "Database Setup", "Auth Integration"],
    description: "Full-stack MVP development for startups. Includes architecture, API design, and responsive frontend.",
    category: "Software > Web Design"
  },
  { 
    id: 'svc-2',
    title: "Webflow Migration", 
    price: "Starts at $2k", 
    priceValue: 2000.00,
    features: ["Pixel-perfect Design", "CMS Setup", "SEO Optimization"],
    description: "Migrate your existing site to Webflow with pixel-perfect design and SEO setup.",
    category: "Software > Web Design"
  },
  { 
    id: 'svc-3',
    title: "Technical Audit", 
    price: "Free", 
    priceValue: 0.00,
    features: ["Performance Check", "Security Review", "Code Quality Report"],
    description: "Comprehensive review of your codebase security and performance.",
    category: "Business & Industrial > Business Services"
  }
];

export const DASHBOARD_STATS: StatMetric[] = [
  { label: 'Total Revenue', value: '$124,500', trend: 12.5, icon: DollarSign },
  { label: 'Active Projects', value: '7', trend: 0, icon: Briefcase },
  { label: 'New Leads', value: '24', trend: 8.2, icon: Users },
  { label: 'Avg. Completion', value: '4.2 Weeks', trend: -2.1, icon: Activity },
];

export const MOCK_INQUIRIES: Inquiry[] = [
  { id: '1', name: 'Alex Chen', email: 'alex@nietzsche.com', message: 'Need an MVP for our seed funding round.', status: 'New', date: '2023-10-24' },
  { id: '2', name: 'Priya Kapoor', email: 'priya@luckycharm.io', message: 'Looking for a Webflow migration expert.', status: 'Contacted', date: '2023-10-22' },
  { id: '3', name: 'Michael Rivera', email: 'm.rivera@agency.com', message: 'We need help scaling our Node.js backend.', status: 'Closed', date: '2023-10-20' },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    company: 'Nietzsche',
    quote: 'We needed an MVP to secure our seed funding, and DrewVerse delivered in just 5 weeks. Their code was so clean that scaling post-launch took half the time we expected.',
    author: 'Alex Chen',
    role: 'Co-Founder @ Nietzsche',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: '2',
    company: 'Luckycharm',
    quote: 'When a client project hit a roadblock, Drew joined our Slack, fixed the React bugs overnight, and even mentored our junior devs. Seamless collaboration.',
    author: 'Priya Kapoor',
    role: 'CTO @ Luckycharm',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: '3',
    company: 'Nietzsche',
    quote: 'Our old site took hours to update. DrewVerse built a Webflow CMS so intuitive even our volunteers can manage it. Donations jumped 40% in 2 months.',
    author: 'Michael Rivera',
    role: 'Director @ Nietzsche',
    avatar: 'https://randomuser.me/api/portraits/men/86.jpg'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    date: '5 February 2025',
    readTime: '5 min read',
    title: 'How artificial intelligence is transforming industries in 2024',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop',
    isFeatured: true
  },
  {
    id: '2',
    date: '5 February 2025',
    readTime: '5 min read',
    title: 'GitHub + Slack: How I Cut Agency Development Time by 40%',
    isFeatured: false
  },
  {
    id: '3',
    date: '5 February 2025',
    readTime: '5 min read',
    title: 'MVP Development Mistakes Every First-Time Founder Makes',
    isFeatured: false
  }
];

export const MOCK_SYSTEM_LOGS: LogEntry[] = [
  { id: '1', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), level: 'INFO', source: 'ORDER_WORKER', message: 'Order #ORD-2291 processed successfully.' },
  { id: '2', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), level: 'WARNING', source: 'CRON_JOB', message: 'Retry attempt 1 for Order #ORD-2290.' },
  { id: '3', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), level: 'ERROR', source: 'EMAIL_SERVICE', message: 'SMTP Connection timeout.', metadata: 'Timeout after 5000ms' },
  { id: '4', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), level: 'INFO', source: 'ORDER_WORKER', message: 'New order validation passed.', metadata: 'Customer: John Doe' },
];

export const MOCK_MICRO_ADS: TrafficAd[] = [
  { id: '1', platform: 'Google', keyword: 'SaaS MVP Developer', status: 'Active', clicks: 142, ctr: '4.2%', spend: '$120' },
  { id: '2', platform: 'Pinterest', keyword: 'Webflow Template', status: 'Active', clicks: 890, ctr: '1.8%', spend: '$45' },
  { id: '3', platform: 'Reddit', keyword: 'startup cto hire', status: 'Paused', clicks: 45, ctr: '0.9%', spend: '$15' },
  { id: '4', platform: 'Bing', keyword: 'custom nodejs agency', status: 'Active', clicks: 28, ctr: '5.1%', spend: '$30' },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-2023-001', client: 'Nietzsche', amount: '$5,000.00', status: 'Paid', date: '2023-10-01' },
  { id: 'INV-2023-002', client: 'Luckycharm', amount: '$2,500.00', status: 'Pending', date: '2023-10-15' },
  { id: 'INV-2023-003', client: 'Global Systems', amount: '$12,000.00', status: 'Overdue', date: '2023-09-28' },
  { id: 'INV-2023-004', client: 'StartUp Inc', amount: '$4,000.00', status: 'Paid', date: '2023-10-20' },
];

export const MOCK_MEDIA: MediaItem[] = [
  { id: 'm1', url: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop', name: 'watch-project-cover.jpg', type: 'image', size: '1.2 MB', date: '2023-10-01' },
  { id: 'm2', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop', name: 'dashboard-ui.png', type: 'image', size: '2.4 MB', date: '2023-09-28' },
  { id: 'm3', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop', name: 'medical-app-mockup.jpg', type: 'image', size: '3.1 MB', date: '2023-09-15' },
  { id: 'm4', url: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2070&auto=format&fit=crop', name: 'code-snippet.png', type: 'image', size: '0.8 MB', date: '2023-08-10' },
  { id: 'm5', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop', name: 'profile-pic-drew.jpg', type: 'image', size: '4.5 MB', date: '2023-01-20' },
  { id: 'm6', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop', name: 'hero-background.jpg', type: 'image', size: '2.1 MB', date: '2022-12-05' },
];