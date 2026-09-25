import React from 'react';

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

export default function A4DocumentRenderer({ templateContent, data, accentColor = '#0f172a' }) {
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
}
