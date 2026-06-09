import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { motion } from 'framer-motion';
import api from '../../api';
import { useTranslation } from '../../context/LanguageContext';
import Seo from '../../components/Seo';
import { fadeUp, fadeUpSmall, staggerContainer } from '../../motion/presets';
import { formatDate } from '../../utils/date';
import '../Blog/BlogPage.css';
import '../Blog/BlogPage.responsive.css';

const FALLBACK_KEY = 'winningProducts';

function BlogDetailPage() {
  const t = useTranslation();
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const aliveRef = useRef(true);
  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    const loadPost = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get(`/blog/${slug}`, { signal: ctrl.signal });
        if (aliveRef.current) setPost(data);
      } catch (err) {
        if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') return;
        if (aliveRef.current) {
          setPost({
            slug,
            title: t(`blog.defaults.${FALLBACK_KEY}.title`),
            category: t(`blog.defaults.${FALLBACK_KEY}.category`),
            author: 'Saiful Islam',
            readTime: 8,
            icon: '🔍',
            createdAt: '2026-05-20',
            content: t(`blog.defaults.${FALLBACK_KEY}.content`),
            excerpt: t(`blog.defaults.${FALLBACK_KEY}.excerpt`),
          });
        }
      } finally {
        if (aliveRef.current) setIsLoading(false);
      }
    };
    loadPost();
    return () => ctrl.abort();
  }, [slug, t]);

  if (isLoading) {
    return (
      <div className="page">
        <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
          {t('common.loadingPosts')}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="page">
        <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <h2>{t('blog.notFoundTitle')}</h2>
          <p style={{ marginTop: 16, marginBottom: 24 }}>{t('blog.notFoundDesc')}</p>
          <Link to="/blog" className="btn btn-primary">
            ← {t('blog.backToBlog')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <Seo
        title={post.title}
        description={post.excerpt || `${post.title} – ${t('seo.defaultTitle')}`}
        path={`/blog/${post.slug}`}
        type="article"
        image={post.image}
      />
      <div className="container" style={{ padding: '60px 24px 80px' }}>
        <motion.div
          className="blog-detail"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUpSmall}>
            <Link to="/blog" className="blog-detail-back">
              ← {t('blog.backToBlog')}
            </Link>
          </motion.div>

          <motion.div className="blog-detail-image" aria-hidden="true" variants={fadeUp}>
            {post.icon || '📝'}
          </motion.div>

          <motion.span className="eyebrow" variants={fadeUpSmall}>
            {post.category}
          </motion.span>

          <motion.h1 variants={fadeUp}>{post.title}</motion.h1>

          <motion.div className="blog-detail-meta" variants={fadeUpSmall}>
            <span>
              {t('blog.by')} {post.author || 'Saiful Islam'}
            </span>
            <span aria-hidden="true">·</span>
            <span>{formatDate(post.createdAt)}</span>
            <span aria-hidden="true">·</span>
            <span>
              {post.readTime || 5} {t('common.minRead')}
            </span>
          </motion.div>

          <motion.div className="blog-detail-content" variants={fadeUp}>
            {post.content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                {post.content}
              </ReactMarkdown>
            ) : (
              <p>{post.excerpt}</p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default BlogDetailPage;
