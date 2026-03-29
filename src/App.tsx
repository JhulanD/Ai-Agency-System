import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle, 
  ArrowRight, 
  Lock, 
  Download, 
  Mail, 
  DollarSign, 
  Target, 
  TrendingUp, 
  Zap, 
  ChevronRight, 
  Star, 
  ShieldCheck, 
  Users, 
  BarChart3,
  ArrowLeft
} from 'lucide-react';
import { UserData, FunnelStep } from './types';
import { BENEFITS, QUIZ_QUESTIONS, INSIGHTS, FULL_PLAN } from './constants';
import { db } from './firebase';
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export default function App() {
  const [step, setStep] = useState<FunnelStep>('landing');
  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    email: '',
    service: '',
    revenue: '',
    method: '',
    struggle: '',
    score: 0
  });
  const [quizIndex, setQuizIndex] = useState(0);

  const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
    const errInfo = {
      error: error instanceof Error ? error.message : String(error),
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
  };

  // Helper for tracking events
  const trackEvent = (eventName: string, params?: object) => {
    // @ts-ignore
    if (window.gtag) {
      // @ts-ignore
      window.gtag('event', eventName, params);
    }
  };

  // Check for payment success on mount
  useEffect(() => {
    // Scroll to top on step change
    window.scrollTo(0, 0);
    trackEvent('PageView', { page_path: step });
  }, [step]);

  const resetToLanding = () => {
    setStep('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextStep = (nextStep: FunnelStep) => {
    setStep(nextStep);
  };

  const handleLeadCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userData.firstName && userData.email) {
      trackEvent('Lead', { email: userData.email });
      
      // 1. Save to Firestore
      try {
        const leadRef = doc(db, 'leads', userData.email.toLowerCase());
        await setDoc(leadRef, {
          firstName: userData.firstName,
          email: userData.email.toLowerCase(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `leads/${userData.email.toLowerCase()}`);
      }

      // 2. Call backend to send email
      try {
        const response = await fetch('/api/capture-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: userData.firstName,
            email: userData.email
          })
        });

        if (!response.ok) {
          console.error('Failed to capture lead');
        }
      } catch (error) {
        console.error('Error sending lead data:', error);
      }
      
      handleNextStep('quiz');
    }
  };

  const handleQuizAnswer = async (answer: string) => {
    const currentQuestion = QUIZ_QUESTIONS[quizIndex];
    const updatedUserData = { ...userData, [currentQuestion.id]: answer };
    setUserData(updatedUserData);
    
    if (quizIndex < QUIZ_QUESTIONS.length - 1) {
      setQuizIndex(quizIndex + 1);
    } else {
      // Calculate a random-ish score based on answers
      const score = Math.floor(Math.random() * 30) + 35; // 35-65 range
      const finalUserData = { ...updatedUserData, score };
      setUserData(finalUserData);
      trackEvent('QuizComplete', { score });

      // Update Firestore with full results
      try {
        const leadRef = doc(db, 'leads', userData.email.toLowerCase());
        await updateDoc(leadRef, {
          score: score,
          service: finalUserData.service,
          revenue: finalUserData.revenue,
          method: finalUserData.method,
          struggle: finalUserData.struggle,
          updatedAt: serverTimestamp()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `leads/${userData.email.toLowerCase()}`);
      }

      handleNextStep('results');
    }
  };

  const handlePayment = () => {
    trackEvent('AccessFreeRoadmap');
    handleNextStep('delivery');
  };

  const handleDownloadPDF = () => {
    trackEvent('DownloadPDF');
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30">
      {/* Navigation / Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div 
            onClick={resetToLanding}
            className="flex items-center gap-2 font-bold text-xl tracking-tighter cursor-pointer group"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <span>AI AGENCY <span className="text-blue-500">SYSTEM</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <a href="#features" onClick={() => setStep('landing')} className="hover:text-white transition-colors">Features</a>
            <a href="#results" onClick={() => setStep('landing')} className="hover:text-white transition-colors">Results</a>
          </div>
          <button 
            onClick={() => setStep('lead-capture')}
            className="text-sm font-semibold bg-white text-black px-4 py-2 rounded-full hover:bg-white/90 transition-all"
          >
            Get Started
          </button>
        </div>
      </header>

      <main className="pt-16">
        <AnimatePresence mode="wait">
          {step === 'landing' && (
            <>
              <motion.section 
                key="landing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="px-6 py-20 md:py-32 max-w-7xl mx-auto"
              >
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <div className="space-y-8">
                    <div className="inline-flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
                        <Star className="w-3 h-3 fill-current" />
                        Trusted by 500+ Agencies
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-widest">
                        Limited Time Free Blueprint
                      </div>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[75px]">
                      Get 5–10 <span className="text-blue-500">Qualified Clients</span> Every Month With This Limited Time Free AI Blueprint
                    </h1>
                    <p className="text-xl text-white/60 max-w-xl leading-relaxed">
                      Stop guessing your outreach. Use this proven AI system to generate leads, book calls, and close clients on autopilot.
                    </p>
                    
                    <div className="space-y-4">
                      {BENEFITS.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-blue-500" />
                          </div>
                          <span className="text-white/80 font-medium">{benefit.text}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <button 
                        onClick={() => handleNextStep('lead-capture')}
                        className="group relative flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                      >
                        Get Free Blueprint
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <div className="flex items-center gap-3 px-4 py-2">
                        <div className="flex -space-x-2">
                          {[1,2,3].map(i => (
                            <img key={i} src={`https://picsum.photos/seed/user${i}/100/100`} className="w-8 h-8 rounded-full border-2 border-black" referrerPolicy="no-referrer" />
                          ))}
                        </div>
                        <span className="text-sm text-white/40 font-medium">Join 500+ agency owners</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -inset-4 bg-blue-500/20 blur-3xl rounded-full opacity-50" />
                    <div className="relative bg-zinc-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                              <BarChart3 className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                              <div className="text-sm font-bold">Outreach Performance</div>
                              <div className="text-xs text-white/40">Real-time AI Analysis</div>
                            </div>
                          </div>
                          <div className="text-green-400 text-sm font-bold">+245%</div>
                        </div>
                        
                        <div className="h-48 flex items-end gap-2">
                          {[40, 65, 45, 90, 75, 100, 85].map((h, i) => (
                            <motion.div 
                              key={i}
                              initial={{ height: 0 }}
                              animate={{ height: `${h}%` }}
                              transition={{ delay: i * 0.1, duration: 1 }}
                              className="flex-1 bg-gradient-to-t from-blue-600/20 to-blue-500 rounded-t-sm"
                            />
                          ))}
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                          <div className="text-center">
                            <div className="text-xl font-bold">12k</div>
                            <div className="text-[10px] text-white/40 uppercase tracking-wider font-bold">Leads</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold">842</div>
                            <div className="text-[10px] text-white/40 uppercase tracking-wider font-bold">Replies</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold">48</div>
                            <div className="text-[10px] text-white/40 uppercase tracking-wider font-bold">Calls</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Features Section */}
              <section id="features" className="px-6 py-24 bg-zinc-900/30 border-y border-white/5">
                <div className="max-w-7xl mx-auto space-y-16">
                  <div className="text-center space-y-4">
                    <h2 className="text-4xl font-bold tracking-tight">Everything You Need to Scale</h2>
                    <p className="text-white/60 max-w-2xl mx-auto">Our AI system handles the heavy lifting so you can focus on closing deals.</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                      { title: "AI Personalization", desc: "Generate unique, high-converting messages for every lead in seconds.", icon: <Zap className="w-6 h-6" /> },
                      { title: "Smart Lead Scraping", desc: "Find your ideal clients across LinkedIn, Apollo, and more with precision.", icon: <Target className="w-6 h-6" /> },
                      { title: "Automated Follow-ups", desc: "Never let a lead go cold with our multi-channel follow-up sequences.", icon: <TrendingUp className="w-6 h-6" /> }
                    ].map((feature, i) => (
                      <div key={i} className="p-8 bg-zinc-900 border border-white/10 rounded-2xl space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500">
                          {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold">{feature.title}</h3>
                        <p className="text-white/60 leading-relaxed">{feature.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Results Section */}
              <section id="results" className="px-6 py-24 max-w-7xl mx-auto">
                <div className="text-center space-y-16">
                  <div className="space-y-4">
                    <h2 className="text-4xl font-bold tracking-tight">Real Results for Real Agencies</h2>
                    <p className="text-white/60">See how our partners are transforming their client acquisition.</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    {[
                      { name: "Alex Rivers", role: "Founder, ScaleUp Media", quote: "We went from 2 calls a week to 15+ using this exact AI outreach system. It's a game changer.", result: "+450% Meetings" },
                      { name: "Sarah Chen", role: "CEO, CreativeFlow", quote: "The personalization is so good that leads actually thank us for reaching out. Highly recommend.", result: "12 New Clients" }
                    ].map((testimonial, i) => (
                      <div key={i} className="p-10 bg-zinc-900/50 border border-white/10 rounded-3xl text-left space-y-6">
                        <div className="flex items-center gap-4">
                          <img src={`https://picsum.photos/seed/test${i}/100/100`} className="w-12 h-12 rounded-full" referrerPolicy="no-referrer" />
                          <div>
                            <div className="font-bold">{testimonial.name}</div>
                            <div className="text-sm text-white/40">{testimonial.role}</div>
                          </div>
                        </div>
                        <p className="text-lg italic text-white/80">"{testimonial.quote}"</p>
                        <div className="inline-block px-4 py-2 rounded-lg bg-green-500/10 text-green-400 font-bold text-sm">
                          {testimonial.result}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </>
          )}

          {step === 'lead-capture' && (
            <motion.section 
              key="lead-capture"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="min-h-[80vh] flex items-center justify-center px-6"
            >
              <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight">Unlock Your AI System</h2>
                  <p className="text-white/60">Enter your details to start the custom analysis.</p>
                </div>

                <form onSubmit={handleLeadCapture} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">First Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="John"
                      value={userData.firstName}
                      onChange={(e) => setUserData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Work Email</label>
                    <input 
                      required
                      type="email" 
                      placeholder="john@agency.com"
                      value={userData.email}
                      onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                  >
                    Unlock My System
                  </button>
                </form>

                <div className="flex items-center justify-center gap-4 text-xs text-white/40">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Privacy Guaranteed
                  </div>
                  <div className="flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Secure Access
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {step === 'quiz' && (
            <motion.section 
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="min-h-[80vh] flex items-center justify-center px-6"
            >
              <div className="w-full max-w-2xl space-y-12">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="text-sm font-bold text-blue-500 uppercase tracking-widest">Question {quizIndex + 1} of {QUIZ_QUESTIONS.length}</div>
                    <div className="text-xs text-white/40 font-medium">{Math.round(((quizIndex + 1) / QUIZ_QUESTIONS.length) * 100)}% Complete</div>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${((quizIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-8">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{QUIZ_QUESTIONS[quizIndex].question}</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {QUIZ_QUESTIONS[quizIndex].options.map((option, i) => (
                      <button 
                        key={i}
                        onClick={() => handleQuizAnswer(option)}
                        className="text-left p-6 bg-zinc-900/50 border border-white/10 rounded-2xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group active:scale-[0.98]"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-medium">{option}</span>
                          <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-blue-500 transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {step === 'results' && (
            <motion.section 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-6 py-20 max-w-4xl mx-auto space-y-12"
            >
              <div className="text-center space-y-6">
                <div className="inline-block p-8 rounded-full bg-blue-500/10 border-4 border-blue-500/20 relative">
                  <div className="text-6xl font-black text-blue-500">{userData.score}</div>
                  <div className="text-xs font-bold text-white/40 uppercase tracking-widest mt-1">Outreach Score</div>
                  <motion.div 
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-t-4 border-blue-500 rounded-full"
                  />
                </div>
                <div className="space-y-2">
                  <h2 className="text-4xl font-bold tracking-tight">Analysis Complete for {userData.firstName}</h2>
                  <p className="text-white/60 text-lg">Your client acquisition system is currently operating at <span className="text-white font-bold">{userData.score}% efficiency</span>.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {INSIGHTS.map((insight, i) => (
                  <div key={i} className="p-6 bg-zinc-900/50 border border-white/10 rounded-2xl space-y-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-sm text-white/80 leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>              <div className="relative mt-20">
                {/* Unblurred Content */}
                <div className="space-y-12">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Your Custom AI Outreach Plan</h3>
                    <div className="p-8 bg-zinc-900/50 border border-white/10 rounded-2xl space-y-4">
                      <div className="flex items-center gap-3 text-blue-500">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-bold">Personalized Roadmap Generated</span>
                      </div>
                      <p className="text-white/60">Based on your score of {userData.score}%, we've identified the exact gaps in your outreach and created a 30-day plan to fix them.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Exact Scripts & Prompts</h3>
                    <div className="p-8 bg-zinc-900/50 border border-white/10 rounded-2xl space-y-4">
                      <div className="flex items-center gap-3 text-blue-500">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-bold">AI Templates Ready</span>
                      </div>
                      <p className="text-white/60">Your custom script templates are ready for review. These are optimized for your specific service and target audience.</p>
                    </div>
                  </div>
                </div>

                {/* Call to Action Overlay (Not a paywall anymore) */}
                <div className="mt-12 flex items-center justify-center">
                  <div className="w-full max-w-lg bg-zinc-900 border border-blue-500/30 rounded-3xl p-10 shadow-2xl shadow-blue-600/20 text-center space-y-8">
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
                        Free Access
                      </div>
                      <h3 className="text-3xl font-bold tracking-tight">Access Your Full Roadmap</h3>
                      <p className="text-white/60">Get your personalized 30-day execution plan to land more meetings and close more deals using AI. Completely free for a limited time.</p>
                    </div>

                    <button 
                      onClick={handlePayment}
                      className="w-full group flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-bold text-xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                    >
                      Access My Roadmap
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="flex items-center justify-center gap-6 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2 text-xs text-white/40">
                        <ShieldCheck className="w-4 h-4" />
                        Instant Access
                      </div>
                      <div className="flex items-center gap-2 text-xs text-white/40">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        4.9/5 Rating
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {step === 'delivery' && (
            <motion.section 
              key="delivery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-6 py-20 max-w-5xl mx-auto space-y-16"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 no-print">
                <div className="space-y-2">
                  <div className="text-blue-500 font-bold uppercase tracking-widest text-xs">Success!</div>
                  <h2 className="text-4xl font-bold tracking-tight">Your AI Client Acquisition Plan</h2>
                  <p className="text-white/60">Welcome, {userData.firstName}. Your roadmap is ready below.</p>
                </div>
                <button 
                  onClick={handleDownloadPDF}
                  className="flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-white/90 transition-all"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
              </div>

              <div id="printable-roadmap" className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-3 space-y-8">
                  <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8 space-y-8 roadmap-card">
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold flex items-center gap-3">
                        <Mail className="w-6 h-6 text-blue-500" />
                        Proven Outreach Scripts
                      </h3>
                      <div className="space-y-4">
                        {FULL_PLAN.scripts.map((script, i) => (
                          <div key={i} className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-3 script-item">
                            <div className="text-sm font-bold text-blue-400 uppercase tracking-wider">{script.title}</div>
                            <p className="text-white/80 italic leading-relaxed">"{script.content}"</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6 pt-8 border-t border-white/5">
                      <h3 className="text-2xl font-bold flex items-center gap-3">
                        <Target className="w-6 h-6 text-blue-500" />
                        Follow-up Sequence
                      </h3>
                      <div className="p-6 bg-black/40 border border-white/5 rounded-2xl">
                        <p className="text-white/80 leading-relaxed">{FULL_PLAN.followUp}</p>
                      </div>
                    </div>

                    <div className="space-y-12 pt-8 border-t border-white/5">
                      <h3 className="text-2xl font-bold flex items-center gap-3">
                        <TrendingUp className="w-6 h-6 text-blue-500" />
                        4-Week Execution Roadmap
                      </h3>
                      <div className="space-y-8">
                        {FULL_PLAN.roadmap.map((week, i) => (
                          <div key={i} className="space-y-4">
                            <div className="flex flex-col gap-1">
                              <h4 className="text-xl font-bold text-white">{week.week}</h4>
                              <p className="text-sm text-blue-400 font-medium">{week.focus}</p>
                            </div>
                            <div className="grid sm:grid-cols-1 gap-3">
                              {week.days.map((day, j) => (
                                <div key={j} className="p-4 bg-black/40 border border-white/5 rounded-xl flex gap-4 items-start">
                                  <div className="flex-shrink-0 w-12 text-xs font-bold text-white/40 uppercase pt-1">{day.day}</div>
                                  <p className="text-sm text-white/80 leading-relaxed">{day.task}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div 
            onClick={resetToLanding}
            className="flex items-center gap-2 font-bold text-lg tracking-tighter opacity-50 cursor-pointer hover:opacity-100 transition-opacity"
          >
            <Zap className="w-5 h-5 fill-white" />
            <span>AI AGENCY SYSTEM</span>
          </div>
          <div className="flex gap-8 text-sm text-white/40">
            <div className="relative group cursor-help">
              <span className="hover:text-white transition-colors">Privacy Policy</span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 p-4 bg-zinc-900 border border-white/10 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-2xl z-50">
                <h5 className="font-bold text-white mb-2">Privacy Policy</h5>
                <p className="text-xs leading-relaxed">We value your privacy. Your lead data is used solely for generating your custom roadmap and providing relevant AI agency updates. We never sell your data to third parties.</p>
                <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-zinc-900 border-r border-b border-white/10 rotate-45"></div>
              </div>
            </div>
            <div className="relative group cursor-help">
              <span className="hover:text-white transition-colors">Terms of Service</span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 p-4 bg-zinc-900 border border-white/10 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-2xl z-50">
                <h5 className="font-bold text-white mb-2">Terms of Service</h5>
                <p className="text-xs leading-relaxed">By using this system, you agree to use the provided AI prompts and roadmaps ethically. Results vary based on implementation and market conditions.</p>
                <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-zinc-900 border-r border-b border-white/10 rotate-45"></div>
              </div>
            </div>
          </div>
          <div className="text-sm text-white/20">
            © 2026 AI Agency System. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
