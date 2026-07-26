import { Prompt } from '../types';

export const INITIAL_PROMPTS: Prompt[] = [
  {
    id: 'sample-1',
    title: 'Code Review & Refactoring Assistant',
    text: `Act as a Senior Software Engineer. Please review the following code snippet for code quality, security vulnerabilities, performance bottlenecks, and adherence to clean code principles.\n\nCode Language: [Language]\n\nCode Snippet:\n\`\`\`\n[Paste code here]\n\`\`\`\n\nProvide:\n1. Brief overall assessment\n2. Key concerns or bugs\n3. Refactored, production-ready code with explanations.`,
    category: 'Coding & Dev',
    tags: ['code-review', 'refactoring', 'clean-code'],
    isFavorite: true,
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'sample-2',
    title: 'Blog Post Outline Generator',
    text: `You are an expert SEO content strategist. Create a comprehensive blog post outline for the topic: "[Topic]".\n\nTarget Audience: [Audience]\nDesired Tone: [Tone - e.g. Professional / Conversational]\nKey Takeaway: [Main Point]\n\nInclude:\n- Catchy H1 Headline options\n- Introduction hook\n- H2 and H3 subheadings with bullet points of key details\n- Call to action (CTA) suggestion`,
    category: 'Writing & Content',
    tags: ['seo', 'blogging', 'outline'],
    isFavorite: true,
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'sample-3',
    title: 'Complex Concept Simplifier (Feynman Technique)',
    text: `Explain the concept of "[Topic]" as if I am a 12-year-old child.\n\nUse clear real-world analogies, simple language, and avoid jargon where possible. If technical terms are necessary, define them instantly in plain English.`,
    category: 'Productivity & Learning',
    tags: ['learning', 'feynman', 'explanation'],
    isFavorite: false,
    createdAt: Date.now() - 86400000 * 1,
    updatedAt: Date.now() - 86400000 * 1,
  },
  {
    id: 'sample-4',
    title: 'Email Professional Polish',
    text: `Please rewrite the following draft email to sound more polite, concise, and professional, while maintaining a friendly and collaborative tone.\n\nDraft Email:\n"[Draft]"\n\nAlso suggest a clear and compelling Subject Line.`,
    category: 'Writing & Content',
    tags: ['email', 'professional', 'communication'],
    isFavorite: false,
    createdAt: Date.now() - 3600000 * 5,
    updatedAt: Date.now() - 3600000 * 5,
  },
  {
    id: 'sample-5',
    title: 'Unit Test Suite Writer',
    text: `Write comprehensive unit tests for the following [Framework/Language] code.\n\nInclude:\n- Happy path test cases\n- Edge cases & empty inputs\n- Error handling test cases\n\nCode:\n\`\`\`\n[Insert code here]\n\`\`\``,
    category: 'Coding & Dev',
    tags: ['unit-tests', 'testing', 'qa'],
    isFavorite: false,
    createdAt: Date.now() - 3600000 * 2,
    updatedAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'sample-6',
    title: 'Product Value Proposition & Elevator Pitch',
    text: `Create 3 distinct elevator pitch variations (15 seconds, 30 seconds, 60 seconds) for a product called "[Product Name]" that solves "[Problem]" for "[Target Customer]".\n\nHighlight the unique value proposition and primary benefits clearly.`,
    category: 'Marketing & Growth',
    tags: ['startup', 'pitch', 'marketing'],
    isFavorite: true,
    createdAt: Date.now() - 1800000,
    updatedAt: Date.now() - 1800000,
  }
];

export const SAMPLE_JSON_EXPORT_STRUCTURE = {
  folders: [
    {
      name: "AI & Prompt Engineering",
      prompts: [
        {
          title: "System Prompt Crafting",
          text: "Design a robust system prompt for an AI assistant specialized in [Domain]. Ensure safety constraints, persona tone, and structured output rules."
        },
        {
          title: "Chain of Thought Problem Solving",
          text: "Think step-by-step before answering. Breakdown the following problem into logical sub-steps: [Problem Statement]."
        }
      ]
    },
    {
      name: "Productivity & Summarization",
      prompts: [
        {
          title: "TL;DR Executive Summary",
          text: "Summarize the following text in 3 key bullet points, highlighted action items, and a 1-sentence executive TL;DR:\n\n[Insert text]"
        }
      ]
    }
  ]
};
