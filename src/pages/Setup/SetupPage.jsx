import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Seo from '../../components/Seo';
import { staggerContainer, fadeUp } from '../../motion/presets';
import './SetupPage.css';
import './SetupPage.responsive.css';

const services = [
  {t:'লোগো ডিজাইন', d:'আপনার ব্যবসা আসলে কী করে তার ভিত্তিতে তৈরি একটি স্বতন্ত্র মার্ক।'},
  {t:'ব্র্যান্ড আইডেন্টিটি', d:'রং, টাইপোগ্রাফি এবং ভিজ্যুয়াল নিয়ম যা প্রতিটি জায়গায় সামঞ্জস্য বজায় রাখে।'},
  {t:'বিজনেস ব্র্যান্ডিং', d:'কাস্টমার-মুখী প্রতিটি অ্যাসেটে সংগতিপূর্ণ ব্র্যান্ড সিস্টেম।'},
  {t:'ওয়ার্ডপ্রেস ওয়েবসাইট', d:'দ্রুত, প্রফেশনাল ওয়েবসাইট যা ভিজিটরদের কাস্টমারে রূপান্তরিত করে।'},
  {t:'উকমার্স স্টোর', d:'সম্পূর্ণ অনলাইন স্টোর, প্রথম দিন থেকেই অর্ডার নেওয়ার জন্য প্রস্তুত।'},
  {t:'ডোমেইন ও হোস্টিং', d:'আপনার ডোমেইন রেজিস্টার এবং হোস্টিং সঠিকভাবে কনফিগার করা।'},
  {t:'বিজনেস ইমেইল', d:'প্রফেশনাল বিজনেস ইনবক্স, প্রস্তুত অবস্থায় ডেলিভার করা।'},
  {t:'সোশ্যাল মিডিয়া সেটআপ', d:'ফেসবুক, ইনস্টাগ্রাম, লিংকডইন ও টিকটক পেজ, সঠিকভাবে তৈরি।'},
  {t:'মেটা বিজনেস ম্যানেজার', d:'আপনার অ্যাড অ্যাকাউন্ট ও পেজ একটি ম্যানেজারের অধীনে সংগঠিত।'},
  {t:'পিক্সেল ও কনভার্সন API', d:'প্রতিটি ক্যাম্পেইন পরিমাপযোগ্য করতে ট্র্যাকিং কনফিগার করা।'},
  {t:'অ্যানালিটিক্স ও সার্চ কনসোল', d:'গুগল অ্যানালিটিক্স ও সার্চ কনসোল সংযুক্ত ও যাচাইকৃত।'},
  {t:'বেসিক SEO সেটআপ', d:'সার্চ ইঞ্জিন যাতে আপনাকে খুঁজে পায়, তার মৌলিক ভিত্তি।'},
  {t:'মার্কেটিং স্ট্র্যাটেজি', d:'আপনার প্রথম কাস্টমারদের কাছে পৌঁছানোর একটি শুরুর পরিকল্পনা।'},
  {t:'লঞ্চ প্রিপারেশন', d:'লাইভ হওয়ার আগে প্রতিটি সিস্টেমের চূড়ান্ত পর্যালোচনা।'}
];

const icons = [
  '<path d="M12 2l2.8 6.3L21 9l-5 4.6L17.4 21 12 17.6 6.6 21 8 13.6 3 9l6.2-.7z"/>',
  '<circle cx="12" cy="12" r="8"/><path d="M12 4v16M4 12h16"/>',
  '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18"/>',
  '<path d="M3 12h18M3 6h18M3 18h18"/>',
  '<circle cx="9" cy="9" r="1.5"/><circle cx="15" cy="9" r="1.5"/><path d="M4 20l4-9 4 6 4-8 4 11z"/>',
  '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 4 6 4 9s-1.5 6.5-4 9c-2.5-2.5-4-6-4-9s1.5-6.5 4-9z"/>',
  '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 8l9 6 9-6"/>',
  '<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1.4"/><circle cx="15" cy="9" r="1.4"/><circle cx="9" cy="15" r="1.4"/><circle cx="15" cy="15" r="1.4"/>',
  '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
  '<path d="M4 19h16M6 19V9l4-4 4 4v10M14 19v-6h4v6"/>',
  '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  '<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/>',
  '<path d="M5 13l4 4L19 7"/><circle cx="12" cy="12" r="9"/>'
];

