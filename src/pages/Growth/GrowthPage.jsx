import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import Seo from '../../components/Seo';
import './GrowthPage.css';
import './GrowthPage.responsive.css';

const ICONS = {
  cross: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 12l5 5L20 6"/></svg>',
  strategy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
  research: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5V5a2 2 0 0 1 2-2h11l3 3v13.5"/><path d="M8 8h9M8 12h9M8 16h5"/></svg>',
  design: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18"/><path d="M2 2l7.6 7.6"/></svg>',
  launch: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M13 3s5 1 6 6-2 7-2 7l-5 1-1-5s2-8 2-9z"/><path d="M8 16l-4 4M7.5 12.5C5 12 3 14 3 18c4 0 6-2 5.5-4.5z"/></svg>',
  optimize: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h10M4 18h6"/><circle cx="18" cy="12" r="2.2"/><circle cx="15" cy="18" r="2.2"/></svg>',
  scale: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20L20 4M20 4h-6M20 4v6"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/></svg>',
  meta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15c0-5 2.5-8 5-8s3.5 3.5 4 6c.5-2.5 1.5-6 4-6s5 3 5 8"/></svg>',
  google: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="12" r="8.5"/><path d="M11 12h9"/></svg>',
  motion: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 8l6 4-6 4V8z"/></svg>',
  video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5.5" width="14" height="13" rx="2"/><path d="M16.5 10l5-3v10l-5-3"/></svg>',
  social: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  landing: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 8h18"/></svg>',
  cro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12l5 5L21 4"/></svg>',
  analytics: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10M11 20V4M18 20v-7"/></svg>',
  pixel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M22 12h-4M6 12H2M19 5l-2.8 2.8M7.8 16.2 5 19M19 19l-2.8-2.8M7.8 7.8 5 5"/></svg>',
  server: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',
  ga4: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="17" r="3"/><circle cx="17" cy="17" r="3"/><circle cx="17" cy="7" r="3"/><path d="M7 14V7l7 3"/></svg>',
  gtm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 12.3 13.4 3a2 2 0 0 0-3 0L3.5 12.3a2 2 0 0 0 0 2.4l6.9 9.3a2 2 0 0 0 3 0l6.9-9.3a2 2 0 0 0 .2-2.4z"/></svg>',
  remarket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/></svg>',
  ai: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3z"/><path d="M19 15l.8 2.1L22 18l-2.2.9L19 21l-.8-2.1L16 18l2.2-.9L19 15z"/></svg>',
  audit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
  sales: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></svg>',
  spend: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M15 9.5c0-1.4-1.3-2.5-3-2.5s-3 1-3 2.3 1.2 1.9 3 2.2 3 .9 3 2.2-1.3 2.3-3 2.3-3-1-3-2.4"/></svg>',
  roas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V9M10 19V5M16 19v-7M22 19V3"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/><path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="0.6" fill="currentColor"/></svg>',
  track: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4v16h16"/><path d="M8 15l3-4 3 2 4-6"/></svg>',
  report: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
};

const serviceIcons = [
  ICONS.strategy, ICONS.meta, ICONS.google, ICONS.design,
  ICONS.motion, ICONS.video, ICONS.social, ICONS.landing,
  ICONS.cro, ICONS.analytics, ICONS.pixel, ICONS.server,
  ICONS.ga4, ICONS.gtm, ICONS.remarket, ICONS.ai,
];

const roadmapIcons = [ICONS.research, ICONS.strategy, ICONS.design, ICONS.launch, ICONS.optimize, ICONS.scale];
const resultIcons = [ICONS.sales, ICONS.target, ICONS.track, ICONS.spend, ICONS.roas, ICONS.cart];

function animateCount(el, end, suffix, decimals) {
  const dur = 1400;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = end * eased;
    el.textContent = (decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString()) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function useScrollReveal(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    el.querySelectorAll('.reveal').forEach((child) => io.observe(child));
    return () => io.disconnect();
  }, [ref]);
}

