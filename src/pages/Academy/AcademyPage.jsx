import { useState } from 'react';
import { motion } from 'framer-motion';
import Seo from '../../components/Seo';
import { staggerContainer, fadeUp } from '../../motion/presets';
import './AcademyPage.css';
import './AcademyPage.responsive.css';

const MODULES = [
  { num: '01', title: 'Business Foundation', lessons: '৬ লেসন', resources: '৫ Resources', time: '২ ঘণ্টা' },
  { num: '02', title: 'Product Research', lessons: '৮ লেসন', resources: '৭ Resources', time: '৩ ঘণ্টা' },
  { num: '03', title: 'Brand Identity', lessons: '৭ লেসন', resources: '৬ Resources', time: '২.৫ ঘণ্টা' },
  { num: '04', title: 'Website', lessons: '৯ লেসন', resources: '৮ Resources', time: '৪ ঘণ্টা' },
  { num: '05', title: 'Content Marketing', lessons: '১০ লেসন', resources: '৯ Resources', time: '৩.৫ ঘণ্টা' },
  { num: '06', title: 'Facebook Ads', lessons: '৮ লেসন', resources: '৬ Resources', time: '৩ ঘণ্টা' },
  { num: '07', title: 'Sales Funnel', lessons: '৭ লেসন', resources: '৫ Resources', time: '২.৫ ঘণ্টা' },
  { num: '08', title: 'Business Growth', lessons: '৬ লেসন', resources: '৭ Resources', time: '৩ ঘণ্টা' },
];