const folio = [
  {cat:'branding', tag:'ব্র্যান্ড সিস্টেম', name:'Verdant & Co.', sub:'লোগো, আইডেন্টিটি, গাইডলাইন', c1:'#123322', c2:'#0A0A0A'},
  {cat:'website', tag:'ওয়ার্ডপ্রেস বিল্ড', name:'Northlane Studio', sub:'কর্পোরেট ওয়েবসাইট', c1:'#141824', c2:'#0A0A0A'},
  {cat:'ecommerce', tag:'উকমার্স', name:'Kindred Goods', sub:'অনলাইন স্টোর সেটআপ', c1:'#1a2318', c2:'#0A0A0A'},
  {cat:'corporate', tag:'সম্পূর্ণ সেটআপ', name:'Anchor Legal Group', sub:'ব্র্যান্ড + সাইট + সোশ্যাল', c1:'#151515', c2:'#0d1d15'},
  {cat:'branding', tag:'লোগো ও আইডেন্টিটি', name:'Amber Botanicals', sub:'পার্সোনাল ব্র্যান্ড', c1:'#221812', c2:'#0A0A0A'},
  {cat:'website', tag:'ল্যান্ডিং পেজ', name:'Fieldstone Coaching', sub:'সার্ভিস বিজনেস সাইট', c1:'#101820', c2:'#0A0A0A'}
];

const faqs = [
  {q:'আপনারা ঠিক কী কী সেটআপ করে দেন?', a:'লঞ্চের জন্য প্রয়োজনীয় সবকিছু: আপনার লোগো ও ব্র্যান্ড আইডেন্টিটি, ওয়ার্ডপ্রেস বা উকমার্স ওয়েবসাইট, ডোমেইন, হোস্টিং ও বিজনেস ইমেইল, সোশ্যাল মিডিয়া পেজ, মেটা বিজনেস ম্যানেজার, পিক্সেল ও কনভার্সন API, গুগল অ্যানালিটিক্স ও সার্চ কনসোল, বেসিক SEO এবং একটি প্রাথমিক মার্কেটিং স্ট্র্যাটেজি।'},
  {q:'আমার কি কোনো টেকনিক্যাল জ্ঞান থাকা দরকার?', a:'না। এটাই ডান-ফর-ইউ সেটআপের মূল উদ্দেশ্য — হোস্টিং থেকে পিক্সেল কনফিগারেশন পর্যন্ত প্রতিটি টেকনিক্যাল ধাপ আমরা সামলাই, যাতে আপনাকে কিছু শিখতে না হয়।'},
  {q:'সেটআপ করতে কত সময় লাগে?', a:'বেশিরভাগ সম্পূর্ণ সেটআপ ডিসকভারি থেকে লঞ্চ পর্যন্ত কয়েক সপ্তাহ সময় নেয়, স্কোপের উপর নির্ভর করে। কনসালটেশনের সময় আপনি একটি পরিষ্কার সময়সীমা পাবেন।'},
  {q:'সম্পূর্ণ প্যাকেজের বদলে কি আলাদা সেবা অর্ডার করা যায়?', a:'হ্যাঁ। বেশিরভাগ ক্লায়েন্ট সম্পূর্ণ সেটআপ বেছে নিলেও, আপনি শুধু ব্র্যান্ডিং, শুধু ওয়েবসাইট, বা আপনার ব্যবসার বর্তমান অবস্থার সাথে মানানসই যেকোনো সমন্বয় দিয়ে শুরু করতে পারেন।'},
  {q:'লঞ্চের পর কী হয়?', a:'আপনার ব্যবসা লাইভ হওয়ার পরও আমরা সহায়তার জন্য যোগাযোগযোগ্য থাকি, এবং আপনার প্রবৃদ্ধির সাথে সাথে সেটআপ সমন্বয় বা সম্প্রসারণে সাহায্য করতে পারি।'},
  {q:'এটি মার্কেটিং এজেন্সি থেকে কীভাবে আলাদা?', a:'এই পেজটি নির্দিষ্টভাবে আপনার ফাউন্ডেশন তৈরি নিয়ে — ব্র্যান্ড, ওয়েবসাইট ও টেকনিক্যাল সেটআপ — বিক্রি শুরুর আগে। এটি চলমান মার্কেটিং এক্সিকিউশন বা ট্রেনিং নয়; এটি সেই ভিত্তি যা মার্কেটিংকে সম্ভব করে তোলে।'}
];

