import { Project, Experience, SkillGroup } from './types';

export const PERSONAL_INFO = {
  name: "Mikeyas Derje",
  tagline: "Full-Stack Architect • Specialist in High-Concurrency Systems",
  intro: "I engineer resilient software infrastructures. My work bridges the gap between massive data requirements and fluid user experiences, specializing in distributed systems, real-time automation, and performant web architecture.",
  email: "mikeyas.derje@proton.me", 
  linkedin: "https://linkedin.com/in/mikeyas-derje",
  github: "https://github.com/mikeyas",
  location: "Addis Ababa, Ethiopia",
  profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800", 
};

export const PROJECTS: Project[] = [
  {
    id: "1",
    title: "Terran Real Estate Engine",
    description: "A high-performance geospatial platform for property data. Engineered with custom tile-clustering algorithms that manage 100k+ live data points with sub-100ms response times.",
    technologies: ["Next.js", "Mapbox GL", "PostgreSQL", "Redis", "Redux Toolkit"],
    features: [
      "Geospatial query optimization using PostGIS",
      "Real-time market analytics and trend visualization",
      "Multi-tenant agency management system"
    ],
    learning: "Overcame significant hurdles in client-side memory management while rendering massive datasets in the browser.",
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "2",
    title: "Apex Transactional Hub",
    description: "A financial-grade betting core built for precision and speed. Supports high-frequency updates and distributed state management during peak traffic.",
    technologies: ["Node.js", "Socket.io", "PostgreSQL", "TypeScript"],
    features: [
      "ACID-compliant betting transaction engine",
      "WebSocket-driven live odds synchronization",
      "Automated risk assessment and fraud detection"
    ],
    learning: "Mastered high-availability patterns to maintain 99.99% uptime during massive concurrency events.",
    imageUrl: "https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "3",
    title: "Sentinel Observability",
    description: "Enterprise QA dashboard unifying CI/CD metrics, Sentry error logs, and automated testing into an actionable developer command center.",
    technologies: ["React", "D3.js", "Docker", "Sentry API"],
    features: [
      "Real-time pipeline health tracking",
      "Dynamic data visualization of regression trends",
      "Automated incident alert grouping"
    ],
    learning: "Reduced 'alert fatigue' for dev teams by implementing a smart log-clustering algorithm.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bbbda5366392?auto=format&fit=crop&q=80&w=1200",
  }
];

export const SKILLS: SkillGroup[] = [
  {
    category: "System Architecture",
    icon: "fa-layer-group",
    skills: ["Distributed Systems", "Microservices", "API Design", "Caching Patterns", "Auth Protocols"]
  },
  {
    category: "Core Engine",
    icon: "fa-code",
    skills: ["React/Next.js", "Node.js", "Python", "TypeScript", "PostgreSQL", "Redis", "Go"]
  },
  {
    category: "Infrastructure",
    icon: "fa-cloud",
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD Pipelines", "Terraform", "Server Monitoring"]
  }
];

export const WORK_EXPERIENCE: Experience[] = [
  {
    company: "MIME Technology",
    role: "Senior Full-Stack Architect",
    period: "2023 - PRESENT",
    responsibilities: [
      "Spearheading the transition from monolithic legacy apps to a modern micro-frontend architecture.",
      "Optimizing backend performance for high-traffic data ingestion pipelines."
    ],
    achievements: [
      "Increased system throughput by 40% through intelligent DB indexing and Redis implementation.",
      "Developed a standardized React component library used across 5 internal products.",
      "Implemented automated QA gatekeeping that reduced production bugs by 60%."
    ]
  },
  {
    company: "Independent Consultant",
    role: "Full-Stack Engineer",
    period: "2021 - 2023",
    responsibilities: [
      "Delivered custom automation and scraping engines for international market research firms.",
      "Built and scaled several e-commerce and betting platforms from MVP to production."
    ],
    achievements: [
      "Architected a high-speed scraper that bypasses advanced anti-bot protections securely.",
      "Automated complex financial workflows, saving clients 120+ man-hours per month."
    ]
  }
];

export const EDUCATION = [
  {
    title: "Applied System Architecture",
    detail: "Intensive self-study focusing on horizontal scaling and database sharding."
  },
  {
    title: "Full-Stack Specialization",
    detail: "4+ years of hands-on production engineering in modern JavaScript ecosystems."
  }
];