import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView } from 'framer-motion';
import Seo from '../../components/Seo';
import { staggerContainer, fadeUp } from '../../motion/presets';
import { assetPath } from '../../utils/assets';
import './AcademyPage.css';
import './AcademyPage.responsive.css';

// --- Inline SVG icons used across the page ------------------------------
const Icon = {
  rocket: (<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22 22 0 0 1-4 2Z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>),
  phone: (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13 1 .37 1.97.72 2.9a2 2 0 0 1-.45 2.11L8.09 10.91a16 16 0 0 0 6 6l2.18-1.29a2 2 0 0 1 2.11-.45c.93.35 1.9.59 2.9.72A2 2 0 0 1 22 16.92Z"/></svg>),
  user: (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>),
  mail: (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>),
  bag: (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>),
  video: (<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>),
  users: (<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
  folder: (<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2Z"/></svg>),
  checkCircle: (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>),
  xCircle: (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>),
  whatsapp: (<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M20.52 3.48A11.9 11.9 0 0 0 12.06 0C5.5 0 .07 5.42.07 12c0 2.12.55 4.18 1.6 6.01L0 24l6.18-1.62a12 12 0 0 0 5.88 1.5h.01c6.55 0 11.98-5.42 11.98-12 0-3.2-1.25-6.21-3.53-8.4ZM12.07 21.8h-.01a9.84 9.84 0 0 1-5.02-1.38l-.36-.21-3.67.96.98-3.58-.24-.37A9.85 9.85 0 1 1 21.9 12c0 5.42-4.41 9.8-9.83 9.8Z"/></svg>),
};

const MODULES = [
  { num: '01', title: 'ই-কমার্স বিজনেস ফাউন্ডেশন', icon: 'idea', desc: 'বিজনেস মডেল, মার্কেট রিসার্চ, নিশ নির্বাচন, প্রোডাক্ট আইডিয়া যাচাই।' },
  { num: '02', title: 'ব্র্যান্ড আইডেন্টিটি ও ডিজাইন', icon: 'branding', desc: 'লোগো তৈরি, কালার সাইকোলজি, টাইপোগ্রাফি, এমন একটি ব্র্যান্ড গড়া যা গ্রাহকরা ভুলবে না।' },
  { num: '03', title: 'ওয়েবসাইট ও অনলাইন স্টোর সেটআপ', icon: 'online-presence', desc: 'নো-কোড ই-কমার্স স্টোর, প্রোডাক্ট পেজ, পেমেন্ট সিস্টেম সেটআপ।' },
  { num: '04', title: 'কনটেন্ট ক্রিয়েশন সিস্টেম', icon: 'fast-content', desc: 'হাই-কনভার্টিং কনটেন্ট তৈরি করতে Canva, ChatGPT, CapCut ব্যবহার।' },
  { num: '05', title: 'সোশ্যাল মিডিয়া মার্কেটিং', icon: 'research', desc: 'ফেসবুক, ইনস্টাগ্রাম, টিকটক স্ট্র্যাটেজি — অর্গানিক গ্রোথ এবং কমিউনিটি বিল্ডিং।' },
  { num: '06', title: 'ফেসবুক ও ইনস্টাগ্রাম অ্যাড', icon: 'grow', desc: 'ক্যাম্পেইন সেটআপ, অডিয়েন্স টার্গেটিং, বাজেট ম্যানেজমেন্ট, ROAS অপ্টিমাইজেশন।' },
  { num: '07', title: 'এআই মার্কেটিং ও অটোমেশন', icon: 'scale', desc: 'ChatGPT-ভিত্তিক ইমেইল মার্কেটিং, Gemini ওয়ার্কফ্লো, মার্কেটিং সিস্টেম অটোমেশন।' },
  { num: '08', title: 'স্কেলিং ও বিজনেস গ্রোথ', icon: 'launch', desc: 'ডেটা বিশ্লেষণ, সেলিং স্ট্র্যাটেজি, ফানেল, ডেলিগেশন, টেকসই গ্রোথ গড়া।' },
];

const BONUS_ITEMS = [
  { icon: '📋', title: 'SOP Library' },
  { icon: '📝', title: 'Business Templates' },
  { icon: '🤖', title: 'AI Prompt Library' },
  { icon: '✅', title: 'Business Checklist' },
  { icon: '📂', title: 'Marketing Swipe File' },
  { icon: '📚', title: 'Business Reading Guide' },
  { icon: '♾️', title: 'Lifetime Update' },
];

const ROADMAP = ['Mindset', 'Product Research', 'Brand Identity', 'Website', 'Content', 'Marketing', 'Sales', 'Automation', 'Scale'];
const ENR_STEPS = ['Enrollment', 'Community Join', 'Live Class', 'Assignment', 'Feedback', 'Business Launch'];

const BANGLA_NUMS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const toBn = (n) => String(n).split('').map(d => BANGLA_NUMS[+d] ?? d).join('');
const toBnPadded = (n) => {
  const s = toBn(n);
  return s.length < 2 ? '০' + s : s;
};

function MotionFade({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function MotionStagger({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
    >
      {children}
    </motion.div>
  );
}

// Count-up stat that animates `0 -> end` (Bangla digits) once it scrolls in.
function AnimatedStat({ end, suffix = '', decimals = 0, duration = 1.6 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(toBn(0));

  useEffect(() => {
    if (!inView) return undefined;
    const controls = animate(0, end, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        setDisplay(decimals > 0 ? toBn(v.toFixed(decimals)) : toBn(Math.floor(v)));
      },
    });
    return () => controls.stop();
  }, [inView, end, decimals, duration]);

  return <span ref={ref}>{display}{suffix}</span>;
}

function AcademyPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="page academy-page">
      <Seo
        title="Saiful Studios Academy — সম্পূর্ণ ই-কমার্স বিজনেস মেন্টরশিপ প্রোগ্রাম"
        description="শূন্য থেকে নিজের সফল ই-কমার্স ব্যবসা শুরু করুন। লাইভ Google Meet ক্লাস, বাস্তব Assignment, Community Support ও ব্যক্তিগত গাইডলাইন।"
        path="/academy"
      />

      {/* HERO (Premium Spec) */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-tag">বাংলাদেশের সম্পূর্ণ ই-কমার্স বিজনেস মেন্টরশিপ প্রোগ্রাম</div>
            <h1 className="hero-title">শূন্য থেকে নিজের সফল ই-কমার্স ব্যবসা শুরু করুন</h1>
            <p className="hero-desc">লাইভ Google Meet ক্লাস, সাপ্তাহিক Assignment, Private Community, SOP Template, AI Prompt ও Business Mentorship-এর মাধ্যমে ধাপে ধাপে আপনার নিজের ব্যবসা তৈরি করুন।</p>
            <div className="hero-buttons">
              <a href="#pricing" className="btn btn-primary">এখনই ভর্তি হন</a>
              <a href="#enroll" className="btn btn-dark">ফ্রি কনসালটেশন নিন</a>
            </div>
          </div>

          <div className="hero-image" aria-hidden="true">
            <span className="hero-image-placeholder">সা</span>
          </div>
        </div>

        <div className="process">
          <div className="process-pill">🎓 Academy</div>
          <span className="process-arrow">→</span>
          <div className="process-pill">🛠 Setup</div>
          <span className="process-arrow">→</span>
          <div className="process-pill">📈 Growth</div>
        </div>
        <p className="process-text">এখানে শিখুন → আপনার ব্যবসা সেটআপ করুন → এরপর আমাদের সাথে ব্যবসা গ্রোথ করুন।</p>
      </section>

      {/* TRUST BAR */}
      <section className="trust-bar">
        <div className="wrap trust-grid">
          {[
            { end: 200, suffix: '+', label: 'ব্যবসা সফলভাবে গাইড করেছি' },
            { end: 3000, suffix: '+', label: 'শিক্ষার্থী' },
            { end: 8, suffix: '+', label: 'বছরের অভিজ্ঞতা' },
            { end: 4.9, suffix: '★', decimals: 1, label: 'গড় রেটিং' },
          ].map((s, i) => (
            <div key={i} className="trust-stat">
              <div className="trust-num"><AnimatedStat end={s.end} suffix={s.suffix} decimals={s.decimals} /></div>
              <div className="trust-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEM VS SOLUTION */}
      <section className="section-pad">
        <div className="wrap">
          <MotionFade className="section-head">
            <h2>কেন অধিকাংশ নতুন উদ্যোক্তা সফল হতে পারে না?</h2>
            <p>ভুলভাবে ব্যবসা শুরু করলে সময়, টাকা এবং আত্মবিশ্বাস — সবকিছুই ক্ষতিগ্রস্ত হয়।</p>
          </MotionFade>
          <div className="ps-grid">
            <div className="ps-card before">
              <div className="ps-tag red">🔴 আগে</div>
              <h3>ব্যবসার সাধারণ ভুল</h3>
              {['কোনো সঠিক ব্যবসায়িক পরিকল্পনা নেই', 'পণ্য গবেষণা নেই', 'ব্র্যান্ড পরিচিতি নেই', 'পেশাদার ওয়েবসাইট নেই', 'কনটেন্ট কৌশল নেই', 'মার্কেটিং পরিকল্পনা নেই', 'সেলস ফানেল নেই'].map((item, i) => (
                <div key={i} className="ps-item"><span className="ps-ic">{Icon.xCircle}</span>{item}</div>
              ))}
            </div>
            <div className="ps-card after">
              <div className="ps-tag green">🟢 পরে</div>
              <h3>আমাদের Mentorship-এ যা শিখবেন</h3>
              {['ব্যবসার সম্পূর্ণ রোডম্যাপ', 'প্রোডাক্ট রিসার্চ ফ্রেমওয়ার্ক', 'প্রফেশনাল ব্র্যান্ডিং', 'ইকমার্স ওয়েবসাইট', 'কন্টেন্ট ও মার্কেটিং কৌশল', 'সেলস সিস্টেম তৈরি করা', 'ব্যবসা অটোমেশন করা'].map((item, i) => (
                <div key={i} className="ps-item"><span className="ps-ic">{Icon.checkCircle}</span>{item}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY DIFFERENT */}
      <section className="section-pad bg-light" id="why">
        <div className="wrap">
          <MotionFade className="section-head">
            <h2>কেন আমাদের Academy আলাদা?</h2>
            <p>এটি শুধু কোর্স নয় — একটি সম্পূর্ণ মেন্টরশিপ সিস্টেম।</p>
          </MotionFade>
          <div className="grid-3">
            {[
              { ic: '🎥', title: 'লাইভ গুগল মিট ক্লাস', desc: 'প্রতি সপ্তাহে সমস্যার লাইভ ক্লাসে যুক্ত হয়ে ঘরে বসে করার সুযোগ পাবেন।' },
              { ic: '👥', title: 'প্রাইভেট কমিউনিটি', desc: 'একই লক্ষ্যের উদ্যোক্তাদের সাথে যুক্ত থেকে একে অপরকে সহায়তা করুন।' },
              { ic: '📋', title: 'এসওপি লাইব্রেরি', desc: 'রেডিমেড Standard Operating Procedure দিয়ে ব্যবসা দ্রুত গুছিয়ে নিন।' },
              { ic: '📄', title: 'ফ্রি রিসোর্সেস', desc: 'ই বুক, বিজনেস টেমপ্লেট, চেকলিস্ট, ল্যান্ডিং পেজ এসবই ফ্রিপাবে পাবেন।' },
              { ic: '📝', title: 'এসাইনমেন্ট রিভিউ', desc: 'প্রতিটি অ্যাসাইনমেন্ট মেন্টর সমস্যার রিভিউ করে ফিডব্যাক দেবেন।' },
              { ic: '💬', title: 'লাইফটাইম সাপোর্ট', desc: 'কোর্স শেষে আজীবন সাপোর্ট ও আপডেট পেতে থাকবেন।' },
            ].map((f, i) => (
              <motion.div
                key={i}
                className="feature-card"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="feature-ic">{f.ic}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="section-pad">
        <div className="wrap">
          <MotionFade className="section-head">
            <h2>আপনার শেখার সম্পূর্ণ Roadmap</h2>
            <p>প্রতিটি ধাপ পরিকল্পিতভাবে সাজানো, যাতে আপনি কখনো হারিয়ে না যান।</p>
          </MotionFade>
          <div className="roadmap">
            {ROADMAP.map((step, i) => (
              <div key={i} className="road-step">
                <div className="road-dot">{toBnPadded(i + 1)}</div>
                <div className="road-label">{step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODULES */}
      <section className="section-pad bg-light" id="modules">
        <div className="wrap">
          <MotionFade className="section-head">
            <h2>কোর্সের Module</h2>
            <p>৮টি গেমচেঞ্জার মডিউল, যা একে অপরের সাথে যুক্ত হয়ে আপনার ব্যবসাকে দাঁড় করাবে।</p>
          </MotionFade>
          <div className="module-grid">
            {MODULES.map((m, i) => (
              <motion.div
                key={i}
                className="module-card"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="module-top">
                  <div className="module-icon">
                    <img src={assetPath(`/images/icons/${m.icon}.svg`)} alt="" />
                  </div>
                  <span className="module-num">{m.num}</span>
                </div>
                <h3 className="module-title">{m.title}</h3>
                <p>{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* MENTOR */}
      <section className="section-pad bg-light" id="mentor">
        <div className="wrap mentor-grid">
          <MotionFade>
            <div className="mentor-frame">
              <div className="mentor-photo">👨‍💼</div>
            </div>
          </MotionFade>
          <MotionStagger>
            <motion.span className="eyebrow" variants={fadeUp}>আপনার মেন্টর</motion.span>
            <motion.h2 variants={fadeUp}>সাইফুল ইসলাম</motion.h2>
            <motion.p className="mentor-bio" variants={fadeUp}>৮+ বছরের বাস্তব অভিজ্ঞতা নিয়ে বাংলাদেশে শত শত উদ্যোক্তাকে ব্যবসা শুরু ও গ্রোথ করতে সহায়তা করেছি। প্রতিটি ক্লাস, প্রতিটি গাইডলাইন তৈরি হয়েছে বাস্তব অভিজ্ঞতা থেকে — থিওরি থেকে নয়।</motion.p>
            <motion.div className="mentor-stats" variants={fadeUp}>
              {[['২০০+', 'Business'], ['৩০০০+', 'Students'], ['৮+', 'Years']].map(([n, l], i) => (
                <div key={i}>
                  <div className="mentor-stat-num">{n}</div>
                  <div className="mentor-stat-label">{l}</div>
                </div>
              ))}
            </motion.div>
            <motion.a href="#pricing" className="btn btn-primary btn-lg" variants={fadeUp}>আমার সাথে শিখুন</motion.a>
          </MotionStagger>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-pad">
        <div className="wrap">
          <MotionFade className="section-head">
            <h2>শিক্ষার্থীদের সফলতার গল্প</h2>
            <p>আমাদের শিক্ষার্থীরা যা বলছেন, তাদের নিজের ভাষায়।</p>
          </MotionFade>
          <div className="testi-grid">
            {[
              { quote: '"কোর্স শুরু করার আগে আমার কোনো ধারণাই ছিল না কীভাবে ব্যবসা সাজাতে হয়। লাইভ ক্লাস আর SOP গুলো আমার জন্য গেম চেঞ্জার হয়েছে।"', result: '৩ মাসে প্রথম ১০০ অর্ডার', name: 'তানভীর আহমেদ', role: 'ফ্যাশন ব্র্যান্ড প্রতিষ্ঠাতা' },
              { quote: '"Assignment Review আর Mentorship-টা সবচেয়ে ভালো লেগেছে। প্রতিটা ভুল ধরিয়ে দিয়ে সঠিক পথ দেখানো হয়েছে।"', result: 'মাসিক আয় দ্বিগুণ', name: 'নুসরাত জাহান', role: 'কসমেটিকস স্টোর মালিক' },
              { quote: '"কমিউনিটি সাপোর্ট আর Business Roadmap অনুসরণ করে আমি প্রথমবারের মতো নিজের ওয়েবসাইট লঞ্চ করতে পেরেছি।"', result: 'নিজস্ব ওয়েবসাইট লঞ্চ', name: 'রাকিবুল হাসান', role: 'ইলেকট্রনিক্স রিটেইলার' },
            ].map((t, i) => (
              <motion.div
                key={i}
                className="testi-card"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="testi-video"><div className="play-btn">{Icon.video}</div></div>
                <div className="testi-stars">★★★★★</div>
                <p>{t.quote}</p>
                <div className="testi-result">{t.result}</div>
                <div className="testi-name">{t.name}</div>
                <div className="testi-role">{t.role}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section-pad bg-light" id="pricing">
        <div className="wrap">
          <MotionFade className="section-head">
            <h2>কোর্স ফি</h2>
            <p>এককালীন বিনিয়োগ, আজীবন ব্যবহারযোগ্য রিসোর্স ও সাপোর্ট।</p>
          </MotionFade>
          <MotionFade className="price-card">
            <div className="price-badge">সীমিত সময়ের অফার</div>
            <h3 className="price-card-title">Complete Ecommerce Mentorship</h3>
            <div className="price-row">
              <span className="price-old">১৫,০০০ টাকা</span>
              <span className="price-new">৭,৯০০ টাকা</span>
            </div>
            <p className="price-sub">একবার পেমেন্ট • আজীবন এক্সেস • সব আপডেট ফ্রি</p>
            <ul className="price-list">
              {[
                '৮টি সম্পূর্ণ Module ও Lifetime Recording',
                'সাপ্তাহিক Live Google Meet Class',
                'Private Community Support',
                'Assignment Review ও Business Mentorship',
                'SOP Library, Template ও AI Prompt Library',
                'Business Roadmap ও Checklist',
                'Future Update — সম্পূর্ণ ফ্রি',
              ].map((item, i) => (
                <li key={i}><span className="check">✓</span> {item}</li>
              ))}
            </ul>
            <a href="#enroll" className="btn btn-primary btn-lg btn-block">আজই ভর্তি হোন</a>
          </MotionFade>
        </div>
      </section>

      {/* WHAT HAPPENS NEXT */}
      <section className="section-pad">
        <div className="wrap">
          <MotionFade className="section-head">
            <h2>ভর্তি হওয়ার পর কী হবে?</h2>
            <p>ভর্তি থেকে ব্যবসা লঞ্চ পর্যন্ত পুরো যাত্রাটা এমন দেখতে হবে।</p>
          </MotionFade>
          <div className="enr-grid">
            {ENR_STEPS.map((step, i) => (
              <div key={i} className="enr-step">
                <div className="enr-dot">{toBn(i + 1)}</div>
                <h3>{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ENROLLMENT FORM */}
      <section className="section-pad bg-light" id="enroll">
        <div className="wrap">
          <MotionFade className="section-head">
            <h2>Enrollment Form</h2>
            <p>নিচের তথ্যগুলো দিন, আমাদের টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে।</p>
          </MotionFade>
          <MotionFade className="form-wrap">
            <div className="form-2col">
              <div className="form-row">
                <label>নাম</label>
                <div className="form-row-icon-stack">
                  <input className="has-icon" type="text" placeholder="আপনার পূর্ণ নাম লিখুন" />
                  <span className="form-icon" aria-hidden="true">{Icon.user}</span>
                </div>
              </div>
              <div className="form-row">
                <label>মোবাইল</label>
                <div className="form-row-icon-stack">
                  <input className="has-icon" type="tel" placeholder="০১XXXXXXXXX" />
                  <span className="form-icon" aria-hidden="true">{Icon.phone}</span>
                </div>
              </div>
            </div>
            <div className="form-row">
              <label>ইমেইল</label>
              <div className="form-row-icon-stack">
                <input className="has-icon" type="email" placeholder="you@example.com" />
                <span className="form-icon" aria-hidden="true">{Icon.mail}</span>
              </div>
            </div>
            <div className="form-row">
              <label>বর্তমানে ব্যবসা করছেন?</label>
              <div className="form-row-icon-stack">
                <select className="has-icon">
                  <option>হ্যাঁ, বর্তমানে ব্যবসা করছি</option>
                  <option>না, নতুন শুরু করতে চাই</option>
                  <option>পরিকল্পনা করছি</option>
                </select>
                <span className="form-icon" aria-hidden="true">{Icon.bag}</span>
              </div>
            </div>
            <button className="btn btn-primary btn-lg btn-block">Submit</button>
          </MotionFade>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-pad" id="faq">
        <div className="wrap">
          <MotionFade className="section-head">
            <h2>FAQ</h2>
            <p>আপনার মনে যে প্রশ্নগুলো ঘুরছে, তার উত্তর এখানে।</p>
          </MotionFade>
          <div className="faq-wrap">
            {[
              { q: 'কোর্সটি কাদের জন্য?', a: 'যারা নতুন ই-কমার্স ব্যবসা শুরু করতে চান, কিংবা বিদ্যমান ব্যবসাকে আরও গুছিয়ে সঠিক সিস্টেমে নিয়ে আসতে চান — তাদের জন্যই এই প্রোগ্রাম।' },
              { q: 'লাইভ ক্লাস মিস হলে কী হবে?', a: 'প্রতিটি লাইভ ক্লাসের রেকর্ডিং আজীবন এক্সেসের সাথে পেয়ে যাবেন, তাই কোনো ক্লাস মিস হলেও সমস্যা নেই।' },
              { q: 'আমার কোনো অভিজ্ঞতা নেই, তাও কি পারব?', a: 'হ্যাঁ। কোর্সটি একদম শূন্য থেকে শুরু করে ধাপে ধাপে শেখানো হয়, এবং প্রতিটি ধাপে মেন্টরশিপ সহায়তা থাকে।' },
              { q: 'পেমেন্ট কীভাবে করব?', a: 'bKash, Nagad, Rocket এবং ব্যাংক ট্রান্সফারের মাধ্যমে সহজেই পেমেন্ট করতে পারবেন। ভর্তির সময় বিস্তারিত জানিয়ে দেওয়া হবে।' },
              { q: 'কোর্সের মেয়াদ কতদিন?', a: 'মূল প্রোগ্রাম ৩ মাসব্যাপী, তবে সব রিসোর্স, কমিউনিটি ও আপডেট আজীবনের জন্য থাকবে আপনার এক্সেসে।' },
            ].map((item, i) => (
              <div key={i} className={`faq-item${openFaq === i ? ' open' : ''}`}>
                <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {item.q}
                  <span className="plus">+</span>
                </div>
                <div className="faq-a">
                  <div className="faq-a-inner">{item.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section-pad">
        <div className="wrap">
          <MotionFade className="final-cta">
            <span className="cta-blob b1" aria-hidden="true" />
            <span className="cta-blob b2" aria-hidden="true" />
            <span className="cta-blob b3" aria-hidden="true" />
            <h2>আজই নিজের সফল ই-কমার্স ব্যবসার যাত্রা শুরু করুন।</h2>
            <p>একটি সঠিক সিদ্ধান্ত আপনার ভবিষ্যৎ বদলে দিতে পারে।</p>
            <div className="final-cta-row">
              <a href="#pricing" className="btn btn-white btn-lg">🚀 এখনই ভর্তি হোন</a>
              <a href="#" className="btn btn-ghost-white btn-lg"><span style={{ display:'inline-flex', alignItems:'center', gap:8 }}>{Icon.whatsapp} WhatsApp-এ কথা বলুন</span></a>
            </div>
          </MotionFade>
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <div className="sticky-cta">
        <a href="#enroll" className="btn btn-outline" style={{ flex: 1 }}>📞 কনসালটেশন</a>
        <a href="#pricing" className="btn btn-primary" style={{ flex: 1 }}>এখনই ভর্তি হোন</a>
      </div>
    </div>
  );
}

export default AcademyPage;
