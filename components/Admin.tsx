import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { storageService, PortfolioData } from '../services/storageService';

interface AdminProps {
  onClose: () => void;
}

const Admin: React.FC<AdminProps> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState<PortfolioData>(storageService.getData());
  const [activeTab, setActiveTab] = useState<'info' | 'projects' | 'skills' | 'experience'>('info');
  const [isUploading, setIsUploading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const creds = storageService.getAuth();
    if (username === creds.username && password === creds.password) setIsAuthenticated(true);
    else alert('Unauthorized access.');
  };

  const handleSave = () => {
    storageService.saveData(data);
    alert('System state updated.');
    onClose();
  };

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const localUrl = await storageService.uploadImage(`profile-${Date.now()}`, file);
    setData({ ...data, personalInfo: { ...data.personalInfo, profileImageUrl: localUrl } });
    setIsUploading(false);
  };

  const handleProjectFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = await storageService.uploadImage(`project-${Date.now()}`, file);
    const newProjects = [...data.projects];
    newProjects[idx].imageUrl = localUrl;
    setData({ ...data, projects: newProjects });
  };

  if (!isAuthenticated) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-6 backdrop-blur-md"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="w-full max-w-md border border-zinc-800 p-12 bg-zinc-950 shadow-2xl rounded-2xl"
        >
          <h2 className="text-2xl font-black uppercase text-center mb-10">Access Control</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="text" placeholder="IDENTIFIER" className="w-full bg-black border border-zinc-800 p-4 text-xs font-bold rounded outline-none focus:border-white transition-colors" value={username} onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="ACCESS_KEY" className="w-full bg-black border border-zinc-800 p-4 text-xs font-bold rounded outline-none focus:border-white transition-colors" value={password} onChange={e => setPassword(e.target.value)} />
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-4 bg-white text-black font-black uppercase text-xs rounded cursor-pointer">Initialize</motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={onClose} className="w-full py-4 text-zinc-600 uppercase text-[10px] cursor-pointer hover:text-white transition-colors">Cancel</motion.button>
          </form>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col overflow-hidden"
    >
      <div className="h-20 border-b border-zinc-900 px-8 flex items-center justify-between bg-zinc-950">
        <div className="flex gap-8 items-center">
          <h2 className="text-sm font-black uppercase mr-8">Admin Core</h2>
          {['info', 'projects', 'skills', 'experience'].map(tab => (
            <motion.button whileHover={{ y: -2 }} key={tab} onClick={() => setActiveTab(tab as any)} className={`text-[10px] font-black uppercase tracking-widest cursor-pointer ${activeTab === tab ? 'text-white' : 'text-zinc-600'}`}>{tab}</motion.button>
          ))}
        </div>
        <div className="flex gap-4">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSave} className="px-6 py-2 bg-white text-black text-[10px] font-black uppercase rounded cursor-pointer">Commit</motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClose} className="px-6 py-2 border border-zinc-800 text-zinc-500 text-[10px] font-black uppercase rounded cursor-pointer hover:text-white hover:border-white transition-colors">Exit</motion.button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-12">
        <div className="max-w-4xl mx-auto pb-40">
          {activeTab === 'info' && (
            <div className="space-y-12">
              <h3 className="text-2xl font-black uppercase">Identity Config</h3>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase">Public Name</label>
                    <input className="w-full bg-zinc-900 border border-zinc-800 p-4 text-xs rounded" value={data.personalInfo.name} onChange={e => setData({...data, personalInfo: {...data.personalInfo, name: e.target.value}})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase">LinkedIn</label>
                    <input className="w-full bg-zinc-900 border border-zinc-800 p-4 text-xs rounded" value={data.personalInfo.linkedin} onChange={e => setData({...data, personalInfo: {...data.personalInfo, linkedin: e.target.value}})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase">GitHub</label>
                    <input className="w-full bg-zinc-900 border border-zinc-800 p-4 text-xs rounded" value={data.personalInfo.github} onChange={e => setData({...data, personalInfo: {...data.personalInfo, github: e.target.value}})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase">Telegram Bot Token</label>
                    <input className="w-full bg-zinc-900 border border-zinc-800 p-4 text-xs rounded" value={data.personalInfo.telegramBotToken || ''} onChange={e => setData({...data, personalInfo: {...data.personalInfo, telegramBotToken: e.target.value}})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase">Telegram Chat ID</label>
                    <input className="w-full bg-zinc-900 border border-zinc-800 p-4 text-xs rounded" value={data.personalInfo.telegramChatId || ''} onChange={e => setData({...data, personalInfo: {...data.personalInfo, telegramChatId: e.target.value}})} />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-600 uppercase">Profile Image</label>
                  <div className="aspect-[3/4] bg-zinc-900 border border-zinc-800 relative group overflow-hidden rounded">
                    <img src={data.personalInfo.profileImageUrl} className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer">
                      <span className="text-[10px] font-black uppercase text-white">Upload</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleProfileUpload} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-12">
              <div className="flex justify-between items-center"><h3 className="text-2xl font-black uppercase">Artifacts</h3><button onClick={() => setData({...data, projects: [{id: Date.now().toString(), title: 'New', description: '', technologies: [], features: [], learning: '', imageUrl: ''}, ...data.projects]})} className="px-4 py-2 border border-zinc-800 text-[10px] uppercase rounded">Add</button></div>
              {data.projects.map((proj, idx) => (
                <div key={proj.id} className="p-8 border border-zinc-800 bg-zinc-950 rounded relative group">
                  <button onClick={() => setData({...data, projects: data.projects.filter(p => p.id !== proj.id)})} className="absolute top-4 right-4 text-zinc-800 hover:text-red-500"><i className="fas fa-trash"></i></button>
                  <div className="grid grid-cols-3 gap-8">
                    <div className="aspect-video bg-zinc-900 rounded overflow-hidden relative group/img">
                      <img src={proj.imageUrl} className="w-full h-full object-cover" />
                      <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center cursor-pointer">
                        <span className="text-[8px] font-black text-white">Change</span>
                        <input type="file" className="hidden" accept="image/*" onChange={e => handleProjectFileUpload(e, idx)} />
                      </label>
                    </div>
                    <div className="col-span-2 space-y-4">
                      <input className="w-full bg-transparent border-b border-zinc-800 p-2 text-xl font-black uppercase text-white outline-none" value={proj.title} onChange={e => {
                        const np = [...data.projects]; np[idx].title = e.target.value; setData({...data, projects: np});
                      }} />
                      <textarea className="w-full bg-zinc-900 p-4 text-xs text-zinc-400 rounded" value={proj.description} onChange={e => {
                        const np = [...data.projects]; np[idx].description = e.target.value; setData({...data, projects: np});
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-12">
              <h3 className="text-2xl font-black uppercase">Engine</h3>
              {data.skills.map((group, idx) => (
                <div key={idx} className="p-8 border border-zinc-800 bg-zinc-950 rounded">
                  <input className="bg-transparent text-sm font-black uppercase text-white mb-4 border-b border-zinc-800 outline-none" value={group.category} onChange={e => {
                    const ns = [...data.skills]; ns[idx].category = e.target.value; setData({...data, skills: ns});
                  }} />
                  <textarea className="w-full bg-black p-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 h-24 rounded" value={group.skills.join(', ')} onChange={e => {
                    const ns = [...data.skills]; ns[idx].skills = e.target.value.split(',').map(s => s.trim()); setData({...data, skills: ns});
                  }} />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-12">
              <div className="flex justify-between items-center"><h3 className="text-2xl font-black uppercase">Journey</h3><button onClick={() => setData({...data, experience: [{company: 'Co', role: 'Role', period: '2024', achievements: [], responsibilities: []}, ...data.experience]})} className="px-4 py-2 border border-zinc-800 text-[10px] uppercase rounded">Add</button></div>
              {data.experience.map((exp, idx) => (
                <div key={idx} className="p-8 border border-zinc-800 bg-zinc-950 rounded relative">
                  <button onClick={() => setData({...data, experience: data.experience.filter((_, i) => i !== idx)})} className="absolute top-4 right-4 text-zinc-800"><i className="fas fa-trash"></i></button>
                  <div className="grid grid-cols-3 gap-6">
                    <input className="bg-transparent border-b border-zinc-900 p-2 text-xs font-black uppercase" value={exp.company} onChange={e => { const ne = [...data.experience]; ne[idx].company = e.target.value; setData({...data, experience: ne}); }} />
                    <input className="bg-transparent border-b border-zinc-900 p-2 text-xs font-black uppercase" value={exp.role} onChange={e => { const ne = [...data.experience]; ne[idx].role = e.target.value; setData({...data, experience: ne}); }} />
                    <input className="bg-transparent border-b border-zinc-900 p-2 text-xs font-black uppercase" value={exp.period} onChange={e => { const ne = [...data.experience]; ne[idx].period = e.target.value; setData({...data, experience: ne}); }} />
                    <textarea className="col-span-3 w-full bg-black p-4 text-xs text-zinc-400 h-32 rounded" value={exp.achievements.join('\n')} onChange={e => {
                      const ne = [...data.experience]; ne[idx].achievements = e.target.value.split('\n'); setData({...data, experience: ne});
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Admin;