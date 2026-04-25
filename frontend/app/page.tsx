'use client';

import Link from 'next/link';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Mic, FileText, Target,
  Briefcase,
  CheckCircle2, Loader2,
  Sparkles, BookOpen, Lightbulb,
  Youtube, GraduationCap, Clock, ExternalLink, LogOut,
  UserCircle, ChevronRight, Upload, TrendingUp, Award,
  BarChart3, ArrowUpRight, Zap, X, Send, Bot, Minimize2,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* Lumi wave animation */
const style = document.createElement('style');
style.textContent = `
  @keyframes lumi-wave {
    0%, 100% { transform: rotate(0deg); }
    15% { transform: rotate(14deg); }
    30% { transform: rotate(-8deg); }
    40% { transform: rotate(14deg); }
    50% { transform: rotate(-4deg); }
    60% { transform: rotate(10deg); }
    70% { transform: rotate(0deg); }
  }
  .lumi-wave { animation: lumi-wave 2.5s ease-in-out infinite; transform-origin: 70% 80%; }
  @media (prefers-reduced-motion: reduce) { .lumi-wave { animation: none; } }
`;
document.head.appendChild(style);


const PLATFORM_CONFIG: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  YouTube:  { color: 'text-red-600',    bg: 'bg-red-50 border-red-100',       icon: <Youtube className="w-3.5 h-3.5" /> },
  Udemy:    { color: 'text-orange-600', bg: 'bg-orange-50 border-orange-100', icon: <GraduationCap className="w-3.5 h-3.5" /> },
  Coursera: { color: 'text-blue-600',   bg: 'bg-blue-50 border-blue-100',     icon: <GraduationCap className="w-3.5 h-3.5" /> },
  NPTEL:    { color: 'text-green-700',  bg: 'bg-green-50 border-green-100',   icon: <GraduationCap className="w-3.5 h-3.5" /> },
};

