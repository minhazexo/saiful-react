import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Seo from '../../components/Seo';
import { assetPath } from '../../utils/assets';
import './SetupPage.css';
import './SetupPage.responsive.css';

const PROBLEMS = [
  'কী দিয়ে শুরু করবেন বুঝতে পারছেন না',
  'ব্র্যান্ড, ওয়েবসাইট, মার্কেটিং নিয়ে কনফিউশন',
  'একেজনের জন্য আলাদা মানুষ খুঁজতে হচ্ছে',
  'সময় ৓ টাকা দুইটাই নষ্ট হচ্ছে',
  'প্রফেশনাল সেটআপ না হওয়ায় ব্যবসা শুরু করতে পারছেন না',
];

const SOLUTIONS = [
  'একটি প্রফেশনাল টিম সব কিছু সেটআপ করবে',
  'সুপরিকল্পিত প্রক্রিয়ার মাধ্যমে সঠিকভাবে শুরু',
  'সময় ৓ খরচ দুইটাই কমবে',
  'প্রফেশনাল সেটআপের মাধ্যমে ব্র্যান্ড ভ্যালু বৃদ্ধি',
  'মার্কেটিং রেডি ফাউন্ডেশন তৈরি',
];

const ROADMAP = [
  { num: '১', label: 'আইডিয়া ও রিসার্চ' },
  { num: '২', label: 'ব্র্যান্ড আইডেন্টিটি' },
  { num: '৩', label: 'ওয়েবসাইট সেটআপ' },
  { num: '৪', label: 'সোশ্যাল মিডিয়া সেটআপ' },
  { num: '৫', label: 'মার্কেটিং ফাউন্ডেশন' },
  { num: '৬', label: 'লক্ষ্য' },
  { num: '৭', label: 'ফার্স্ট সেল' },
];

const WHAT_YOU_GET = [
  { icon: 'star', title: 'লোগো ডিজাইন', desc: 'আপনার ব্যবসা আসলে কী করে তার ভিত্তিতে তৈরি একটি স্বত্ব্য মার্ক।' },
  { icon: 'globe', title: 'ব্র্যান্ড আইডেন্টিটি', desc: 'রং, টাইপোগ্রাফি এবং ভিজুয়াল নিয়ম যা প্রতিটি জায়গায় সমজস্যা বজায় রাখে।' },
  { icon: 'layout', title: 'বিজনেস ব্র্যান্ডিং', desc: 'কাস্টমার-মুখী প্রতিটি অ্যাসেটে সংগঠিতপূর্ণ ব্র্যান্ড সিস্টেম।' },
  { icon: 'menu', title: 'ওয়ার্ডপ্রেস ওয়েবসাইট', desc: 'দ্রুত, প্রফেশনাল ওয়েবসাইট যা ভিজিটরদের কাস্টমারে রূপান্তরিত করে।' },
  { icon: 'cart', title: 'ই-কমার্স স্টোর', desc: 'সম্পূর্ণ অনলাইন স্টোর, প্রথম দিন থেকেই অর্ডার নেওয়ার জন্য প্রস্তুত।' },
  { icon: 'globe2', title: 'ডোমেইন ও হোস্টিং', desc: 'আপনার ডোমেইন রেজিস্ট্রেশন এবং হোস্টিং সঠিকভাবে কনফিগার করা।' },
  { icon: 'mail', title: 'বিজনেস ইমেইল', desc: 'প্রফেশনাল বিজনেস ইনবক্স, প্রস্তুত অবস্থায় ডেলিভার করা।' },
  { icon: 'share', title: 'সোশ্যাল মিডিয়া সেটআপ', desc: 'ফেসবুক, ইনস্টাগ্রাম, লিংকডইন ও টিকটক পেজ, সঠিকভাবে তৈরি।' },
  { icon: 'grid', title: 'মেটা বিজনেস ম্যানেজার', desc: 'আপনার সব অ্যাড অ্যাকাউন্ট ও পেজ একটি ম্যানেজারের অভিন্নে সংগঠিত।' },
  { icon: 'sun', title: 'পিক্সেল ও কনভার্সন API', desc: 'প্রতিটি ক্যাম্পেইন পরিমাপযোগ্য করতে ট্র্যাকিং কনফিগার করা।' },
  { icon: 'chart', title: 'অ্যানালিটিক্স ও সার্চ কনসোল', desc: 'গুগল অ্যানালিটিক্স ও সার্চ কনসোল সংযুক্ত ও চালিকায়।' },
  { icon: 'search', title: 'বেসিক SEO সেটআপ', desc: 'সার্চ ইঞ্জিন যাতে আপনাকে খুঁজে পায়, তার মৌলিক ভিত্তি।' },
  { icon: 'zap', title: 'মার্কেটিং স্ট্র্যাটেজি', desc: 'আপনার প্রথম কাস্টমারদের কাছে পৌঁছানোর একটি স্পষ্ট পরিকল্পনা।' },
  { icon: 'check', title: 'লক্ষ্য প্রিপারেশন', desc: 'লাইভ হওয়ার আগে প্রতিটি সিস্টেমের ছোট পর্যালোচনা।' },
];