const MotionReveal = ({ children, delay = 0, className = '' }) => (
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

function SetupPage() {
  const [filter, setFilter] = useState('all');
  const [openFaq, setOpenFaq] = useState(null);
  const faqRefs = useRef({});

  useEffect(() => {
    if (openFaq !== null && faqRefs.current[openFaq]) {
      faqRefs.current[openFaq].style.maxHeight = faqRefs.current[openFaq].scrollHeight + 'px';
    }
  }, [openFaq]);

  const toggleFaq = (i) => {
    const wasOpen = openFaq === i;
    Object.values(faqRefs.current).forEach(ref => { if (ref) ref.style.maxHeight = null; });
    setOpenFaq(wasOpen ? null : i);
  };

  return (
    <div className="sp">
      <Seo title="সাইফুল স্টুডিও — সম্পূর্ণ বিজনেস সেটআপ" description="ব্র্যান্ডিং, ওয়েবসাইট, সোশ্যাল ও মার্কেটিং — আপনার পুরো বিজনেস সেটআপ একসাথে, ডান-ফর-ইউ।" path="/setup" />

      {/* HERO */}
      <section className="sp-hero">
        <div className="sp-hero-grid"></div>
        <div className="container sp-hero-inner">
          <MotionReveal>
            <span className="eyebrow">ডান-ফর-ইউ বিজনেস সেটআপ</span>
          </MotionReveal>
          <MotionReveal delay={0.08}>
            <h1>আত্মবিশ্বাস নিয়ে আপনার <span className="accent">ব্যবসা লঞ্চ করুন</span></h1>
          </MotionReveal>
          <MotionReveal delay={0.16}>
            <p className="lead">আপনি আপনার ব্যবসায় মনোযোগ দিন। লঞ্চের জন্য প্রয়োজনীয় সবকিছু আমরা তৈরি করে দিচ্ছি — ব্র্যান্ডিং, ওয়েবসাইট, সোশ্যাল প্রেজেন্স এবং মার্কেটিং ফাউন্ডেশন, সম্পূর্ণভাবে।</p>
          </MotionReveal>
          <MotionReveal delay={0.24}>
            <div className="hero-ctas">
              <a href="#cta" className="btn btn-primary">ফ্রি কনসালটেশন বুক করুন</a>
              <a href="#sp-portfolio" className="btn btn-ghost">পোর্টফোলিও দেখুন</a>
            </div>
            <p className="hero-note">কোনো টেকনিক্যাল জ্ঞানের প্রয়োজন নেই · কয়েক মাস নয়, কয়েক সপ্তাহে লঞ্চ-রেডি</p>
          </MotionReveal>

          <MotionReveal delay={0.24}>
            <div className="console">
              <div className="console-bar">
                <span className="console-dot"></span><span className="console-dot"></span><span className="console-dot"></span>
                <span className="console-title">setup.saifulstudios — আপনার ব্যবসা তৈরি হচ্ছে</span>
              </div>
              <div className="console-body">
                {['ব্র্যান্ড আইডেন্টিটি', 'ওয়েবসাইট', 'সোশ্যাল পেজ', 'পিক্সেল ও অ্যানালিটিক্স', 'ডোমেইন ও ইমেইল', 'বেসিক SEO', 'মার্কেটিং বেস', 'লঞ্চ প্রিপারেশন'].map((label, i) => (
                  <div key={i} className="console-node" style={{ animationDelay: `${(i + 1) * 0.1}s` }}>
                    <div className="n-top">
                      <span className="n-id">MOD_{String(i + 1).padStart(2, '0')}</span>
                      <span className="n-status"></span>
                    </div>
                    <span className="n-label">{label}</span>
                  </div>
                ))}
              </div>
              <div className="console-foot">
                <span>৮ / ৮ মডিউল কনফিগার সম্পন্ন</span>
                <span className="go">● লঞ্চের জন্য প্রস্তুত</span>
              </div>
            </div>
          </MotionReveal>
        </div>
      </section>

      {/* PROBLEMS */}
      <section className="sp-section sp-section-light">
        <div className="container">
          <MotionReveal className="sec-head">
            <span className="eyebrow">সাইফুল স্টুডিওর আগে</span>
            <h2>ব্যবসা শুরু করা এত কঠিন হওয়ার কথা নয়</h2>
            <p>বেশিরভাগ উদ্যোক্তা প্রথম বিক্রির আগেই আটকে যান — আইডিয়া দুর্বল বলে নয়, বরং ফাউন্ডেশন তৈরি না থাকার কারণে।</p>
          </MotionReveal>
          <div className="grid-3">
            {[
              {icon:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5"/><circle cx="12" cy="16.5" r=".6" fill="currentColor"/>', t:'কোথা থেকে শুরু করবেন জানেন না', d:'অনেক কাজ, কোনো পরিষ্কার ধাপ নেই, এবং পথ দেখানোর কেউ নেই।'},
              {icon:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 9h8M8 13h5"/>', t:'লোগো বা ব্র্যান্ডিং নেই', d:'ব্যবসাকে বিশ্বাসযোগ্য বা মনে রাখার মতো কিছু নেই।'},
              {icon:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 4 6 4 9s-1.5 6.5-4 9c-2.5-2.5-4-6-4-9s1.5-6.5 4-9z"/>', t:'প্রফেশনাল ওয়েবসাইট নেই', d:'কাস্টমার পাঠানোর জায়গা নেই, অনলাইনে বিক্রির কোনো উপায় নেই।'},
              {icon:'<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 8l9 6 9-6"/>', t:'সোশ্যাল মিডিয়া প্রেজেন্স নেই', d:'সঠিকভাবে সেটআপ করা পেজ নেই, কাস্টমাররা খুঁজে পান না।'},
              {icon:'<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/>', t:'মার্কেটিং ফাউন্ডেশন নেই', d:'কোনো ট্র্যাকিং, পিক্সেল বা অ্যানালিটিক্স নেই — লঞ্চের পর কী কাজ করছে জানার উপায় নেই।'},
              {icon:'<path d="M12 3 4 7v6c0 4.5 3.4 7.7 8 9 4.6-1.3 8-4.5 8-9V7l-8-4z"/><path d="M9 12l2 2 4-4"/>', t:'ভুল সিদ্ধান্তের ভয়', d:'ভুল ফ্রিল্যান্সার নিয়োগ বা টাকা নষ্ট হওয়ার দুশ্চিন্তা।'}
            ].map((item, i) => (
              <MotionReveal key={i} delay={i * 0.08} className="p-card">
                <div className="p-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" dangerouslySetInnerHTML={{ __html: item.icon }} /></div>
                <h4>{item.t}</h4>
                <p>{item.d}</p>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="sp-section sp-section-alt" id="solution">
        <div className="container">
          <div className="solution-wrap">
            <div className="solution-copy">
              <MotionReveal>
                <span className="eyebrow">সমাধান</span>
                <h2>একজন পার্টনার। আপনার লঞ্চের প্রতিটি অংশ, একসাথে।</h2>
                <p>সাইফুল স্টুডিও আপনার সম্পূর্ণ বিজনেস সেটআপ পার্টনার। পাঁচজন ফ্রিল্যান্সার নিয়োগ করে সমন্বয়ের আশা করার বদলে, আপনি পাচ্ছেন একটি টিম যারা আপনার ব্র্যান্ড, ওয়েবসাইট এবং অনলাইন উপস্থিতি একটি সংযুক্ত সিস্টেম হিসেবে তৈরি করে।</p>
                <p>আমরা শেখাই না — আমরা করে দিই, যাতে আপনি সময় ব্যয় করতে পারেন ব্যবসার আসল কাজে।</p>
                <div className="solution-stats">
                  <div><strong>১৪</strong><span>সেটআপ সেবা</span></div>
                  <div><strong>১</strong><span>ডেডিকেটেড টিম</span></div>
                  <div><strong>১০০%</strong><span>ডান-ফর-ইউ</span></div>
                </div>
              </MotionReveal>
            </div>
            <MotionReveal delay={0.16} className="solution-visual">
              {['logo-design.setup', 'brand-identity.setup', 'wordpress-site.setup', 'woocommerce-store.setup', 'social-pages.setup', 'meta-pixel.setup', 'launch-prep.setup'].map((item, i) => (
                <div key={i} className="sv-row" style={i === 6 ? { marginBottom: 0 } : {}}>
                  <div className="sv-check"><svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="3"><path d="M4 12l5 5L20 6"/></svg></div>
                  <span>{item}</span>
                </div>
              ))}
            </MotionReveal>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="sp-section sp-section-light" id="services">
        <div className="container">
          <MotionReveal className="sec-head">
            <span className="eyebrow">আমরা যা তৈরি করি</span>
            <h2>লঞ্চের জন্য আপনার ব্যবসার সবকিছু</h2>
            <p>চৌদ্দটি সেবা, একটি সমন্বিত সেটআপ। সম্পূর্ণ প্যাকেজ অথবা আপনার প্রয়োজনীয় অংশগুলো বেছে নিন।</p>
          </MotionReveal>
          <div className="grid-4" id="serviceGrid">
            {services.map((s, i) => (
              <MotionReveal key={i} delay={(i % 3) * 0.08} className="svc-card">
                <div className="svc-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: icons[i] }} /></div>
                <h4>{s.t}</h4>
                <p>{s.d}</p>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="sp-section sp-section-alt" id="process">
        <div className="container">
          <MotionReveal className="sec-head">
            <span className="eyebrow">কীভাবে কাজ করি</span>
            <h2>আইডিয়া থেকে লঞ্চ পর্যন্ত পরিষ্কার পথ</h2>
            <p>আটটি ধাপ, সম্পূর্ণভাবে পরিচালিত, যাতে আপনি সবসময় জানেন কী হচ্ছে এবং পরবর্তীতে কী।</p>
          </MotionReveal>
          <div className="process" style={{ maxWidth: 640 }}>
            <div className="process-line"></div>
            {[
              {num:'০১', t:'ডিসকভারি', d:'কিছু তৈরি করার আগে আমরা আপনার ব্যবসা, কাস্টমার ও লক্ষ্য বুঝে নিই।'},
              {num:'০২', t:'পরিকল্পনা', d:'একটি পরিষ্কার সেটআপ রোডম্যাপ — কী তৈরি হবে, কোন ক্রমে, কখন সম্পন্ন হবে।'},
              {num:'০৩', t:'ব্র্যান্ড ডিজাইন', d:'লোগো, রং, টাইপোগ্রাফি এবং ভিজ্যুয়াল আইডেন্টিটি যা সম্পূর্ণভাবে আপনার মতো মনে হয়।'},
              {num:'০৪', t:'ওয়েবসাইট ডেভেলপমেন্ট', d:'আপনার ওয়ার্ডপ্রেস বা উকমার্স সাইট, কনভার্সনের জন্য ডিজাইন করা।'},
              {num:'০৫', t:'সোশ্যাল সেটআপ', d:'ফেসবুক, ইনস্টাগ্রাম, লিংকডইন ও টিকটক পেজ, প্রফেশনালভাবে সেটআপ।'},
              {num:'০৬', t:'মার্কেটিং ফাউন্ডেশন', d:'মেটা বিজনেস ম্যানেজার, পিক্সেল, কনভার্সন API, অ্যানালিটিক্স ও সার্চ কনসোল — সংযুক্ত।'},
              {num:'০৭', t:'টেস্টিং', d:'কাস্টমারের কাছে পৌঁছানোর আগে প্রতিটি পেজ, লিংক ও পিক্সেল যাচাই করা হয়।'},
              {num:'০৮', t:'লঞ্চ', d:'আপনার ব্যবসা লাইভ — প্রফেশনাল, সংযুক্ত এবং বিক্রির জন্য প্রস্তুত।'}
            ].map((step, i) => (
              <MotionReveal key={i} className={`p-step ${i === 0 ? 'active' : ''}`}>
                <div className="p-num">{step.num}</div>
                <div>
                  <h4>{step.t}</h4>
                  <p>{step.d}</p>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="sp-section sp-section-dark">
        <div className="container">
          <MotionReveal className="sec-head">
            <span className="eyebrow">কেন সাইফুল স্টুডিও</span>
            <h2>যারা আপনার লঞ্চকে ঠিক আপনার মতোই গুরুত্ব দিয়ে দেখে</h2>
          </MotionReveal>
          <div className="why-grid">
            {[
              {num:'০১', t:'প্রফেশনাল ডিজাইন', d:'প্রতিটি অ্যাসেট প্রিমিয়াম, ব্র্যান্ড-সামঞ্জস্যপূর্ণ মান অনুযায়ী তৈরি — কোনো টেমপ্লেট নয়।'},
              {num:'০২', t:'বিজনেস-ফোকাসড স্ট্র্যাটেজি', d:'সিদ্ধান্ত নেওয়া হয় ব্যবসার প্রবৃদ্ধির কথা মাথায় রেখে, পোর্টফোলিওতে ভালো দেখানোর জন্য নয়।'},
              {num:'০৩', t:'টেকনিক্যাল দক্ষতা', d:'হোস্টিং, পিক্সেল, API এবং অ্যানালিটিক্স প্রথমবারেই সঠিকভাবে কনফিগার করা।'},
              {num:'০৪', t:'আধুনিক প্রযুক্তি', d:'বর্তমান, নির্ভরযোগ্য টুলের উপর তৈরি — পুরনো বা রক্ষণাবেক্ষণে কঠিন কিছু নয়।'},
              {num:'০৫', t:'দ্রুত ডেলিভারি', d:'নির্দিষ্ট সময়সীমা ও সাপ্তাহিক অগ্রগতি, কোনো অনির্দিষ্ট প্রজেক্ট নয়।'},
              {num:'০৬', t:'চলমান সহায়তা', d:'লঞ্চের পরও আমরা যোগাযোগযোগ্য থাকি — এটা হ্যান্ড-অফ করে চলে যাওয়া নয়।'}
            ].map((item, i) => (
              <MotionReveal key={i} className="why-item">
                <div className="wi-num">{item.num}</div>
                <h4>{item.t}</h4>
                <p>{item.d}</p>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="sp-section sp-section-light" id="sp-portfolio">
        <div className="container">
          <MotionReveal className="sec-head">
            <span className="eyebrow">আমাদের কাজ</span>
            <h2>সাম্প্রতিক বিজনেস সেটআপ</h2>
            <p>আমরা যেসব ব্র্যান্ড, স্টোর ও ওয়েবসাইট লঞ্চ করেছি তার কিছু নমুনা।</p>
          </MotionReveal>
          <div className="filters">
            {[
              {key:'all', label:'সব'},
              {key:'branding', label:'ব্র্যান্ডিং'},
              {key:'website', label:'ওয়েবসাইট'},
              {key:'ecommerce', label:'ই-কমার্স'},
              {key:'corporate', label:'কর্পোরেট'}
            ].map((f) => (
              <button key={f.key} className={`filter-btn${filter === f.key ? ' active' : ''}`} onClick={() => setFilter(f.key)}>{f.label}</button>
            ))}
          </div>
          <div className="grid-3">
            {folio.filter(f => filter === 'all' || f.cat === filter).map((f, i) => (
              <MotionReveal key={i} delay={(i % 3) * 0.08} className="folio-card">
                <div className="folio-preview" style={{ '--fc1': f.c1, '--fc2': f.c2 }}>
                  <span className="fp-tag">{f.tag}</span>
                </div>
                <div className="folio-meta">
                  <div className="fm-cat">{f.cat}</div>
                  <h4>{f.name}</h4>
                  <p>{f.sub}</p>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* INCLUDED */}
      <section className="sp-section sp-section-alt">
        <div className="container">
          <div className="incl-wrap">
            <div>
              <MotionReveal>
                <span className="eyebrow">কী কী অন্তর্ভুক্ত</span>
                <h2 style={{ fontSize: 'clamp(26px, 3.6vw, 36px)', marginBottom: 34 }}>আপনার সেটআপ প্যাকেজে যা যা থাকছে</h2>
              </MotionReveal>
              <div className="incl-list">
                {[
                  'কাস্টম লোগো ও ব্র্যান্ড আইডেন্টিটি কিট',
                  'ওয়ার্ডপ্রেস বা উকমার্স ওয়েবসাইট',
                  'ডোমেইন ও হোস্টিং সেটআপ',
                  'বিজনেস ইমেইল সেটআপ',
                  'ফেসবুক, ইনস্টাগ্রাম, লিংকডইন ও টিকটক পেজ',
                  'মেটা বিজনেস ম্যানেজার কনফিগারেশন',
                  'মেটা পিক্সেল ও কনভার্সন API সেটআপ',
                  'গুগল অ্যানালিটিক্স ও সার্চ কনসোল',
                  'বেসিক SEO সেটআপ',
                  'প্রাথমিক মার্কেটিং স্ট্র্যাটেজি',
                  'সম্পূর্ণ লঞ্চ প্রিপারেশন ও টেস্টিং'
                ].map((item, i) => (
                  <MotionReveal key={i} className="incl-row">
                    <div className="incl-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 12l5 5L20 6"/></svg></div>
                    <span>{item}</span>
                  </MotionReveal>
                ))}
              </div>
            </div>
            <MotionReveal delay={0.16} className="incl-card">
              <div className="ic-eyebrow">সেটআপ প্যাকেজ</div>
              <h3>আপনার ফাউন্ডেশন তৈরি করতে প্রস্তুত?</h3>
              <p>আপনার ব্যবসা সম্পর্কে বলুন, আমরা ঠিক করে দেব আপনার সেটআপে কী কী প্রয়োজন — কোনো চাপ নেই, কোনো জটিল শব্দ নেই।</p>
              <a href="#cta" className="btn btn-primary" style={{ width: '100%' }}>ফ্রি কনসালটেশন বুক করুন</a>
            </MotionReveal>
          </div>
        </div>
      </section>

      {/* BEFORE/AFTER */}
      <section className="sp-section sp-section-light">
        <div className="container">
          <MotionReveal className="sec-head">
            <span className="eyebrow">রূপান্তর</span>
            <h2>আইডিয়া থেকে লঞ্চ-রেডি পর্যন্ত</h2>
          </MotionReveal>
          <div className="ba-wrap">
            <MotionReveal className="ba-col ba-before">
              <h4>আগে</h4>
              {['কোনো ব্র্যান্ডিং নেই', 'কোনো ওয়েবসাইট নেই', 'কোনো আইডেন্টিটি নেই', 'কোনো স্ট্র্যাটেজি নেই', 'কোনো সোশ্যাল প্রেজেন্স নেই'].map((item, i) => (
                <div key={i} className="ba-row">
                  <div className="ba-x"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 6l12 12M18 6L6 18"/></svg></div>
                  {item}
                </div>
              ))}
            </MotionReveal>
            <MotionReveal delay={0.16} className="ba-col ba-after">
              <h4>পরে</h4>
              {['প্রফেশনাল ব্র্যান্ড', 'কনভার্সন-রেডি ওয়েবসাইট', 'সম্পূর্ণ অনলাইন উপস্থিতি', 'মার্কেটিং রেডি', 'লঞ্চ রেডি'].map((item, i) => (
                <div key={i} className="ba-row">
                  <div className="ba-ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 12l5 5L20 6"/></svg></div>
                  {item}
                </div>
              ))}
            </MotionReveal>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="sp-section sp-section-alt">
        <div className="container">
          <MotionReveal className="sec-head">
            <span className="eyebrow">ক্লায়েন্ট ফলাফল</span>
            <h2>যারা আমাদের সাথে লঞ্চ করেছেন</h2>
          </MotionReveal>
          <div className="grid-3">
            {[
              {q:'আমার কোনো টেকনিক্যাল জ্ঞান ছিল না এবং আমি সম্পূর্ণ দিশেহারা ছিলাম। সাইফুল স্টুডিও সবকিছু সামলেছে — লঞ্চের দিন আমি শুধু হাজির হয়েছি।', n:'রফিক আহমেদ', s:'প্রতিষ্ঠাতা, লোকাল রিটেইল ব্র্যান্ড', a:'রআ'},
              {q:'আমাদের স্টোর একটি নোটবুকের আইডিয়া থেকে ট্র্যাকিং ও সোশ্যাল পেজসহ সম্পূর্ণ কার্যকর উকমার্স সাইটে পরিণত হয়েছে মাত্র কয়েক সপ্তাহে।', n:'নুসরাত সুলতানা', s:'প্রতিষ্ঠাতা, ই-কমার্স স্টার্টআপ', a:'নস'},
              {q:'শুধু ব্র্যান্ড আইডেন্টিটিই আমাদের দশগুণ বেশি বিশ্বাসযোগ্য দেখিয়েছে। লঞ্চ করার সাথে সাথেই ক্লায়েন্টরা আমাদের সিরিয়াসলি নিতে শুরু করেছে।', n:'তানভীর হাসান', s:'প্রতিষ্ঠাতা, সার্ভিস বিজনেস', a:'তহ'}
            ].map((t, i) => (
              <MotionReveal key={i} delay={i * 0.08} className="t-card">
                <div className="t-stars">★★★★★</div>
                <p>{t.q}</p>
                <div className="t-person">
                  <div className="t-avatar">{t.a}</div>
                  <div>
                    <strong>{t.n}</strong>
                    <span>{t.s}</span>
                  </div>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sp-section sp-section-light" id="faq">
        <div className="container" style={{ maxWidth: 820 }}>
          <MotionReveal className="sec-head">
            <span className="eyebrow">প্রশ্নোত্তর</span>
            <h2>সাধারণ জিজ্ঞাসা</h2>
          </MotionReveal>
          <div>
            {faqs.map((f, i) => (
              <div key={i} className={`faq-item${openFaq === i ? ' open' : ''}`}>
                <div className="faq-q" onClick={() => toggleFaq(i)}>
                  <span>{f.q}</span>
                  <span className="fq-plus"></span>
                </div>
                <div className="faq-a" ref={el => faqRefs.current[i] = el}>
                  <p>{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="sp-section sp-section-dark" id="cta">
        <div className="container">
          <MotionReveal className="final-cta">
            <span className="eyebrow" style={{ justifyContent: 'center' }}>আপনি প্রস্তুত হলেই আমরা প্রস্তুত</span>
            <h2>আজই আপনার ব্যবসা প্রফেশনালভাবে লঞ্চ করুন</h2>
            <p>একটি ফ্রি কনসালটেশন বুক করুন এবং আমরা ঠিক বের করে দেব আপনার বিজনেস সেটআপে কী কী প্রয়োজন। কোনো চাপ নেই, কোনো জটিল শব্দ নেই, কোনো অনুমান নেই।</p>
            <div className="hero-ctas">
              <a href="#" className="btn btn-primary">ফ্রি কনসালটেশন বুক করুন</a>
              <a href="#sp-portfolio" className="btn btn-ghost">পোর্টফোলিও দেখুন</a>
            </div>
          </MotionReveal>
        </div>
      </section>
    </div>
  );
}

export default SetupPage;
