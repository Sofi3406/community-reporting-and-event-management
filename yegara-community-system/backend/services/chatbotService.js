const { PromptTemplate } = require('@langchain/core/prompts');
const { StringOutputParser } = require('@langchain/core/output_parsers');
const { RunnableSequence } = require('@langchain/core/runnables');
const { ChatOpenAI } = require('@langchain/openai');

const UNKNOWN_RESPONSE = 'I don\'t know about it. Please contact your Woreda office for assistance.';
const UNAVAILABLE_RESPONSE = 'Chatbot is currently unavailable. Please try again later.';

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'can', 'do', 'for', 'from', 'how', 'i',
  'if', 'in', 'is', 'it', 'me', 'my', 'of', 'on', 'or', 'please', 'system', 'the', 'to',
  'what', 'where', 'when', 'who', 'why', 'with', 'you', 'your'
]);

const GREETING_PATTERNS = [
  /\bhi\b/i,
  /\bhello\b/i,
  /\bhey\b/i,
  /\bgood\s+morning\b/i,
  /\bgood\s+afternoon\b/i,
  /\bgood\s+evening\b/i,
  /\bwelcome\b/i,
  /\bwell\s*come\b/i
];

const PLATFORM_OVERVIEW_PATTERNS = [
  /\bwhat\b.*\byegara\b.*\b(do|does|can)\b/i,
  /\bwhat\b.*\bsystem\b.*\b(do|does|can)\b/i,
  /\babout\b.*\byegara\b/i,
  /\bpurpose\b.*\byegara\b/i,
  /\bwhat\b.*\bplatform\b.*\b(do|does|can)\b/i
];

const RESIDENT_KNOWLEDGE_BASE = [
  {
    topic: 'Submit new report',
    keywords: ['report', 'submit', 'issue', 'new report', 'problem', 'complaint'],
    content:
      'Residents can submit a new issue report from the Report Issue page. Provide a clear title, category, location, and a detailed description. Attach a photo if available before submitting.'
  },
  {
    topic: 'Track report status',
    keywords: ['track', 'status', 'my report', 'progress', 'update'],
    content:
      'Residents can track report progress under My Reports. Typical statuses are Pending, In Progress, Resolved, or Rejected. Open a report to view detailed updates posted by officers.'
  },
  {
    topic: 'Events and meetings',
    keywords: ['event', 'meeting', 'virtual', 'calendar', 'join'],
    content:
      'Residents can view upcoming community events and virtual meetings from Events or Meetings pages. Details include date, location or meeting link, and organizer information.'
  },
  {
    topic: 'Announcements',
    keywords: ['announcement', 'notice', 'news', 'update from admin'],
    content:
      'Announcements contain official community updates from officers and administrators. Residents can review announcements for urgent notices, service updates, and participation calls.'
  },
  {
    topic: 'Resources',
    keywords: ['resource', 'document', 'download', 'guide', 'file'],
    content:
      'Residents can open the Resources section to access public documents, guidance materials, and downloadable files shared by officers and administrators.'
  },
  {
    topic: 'Profile and account',
    keywords: ['profile', 'edit profile', 'account', 'password', 'login'],
    content:
      'Residents can open Profile to view account details and Edit Profile to update personal information. Use account recovery options from the login page for forgotten passwords.'
  },
  {
    topic: 'Support contact',
    keywords: ['help', 'support', 'contact', 'office', 'woreda office'],
    content:
      'For unresolved platform or service questions, residents should contact their Woreda office for direct assistance and official follow-up.'
  },
  {
    topic: 'System cost and fees',
    keywords: ['free', 'cost', 'price', 'payment', 'subscription', 'fee', 'paid'],
    content:
      'For residents, using the Yegara platform is free. You can register, submit reports, track progress, and view announcements and events without subscription charges. If your local office has special service fees outside the platform, contact your Woreda office for details.'
  },
  {
    topic: 'Register in system',
    keywords: ['register', 'sign up', 'create account', 'join', 'new account'],
    content:
      'Residents can register from the Register page by providing full name, email, phone number, password, and woreda information. After registration, login to access reporting and tracking features.'
  }
];

const PUBLIC_KNOWLEDGE_BASE = [
  {
    topic: 'What Yegara does',
    keywords: ['what is yegara', 'purpose', 'about', 'platform', 'what do you do'],
    content:
      'Yegara Community Report Tracking and Event Management System helps residents report local issues, track progress, receive announcements, and stay informed about community events and meetings.'
  },
  {
    topic: 'How to register',
    keywords: ['register', 'sign up', 'create account', 'new user', 'join'],
    content:
      'To register, open the Register page, enter your personal details, choose your woreda, and create a password. Then login to access resident features.'
  },
  {
    topic: 'How to use the system',
    keywords: ['use system', 'how to use', 'steps', 'start', 'guide'],
    content:
      'Start by creating an account or logging in. Residents can submit issue reports, track report status, view announcements, and check events or meetings. Use the dashboard to access these sections quickly.'
  },
  {
    topic: 'System cost and free usage',
    keywords: ['free', 'cost', 'price', 'payment', 'subscription', 'fee', 'paid'],
    content:
      'Yes, community members can use the Yegara platform features without subscription payment. You can register, view information, and use reporting functions as part of community service access.'
  },
  {
    topic: 'Reports feature',
    keywords: ['report', 'issue', 'submit complaint', 'track report', 'status'],
    content:
      'Residents can submit reports with title, category, location, and description, optionally with image evidence. Each report can be tracked through pending, in-progress, and resolved stages.'
  },
  {
    topic: 'Events and announcements',
    keywords: ['events', 'announcements', 'meeting', 'news', 'updates'],
    content:
      'The platform publishes official announcements and upcoming events or virtual meetings so community members can stay informed and participate.'
  }
];

