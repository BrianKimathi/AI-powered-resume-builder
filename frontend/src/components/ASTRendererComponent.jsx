import React from 'react';

// HELPER: RESOLVE TOKEN OR HEX VALUE (e.g. "tokens.colors.primary" -> "#0f172a")
function resolveValue(val, tokens) {
  if (!val) return undefined;
  if (typeof val === 'string' && val.startsWith('tokens.')) {
    const parts = val.replace('tokens.', '').split('.');
    let curr = tokens;
    for (const p of parts) {
      if (curr && curr[p] !== undefined) curr = curr[p];
      else return val;
    }
    return curr;
  }
  return val;
}

// SAMPLE CANDIDATE DATA FOR AST RESOLUTION
const SAMPLE_CANDIDATE = {
  fullName: 'John Doe',
  jobTitle: 'Senior Human Resources & Operations Director',
  location: 'San Francisco, CA',
  email: 'john.doe@example.com',
  phone: '+1 (555) 019-2834',
  summary: 'Strategic HR & Operations Executive with 8+ years leading talent acquisition, Workday HRIS migrations, labor compliance, and employee retention across global teams.',
  skills: [
    { category: 'HR Strategy & Operations', items: 'Talent Acquisition, Performance Management, Onboarding, DEI' },
    { category: 'Systems & Compliance', items: 'Workday HRIS, BambooHR, Labor Law Compliance, Payroll' }
  ],
  experience: [
    {
      title: 'Director of People & Culture',
      company: 'Global Enterprises Inc.',
      dates: 'Jan 2021 – Present',
      bullets: [
        'Spearheaded recruitment strategy across 5 regional hubs, reducing time-to-hire by 32%.',
        'Managed $4.2M departmental budget and implemented Workday HRIS with 99.8% data accuracy.'
      ]
    },
    {
      title: 'Senior Talent Acquisition Specialist',
      company: 'Summit Business Solutions',
      dates: 'Mar 2018 – Dec 2020',
      bullets: [
        'Coordinated recruitment pipelines screening 400+ candidates monthly across technology and ops.',
        'Overhauled employee onboarding framework, boosting 90-day retention by 24%.'
      ]
    }
  ],
  education: 'B.S. in Industrial & Labor Relations — Cornell University (Graduated)'
};

export default function ASTRendererComponent({ ast, data = SAMPLE_CANDIDATE }) {
  if (!ast || !ast.rootContainer) {
    return <div className="p-4 text-xs text-red-400">Invalid Template AST</div>;
  }

  const tokens = ast.themeTokens || {};
  const primaryColor = resolveValue('tokens.colors.primary', tokens) || '#0f172a';
  const secondaryColor = resolveValue('tokens.colors.secondary', tokens) || '#0284c7';
  const textPrimaryColor = resolveValue('tokens.colors.textPrimary', tokens) || '#1e293b';
  const backgroundColor = resolveValue('tokens.colors.background', tokens) || '#ffffff';

  // RECURSIVE NODE RENDERER
  const renderNode = (node) => {
    if (!node) return null;

    const layout = node.layoutProps || {};
    const style = node.styleProps || {};
    const pagination = node.paginationProps || {};

    const containerStyle = {
      display: layout.display || 'block',
      flexDirection: layout.flexDirection,
      gridTemplateColumns: layout.gridColumns,
      gap: layout.gap,
      alignItems: layout.alignItems,
      justifyContent: layout.justifyContent,
      color: resolveValue(style.color, tokens) || textPrimaryColor,
      backgroundColor: resolveValue(style.backgroundColor, tokens),
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      borderBottom: resolveValue(style.borderBottom, tokens),
      padding: style.padding,
      margin: style.margin,
      pageBreakInside: pagination.allowPageBreakInside ? 'auto' : 'avoid',
      pageBreakAfter: pagination.keepWithNext ? 'avoid' : 'auto'
    };

    // 1. Container Node
    if (node.type === 'Container') {
      return (
        <div key={node.id} id={node.id} style={containerStyle} className="relative">
          {node.children && node.children.map(renderNode)}
        </div>
      );
    }

    // 2. Candidate Header Component
    if (node.type === 'HeaderComponent') {
      return (
        <div key={node.id} id={node.id} style={containerStyle} className="border-b-2 pb-3 mb-2" style={{ borderColor: secondaryColor }}>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: primaryColor }}>
            {data.fullName || 'John Doe'}
          </h1>
          <p className="text-xs font-bold mt-0.5" style={{ color: textPrimaryColor }}>
            {data.jobTitle || 'Senior HR & Operations Director'}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">
            {data.location} • {data.email} • {data.phone}
          </p>
        </div>
      );
    }

    // 3. Executive Summary Component
    if (node.type === 'SummaryComponent') {
      return (
        <div key={node.id} id={node.id} style={containerStyle} className="my-2">
          <h2 className="text-[12px] font-bold uppercase tracking-wider border-b pb-1 mb-1.5" style={{ color: primaryColor, borderColor: '#cbd5e1' }}>
            Executive Summary
          </h2>
          <p className="text-[11px] leading-relaxed text-slate-800">
            {data.summary}
          </p>
        </div>
      );
    }

    // 4. Skills Component
    if (node.type === 'SkillsComponent') {
      return (
        <div key={node.id} id={node.id} style={containerStyle} className="my-2">
          <h2 className="text-[12px] font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color: primaryColor, borderColor: '#cbd5e1' }}>
            Core Competencies & Tools
          </h2>
          <div className="space-y-1.5">
            {(data.skills || []).map((s, idx) => (
              <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-800">
                <span className="text-slate-400 text-[9px] mt-0.5">▪</span>
                <span><strong className="text-slate-900">{s.category}:</strong> {s.items}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 5. Work Experience List
    if (node.type === 'ExperienceList') {
      return (
        <div key={node.id} id={node.id} style={containerStyle} className="my-2">
          <h2 className="text-[12px] font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color: primaryColor, borderColor: '#cbd5e1' }}>
            Professional Work Experience
          </h2>
          <div className="space-y-3">
            {(data.experience || []).map((exp, idx) => (
              <div key={idx} className="space-y-1 text-[11px] page-break-inside-avoid">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{exp.title} — <span className="font-normal italic text-slate-700">{exp.company}</span></span>
                  <span className="font-normal text-slate-500">{exp.dates}</span>
                </div>
                <div className="space-y-1">
                  {(exp.bullets || []).map((b, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2 ml-2 text-slate-800 leading-snug">
                      <span className="text-slate-400 text-[9px] mt-0.5">▪</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 6. Generic Text Component
    return (
      <div key={node.id} id={node.id} style={containerStyle}>
        {node.content || ''}
      </div>
    );
  };

  return (
    <div 
      className="bg-white text-slate-900 w-full max-w-[210mm] min-h-[297mm] mx-auto p-[14mm] shadow-2xl border border-slate-300 font-sans leading-normal text-[11px] space-y-2 select-text relative text-left"
      style={{ backgroundColor }}>
      <div className="absolute top-3 right-5 text-[8px] font-mono text-slate-400 uppercase tracking-widest print:hidden">
        Canonical AST PDF Flow Engine v{ast.version || 1}
      </div>
      {renderNode(ast.rootContainer)}
    </div>
  );
}
