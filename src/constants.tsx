import { CheckCircle, ArrowRight, Lock, Download, Mail, DollarSign, Target, TrendingUp, Zap } from 'lucide-react';

export const BENEFITS = [
  { icon: <Zap className="w-5 h-5 text-blue-400" />, text: "AI-generated cold DMs that get replies" },
  { icon: <Mail className="w-5 h-5 text-blue-400" />, text: "Email scripts that book meetings" },
  { icon: <Target className="w-5 h-5 text-blue-400" />, text: "Follow-up system that converts" },
  { icon: <TrendingUp className="w-5 h-5 text-blue-400" />, text: "Plug-and-play prompts for instant use" },
];

export const QUIZ_QUESTIONS = [
  {
    id: 'service',
    question: "What service do you offer?",
    options: ["SEO", "PPC / Meta Ads", "Social Media Management", "Content Marketing", "Web Design", "Other"]
  },
  {
    id: 'revenue',
    question: "Monthly revenue range?",
    options: ["$0 - $2k", "$2k - $10k", "$10k - $50k", "$50k+"]
  },
  {
    id: 'method',
    question: "Current client acquisition method?",
    options: ["Referrals", "Cold Outreach", "Paid Ads", "Content Marketing", "None / Struggling"]
  },
  {
    id: 'struggle',
    question: "Biggest struggle?",
    options: ["Getting replies", "Booking calls", "Closing deals", "Scaling systems", "Finding leads"]
  }
];

export const INSIGHTS = [
  "Your outreach volume is 40% below industry standard for your revenue goal.",
  "Your current follow-up sequence is missing 3 critical psychological triggers.",
  "AI personalization could increase your reply rate by up to 3.5x."
];

export const FULL_PLAN = {
  scripts: [
    { 
      title: "The AI Personalization Prompt (ChatGPT/Claude)", 
      content: "Act as a world-class sales development representative. I will provide a LinkedIn profile bio or a company 'About' page. Your task is to write a 2-sentence pattern-interrupt message that mentions a specific achievement or unique detail from their profile and connects it to how [Your Service] could solve [Specific Pain Point]. Keep it casual, no corporate jargon. Output only the message." 
    },
    { 
      title: "The 'Pattern Interrupt' Cold Email", 
      content: "Subject: Quick question about [Company Name]'s [Specific Strategy]\n\nHi [Name],\n\nI was just looking at [Company Name]'s recent [Project/Post] and noticed [Specific Detail]. Most agencies in [Niche] are still doing [Old Method], but I saw you're leaning into [New Trend].\n\nI built an AI model that specifically helps [Niche] agencies like yours automate [Pain Point] without losing that personal touch. I've got a quick 2-minute video showing exactly how we did this for [Competitor/Similar Client].\n\nWorth a look?\n\nBest,\n[Your Name]" 
    },
    { 
      title: "The 'Low-Friction' LinkedIn DM", 
      content: "Hey [Name], just saw your post about [Topic]—really refreshing take on [Specific Point]. I'm actually building an AI-powered lead list for [Service] providers right now. I have about 15 companies that fit your 'Dream Client' profile perfectly. Mind if I send the list over? No strings attached." 
    }
  ],
  followUp: "Day 1: Initial Outreach. Day 3: The 'Value Drop' (Send a relevant case study or free resource). Day 7: The 'Soft Bump' (Ask if they saw the previous message). Day 14: The 'Breakup' (Final check-in, moving them to the long-term nurture list).",
  roadmap: [
    {
      week: "Week 1: Infrastructure & Data Foundations",
      focus: "Setting up the 'Engine' for your AI Outreach.",
      days: [
        { day: "Day 1", task: "Define your ICP (Ideal Client Profile) with precision. Use AI to generate 5 sub-niches you haven't explored." },
        { day: "Day 2", task: "Set up your cold email infrastructure. Purchase 3 secondary domains and set up SPF/DKIM/DMARC records." },
        { day: "Day 3", task: "Begin domain 'warm-up' using tools like Instantly or Smartlead. Aim for 14 days of warming." },
        { day: "Day 4", task: "Scrape your first 1,000 leads using Apollo.io or LinkedIn Sales Navigator. Filter for 'Recent Hires' or 'Funding Rounds'." },
        { day: "Day 5", task: "Clean your lead list using NeverBounce or ZeroBounce to ensure <3% bounce rate." }
      ]
    },
    {
      week: "Week 2: AI Personalization & Content",
      focus: "Crafting messages that actually get read.",
      days: [
        { day: "Day 1", task: "Develop your 'Lead Magnet'. Create a 2-page PDF or a 3-minute Loom video solving one specific problem." },
        { day: "Day 2", task: "Set up your AI Personalization workflow. Use Clay or a custom Python script to pull LinkedIn data into ChatGPT." },
        { day: "Day 3", task: "Generate personalized 'First Lines' for your top 200 high-value prospects." },
        { day: "Day 4", task: "Draft your 4-step email sequence. Focus on: 1. Pattern Interrupt, 2. Value Drop, 3. Case Study, 4. Soft Breakup." },
        { day: "Day 5", task: "A/B test your subject lines. Create 3 variations focusing on curiosity vs. direct benefit." }
      ]
    },
    {
      week: "Week 3: Launch & Optimization",
      focus: "Going live and managing the inbox.",
      days: [
        { day: "Day 1", task: "Launch your first campaign to 50 leads/day. Monitor the 'Open Rate' closely (Target: >60%)." },
        { day: "Day 2", task: "Set up your 'Inbox Management' system. Use a CRM or a simple Trello board to track every reply." },
        { day: "Day 3", task: "Analyze initial replies. If getting 'Not Interested', pivot your hook. If 'Send more info', send your Lead Magnet." },
        { day: "Day 4", task: "Implement 'Multi-Channel' touches. Find your email non-responders on LinkedIn and send a soft DM." },
        { day: "Day 5", task: "Review Week 3 data. Double down on the sub-niche with the highest positive reply rate." }
      ]
    },
    {
      week: "Week 4: Scaling & Closing",
      focus: "Turning conversations into signed contracts.",
      days: [
        { day: "Day 1", task: "Scale volume to 100+ outreaches per day across all warmed-up domains." },
        { day: "Day 2", task: "Optimize your 'Booking Script'. When a lead shows interest, use a 'Two-Step' booking process to increase show-up rates." },
        { day: "Day 3", task: "Automate your follow-ups for leads who booked but didn't show. Use SMS and Email reminders." },
        { day: "Day 4", task: "Review your sales deck. Ensure it focuses on the 'Desired Future State' rather than just features." },
        { day: "Day 5", task: "Audit your entire funnel. Identify the bottleneck (Leads? Replies? Bookings?) and set targets for Month 2." }
      ]
    }
  ]
};
