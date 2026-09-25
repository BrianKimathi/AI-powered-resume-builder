import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Download, CreditCard, Shield, Zap, Eye, CheckCircle2, 
  Layers, Lock, ArrowRight, User, LogIn, FileText, ChevronRight, ChevronLeft, ChevronDown, ChevronUp,
  Plus, Trash2, GraduationCap, Award, Palette, Mail, BookOpen, Briefcase, Settings, Globe, Check, MessageSquare, Target, Upload, Search, X
} from 'lucide-react';
import Navbar from './components/Navbar';
import A4DocumentRenderer from './components/A4DocumentRenderer';

const API_BASE_URL = 'http://localhost:8081/api/v1';

// 10 DISTINCT RESUME TEMPLATES SPECIFICATION
const ALL_TEMPLATES = [
  { id: 1, name: 'Classic ATS', desc: 'Ultra-minimalist black/white layout optimized for 100% ATS parser pass rates.', category: 'ATS Optimized', isPremium: false, tag: 'ATS Standard' },
  { id: 2, name: 'Modern Professional', desc: 'Clean sans-serif typography with subtle navy accent bars and section dividers.', category: 'Corporate', isPremium: false, tag: 'Popular' },
  { id: 3, name: 'Executive Elite', desc: 'Top primary banner, gold accents, and high-density serif typography for Directors.', category: 'Executive', isPremium: true, tag: 'Executive' },
  { id: 4, name: 'Technical Architecture', desc: 'Built for Software Engineers & DevOps with multi-block technical skill hierarchy.', category: 'Technology', isPremium: true, tag: 'Tech Special' },
  { id: 5, name: 'Creative Portfolio', desc: 'Vibrant accent highlights, dual-column sidebar layout, and pill-shaped skill badges.', category: 'Creative', isPremium: true, tag: 'Creative' },
  { id: 6, name: 'Academic & Research', desc: 'Focuses on publications, research grants, detailed thesis work, and academic honors.', category: 'Academic', isPremium: false, tag: 'Research' },
  { id: 7, name: 'Engineering & Industrial', desc: 'Emphasizes technical CAD tools, equipment, manufacturing processes, and safety.', category: 'Engineering', isPremium: true, tag: 'Engineering' },
  { id: 8, name: 'Minimal Editorial', desc: 'Generous whitespace, elegant typography, and subtle horizontal line dividers.', category: 'Minimalist', isPremium: false, tag: 'Clean' },
  { id: 9, name: 'Graduate & Entry-Level', desc: 'Designed for students and fresh graduates, emphasizing education and leadership.', category: 'Graduate', isPremium: false, tag: 'Students' },
  { id: 10, name: 'Premium Executive Suite', desc: 'Highly polished layout with custom sidebar and strategic achievement blocks.', category: 'Executive', isPremium: true, tag: 'PRO Suite' }
];

// SANITIZED SAMPLE PREVIEW DATA FOR JOHN DOE CARDS
const JOHN_DOE_SAMPLE = {
  fullName: 'John Doe',
  jobTitle: 'Senior HR & Operations Director',
  location: 'San Francisco, CA • john.doe@example.com • +1 (555) 019-2834',
  summary: 'Results-driven Senior Director with 8+ years of experience leading talent acquisition, employee relations, and organizational development across global teams.',
  skills: [
    { category: 'HR Strategy & Operations', items: 'Talent Acquisition, Performance Management, Onboarding, DEI' },
    { category: 'Systems & Compliance', items: 'Workday HRIS, BambooHR, Labor Law Compliance, Payroll' }
  ],
  experience: [
    { company: 'Global Enterprises Inc.', title: 'Director of People & Culture', dates: 'Jan 2021 – Present', bullets: ['Spearheaded recruitment strategy across 5 regional hubs, reducing time-to-hire by 32%.', 'Managed $4.2M departmental budget and implemented Workday HRIS.'] }
  ],
  education: 'B.S. in Industrial Relations — Cornell University (Graduated)'
};

