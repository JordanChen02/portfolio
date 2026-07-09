import edgeboardDashboard from '../assets/edgeboard_dashboard.webp';
import edgeboardPerformance from '../assets/edgeboard_performance.webp';
import edgeboardCalendar from '../assets/edgeboard_calendar.png';
import edgeboardChecklist from '../assets/edgeboard_checklist.webp';
import edgeboardWeeklyReview from '../assets/edgeboard_weekly_review.webp';

import somaLogin from '../assets/soma_login.png';
import somaToday from '../assets/soma_today.png';
import somaWorkouts from '../assets/soma_workouts.png';
import somaCalendar from '../assets/soma_calendar.png';
import somaProgress from '../assets/soma_progress.png';
import somaMore from '../assets/soma_more.png';

import ohlc10am from '../assets/ohlc_10am_reversal.png';
import ohlcCloseVsWick from '../assets/ohlc_close_vs_wick.png';
import ohlcStairstep from '../assets/ohlc_stairstep_acceptance.png';
import ohlcStrategyDev from '../assets/ohlc_strategy_development.png';
import ohlcStrategyDevCont from '../assets/ohlc_strategy_development_cont.png';
import ohlcFinal from '../assets/ohlc_final_strategy.png';
import ohlcFinalCont from '../assets/ohlc_final_strategy_cont.png';

export interface Slide {
  src: string;
  label: string;
  url?: string;
  aspect?: number;
}

export const edgeboardImages: Slide[] = [
  { src: edgeboardDashboard, label: 'Dashboard', url: 'edgeboard.trade/dashboard', aspect: 2.1368 },
  { src: edgeboardPerformance, label: 'Performance', url: 'edgeboard.trade/performance', aspect: 2.0325 },
  { src: edgeboardCalendar, label: 'Calendar', url: 'edgeboard.trade/calendar', aspect: 1.9533 },
  { src: edgeboardChecklist, label: 'Checklist', url: 'edgeboard.trade/checklist', aspect: 2.0243 },
  { src: edgeboardWeeklyReview, label: 'Weekly Review', url: 'edgeboard.trade/planning/review', aspect: 2.0555 },
];

export const somaImages: Slide[] = [
  { src: somaLogin, label: 'Sign In' },
  { src: somaToday, label: 'Today' },
  { src: somaWorkouts, label: 'Workouts' },
  { src: somaCalendar, label: 'Calendar' },
  { src: somaProgress, label: 'Progress' },
  { src: somaMore, label: 'More' },
];

export const ohlcImages: Slide[] = [
  { src: ohlc10am, label: '10AM Reversal' },
  { src: ohlcCloseVsWick, label: 'Close vs Wick' },
  { src: ohlcStairstep, label: 'Stairstep Acceptance' },
  { src: ohlcStrategyDev, label: 'Strategy Development' },
  { src: ohlcStrategyDevCont, label: 'Strategy Development — cont.' },
  { src: ohlcFinal, label: 'Final Strategy' },
  { src: ohlcFinalCont, label: 'Final Strategy — cont.' },
];

export const edgeboardChallenges = [
  'UI built to make dense performance data legible, not overwhelming',
  'Data model for hundreds of linked journal entries and analytics',
  'Centralized API and caching layer — dashboards stay in sync after edits, no reloads',
  'Advanced analytics: performance, setup grading, behavior, calendar, weekly review',
  'Migrated from mock data to a production Postgres backend with no UX regression',
];

export const somaChallenges = [
  'Reusable workout-template system — built-in and fully custom programs',
  'Calendar-based logging with editable historical workouts',
  'Oura integration surfaces sleep and readiness data alongside training history',
  'Persistent Supabase storage, replacing browser localStorage',
  'Auth and onboarding flows with personalized profiles',
  'Native-feeling, mobile-first interface architecture',
];

export const somaTech = ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Oura API', 'Vercel'];
export const edgeboardTech = ['React', 'TypeScript', 'Vite', 'Python', 'FastAPI', 'PostgreSQL', 'Railway', 'Vercel'];

export const skillGroups = [
  { title: 'Frontend', items: 'React · TypeScript · Tailwind CSS' },
  { title: 'Backend', items: 'Python · FastAPI · REST APIs' },
  { title: 'Data', items: 'SQL · Pandas · Tableau' },
  { title: 'Tools', items: 'Git · GitHub · Vercel · Railway · Supabase' },
  // Fix: "Codex" (OpenAI's original API) was deprecated in March 2023 —
  // reads as stale to a technical reviewer. Swapped for what's actually
  // in daily use.
  { title: 'AI', items: 'Claude · ChatGPT · Cursor' },
];
