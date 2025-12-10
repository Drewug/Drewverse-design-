import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  Trash2,
  Edit2,
  X,
  Image as ImageIcon,
  BookOpen,
  Activity,
  Database,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Server,
  Shield,
  Zap,
  Globe,
  Share2,
  Ticket,
  Copy,
  Sparkles,
  FileCode,
  Loader2,
  FlaskConical,
  BarChart2,
  DollarSign,
  Briefcase,
  FileText,
  Upload,
  MoreVertical,
  Film,
  File,
  CloudLightning
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { DASHBOARD_STATS, MOCK_INQUIRIES, RECENT_WORK, BLOG_POSTS, MOCK_SYSTEM_LOGS, SERVICE_PACKAGES, MOCK_MICRO_ADS, MOCK_INVOICES, MOCK_MEDIA } from '../services/mockData';
import { Project, Inquiry, BlogPost, LogEntry, ServicePackage, ABTest, Invoice, MediaItem } from '../types';

interface DashboardProps {
  onLogout: () => void;
}

type Tab = 'OVERVIEW' | 'PROJECTS' | 'BLOGS' | 'INQUIRIES' | 'SALES' | 'MEDIA' | 'TRAFFIC' | 'SEO' | 'LOGS' | 'SETTINGS';

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('OVERVIEW');
  const [projects, setProjects] = useState<Project[]>(RECENT_WORK);
  const [inquiries, setInquiries] = useState<Inquiry[]>(MOCK_INQUIRIES);
  const [blogs, setBlogs] = useState<BlogPost[]>(BLOG_POSTS);
  const [logs, setLogs] = useState<LogEntry[]>(MOCK_SYSTEM_LOGS);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(MOCK_MEDIA);
  
  // System Health State
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [dbLatency, setDbLatency] = useState<number | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Traffic State
  const [copiedFeed, setCopiedFeed] = useState<string | null>(null);
  const [generatedRedditPost, setGeneratedRedditPost] = useState<string | null>(null);
  
  // Optimizer State
  const [optimizingPkg, setOptimizingPkg] = useState<ServicePackage | null>(null);
  const [optimizationPlatform, setOptimizationPlatform] = useState('Google');
  const [optimizationResult, setOptimizationResult] = useState<{optimizedTitle: string, optimizedDescription: string, keywords: string[]} | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // SEO & CRO State
  const [seoPageInput, setSeoPageInput] = useState('');
  const [seoContentSummary, setSeoContentSummary] = useState('');
  const [seoResult, setSeoResult] = useState<any>(null);
  const [isSeoGenerating, setIsSeoGenerating] = useState(false);

  // Sales & Proposal State
  const [proposalInput, setProposalInput] = useState({ clientName: '', projectType: '', budget: '', goals: '' });
  const [generatedProposal, setGeneratedProposal] = useState<string | null>(null);
  const [isProposalGenerating, setIsProposalGenerating] = useState(false);

  // Mock AB Test Data
  const [abTest, setAbTest] = useState<ABTest>({
    id: 'exp-001',
    name: 'Hero CTA: GitHub vs Case Studies',
    status: 'Running',
    variantA: { label: 'Explore GitHub', views: 1240, clicks: 142, conversion: 11.45 },
    variantB: { label: 'View Case Studies', views: 1180, clicks: 215, conversion: 18.22 }
  });

  // Media Manager State
  const [mediaSearch, setMediaSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Project Form State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    title: '', category: '', image: '', description: ''
  });

  // Blog Form State
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [blogForm, setBlogForm] = useState<Partial<BlogPost>>({
    title: '', date: '', readTime: '', image: '', isFeatured: false
  });

  // --- Effects ---
  useEffect(() => {
    if (activeTab === 'SETTINGS') {
      checkDbConnection();
    }
  }, [activeTab]);

  const checkDbConnection = async () => {
    setDbStatus('checking');
    const start = performance.now();
    try {
      // Simple query to check connection
      const { error } = await supabase.from('projects').select('count', { count: 'exact', head: true });
      const end = performance.now();
      
      if (error) throw error;
      
      setDbStatus('connected');
      setDbLatency(Math.round(end - start));
    } catch (err) {
      console.error('Database connection failed:', err);
      setDbStatus('error');
      setDbLatency(null);
    }
  };

  const handleSyncDatabase = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const response = await fetch('/.netlify/functions/seed-database', { method: 'POST' });
      const result = await response.json();
      
      if (response.ok) {
        setSyncStatus({ 
          message: `Synced! ${result.details.projects.count} projects, ${result.details.blogs.count} blogs.`, 
          type: 'success' 
        });
      } else {
        throw new Error(result.error || 'Sync failed');
      }
    } catch (error) {
      setSyncStatus({ message: 'Failed to sync. Check console.', type: 'error' });
      console.error(error);
    } finally {
      setIsSyncing(false);
    }
  };

  // --- Traffic Actions ---
  const copyFeedUrl = (platform: string) => {
    const url = `https://drewverse.com/.netlify/functions/traffic-feed?platform=${platform}`;
    navigator.clipboard.writeText(url);
    setCopiedFeed(platform);
    setTimeout(() => setCopiedFeed(null), 2000);
  };

  const generateRedditPost = (pkg: ServicePackage) => {
    const template = `[Hiring] Experienced Full Stack Dev offering ${pkg.title} starting at ${pkg.price}. \n\nHi r/startups, I'm Drew. I specialize in ${pkg.category} and recently helped a client scale to 10k users. \n\nMy package includes: \n- ${pkg.features.join('\n- ')}\n\nDM me for a portfolio link!`;
    setGeneratedRedditPost(template);
  };

  const handleOptimize = async () => {
    if (!optimizingPkg) return;
    setIsOptimizing(true);
    setOptimizationResult(null);

    try {
      const response = await fetch('/.netlify/functions/ai-optimizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: optimizingPkg.title,
          description: optimizingPkg.description,
          category: optimizingPkg.category,
          platform: optimizationPlatform
        })
      });
      const data = await response.json();
      setOptimizationResult(data);
    } catch (error) {
      console.error(error);
      alert('Optimization failed. See console.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleSeoGenerate = async () => {
    if (!seoPageInput) return;
    setIsSeoGenerating(true);
    setSeoResult(null);

    try {
      const response = await fetch('/.netlify/functions/ai-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageName: seoPageInput,
          contentSummary: seoContentSummary
        })
      });
      const data = await response.json();
      setSeoResult(data);
    } catch (error) {
      alert('SEO Generation Failed');
    } finally {
      setIsSeoGenerating(false);
    }
  };

  const handleProposalGenerate = async () => {
    if (!proposalInput.clientName || !proposalInput.projectType) return;
    setIsProposalGenerating(true);
    setGeneratedProposal(null);

    try {
      const response = await fetch('/.netlify/functions/ai-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proposalInput)
      });
      const data = await response.json();
      setGeneratedProposal(data.proposal);
    } catch (error) {
      alert('Proposal Generation Failed');
    } finally {
      setIsProposalGenerating(false);
    }
  };

  // --- Media Actions ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate upload by creating a local object URL
      const newMedia: MediaItem = {
        id: `m${Date.now()}`,
        url: URL.createObjectURL(file),
        name: file.name,
        type: file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : 'document',
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        date: new Date().toISOString().split('T')[0]
      };
      setMediaItems([newMedia, ...mediaItems]);
    }
  };

  const deleteMedia = (id: string) => {
    if (window.confirm('Delete this file?')) {
      setMediaItems(mediaItems.filter(m => m.id !== id));
    }
  };

  const copyMediaLink = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  // --- Actions ---

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      // Update
      setProjects(projects.map(p => p.id === editingProject.id ? { ...p, ...projectForm } as Project : p));
    } else {
      // Create
      const newProject: Project = {
        id: Math.random().toString(36).substr(2, 9),
        title: projectForm.title || 'New Project',
        category: projectForm.category || 'Web Development',
        image: projectForm.image || 'https://via.placeholder.com/400',
        description: projectForm.description || '',
      };
      setProjects([newProject, ...projects]);
    }
    setIsProjectModalOpen(false);
    setEditingProject(null);
    setProjectForm({ title: '', category: '', image: '', description: '' });
  };

  const deleteProject = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const openProjectModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setProjectForm(project);
    } else {
      setEditingProject(null);
      setProjectForm({ title: '', category: '', image: '', description: '' });
    }
    setIsProjectModalOpen(true);
  };

  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBlog) {
      setBlogs(blogs.map(b => b.id === editingBlog.id ? { ...b, ...blogForm } as BlogPost : b));
    } else {
      const newBlog: BlogPost = {
        id: Math.random().toString(36).substr(2, 9),
        title: blogForm.title || 'New Post',
        date: blogForm.date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        readTime: blogForm.readTime || '5 min read',
        image: blogForm.image || 'https://images.unsplash.com/photo-1499750310159-5254f4cc1529?q=80&w=2070&auto=format&fit=crop',
        isFeatured: blogForm.isFeatured || false,
      };
      setBlogs([newBlog, ...blogs]);
    }
    setIsBlogModalOpen(false);
    setEditingBlog(null);
    setBlogForm({ title: '', date: '', readTime: '', image: '', isFeatured: false });
  };

  const deleteBlog = (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setBlogs(blogs.filter(b => b.id !== id));
    }
  };

  const openBlogModal = (blog?: BlogPost) => {
    if (blog) {
      setEditingBlog(blog);
      setBlogForm(blog);
    } else {
      setEditingBlog(null);
      setBlogForm({ 
        title: '', 
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }), 
        readTime: '5 min read', 
        image: '', 
        isFeatured: false 
      });
    }
    setIsBlogModalOpen(true);
  };

  const updateInquiryStatus = (id: string, status: 'New' | 'Contacted' | 'Closed') => {
    setInquiries(inquiries.map(i => i.id === id ? { ...i, status } : i));
  };

  const deleteInquiry = (id: string) => {
     if (window.confirm('Delete this message?')) {
      setInquiries(inquiries.filter(i => i.id !== id));
    }
  };

  // --- Sub-Components ---

  const SidebarItem = ({ tab, icon: Icon, label, count }: { tab: Tab, icon: any, label: string, count?: number }) => (
    <button 
      onClick={() => setActiveTab(tab)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === tab ? 'bg-brand-green/10 text-brand-green' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}
    >
      <Icon size={20} />
      <div className="flex-1 flex justify-between items-center">
        <span>{label}</span>
        {count !== undefined && count > 0 && (
          <span className="bg-brand-green text-white text-[10px] px-2 py-0.5 rounded-full">{count}</span>
        )}
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-brand-dark">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-dark text-gray-400 flex flex-col fixed h-full transition-all duration-300 z-20">
        <div className="h-20 flex items-center px-8 border-b border-gray-800">
          <span className="text-white font-bold text-xl tracking-tight">DrewVerse<span className="text-brand-green">.Admin</span></span>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto scrollbar-hide">
          <SidebarItem tab="OVERVIEW" icon={LayoutDashboard} label="Overview" />
          <SidebarItem tab="PROJECTS" icon={FolderKanban} label="Projects" count={projects.length} />
          <SidebarItem tab="BLOGS" icon={BookOpen} label="Blogs" count={blogs.length} />
          <SidebarItem tab="INQUIRIES" icon={MessageSquare} label="Inquiries" count={inquiries.filter(i => i.status === 'New').length} />
          <SidebarItem tab="SALES" icon={DollarSign} label="Sales & Finance" />
          <SidebarItem tab="MEDIA" icon={ImageIcon} label="Media Library" />
          <SidebarItem tab="TRAFFIC" icon={Zap} label="Traffic System" />
          <SidebarItem tab="SEO" icon={FlaskConical} label="SEO & CRO" />
          <SidebarItem tab="LOGS" icon={Activity} label="System Logs" />
          <SidebarItem tab="SETTINGS" icon={Settings} label="Settings" />
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl w-full transition-colors font-medium">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 relative">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 capitalize">{
              activeTab === 'LOGS' ? 'System Health' : 
              activeTab === 'SEO' ? 'SEO & Experiments' : 
              activeTab === 'SALES' ? 'Sales & Proposals' : 
              activeTab === 'MEDIA' ? 'Media Library' : 
              activeTab.toLowerCase()
            }</h1>
            <p className="text-gray-500 text-sm">Manage your portfolio content.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-brand-green w-64 text-sm"
              />
            </div>
            <button className="relative p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-brand-green">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center text-white font-bold border-2 border-white shadow-sm">
              AD
            </div>
          </div>
        </header>

        {/* --- OVERVIEW VIEW --- */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {DASHBOARD_STATS.map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">{stat.label}</p>
                    <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                    <div className={`flex items-center gap-1 text-xs font-semibold mt-2 ${stat.trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {stat.trend >= 0 ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
                      <span>{Math.abs(stat.trend)}% {stat.trend >= 0 ? 'increase' : 'decrease'}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-brand-cream text-brand-green rounded-xl">
                    <stat.icon size={20} />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Inquiries Snippet */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-bold text-lg">Recent Inquiries</h3>
                  <button onClick={() => setActiveTab('INQUIRIES')} className="text-sm text-brand-green font-medium hover:underline">View All</button>
                </div>
                <div className="p-6">
                  {inquiries.slice(0, 3).map((inquiry) => (
                    <div key={inquiry.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">
                            {inquiry.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{inquiry.name}</p>
                            <p className="text-xs text-gray-500">{inquiry.email}</p>
                          </div>
                       </div>
                       <span className="text-xs text-gray-400">{inquiry.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Projects Snippet */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="font-bold text-lg">Top Projects</h3>
                </div>
                <div className="p-6 space-y-4">
                  {projects.slice(0, 3).map((work) => (
                    <div key={work.id} className="flex items-center gap-4">
                      <img src={work.image} alt="project" className="w-12 h-12 rounded-lg object-cover border border-gray-100" />
                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-medium text-sm text-gray-900 truncate">{work.title}</h4>
                        <p className="text-xs text-gray-500 truncate">{work.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- PROJECTS VIEW --- */}
        {activeTab === 'PROJECTS' && (
          <div>
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold">All Projects</h2>
               <button 
                onClick={() => openProjectModal()}
                className="bg-brand-green text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-brand-greenLight transition-colors"
               >
                 <Plus size={16} /> Add Project
               </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm group hover:shadow-md transition-all">
                  <div className="h-48 overflow-hidden relative">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openProjectModal(project)} className="p-2 bg-white/90 text-gray-700 rounded-lg hover:text-brand-green shadow-sm"><Edit2 size={14}/></button>
                      <button onClick={() => deleteProject(project.id)} className="p-2 bg-white/90 text-red-500 rounded-lg hover:bg-red-50 shadow-sm"><Trash2 size={14}/></button>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-bold text-brand-green uppercase mb-1">{project.category}</p>
                    <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2">{project.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- BLOGS VIEW --- */}
        {activeTab === 'BLOGS' && (
          <div>
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold">Blog Posts</h2>
               <button 
                onClick={() => openBlogModal()}
                className="bg-brand-green text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-brand-greenLight transition-colors"
               >
                 <Plus size={16} /> New Post
               </button>
            </div>
            
            <div className="space-y-4">
              {blogs.map((blog) => (
                <div key={blog.id} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-6 items-center shadow-sm group hover:shadow-md transition-all">
                  <div className="w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                     <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-3 mb-1">
                        {blog.isFeatured && <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Featured</span>}
                        <span className="text-xs text-gray-400">{blog.date} • {blog.readTime}</span>
                     </div>
                     <h3 className="font-bold text-lg text-gray-900 truncate">{blog.title}</h3>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity px-4">
                      <button onClick={() => openBlogModal(blog)} className="p-2 text-gray-400 hover:text-brand-green hover:bg-gray-50 rounded-lg"><Edit2 size={18}/></button>
                      <button onClick={() => deleteBlog(blog.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- INQUIRIES VIEW --- */}
        {activeTab === 'INQUIRIES' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 w-1/4">Client</th>
                  <th className="px-6 py-4 w-1/3">Message</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{inquiry.name}</div>
                      <div className="text-gray-500 text-xs">{inquiry.email}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 truncate max-w-xs" title={inquiry.message}>
                      {inquiry.message}
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={inquiry.status}
                        onChange={(e) => updateInquiryStatus(inquiry.id, e.target.value as any)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border bg-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-green/20
                          ${inquiry.status === 'New' ? 'text-blue-600 border-blue-100 bg-blue-50' : 
                            inquiry.status === 'Contacted' ? 'text-yellow-600 border-yellow-100 bg-yellow-50' : 
                            'text-gray-600 border-gray-100 bg-gray-50'}`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{inquiry.date}</td>
                    <td className="px-6 py-4 text-right">
                       <button onClick={() => deleteInquiry(inquiry.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                         <Trash2 size={16} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {inquiries.length === 0 && (
              <div className="p-12 text-center text-gray-400">
                No inquiries found.
              </div>
            )}
          </div>
        )}

        {/* --- SALES VIEW (NEW) --- */}
        {activeTab === 'SALES' && (
          <div className="space-y-8">
             {/* 1. AI Proposal Generator */}
             <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                   <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                     <Sparkles size={20} className="text-brand-green" /> AI Proposal Builder
                   </h3>
                   <div className="space-y-4">
                      <div>
                         <label className="block text-xs font-bold uppercase mb-2 text-gray-500">Client Name</label>
                         <input 
                           type="text" 
                           value={proposalInput.clientName}
                           onChange={(e) => setProposalInput({...proposalInput, clientName: e.target.value})}
                           className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:border-brand-green focus:outline-none"
                           placeholder="e.g. Acme Corp"
                         />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-bold uppercase mb-2 text-gray-500">Project Type</label>
                           <select
                             value={proposalInput.projectType}
                             onChange={(e) => setProposalInput({...proposalInput, projectType: e.target.value})}
                             className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:border-brand-green focus:outline-none bg-white"
                           >
                             <option value="">Select...</option>
                             <option value="MVP Development">MVP Dev</option>
                             <option value="Webflow Migration">Webflow Migration</option>
                             <option value="E-Commerce Site">E-Commerce</option>
                           </select>
                        </div>
                        <div>
                           <label className="block text-xs font-bold uppercase mb-2 text-gray-500">Budget</label>
                           <input 
                             type="text" 
                             value={proposalInput.budget}
                             onChange={(e) => setProposalInput({...proposalInput, budget: e.target.value})}
                             className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:border-brand-green focus:outline-none"
                             placeholder="e.g. $5,000"
                           />
                        </div>
                      </div>
                      <button 
                         onClick={handleProposalGenerate}
                         disabled={!proposalInput.clientName || isProposalGenerating}
                         className="w-full py-3 bg-brand-dark text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors disabled:opacity-50"
                      >
                         {isProposalGenerating ? <Loader2 className="animate-spin" size={16}/> : <FileText size={16}/>}
                         Generate Proposal
                      </button>
                   </div>
                </div>

                <div className="bg-gray-50 rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden flex flex-col">
                   <h3 className="font-bold text-lg mb-4 text-gray-400">Preview</h3>
                   <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 overflow-y-auto font-mono text-xs text-gray-600 whitespace-pre-wrap h-64">
                      {generatedProposal || "// Generated proposal content will appear here..."}
                   </div>
                   {generatedProposal && (
                     <div className="mt-4 flex justify-end gap-2">
                        <button className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-200 rounded-lg">Copy Text</button>
                        <button className="px-4 py-2 text-xs font-bold bg-brand-green text-white rounded-lg">Download PDF</button>
                     </div>
                   )}
                </div>
             </div>

             {/* 2. Invoice Tracker */}
             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                   <h3 className="font-bold text-lg flex items-center gap-2">
                     <DollarSign size={20} className="text-gray-400" /> Recent Invoices
                   </h3>
                   <button className="text-xs font-bold text-brand-green hover:underline">+ New Invoice</button>
                </div>
                <table className="w-full text-left text-sm">
                   <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                      <tr>
                         <th className="px-6 py-3">Invoice ID</th>
                         <th className="px-6 py-3">Client</th>
                         <th className="px-6 py-3">Amount</th>
                         <th className="px-6 py-3">Date</th>
                         <th className="px-6 py-3 text-right">Status</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      {MOCK_INVOICES.map((inv) => (
                         <tr key={inv.id} className="hover:bg-gray-50/50">
                            <td className="px-6 py-4 font-mono text-xs text-gray-500">{inv.id}</td>
                            <td className="px-6 py-4 font-medium">{inv.client}</td>
                            <td className="px-6 py-4 font-medium">{inv.amount}</td>
                            <td className="px-6 py-4 text-gray-500 text-xs">{inv.date}</td>
                            <td className="px-6 py-4 text-right">
                               <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                                  ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                                    inv.status === 'Overdue' ? 'bg-red-100 text-red-700' : 
                                    'bg-yellow-100 text-yellow-700'}`}>
                                  {inv.status}
                               </span>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {/* --- MEDIA MANAGER VIEW (NEW) --- */}
        {activeTab === 'MEDIA' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
               <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search media files..." 
                    value={mediaSearch}
                    onChange={(e) => setMediaSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm"
                  />
               </div>
               <div className="flex gap-2 w-full md:w-auto">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    className="hidden" 
                    accept="image/*,video/*,.pdf"
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-brand-green text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-brand-greenLight transition-colors"
                  >
                    <Upload size={18} /> Upload New
                  </button>
               </div>
            </div>

            {/* Media Grid */}
            {mediaItems.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {mediaItems
                  .filter(item => item.name.toLowerCase().includes(mediaSearch.toLowerCase()))
                  .map((item) => (
                  <div key={item.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all relative">
                     {/* Preview */}
                     <div className="aspect-square bg-gray-100 relative overflow-hidden flex items-center justify-center">
                        {item.type === 'image' ? (
                          <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                        ) : item.type === 'video' ? (
                          <Film size={48} className="text-gray-400" />
                        ) : (
                          <FileText size={48} className="text-gray-400" />
                        )}
                        
                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                           <button 
                             onClick={() => copyMediaLink(item.url)}
                             className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white hover:text-brand-dark transition-colors"
                             title="Copy Link"
                           >
                             <Copy size={18} />
                           </button>
                           <button 
                             onClick={() => deleteMedia(item.id)}
                             className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-red-500 hover:text-white transition-colors"
                             title="Delete"
                           >
                             <Trash2 size={18} />
                           </button>
                        </div>
                     </div>

                     {/* Info */}
                     <div className="p-3">
                        <p className="text-sm font-medium text-gray-900 truncate" title={item.name}>{item.name}</p>
                        <div className="flex justify-between items-center mt-1 text-[10px] text-gray-500 uppercase font-bold tracking-wide">
                           <span>{item.size}</span>
                           <span>{item.date}</span>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                 <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ImageIcon size={32} className="text-gray-300" />
                 </div>
                 <h3 className="text-lg font-bold text-gray-900">No media found</h3>
                 <p className="text-gray-500 text-sm">Upload files to manage them here.</p>
              </div>
            )}
          </div>
        )}

        {/* --- TRAFFIC SYSTEM VIEW --- */}
        {activeTab === 'TRAFFIC' && (
          <div className="space-y-8">
             <div className="grid lg:grid-cols-3 gap-8">
                {/* 1. XML Feeds Card */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                   <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                     <Share2 size={20} className="text-brand-green" /> Product Feeds
                     <span className="text-xs font-medium text-gray-400 ml-auto bg-gray-50 px-2 py-1 rounded">Live XML</span>
                   </h3>
                   <p className="text-sm text-gray-500 mb-6">Automatically updated XML feeds for merchant centers. Listings are generated from your "Service Packages".</p>
                   
                   <div className="space-y-4">
                      {['Google', 'Bing', 'Pinterest'].map((platform) => (
                        <div key={platform} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl bg-gray-50/50">
                            <div className="flex items-center gap-3">
                               <Globe size={18} className="text-gray-400" />
                               <div>
                                  <p className="font-bold text-sm">{platform} Merchant Feed</p>
                                  <p className="text-[10px] text-gray-400">Status: <span className="text-green-600 font-bold">Active</span></p>
                               </div>
                            </div>
                            <button 
                              onClick={() => copyFeedUrl(platform.toLowerCase())}
                              className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors
                                ${copiedFeed === platform.toLowerCase() ? 'bg-green-100 text-green-700' : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-green'}`}
                            >
                              {copiedFeed === platform.toLowerCase() ? <CheckCircle size={14}/> : <Copy size={14}/>}
                              {copiedFeed === platform.toLowerCase() ? 'Copied' : 'Copy URL'}
                            </button>
                        </div>
                      ))}
                   </div>
                </div>

                {/* 2. Coupon Distributor */}
                <div className="bg-brand-green text-white rounded-2xl shadow-lg p-6 flex flex-col justify-between relative overflow-hidden">
                   <Ticket className="absolute -bottom-8 -right-8 w-40 h-40 opacity-10 rotate-12" />
                   <div>
                      <h3 className="font-bold text-lg mb-2">Coupon Blast</h3>
                      <p className="text-brand-cream/80 text-sm mb-6">Submit mock discount codes (e.g. DREW20) to 50+ directory sites.</p>
                      
                      <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm mb-2">
                        <div className="flex justify-between text-xs font-medium mb-1 opacity-80">
                           <span>Directories</span>
                           <span>12/50</span>
                        </div>
                        <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden">
                           <div className="bg-brand-cream h-full w-[24%]"></div>
                        </div>
                      </div>
                   </div>
                   <button className="w-full py-3 bg-white text-brand-green font-bold rounded-xl hover:bg-brand-cream transition-colors text-sm">
                      Distribute "WELCOME10"
                   </button>
                </div>
             </div>
             
             {/* 3. AI Feed Optimizer (NEW) */}
             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Sparkles size={100} className="text-brand-green" />
               </div>
               <h3 className="font-bold text-lg mb-6 flex items-center gap-2 relative z-10">
                 <Sparkles size={20} className="text-purple-500" /> Listing AI Optimizer
               </h3>
               
               <div className="grid lg:grid-cols-2 gap-8 relative z-10">
                 <div className="space-y-4">
                   <div>
                     <label className="block text-xs font-bold uppercase mb-2 text-gray-500">Select Service Package</label>
                     <select 
                        className="w-full p-3 rounded-lg border border-gray-200 text-sm bg-gray-50 focus:border-brand-green focus:outline-none"
                        onChange={(e) => setOptimizingPkg(SERVICE_PACKAGES.find(p => p.id === e.target.value) || null)}
                     >
                        <option value="">-- Choose a package to optimize --</option>
                        {SERVICE_PACKAGES.map(p => (
                          <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                     </select>
                   </div>
                   <div>
                     <label className="block text-xs font-bold uppercase mb-2 text-gray-500">Target Platform</label>
                     <div className="flex gap-2">
                       {['Google', 'Pinterest', 'Bing'].map(p => (
                         <button 
                           key={p} 
                           onClick={() => setOptimizationPlatform(p)}
                           className={`px-4 py-2 rounded-lg text-xs font-bold border transition-colors ${optimizationPlatform === p ? 'bg-brand-green text-white border-brand-green' : 'bg-white border-gray-200 hover:border-brand-green'}`}
                         >
                           {p}
                         </button>
                       ))}
                     </div>
                   </div>
                   <button 
                    onClick={handleOptimize}
                    disabled={!optimizingPkg || isOptimizing}
                    className="w-full py-3 bg-brand-dark text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors disabled:opacity-50"
                   >
                     {isOptimizing ? <Loader2 className="animate-spin" size={16}/> : <Sparkles size={16}/>}
                     Generate Optimized Schema
                   </button>
                 </div>

                 <div className="bg-gray-900 rounded-xl p-4 text-gray-300 font-mono text-xs overflow-y-auto h-64 border border-gray-800 relative">
                   {optimizationResult ? (
                     <div className="space-y-4">
                        <div>
                          <span className="text-purple-400 font-bold block mb-1"># Optimized Title</span>
                          <p className="text-white">{optimizationResult.optimizedTitle}</p>
                        </div>
                        <div>
                          <span className="text-blue-400 font-bold block mb-1"># Description ({optimizationResult.optimizedDescription.length} chars)</span>
                          <p className="opacity-80 leading-relaxed">{optimizationResult.optimizedDescription}</p>
                        </div>
                        <div>
                           <span className="text-green-400 font-bold block mb-1"># Keywords</span>
                           <div className="flex flex-wrap gap-1">
                              {optimizationResult.keywords.map(k => <span key={k} className="bg-gray-800 px-2 py-0.5 rounded text-[10px]">{k}</span>)}
                           </div>
                        </div>
                        <div className="pt-4 border-t border-gray-700">
                          <span className="text-gray-500 font-bold block mb-2"># JSON-LD Preview</span>
                          <pre className="text-[10px] text-yellow-100 opacity-60">
{JSON.stringify({
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": optimizationResult.optimizedTitle,
  "description": optimizationResult.optimizedDescription.substring(0, 100) + "...",
  "brand": { "@type": "Brand", "name": "DrewVerse" }
}, null, 2)}
                          </pre>
                        </div>
                     </div>
                   ) : (
                     <div className="h-full flex flex-col items-center justify-center text-gray-600">
                        <FileCode size={32} className="mb-2 opacity-50"/>
                        <p>Select a package and platform to generate optimized feed data.</p>
                     </div>
                   )}
                 </div>
               </div>
             </div>

             <div className="grid lg:grid-cols-2 gap-8">
                {/* 4. Reddit Post Generator */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                   <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                     <MessageSquare size={20} className="text-orange-500" /> Reddit Marketplaces
                   </h3>
                   <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                      {SERVICE_PACKAGES.map(pkg => (
                         <button 
                            key={pkg.id} 
                            onClick={() => generateRedditPost(pkg)}
                            className="whitespace-nowrap px-4 py-2 border border-gray-200 rounded-full text-xs font-bold hover:bg-gray-50 hover:border-brand-green transition-colors"
                          >
                            {pkg.title}
                          </button>
                      ))}
                   </div>
                   
                   <div className="bg-gray-900 text-gray-300 p-4 rounded-xl font-mono text-xs leading-relaxed h-48 overflow-y-auto relative">
                      {generatedRedditPost || "// Select a service above to generate a post template..."}
                      {generatedRedditPost && (
                         <button 
                           onClick={() => {navigator.clipboard.writeText(generatedRedditPost); alert('Copied to clipboard!')}}
                           className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
                         >
                           <Copy size={14}/>
                         </button>
                      )}
                   </div>
                </div>

                {/* 5. Micro Ads Tracker */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                   <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                     <Activity size={20} className="text-blue-500" /> Micro Niche Ads
                   </h3>
                   <div className="overflow-hidden rounded-xl border border-gray-100">
                      <table className="w-full text-left text-xs">
                         <thead className="bg-gray-50 font-bold text-gray-500">
                            <tr>
                               <th className="px-4 py-3">Platform</th>
                               <th className="px-4 py-3">Keyword</th>
                               <th className="px-4 py-3 text-right">CTR</th>
                               <th className="px-4 py-3 text-right">Spend</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-100">
                            {MOCK_MICRO_ADS.map(ad => (
                               <tr key={ad.id}>
                                  <td className="px-4 py-3 font-medium">{ad.platform}</td>
                                  <td className="px-4 py-3 text-gray-500 truncate max-w-[120px]">{ad.keyword}</td>
                                  <td className="px-4 py-3 text-right font-mono text-green-600">{ad.ctr}</td>
                                  <td className="px-4 py-3 text-right font-mono">{ad.spend}</td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                   <button className="mt-4 w-full py-2 border border-dashed border-gray-300 rounded-xl text-xs font-bold text-gray-400 hover:border-brand-green hover:text-brand-green transition-colors">
                      + Create Niche Campaign
                   </button>
                </div>
             </div>
          </div>
        )}
        
        {/* --- SEO & CRO TAB (NEW) --- */}
        {activeTab === 'SEO' && (
          <div className="space-y-8">
             {/* 1. Experiment Tracker (AB Test) */}
             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <FlaskConical size={20} className="text-brand-green" /> Active A/B Experiments
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">1 Running</span>
                </h3>
                
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                   <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold">{abTest.name}</h4>
                      <div className="text-xs text-gray-500">ID: {abTest.id}</div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-8">
                      {/* Variant A */}
                      <div className="space-y-2">
                         <div className="flex justify-between text-sm">
                            <span className="font-semibold text-gray-600">Variant A (Control)</span>
                            <span className="text-xs text-gray-400">{abTest.variantA.label}</span>
                         </div>
                         <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gray-400" style={{width: `${abTest.variantA.conversion * 2}%`}}></div>
                         </div>
                         <div className="flex justify-between text-xs mt-1">
                            <span>{abTest.variantA.conversion}% Conv.</span>
                            <span>{abTest.variantA.views} Views</span>
                         </div>
                      </div>

                      {/* Variant B */}
                      <div className="space-y-2">
                         <div className="flex justify-between text-sm">
                            <span className="font-semibold text-brand-green">Variant B (Test)</span>
                            <span className="text-xs text-gray-400">{abTest.variantB.label}</span>
                         </div>
                         <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-green" style={{width: `${abTest.variantB.conversion * 2}%`}}></div>
                         </div>
                         <div className="flex justify-between text-xs mt-1 font-bold">
                            <span className="text-green-600">{abTest.variantB.conversion}% Conv.</span>
                            <span>{abTest.variantB.views} Views</span>
                         </div>
                      </div>
                   </div>

                   <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                         <span className="font-bold text-green-600">Variant B</span> is currently outperforming A by 59%.
                      </div>
                      <button className="text-xs font-bold text-red-500 hover:text-red-700">Stop Experiment</button>
                   </div>
                </div>
             </div>

             {/* 2. AI SEO Generator */}
             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 grid lg:grid-cols-2 gap-8">
                <div>
                   <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                     <Search size={20} className="text-blue-500" /> AI Meta Tag Generator
                   </h3>
                   <p className="text-sm text-gray-500 mb-6">Generate optimized Title Tags, Meta Descriptions, and JSON-LD Schema for any page instantly.</p>
                   
                   <div className="space-y-4">
                      <div>
                         <label className="block text-xs font-bold uppercase mb-2 text-gray-500">Page Name</label>
                         <input 
                           type="text" 
                           value={seoPageInput}
                           onChange={(e) => setSeoPageInput(e.target.value)}
                           className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:border-brand-green focus:outline-none"
                           placeholder="e.g. Services - MVP Dev"
                         />
                      </div>
                      <div>
                         <label className="block text-xs font-bold uppercase mb-2 text-gray-500">Content Summary (Optional)</label>
                         <textarea 
                           rows={3}
                           value={seoContentSummary}
                           onChange={(e) => setSeoContentSummary(e.target.value)}
                           className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:border-brand-green focus:outline-none"
                           placeholder="Key topics to include..."
                         />
                      </div>
                      <button 
                         onClick={handleSeoGenerate}
                         disabled={!seoPageInput || isSeoGenerating}
                         className="w-full py-3 bg-brand-dark text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors disabled:opacity-50"
                      >
                         {isSeoGenerating ? <Loader2 className="animate-spin" size={16}/> : <Sparkles size={16}/>}
                         Generate SEO Assets
                      </button>
                   </div>
                </div>

                <div className="bg-gray-900 rounded-xl p-4 text-gray-300 font-mono text-xs overflow-y-auto h-full min-h-[300px] border border-gray-800 relative">
                    {seoResult ? (
                       <div className="space-y-4">
                          <div>
                             <span className="text-blue-400 font-bold block mb-1">&lt;title&gt;</span>
                             <p className="text-white pl-4 border-l-2 border-blue-500/30">{seoResult.metaTitle}</p>
                          </div>
                          <div>
                             <span className="text-purple-400 font-bold block mb-1">&lt;meta name="description"&gt;</span>
                             <p className="text-white pl-4 border-l-2 border-purple-500/30">{seoResult.metaDescription}</p>
                          </div>
                          <div>
                             <span className="text-green-400 font-bold block mb-1">Target Keywords</span>
                             <div className="flex flex-wrap gap-2 mt-1">
                                {seoResult.keywords.split(',').map((k: string) => (
                                   <span key={k} className="bg-gray-800 px-2 py-1 rounded text-[10px] text-gray-300">{k.trim()}</span>
                                ))}
                             </div>
                          </div>
                          <div className="pt-2">
                             <span className="text-yellow-400 font-bold block mb-1">JSON-LD Schema</span>
                             <pre className="text-[10px] text-yellow-100/70 overflow-x-auto">
                                {JSON.stringify(JSON.parse(seoResult.schema), null, 2)}
                             </pre>
                          </div>
                       </div>
                    ) : (
                       <div className="h-full flex flex-col items-center justify-center text-gray-600">
                          <BarChart2 size={32} className="mb-2 opacity-50"/>
                          <p>Enter page details to generate SEO data.</p>
                       </div>
                    )}
                </div>
             </div>
          </div>
        )}

        {/* --- SYSTEM LOGS VIEW --- */}
        {activeTab === 'LOGS' && (
          <div className="bg-brand-dark rounded-2xl border border-gray-800 shadow-sm overflow-hidden text-gray-300 font-mono">
            <div className="p-4 border-b border-gray-700 bg-gray-900 flex justify-between items-center">
              <span className="text-xs uppercase font-bold text-gray-500">Live Server Logs</span>
              <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            <div className="p-0">
               {logs.map((log) => (
                 <div key={log.id} className="border-b border-gray-800 px-6 py-4 hover:bg-white/5 transition-colors flex gap-4 text-xs">
                    <span className="text-gray-500 shrink-0 w-36">{new Date(log.timestamp).toLocaleString()}</span>
                    <span className={`shrink-0 font-bold w-20 
                      ${log.level === 'INFO' ? 'text-blue-400' : 
                        log.level === 'WARNING' ? 'text-yellow-400' : 
                        'text-red-500'}`}>
                      [{log.level}]
                    </span>
                    <span className="shrink-0 text-brand-green w-32">[{log.source}]</span>
                    <span className="flex-1 text-gray-300">{log.message}</span>
                    {log.metadata && <span className="text-gray-600 hidden xl:block truncate max-w-xs">{log.metadata}</span>}
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* --- SETTINGS VIEW --- */}
        {activeTab === 'SETTINGS' && (
          <div className="max-w-2xl space-y-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Database size={20} className="text-gray-400"/> System Status
                  </h3>
               </div>
               <div className="p-6 space-y-6">
                  {/* Database Check */}
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                           dbStatus === 'checking' ? 'bg-blue-100 text-blue-600' :
                           dbStatus === 'connected' ? 'bg-green-100 text-green-600' :
                           'bg-red-100 text-red-600'
                        }`}>
                           {dbStatus === 'checking' ? <RefreshCw size={20} className="animate-spin" /> :
                            dbStatus === 'connected' ? <CheckCircle size={20} /> :
                            <AlertTriangle size={20} />}
                        </div>
                        <div>
                           <p className="font-bold text-gray-900">Supabase Database</p>
                           <p className="text-xs text-gray-500">
                             {dbStatus === 'checking' ? 'Pinging database...' :
                              dbStatus === 'connected' ? 'Connection established via supabase-js.' :
                              'Failed to connect. Check keys.'}
                           </p>
                        </div>
                     </div>
                     <div className="text-right">
                        <span className={`text-sm font-bold ${
                           dbStatus === 'connected' ? 'text-green-600' : 
                           dbStatus === 'error' ? 'text-red-500' : 'text-gray-400'
                        }`}>
                           {dbStatus === 'connected' ? 'ONLINE' : dbStatus.toUpperCase()}
                        </span>
                        {dbLatency && <p className="text-xs text-gray-400">{dbLatency}ms latency</p>}
                     </div>
                  </div>

                  {/* Server Functions Check (Mock) */}
                  <div className="flex items-center justify-between opacity-70">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                           <Server size={20} />
                        </div>
                        <div>
                           <p className="font-bold text-gray-900">Netlify Functions</p>
                           <p className="text-xs text-gray-500">Serverless backend handler.</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <span className="text-sm font-bold text-gray-500">READY</span>
                     </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                     <button 
                       onClick={checkDbConnection} 
                       className="text-sm font-bold text-brand-green flex items-center gap-2 hover:underline"
                       disabled={dbStatus === 'checking'}
                     >
                        <RefreshCw size={14} className={dbStatus === 'checking' ? 'animate-spin' : ''} /> Run Diagnostics
                     </button>
                  </div>
               </div>
            </div>

            {/* NEW: Data Synchronization Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <CloudLightning size={20} className="text-gray-400"/> Data Synchronization
                  </h3>
               </div>
               <div className="p-6">
                 <p className="text-sm text-gray-500 mb-6">
                   Push your local mock data (Projects, Blogs, etc.) to the live Supabase database. 
                   This uses the <code>seed-database</code> function secured by your Service Key.
                 </p>
                 
                 <div className="flex items-center justify-between">
                    <div>
                       {syncStatus && (
                         <div className={`text-xs font-bold ${syncStatus.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                           {syncStatus.type === 'success' ? <CheckCircle size={14} className="inline mr-1"/> : <AlertTriangle size={14} className="inline mr-1"/>}
                           {syncStatus.message}
                         </div>
                       )}
                    </div>
                    <button 
                      onClick={handleSyncDatabase}
                      disabled={isSyncing}
                      className="bg-brand-dark text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSyncing ? <Loader2 size={16} className="animate-spin"/> : <Upload size={16}/>}
                      Push Mock Data to DB
                    </button>
                 </div>
               </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden opacity-60 pointer-events-none">
               <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Shield size={20} className="text-gray-400"/> Admin Security
                  </h3>
               </div>
               <div className="p-6">
                 <p className="text-gray-500 text-sm">Security settings are managed via Supabase Auth dashboard.</p>
               </div>
            </div>
          </div>
        )}

        {/* ... (Modals remain unchanged) ... */}
        {isProjectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="font-bold text-lg">{editingProject ? 'Edit Project' : 'New Project'}</h3>
                  <button onClick={() => setIsProjectModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
               </div>
               <form onSubmit={handleSaveProject} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-2 text-gray-500">Project Title</label>
                    <input 
                      type="text" 
                      required
                      value={projectForm.title} 
                      onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                      className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green" 
                      placeholder="e.g. E-Commerce Redesign"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-2 text-gray-500">Category</label>
                    <input 
                      type="text" 
                      required
                      value={projectForm.category} 
                      onChange={(e) => setProjectForm({...projectForm, category: e.target.value})}
                      className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green" 
                      placeholder="e.g. Web Development"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-2 text-gray-500">Image URL</label>
                    <div className="flex gap-2">
                      <input 
                        type="url" 
                        required
                        value={projectForm.image} 
                        onChange={(e) => setProjectForm({...projectForm, image: e.target.value})}
                        className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green" 
                        placeholder="https://..."
                      />
                      <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex-shrink-0 overflow-hidden flex items-center justify-center">
                        {projectForm.image ? (
                          <img src={projectForm.image} alt="preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                        ) : (
                          <ImageIcon size={20} className="text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-2 text-gray-500">Description</label>
                    <textarea 
                      rows={3}
                      required
                      value={projectForm.description} 
                      onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                      className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green" 
                      placeholder="Brief description of the project..."
                    ></textarea>
                  </div>
                  <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setIsProjectModalOpen(false)} className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                    <button type="submit" className="flex-1 py-3 bg-brand-green text-white font-bold rounded-lg hover:bg-brand-greenLight transition-colors">Save Project</button>
                  </div>
               </form>
            </div>
          </div>
        )}

        {/* --- MODAL FOR BLOGS --- */}
        {isBlogModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="font-bold text-lg">{editingBlog ? 'Edit Post' : 'New Post'}</h3>
                  <button onClick={() => setIsBlogModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
               </div>
               <form onSubmit={handleSaveBlog} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-2 text-gray-500">Post Title</label>
                    <input 
                      type="text" 
                      required
                      value={blogForm.title} 
                      onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                      className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green" 
                      placeholder="e.g. 5 Ways to Scale"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase mb-2 text-gray-500">Publish Date</label>
                      <input 
                        type="text" 
                        required
                        value={blogForm.date} 
                        onChange={(e) => setBlogForm({...blogForm, date: e.target.value})}
                        className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green" 
                        placeholder="e.g. 10 Oct 2023"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase mb-2 text-gray-500">Read Time</label>
                      <input 
                        type="text" 
                        required
                        value={blogForm.readTime} 
                        onChange={(e) => setBlogForm({...blogForm, readTime: e.target.value})}
                        className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green" 
                        placeholder="e.g. 5 min read"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-2 text-gray-500">Cover Image URL</label>
                    <div className="flex gap-2">
                      <input 
                        type="url" 
                        required
                        value={blogForm.image} 
                        onChange={(e) => setBlogForm({...blogForm, image: e.target.value})}
                        className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green" 
                        placeholder="https://..."
                      />
                      <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex-shrink-0 overflow-hidden flex items-center justify-center">
                        {blogForm.image ? (
                          <img src={blogForm.image} alt="preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                        ) : (
                          <ImageIcon size={20} className="text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                     <input 
                        type="checkbox" 
                        id="isFeatured"
                        checked={blogForm.isFeatured}
                        onChange={(e) => setBlogForm({...blogForm, isFeatured: e.target.checked})}
                        className="w-4 h-4 text-brand-green rounded border-gray-300 focus:ring-brand-green"
                     />
                     <label htmlFor="isFeatured" className="text-sm text-gray-700 font-medium">Feature this post on home page</label>
                  </div>
                  
                  <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setIsBlogModalOpen(false)} className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                    <button type="submit" className="flex-1 py-3 bg-brand-green text-white font-bold rounded-lg hover:bg-brand-greenLight transition-colors">Save Post</button>
                  </div>
               </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;