export default function CareerCommandCenter() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const roadmapRef   = useRef<HTMLDivElement>(null);

  const [authChecked, setAuthChecked]                 = useState(false);
  const [resumeFile, setResumeFile]                   = useState<File | null>(null);
  const [jdFile, setJdFile]                           = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing]                 = useState(false);
  const [analysisResult, setAnalysisResult]           = useState<any>(null);
  const [memories, setMemories]                       = useState<string[]>([]);
  const [roadmap, setRoadmap]                         = useState<any[]>([]);
  const [showRoadmap, setShowRoadmap]                 = useState(false);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [completedSteps, setCompletedSteps]           = useState<Record<number, boolean>>({});
  const [isReturningUser, setIsReturningUser]         = useState<boolean | null>(null);
  const [sessionUser, setSessionUser]                 = useState<{ name: string; id: string } | null>(null);

  const candidateName = sessionUser?.name || null;
  const userId = sessionUser?.id || null;

  useEffect(() => {
    const saved = sessionStorage.getItem('ai_advisor_user');
    if (!saved) {
      router.replace('/login');
      return;
    }
    try {
      const parsed = JSON.parse(saved);
      setSessionUser(parsed);
      setAuthChecked(true);
    } catch {
      router.replace('/login');
    }
  }, [router]);

  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:8000/api/hindsight?user_id=${encodeURIComponent(userId)}`)
      .then(res => res.json())
      .then(data => setMemories(data.memories || []))
      .catch(err => console.error("Failed to load memories", err));
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:8000/api/user/${encodeURIComponent(userId)}`)
      .then(res => res.json())
      .then(data => {
        if (data.exists && data.user) {
          const user = data.user;
          setIsReturningUser(!user.is_new);
          if (user.roadmap && user.roadmap.length > 0) {
            setRoadmap(user.roadmap);
            setShowRoadmap(true);
          }
          if (user.gaps && user.gaps.length > 0) {
            setAnalysisResult((prev: any) => prev || {
              skills_missing: user.gaps,
              reasoning: "Restored from your previous session.",
            });
          }
        } else {
          setIsReturningUser(false);
        }
      })
      .catch(() => setIsReturningUser(false));
  }, [userId]);

  const handleUpload = async () => {
    if (!resumeFile || !jdFile) return alert("Please upload both Resume and JD");
    if (!userId) return alert("Not logged in");
    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jd', jdFile);
    formData.append('user_id', userId);
    try {
      const response = await fetch('http://localhost:8000/api/analyze-gap', { method: 'POST', body: formData });
      const data = await response.json();
      setAnalysisResult(data);
      const memRes  = await fetch(`http://localhost:8000/api/hindsight?user_id=${encodeURIComponent(userId)}`);
      const memData = await memRes.json();
      setMemories(memData.memories || []);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fetchRoadmap = async () => {
    if (!userId) return;
    setIsGeneratingRoadmap(true);
    try {
      const res  = await fetch(`http://localhost:8000/api/generate-roadmap?user_id=${encodeURIComponent(userId)}`);
      const data = await res.json();
      setRoadmap(data.roadmap || []);
      setShowRoadmap(true);
    } catch (error) {
      console.error("Roadmap generation failed", error);
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  const toggleStep = (index: number) =>
    setCompletedSteps(prev => ({ ...prev, [index]: !prev[index] }));

  useEffect(() => {
    if (searchParams.get('showRoadmap') === 'true') {
      fetchRoadmap().then(() => {
        setTimeout(() => {
          roadmapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 400);
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isResourceObject = (r: any) => typeof r === 'object' && r !== null && 'platform' in r;

  const masteredCount = Object.values(completedSteps).filter(Boolean).length;
  const totalSteps = roadmap.length;

  if (!authChecked) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F0F2F5]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-400">Checking session...</p>
        </div>
      </div>
    );
  }

  return (
  <>
  <div className="flex h-screen bg-[#F0F2F5] text-gray-900 font-sans">

      {/* ═══════ DARK NAVY SIDEBAR ═══════ */}
      <aside className="w-[280px] bg-[#0B1628] flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-7 pt-8 pb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-[17px] font-extrabold text-white tracking-tight leading-none">AI Advisor</h1>
              <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-[0.2em] mt-0.5">Version 2.4 Live</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 space-y-1">
          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.25em] px-4 mb-3">Main Menu</p>
          <SidebarItem href="/"                    icon={<LayoutDashboard />} label="Dashboard"            active />
          <SidebarItem href="/mock-interview"      icon={<Mic />}            label="Mock Interview"       />
          <SidebarItem href="/resume-evolution"    icon={<FileText />}       label="Resume Evolution"     />
          <SidebarItem href="/skill-gap-analysis"  icon={<Target />}         label="Skill Gap Analysis"   />
          <SidebarItem href="/job-recommendations" icon={<Briefcase />}      label="Job Recommendations"  />
          
          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.25em] px-4 mb-3 mt-8">Tools</p>
          <SidebarItem href="/self_intro"          icon={<UserCircle />}      label="Self Introduction"    />
          <SidebarItem href="/higher-studies"      icon={<GraduationCap />}  label="Higher Studies"       />
        </nav>

        {/* User + Sign Out */}
        <div className="px-4 pb-6 space-y-2">
          {candidateName && (
            <div className="mx-2 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-extrabold">
                  {candidateName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-white truncate">{candidateName}</p>
                  <p className="text-[9px] text-slate-500 font-medium">Career Mode</p>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => {
              sessionStorage.removeItem('ai_advisor_user');
              router.replace('/login');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[12px] font-bold text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* ═══════ MAIN CONTENT ═══════ */}
      <main className="flex-1 overflow-y-auto">

        {/* ── TOP BAR ── */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-10 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-[22px] font-extrabold text-[#0B1628] tracking-tight">
              {isReturningUser === null
                ? 'Career Command Center'
                : isReturningUser && candidateName
                  ? `Welcome back, ${candidateName}`
                  : candidateName
                    ? `Welcome, ${candidateName}`
                    : 'Welcome!'}
            </h2>
            <p className="text-[12px] text-slate-400 font-medium mt-0.5">
              {isReturningUser
                ? 'Your previous progress has been restored.'
                : 'Upload your documents to generate a personalised skill roadmap.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-[11px] font-bold text-slate-500">Today</p>
              <p className="text-[13px] font-extrabold text-[#0B1628]">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div className="w-px h-10 bg-gray-200 mx-1 hidden sm:block" />
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-extrabold shadow-md shadow-indigo-200">
              {candidateName ? candidateName.charAt(0).toUpperCase() : '?'}
            </div>
          </div>
        </header>

        <div className="px-10 py-8 space-y-8">

          {/* ── STAT CARDS ROW ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard icon={<FileText className="w-5 h-5" />} label="Documents Uploaded" value={resumeFile && jdFile ? '2 / 2' : `${(resumeFile ? 1 : 0) + (jdFile ? 1 : 0)} / 2`} color="indigo" />
            <StatCard icon={<Target className="w-5 h-5" />} label="Skills to Learn" value={analysisResult ? analysisResult.skills_missing?.length || 0 : '—'} color="red" />
            <StatCard icon={<BookOpen className="w-5 h-5" />} label="Roadmap Steps" value={totalSteps || '—'} color="amber" />
            <StatCard icon={<Award className="w-5 h-5" />} label="Completed" value={totalSteps ? `${masteredCount} / ${totalSteps}` : '—'} color="emerald" progress={totalSteps ? (masteredCount / totalSteps) * 100 : 0} />
          </div>

          {/* ── HERO UPLOAD SECTION ── */}
          <section className="relative rounded-2xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0B1628] via-[#132042] to-[#1a1060]" />
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(99,102,241,0.4) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(139,92,246,0.3) 0%, transparent 50%)' }} />
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23fff\' fill-opacity=\'1\'%3E%3Cpath d=\'M0 0h1v40H0z\'/%3E%3Cpath d=\'M0 0h40v1H0z\'/%3E%3C/g%3E%3C/svg%3E")' }} />

            <div className="relative z-10 p-8 lg:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

                {/* Left: Upload Zone */}
                <div className="lg:col-span-3">
                <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase text-indigo-300 mb-5 tracking-wider backdrop-blur-sm border border-white/5">
                    <Sparkles className="w-3 h-3" /> Powered by Gemini 2.0 Flash
                  </div>
                  <h3 className="text-[28px] font-extrabold text-white mb-3 leading-tight tracking-tight">
                    Intelligent Skill-Gap<br />Analysis Engine
                  </h3>
                  <p className="text-[13px] text-slate-400 mb-8 leading-relaxed max-w-lg font-medium">
                    Don't guess what recruiters want. Our AI parses the Job Description and your Resume to create a verified bridge to your next role.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <UploadCard label="Resume" accept=".pdf" file={resumeFile} onFile={setResumeFile} />
                    <UploadCard label="Job Description" accept=".pdf" file={jdFile} onFile={setJdFile} />
                  </div>

                  <button
                    onClick={handleUpload}
                    disabled={isAnalyzing || !resumeFile || !jdFile}
                    className="bg-white text-[#0B1628] px-8 py-3.5 rounded-xl font-extrabold text-[13px] hover:shadow-xl hover:shadow-white/10 transition-all flex items-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? <Loader2 className="animate-spin w-5 h-5" /> : <Target className="w-5 h-5" />}
                    {isAnalyzing ? "Processing Documents..." : "Identify Technical Gaps"}
                    {!isAnalyzing && <ChevronRight className="w-4 h-4 ml-1 opacity-50" />}
                  </button>
                </div>

                {/* Right: Results Panel */}
                <div className="lg:col-span-2">
                  <AnimatePresence mode="wait">
                    {analysisResult ? (
                      <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-white/[0.07] backdrop-blur-xl border border-white/10 p-7 rounded-2xl">
                        <div className="flex items-center gap-2 mb-5">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          </div>
                          <h4 className="font-extrabold text-white text-[15px]">Gap Analysis</h4>
                        </div>
                        <p className="text-[12px] text-slate-400 mb-6 leading-relaxed italic border-l-2 border-indigo-500/50 pl-4 font-medium">
                          &ldquo;{analysisResult.reasoning}&rdquo;
                        </p>
                        <div className="flex flex-wrap gap-2 mb-7">
                          {analysisResult.skills_missing?.map((s: string, i: number) => (
                            <span key={i} className="bg-red-500/15 border border-red-500/20 text-[10px] px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider text-red-300">
                              {s}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={fetchRoadmap}
                          disabled={isGeneratingRoadmap}
                          className="w-full bg-gradient-to-r from-amber-400 to-orange-400 text-amber-950 py-3.5 rounded-xl font-extrabold text-[13px] flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-amber-400/20 transition-all active:scale-[0.98]"
                        >
                          {isGeneratingRoadmap ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                          {isGeneratingRoadmap ? "Calculating Path..." : "Build Personalized Roadmap"}
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="border-2 border-dashed border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center text-center min-h-[280px]">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                          <Upload className="w-7 h-7 text-slate-500" />
                        </div>
                        <p className="text-[13px] font-bold text-slate-400 mb-1">No analysis yet</p>
                        <p className="text-[11px] text-slate-600 font-medium">Upload both documents to see your skill gaps</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </section>

          {/* ── ROADMAP ── */}
          <AnimatePresence>
            {showRoadmap && (
              <motion.section ref={roadmapRef} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-[18px] font-extrabold text-[#0B1628] tracking-tight">AI-Adaptive Learning Path</h3>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">Follow these curated steps to reach job-readiness</p>
                    </div>
                  </div>
                  {totalSteps > 0 && (
                    <div className="hidden md:flex items-center gap-3 bg-white border border-gray-100 px-5 py-3 rounded-xl shadow-sm">
                      <BarChart3 className="w-4 h-4 text-indigo-500" />
                      <span className="text-[12px] font-bold text-slate-600">Progress:</span>
                      <span className="text-[13px] font-extrabold text-[#0B1628]">{masteredCount}/{totalSteps}</span>
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden ml-1">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(masteredCount / totalSteps) * 100}%` }} className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-5">
                  {roadmap.map((step, i) => (
                    <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.08 }}>

                      <div className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${completedSteps[i] ? 'border-emerald-200 shadow-sm shadow-emerald-50' : 'border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200'}`}>

                        {/* Step Header */}
                        <div className="px-7 py-5 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white text-[11px] font-extrabold shrink-0 transition-all duration-500 ${completedSteps[i] ? 'bg-emerald-500' : 'bg-gradient-to-br from-indigo-500 to-violet-600'}`}>
                              {completedSteps[i] ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-[0.15em] bg-indigo-50 px-2 py-0.5 rounded-md">{step.skill}</span>
                                <span className="text-[9px] font-bold text-amber-600 uppercase tracking-[0.15em] bg-amber-50 px-2 py-0.5 rounded-md">{step.level}</span>
                              </div>
                              <h4 className="text-[17px] font-extrabold text-[#0B1628] leading-snug">
                                {decodeURIComponent(step.topic.replace(/\+/g, ' '))}
                              </h4>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 md:gap-6">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                              <Clock className="w-3.5 h-3.5" /> {step.effort}
                            </div>
                            <label className="flex items-center gap-2.5 cursor-pointer group bg-slate-50 hover:bg-indigo-50 border border-gray-100 hover:border-indigo-200 px-4 py-2.5 rounded-xl transition-all">
                              <input type="checkbox" checked={completedSteps[i] || false} onChange={() => toggleStep(i)}
                                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                              <span className="text-[11px] font-bold text-slate-500 group-hover:text-indigo-600 transition-colors whitespace-nowrap">Completed</span>
                            </label>
                          </div>
                        </div>

                        {/* Step Body */}
                        <div className="px-7 py-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Syllabus */}
                          <div>
                            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                              <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> What you must learn
                            </h5>
                            <ul className="space-y-2.5">
                              {step.syllabus?.map((item: string, idx: number) => (
                                <li key={idx} className="text-[12px] text-slate-600 flex items-start gap-2.5 leading-relaxed font-medium">
                                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 shrink-0" /> {item}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Resources */}
                          <div>
                            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                              <Youtube className="w-3.5 h-3.5 text-red-500" /> Study Resources
                            </h5>
                            <div className="flex flex-col gap-2.5">
                              {step.resources?.map((res: any, idx: number) => {
                                if (isResourceObject(res)) {
                                  const cfg = PLATFORM_CONFIG[res.platform] || PLATFORM_CONFIG['Coursera'];
                                  return (
                                    <a key={idx} href={res.url} target="_blank" rel="noopener noreferrer"
                                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-[11px] font-bold shadow-sm hover:shadow-md transition-all group ${cfg.bg}`}>
                                      <span className={`flex items-center gap-1 shrink-0 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${cfg.color} ${cfg.bg}`}>
                                        {cfg.icon} {res.platform}
                                      </span>
                                      <span className="text-gray-700 leading-snug flex-1 line-clamp-1 font-semibold">{res.title}</span>
                                      <ExternalLink className={`w-3 h-3 shrink-0 opacity-30 group-hover:opacity-80 transition-opacity ${cfg.color}`} />
                                    </a>
                                  );
                                }
                                return (
                                  <div key={idx} className="bg-slate-50 border border-gray-100 px-4 py-2.5 rounded-xl text-[11px] font-semibold text-slate-600 flex items-center gap-2">
                                    <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> {res}
                                  </div>
                                );
                              })}
                            </div>

                            {/* AI Tip */}
                            <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100/60 mt-4">
                              <p className="text-[10px] text-indigo-700 font-semibold leading-relaxed">
                                💡 <span className="font-bold uppercase">AI Tip:</span> {step.reasoning}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Step Footer */}
                        <AnimatePresence>
                          {completedSteps[i] && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                              className="border-t border-emerald-100 bg-emerald-50/30 px-7 py-4 flex items-center justify-between">
                              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Module completed — Ready for verification
                              </span>
                              <Link
                                href={`/mock-interview?topic=${encodeURIComponent(decodeURIComponent(step.topic.replace(/\+/g, ' ')))}&syllabus=${encodeURIComponent((step.syllabus || []).join(','))}`}
                                className="bg-[#0B1628] text-white px-6 py-2.5 rounded-xl font-bold text-[12px] hover:bg-[#132042] transition-all flex items-center gap-2 shadow-md active:scale-95"
                              >
                                <Mic className="w-4 h-4" /> Start Verification Test
                                <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
                              </Link>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* ── BOTTOM GRID: Hindsight + Quick Actions ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Hindsight Feed */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-7 py-5 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center">
                    <TrendingUp className="w-4.5 h-4.5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-extrabold text-[#0B1628]">Hindsight Feed</h3>
                    <p className="text-[10px] text-slate-400 font-medium">AI insights from your sessions</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">{memories.length} entries</span>
              </div>
              <div className="p-5">
                {memories.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1">
                    {memories.map((mem, i) => (
                      <FeedItem key={i} desc={mem}
                        type={mem.toLowerCase().includes('weak') || mem.toLowerCase().includes('improve') || mem.toLowerCase().includes('gap') ? 'gap' : 'growth'}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-5 h-5 text-slate-300" />
                    </div>
                    <p className="text-[12px] text-slate-400 font-medium">No activity logged yet</p>
                    <p className="text-[10px] text-slate-300 font-medium mt-1">Upload documents to begin tracking</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-7 py-5 border-b border-gray-50">
                <h3 className="text-[15px] font-extrabold text-[#0B1628]">Quick Actions</h3>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Jump to any tool</p>
              </div>
              <div className="p-4 space-y-2">
                <QuickAction href="/mock-interview" icon={<Mic className="w-4 h-4" />} label="Mock Interview" desc="Practice with AI interviewer" color="indigo" />
                <QuickAction href="/resume-evolution" icon={<FileText className="w-4 h-4" />} label="Resume Builder" desc="AI-optimized resume" color="emerald" />
                <QuickAction href="/self_intro" icon={<UserCircle className="w-4 h-4" />} label="Self Intro Coach" desc="Craft your elevator pitch" color="amber" />
                <QuickAction href="/higher-studies" icon={<GraduationCap className="w-4 h-4" />} label="Higher Studies" desc="MS/MBA guidance" color="violet" />
                <QuickAction href="/job-recommendations" icon={<Briefcase className="w-4 h-4" />} label="Job Finder" desc="Matched opportunities" color="blue" />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>

    {/* ═══════ LUMI CHATBOT ═══════ */}
    <LumiChatbot userId={userId} candidateName={candidateName} />
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   COMPONENTS
   ══════════════════════════════════════════════════════════════════════════ */

function SidebarItem({ icon, label, href = "#", active = false }: any) {
  return (
    <Link href={href}
      className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-[12.5px] font-semibold transition-all duration-200
        ${active
          ? 'bg-white/10 text-white shadow-sm'
          : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'}`}>
      <span className={`transition-colors ${active ? 'text-indigo-400' : 'text-slate-600'}`}>{icon}</span>
      {label}
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />}
    </Link>
  );
}

function StatCard({ icon, label, value, color, progress }: any) {
  const colorMap: any = {
    indigo:  { iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600', barColor: 'from-indigo-500 to-indigo-400' },
    red:     { iconBg: 'bg-red-50',    iconColor: 'text-red-500',    barColor: 'from-red-500 to-red-400' },
    amber:   { iconBg: 'bg-amber-50',  iconColor: 'text-amber-600',  barColor: 'from-amber-500 to-amber-400' },
    emerald: { iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', barColor: 'from-emerald-500 to-emerald-400' },
  };
  const c = colorMap[color] || colorMap.indigo;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`w-11 h-11 rounded-xl ${c.iconBg} flex items-center justify-center shrink-0 ${c.iconColor}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-[20px] font-extrabold text-[#0B1628] leading-tight mt-0.5">{value}</p>
        {progress !== undefined && progress > 0 && (
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2">
            <div className={`h-full bg-gradient-to-r ${c.barColor} rounded-full transition-all duration-700`} style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    </div>
  );
}

function UploadCard({ label, accept, file, onFile }: any) {
  return (
    <div className={`bg-white/[0.07] backdrop-blur-sm border rounded-xl p-4 transition-all ${file ? 'border-emerald-500/30 bg-emerald-500/[0.05]' : 'border-white/10 hover:border-white/20'}`}>
      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">{label} (PDF)</label>
      <input type="file" accept={accept} onChange={(e) => onFile(e.target.files?.[0] || null)}
        className="block w-full text-[11px] text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-white/10 file:text-white file:font-bold file:text-[10px] file:cursor-pointer file:hover:bg-white/20 file:transition-colors cursor-pointer" />
      {file && (
        <p className="text-[10px] text-emerald-400 font-semibold mt-2 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> {file.name}
        </p>
      )}
    </div>
  );
}

function FeedItem({ desc, type }: any) {
  const colors: any = {
    gap:    { dot: 'bg-red-400',    border: 'border-l-red-400' },
    growth: { dot: 'bg-emerald-400', border: 'border-l-emerald-400' },
  };
  const c = colors[type] || colors.growth;
  return (
    <div className={`bg-slate-50/80 border-l-2 ${c.border} border border-gray-100 rounded-lg px-4 py-3 hover:bg-white hover:shadow-sm transition-all`}>
      <div className="flex items-start gap-2.5">
        <div className={`w-2 h-2 rounded-full ${c.dot} mt-1.5 shrink-0`} />
        <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function QuickAction({ href, icon, label, desc, color }: any) {
  const colorMap: any = {
    indigo:  'hover:bg-indigo-50 hover:border-indigo-100',
    emerald: 'hover:bg-emerald-50 hover:border-emerald-100',
    amber:   'hover:bg-amber-50 hover:border-amber-100',
    violet:  'hover:bg-violet-50 hover:border-violet-100',
    blue:    'hover:bg-blue-50 hover:border-blue-100',
  };
  const iconColorMap: any = {
    indigo: 'text-indigo-500', emerald: 'text-emerald-500', amber: 'text-amber-500',
    violet: 'text-violet-500', blue: 'text-blue-500',
  };
  return (
    <Link href={href}
      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border border-transparent transition-all duration-200 group ${colorMap[color] || colorMap.indigo}`}>
      <div className={`w-9 h-9 rounded-lg bg-slate-50 group-hover:bg-white flex items-center justify-center shrink-0 border border-gray-100 group-hover:shadow-sm transition-all ${iconColorMap[color]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[12px] font-bold text-[#0B1628] group-hover:text-indigo-600 transition-colors leading-none">{label}</p>
        <p className="text-[10px] text-slate-400 font-medium mt-1">{desc}</p>
      </div>
      <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 ml-auto shrink-0 transition-colors" />
    </Link>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   LUMI AVATAR — Cute Astronaut Robot Icon
   ══════════════════════════════════════════════════════════════════════════ */

   function LumiAvatar({ size = 32, className = "" }: { size?: number; className?: string }) {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
        {/* Body */}
        <rect x="25" y="48" width="50" height="42" rx="14" fill="#eef2ff" stroke="#93c5fd" strokeWidth="1.5" />
        {/* Chest glow */}
        <circle cx="50" cy="66" r="7" fill="#3b82f6" opacity="0.2" />
        <circle cx="50" cy="66" r="4" fill="#60a5fa" opacity="0.85" />
        {/* Head */}
        <rect x="27" y="10" width="46" height="40" rx="16" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" />
        {/* Visor inner */}
        <rect x="31" y="14" width="38" height="32" rx="12" fill="#0c1e36" opacity="0.55" />
        {/* Left crescent eye */}
        <path d="M40 26 Q44 20 48 26" fill="none" stroke="#7dd3fc" strokeWidth="3" strokeLinecap="round" filter="url(#lumi-glow)" />
        {/* Right crescent eye */}
        <path d="M52 26 Q56 20 60 26" fill="none" stroke="#7dd3fc" strokeWidth="3" strokeLinecap="round" filter="url(#lumi-glow)" />
        {/* Smile */}
        <path d="M42 36 Q50 43 58 36" fill="none" stroke="#7dd3fc" strokeWidth="2.5" strokeLinecap="round" filter="url(#lumi-glow)" />
        {/* Left ear */}
        <rect x="20" y="24" width="9" height="16" rx="4.5" fill="#eef2ff" stroke="#93c5fd" strokeWidth="1" />
        <circle cx="24.5" cy="22" r="3" fill="#60a5fa" />
        {/* Right ear */}
        <rect x="71" y="24" width="9" height="16" rx="4.5" fill="#eef2ff" stroke="#93c5fd" strokeWidth="1" />
        <circle cx="75.5" cy="22" r="3" fill="#60a5fa" />
        {/* Body accent lines */}
        <line x1="32" y1="57" x2="68" y2="57" stroke="#93c5fd" strokeWidth="0.8" opacity="0.35" />
        <line x1="32" y1="78" x2="68" y2="78" stroke="#93c5fd" strokeWidth="0.8" opacity="0.35" />
      </svg>
    );
  }
  
  /* ══════════════════════════════════════════════════════════════════════════
     LUMI — AI Career Chatbot
     ══════════════════════════════════════════════════════════════════════════ */

interface LumiMessage {
  role: 'user' | 'assistant';
  content: string;
}

function LumiChatbot({ userId, candidateName }: { userId: string | null; candidateName: string | null }) {
  const [open, setOpen]           = useState(false);
  const [messages, setMessages]   = useState<LumiMessage[]>([]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [pulse, setPulse]         = useState(true);
  const messagesEndRef             = useRef<HTMLDivElement>(null);
  const inputRef                   = useRef<HTMLInputElement>(null);

  // Stop the pulse badge after first open
  useEffect(() => { if (open) setPulse(false); }, [open]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  // Greeting on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      const greeting = candidateName
        ? `Hey ${candidateName}! 👋 I'm **Lumi**, your AI career buddy — made specially for freshers like you! 😎\n\nNo resume? No career plan? Placement anxiety? Relax, I've got you covered. From crafting your first resume to acing interviews — I'll guide you through it all.\n\nWhat would you like help with? 🚀`
        : `Hey there, freshie! 👋 I'm **Lumi** — your AI career buddy built just for you! 😎\n\nNo resume? No idea about career paths? Don't know where to start? That's exactly why I'm here! I'll help you build your resume, figure out what skills to learn, prep for interviews, and get placement-ready.\n\nAsk me anything — let's get started! 🚀`;
      setMessages([{ role: 'assistant', content: greeting }]);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages: LumiMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          user_id: userId || undefined,
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Sorry, I had trouble responding.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error — please try again.' }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, userId]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const quickPrompts = [
    '📄 Review my resume tips',
    '💰 What salary should I expect?',
    '🎯 How to crack FAANG?',
    '🎓 Should I do MS or MTech?',
  ];

  return (
    <>
      {/* Hidden SVG defs for Lumi glow effect */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="lumi-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* ── Floating Lumi Button ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {!open && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              className="bg-white border border-gray-200 text-[#0B1628] text-[11px] font-bold px-4 py-2 rounded-full shadow-lg shadow-black/10 whitespace-nowrap"
            >
              👋 Ask Lumi anything!
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setOpen(o => !o)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="relative w-[72px] h-[72px] rounded-[22px] bg-gradient-to-br from-blue-500 via-blue-600 to-sky-700 shadow-2xl shadow-blue-500/40 flex items-center justify-center"        >
          {/* Pulse ring */}
          {pulse && (
            <span className="absolute inset-0 rounded-2xl bg-indigo-500 animate-ping opacity-20" />
          )}
          {/* Notification dot */}
          {pulse && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-[8px] text-white font-bold">1</span>
            </span>
          )}
          <AnimatePresence mode="wait">
          {open ? (
              <motion.div key="close" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                <X className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div key="bot" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
              <div className="lumi-wave drop-shadow-[0_0_14px_rgba(96,165,250,0.8)]">
                <LumiAvatar size={46} />
              </div>
            </motion.div>

            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* ── Chat Window ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-6 right-6 z-50 w-[480px] max-h-[85vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl shadow-black/25 border border-white/20"
            style={{ background: 'linear-gradient(135deg, #0B1628 0%, #0f2548 50%, #0c3a6e 100%)' }}          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3 shrink-0"
              style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)' }}>
              {/* Lumi avatar */}
                            <div className="w-10 h-10 rounded-xl bg-[#0f1d35] flex items-center justify-center relative shadow-lg shrink-0 border border-blue-500/20">
                <LumiAvatar size={28} />
                {/* Online dot */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0B1628]" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-extrabold text-white leading-none">Lumi</p>
                <p className="text-[10px] text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-pulse" />
                  AI Career Companion · Online
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-[9px] font-bold text-indigo-300 bg-indigo-500/20 px-2 py-1 rounded-full border border-indigo-500/30">
                  Gemini 2.0
                </div>
                <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors">
                  <Minimize2 className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                      {msg.role === 'assistant' && (
                      <div className="shrink-0 mb-0.5">
                        <LumiAvatar size={22} />
                      </div>
                    )}
                    <div className={`max-w-[82%] px-4 py-3 rounded-2xl text-[12px] leading-relaxed font-medium ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-br-sm shadow-lg shadow-indigo-500/20'
                        : 'bg-white/[0.08] text-slate-200 rounded-bl-sm border border-white/10 backdrop-blur-sm'
                    }`}>
                      {/* Render bold markdown */}
                      {msg.content.split('\n').map((line, li) => (
                        <span key={li}>
                          {line.split(/(\*\*[^*]+\*\*)/).map((part, pi) =>
                            part.startsWith('**') && part.endsWith('**')
                              ? <strong key={pi} className="font-extrabold text-white">{part.slice(2, -2)}</strong>
                              : <span key={pi}>{part}</span>
                          )}
                          {li < msg.content.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              {loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2 justify-start">
                   <div className="shrink-0">
                   <LumiAvatar size={22} />
                   </div>
                  <div className="bg-white/[0.08] border border-white/10 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick prompts — show only when no conversation yet */}
            {messages.length <= 1 && !loading && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
                {quickPrompts.map((p, i) => (
                  <button key={i} onClick={() => { setInput(p.slice(2)); }}
                    className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 px-2.5 py-1.5 rounded-lg transition-colors">
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-4 border-t border-white/10 shrink-0" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="flex items-center gap-2 bg-white/[0.08] border border-white/10 rounded-2xl px-4 py-2.5 focus-within:border-indigo-500/50 focus-within:bg-white/[0.11] transition-all">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask Lumi anything..."
                  className="flex-1 bg-transparent text-[12px] text-white placeholder-slate-500 outline-none font-medium min-w-0"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 disabled:opacity-30 hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
              <p className="text-[9px] text-slate-600 text-center mt-2 font-medium">Lumi · Powered by Gemini 2.0 Flash</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Gemini-powered career chatbot interface module