const WHO_FOR = [
  'নতুন উদ্যোক্তা',
  'ই-কমার্স ব্যবসা',
  'লোকাল ব্যবসা',
  'সার্ভিস ভিত্তিক ব্যবসা',
  'পার্সোনাল ব্র্যান্ড',
  'স্টার্টআপ ব্যবসা',
];

const PORTFOLIO_FILTERS = ['সব', 'ব্র্যান্ডিং', 'ওয়েবসাইট', 'ই-কমার্স', 'কর্পোরেট'];

const PORTFOLIO = [
  { tag: 'branding', name: 'Verdant & Co.', desc: 'লোগো, আইডেন্টিটি, গাইডলাইন', badge: 'ব্র্যান্ড সিস্টেম', color: '#1a3a2a' },
  { tag: 'website', name: 'Northline Studio', desc: 'কর্পোরেট ওয়েবসাইট', badge: 'থার্ডপার্টি বিল্ড', color: '#111827' },
  { tag: 'ecommerce', name: 'Kindred Goods', desc: 'অনলাইন স্টোর সেটআপ', badge: 'ই-কমার্স', color: '#0f2d1a' },
  { tag: 'corporate', name: 'Anchor Legal Group', desc: 'ব্র্যান্ড + সাইট + সোশ্যাল', badge: 'সম্পূর্ণ সেটআপ', color: '#1a1a2e' },
  { tag: 'branding', name: 'Amber Botanicals', desc: 'পার্সোনাল ব্র্যান্ড', badge: 'লোগো ও আইডেন্টিটি', color: '#2d1b0e' },
  { tag: 'website', name: 'Fieldstone Coaching', desc: 'সার্ভিস বিজনেস সাইট', badge: 'ল্যান্ডিং পেইজ', color: '#1a2332' },
];

const FAQS = [
  { q: 'আপনারা ঠিক কী কী সেটআপ করে দেন?', a: 'লোগো, ব্র্যান্ড আইডেন্টিটি, ওয়েবসাইট, সোশ্যাল মিডিয়া পেজ সেটআপ, বিজনেস ইমেইল, ডোমেইন-হোস্টিং, মেটা পিক্সেল সেটআপ, গুগল অ্যানালিটিক্স, SEO বেসিক সেটআপ এবং মার্কেটিং ফাউন্ডেশন — সবকিছু একসাথে পাবেন।' },
  { q: 'আমার কি কোনো টেকনিকাল জ্ঞান থাকা দরকার?', a: 'না, আপনার কোনো টেকনিকাল জ্ঞানের প্রয়োজন নেই। আমাদের টিম সবকিছু আপনার জন্য সেটআপ করে দেবে এবং প্রতিটি ধাপ বোঝায়।' },
  { q: 'সেটআপ করতে কত সময় লাগে?', a: 'সাধারণত ৭-১৪ কার্যদিবস সময় লাগে। এটা আপনার প্যাকেজ এবং কাস্টমাইজেশনের ওপর নির্ভর করে।' },
  { q: 'সম্পূর্ণ প্যাকেজের বদলে কি আলাদা সেবা অর্ডার করা যায়?', a: 'হ্যাঁ, আলাদা সেবা অর্ডার করা সম্ভব। তবে সম্পূর্ণ প্যাকেজে সবকিছু একসাথে পেলে খরচ ও সময় উভয়ই বেশি সাশ্রয়ী হয়।' },
  { q: 'লক্ষ্যের পর কী হয়?', a: 'লক্ষ্যের পরও আমাদের সাপোর্ট চালিয়ে যায়। আপনি চাইলে মার্কেটিং, মেইনটেন্যান্স বা আপডেটের জন্য আমাদের সাথে থাকতে পারেন।' },
  { q: 'এটি মার্কেটিং এজেন্সি থেকে কীভাবে আলাদা?', a: 'মার্কেটিং এজেন্সি শুধু মার্কেটিং করে। আমরা ব্র্যান্ডিং থেকে শুরু করে ওয়েবসাইট, সোশ্যাল মিডিয়া, পিক্সেল সেটআপ এবং মার্কেটিং ফাউন্ডেশন — সবকিছু এক জায়গায় দিই।' },
];

