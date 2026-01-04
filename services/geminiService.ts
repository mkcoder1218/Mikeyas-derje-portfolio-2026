
import { GoogleGenAI } from "@google/genai";
import { PROJECTS, SKILLS, WORK_EXPERIENCE, PERSONAL_INFO } from "../constants";

// Initialize the Gemini API client using the API key directly from the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are the AI Assistant for Mikeyas Derje's professional developer portfolio. 
Your goal is to answer questions about Mikeyas's background, skills, projects, and professional experience.
Be professional, friendly, and concise.

CONTEXT ABOUT MIKEYAS:
- Name: ${PERSONAL_INFO.name}
- Tagline: ${PERSONAL_INFO.tagline}
- Intro: ${PERSONAL_INFO.intro}
- Core Skills: ${SKILLS.map(s => `${s.category}: ${s.skills.join(', ')}`).join('\n')}
- Projects: ${PROJECTS.map(p => `- ${p.title}: ${p.description}. Tech: ${p.technologies.join(', ')}. Key Features: ${p.features.join(', ')}.`).join('\n')}
- Work Experience: ${WORK_EXPERIENCE.map(w => `${w.company} (${w.role}, ${w.period}). Achievements: ${w.achievements.join(', ')}.`).join('\n')}
- Values: Passionate about AI, backend engineering, automation, and scalable systems.
- Education: Self-taught, focusing on constant learning in Python and AI.

If asked about something not in this context, politely mention that you can only provide information about Mikeyas's professional background but can help with questions about his tech stack or projects.
`;

export async function getChatResponse(message: string, history: { role: string; parts: { text: string }[] }[]) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({ role: h.role === 'assistant' ? 'model' : 'user', parts: [{ text: h.parts[0].text }] })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.95,
      },
    });

    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: I'm having trouble connecting to my brain right now. Please try again later!";
  }
}
