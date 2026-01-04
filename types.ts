
export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  features: string[];
  learning: string;
  imageUrl: string;
  githubUrl?: string;
  liveUrl?: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  responsibilities: string[];
  achievements: string[];
}

export interface SkillGroup {
  category: string;
  skills: string[];
  icon: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