const CHECK_ICONS = {
  x: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  check: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
};

const WHAT_YOU_GET_ICONS = {
  star: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  globe: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  layout: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
  menu: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  cart: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  globe2: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  mail: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,4 12,13 2,4"/></svg>,
  share: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  grid: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  sun: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  chart: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>,
  search: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  zap: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  check: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
};

function MotionReveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function FaqItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`setup-faq-item ${open ? 'active' : ''}`}>
      <button className="setup-faq-q" onClick={() => setOpen(!open)}>
        <span>{item.q}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="setup-faq-a"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p>{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SetupPage() {
  const [filter, setFilter] = useState('সব');

  const filteredPortfolio = filter === 'সব'
    ? PORTFOLIO
    : PORTFOLIO.filter(p => {
        const map = { 'ব্র্যান্ডিং': 'branding', 'ওয়েবসাইট': 'website', 'ই-কমার্স': 'ecommerce', 'কর্পোরেট': 'corporate' };
        return p.tag === map[filter];
      });

  return (
    <div className="setup">
      <Seo
        title="Business Setup — Saiful Studios"
        description="আপনার ব্যবসা শুরু করার জন্য যা যা দরকার, সব এক জায়গায়। লোগো, ব্র্যান্ডিং, ওয়েবসাইট, সোশ্যাল মিডিয়া সেটআপ এবং মার্কেটিং ফাউন্ডেশন।"
        path="/setup"
      />

      {/* ========== HERO ========== */}
      <section className="setup-hero">
        <div className="container setup-hero-grid">
          <MotionReveal className="setup-hero-left">
            <span className="setup-eyebrow">বিজনেস সেটআপসলুশন</span>
            <h1>আপনার ব্যবসা শুরু করার জন্য যা যা দরকার, সব এক জায়গায়।</h1>
            <p className="setup-hero-desc">
              প্রফেশনাল ভাবে ব্যবসা শুরু করার জন্য আপনার প্রয়োজনীয় সবকিছু আমরা তৈরি করে দিচ্ছি — লোগো, ব্র্যান্ডিং, ওয়েবসাইট, সোশ্যাল মিডিয়া সেটআপ এবং মার্কেটিং ফাউন্ডেশন, সম্পূর্ণভাবে।
            </p>
            <div className="setup-hero-btns">
              <a href="#setup-cta" className="setup-btn setup-btn-green">ফি কনসালটেশন বুক করুন</a>
              <a href="#portfolio" className="setup-btn setup-btn-outline">পোর্টফোলিও দেখুন</a>
            </div>
            <div className="setup-trust-row">
              <span>✓ প্রফেশনাল টিম</span>
              <span>✓ দ্রুত ডেলিভারি</span>
              <span>✓ কাস্টম সলিউশন</span>
              <span>✓ দীর্ঘমেয়াদি সাপোর্ট</span>
            </div>
          </MotionReveal>
          <MotionReveal delay={0.16} className="setup-hero-right">
            <div className="setup-hero-circle">
              <img src={assetPath('/images/business-setup.jpg')} alt="Brand mockup" />
            </div>
          </MotionReveal>
        </div>
      </section>

      {/* ========== PROBLEM VS SOLUTION ========== */}
      <section className="setup-section setup-ps">
        <div className="container">
          <div className="setup-ps-grid">
            <MotionReveal className="setup-ps-col">
              <span className="setup-badge setup-badge-red">সমস্যা</span>
              <h2>ব্যবসা শুরু করতে গিয়ে আপনি কি এই সমস্যাগুলোর মুখোমুখি হয়েছেন?</h2>
              <ul className="setup-ps-list">
                {PROBLEMS.map((p, i) => (
                  <li key={i}><span className="setup-ps-icon setup-ps-x">{CHECK_ICONS.x}</span>{p}</li>
                ))}
              </ul>
            </MotionReveal>
            <MotionReveal delay={0.12} className="setup-ps-col">
              <span className="setup-badge setup-badge-green">সমাধান</span>
              <h2>আমরা আপনাকে দিচ্ছি একটি সম্পূর্ণ <span className="setup-green-text">বিজনেস সেটআপ সলুশন</span></h2>
              <ul className="setup-ps-list">
                {SOLUTIONS.map((s, i) => (
                  <li key={i}><span className="setup-ps-icon setup-ps-check">{CHECK_ICONS.check}</span>{s}</li>
                ))}
              </ul>
            </MotionReveal>
          </div>
        </div>
      </section>

      {/* ========== ROADMAP ========== */}
      <section className="setup-section setup-roadmap">
        <div className="container">
          <MotionReveal className="setup-roadmap-head">
            <h2>আমাদের বিজনেস সেটআপ রোডম্যাপ</h2>
          </MotionReveal>
          <div className="setup-roadmap-steps">
            {ROADMAP.map((r, i) => (
              <motion.div
                key={i}
                className="setup-roadmap-step"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
              >
                <div className="setup-roadmap-num">{r.num}</div>
                <span className="setup-roadmap-label">{r.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== WHAT YOU GET ========== */}
      <section className="setup-section setup-what" id="what-you-get">
        <div className="container">
          <MotionReveal className="setup-what-head">
            <h2>আপনি ঠিক কি কি পাবেন?</h2>
          </MotionReveal>
          <div className="setup-what-grid">
            {WHAT_YOU_GET.map((item, i) => (
              <motion.div
                key={i}
                className="setup-what-card"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.04 }}
              >
                <div className="setup-what-icon">{WHAT_YOU_GET_ICONS[item.icon]}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== WHO IS THIS FOR ========== */}
      <section className="setup-section setup-who">
        <div className="container">
          <MotionReveal className="setup-who-head">
            <h2>এই সার্ভিসটি কাদের জন্য?</h2>
          </MotionReveal>
          <div className="setup-who-grid">
            {WHO_FOR.map((w, i) => (
              <motion.div
                key={i}
                className="setup-who-card"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
              >
                <div className="setup-who-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                </div>
                <span>{w}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PORTFOLIO ========== */}
      <section className="setup-section setup-portfolio" id="portfolio">
        <div className="container">
          <MotionReveal className="setup-portfolio-header">
            <span className="setup-eyebrow-sm"><span className="setup-dot"></span>আমাদের কাজ</span>
            <h2 className="setup-portfolio-title">সাম্প্রতিক বিজনেস সেটআপ</h2>
            <p className="setup-portfolio-sub">আমরা যেসব ব্র্যান্ড, স্টোর ও ওয়েবসাইট লক্ষ্য করেছি তার কিছু নমুনা।</p>
          </MotionReveal>
          <div className="setup-portfolio-filters">
            {PORTFOLIO_FILTERS.map(f => (
              <button
                key={f}
                className={`setup-filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="setup-portfolio-grid">
            <AnimatePresence mode="popLayout">
              {filteredPortfolio.map((p, i) => (
                <motion.div
                  key={p.name}
                  className="setup-portfolio-card"
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                >
                  <div className="setup-portfolio-img" style={{ background: p.color }}>
                    <span className="setup-portfolio-badge">{p.badge}</span>
                  </div>
                  <div className="setup-portfolio-info">
                    <span className="setup-portfolio-tag">{p.tag}</span>
                    <h3>{p.name}</h3>
                    <p>{p.desc}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section className="setup-section setup-faq">
        <div className="container">
          <MotionReveal className="setup-faq-header">
            <span className="setup-eyebrow-sm"><span className="setup-dot"></span>প্রশ্নোত্তর</span>
            <h2 className="setup-faq-title">সাধারন জিজ্ঞাসা</h2>
          </MotionReveal>
          <div className="setup-faq-list">
            {FAQS.map((f, i) => (
              <FaqItem key={i} item={f} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="setup-section setup-cta" id="setup-cta">
        <div className="container">
          <MotionReveal className="setup-cta-inner">
            <span className="setup-eyebrow-sm setup-eyebrow-light"><span className="setup-dot"></span>আপনি প্রস্তুত হলে আমরা প্রস্তুত</span>
            <h2>আজই আপনার ব্যবসা প্রফেশনালভাবে লক্ষ্য করুন</h2>
            <p>একটি ফি কনসালটেশন বুক করুন এবং আমরা ঠিক বের করে দেব আপনার বিজনেস সেটআপে কী প্রয়োজন। কোনো চাপ নেই, কোনো জটিল শব্দ নেই, কোনো অনুমান নেই।</p>
            <div className="setup-cta-btns">
              <a href="#" className="setup-btn setup-btn-green">ফি কনসালটেশন বুক করুন</a>
              <a href="#portfolio" className="setup-btn setup-btn-outline-light">পোর্টফোলিও দেখুন</a>
            </div>
          </MotionReveal>
        </div>
      </section>
    </div>
  );
}

export default SetupPage;
