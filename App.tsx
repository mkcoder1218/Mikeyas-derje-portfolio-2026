
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { storageService, PortfolioData } from './services/storageService';
import Chatbot from './components/Chatbot';
import Admin from './components/Admin';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as any,
    },
  },
};

const Navbar: React.FC<{ onAdminOpen: () => void, email: string }> = ({ onAdminOpen, email }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setIsMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${scrolled ? 'nav-blur py-3 md:py-4' : 'bg-transparent py-6 md:py-10'}`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          className="text-xl font-bold tracking-tight cursor-pointer select-none flex items-center gap-1 group relative z-10"
          onDoubleClick={onAdminOpen}
        >
          <span className="text-white group-hover:text-blue-500 transition-colors">Mikeyas</span>
          <span className="text-zinc-500">Derje</span>
        </motion.div>

        <div className="hidden md:flex items-center gap-10">
          {['Philosophy', 'Skills', 'Projects', 'Experience', 'Contact'].map((item, i) => (
            <motion.button 
              key={item}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -2, color: '#fff' }}
              onClick={() => scrollTo(item.toLowerCase())}
              className="text-sm font-medium text-zinc-400 transition-colors relative z-10"
            >
              {item}
            </motion.button>
          ))}
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, backgroundColor: '#fff' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollTo('contact')}
            className="px-5 py-2.5 bg-zinc-100 text-zinc-950 text-sm font-bold rounded-full transition-all relative z-[70] cursor-pointer"
          >
            Contact
          </motion.button>
        </div>

        <button 
          className="md:hidden text-zinc-400 hover:text-white transition-colors p-2 relative z-10"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars-staggered'} text-2xl`}></i>
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-zinc-950 z-[50] md:hidden flex flex-col items-center justify-center gap-8 p-6"
          >
            {['Philosophy', 'Skills', 'Projects', 'Experience', 'Contact'].map((item) => (
              <motion.button 
                key={item}
                whileTap={{ scale: 0.9 }}
                onClick={() => scrollTo(item.toLowerCase())}
                className="text-3xl font-bold text-zinc-400 hover:text-white"
              >
                {item}
              </motion.button>
            ))}
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollTo('contact')}
              className="mt-6 px-10 py-4 bg-white text-zinc-950 text-lg font-bold rounded-full cursor-pointer"
            >
              Get in touch
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const ProjectCard: React.FC<{ project: any }> = ({ project }) => {
  const [imgUrl, setImgUrl] = useState<string>(project.imageUrl);

  useEffect(() => {
    if (project.imageUrl?.startsWith('local-blob:')) {
      storageService.getImageUrl(project.imageUrl).then(setImgUrl);
    }
  }, [project.imageUrl]);

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="clean-card rounded-2xl overflow-hidden flex flex-col h-full group"
    >
      <div className="aspect-[16/10] overflow-hidden bg-zinc-900 border-b border-white/5 relative">
        <motion.img 
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.8 }}
          src={imgUrl} 
          alt={project.title}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500"
          onError={() => setImgUrl('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200')}
        />
      </div>
      <div className="p-6 md:p-8 flex flex-col flex-1">
        <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
          {(project.technologies || []).map((t: string) => (
            <motion.span 
              key={t} 
              className="text-[9px] md:text-[10px] font-bold px-2 py-0.5 md:px-2.5 md:py-1 rounded-md bg-zinc-900 text-zinc-400 border border-white/5 uppercase tracking-widest"
            >
              {t}
            </motion.span>
          ))}
        </div>
        <h4 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 tracking-tight text-balance group-hover:text-blue-400 transition-colors">{project.title}</h4>
        <p className="text-zinc-400 text-sm mb-8 md:mb-10 flex-1 leading-relaxed">{project.description}</p>
        <motion.button 
          whileHover={{ x: 5 }}
          className="text-[10px] md:text-xs font-bold text-blue-500 flex items-center gap-2 group/btn uppercase tracking-widest"
        >
          Case Study <i className="fas fa-arrow-right text-[10px] group-hover/btn:translate-x-1 transition-transform"></i>
        </motion.button>
      </div>
    </motion.div>
  );
};

const SectionHeader: React.FC<{ title: string, subtitle: string, align?: 'left' | 'center' }> = ({ title, subtitle, align = 'left' }) => (
  <motion.div 
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    variants={containerVariants}
    className={`mb-12 md:mb-20 space-y-3 md:space-y-5 ${align === 'center' ? 'text-center' : ''}`}
  >
    <motion.div variants={itemVariants} className={`flex items-center gap-4 ${align === 'center' ? 'justify-center' : ''}`}>
       <span className="h-px w-6 md:w-8 bg-blue-500/50"></span>
       <h2 className="text-[10px] md:text-[11px] font-bold text-blue-500 uppercase tracking-[0.3em] md:tracking-[0.4em]">{subtitle}</h2>
    </motion.div>
    <motion.h3 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tighter text-balance">{title}</motion.h3>
  </motion.div>
);

