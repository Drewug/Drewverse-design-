import React, { useState, useEffect } from 'react';
import { ArrowRight, Download, Github, Linkedin, Twitter, Dribbble, Globe, Layers, Zap, CheckCircle, Code, Menu, X, Loader2, Send, ArrowUpRight, Cpu, PlayCircle, Quote, LayoutTemplate, FlaskConical } from 'lucide-react';
import { EXPERIENCE_DATA, PROCESS_STEPS, RECENT_WORK, TESTIMONIALS, BLOG_POSTS, SERVICE_PACKAGES } from '../services/mockData';
import { supabase } from '../services/supabaseClient';
import { ViewMode, PublicPage, Project } from '../types';
import AIChatWidget from './AIChatWidget';

interface LandingPageProps {
  onNavigate: (mode: ViewMode) => void;
}

const PublicWebsite: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [activePage, setActivePage] = useState<PublicPage>(PublicPage.HOME);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // --- A/B Testing State ---
  // Experiment: Hero CTA Button Text
  // Variant A: "Explore GitHub"
  // Variant B: "View Case Studies"
  const [abVariant, setAbVariant] = useState<'A' | 'B'>('A');

  // --- SEO & AB Logic ---
  useEffect(() => {
    // 1. Handle AB Test Assignment
    const storedVariant = localStorage.getItem('drewverse_ab_hero_cta');
    if (storedVariant === 'A' || storedVariant === 'B') {
      setAbVariant(storedVariant);
    } else {
      // Assign new variant (50/50 split)
      const newVariant = Math.random() > 0.5 ? 'B' : 'A';
      localStorage.setItem('drewverse_ab_hero_cta', newVariant);
      setAbVariant(newVariant);
      
      // Mock tracking event
      console.log(`[AB_TEST] Assigned to Variant ${newVariant}`);
    }

    // 2. Handle SEO Meta Tags
    const updateMeta = (title: string, desc: string) => {
      document.title = `${title} | DrewVerse Design`;
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', desc);
    };

    switch (activePage) {
      case PublicPage.HOME:
        updateMeta('Full-Stack Web Development', 'Specializing in React, Node.js, and Scalable MVP Development for Startups.');
        break;
      case PublicPage.ABOUT:
        updateMeta('About Drew', 'Ex-Google Engineer helping startups scale with clean code and robust architecture.');
        break;
      case PublicPage.SERVICES:
        updateMeta('Services & Pricing', 'Affordable MVP Development, Webflow Migrations, and Technical Audits.');
        break;
      case PublicPage.PORTFOLIO:
        updateMeta('Portfolio', 'Case studies of high-performance e-commerce and SaaS applications.');
        break;
      case PublicPage.CONTACT:
        updateMeta('Contact Me', 'Let\'s discuss your project. Available for freelance and consulting.');
        break;
    }
    
    // Scroll to top on page change
    window.scrollTo(0, 0);
  }, [activePage]);

  const trackCTAInteraction = () => {
    console.log(`[AB_TEST] User clicked Hero CTA - Variant ${abVariant}`);
    // In real app, send to analytics (e.g. Supabase or GA)
  };

  // --- SUB-COMPONENTS ---

  const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F3F4ED]/95 backdrop-blur-md border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 font-bold text-xl tracking-tight cursor-pointer"
          onClick={() => setActivePage(PublicPage.HOME)}
        >
          <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center text-white">
            <Layers size={18} />
          </div>
          <span className="text-brand-dark">DrewVerse Design</span>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          {[
            { label: 'Home', page: PublicPage.HOME },
            { label: 'About', page: PublicPage.ABOUT },
            { label: 'Services', page: PublicPage.SERVICES },
            { label: 'Portfolio', page: PublicPage.PORTFOLIO },
            { label: 'Contact', page: PublicPage.CONTACT },
          ].map((item) => (
            <button 
              key={item.label}
              onClick={() => setActivePage(item.page)}
              className={`transition-colors ${activePage === item.page ? 'text-brand-green font-bold' : 'hover:text-brand-green'}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate(ViewMode.LOGIN)}
            className="hidden sm:block text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-brand-green"
          >
            Client Login
          </button>
          <button 
            onClick={() => setActivePage(PublicPage.CONTACT)}
            className="hidden sm:block bg-brand-green text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#4A661E] transition-all"
          >
            Hire Me
          </button>
          <button 
            className="md:hidden text-gray-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#F3F4ED] border-b border-gray-200 p-6 flex flex-col space-y-4 shadow-xl">
           {[
            { label: 'Home', page: PublicPage.HOME },
            { label: 'About', page: PublicPage.ABOUT },
            { label: 'Services', page: PublicPage.SERVICES },
            { label: 'Portfolio', page: PublicPage.PORTFOLIO },
            { label: 'Contact', page: PublicPage.CONTACT },
          ].map((item) => (
            <button 
              key={item.label}
              onClick={() => {
                setActivePage(item.page);
                setIsMobileMenuOpen(false);
              }}
              className={`text-left text-lg font-medium ${activePage === item.page ? 'text-brand-green' : 'text-gray-600'}`}
            >
              {item.label}
            </button>
          ))}
           <button 
            onClick={() => onNavigate(ViewMode.LOGIN)}
            className="text-left text-lg font-medium text-gray-500 pt-4 border-t border-gray-200"
          >
            Client Login
          </button>
        </div>
      )}
    </nav>
  );

  const Footer = () => (
    <section className="bg-brand-cream pt-20 pb-10 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
         <div>
             <h2 className="text-4xl font-semibold mb-6">Let's Work Together</h2>
             <p className="text-gray-600 mb-8">Let's Build Your Next Project—or Connect on GitHub to Collaborate!</p>
             
             <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                         <label className="block text-xs font-bold uppercase mb-2">Name*</label>
                         <input type="text" placeholder="Your Name" className="w-full p-4 rounded-lg border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all" />
                     </div>
                     <div>
                         <label className="block text-xs font-bold uppercase mb-2">Email*</label>
                         <input type="email" placeholder="Your Email" className="w-full p-4 rounded-lg border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all" />
                     </div>
                 </div>
                 <div>
                     <label className="block text-xs font-bold uppercase mb-2">Message</label>
                     <textarea placeholder="Write your text here" rows={4} className="w-full p-4 rounded-lg border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"></textarea>
                 </div>
                 <button className="w-full bg-brand-green text-white py-4 rounded-lg font-bold hover:bg-[#4A661E] transition-colors">
                     Explore GitHub
                 </button>
             </form>
         </div>
         
         <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
             <div>
                 <h5 className="font-bold mb-4 text-lg">Useful Link</h5>
                 <ul className="space-y-3 text-gray-600">
                     <li><button onClick={() => setActivePage(PublicPage.PORTFOLIO)} className="hover:text-brand-green">My Work</button></li>
                     <li><button onClick={() => setActivePage(PublicPage.SERVICES)} className="hover:text-brand-green">How I work</button></li>
                     <li><button onClick={() => setActivePage(PublicPage.ABOUT)} className="hover:text-brand-green">My Blog</button></li>
                 </ul>
             </div>
             <div>
                 <h5 className="font-bold mb-4 text-lg">Resources</h5>
                 <ul className="space-y-3 text-gray-600">
                     <li><a href="#" className="hover:text-brand-green">Free Tools</a></li>
                     <li><a href="#" className="hover:text-brand-green">Case Studies</a></li>
                     <li><a href="#" className="hover:text-brand-green">Cheat Sheet</a></li>
                 </ul>
             </div>
             <div className="col-span-2 sm:col-span-1 flex gap-4 items-start">
                 {/* Socials */}
                 <Github className="text-gray-400 hover:text-brand-green cursor-pointer" />
                 <Twitter className="text-gray-400 hover:text-brand-green cursor-pointer" />
                 <Linkedin className="text-gray-400 hover:text-brand-green cursor-pointer" />
             </div>
         </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-200 flex justify-between text-xs text-gray-400">
          <p>All Rights Reserved</p>
          <p>Designed by DrewVerse Design</p>
      </div>
    </section>
  );

  // --- PAGE VIEWS ---

  const HomePage = () => {
    const [activeProject, setActiveProject] = useState<Project | null>(RECENT_WORK[0]);

    return (
    <>
      {/* JSON-LD Schema for Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "DrewVerse Design",
          "url": "https://drewverse.com",
          "logo": "https://drewverse.com/logo.png",
          "sameAs": [
            "https://twitter.com/drewverse_design",
            "https://github.com/drewverse",
            "https://linkedin.com/in/drewverse"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-555-555-5555",
            "contactType": "customer service"
          }
        })}
      </script>

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-7xl font-semibold leading-[1.1] tracking-tight text-brand-dark">
              10+ Years Building <br />
              <span className="text-brand-green">Scalable Web Solutions</span> <br />
              For Startups & SMEs
            </h1>
            <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
              Freelance Full-Stack Developer for Startups, Agencies & SaaS Innovators.
            </p>
            <div className="flex flex-wrap gap-4">
              {/* CRO A/B Test Variant */}
              <button 
                onClick={() => {
                  if (abVariant === 'A') {
                    window.open('https://github.com', '_blank');
                  } else {
                    setActivePage(PublicPage.PORTFOLIO);
                  }
                  trackCTAInteraction();
                }}
                className="bg-brand-green text-white px-8 py-4 rounded-lg font-medium hover:bg-[#4A661E] transition-colors flex items-center gap-2 relative overflow-hidden"
              >
                {abVariant === 'A' ? 'Explore GitHub' : 'View Case Studies'}
                {abVariant === 'A' ? <Github size={18}/> : <ArrowRight size={18}/>}
                
                {/* Debug Indicator for A/B Test */}
                <span className="absolute top-0 right-0 bg-white/20 px-1 text-[8px] text-white font-mono">
                  VAR:{abVariant}
                </span>
              </button>

              <button 
                onClick={() => setActivePage(PublicPage.CONTACT)}
                className="border border-brand-dark/20 bg-transparent px-8 py-4 rounded-lg font-medium hover:bg-white transition-colors"
              >
                Get Webflow Template
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop" 
                alt="Workspace" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Logos Strip */}
      <div className="w-full py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-8">
            <p className="text-sm font-bold text-brand-dark w-full lg:w-48 leading-tight">Worked With Industry Leaders</p>
            <div className="flex-1 flex justify-between items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500 gap-8 flex-wrap">
                <div className="w-8 h-8 rounded-full bg-[#F24E1E]"></div> {/* Figma */}
                <div className="w-8 h-8 rounded-full bg-[#1DB954]"></div> {/* Spotify */}
                <div className="w-8 h-8 rounded bg-black"></div> {/* Notion */}
                <div className="w-8 h-8 rounded-full bg-[#2D7FF9]"></div> {/* Loom */}
                <div className="w-8 h-8 rounded bg-[#5E6AD2]"></div> {/* Linear */}
                <div className="w-8 h-8 rounded-full bg-[#000000]"></div> {/* Next.js */}
                <div className="w-8 h-8 rounded-full bg-[#FF4F00]"></div> 
                <div className="w-8 h-8 rounded-full bg-[#7C3AED]"></div> 
            </div>
        </div>
      </div>

      {/* About / Experience Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Col: Photo Card */}
            <div className="relative h-[500px] rounded-3xl overflow-hidden group">
                 <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" 
                    alt="Drew Portrait" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 text-white">
                    <p className="text-lg leading-relaxed font-medium">Clean code solves problems, but collaboration builds legacies.</p>
                    <button className="mt-4 flex items-center gap-2 text-sm font-bold underline underline-offset-4 hover:text-brand-greenLight">See Last Commit <Github size={14}/></button>
                </div>
            </div>

            {/* Middle Col: Text */}
            <div className="bg-[#EFEFE9] rounded-3xl p-8 flex flex-col justify-center">
                 <h3 className="text-3xl font-semibold mb-6 leading-tight">I am more Than a Developer—Your Partner in Scaling Ideas.</h3>
                 <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                     With 10+ years in web development, I've built scalable apps for startups like Niko and Adelina, ensuring performance, security, seamless user experiences.
                 </p>
                 <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                     I believe in writing clean, scalable code and fostering clear communication. No unnecessary jargon—just efficient development.
                 </p>
            </div>

            {/* Right Col: Experience List */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100">
                <h3 className="text-xl font-semibold mb-8">My Working Experience</h3>
                <div className="space-y-8">
                    {EXPERIENCE_DATA.map((exp, idx) => (
                        <div key={idx} className="border-b border-gray-100 pb-4 last:border-0">
                            <h4 className="font-semibold text-brand-dark">{exp.role}</h4>
                            <div className="flex justify-between items-center text-sm mt-1">
                                <span className="text-gray-500">{exp.company}</span>
                                <span className="text-brand-green font-medium">{exp.period}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* Recent Work - Dynamic Split View */}
      <section className="py-20 px-6 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
             <h2 className="text-3xl font-semibold mb-12">My Recent Work</h2>
             
             <div className="grid lg:grid-cols-12 gap-8 bg-brand-dark rounded-3xl p-8 text-white overflow-hidden relative min-h-[500px]">
                 {/* Left: Project List */}
                 <div className="lg:col-span-4 flex flex-col justify-center space-y-6 z-10">
                     {RECENT_WORK.map((work) => (
                         <div 
                            key={work.id} 
                            className={`cursor-pointer transition-all duration-300 border-b border-white/10 pb-4 group ${activeProject?.id === work.id ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                            onClick={() => setActiveProject(work)}
                         >
                             <p className="text-xs text-brand-green mb-1">{work.category}</p>
                             <div className="flex justify-between items-center">
                                 <h3 className="text-xl font-medium">{work.title}</h3>
                                 <ArrowRight size={18} className={`transform transition-transform ${activeProject?.id === work.id ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                             </div>
                         </div>
                     ))}
                 </div>

                 {/* Right: Active Project Preview */}
                 <div className="lg:col-span-8 relative rounded-2xl overflow-hidden h-full min-h-[400px]">
                      {activeProject && (
                          <div className="relative h-full w-full group">
                              <img 
                                src={activeProject.image} 
                                alt={activeProject.title} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                              
                              {/* Overlay content */}
                              <div className="absolute bottom-8 left-8 max-w-md">
                                  <span className="bg-white text-brand-dark px-3 py-1 rounded-full text-xs font-bold mb-3 inline-block">Featured Project</span>
                                  <h3 className="text-3xl font-bold mb-2">{activeProject.title}</h3>
                                  <p className="text-gray-200 text-sm mb-4">{activeProject.description}</p>
                                  <button className="bg-white text-brand-dark w-10 h-10 rounded-full flex items-center justify-center hover:bg-brand-green hover:text-white transition-colors">
                                      <ArrowUpRight size={20} />
                                  </button>
                              </div>
                          </div>
                      )}
                 </div>
             </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="mb-12">
            <h2 className="text-3xl font-semibold mb-2">Get Hassle Free – From Concept to Launch</h2>
            <p className="text-gray-500">A streamlined 6-step process refined over 10+ years and 50+ projects.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {PROCESS_STEPS.map((step) => (
                <div key={step.id} className="bg-[#EFEFE9] p-6 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 h-full flex flex-col justify-between group cursor-default">
                    <div>
                        <div className="flex justify-between items-start mb-4">
                             <div className="flex items-center gap-2">
                                {/* Icon mapping based on index or type if strictly needed, using simple color logic here */}
                                <div className={`w-2 h-2 rounded-full ${['bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500'][parseInt(step.id)-1]}`}></div>
                                <span className="text-xs font-bold uppercase">{step.title}</span>
                             </div>
                             <span className="text-2xl font-light text-gray-300 group-hover:text-brand-green transition-colors">{step.number}</span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{step.description}</p>
                    </div>
                </div>
            ))}
        </div>
        
        <div className="mt-12 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 border-t border-gray-200 pt-6 gap-4">
            <p>No black boxes – I'll share every commit, Figma file, and test report.</p>
            <div className="flex gap-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-brand-dark text-white rounded-lg hover:bg-black transition-colors text-xs font-bold uppercase tracking-wide">
                    Explore <Github size={14}/>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors text-xs font-bold uppercase tracking-wide">
                    Download Process <Download size={14}/>
                </button>
            </div>
        </div>
      </section>

      {/* Problem/Solution Cards */}
      <section className="pb-24 px-6 max-w-7xl mx-auto">
         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { title: "Need to validate your idea before funding runs out?", sub: "Launch Your MVP in 4-6 Weeks", btn: "Hire Me On Upwork", color: "bg-[#4A661E]" },
                { title: "Overwhelmed with client deadlines?", sub: "Scale Your Team On-Demand", btn: "Partner via Fiverr", color: "bg-[#4A661E]" }, 
                { title: "Struggling to update your site without a dev team?", sub: "Affordable CMS Solutions", btn: "Get a Free Audit", color: "bg-[#4A661E]" },
                { title: "Can't differentiate your brand?", sub: "Stand Out in Crowded Markets", btn: "See Fiverr Packages", color: "bg-[#4A661E]" }
            ].map((card, i) => (
                <div key={i} className="bg-[#EFEFE9] p-8 rounded-2xl flex flex-col justify-between h-80 hover:bg-white hover:shadow-xl transition-all duration-300">
                    <div>
                        <h3 className="text-lg font-bold mb-2 leading-tight">{card.title}</h3>
                        <p className="text-brand-green text-xs font-medium mb-4">{card.sub}</p>
                        <ul className="text-[10px] space-y-2 text-gray-600">
                            <li className="flex gap-2"><CheckCircle size={12} className="text-brand-dark"/> Full-stack development</li>
                            <li className="flex gap-2"><CheckCircle size={12} className="text-brand-dark"/> Scalable architecture</li>
                            <li className="flex gap-2"><CheckCircle size={12} className="text-brand-dark"/> Weekly progress demos</li>
                        </ul>
                    </div>
                    <button className={`${card.color} text-white w-full py-3 rounded-lg text-xs font-bold uppercase tracking-wide hover:opacity-90 flex justify-between px-4 items-center`}>
                        {card.btn} <img src="https://upload.wikimedia.org/wikipedia/commons/9/94/Fiverr_logo.png" alt="" className="h-3 opacity-0" /> {/* Placeholder for platform logo */}
                    </button>
                </div>
            ))}
         </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-24 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-3xl font-semibold mb-12">From MVP to Masterpiece: Proven Client Success Stories</h2>
              <div className="grid md:grid-cols-3 gap-8">
                  {TESTIMONIALS.map((t) => (
                      <div key={t.id} className="bg-[#F9F9F9] p-8 rounded-2xl relative">
                          <div className="flex items-center gap-2 mb-6 text-brand-green font-bold text-lg">
                              <LayoutTemplate size={24} /> {t.company}
                          </div>
                          <Quote size={24} className="text-gray-300 absolute top-8 right-8" />
                          <p className="text-gray-600 text-sm leading-relaxed mb-8">"{t.quote}"</p>
                          <div className="flex items-center gap-4">
                              <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full object-cover" />
                              <div>
                                  <p className="font-bold text-sm text-brand-dark">{t.author}</p>
                                  <p className="text-xs text-gray-400">{t.role}</p>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Tech Talk / Blog */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
           <h2 className="text-3xl font-semibold mb-12">Tech Talk: Building Faster and Scalable</h2>
           <div className="grid lg:grid-cols-2 gap-8">
               {/* Featured Post */}
               <div className="bg-[#78B4D6] rounded-3xl p-8 relative overflow-hidden h-[400px] flex flex-col justify-end text-white group cursor-pointer">
                    <img 
                        src={BLOG_POSTS[0].image} 
                        alt="Blog Cover" 
                        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="relative z-10">
                        <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded mb-4 inline-block">{BLOG_POSTS[0].date}</span>
                        <h3 className="text-2xl font-bold mb-4">{BLOG_POSTS[0].title}</h3>
                        <p className="text-sm opacity-90">How to leverage AI tools to 10x your development speed without sacrificing code quality.</p>
                    </div>
               </div>

               {/* Side Posts */}
               <div className="space-y-4">
                   {BLOG_POSTS.slice(1).map((post) => (
                       <div key={post.id} className="bg-[#EFEFE9] p-6 rounded-2xl flex gap-6 hover:bg-white transition-colors cursor-pointer group h-[190px]">
                           <div className="w-1/3 rounded-xl overflow-hidden">
                               <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="post"/>
                           </div>
                           <div className="flex-1 flex flex-col justify-center">
                               <div className="flex justify-between text-xs text-gray-400 mb-2">
                                   <span>{post.date}</span>
                                   <span>{post.readTime}</span>
                               </div>
                               <h4 className="font-bold text-lg leading-snug group-hover:text-brand-green transition-colors">{post.title}</h4>
                               <div className="mt-4 flex items-center gap-1 text-xs font-bold text-brand-dark">Read More <ArrowUpRight size={12}/></div>
                           </div>
                       </div>
                   ))}
               </div>
           </div>
           
           {/* Bottom Banner */}
           <div className="mt-8 bg-[#E6D4C5] rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
               <div className="w-full md:w-1/3 h-48 rounded-xl overflow-hidden relative">
                   <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="stats"/>
               </div>
               <div className="flex-1">
                   <span className="text-xs font-bold text-gray-500 mb-2 block">5 February 2025</span>
                   <h3 className="text-xl font-bold mb-2">5 Web Performance Hacks That Boosted Client Revenue by 200%</h3>
                   <div className="mt-4 flex items-center gap-1 text-xs font-bold text-brand-dark cursor-pointer">Read More <ArrowUpRight size={12}/></div>
               </div>
           </div>
      </section>
    </>
    );
  };

  const AboutPage = () => (
    <section className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      {/* Schema Injection */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Andrew (Drew)",
          "jobTitle": "Full-Stack Engineer",
          "url": "https://drewverse.com/about",
          "sameAs": ["https://github.com/drewverse"],
          "knowsAbout": ["React", "Node.js", "System Architecture", "SEO"]
        })}
      </script>

      <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Me</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">I'm Andrew, a Full-Stack Engineer with a passion for clean code and user-centric design.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 relative">
              <div className="bg-brand-dark text-white rounded-3xl p-8 h-full flex flex-col justify-end min-h-[500px] relative overflow-hidden group">
                   <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" 
                      alt="Developer Portrait" 
                      className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="relative z-10">
                      <h3 className="text-3xl font-semibold mb-4">More Than Just Code</h3>
                      <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                          With 10+ years in web development, I've built scalable apps for startups like Niko and Adelina. I believe in writing clean, scalable code and fostering clear communication.
                      </p>
                      <a href="#" className="inline-flex items-center gap-2 text-sm font-bold underline underline-offset-4 hover:text-brand-greenLight">See Last Commit <Github size={14}/></a>
                  </div>
              </div>
          </div>
          <div className="lg:col-span-7 pl-0 lg:pl-12">
              <h2 className="text-2xl font-semibold mb-8">My Journey</h2>
              <div className="space-y-8">
                  {EXPERIENCE_DATA.map((exp, idx) => (
                      <div key={idx} className="group border-b border-gray-200 pb-8 last:border-0 hover:pl-4 transition-all duration-300 cursor-default">
                          <div className="flex justify-between items-baseline mb-2">
                              <h4 className="text-xl font-medium text-brand-dark group-hover:text-brand-green transition-colors">{exp.role}</h4>
                              <span className="text-sm font-semibold text-brand-green">{exp.period}</span>
                          </div>
                          <p className="text-gray-500">{exp.company}</p>
                      </div>
                  ))}
              </div>
              <div className="mt-12 p-6 bg-white rounded-xl border border-gray-100">
                  <h3 className="font-bold mb-2">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                      {['React', 'Node.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'TailwindCSS', 'Next.js', 'GraphQL'].map(tech => (
                          <span key={tech} className="px-3 py-1 bg-brand-cream text-brand-dark text-xs font-semibold rounded-full border border-brand-dark/5">
                              {tech}
                          </span>
                      ))}
                  </div>
              </div>
          </div>
      </div>
    </section>
  );

  const ServicesPage = () => (
    <section className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "ItemList",
            "itemListElement": SERVICE_PACKAGES.map((pkg, index) => ({
              "@type": "Product",
              "position": index + 1,
              "name": pkg.title,
              "description": pkg.description,
              "brand": {
                "@type": "Brand",
                "name": "DrewVerse"
              },
              "offers": {
                "@type": "Offer",
                "priceCurrency": "USD",
                "price": pkg.priceValue,
                "availability": "https://schema.org/InStock",
                "itemCondition": "https://schema.org/NewCondition"
              }
            }))
          })}
        </script>

        <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">My Services</h1>
            <p className="text-gray-500 max-w-2xl mx-auto">A comprehensive suite of technical services to take your business to the next level.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {PROCESS_STEPS.map((step) => (
                <div key={step.id} className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
                    <div className="mb-6 flex justify-between items-start">
                         <div className="p-3 bg-brand-cream rounded-lg text-brand-green group-hover:bg-brand-green group-hover:text-white transition-colors">
                            <Layers size={24} />
                         </div>
                         <span className="text-4xl font-light text-gray-200 group-hover:text-brand-green/20 transition-colors">{step.number}</span>
                    </div>
                    <h4 className="text-xl font-bold mb-3">{step.title}</h4>
                    <p className="text-gray-500 leading-relaxed">{step.description}</p>
                </div>
            ))}
        </div>

        <div className="bg-[#EFEFE9] rounded-3xl p-12">
            <h2 className="text-2xl font-bold mb-8 text-center">Service Packages</h2>
            <div className="grid md:grid-cols-3 gap-6">
                {SERVICE_PACKAGES.map((pkg, i) => (
                    <div key={pkg.id} className="bg-white p-6 rounded-xl hover:scale-105 transition-transform duration-300 border border-transparent hover:border-brand-green">
                        <h3 className="text-lg font-bold mb-2">{pkg.title}</h3>
                        <p className="text-brand-green font-bold text-xl mb-6">{pkg.price}</p>
                        <ul className="space-y-3 mb-8">
                            {pkg.features.map((f, idx) => (
                                <li key={idx} className="flex gap-2 text-sm text-gray-600"><CheckCircle size={16} className="text-brand-green"/> {f}</li>
                            ))}
                        </ul>
                        <button onClick={() => setActivePage(PublicPage.CONTACT)} className="w-full py-3 bg-brand-dark text-white rounded-lg font-bold text-sm hover:bg-brand-green transition-colors">Inquire Now</button>
                    </div>
                ))}
            </div>
        </div>
    </section>
  );

  const PortfolioPage = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchProjects = async () => {
        setLoading(true);
        // Fetch from "database"
        const { data } = await supabase.from('projects').select();
        if (data) setProjects(data as Project[]);
        setLoading(false);
      };
      fetchProjects();
    }, []);

    return (
      <section className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Portfolio</h1>
            <p className="text-gray-500 max-w-2xl mx-auto">A selection of recent projects built with modern technologies.</p>
        </div>
        
        {loading ? (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-brand-green" size={48} />
            </div>
        ) : (
            <div className="grid gap-12">
                {projects.map((work, index) => (
                    <div key={work.id} className={`group grid md:grid-cols-2 gap-8 items-center p-8 rounded-3xl transition-colors duration-300 ${index % 2 === 1 ? 'md:grid-flow-dense bg-white border border-gray-100' : 'bg-transparent'}`}>
                        <div className={`space-y-6 ${index % 2 === 1 ? 'md:col-start-2' : ''}`}>
                            <span className="text-sm font-bold uppercase tracking-wider text-brand-green bg-brand-green/10 px-3 py-1 rounded-full">{work.category}</span>
                            <h3 className="text-3xl font-bold">{work.title}</h3>
                            <p className="text-gray-600 text-lg leading-relaxed">{work.description}</p>
                            <button className="flex items-center gap-2 font-bold hover:text-brand-green transition-colors group-hover:translate-x-2 duration-300">
                                View Case Study <ArrowRight size={20} />
                            </button>
                        </div>
                        <div className={`overflow-hidden rounded-2xl h-64 md:h-96 w-full relative shadow-lg ${index % 2 === 1 ? 'md:col-start-1' : ''}`}>
                            <img src={work.image} alt={work.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                    </div>
                ))}
            </div>
        )}
      </section>
    );
  };

  const ContactPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        
        const { error } = await supabase.from('messages').insert(formData);
        
        if (error) {
            setStatus('error');
        } else {
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
        }
    };

    return (
      <section className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
                 <h1 className="text-4xl md:text-5xl font-bold mb-6">Let's start a project together</h1>
                 <p className="text-gray-600 text-lg mb-8">
                    Have a project in mind? I'd love to hear about it. Fill out the form, and I'll get back to you as soon as possible.
                 </p>
                 <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-cream rounded-full flex items-center justify-center text-brand-green">
                            <Send size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-bold uppercase">Email Me</p>
                            <p className="font-medium">hello@drewverse.com</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-cream rounded-full flex items-center justify-center text-brand-green">
                            <Globe size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-bold uppercase">Socials</p>
                            <p className="font-medium">@drewverse_design</p>
                        </div>
                    </div>
                 </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg">
                {status === 'success' ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={32} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                        <p className="text-gray-500">Thank you for reaching out. I'll get back to you within 24 hours.</p>
                        <button onClick={() => setStatus('idle')} className="mt-6 text-brand-green font-bold underline">Send another message</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase mb-2">Name*</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="Your Name" 
                                    className="w-full p-4 rounded-lg border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase mb-2">Email*</label>
                                <input 
                                    type="email" 
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    placeholder="Your Email" 
                                    className="w-full p-4 rounded-lg border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all" 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-2">Message</label>
                            <textarea 
                                rows={5} 
                                required
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                                placeholder="Tell me about your project..." 
                                className="w-full p-4 rounded-lg border border-gray-200 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                            ></textarea>
                        </div>
                        <button 
                            type="submit" 
                            disabled={status === 'submitting'}
                            className="w-full bg-brand-green text-white py-4 rounded-lg font-bold hover:bg-brand-greenLight transition-colors flex justify-center items-center gap-2"
                        >
                            {status === 'submitting' ? <Loader2 className="animate-spin" /> : 'Send Message'}
                        </button>
                    </form>
                )}
            </div>
        </div>
      </section>
    );
  };

  return (
    <div className="w-full bg-[#F3F4ED] text-brand-dark font-sans selection:bg-brand-green selection:text-white min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {activePage === PublicPage.HOME && <HomePage />}
        {activePage === PublicPage.ABOUT && <AboutPage />}
        {activePage === PublicPage.SERVICES && <ServicesPage />}
        {activePage === PublicPage.PORTFOLIO && <PortfolioPage />}
        {activePage === PublicPage.CONTACT && <ContactPage />}
      </main>

      <Footer />
      <AIChatWidget />
    </div>
  );
};

export default PublicWebsite;