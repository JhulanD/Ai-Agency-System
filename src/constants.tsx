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
  actionPlan: "Week 1: Data Foundations. Set up your AI scraping tools (Apollo/Instantly) and define your 'Ideal Client Profile' (ICP). Week 2: Content & Personalization. Run your first 500 leads through the AI Personalization Prompt. Week 3: Launch & Iterate. Send your first 50 messages/day. Monitor reply sentiment and adjust the 'Pattern Interrupt' hook. Week 4: Scale. Automate the follow-up sequence and aim for 100+ outreaches per day."
};