const ContactForm: React.FC<{ telegramToken?: string, telegramId?: string }> = ({ telegramToken, telegramId }) => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!telegramToken || !telegramId) {
      alert("Telegram configuration is missing in Admin panel.");
      return;
    }
    
    setStatus('loading');
    const text = `📬 Portfolio Contact:\nName: ${formState.name}\nEmail: ${formState.email}\nMessage: ${formState.message}`;
    
    try {
      const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: telegramId, text })
      });
      if (response.ok) {
        setStatus('success');
        setFormState({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else throw new Error();
    } catch (err) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-10 bg-zinc-900/30 border border-white/5 rounded-[1.5rem] md:rounded-[2rem] backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          <div className="space-y-2">
            <label className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Full Name</label>
            <input 
              required
              className="w-full bg-zinc-950 border border-white/5 p-3 md:p-4 text-sm text-white outline-none focus:border-blue-500/50 transition-all rounded-xl"
              value={formState.name}
              onChange={(e) => setFormState({...formState, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email Address</label>
            <input 
              required
              type="email"
              className="w-full bg-zinc-950 border border-white/5 p-3 md:p-4 text-sm text-white outline-none focus:border-blue-500/50 transition-all rounded-xl"
              value={formState.email}
              onChange={(e) => setFormState({...formState, email: e.target.value})}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Your Message</label>
          <textarea 
            required
            rows={5}
            className="w-full bg-zinc-950 border border-white/5 p-3 md:p-4 text-sm text-white outline-none focus:border-blue-500/50 transition-all rounded-xl resize-none"
            value={formState.message}
            onChange={(e) => setFormState({...formState, message: e.target.value})}
          />
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={status === 'loading'}
          className={`w-full py-4 md:py-5 rounded-2xl font-bold uppercase tracking-widest text-[10px] md:text-xs transition-all ${
            status === 'success' ? 'bg-emerald-500 text-white' : 
            status === 'error' ? 'bg-red-500 text-white' : 
            'bg-white text-black'
          }`}
        >
          {status === 'loading' ? 'Encrypting & Sending...' : 
           status === 'success' ? 'Sent to Telegram' : 
           status === 'error' ? 'Failed to Send' : 
           'Send Message'}
        </motion.button>
      </form>
    </div>
  );
};

const App: React.FC = () => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [profileImg, setProfileImg] = useState<string>('');

  const refreshData = useCallback(() => {
    const d = storageService.getData();
    setData(d);
    if (d.personalInfo.profileImageUrl) {
      storageService.getImageUrl(d.personalInfo.profileImageUrl).then(setProfileImg);
    }
  }, []);

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      const offset = 80;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    refreshData();
    const handleHash = () => { if (window.location.hash === '#manage') setShowAdmin(true); };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, [refreshData]);

  if (!data) return null;

  const [firstName, lastName] = data.personalInfo.name.split(' ');

  return (
    <div className="min-h-screen">
      <AnimatePresence>
        {showAdmin && <Admin onClose={() => { setShowAdmin(false); window.history.pushState("", document.title, window.location.pathname); refreshData(); }} />}
      </AnimatePresence>
      
      <Navbar onAdminOpen={() => setShowAdmin(true)} email={data.personalInfo.email} />

      <main className="max-w-6xl mx-auto px-6 overflow-hidden">
        {/* HERO */}
        <section className="pt-32 pb-12 md:pt-64 md:pb-40 flex flex-col lg:flex-row items-center gap-12 md:gap-16 lg:gap-32 border-b border-white/5">
          <motion.div initial="hidden" animate="visible" variants={containerVariants} className="w-full lg:w-3/5 space-y-6 md:space-y-10">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 md:gap-3 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-blue-500/5 border border-blue-500/20 text-[9px] md:text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] md:tracking-[0.3em]">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              Engineering Solutions for Scale
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl md:text-8xl font-bold text-white leading-none tracking-tighter">
              {firstName} <br/> <span className="text-zinc-600">{lastName}</span><span className="text-blue-500">.</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-lg md:text-2xl text-zinc-400 max-w-xl leading-relaxed font-light">
              {data.personalInfo.intro}
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 md:gap-5 relative z-20">
              <motion.button onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 md:px-10 py-4 md:py-5 bg-white text-zinc-950 font-bold rounded-2xl text-[10px] md:text-sm uppercase tracking-widest cursor-pointer">Inspect Artifacts</motion.button>
              <motion.button 
                onClick={scrollToContact} 
                className="px-8 md:px-10 py-4 md:py-5 border border-zinc-800 text-white font-bold rounded-2xl text-[10px] md:text-sm uppercase tracking-widest text-center cursor-pointer"
              >
                Inquire
              </motion.button>
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full lg:w-2/5 flex justify-center">
            <div className="relative w-full max-w-[280px] md:max-w-[340px] aspect-[3/4] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
              <img src={profileImg || data.personalInfo.profileImageUrl} alt={data.personalInfo.name} className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-700" />
            </div>
          </motion.div>
        </section>

        {/* PHILOSOPHY */}
        <section id="philosophy" className="section-spacing">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-32 items-center">
            <div className="space-y-6 md:space-y-8">
              <SectionHeader title="Resilience is a Design Choice." subtitle="Philosophy" />
              <p className="text-zinc-400 text-base md:text-xl leading-relaxed font-light">
                I prioritize horizontal scalability and maintainable patterns. In complex ecosystems, structural clarity is the only path to long-term performance.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:gap-8">
              {[{ label: "Deployments", val: "24+" }, { label: "Peak QPS", val: "15k" }, { label: "Latency", val: "45ms" }, { label: "Uptime", val: "99.9%" }].map((stat, i) => (
                <div key={i} className="p-6 md:p-10 bg-zinc-900/40 border border-zinc-800 rounded-2xl md:rounded-3xl">
                  <p className="text-2xl md:text-4xl font-bold text-white mb-1 md:mb-2 tracking-tighter">{stat.val}</p>
                  <p className="text-[8px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="section-spacing border-t border-white/5">
          <SectionHeader title="The Technical Foundation." subtitle="Expertise" />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {data.skills.map((group, idx) => (
              <div key={idx} className="p-8 md:p-10 clean-card rounded-2xl md:rounded-3xl group">
                <i className={`fas ${group.icon} text-blue-400 text-lg md:text-xl mb-6 md:mb-8`}></i>
                <h4 className="text-lg md:text-xl font-bold text-white mb-6 md:mb-8 uppercase tracking-tight">{group.category}</h4>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {group.skills.map(skill => (
                    <span key={skill} className="px-3 py-1.5 md:px-4 md:py-2 bg-zinc-900 text-zinc-400 text-[9px] md:text-[10px] font-bold rounded-lg border border-white/5 uppercase tracking-widest">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="section-spacing border-t border-white/5">
          <SectionHeader title="Selected Artifacts." subtitle="Portfolio" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {data.projects.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience" className="section-spacing border-t border-white/5">
          <div className="max-w-4xl">
            <SectionHeader title="Career Trajectory." subtitle="History" />
            <div className="space-y-12 md:space-y-16 mt-12 md:mt-20">
              {data.experience.map((exp, idx) => (
                <div key={idx} className="relative pl-8 md:pl-12 border-l-2 border-zinc-800 group pb-4">
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-zinc-800 group-hover:bg-blue-500 transition-colors border-4 border-zinc-950"></div>
                  <div className="flex flex-col md:flex-row justify-between items-baseline mb-6 md:mb-8 gap-3 md:gap-4">
                    <div>
                      <h4 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{exp.role}</h4>
                      <p className="text-blue-500 font-bold mt-1 text-[11px] md:text-sm uppercase tracking-widest">{exp.company}</p>
                    </div>
                    <span className="text-[9px] md:text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em] bg-zinc-900 px-3 py-1 md:px-4 md:py-1.5 rounded-full">{exp.period}</span>
                  </div>
                  <ul className="space-y-3 md:space-y-4">
                    {exp.achievements.map((ach, ai) => (
                      <li key={ai} className="text-zinc-400 text-sm md:text-base flex gap-3 md:gap-5 font-light">
                        <span className="text-zinc-700 mt-1.5 md:mt-2 text-[8px]">/</span> {ach}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="section-spacing border-t border-white/5">
          <SectionHeader title="Initiate System Integration." subtitle="Contact" align="center" />
          <ContactForm telegramToken={data.personalInfo.telegramBotToken} telegramId={data.personalInfo.telegramChatId} />
          
          <div className="mt-12 md:mt-20 flex justify-center gap-8 md:gap-10 relative z-30">
            <motion.a whileHover={{ scale: 1.2, color: '#fff' }} href={data.personalInfo.linkedin} target="_blank" className="text-2xl md:text-3xl text-zinc-500"><i className="fab fa-linkedin"></i></motion.a>
            <motion.a whileHover={{ scale: 1.2, color: '#fff' }} href={data.personalInfo.github} target="_blank" className="text-2xl md:text-3xl text-zinc-500"><i className="fab fa-github"></i></motion.a>
          </div>
        </section>
      </main>

      <footer className="py-12 md:py-16 border-t border-white/5 text-center bg-zinc-950">
        <p className="text-zinc-600 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.5em] px-6">
           {data.personalInfo.name} — Systems Architect — MMXXIV
        </p>
      </footer>

      <Chatbot />
    </div>
  );
};

export default App;
