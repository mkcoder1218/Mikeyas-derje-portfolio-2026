
import { PERSONAL_INFO, PROJECTS, SKILLS, WORK_EXPERIENCE, EDUCATION } from '../constants';
import { Project, Experience, SkillGroup } from '../types';

const STORAGE_KEY = 'mikeyas_portfolio_data';
const AUTH_KEY = 'mikeyas_admin_creds';
const DB_NAME = 'PortfolioAssetsDB';
const STORE_NAME = 'images';

export interface PortfolioData {
  personalInfo: typeof PERSONAL_INFO & {
    telegramBotToken?: string;
    telegramChatId?: string;
  };
  projects: Project[];
  skills: SkillGroup[];
  experience: Experience[];
  education: typeof EDUCATION;
}

const DEFAULT_DATA: PortfolioData = {
  personalInfo: {
    ...PERSONAL_INFO,
    telegramBotToken: '',
    telegramChatId: ''
  },
  projects: PROJECTS,
  skills: SKILLS,
  experience: WORK_EXPERIENCE,
  education: EDUCATION,
};

const DEFAULT_AUTH = {
  username: 'admin',
  password: 'password123'
};

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const storageService = {
  getData(): PortfolioData {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_DATA;
    try {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_DATA,
        ...parsed,
        personalInfo: { ...DEFAULT_DATA.personalInfo, ...parsed.personalInfo }
      };
    } catch (e) {
      return DEFAULT_DATA;
    }
  },

  saveData(data: PortfolioData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  getAuth() {
    const saved = localStorage.getItem(AUTH_KEY);
    if (!saved) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(DEFAULT_AUTH));
      return DEFAULT_AUTH;
    }
    return JSON.parse(saved);
  },

  async uploadImage(id: string, file: File): Promise<string> {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(file, id);
      request.onsuccess = () => resolve(`local-blob:${id}`);
      request.onerror = () => reject(request.error);
    });
  },

  async getImageUrl(url: string): Promise<string> {
    if (!url || !url.startsWith('local-blob:')) return url || '';
    const id = url.replace('local-blob:', '');
    const db = await initDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);
      request.onsuccess = () => {
        if (request.result instanceof Blob) {
          resolve(URL.createObjectURL(request.result));
        } else {
          resolve('https://picsum.photos/800/450');
        }
      };
      request.onerror = () => resolve('https://picsum.photos/800/450');
    });
  },

  resetData() {
    localStorage.removeItem(STORAGE_KEY);
    indexedDB.deleteDatabase(DB_NAME);
    window.location.reload();
  }
};
