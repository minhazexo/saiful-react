import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../api';
import { useTranslation } from '../../context/LanguageContext';
import Seo from '../../components/Seo';
import { MotionStaggerContainer, MotionStaggerItem } from '../../motion/MotionFadeUp';
import { staggerContainer, fadeUp } from '../../motion/presets';
import { formatDate } from '../../utils/date';
import './BlogPage.css';

const DEFAULT_KEYS = [
  { slug: 'chatgpt-30-days-facebook-ad-copy', key: 'chatgpt', icon: '🤖' },
  { slug: 'complete-guide-starting-ecommerce-bangladesh-2024', key: 'guide', icon: '🚀' },
  { slug: 'brand-identity-most-important-asset', key: 'brand', icon: '🎨' },
  { slug: 'instagram-reels-50k-followers-90-days', key: 'reels', icon: '📱' },
  { slug: 'facebook-ads-beginners-first-sale', key: 'facebook', icon: '💰' },
  { slug: 'bkash-nagad-card-payment-gateway-strategy', key: 'payment', icon: '💳' },
];

function BlogPage() {
  const t = useTranslation();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const aliveRef = useRef(true);
  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get('/blog', { signal: ctrl.signal });
        if (Array.isArray(data) && data.length > 0 && aliveRef.current) {
          setPosts(data);
        } else {
          setPosts(
            DEFAULT_KEYS.map((d) => ({
              slug: d.slug,
              title: t(`blog.defaults.${d.key}.title`),
              excerpt: t(`blog.defaults.${d.key}.excerpt`),
              category: t(`blog.defaults.${d.key}.category`),
              author: 'Saiful Islam',
              readTime: 8,
              icon: d.icon,
              createdAt: '2024-06-01',
            }))
          );
        }
      } catch (err) {
        if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
          if (aliveRef.current) {
            setPosts(
              DEFAULT_KEYS.map((d) => ({
                slug: d.slug,
                title: t(`blog.defaults.${d.key}.title`),
                excerpt: t(`blog.defaults.${d.key}.excerpt`),
                category: t(`blog.defaults.${d.key}.category`),
                author: 'Saiful Islam',
                readTime: 8,
                icon: d.icon,
                createdAt: '2024-06-01',
              }))
            );
          }
        }
      } finally {
        if (aliveRef.current) setIsLoading(false);
      }
    };
    loadPosts();
    return () => ctrl.abort();
  }, [t]);

  const categories = [t('common.all'), ...new Set(posts.map((p) => p.category).filter(Boolean))];
  const filtered =
    activeCategory === t('common.all') ? posts : posts.filter((p) => p.category === activeCategory);

  return (
    <div className="page">
      <Seo title={t('blog.title')} description={t('blog.subtitle')} path="/blog" />
      <section className="page-hero">
        <div className="container">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.span className="eyebrow" aria-hidden="true" variants={fadeUp}>
              📚 {t('blog.eyebrow')}
            </motion.span>
            <motion.h1 variants={fadeUp}>{t('blog.title')}</motion.h1>
            <motion.p variants={fadeUp}>{t('blog.subtitle')}</motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <motion.div
            className="blog-categories"
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginBottom: 40,
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`btn ${activeCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '8px 16px', fontSize: 13 }}
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {isLoading ? (
            <div className="blog-loading">{t('common.loadingPosts')}</div>
          ) : filtered.length === 0 ? (
            <div className="blog-empty">{t('blog.noPosts')}</div>
          ) : (
            <MotionStaggerContainer className="blog-grid" staggerDelay={0.08}>
              {filtered.map((post, i) => (
                <MotionStaggerItem
                  key={post.slug || i}
                  as={Link}
                  to={`/blog/${post.slug}`}
                  className="blog-card"
                >
                  <div className="blog-image" aria-hidden="true">
                    <span className="blog-tag">{post.category}</span>
                    {post.icon || '📝'}
                  </div>
                  <div className="blog-content">
                    <div className="blog-meta">
                      <span>{formatDate(post.createdAt)}</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {post.readTime || 5} {t('common.minRead')}
                      </span>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <div className="blog-link">{t('blog.readMore')} →</div>
                  </div>
                </MotionStaggerItem>
              ))}
            </MotionStaggerContainer>
          )}
        </div>
      </section>
    </div>
  );
}

export default BlogPage;