// REALISTIC A4 EXPORTED PDF DOCUMENT RENDERER
const PDFStyleDocumentRenderer = ({ templateContent, data, accentColor = '#0f172a' }) => {
  const parseInline = (text) => {
    if (!text) return '';
    const clean = text.replace(/\{\{.*?\}\}/g, '').trim();
    const parts = clean.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  if (templateContent) {
    let raw = templateContent;
    raw = raw.replace(/\{\{fullName\}\}/g, data?.personalInfo?.fullName || JOHN_DOE_SAMPLE.fullName);
    raw = raw.replace(/\{\{jobTitle\}\}/g, data?.personalInfo?.jobTitle || JOHN_DOE_SAMPLE.jobTitle);
    raw = raw.replace(/\{\{location\}\}/g, data?.personalInfo?.location || 'San Francisco, CA');
    raw = raw.replace(/\{\{email\}\}/g, data?.personalInfo?.email || 'john.doe@example.com');
    raw = raw.replace(/\{\{phone\}\}/g, data?.personalInfo?.phone || '+1 (555) 019-2834');
    raw = raw.replace(/\{\{summary\}\}/g, data?.summary || JOHN_DOE_SAMPLE.summary);

    const lines = raw.split('\n');

    return (
      <div className="bg-white text-slate-900 w-full max-w-[210mm] min-h-[297mm] mx-auto p-[14mm] shadow-2xl border border-slate-300 font-sans leading-normal text-[11px] space-y-2 select-text relative text-left">
        <div className="absolute top-3 right-5 text-[8px] font-mono text-slate-400 uppercase tracking-widest print:hidden">
          Exported PDF Preview
        </div>
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-1" />;

          // H1 Title (Name)
          if (trimmed.startsWith('# ')) {
            const heading = trimmed.replace('# ', '').replace(/\*\*/g, '');
            return (
              <div key={idx} className="border-b-2 pb-2 mb-3" style={{ borderColor: accentColor }}>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">{heading}</h1>
              </div>
            );
          }

          // H2/H3 Section Titles
          if (trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
            const title = trimmed.replace(/^#{2,3}\s+/, '').replace(/\*\*/g, '');
            return (
              <div key={idx} className="pt-3 pb-1 mb-2 border-b border-slate-300" style={{ borderColor: accentColor }}>
                <h2 className="text-[12px] font-bold uppercase tracking-wider text-slate-900" style={{ color: accentColor }}>
                  {title}
                </h2>
              </div>
            );
          }

          // H4 Sub-headers / Company
          if (trimmed.startsWith('#### ')) {
            const role = trimmed.replace('#### ', '');
            return (
              <div key={idx} className="font-bold text-[11px] text-slate-900 mt-2 mb-0.5">
                {parseInline(role)}
              </div>
            );
          }

          // Blockquote Summary
          if (trimmed.startsWith('> ')) {
            const quote = trimmed.replace('> ', '');
            return (
              <div key={idx} className="p-2.5 bg-slate-50 border-l-2 border-slate-400 text-[11px] text-slate-700 italic my-2">
                {parseInline(quote)}
              </div>
            );
          }

          // Bullet points
          if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            const bullet = trimmed.replace(/^[\*\-]\s+/, '');
            return (
              <div key={idx} className="flex items-start gap-2 ml-3 my-0.5 text-slate-800 text-[11px] leading-snug">
                <span className="text-slate-400 text-[9px] mt-0.5">▪</span>
                <span>{parseInline(bullet)}</span>
              </div>
            );
          }

          // Horizontal Divider Rule
          if (trimmed === '---') {
            return <hr key={idx} className="my-3 border-slate-200" />;
          }

          // Body paragraph
          return (
            <p key={idx} className="text-[11px] text-slate-800 leading-relaxed">
              {parseInline(trimmed)}
            </p>
          );
        })}
      </div>
    );
  }

  // Structured Fallback PDF Document Sheet
  return (
    <div className="bg-white text-slate-900 w-full max-w-[210mm] min-h-[297mm] mx-auto p-[14mm] shadow-2xl border border-slate-300 font-sans text-[11px] space-y-4 select-text relative text-left">
      <div className="absolute top-3 right-5 text-[8px] font-mono text-slate-400 uppercase tracking-widest print:hidden">
        Exported PDF Preview
      </div>
      <div className="border-b-2 pb-3" style={{ borderColor: accentColor }}>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{data?.fullName || JOHN_DOE_SAMPLE.fullName}</h1>
        <p className="text-xs font-bold text-slate-700 mt-0.5">{data?.jobTitle || JOHN_DOE_SAMPLE.jobTitle}</p>
        <p className="text-[10px] text-slate-500 mt-1">{data?.location || JOHN_DOE_SAMPLE.location}</p>
      </div>

      <div>
        <h2 className="text-[12px] font-bold uppercase tracking-wider border-b pb-1 mb-1.5 text-slate-900" style={{ color: accentColor, borderColor: '#cbd5e1' }}>Executive Summary</h2>
        <p className="text-[11px] text-slate-800 leading-relaxed">{data?.summary || JOHN_DOE_SAMPLE.summary}</p>
      </div>

      <div>
        <h2 className="text-[12px] font-bold uppercase tracking-wider border-b pb-1 mb-2 text-slate-900" style={{ color: accentColor, borderColor: '#cbd5e1' }}>Core Competencies & Tools</h2>
        <div className="space-y-1">
          {(data?.skills || JOHN_DOE_SAMPLE.skills).map((s, i) => (
            <div key={i} className="flex items-start gap-2 ml-2 text-[11px] text-slate-800">
              <span className="text-slate-400 text-[9px] mt-0.5">▪</span>
              <span><strong className="text-slate-900">{s.category}:</strong> {s.items}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-[12px] font-bold uppercase tracking-wider border-b pb-1 mb-2 text-slate-900" style={{ color: accentColor, borderColor: '#cbd5e1' }}>Professional Work Experience</h2>
        <div className="space-y-3">
          {(data?.experience || JOHN_DOE_SAMPLE.experience).map((exp, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between font-bold text-slate-900 text-[11px]">
                <span>{exp.title} — <span className="italic font-normal text-slate-700">{exp.company}</span></span>
                <span className="font-normal text-slate-500">{exp.dates}</span>
              </div>
              <div className="space-y-1">
                {(exp.bullets || []).map((b, idx) => (
                  <div key={idx} className="flex items-start gap-2 ml-2 text-[11px] text-slate-800 leading-snug">
                    <span className="text-slate-400 text-[9px] mt-0.5">▪</span>
                    <span>{parseInline(b)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {data?.education && (
        <div>
          <h2 className="text-[12px] font-bold uppercase tracking-wider border-b pb-1 mb-1 text-slate-900" style={{ color: accentColor, borderColor: '#cbd5e1' }}>Education & Credentials</h2>
          <p className="text-[11px] text-slate-800">{data.education}</p>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [dbTemplates, setDbTemplates] = useState(ALL_TEMPLATES);
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState('ALL');
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  const [systemCurrency, setSystemCurrency] = useState('NGN');
  const [systemPlans, setSystemPlans] = useState([]);
  const [plansModalOpen, setPlansModalOpen] = useState(false);
  const [templatePage, setTemplatePage] = useState(1);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTemplates = dbTemplates.filter(t => {
    const matchesCategory = selectedTemplateCategory === 'ALL' || t.category?.toUpperCase() === selectedTemplateCategory.toUpperCase();
    const matchesSearch = !templateSearchQuery.trim() || 
      t.name.toLowerCase().includes(templateSearchQuery.toLowerCase()) || 
      (t.desc && t.desc.toLowerCase().includes(templateSearchQuery.toLowerCase())) ||
      (t.category && t.category.toLowerCase().includes(templateSearchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const TEMPLATES_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredTemplates.length / TEMPLATES_PER_PAGE) || 1;
  const paginatedTemplates = filteredTemplates.slice((templatePage - 1) * TEMPLATES_PER_PAGE, templatePage * TEMPLATES_PER_PAGE);

  const [paystackPublicKey, setPaystackPublicKey] = useState('pk_test_paystack_public_key_mock');

  useEffect(() => {
    fetch('http://localhost:8081/api/v1/templates')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((t, idx) => ({
            id: t.id || idx + 1,
            name: t.name,
            desc: t.description || 'Custom template generated and published from Admin Panel.',
            category: t.category || 'Custom',
            isPremium: t.isPremium ?? false,
            tag: t.isPremium ? 'PRO' : 'Standard'
          }));
          setDbTemplates(mapped);
        }
      })
      .catch(() => {});

    fetch('http://localhost:8081/api/v1/admin/plans')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setSystemPlans(data);
      })
      .catch(() => {});

    fetch('http://localhost:8081/api/v1/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (data.PAYSTACK_CURRENCY) setSystemCurrency(data.PAYSTACK_CURRENCY);
          if (data.PAYSTACK_PUBLIC_KEY) setPaystackPublicKey(data.PAYSTACK_PUBLIC_KEY);
        }
      })
      .catch(() => {});
  }, []);
  const [currentView, setCurrentView] = useState(() => {
    const path = window.location.pathname.replace('/', '').toLowerCase();
    if (['login', 'register', 'plans', 'templates', 'profile', 'onboarding-field', 'editor'].includes(path)) return path;
    return 'landing';
  });

  const handleNavigate = (view) => {
    setCurrentView(view);
    window.history.pushState(null, '', `/${view === 'landing' ? '' : view}`);
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace('/', '').toLowerCase();
      if (['login', 'register', 'plans', 'templates', 'profile', 'onboarding-field', 'editor'].includes(path)) {
        setCurrentView(path);
      } else {
        setCurrentView('landing');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [toolMode, setToolMode] = useState('resume'); // 'resume' | 'cover-letter'

  // Onboarding Selection State
  const [userProfession, setUserProfession] = useState('Software Engineering');
  const [customProfessionInput, setCustomProfessionInput] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Mid-Level');
  const [resumeGoal, setResumeGoal] = useState('General Job Search');
  const [inputMethod, setInputMethod] = useState('ai-chat'); // 'manual' | 'ai-chat' | 'paste-cv'

  // Template Modal Preview State
  const [previewModalTemplate, setPreviewModalTemplate] = useState(null);

  // Accordion Section States
  const [expandedSections, setExpandedSections] = useState({
    template: true,
    personal: true,
    skills: true,
    experience: true,
    projects: false,
    education: false
  });

  const toggleSection = (key) => setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));

  // Auth & User State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ email: 'user@resumebuilder.com', password: 'user123' });
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('resumai_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('resumai_token') || '');

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = authMode === 'login' ? 'http://localhost:8081/api/v1/auth/login' : 'http://localhost:8081/api/v1/auth/register';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authForm.email, password: authForm.password, fullName: authForm.email.split('@')[0] })
      });
      if (res.ok) {
        const data = await res.json();
        const authenticatedUser = data.user || { email: authForm.email, fullName: authForm.email.split('@')[0], tier: 'FREE' };
        localStorage.setItem('resumai_user', JSON.stringify(authenticatedUser));
        if (data.token) localStorage.setItem('resumai_token', data.token);
        setUser(authenticatedUser);
        if (data.token) setToken(data.token);
        handleNavigate('landing');
      } else {
        const fallbackUser = { email: authForm.email, fullName: authForm.email.split('@')[0], tier: 'FREE' };
        localStorage.setItem('resumai_user', JSON.stringify(fallbackUser));
        setUser(fallbackUser);
        handleNavigate('landing');
      }
    } catch (err) {
      const fallbackUser = { email: authForm.email, fullName: authForm.email.split('@')[0], tier: 'FREE' };
      localStorage.setItem('resumai_user', JSON.stringify(fallbackUser));
      setUser(fallbackUser);
      handleNavigate('landing');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('resumai_user');
    localStorage.removeItem('resumai_token');
    setUser(null);
    setToken('');
    handleNavigate('landing');
  };

  // AI Chat Conversation State
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your AI Recruiter & Career Strategist. What would you like to improve, tailor, or edit in your resume today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Selected Template
  const [selectedTemplate, setSelectedTemplate] = useState(ALL_TEMPLATES[1]);
  const [themeColor, setThemeColor] = useState('#0284c7');

  // Resume Data Model
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: 'Alex Johnson',
      jobTitle: 'Senior HR Business Partner',
      location: 'New York, NY',
      phone: '+1 (555) 019-2834',
      email: 'alex.johnson@example.com',
      website: 'linkedin.com/in/alexjohnson'
    },
    summary: 'Strategic Human Resources Leader with 6+ years of experience directing talent acquisition, employee retention campaigns, and HRIS implementations across enterprise organizations.',
    skillCategories: [
      { id: 1, categoryName: 'HR Operations & Talent', items: 'Talent Acquisition, Employee Relations, Performance Management, Onboarding' },
      { id: 2, categoryName: 'Compliance & Tools', items: 'Workday, BambooHR, Labor Law Compliance, Payroll Administration' }
    ],
    experience: [
      {
        id: 1,
        company: 'Deloitte People & Talent',
        title: 'Senior HR Manager',
        startMonth: 'Jan',
        startYear: '2022',
        endMonth: 'Present',
        endYear: '',
        location: 'New York, NY',
        reference: 'Sarah Jenkins (VP HR) • +1 (555) 901-2234',
        bullets: [
          'Spearheaded recruitment strategy resulting in a 30% reduction in time-to-hire.',
          'Implemented Workday HRIS system for 1,200+ employees with zero downtime.'
        ]
      }
    ],
    projects: [
      { id: 1, title: 'Enterprise HRIS Workday Rollout', link: 'Internal Project', architecture: 'Led a 6-month cross-functional rollout of Workday HRIS across 4 regional offices.' }
    ],
    education: [
      { id: 1, school: 'Cornell University', degree: 'B.S. in Industrial Relations', startYear: '2015', endYear: '2019' }
    ]
  });

  // Agentic AI Resume Editor Handler & Usage Limit
  const [aiLoading, setAiLoading] = useState(false);
  const [aiUsageCount, setAiUsageCount] = useState(0);
  const FREE_AI_LIMIT = 5;
  const chatScrollRef = useRef(null);

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, aiLoading]);

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || aiLoading) return;
    
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    // Enforce Free Tier Usage Limit (5 free edits)
    if (aiUsageCount >= FREE_AI_LIMIT) {
      setChatMessages(prev => [...prev, {
        sender: 'ai',
        text: `⚠️ Free Tier AI Limit Reached (${FREE_AI_LIMIT}/${FREE_AI_LIMIT} edits used). Upgrade to ResumAI Pro for unlimited AI agent edits, premium ATS templates, and executive cover letters!`
      }]);
      return;
    }

    setAiUsageCount(prev => prev + 1);
    setAiLoading(true);

    // Support instant client-side extraction if user pastes structured JSON or multi-line skills in userMsg
    let inlineParsedJson = null;
    if (userMsg.includes('{') && userMsg.includes('}') && (userMsg.includes('previewData') || userMsg.includes('summary') || userMsg.includes('skills'))) {
      try {
        const jsonStart = userMsg.indexOf('{');
        const jsonEnd = userMsg.lastIndexOf('}');
        if (jsonStart >= 0 && jsonEnd > jsonStart) {
          inlineParsedJson = JSON.parse(userMsg.substring(jsonStart, jsonEnd + 1));
        }
      } catch (e) {}
    }

    let extractedCategories = [];
    if (userMsg.includes('* **')) {
      const parts = userMsg.split(/\*\s*\*\*/);
      let catId = 1;
      for (const part of parts) {
        if (part.includes(':**')) {
          const colonIdx = part.indexOf(':**');
          const categoryName = part.substring(0, colonIdx).trim();
          let items = part.substring(colonIdx + 3).trim();
          // Trim until next asterisk or end of section
          if (items.includes('*')) {
            items = items.substring(0, items.indexOf('*')).trim();
          }
          if (items.includes('{')) {
            items = items.substring(0, items.indexOf('{')).trim();
          }
          if (categoryName && items) {
            extractedCategories.push({ id: catId++, categoryName, items });
          }
        }
      }
    }

    if (inlineParsedJson && inlineParsedJson.previewData) {
      const pd = inlineParsedJson.previewData;
      
      setResumeData(prev => ({
        ...prev,
        personalInfo: {
          fullName: pd.personal?.fullName || prev.personalInfo.fullName,
          jobTitle: pd.personal?.jobTitle || prev.personalInfo.jobTitle,
          email: pd.personal?.email || prev.personalInfo.email,
          phone: pd.personal?.phone || prev.personalInfo.phone,
          location: pd.personal?.location || prev.personalInfo.location
        },
        summary: pd.summary || prev.summary,
        skillCategories: extractedCategories.length > 0 ? extractedCategories : (
          Array.isArray(pd.skills) ? [{ id: 1, categoryName: 'Core Competencies', items: pd.skills.join(', ') }] : prev.skillCategories
        ),
        experience: Array.isArray(pd.experience) ? pd.experience.map((e, idx) => ({
          id: idx + 1,
          company: e.company || 'Enterprise Corp',
          title: e.position || 'Lead Architect',
          startMonth: 'Jan',
          startYear: e.startDate || '2020',
          endMonth: e.endDate || 'Present',
          bullets: Array.isArray(e.achievements) ? e.achievements : [String(e.achievements || '')]
        })) : prev.experience,
        education: Array.isArray(pd.education) && pd.education.length > 0 ? (
          typeof pd.education[0] === 'string' ? pd.education[0] : `${pd.education[0].degree || ''} — ${pd.education[0].institution || ''}`
        ) : prev.education
      }));
      setChatMessages(prev => [...prev, { sender: 'ai', text: `✅ Parsed & applied candidate profile (Jane Doe) and ${extractedCategories.length || 'all'} skill categories to live resume preview!` }]);
    } else if (extractedCategories.length > 0) {
      setResumeData(prev => ({
        ...prev,
        skillCategories: extractedCategories
      }));
      setChatMessages(prev => [...prev, { sender: 'ai', text: `✅ Extracted ${extractedCategories.length} skill categories into your resume!` }]);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/ai/agent-execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInstruction: userMsg,
          profession: userProfession,
          resumeId: 1
        })
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server returned ${res.status}: ${errorText || res.statusText}`);
      }
      const agentResponse = await res.json();

      if (agentResponse.agentExplanation && !inlineParsedJson) {
        setChatMessages(prev => [...prev, { sender: 'ai', text: agentResponse.agentExplanation }]);
      }

      // Automatically sync canonical resume data & template from Agent execution
      if (agentResponse.updatedResumeData) {
        const newData = agentResponse.updatedResumeData;
        let parsedSkillCategories = prev => prev.skillCategories;
        if (Array.isArray(newData.skillCategories)) {
          parsedSkillCategories = newData.skillCategories.map((s, idx) => ({
            id: s.id || idx + 1,
            categoryName: s.categoryName || 'Technical & Core Skills',
            items: typeof s.items === 'string' ? s.items : (Array.isArray(s.items) ? s.items.join(', ') : String(s.items || ''))
          }));
        }

        setResumeData(prev => ({
          ...prev,
          summary: newData.summary || prev.summary,
          skillCategories: Array.isArray(newData.skillCategories) ? parsedSkillCategories : prev.skillCategories,
          projects: Array.isArray(newData.projects) ? newData.projects : prev.projects,
          experience: Array.isArray(newData.experience) ? newData.experience : prev.experience,
          education: Array.isArray(newData.education) ? newData.education : prev.education
        }));
      }

      if (agentResponse.selectedTemplateId) {
        const matched = ALL_TEMPLATES.find(t => t.id === agentResponse.selectedTemplateId);
        if (matched) setSelectedTemplate(matched);
      }
    } catch (err) {
      console.error('API Error connecting to Backend Agent:', err);
      setChatMessages(prev => [...prev, {
        sender: 'ai',
        text: `Error connecting to AI Agent backend: ${err.message}`
      }]);
    } finally {
      setAiLoading(false);
    }
  };

  const handlePaystackCheckout = (selectedPlan = null) => {
    const amount = selectedPlan ? Number(selectedPlan.priceMonthly || selectedPlan.price || 5000) * 100 : 500000;
    const userEmail = user?.email || 'user@resumebuilder.com';

    if (window.PaystackPop) {
      const handler = window.PaystackPop.setup({
        key: paystackPublicKey || 'pk_test_paystack_public_key_mock',
        email: userEmail,
        amount: amount,
        currency: systemCurrency || 'NGN',
        ref: 'resumai_' + Math.floor((Math.random() * 1000000000) + 1),
        onClose: function() {
          console.log('Paystack checkout window closed by user.');
        },
        callback: function(response) {
          console.log('Paystack Payment Successful! Transaction Ref:', response.reference);
          const newTier = selectedPlan?.name?.toUpperCase()?.includes('ENTERPRISE') ? 'ENTERPRISE' : 'PRO_MONTHLY';
          if (user) {
            const updatedUser = { ...user, tier: newTier };
            setUser(updatedUser);
            localStorage.setItem('resumai_user', JSON.stringify(updatedUser));
          }
          alert(`🎉 Payment Successful! Reference: ${response.reference}\nYour account has been upgraded to ${newTier}!`);
        }
      });
      handler.openIframe();
    } else {
      const symbol = systemCurrency === 'KES' || systemCurrency === 'KSH' ? 'KSh ' : systemCurrency === 'NGN' ? '₦' : systemCurrency === 'GHS' ? '₵' : '$';
      alert(`[Paystack Gateway Payment]\nAmount: ${symbol}${amount / 100} (${systemCurrency})\nTransaction Reference: PAYSTACK-${Date.now()}`);
      if (user) {
        const updatedUser = { ...user, tier: 'PRO_MONTHLY' };
        setUser(updatedUser);
        localStorage.setItem('resumai_user', JSON.stringify(updatedUser));
      }
    }
  };

  const handleDownloadAttempt = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    if (selectedTemplate.isPremium && user.tier === 'FREE') {
      handlePaystackCheckout();
      return;
    }
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar 
        currentView={currentView}
        handleNavigate={handleNavigate}
        user={user}
        dbTemplatesCount={dbTemplates.length}
        userDropdownOpen={userDropdownOpen}
        setUserDropdownOpen={setUserDropdownOpen}
        userDropdownRef={userDropdownRef}
        handleLogout={handleLogout}
      />

      {/* VIEW: DEDICATED /PROFILE PAGE */}
      {currentView === 'profile' && user && (
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
          <div className="flex justify-between items-center border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Account Portal</span>
              <h1 className="text-3xl font-extrabold text-slate-100">User Profile & Subscriptions</h1>
            </div>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5">
              <LogIn className="w-3.5 h-3.5" /> Sign Out of Account
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Active Subscription Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="font-bold text-slate-100 text-base">Active Subscription</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${user.tier !== 'FREE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}`}>
                  {user.tier || 'FREE'}
                </span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">AI Monthly Credits:</span>
                  <span className="text-sky-400 font-bold">{user.tier !== 'FREE' ? '500 Edits/mo' : '10 Edits/mo'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Max PDF Exports:</span>
                  <span className="text-indigo-400 font-bold">{user.tier !== 'FREE' ? '50 Exports' : '3 Exports'}</span>
                </div>
              </div>

              <button 
                onClick={() => handleNavigate('plans')}
                className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:brightness-110 text-white font-bold rounded-xl text-xs shadow transition">
                Change Subscription Plan
              </button>
            </div>

            {/* Profile & Security Settings Box */}
            <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
              <h3 className="font-bold text-slate-100 text-base border-b border-slate-800 pb-3 flex items-center gap-2">
                <Settings className="w-4 h-4 text-sky-400" /> Account Security & Settings
              </h3>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Profile settings and password updated successfully!');
                }} 
                className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Username / Full Name</label>
                    <input 
                      type="text" 
                      value={user.fullName || user.email.split('@')[0]} 
                      onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-bold" 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Email Address</label>
                    <input 
                      disabled
                      type="email" 
                      value={user.email} 
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-500 font-mono" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Update Account Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter new password to change..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500" 
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs shadow">
                    Save Profile Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: DEDICATED /LOGIN PAGE */}
      {currentView === 'login' && (
        <div className="max-w-md mx-auto px-4 py-16 w-full space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-sky-600 rounded-xl mx-auto flex items-center justify-center text-white font-bold">
                <LogIn className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-100">Sign In to Your Account</h1>
              <p className="text-xs text-slate-400">Access your resumes, cover letters, and AI generation credits.</p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Email Address</label>
                <input required type="email" value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} placeholder="user@resumebuilder.com" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-sky-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Password</label>
                <input required type="password" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-sky-500 focus:outline-none" />
              </div>
              <button type="submit" className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-sm transition">
                Sign In to Dashboard
              </button>
            </form>

            <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
              Don't have an account? <button onClick={() => handleNavigate('register')} className="text-sky-400 font-bold hover:underline">Register here</button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: DEDICATED /REGISTER PAGE */}
      {currentView === 'register' && (
        <div className="max-w-md mx-auto px-4 py-16 w-full space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-sky-600 rounded-xl mx-auto flex items-center justify-center text-white font-bold">
                <User className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-100">Create an Account</h1>
              <p className="text-xs text-slate-400">Join thousands of job seekers building ATS-optimized resumes.</p>
            </div>

            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await fetch('http://localhost:8081/api/v1/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                      fullName: authForm.username || authForm.email.split('@')[0], 
                      email: authForm.email, 
                      password: authForm.password 
                    })
                  });
                } catch (err) {}
                alert('Registration successful! Please sign in with your credentials.');
                handleNavigate('login');
              }} 
              className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Username / Full Name</label>
                <input 
                  required 
                  type="text" 
                  value={authForm.username || ''} 
                  onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })} 
                  placeholder="johndoe" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-sky-500 focus:outline-none" 
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Email Address</label>
                <input 
                  required 
                  type="email" 
                  value={authForm.email} 
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} 
                  placeholder="user@resumebuilder.com" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-sky-500 focus:outline-none" 
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Password</label>
                <input 
                  required 
                  type="password" 
                  value={authForm.password} 
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} 
                  placeholder="••••••••" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-sky-500 focus:outline-none" 
                />
              </div>
              <button type="submit" className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-sm transition">
                Create Free Account
              </button>
            </form>

            <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
              Already registered? <button onClick={() => handleNavigate('login')} className="text-sky-400 font-bold hover:underline">Sign In here</button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: DEDICATED /PLANS SUBSCRIPTION PAGE */}
      {currentView === 'plans' && (
        <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
          <div className="text-center space-y-3">
            <span className="px-3.5 py-1 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
              Flexible Pricing Tiers
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-100">Subscription Plans & AI Quotas</h1>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">Choose a plan tailored to your job application velocity. Upgrade anytime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(systemPlans.length > 0 ? systemPlans : [
              { id: 1, name: 'Free Starter', priceMonthly: 0, currency: systemCurrency, aiCreditsLimit: 10, resumeLimit: 3, entitlementsJson: '["10 AI Generations", "3 PDF Exports", "Standard Templates"]' },
              { id: 2, name: 'Pro Professional', priceMonthly: 5000, currency: systemCurrency, aiCreditsLimit: 500, resumeLimit: 50, entitlementsJson: '["500 AI Generations", "50 PDF Exports", "All Premium Templates", "Priority Support"]' },
              { id: 3, name: 'Enterprise Unlimited', priceMonthly: 15000, currency: systemCurrency, aiCreditsLimit: 5000, resumeLimit: 999, entitlementsJson: '["5000 AI Generations", "Unlimited PDF Exports", "Custom Branding", "Dedicated AI Architect"]' }
            ]).map(p => {
              const feats = typeof p.entitlementsJson === 'string' ? JSON.parse(p.entitlementsJson || '[]') : (p.features || []);
              const isCurrent = user && (user.tier === p.code || (p.priceMonthly === 0 && user.tier === 'FREE'));
              const curr = systemCurrency || p.currency || 'KES';
              const symbol = curr === 'KES' || curr === 'KSH' ? 'KSh ' : curr === 'NGN' ? '₦' : curr === 'GHS' ? '₵' : '$';

              return (
                <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 flex flex-col justify-between hover:border-sky-500/50 transition shadow-xl">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <h3 className="font-bold text-slate-100 text-lg">{p.name}</h3>
                      {isCurrent && <span className="text-[10px] font-bold px-2.5 py-0.5 bg-sky-500/10 text-sky-400 border border-sky-500/30 rounded-full">ACTIVE TIER</span>}
                    </div>

                    <div className="text-3xl font-black text-emerald-400 font-mono">
                      {p.priceMonthly === 0 ? 'FREE' : `${symbol}${Number(p.priceMonthly).toLocaleString()}/mo`}
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5">
                      <div className="flex justify-between text-slate-300">
                        <span>AI Generation Credits:</span>
                        <span className="text-sky-400 font-bold">{p.aiCreditsLimit || p.aiCredits} / mo</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>PDF Downloads:</span>
                        <span className="text-indigo-400 font-bold">{p.resumeLimit || p.exportsPerMonth} Exports</span>
                      </div>
                    </div>

                    <ul className="text-xs text-slate-300 space-y-2 pt-1">
                      {feats.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button 
                    disabled={isCurrent}
                    onClick={() => {
                      if (!user) {
                        handleNavigate('login');
                      } else {
                        handlePaystackCheckout(p);
                      }
                    }}
                    className={`w-full py-3 rounded-xl text-xs font-bold transition shadow-lg ${isCurrent ? 'bg-slate-800 text-slate-500 cursor-default' : 'bg-sky-600 hover:bg-sky-500 text-white'}`}>
                    {isCurrent ? 'Current Tier' : user ? 'Subscribe Now' : 'Sign In to Subscribe'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 1: MARKETING LANDING PAGE */}
      {currentView === 'landing' && (
        <div className="space-y-16 pb-20 pt-12">
          {/* Hero Section */}
          <section className="px-4 max-w-5xl mx-auto text-center space-y-6">
            <span className="px-3.5 py-1 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
              AI-Powered Multi-Industry Resume Platform
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-100 leading-tight">
              Build a Professional Resume That Gets You Noticed in <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">Any Industry</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Software Engineering, HR, Mechanical, Healthcare, Finance, Marketing, Law, & Education. Intelligently adapts section structures to your exact profession.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <button 
                onClick={() => setCurrentView('onboarding-field')}
                className="px-8 py-4 bg-gradient-to-r from-sky-500 to-indigo-600 hover:brightness-110 text-white font-bold rounded-xl text-lg shadow-xl shadow-sky-500/20 transition flex items-center gap-3">
                Create My Resume Now <ArrowRight className="w-5 h-5" />
              </button>

              <button 
                onClick={() => setCurrentView('templates')}
                className="px-8 py-4 bg-slate-900 border border-slate-800 hover:border-sky-500 text-slate-200 font-bold rounded-xl text-lg shadow-lg transition flex items-center gap-3">
                <Palette className="w-5 h-5 text-sky-400" /> View All Templates ({dbTemplates.length})
              </button>
            </div>
          </section>

          {/* Feature Highlights Grid */}
          <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 bg-sky-500/10 text-sky-400 rounded-xl flex items-center justify-center font-bold">1</div>
              <h3 className="font-bold text-lg text-slate-100">Industry-Specific AI</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Adapts section structures, terminology, and metrics to HR, Software, Finance, or Engineering.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center font-bold">2</div>
              <h3 className="font-bold text-lg text-slate-100">100% ATS Parser Pass Rate</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Designed according to recruitment parsing guidelines for Workday, Greenhouse, and Lever.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center font-bold">3</div>
              <h3 className="font-bold text-lg text-slate-100">Export PDF & Cover Letters</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Instant high-resolution PDF download with integrated cover letter matching.</p>
            </div>
          </section>
        </div>
      )}

      {/* VIEW: REDESIGNED /TEMPLATES CATALOG PAGE */}
      {currentView === 'templates' && (
        <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-800 pb-6 gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Executive Template Vault</span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100">{dbTemplates.length} Industry-Tested Resume Designs</h1>
              <p className="text-sm text-slate-400">100% ATS-compliant layouts engineered for Workday, Greenhouse, and Lever recruiters.</p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input 
                  type="text" 
                  placeholder="Search templates..."
                  value={templateSearchQuery}
                  onChange={(e) => {
                    setTemplateSearchQuery(e.target.value);
                    setTemplatePage(1);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-medium"
                />
              </div>
              <button onClick={() => handleNavigate('landing')} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-bold transition">
                ← Back
              </button>
            </div>
          </div>

          {/* CATEGORY PILL FILTERS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {['ALL', 'ATS OPTIMIZED', 'CORPORATE', 'EXECUTIVE', 'TECHNOLOGY', 'CREATIVE', 'HEALTHCARE', 'ENGINEERING', 'MINIMALIST', 'GRADUATE'].map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedTemplateCategory(cat);
                  setTemplatePage(1);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${selectedTemplateCategory === cat ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'}`}>
                {cat}
              </button>
            ))}
          </div>

          {/* TEMPLATES GRID (RESPONSIVE 3-COLUMN HIGH DENSITY) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedTemplates.map(tpl => (
              <div 
                key={tpl.id}
                onClick={() => setPreviewModalTemplate(tpl)}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 cursor-pointer hover:border-sky-500 hover:scale-[1.01] transition flex flex-col justify-between group shadow-xl relative overflow-hidden">
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-md">
                      {tpl.category || tpl.tag || 'Executive'}
                    </span>
                    {tpl.isPremium ? (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" /> PRO
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                        FREE
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-base text-slate-100 group-hover:text-sky-400 transition">{tpl.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{tpl.desc}</p>
                </div>

                {/* PDF DOCUMENT MINI CARD PREVIEW */}
                <div className="bg-white text-slate-900 rounded-xl p-3 shadow-inner border border-slate-300 max-h-48 overflow-hidden relative select-none">
                  <div className="scale-[0.55] origin-top-left w-[180%] pointer-events-none">
                    <PDFStyleDocumentRenderer 
                      templateContent={tpl.content} 
                      data={JOHN_DOE_SAMPLE} 
                      accentColor="#0f172a" 
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end justify-center p-3">
                    <span className="px-3 py-1.5 bg-sky-600 text-white rounded-lg text-xs font-bold shadow-lg flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> Expand PDF Preview
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewModalTemplate(tpl);
                    }}
                    className="flex-1 py-2 bg-slate-800 group-hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 border border-slate-700">
                    <Eye className="w-3.5 h-3.5 text-sky-400" /> PDF Document Preview
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTemplate(tpl);
                      handleNavigate('onboarding-field');
                    }}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs shadow flex items-center gap-1">
                    Use <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* EMPTY SEARCH RESULTS STATE */}
          {filteredTemplates.length === 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <p className="text-slate-400 text-sm">No templates matched your search criteria or category filter.</p>
              <button 
                onClick={() => {
                  setSelectedTemplateCategory('ALL');
                  setTemplateSearchQuery('');
                }}
                className="px-4 py-2 bg-sky-600 text-white font-bold rounded-xl text-xs">
                Reset Filters & Search
              </button>
            </div>
          )}

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 pt-6 border-t border-slate-800">
              <button
                onClick={() => setTemplatePage(p => Math.max(1, p - 1))}
                disabled={templatePage === 1}
                className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1">
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <div className="flex gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => setTemplatePage(pageNum)}
                    className={`px-3.5 py-2 text-xs font-bold rounded-xl transition ${templatePage === pageNum ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'}`}>
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setTemplatePage(p => Math.min(totalPages, p + 1))}
                disabled={templatePage === totalPages}
                className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: CAREER ONBOARDING STEP 1 - FIELD SELECTION */}
      {currentView === 'onboarding-field' && (
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Step 1 of 4</span>
            <h2 className="text-3xl font-extrabold text-slate-100">Select Your Career Field</h2>
            <p className="text-sm text-slate-400">ResumAI adapts your resume section structure based on your profession.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              'Software Engineering', 'Human Resources', 'Mechanical Engineering', 'Finance & Accounting',
              'Marketing & Sales', 'Healthcare', 'Education', 'Civil Engineering',
              'Architecture', 'Law & Legal', 'Business Admin', 'Other'
            ].map(field => (
              <button 
                key={field}
                onClick={() => {
                  setUserProfession(field);
                  setCurrentView('onboarding-level');
                }}
                className={`p-4 rounded-xl border text-sm font-semibold transition ${
                  userProfession === field 
                    ? 'bg-sky-600 border-sky-500 text-white shadow-lg' 
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}>
                {field}
              </button>
            ))}
          </div>

          {userProfession === 'Other' && (
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <label className="text-xs text-slate-400 block font-semibold">Type your exact profession:</label>
              <input 
                type="text" 
                placeholder="e.g. Environmental Scientist, Logistics Coordinator..." 
                value={customProfessionInput}
                onChange={(e) => setCustomProfessionInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200"
              />
            </div>
          )}

          <div className="flex justify-between pt-4">
            <button onClick={() => setCurrentView('landing')} className="px-6 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-sm font-semibold">Back</button>
            <button onClick={() => setCurrentView('onboarding-level')} className="px-8 py-2.5 bg-sky-600 text-white font-bold rounded-xl text-sm flex items-center gap-2">
              Next: Experience Level <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* VIEW 3: CAREER ONBOARDING STEP 2 - EXPERIENCE LEVEL */}
      {currentView === 'onboarding-level' && (
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Step 2 of 4</span>
            <h2 className="text-3xl font-extrabold text-slate-100">Select Your Experience Level</h2>
            <p className="text-sm text-slate-400">Students emphasize education & projects, while Executives emphasize leadership.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['Student', 'Recent Graduate', 'Entry Level', 'Mid-Level', 'Senior', 'Lead / Manager', 'Director / Executive', 'Career Changer'].map(level => (
              <button 
                key={level}
                onClick={() => {
                  setExperienceLevel(level);
                  setCurrentView('onboarding-goal');
                }}
                className={`p-4 rounded-xl border text-sm font-semibold transition ${
                  experienceLevel === level 
                    ? 'bg-sky-600 border-sky-500 text-white shadow-lg' 
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}>
                {level}
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setCurrentView('onboarding-field')} className="px-6 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-sm font-semibold">Back</button>
            <button onClick={() => setCurrentView('onboarding-goal')} className="px-8 py-2.5 bg-sky-600 text-white font-bold rounded-xl text-sm flex items-center gap-2">
              Next: Resume Goal <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* VIEW 4: CAREER ONBOARDING STEP 3 - RESUME GOAL */}
      {currentView === 'onboarding-goal' && (
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Step 3 of 4</span>
            <h2 className="text-3xl font-extrabold text-slate-100">Select Your Resume Goal</h2>
            <p className="text-sm text-slate-400">Tailor your resume for general search or a specific target job posting.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['General Job Search', 'Specific Job Application', 'Career Change', 'Internship Application', 'Executive Promotion'].map(goal => (
              <button 
                key={goal}
                onClick={() => {
                  setResumeGoal(goal);
                  setCurrentView('onboarding-method');
                }}
                className={`p-4 rounded-xl border text-sm font-semibold transition ${
                  resumeGoal === goal 
                    ? 'bg-sky-600 border-sky-500 text-white shadow-lg' 
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}>
                {goal}
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setCurrentView('onboarding-level')} className="px-6 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-sm font-semibold">Back</button>
            <button onClick={() => setCurrentView('onboarding-method')} className="px-8 py-2.5 bg-sky-600 text-white font-bold rounded-xl text-sm flex items-center gap-2">
              Next: Input Method <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* VIEW 5: CAREER ONBOARDING STEP 4 - INPUT METHOD (MANUAL / AI CHAT / PASTE CV) */}
      {currentView === 'onboarding-method' && (
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Step 4 of 4</span>
            <h2 className="text-3xl font-extrabold text-slate-100">How Would You Like to Provide Info?</h2>
            <p className="text-sm text-slate-400">Choose between natural AI conversation, manual form entry, or pasting an existing CV.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              onClick={() => { setInputMethod('ai-chat'); setCurrentView('editor'); }}
              className={`p-6 rounded-2xl border cursor-pointer space-y-3 transition ${inputMethod === 'ai-chat' ? 'bg-sky-600/20 border-sky-500 ring-2 ring-sky-500/40' : 'bg-slate-900 border-slate-800'}`}>
              <MessageSquare className="w-8 h-8 text-sky-400" />
              <h3 className="font-bold text-slate-100 text-base">AI Chat Assistant</h3>
              <p className="text-xs text-slate-400">Talk to AI naturally. Tell us about your background and we build your resume.</p>
            </div>

            <div 
              onClick={() => { setInputMethod('manual'); setCurrentView('editor'); }}
              className={`p-6 rounded-2xl border cursor-pointer space-y-3 transition ${inputMethod === 'manual' ? 'bg-sky-600/20 border-sky-500 ring-2 ring-sky-500/40' : 'bg-slate-900 border-slate-800'}`}>
              <FileText className="w-8 h-8 text-emerald-400" />
              <h3 className="font-bold text-slate-100 text-base">Structured Manual Form</h3>
              <p className="text-xs text-slate-400">Fill in form fields directly using our expandable section editor.</p>
            </div>

            <div 
              onClick={() => { setInputMethod('paste-cv'); setCurrentView('editor'); }}
              className={`p-6 rounded-2xl border cursor-pointer space-y-3 transition ${inputMethod === 'paste-cv' ? 'bg-sky-600/20 border-sky-500 ring-2 ring-sky-500/40' : 'bg-slate-900 border-slate-800'}`}>
              <Upload className="w-8 h-8 text-indigo-400" />
              <h3 className="font-bold text-slate-100 text-base">Paste Existing CV</h3>
              <p className="text-xs text-slate-400">Paste your old resume text and AI will extract and structure it automatically.</p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 6: EXPANDABLE ACCORDION RESUME EDITOR & LIVE PREVIEW */}
      {currentView === 'editor' && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: EXPANDABLE ACCORDION BUILDER / AI CHAT */}
          <div className="lg:col-span-6 space-y-4 overflow-y-auto max-h-[calc(100vh-6rem)] pr-1 no-scrollbar">
            {/* OPTION B: AI CHAT CONVERSATION BAR */}
            {inputMethod === 'ai-chat' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> AI Conversational Extraction
                  </h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${aiUsageCount >= FREE_AI_LIMIT ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                    Free Edits: {aiUsageCount}/{FREE_AI_LIMIT}
                  </span>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-2 text-xs p-2 bg-slate-950 rounded-xl border border-slate-800 no-scrollbar">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`p-2.5 rounded-lg max-w-[90%] ${msg.sender === 'user' ? 'bg-sky-600 text-white ml-auto' : 'bg-slate-800 text-slate-200'}`}>
                      {msg.text}
                    </div>
                  ))}
                  {aiLoading && (
                    <div className="p-2.5 rounded-lg max-w-[90%] bg-slate-800/80 text-sky-400 italic text-xs animate-pulse flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" /> AI Recruiter is thinking and executing edits...
                    </div>
                  )}
                  <div ref={chatScrollRef} />
                </div>
                <form onSubmit={handleSendChatMessage} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="e.g. Update my summary, add Python to skills, or change template to Modern..." 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    disabled={aiLoading}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                  <button type="submit" disabled={aiLoading || aiUsageCount >= FREE_AI_LIMIT} className={`px-4 py-2 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition ${aiUsageCount >= FREE_AI_LIMIT ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-500'}`}>
                    {aiLoading ? 'Thinking...' : 'Send'}
                  </button>
                </form>
              </div>
            )}

            {/* ACCORDION 1: TEMPLATE & THEME SELECTOR */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
              <button onClick={() => toggleSection('template')} className="w-full p-4 bg-slate-900 flex items-center justify-between text-left border-b border-slate-800">
                <span className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-sky-400" /> 1. Templates & Color Swatches ({selectedTemplate.name})
                </span>
                {expandedSections.template ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {expandedSections.template && (
                <div className="p-4 space-y-3 bg-slate-950">
                  <div className="flex gap-2">
                    {['#0284c7', '#059669', '#7c3aed', '#dc2626', '#0f172a'].map(color => (
                      <button key={color} onClick={() => setThemeColor(color)} className={`w-7 h-7 rounded-full border-2 ${themeColor === color ? 'border-white scale-110' : 'border-transparent'}`} style={{ backgroundColor: color }} />
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {dbTemplates.map(tpl => (
                      <div key={tpl.id} onClick={() => setSelectedTemplate(tpl)} className={`p-2.5 rounded-lg border text-xs cursor-pointer flex justify-between items-center ${selectedTemplate.id === tpl.id ? 'bg-sky-600/20 border-sky-500 font-bold text-sky-300' : 'bg-slate-900 border-slate-800 text-slate-300'}`}>
                        <span>{tpl.name}</span>
                        {tpl.isPremium && <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-bold">PRO</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ACCORDION 2: PERSONAL CONTACTS & AI PHOTO ASSISTANT */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
              <button onClick={() => toggleSection('personal')} className="w-full p-4 bg-slate-900 flex items-center justify-between text-left border-b border-slate-800">
                <span className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-400" /> 2. Personal Contacts & AI Profile Photo Studio
                </span>
                {expandedSections.personal ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {expandedSections.personal && (
                <div className="p-4 space-y-4 bg-slate-950">
                  {/* AI PHOTO & HEADSHOT STUDIO WIDGET */}
                  <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> AI Photo & Headshot Assistant
                      </span>
                      <span className="text-[9px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-semibold">
                        Photo Enhancement Widget
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-indigo-500 overflow-hidden flex items-center justify-center text-slate-400 font-bold text-xs shrink-0 shadow">
                        {resumeData.personalInfo.photoUrl ? (
                          <img src={resumeData.personalInfo.photoUrl} alt="Candidate Headshot" className="w-full h-full object-cover" />
                        ) : (
                          <span>Photo</span>
                        )}
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <input 
                          type="text" 
                          placeholder="Paste photo URL or click upload..." 
                          value={resumeData.personalInfo.photoUrl || ''} 
                          onChange={(e) => setResumeData({...resumeData, personalInfo: {...resumeData.personalInfo, photoUrl: e.target.value}})}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200"
                        />
                        <div className="flex gap-2 text-[10px]">
                          <button onClick={() => setResumeData({...resumeData, personalInfo: {...resumeData.personalInfo, photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'}})} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-sky-400 font-semibold rounded">
                            Sample Executive Headshot
                          </button>
                          {resumeData.personalInfo.photoUrl && (
                            <button onClick={() => setResumeData({...resumeData, personalInfo: {...resumeData.personalInfo, photoUrl: ''}})} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-red-400 font-semibold rounded">
                              Remove Photo
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" value={resumeData.personalInfo.fullName} onChange={(e) => setResumeData({...resumeData, personalInfo: {...resumeData.personalInfo, fullName: e.target.value}})} className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200" placeholder="Full Name" />
                    <input type="text" value={resumeData.personalInfo.jobTitle} onChange={(e) => setResumeData({...resumeData, personalInfo: {...resumeData.personalInfo, jobTitle: e.target.value}})} className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200" placeholder="Job Title" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input type="text" value={resumeData.personalInfo.location || ''} onChange={(e) => setResumeData({...resumeData, personalInfo: {...resumeData.personalInfo, location: e.target.value}})} className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200" placeholder="Location (City, Country)" />
                    <input type="text" value={resumeData.personalInfo.email || ''} onChange={(e) => setResumeData({...resumeData, personalInfo: {...resumeData.personalInfo, email: e.target.value}})} className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200" placeholder="Email Address" />
                    <input type="text" value={resumeData.personalInfo.phone || ''} onChange={(e) => setResumeData({...resumeData, personalInfo: {...resumeData.personalInfo, phone: e.target.value}})} className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200" placeholder="Phone Number" />
                  </div>
                  <textarea rows={3} value={resumeData.summary} onChange={(e) => setResumeData({...resumeData, summary: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded p-2.5 text-xs text-slate-200" placeholder="Executive Summary..." />
                </div>
              )}
            </div>

            {/* ACCORDION 3: SKILL CATEGORIES */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
              <button onClick={() => toggleSection('skills')} className="w-full p-4 bg-slate-900 flex items-center justify-between text-left border-b border-slate-800">
                <span className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-400" /> 3. Skill Categories (Customizable)
                </span>
                {expandedSections.skills ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {expandedSections.skills && (
                <div className="p-4 space-y-3 bg-slate-950">
                  {(resumeData.skillCategories || []).map(sc => (
                    <div key={sc.id} className="bg-slate-900 border border-slate-800 p-3 rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <input type="text" value={sc.categoryName} onChange={(e) => setResumeData({...resumeData, skillCategories: resumeData.skillCategories.map(s => s.id === sc.id ? {...s, categoryName: e.target.value} : s)})} className="bg-slate-950 text-sky-400 font-bold text-xs rounded px-2 py-1 border border-slate-800 w-2/3" placeholder="Category Name (e.g. Languages)" />
                        {resumeData.skillCategories.length > 1 && (
                          <button onClick={() => setResumeData({...resumeData, skillCategories: resumeData.skillCategories.filter(s => s.id !== sc.id)})} className="text-red-400 text-xs hover:text-red-300">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <textarea rows={2} value={sc.items} onChange={(e) => setResumeData({...resumeData, skillCategories: resumeData.skillCategories.map(s => s.id === sc.id ? {...s, items: e.target.value} : s)})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200" placeholder="Comma-separated items (e.g. Java, Python, SQL)..." />
                    </div>
                  ))}
                  <button onClick={() => setResumeData({...resumeData, skillCategories: [...(resumeData.skillCategories || []), { id: Date.now(), categoryName: 'Databases & Tools', items: 'PostgreSQL, Docker, Git, CI/CD' }]})} className="w-full py-2 bg-slate-900 border border-dashed border-indigo-500/50 text-indigo-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-indigo-950/30">
                    <Plus className="w-3.5 h-3.5" /> Add New Skill Category
                  </button>
                </div>
              )}
            </div>

            {/* ACCORDION 4: TECHNICAL SOFTWARE & ENGINEERING PROJECTS */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
              <button onClick={() => toggleSection('projects')} className="w-full p-4 bg-slate-900 flex items-center justify-between text-left border-b border-slate-800">
                <span className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-400" /> 4. Technical Projects (GitHub & Live URLs)
                </span>
                {expandedSections.projects ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {expandedSections.projects && (
                <div className="p-4 space-y-4 bg-slate-950">
                  {(resumeData.projects || []).map(prj => (
                    <div key={prj.id} className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <input type="text" value={prj.title} onChange={(e) => setResumeData({...resumeData, projects: resumeData.projects.map(p => p.id === prj.id ? {...p, title: e.target.value} : p)})} className="bg-slate-950 text-sky-400 font-bold text-xs rounded px-2 py-1 border border-slate-800 w-2/3" placeholder="Project Title" />
                        <button onClick={() => setResumeData({...resumeData, projects: resumeData.projects.filter(p => p.id !== prj.id)})} className="text-red-400 text-xs hover:text-red-300">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input type="text" value={prj.architecture || ''} onChange={(e) => setResumeData({...resumeData, projects: resumeData.projects.map(p => p.id === prj.id ? {...p, architecture: e.target.value} : p)})} className="bg-slate-950 text-slate-300 text-xs rounded px-2 py-1 border border-slate-800 w-full" placeholder="Tech Stack (e.g. Java, Spring Boot, Postgres)" />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" value={prj.github || ''} onChange={(e) => setResumeData({...resumeData, projects: resumeData.projects.map(p => p.id === prj.id ? {...p, github: e.target.value} : p)})} className="bg-slate-950 text-slate-300 text-xs rounded px-2 py-1 border border-slate-800" placeholder="GitHub URL (github.com/...)" />
                        <input type="text" value={prj.liveUrl || ''} onChange={(e) => setResumeData({...resumeData, projects: resumeData.projects.map(p => p.id === prj.id ? {...p, liveUrl: e.target.value} : p)})} className="bg-slate-950 text-slate-300 text-xs rounded px-2 py-1 border border-slate-800" placeholder="Live Demo URL (demo.com)" />
                      </div>
                      <textarea rows={2} value={(prj.bullets || []).join('\n')} onChange={(e) => setResumeData({...resumeData, projects: resumeData.projects.map(p => p.id === prj.id ? {...p, bullets: e.target.value.split('\n')} : p)})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200" placeholder="Bullet points (one per line)..." />
                    </div>
                  ))}
                  <button onClick={() => setResumeData({...resumeData, projects: [...(resumeData.projects || []), { id: Date.now(), title: 'New Technical Project', architecture: 'React, Node.js, PostgreSQL', github: '', liveUrl: '', bullets: ['Implemented scalable feature with high performance.'] }]})} className="w-full py-2 bg-slate-900 border border-dashed border-sky-500/50 text-sky-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-sky-950/30">
                    <Plus className="w-3.5 h-3.5" /> Add New Technical Project
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: REAL-TIME A4 LIVE DOCUMENT PREVIEW */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-3">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Eye className="w-4 h-4 text-sky-400" /> Live A4 Document Preview
              </span>
              <button onClick={handleDownloadAttempt} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow">
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>

            {/* Rendered PDF Document */}
            <div className="bg-white text-slate-900 rounded-2xl p-8 shadow-2xl relative min-h-[750px] border border-slate-300 font-sans leading-relaxed flex-1">
              {selectedTemplate.isPremium && (!user || user.tier === 'FREE') && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm rounded-2xl z-20 flex flex-col items-center justify-center p-6 text-center text-white">
                  <Lock className="w-12 h-12 text-amber-400 mb-3" />
                  <h3 className="text-2xl font-bold">Premium Template Locked</h3>
                  <p className="text-sm text-slate-300 max-w-md mt-1 mb-6">
                    {!user ? 'Sign in to unlock this template and export your CV.' : 'Upgrade to PRO via Paystack (₦5,000) to export.'}
                  </p>
                  {!user ? (
                    <button onClick={() => setAuthModalOpen(true)} className="px-6 py-3 bg-sky-600 text-white font-bold rounded-xl shadow">Sign In / Register</button>
                  ) : (
                    <button onClick={handlePaystackCheckout} className="px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg flex items-center gap-2">
                      <CreditCard className="w-5 h-5" /> Pay with Paystack
                    </button>
                  )}
                </div>
              )}

              {/* Header with optional AI Photo Headshot Banner */}
              {resumeData.personalInfo.photoUrl ? (
                <div className="bg-amber-200 text-slate-900 p-5 -mx-8 -mt-8 mb-5 flex items-center justify-between border-b-2 border-amber-300">
                  <div className="flex items-center gap-4">
                    <img src={resumeData.personalInfo.photoUrl} alt="Profile Headshot" className="w-16 h-16 rounded-xl object-cover border-2 border-slate-900 shadow-md" />
                    <div>
                      <h1 className="text-2xl font-black text-slate-900 tracking-tight">{resumeData.personalInfo.fullName}</h1>
                      <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">{resumeData.personalInfo.jobTitle}</p>
                      <p className="text-[10px] text-slate-700 mt-1">{resumeData.personalInfo.location} • {resumeData.personalInfo.phone} • {resumeData.personalInfo.email}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="pb-4 mb-4" style={{ borderBottom: `3px solid ${themeColor}` }}>
                  <h1 className="text-2xl font-extrabold" style={{ color: themeColor }}>{resumeData.personalInfo.fullName}</h1>
                  <p className="text-sm font-bold text-slate-700 mt-0.5">{resumeData.personalInfo.jobTitle}</p>
                  <p className="text-xs text-slate-500 mt-1">{resumeData.personalInfo.location} • {resumeData.personalInfo.email} • {resumeData.personalInfo.phone}</p>
                </div>
              )}

              {/* Intro Summary */}
              <div className="mb-4">
                <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-1.5" style={{ color: themeColor }}>Executive Summary</h2>
                <p className="text-xs text-slate-700 leading-relaxed">{resumeData.summary}</p>
              </div>

              {/* Skill Categories */}
              <div className="mb-4">
                <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color: themeColor }}>Core Professional Skills</h2>
                <ul className="list-disc list-inside text-xs text-slate-800 space-y-1">
                  {resumeData.skillCategories.map(sc => (
                    <li key={sc.id}><strong className="text-slate-900">{sc.categoryName}:</strong> {sc.items}</li>
                  ))}
                </ul>
              </div>

              {/* Experience */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color: themeColor }}>Professional Work Experience</h2>
                <div className="space-y-3">
                  {resumeData.experience.map(exp => (
                    <div key={exp.id}>
                      <div className="flex justify-between text-xs font-bold text-slate-900">
                        <span>{exp.title} — <span className="font-semibold italic text-slate-700">{exp.company}</span></span>
                        <span className="font-normal text-slate-500">({exp.startMonth} {exp.startYear} – {exp.endMonth} {exp.endYear})</span>
                      </div>
                      <ul className="list-disc list-inside text-xs text-slate-700 mt-1 space-y-1">
                        {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Projects */}
              {resumeData.projects && resumeData.projects.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color: themeColor }}>Technical Software & Engineering Projects</h2>
                  <div className="space-y-3">
                    {resumeData.projects.map(prj => (
                      <div key={prj.id}>
                        <div className="flex justify-between items-baseline text-xs font-bold text-slate-900">
                          <span>{prj.title} {prj.architecture && <span className="font-semibold text-slate-600">({prj.architecture})</span>}</span>
                          <div className="flex gap-2 text-[11px] text-slate-600 font-semibold">
                            {prj.github && <span className="underline">GitHub: {prj.github}</span>}
                            {prj.liveUrl && <span className="underline">Live: {prj.liveUrl}</span>}
                            {!prj.github && !prj.liveUrl && prj.link && <span>{prj.link}</span>}
                          </div>
                        </div>
                        {prj.bullets && prj.bullets.length > 0 ? (
                          <ul className="list-disc list-inside text-xs text-slate-700 mt-1 space-y-1">
                            {prj.bullets.map((b, i) => <li key={i}>{b}</li>)}
                          </ul>
                        ) : prj.architecture ? (
                          <p className="text-xs text-slate-700 mt-0.5">{prj.architecture}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* JOHN DOE FULL MODAL TEMPLATE PREVIEW */}
      {previewModalTemplate && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 space-y-6 relative max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-100">{previewModalTemplate.name}</h3>
                <p className="text-xs text-slate-400">Category: {previewModalTemplate.category}</p>
              </div>
              <button onClick={() => setPreviewModalTemplate(null)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            {/* FULL JOHN DOE PREVIEW DOCUMENT AS A REAL EXPORTED PDF SHEET */}
            <div className="bg-slate-950 p-4 rounded-xl overflow-x-auto">
              <PDFStyleDocumentRenderer 
                templateContent={previewModalTemplate.content} 
                data={JOHN_DOE_SAMPLE} 
                accentColor="#0f172a" 
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setPreviewModalTemplate(null)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold">Close Preview</button>
              <button 
                onClick={() => {
                  setSelectedTemplate(previewModalTemplate);
                  setPreviewModalTemplate(null);
                  setCurrentView('onboarding-field');
                }} 
                className="px-6 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs shadow">
                Use This Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGGED IN USER SUBSCRIPTION PLANS PRICING MODAL */}
      {plansModalOpen && user && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 space-y-6 relative shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-sky-400" /> Choose Your Subscription Plan
                </h3>
                <p className="text-xs text-slate-400 mt-1">Upgrade your tier to unlock higher AI generation quotas and premium templates.</p>
              </div>
              <button onClick={() => setPlansModalOpen(false)} className="text-slate-400 hover:text-white text-lg">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(systemPlans.length > 0 ? systemPlans : [
                { id: 1, name: 'Free Starter', priceMonthly: 0, currency: systemCurrency, aiCreditsLimit: 10, resumeLimit: 3, entitlementsJson: '["10 AI Generations", "3 PDF Exports", "Standard Templates"]' },
                { id: 2, name: 'Pro Professional', priceMonthly: 5000, currency: systemCurrency, aiCreditsLimit: 500, resumeLimit: 50, entitlementsJson: '["500 AI Generations", "50 PDF Exports", "All Premium Templates", "Priority Support"]' },
                { id: 3, name: 'Enterprise Unlimited', priceMonthly: 15000, currency: systemCurrency, aiCreditsLimit: 5000, resumeLimit: 999, entitlementsJson: '["5000 AI Generations", "Unlimited PDF Exports", "Custom Branding", "Dedicated AI Architect"]' }
              ]).map(p => {
                const feats = typeof p.entitlementsJson === 'string' ? JSON.parse(p.entitlementsJson || '[]') : (p.features || []);
                const isCurrent = user.tier === p.code || (p.priceMonthly === 0 && user.tier === 'FREE');
                const symbol = (p.currency || systemCurrency) === 'NGN' ? '₦' : (p.currency || systemCurrency) === 'GHS' ? '₵' : (p.currency || systemCurrency) === 'KES' ? 'KSh ' : '$';

                return (
                  <div key={p.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between hover:border-sky-500/50 transition">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-slate-100 text-sm">{p.name}</h4>
                        {isCurrent && <span className="text-[9px] font-bold px-2 py-0.5 bg-sky-500/10 text-sky-400 border border-sky-500/30 rounded-full">ACTIVE</span>}
                      </div>

                      <div className="text-xl font-black text-emerald-400 font-mono">
                        {p.priceMonthly === 0 ? 'FREE' : `${symbol}${Number(p.priceMonthly).toLocaleString()}/mo`}
                      </div>

                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono space-y-1">
                        <div className="flex justify-between text-slate-300">
                          <span>AI Credits:</span>
                          <span className="text-sky-400 font-bold">{p.aiCreditsLimit || p.aiCredits} / mo</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Downloads:</span>
                          <span className="text-indigo-400 font-bold">{p.resumeLimit || p.exportsPerMonth} Exports</span>
                        </div>
                      </div>

                      <ul className="text-xs text-slate-300 space-y-1">
                        {feats.map((f, i) => (
                          <li key={i} className="flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button 
                      disabled={isCurrent}
                      onClick={() => {
                        handlePaystackCheckout();
                        setPlansModalOpen(false);
                      }}
                      className={`w-full py-2 rounded-lg text-xs font-bold transition ${isCurrent ? 'bg-slate-800 text-slate-500 cursor-default' : 'bg-sky-600 hover:bg-sky-500 text-white shadow'}`}>
                      {isCurrent ? 'Current Tier' : 'Subscribe Now'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