const BONUS_ITEMS = [
  'SOP Library', 'Business Templates', 'AI Prompt Library',
  'Business Checklist', 'Marketing Swipe File', 'Business Reading Guide', 'Lifetime Update',
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

function AcademyPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="page academy-page">
      <Seo
        title="Saiful Studios Academy — সম্পূর্ণ ই-কমার্স বিজনেস মেন্টরশিপ প্রোগ্রাম"
        description="শূন্য থেকে নিজের সফল ই-কমার্স ব্যবসা শুরু করুন। লাইভ Google Meet ক্লাস, বাস্তব Assignment, Community Support ও ব্যক্তিগত গাইডলাইন।"
        path="/academy"
      />

      {/* HERO */}
      <section className="academy-hero">
        <div className="wrap" style={{ paddingTop: 60, paddingBottom: 80 }}>
          <div className="hero-grid">
            <MotionStagger>
              <motion.span className="eyebrow" variants={fadeUp}>🚀 বাংলাদেশের Complete Ecommerce Business Mentorship Program</motion.span>
              <motion.h1 variants={fadeUp}>শূন্য থেকে নিজের সফল <span>ই-কমার্স ব্যবসা</span> শুরু করুন</motion.h1>
              <motion.p className="hero-sub" variants={fadeUp}>ভিডিও দেখে শেখা নয়। লাইভ Google Meet ক্লাস, বাস্তব Assignment, Community Support, Business Roadmap এবং ব্যক্তিগত গাইডলাইনের মাধ্যমে ধাপে ধাপে নিজের ব্যবসা তৈরি করুন।</motion.p>
              <motion.div className="hero-cta-row" variants={fadeUp}>
                <a href="#pricing" className="btn btn-primary btn-lg">👉 এখনই ভর্তি হোন</a>
                <a href="#enroll" className="btn btn-outline btn-lg">📞 ফ্রি কনসালটেশন নিন</a>
              </motion.div>
              <motion.div className="hero-trust" variants={fadeUp}>
                <div className="avatars"><span>আ</span><span>র</span><span>স</span><span>ম</span></div>
                <span>৩০০০+ শিক্ষার্থী একসাথে শিখছেন এই প্রোগ্রামে</span>
              </motion.div>
            </MotionStagger>

            <MotionFade>
              <div className="dash">
                <div className="dash-top">
                  <div className="dots"><span /><span /><span /></div>
                  <div className="title">Student Dashboard</div>
                  <div style={{ width: 40 }} />
                </div>
                <div className="dash-body">
                  <div className="dash-live">
                    <span className="pulse" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: '#9CA3AF' }}>আজকের লাইভ ক্লাস</div>
                      <div style={{ fontWeight: 600 }}>মডিউল ০৪ — ই-কমার্স ওয়েবসাইট সেটআপ</div>
                    </div>
                    <span className="chip live-chip">LIVE</span>
                  </div>
                  <div className="dash-row">
                    <div className="dash-card">
                      <div className="label">সম্পূর্ণ অগ্রগতি</div>
                      <div className="value">৬৪%</div>
                      <div className="dash-progress"><div style={{ width: '64%' }} /></div>
                    </div>
                    <div className="dash-card">
                      <div className="label">সম্পন্ন মডিউল</div>
                      <div className="value">৫ / ৮</div>
                      <div className="dash-progress"><div style={{ width: '62%' }} /></div>
                    </div>
                  </div>
                  <div className="dash-list">
                    <div className="dash-list-item"><div className="ic">📚 মডিউল ও লেসন</div><span className="chip">৮ মডিউল</span></div>
                    <div className="dash-list-item"><div className="ic">👥 প্রাইভেট কমিউনিটি</div><span className="chip">নতুন পোস্ট</span></div>
                    <div className="dash-list-item"><div className="ic">📁 SOP ও Resources</div><span className="chip">৪০+ ফাইল</span></div>
                  </div>
                </div>
              </div>
            </MotionFade>
          </div>
        </div>

        <div className="eco-bar">
          <div className="wrap">
            <div className="eco-flow">
              <div className="eco-step">🎓 Academy</div>
              <span className="eco-arrow">→</span>
              <div className="eco-step">🛠 Setup</div>
              <span className="eco-arrow">→</span>
              <div className="eco-step">📈 Growth</div>
            </div>
            <p className="eco-caption">প্রথমে শিখুন → তারপর ব্যবসা সেটআপ করুন → এরপর আমাদের সাথে ব্যবসা গ্রোথ করুন।</p>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="trust-bar">
        <div className="wrap trust-grid">
          {['২০০+', '৩০০০+', '৮+', '৪.৯★'].map((num, i) => (
            <div key={i}>
              <div className="trust-num"><span>{num}</span></div>
              <div className="trust-label">{['ব্যবসা সফলভাবে গাইড করেছি', 'শিক্ষার্থী', 'বছরের অভিজ্ঞতা', 'গড় রেটিং'][i]}</div>
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
              {['না বুঝে ব্যবসা শুরু', 'Product Research নেই', 'Brand Identity নেই', 'Professional Website নেই', 'Content Strategy নেই', 'Marketing Plan নেই', 'Sales Funnel নেই'].map((item, i) => (
                <div key={i} className="ps-item"><span className="ps-ic">❌</span>{item}</div>
              ))}
            </div>
            <div className="ps-card after">
              <div className="ps-tag green">🟢 পরে</div>
              <h3>আমাদের Mentorship-এ যা শিখবেন</h3>
              {['Product Research Framework', 'Professional Branding', 'Ecommerce Website', 'Content Strategy', 'Digital Marketing', 'Sales System', 'Business Automation'].map((item, i) => (
                <div key={i} className="ps-item"><span className="ps-ic">✅</span>{item}</div>
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
              { ic: '🎥', title: 'Live Google Meet Class', desc: 'প্রতি সপ্তাহে সরাসরি লাইভ ক্লাসে যুক্ত হয়ে প্রশ্ন করার সুযোগ পাবেন।' },
              { ic: '👥', title: 'Private Community', desc: 'একই লক্ষ্যের উদ্যোক্তাদের সাথে যুক্ত থেকে একে অপরকে সহায়তা করুন।' },
              { ic: '📋', title: 'SOP Library', desc: 'রেডিমেড Standard Operating Procedure দিয়ে ব্যবসা দ্রুত গুছিয়ে নিন।' },
              { ic: '🤖', title: 'AI Prompt Library', desc: 'কন্টেন্ট, মার্কেটিং ও কাস্টমার সার্ভিসের জন্য প্রস্তুত AI প্রম্পট পাবেন।' },
              { ic: '📚', title: 'Assignment Review', desc: 'প্রতিটি অ্যাসাইনমেন্ট মেন্টর সরাসরি রিভিউ করে ফিডব্যাক দেবেন।' },
              { ic: '💬', title: 'Lifetime Support', desc: 'কোর্স শেষেও আজীবন সাপোর্ট ও আপডেট পেতে থাকবেন।' },
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
            <p>৮টি গোছানো মডিউল, যা একে অপরের সাথে যুক্ত হয়ে আপনার ব্যবসাকে দাঁড় করাবে।</p>
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
                <span className="module-num">Module {m.num}</span>
                <h3>{m.title}</h3>
                <div className="module-meta">
                  <span>🎬 {m.lessons}</span>
                  <span>📁 {m.resources}</span>
                  <span>⏱ {m.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BONUS */}
      <section className="section-pad">
        <div className="wrap">
          <MotionFade className="bonus-banner">
            <div>
              <h2>আপনি Bonus হিসেবে যা পাবেন</h2>
              <p>ভর্তি হলেই সম্পূর্ণ ফ্রি — অতিরিক্ত কোনো খরচ ছাড়াই।</p>
            </div>
            <div className="bonus-price">Worth ২০,০০০+ টাকা</div>
          </MotionFade>
          <div className="grid-bonus">
            {BONUS_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                className="bonus-card"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="ic">🎁</div>
                <h3>{item}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MENTOR */}
      <section className="section-pad bg-light" id="mentor">
        <div className="wrap mentor-grid">
          <MotionFade className="mentor-photo">👨‍💼</MotionFade>
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
                <div className="testi-video"><div className="play-btn">▶</div></div>
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
                <input type="text" placeholder="আপনার পূর্ণ নাম লিখুন" />
              </div>
              <div className="form-row">
                <label>মোবাইল</label>
                <input type="tel" placeholder="০১XXXXXXXXX" />
              </div>
            </div>
            <div className="form-row">
              <label>ইমেইল</label>
              <input type="email" placeholder="you@example.com" />
            </div>
            <div className="form-row">
              <label>বর্তমানে ব্যবসা করছেন?</label>
              <select>
                <option>হ্যাঁ, বর্তমানে ব্যবসা করছি</option>
                <option>না, নতুন শুরু করতে চাই</option>
                <option>পরিকল্পনা করছি</option>
              </select>
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
            <h2>আজই নিজের সফল ই-কমার্স ব্যবসার যাত্রা শুরু করুন।</h2>
            <p>একটি সঠিক সিদ্ধান্ত আপনার ভবিষ্যৎ বদলে দিতে পারে।</p>
            <div className="final-cta-row">
              <a href="#pricing" className="btn btn-white btn-lg">🚀 এখনই ভর্তি হোন</a>
              <a href="#" className="btn btn-ghost-white btn-lg">💬 WhatsApp-এ কথা বলুন</a>
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