const promptTemplate = PromptTemplate.fromTemplate(
  `You are an assistant for the Yegara Community Report Tracking and Event Management System.

Rules:
- Answer only using the provided context.
- Keep the response short, practical, and clear for a resident.
- If context is insufficient, reply exactly with: "I don't know about it. Please contact your Woreda office for assistance."
- If steps are needed, return numbered steps.

Resident name: {residentName}
User question: {question}
Relevant context:\n{context}`
);

const outputParser = new StringOutputParser();

const llm = process.env.OPENAI_API_KEY
  ? new ChatOpenAI({
      modelName: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.2,
      maxTokens: 280
    })
  : null;

const qaChain = llm
  ? RunnableSequence.from([promptTemplate, llm, outputParser])
  : null;

const tokenize = (text) =>
  String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => Boolean(token) && !STOP_WORDS.has(token));

const scoreEntry = (questionTokens, entry) => {
  const keywordTokens = tokenize(entry.keywords.join(' '));
  const contentTokens = tokenize(entry.content);
  const tokenSet = new Set([...keywordTokens, ...contentTokens]);

  let score = 0;
  for (const token of questionTokens) {
    if (tokenSet.has(token)) {
      score += keywordTokens.includes(token) ? 3 : 1;
    }
  }

  return score;
};

const getRelevantContext = (question, knowledgeBase) => {
  const questionTokens = tokenize(question);

  const ranked = knowledgeBase.map((entry) => ({
    ...entry,
    score: scoreEntry(questionTokens, entry)
  }))
    .filter((entry) => entry.score >= 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (!ranked.length) return '';

  return ranked
    .map((entry) => `- ${entry.topic}: ${entry.content}`)
    .join('\n');
};

const buildFallbackAnswer = (context) => {
  const firstLine = context.split('\n').find(Boolean);
  if (!firstLine) return UNKNOWN_RESPONSE;

  const trimmed = firstLine.replace(/^-\s*/, '').trim();
  return `${trimmed} If you need more help, please contact your Woreda office.`;
};

const normalizeAnswer = (answer) => {
  const text = String(answer || '').trim();
  if (!text) return UNKNOWN_RESPONSE;
  return text;
};

const getGreetingResponse = (residentName) => {
  const name = residentName ? ` ${residentName}` : '';
  return `Hello${name}! Welcome to Yegara Community Report Tracking and Event Management System. You can ask about registration, how to use the system, reports, announcements, and events.`;
};

const getPlatformOverviewResponse = () =>
  'Yegara Community Report Tracking and Event Management System helps residents report community issues, track report progress, receive official announcements, and follow local events or virtual meetings. It improves communication between residents and local administrators for faster service response and better community coordination.';

const isGreeting = (question) => {
  const text = String(question || '').trim();
  if (!text) return false;
  return GREETING_PATTERNS.some((pattern) => pattern.test(text));
};

const isPlatformOverviewQuestion = (question) => {
  const text = String(question || '').trim();
  if (!text) return false;

  if (PLATFORM_OVERVIEW_PATTERNS.some((pattern) => pattern.test(text))) {
    return true;
  }

  const tokens = tokenize(text);
  const hasYegara = tokens.includes('yegara');
  const hasIntent = tokens.some((token) =>
    ['about', 'purpose', 'overview', 'platform', 'feature', 'features', 'benefit', 'benefits', 'can', 'do', 'does'].includes(token)
  );

  return hasYegara && hasIntent;
};

const askWithKnowledgeBase = async ({ question, residentName, knowledgeBase }) => {
  const cleanedQuestion = String(question || '').trim();
  if (!cleanedQuestion) {
    return {
      answer: 'Please type a question so I can help you.',
      source: 'validation'
    };
  }

  if (isGreeting(cleanedQuestion)) {
    return {
      answer: getGreetingResponse(residentName),
      source: 'greeting'
    };
  }

  if (isPlatformOverviewQuestion(cleanedQuestion)) {
    return {
      answer: getPlatformOverviewResponse(),
      source: 'intent'
    };
  }

  const context = getRelevantContext(cleanedQuestion, knowledgeBase);
  if (!context) {
    return {
      answer: UNKNOWN_RESPONSE,
      source: 'fallback'
    };
  }

  if (!qaChain) {
    return {
      answer: buildFallbackAnswer(context),
      source: 'fallback'
    };
  }

  const answer = await qaChain.invoke({
    residentName: residentName || 'Resident',
    question: cleanedQuestion,
    context
  });

  return {
    answer: normalizeAnswer(answer),
    source: 'langchain'
  };
};

const askResidentChatbot = async ({ question, residentName }) =>
  askWithKnowledgeBase({ question, residentName, knowledgeBase: RESIDENT_KNOWLEDGE_BASE });

const askPublicChatbot = async ({ question }) =>
  askWithKnowledgeBase({ question, residentName: 'Visitor', knowledgeBase: PUBLIC_KNOWLEDGE_BASE });

module.exports = {
  askResidentChatbot,
  askPublicChatbot,
  UNKNOWN_RESPONSE,
  UNAVAILABLE_RESPONSE
};