function SectionHead({ eyebrow, title, sub, center, dark }) {
  return (
    <div className={`head${center ? ' center' : ''}${dark ? '' : ''}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {sub && <p className={!dark ? 'on-light-text' : ''}>{sub}</p>}
    </div>
  );
}

function Ticker({ items }) {
  const track = useRef(null);
  useScrollReveal(track);
  return (
    <div className="ticker-wrap" ref={track}>
      <div className="ticker-track">
        {[...Array(2)].flatMap((_, r) =>
          items.map(([label, val], i) => (
            <span key={`${r}-${i}`}>
              {label} <b className="up">{val}</b>
            </span>
          ))
        )}
      </div>
    </div>
  );
}

function Dashboard({ t }) {
  const dashRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = dashRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const metrics = dashRef.current.querySelectorAll('[data-count]');
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const el = e.target;
          const end = parseFloat(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          const decimals = el.dataset.count.includes('.') ? 1 : 0;
          animateCount(el, end, suffix, decimals);
          countIO.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    metrics.forEach((el) => countIO.observe(el));

    const revEl = document.getElementById('gpRevNum');
    if (revEl) {
      let v = 0, target = 248000, dur = 1800, start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
        v = Math.round(target * eased);
        revEl.textContent = '৳' + v.toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
  }, [visible]);

  return (
    <div className="dash reveal" ref={dashRef}>
      <div className="dash-top">
        <div className="dash-title">
          <span dangerouslySetInnerHTML={{ __html: ICONS.chart }} />
          {t('growth.dashboardTitle')}
        </div>
        <div className="dash-dots"><span></span><span></span><span></span></div>
      </div>
      <div className="dash-chart">
        <div className="dash-chart-head">
          <div>
            <div className="dash-title" style={{ marginBottom: 4 }}>{t('growth.dashboardRevenue')}</div>
            <div className="rev-num" id="gpRevNum">৳0</div>
          </div>
          <div className="rev-up">{t('growth.dashboardRevUp')}</div>
        </div>
        <svg className="dash-svg" viewBox="0 0 300 90" preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C6FF3D" stopOpacity="0.35"/>
              <stop offset="100%" stopColor="#C6FF3D" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path className="gp-area" d="M0,70 L30,60 L60,64 L90,45 L120,50 L150,30 L180,36 L210,18 L240,24 L270,10 L300,14 L300,90 L0,90 Z" fill="url(#areaFill)" opacity="0.8"/>
          <path className="gp-line" d="M0,70 L30,60 L60,64 L90,45 L120,50 L150,30 L180,36 L210,18 L240,24 L270,10 L300,14" fill="none" stroke="#C6FF3D" strokeWidth="2"/>
        </svg>
      </div>
      <div className="dash-grid">
        {[
          { key: 'Roas', count: '4.8', suffix: 'x', diffKey: 'dashboardRoasDiff' },
          { key: 'Orders', count: '3240', suffix: '', diffKey: 'dashboardOrdersDiff' },
          { key: 'Visitors', count: '92', suffix: 'K', diffKey: 'dashboardVisitorsDiff' },
          { key: 'Conv', count: '6.2', suffix: '%', diffKey: 'dashboardConvDiff', bars: true },
          { key: 'Sales', count: '187', suffix: '%', diffKey: 'dashboardSalesDiff' },
          { key: 'AdSpend', count: '1.2', suffix: 'Cr', diffKey: 'dashboardAdSpendDiff' },
        ].map((m) => (
          <div className="dash-metric" key={m.key} style={m.bars ? { gridColumn: 'span 1' } : {}}>
            <div className="lbl">{t(`dashboard${m.key}`)}</div>
            <div className="val" data-count={m.count} data-suffix={m.suffix}>0{m.suffix}</div>
            <div className="diff">{t(m.diffKey)}</div>
            {m.bars && (
              <div className="dash-bars">
                <i style={{ height: '40%' }}></i><i style={{ height: '55%' }}></i>
                <i style={{ height: '35%' }}></i><i style={{ height: '70%' }}></i><i style={{ height: '50%' }}></i>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FaqItem({ question, answer, isOpen, onClick }) {
  const answerRef = useRef(null);
  const [height, setHeight] = useState(isOpen ? 'auto' : '0');

  useEffect(() => {
    if (isOpen && answerRef.current) {
      setHeight(answerRef.current.scrollHeight + 'px');
    } else {
      setHeight('0');
    }
  }, [isOpen]);

  return (
    <div className={`faq-item${isOpen ? ' open' : ''}`}>
      <button className="faq-q" onClick={onClick}>
        <span>{question}</span>
        <span className="plus">+</span>
      </button>
      <div className="faq-a" style={{ maxHeight: height }}>
        <p ref={answerRef}>{answer}</p>
      </div>
    </div>
  );
}

function GrowthPage() {
  const t = useTranslation();
  const [openFaq, setOpenFaq] = useState(0);
  const tickerItems = t('growth.ticker');
  const challenges = t('growth.challenges.items');
  const approachSteps = t('growth.approach.steps');
  const servicesFull = t('growth.services.itemsFull');
  const processSteps = t('growth.process.steps');
  const whyFailItems = t('growth.whyFail.items');
  const resultsItems = t('growth.results.items');
  const resultsVals = t('growth.results.values');
  const caseStudies = t('growth.caseStudies.items');
  const industries = t('growth.industries.items');
  const techStack = t('growth.techStack.items');
  const testimonials = t('growth.testimonialsNew.items');
  const faqItems = t('growth.faq.items');

  const mainRef = useRef(null);
  useScrollReveal(mainRef);

  return (
    <div className="growth-page" ref={mainRef}>
      <Seo title={t('growth.title')} description={t('growth.subtitle')} path="/growth" />

      <Ticker items={tickerItems} />

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="badge reveal"><span>🚀</span> {t('growth.heroBadge')}</div>
            <h1 className="reveal" dangerouslySetInnerHTML={{ __html: t('growth.heroTitle') }} />
            <p className="lead reveal">{t('growth.heroSub')}</p>
            <div className="hero-ctas reveal">
              <a href="#final-cta" className="btn btn-primary">{t('growth.heroCta1')}</a>
              <a href="#cases" className="btn btn-ghost">{t('growth.heroCta2')}</a>
            </div>
            <div className="hero-trust reveal">
              <div><b>{t('growth.heroTrust1Val')}</b>{t('growth.heroTrust1Label')}</div>
              <div><b>{t('growth.heroTrust2Val')}</b>{t('growth.heroTrust2Label')}</div>
              <div><b>{t('growth.heroTrust3Val')}</b>{t('growth.heroTrust3Label')}</div>
            </div>
          </div>
          <Dashboard t={t} />
        </div>
      </section>

      {/* ===== CHALLENGES ===== */}
      <section className="on-light section-pad">
        <div className="container">
          <div className="head reveal">
            <SectionHead
              eyebrow={t('growth.challenges.eyebrow')}
              title={t('growth.challenges.title')}
              sub={t('growth.challenges.sub')}
              dark={false}
            />
          </div>
          <div className="chal-grid stagger">
            {challenges.map((c, i) => (
              <div className="chal-card reveal" style={{ '--i': i }} key={i}>
                <div className="x" dangerouslySetInnerHTML={{ __html: ICONS.cross }} />
                <h4>{c[0]}</h4>
                <p>{c[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== APPROACH / ROADMAP ===== */}
      <section className="on-dark section-pad">
        <div className="container">
          <SectionHead
            eyebrow={t('growth.approach.eyebrow')}
            title={t('growth.approach.title')}
            sub={t('growth.approach.sub')}
            center
            dark
          />
          <div className="roadmap reveal">
            {approachSteps.map((step, i) => (
              <div key={i}>
                <div className="rm-step">
                  <div className="circle" dangerouslySetInnerHTML={{ __html: roadmapIcons[i] || '' }} />
                  <div className="step-num">{String(i + 1).padStart(2, '0')}</div>
                  <span className="step-label">{step}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="on-light section-pad" id="services">
        <div className="container">
          <SectionHead
            eyebrow={t('growth.services.eyebrow')}
            title={t('growth.services.title')}
            sub={t('growth.services.sub')}
            dark={false}
          />
          <div className="serv-grid stagger">
            {servicesFull.map((s, i) => (
              <div className="serv-card reveal" style={{ '--i': i % 4 }} key={i}>
                <div className="icon-wrap" dangerouslySetInnerHTML={{ __html: serviceIcons[i] || '' }} />
                <h4>{s[0]}</h4>
                <p>{s[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROCESS TIMELINE ===== */}
      <section className="on-light-2 section-pad" id="process">
        <div className="container">
          <SectionHead
            eyebrow={t('growth.process.eyebrow')}
            title={t('growth.process.title')}
            sub={t('growth.process.sub')}
            dark={false}
          />
          <div className="timeline reveal">
            <div className="tl-line"></div>
            {processSteps.map((p, i) => (
              <div className="tl-item reveal" key={i}>
                <div className="tl-num">{String(i + 1).padStart(2, '0')}</div>
                <div className="tl-body">
                  <h4>{p[0]}</h4>
                  <p>{p[1]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY FAIL ===== */}
      <section className="on-dark section-pad">
        <div className="container">
          <SectionHead
            eyebrow={t('growth.whyFail.eyebrow')}
            title={t('growth.whyFail.title')}
            sub={t('growth.whyFail.sub')}
            center
            dark
          />
          <div className="fail-grid reveal">
            <div className="fail-col bad">
              <h3><span dangerouslySetInnerHTML={{ __html: ICONS.cross }} /> {t('growth.whyFail.badTitle')}</h3>
              <ul className="fail-list">
                {whyFailItems.map((m, i) => (
                  <li key={i}>
                    <span className="ico" dangerouslySetInnerHTML={{ __html: ICONS.cross }} />
                    <span>{m[0]}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="fail-col good">
              <h3><span dangerouslySetInnerHTML={{ __html: ICONS.check }} /> {t('growth.whyFail.goodTitle')}</h3>
              <ul className="fail-list">
                {whyFailItems.map((m, i) => (
                  <li key={i}>
                    <span className="ico" dangerouslySetInnerHTML={{ __html: ICONS.check }} />
                    <span>{m[1]}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== RESULTS ===== */}
      <section className="on-dark-2 section-pad" id="results">
        <div className="container">
          <SectionHead
            eyebrow={t('growth.results.eyebrow')}
            title={t('growth.results.title')}
            sub={t('growth.results.sub')}
            center
            dark
          />
          <div className="res-grid reveal">
            {resultsItems.map((label, i) => (
              <div className="res-card" key={i}>
                <div className="num">{resultsVals[i] || '—'}</div>
                <div className="lbl">{label}</div>
              </div>
            ))}
          </div>
          <p className="placeholder-note">{t('growth.results.note')}</p>
        </div>
      </section>

      {/* ===== CASE STUDIES ===== */}
      <section className="on-light section-pad" id="cases">
        <div className="container">
          <SectionHead
            eyebrow={t('growth.caseStudies.eyebrow')}
            title={t('growth.caseStudies.title')}
            sub={t('growth.caseStudies.sub')}
            dark={false}
          />
          <div className="case-grid stagger">
            {caseStudies.map((c, i) => (
              <div className="case-card reveal" key={i}>
                <div className="case-top">
                  <span className="tag">{c.tag}</span>
                  <h4>{c.title}</h4>
                </div>
                <div className="case-body">
                  <div className="row">
                    <span>Problem</span>
                    <p>{c.problem}</p>
                  </div>
                  <div className="row">
                    <span>Solution</span>
                    <p>{c.solution}</p>
                  </div>
                </div>
                <div className="case-metrics">
                  {c.metrics.map((m, j) => (
                    <div key={j}>
                      <b>{m}</b>
                      <small>{(c.metricLabels && c.metricLabels[j]) || ''}</small>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INDUSTRIES ===== */}
      <section className="on-light-2 section-pad">
        <div className="container">
          <SectionHead
            eyebrow={t('growth.industries.eyebrow')}
            title={t('growth.industries.title')}
            sub={t('growth.industries.sub')}
            dark={false}
          />
          <div className="ind-grid stagger">
            {industries.map((ind, i) => (
              <div className="ind-card reveal" style={{ '--i': i }} key={i}>
                <div className="ic">{['🛍️', '🏥', '🎓', '🍽️', '🏢', '🏠', '⭐', '🛠️'][i] || '📦'}</div>
                <span>{ind}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TECH STACK ===== */}
      <section className="on-dark section-pad">
        <div className="container">
          <SectionHead
            eyebrow={t('growth.techStack.eyebrow')}
            title={t('growth.techStack.title')}
            sub={t('growth.techStack.sub')}
            center
            dark
          />
          <div className="stack-grid reveal">
            {techStack.map((s, i) => (
              <div className="stack-chip" key={i}><span>◆</span>{s}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="on-light section-pad">
        <div className="container">
          <SectionHead
            eyebrow={t('growth.testimonialsNew.eyebrow')}
            title={t('growth.testimonialsNew.title')}
            dark={false}
          />
          <div className="test-grid stagger">
            {testimonials.map((item, i) => (
              <div className="test-card reveal" key={i}>
                <div className="quote-mark">"</div>
                <div className="stars">{'★'.repeat(5)}</div>
                <p>{item.quote}</p>
                <div className="test-person">
                  <div className="test-avatar">{item.name.charAt(0)}</div>
                  <div>
                    <b>{item.name}</b>
                    <small>{item.role}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="on-light-2 section-pad" id="faq">
        <div className="container">
          <SectionHead
            eyebrow={t('growth.faq.eyebrow')}
            title={t('growth.faq.title')}
            center
            dark={false}
          />
          <div className="faq-list reveal">
            {faqItems.map((item, i) => (
              <FaqItem
                key={i}
                question={item[0]}
                answer={item[1]}
                isOpen={openFaq === i}
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="on-dark cta-wrap" id="final-cta">
        <div className="cta-glow"></div>
        <div className="container">
          <h2 className="reveal">{t('growth.finalCta.title')}</h2>
          <p className="reveal">{t('growth.finalCta.sub')}</p>
          <a href="#" className="btn btn-primary reveal" style={{ fontSize: '16.5px', padding: '18px 36px' }}>
            {t('growth.finalCta.btn')}
          </a>
        </div>
      </section>

    </div>
  );
}

export default GrowthPage;
