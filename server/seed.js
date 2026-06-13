const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const db = require('./models');

function readEnv(name) {
  const v = process.env[name];
  if (v === undefined || v === null || String(v).trim() === '') {
    return null;
  }
  return String(v);
}

// ── Seed Data ──────────────────────────────────────────────────────────────

const BLOG_POSTS = [
  {
    title: 'How to Use ChatGPT to Write 30 Days of Facebook Ad Copy in 1 Hour',
    slug: 'chatgpt-30-days-facebook-ad-copy',
    excerpt: 'Discover the exact prompts and workflow we use to generate high-converting ad copy at scale using AI tools.',
    content: `Writing Facebook ad copy is one of the most time-consuming parts of running ads. Most business owners spend hours staring at a blank screen trying to come up with the perfect hook.

But here's the truth: you don't need to write every ad from scratch. With the right ChatGPT workflow, you can generate 30 days of ad copy in under an hour.

## The 5-Step ChatGPT Ad Copy Workflow

### Step 1: Define Your Audience Profile

Before you write a single word, tell ChatGPT exactly who you're talking to:

> "You are a Facebook ad copywriter for [Brand Name], a [category] brand selling to [audience] in Bangladesh. The customer is [age], [gender], interested in [interest]. Their biggest pain point is [pain point]. Write ad copy that speaks directly to them."

### Step 2: Generate 30 Hooks in 5 Minutes

Ask ChatGPT to generate 30 hooks across different angles:

- **Curiosity hooks**: "Most people don't know this about [product]"
- **Pain point hooks**: "Tired of [problem]? Here's the fix."
- **Social proof hooks**: "Join 2,000+ happy customers who switched to [brand]"

### Step 3: Write the Body Copy

For each hook, have ChatGPT expand it into a full ad body:

- Keep it 40-80 words
- Focus on benefits, not features
- Include one clear CTA per ad

### Step 4: Batch by Ad Set

Group your 30 copies into 5-6 ad sets (5 copies each). Each ad set targets a different audience segment. This way you're always testing new angles.

### Step 5: Add a CTA Variation

Always include 3-4 CTA variations:
- "Shop Now"
- "Learn More"
- "Get Yours Today"
- "Limited Offer"

## Pro Tips for Bangladeshi Brands

1. **Mix Bangla and English** — Spoken Bangla in ad copy often converts better than pure English for local audiences.
2. **Mention local payment methods** — "Bkash, Nagad, or Card" in your copy builds trust.
3. **Use local prices** — Always show prices in ৳, not USD.
4. **Reference local holidays** — Pohela Boishakh, Eid, etc. are high-conversion periods.

## The Prompt Library (Copy-Paste Ready)

Here are 3 battle-tested prompts to get started:

**Prompt 1: Pain Agitator**
> Write 5 Facebook ad copies for [product] that agitate the pain point of [pain point]. Each copy must be under 80 words, include a statistic or social proof, and end with "Shop Now" CTA. Target: Bangladesh audience, Bengali-English mix.

**Prompt 2: Social Proof**
> Write 5 ad copies for [product] featuring customer testimonials. Create fictional but realistic Bangladeshi customer stories. Include specific results (e.g., "lost 5kg in 2 weeks"). Add emojis and a sense of urgency.

**Prompt 3: Educational**
> Write 5 "Did you know?" style ad copies that educate the audience about [topic related to product]. Each should be under 100 words, include a surprising fact, and lead naturally to the product as the solution.

## Results We've Seen

Using this system, our clients have seen:
- 40% reduction in time spent on ad creation
- 25% higher CTR on AI-generated copy (after A/B testing)
- Consistent ad performance across 30-day campaigns

The key is **not** to use AI copy as-is. Always edit, localize, and add your brand voice. Use AI as your junior copywriter — it writes the draft, you make it great.`,
    category: 'AI Marketing',
    author: 'Saiful Islam',
    readTime: 8,
    featured: true,
    published: true,
  },
  {
    title: 'The Complete Guide to Starting an E-commerce Business in Bangladesh (2024)',
    slug: 'complete-guide-starting-ecommerce-bangladesh-2024',
    excerpt: 'Everything you need to know from product research to your first sale — tailored for the Bangladeshi market.',
    content: `Starting an e-commerce business in Bangladesh in 2024 is easier than ever — but so is failing if you don't have a plan. This guide covers everything from finding your first product to making your first sale.

## Step 1: Choose Your Business Model

### Dropshipping
- No inventory needed
- Low startup cost (৳5,000-15,000)
- Longer delivery times (10-20 days)
- Lower profit margins

### Local Sourcing
- Buy from local markets (Tantibazar, Imam Square, New Market)
- Higher margins
- Quality control is possible
- Requires upfront investment

### Handmade / Production
- Unique products, no competition on price
- Slower to scale
- Higher perceived value

## Step 2: Find Your Winning Product

The #1 reason Bangladeshi e-commerce businesses fail is choosing the wrong product. Here's how to avoid it:

### The 3-Signal Test

1. **Google Trends (Bangladesh)** — Is the product trending up?
2. **Facebook Ad Library** — Are 5+ competitors running ads for it for 2+ weeks?
3. **Local Demand** — Search Facebook Marketplace and groups. Are people asking for it?

### Best Categories for 2024

- Fashion & Accessories (40% of online sales)
- Beauty & Skincare (25% growth YoY)
- Tech Accessories (high demand, high competition)
- Home & Living (growing segment)
- Baby Products (low competition, high loyalty)

## Step 3: Set Up Your Brand

### Essentials:
- **Business Name** — Keep it short, memorable, .com available
- **Logo** — Use Canva or hire a designer (invest at least ৳3,000-5,000)
- **Facebook Page** — Complete with profile, cover, and pinned post
- **Instagram Account** — Set up as business account

### Brand Identity Checklist:
- Logo (primary + secondary versions)
- Color palette (3-5 colors)
- Typography (2 fonts max)
- Brand voice guide

## Step 4: Build Your Store

### Platform Options:

**Shopify** — Best for beginners. ৳3,500/month. 14-day free trial.
**WooCommerce** — More control. Free, but hosting costs ৳500-2,000/month.
**Daraz** — Built-in traffic. High commission fees (10-20%).

### Must-Have Pages:
- Home page with clear value proposition
- Product pages with quality images (minimum 4 per product)
- About Us page
- Contact page with WhatsApp link
- Shipping & Returns policy
- FAQ page

## Step 5: Payment Integration

Offer these 3 payment methods for maximum conversion:

1. **bKash** — 80% of online payments in Bangladesh
2. **Nagad** — Fastest growing, lower merchant fees
3. **Card (Visa/Mastercard)** — Essential for international customers

## Step 6: Your First Marketing Campaign

Start with ৳5,000 Facebook ad budget:

- **Day 1-3**: Test 3 ad creatives with ৳500/day each
- **Day 4-5**: Cut underperformers, scale winners to ৳1,000/day
- **Day 6-7**: Retarget anyone who clicked but didn't buy

### Organic Content Schedule:
- Daily: 1 Instagram Reel + 1 Facebook post
- Weekly: 1 product highlight + 1 customer testimonial
- Monthly: 1 promotion or bundle deal

## Final Checklist Before Launch

- [ ] Product sourced and photographed
- [ ] Website built and tested
- [ ] Payments working (test with ৳1)
- [ ] Social media pages completed
- [ ] First ad campaign ready
- [ ] Customer support system (WhatsApp Business) set up

The journey from zero to your first sale typically takes 30-60 days if you follow this guide step by step. Don't rush — build a solid foundation, and the sales will come.`,
    category: 'Business Launch',
    author: 'Saiful Islam',
    readTime: 10,
    featured: true,
    published: true,
  },
  {
    title: 'Why Your Brand Identity Is Your Most Important Business Asset',
    slug: 'brand-identity-most-important-asset',
    excerpt: 'The psychology behind why customers choose brands over products — and how to build a brand that commands premium prices.',
    content: `Most Bangladeshi e-commerce entrepreneurs make the same mistake: they focus on products instead of brands. They spend hours finding the perfect product, then 10 minutes slapping together a logo in Canva.

Here's why that's a costly mistake.

## Why Brand Beats Product Every Time

A product can be copied in 30 days. A brand cannot be copied — ever.

When you build a brand, you're not selling a product. You're selling:
- **Trust** — "This brand delivers what it promises"
- **Identity** — "This brand represents who I am"
- **Consistency** — "I know what to expect from this brand"

## The Psychology of Brand Preference

### The Familiarity Principle

Humans prefer what they recognize. The more a customer sees your brand, the more they trust it — even subconsciously. This is why consistent visual branding across every touchpoint is non-negotiable.

### The Halo Effect

When customers perceive one positive attribute (beautiful packaging), they assume other positive attributes (high quality, good service). A professional brand identity creates a halo that makes every aspect of your business seem better.

### Price Anchoring

Premium branding creates a higher price anchor in the customer's mind. A product in premium packaging with a professional logo can sell for 2-3x more than the same product with generic packaging.

## The 5 Elements of a Strong Brand Identity

### 1. Logo
Your logo is not your brand — but it's the most visible symbol of it.

**Invest in:**
- A professional designer (not a template)
- Multiple formats (horizontal, vertical, icon-only)
- Color variations (full color, black & white, reversed)

### 2. Color Palette
Colors trigger emotional responses:
- Red: Urgency, passion, excitement
- Blue: Trust, professionalism, calm
- Green: Growth, health, nature
- Gold/Premium: Luxury, exclusivity

### 3. Typography
Fonts communicate personality:
- Serif: Traditional, trustworthy, premium
- Sans-serif: Modern, clean, accessible
- Script: Creative, personal, artistic

### 4. Brand Voice
How your brand speaks is as important as how it looks.

**Define your voice with 3 adjectives:**
- Example: "Professional, warm, and straightforward"
- Example: "Playful, energetic, and youthful"

### 5. Visual Consistency
Apply your brand identity to:
- Website and store
- Social media profiles
- Product packaging
- Email communications
- Ad creatives
- Business cards and stationery

## The ROI of Branding

At Saiful Studios, we've tracked the impact of professional branding across our clients:

- **40-60% higher perceived value** — customers willing to pay more
- **25% higher conversion rates** — branded stores convert better
- **3x repeat purchase rate** — brand loyalty drives retention
- **50% lower customer acquisition cost** over time — brand recognition reduces ad costs

## Case Study: How Branding Transformed Leathix

A leather accessories brand came to us with:
- A generic logo made in Canva
- Inconsistent Instagram feed
- No brand story or positioning

After a full brand identity overhaul:
- Average order value increased 2x
- Instagram followers grew from 500 to 15,000 in 90 days
- They started getting DMs from customers saying "I love your brand aesthetic"

## Your Brand Action Plan

**Week 1:** Define your brand foundations (mission, vision, values, voice)
**Week 2:** Invest in a professional logo and color palette
**Week 3:** Apply your brand to your store and social media
**Week 4:** Create brand guidelines and enforce consistency

Remember: your brand is your most valuable asset. Treat it like one.`,
    category: 'Branding',
    author: 'Saiful Islam',
    readTime: 8,
    featured: false,
    published: true,
  },
  {
    title: 'Instagram Reels Strategy That Got Our Client 50K Followers in 90 Days',
    slug: 'instagram-reels-50k-followers-90-days',
    excerpt: 'The exact content formula, posting schedule, and hashtag strategy that drives massive organic growth in Bangladesh.',
    content: `Instagram Reels are the single fastest way to grow your brand's following in Bangladesh right now. We proved this with one of our clients — growing from 500 to 50,000 followers in just 90 days.

Here's the exact strategy we used.

## Why Reels Work in Bangladesh

Bangladesh has one of the fastest-growing Instagram user bases in South Asia. The algorithm heavily favors Reels, especially for new accounts. This means even a brand new page can go viral — if you follow the right formula.

## The 4-Content-Type Formula

### Type 1: Educational Content (40%)
Teach your audience something valuable related to your product.

**Examples:**
- "3 ways to style this [product]"
- "How to care for [product] so it lasts 5 years"
- "The mistake 90% of buyers make when choosing [product]"

### Type 2: Behind the Scenes (25%)
Show the human side of your business.

**Examples:**
- Packing an order
- Product quality check
- Team meeting or work setup

### Type 3: Trends & Entertainment (20%)
Jump on trending audio and formats — but make it relevant.

**Examples:**
- "POV: You just received your [product] package"
- Trending dance with your product
- Before/after with your product

### Type 4: Social Proof (15%)
Let your customers sell for you.

**Examples:**
- Customer unboxing reaction
- Before/after transformation
- Review screenshots with voiceover

## The Posting Schedule

- **Daily**: 1 Reel (minimum)
- **Best times**: 10 AM, 2 PM, 8 PM (Bangladesh time)
- **Best days**: Sunday-Tuesday (highest engagement)

## Hashtag Strategy

Use a mix of 15 hashtags per post:

**3-5 broad hashtags (1M+ posts)**
#bangladesh #dhaka #fashion #beauty

**5-7 niche hashtags (100K-1M posts)**
#bangladeshibrand #dhakafashion #bangladeshibusiness

**3-5 specific hashtags (10K-100K posts)**
#leatherbagbd #skincarebangladesh #dhakastyle

Replace the specific hashtags based on your exact niche.

## The Hook Formula

Your first 3 seconds determine if someone watches or scrolls. Use these proven hooks:

**Question hooks:**
- "Did you know this about [product]?"
- "Want to know the secret to [benefit]?"

**Statement hooks:**
- "Stop buying [product] until you watch this"
- "This is the best [product] I've ever used"

**Visual hooks:**
- Start with the most visually striking part
- Use a pattern interrupt (sudden movement, color change)
- Show the result before the process

## Analytics: What to Track

Focus on these metrics weekly:
- **Saves** (most important for algorithm)
- **Shares** (second most important)
- **Watch time** (aim for 70%+ retention)
- **Profile visits** (conversion metric)
- **Follower growth rate** (overall health)

## 30-Day Growth Sprint Plan

**Week 1:** Post 15 Reels, test 5 different formats
**Week 2:** Double down on top 2 formats, post 20 Reels
**Week 3:** Add trending audio, collaborate with 1 micro-influencer
**Week 4:** Post 25 Reels, analyze data, create content pillars

## Tools We Used

- **CapCut**: Video editing (free, no watermark)
- **Canva**: Thumbnail creation
- **ChatGPT**: Caption and hook writing
- **Later**: Scheduling (free plan works)

## Results by the Numbers

- **Day 30**: 5,000 followers
- **Day 60**: 22,000 followers
- **Day 90**: 50,000+ followers

Average Reel views: 15,000
Best-performing Reel: 850,000 views
Conversion from follower to customer: 3%

The algorithm rewards consistency above everything else. Post daily for 30 days, and you will see results. It's that simple — and that hard.`,
    category: 'Social Media',
    author: 'Saiful Islam',
    readTime: 7,
    featured: false,
    published: true,
  },
  {
    title: 'Facebook Ads for Beginners: How to Get Your First Sale Without Wasting Money',
    slug: 'facebook-ads-beginners-first-sale',
    excerpt: 'A step-by-step guide to setting up your first profitable Facebook ad campaign with a small budget.',
    content: `Most Bangladeshi entrepreneurs lose their first ad budget. Not because Facebook ads don't work — but because they don't have a system.

This guide will help you get your first sale without wasting a single taka.

## Before You Run a Single Ad

Do NOT run ads until you have these 3 things:

### 1. A Working Website
- Test the checkout process with ৳1
- Confirm bKash/Nagad/Card payments work
- Make sure mobile loading is under 3 seconds

### 2. 3 Quality Product Images
- Clear, well-lit photos
- At least one lifestyle shot (product being used)
- Consistent background or setting

### 3. A Basic Facebook Page
- Complete profile with logo and cover
- At least 5 posts
- WhatsApp button connected

## Campaign Structure (The 1-3-3 Rule)

### 1 Campaign → 3 Ad Sets → 3 Ads Each

**Campaign objective:** Sales (Conversions)

**Ad Set 1: Broad targeting**
- Location: Bangladesh
- Age: 18-45
- Gender: All
- Interest: None
- Budget: ৳300/day

**Ad Set 2: Interest targeting**
- Target people interested in:
- Competitor brands or related interests
- E-commerce, online shopping
- Luxury, premium products (if applicable)
- Budget: ৳300/day

**Ad Set 3: Lookalike targeting**
- Based on website visitors (install Facebook Pixel first)
- 1% lookalike audience
- Budget: ৳300/day

## Budget Management

### Start Small: ৳500/day total
- ৳200/day per ad set (minimum recommended)

### Scaling Rules
- Only scale ad sets with ROAS above 2x
- Increase budget by 20% every 2-3 days
- Never double the budget overnight

### Kill Rules
- If cost per result > 3x your target, kill the ad
- If CTR < 0.5% after 2 days, change the creative
- If CPM > ৳200 for Bangladesh, test new targeting

## Creative That Converts

### Image Ads
- Minimal text on image (Facebook penalizes too much text)
- Show the product in use
- Include a subtle WhatsApp icon or "Free Delivery" badge

### Video Ads
- First 3 seconds must hook
- Show the problem → solution → result
- Add captions (80% of people watch without sound)
- Keep under 30 seconds for best results

### Carousel Ads
- Show multiple products or features
- Use for catalog sales
- Each card should work independently

## The Ad Copy Formula

### Headline (25 characters max)
- Too long and it gets cut off
- Include key benefit or offer
- Example: "50% OFF Today Only"

### Primary Text (125 characters optimal)
- Hook → Problem → Solution → CTA
- Keep it short — mobile users scroll fast
- Example: "Tired of low-quality [product]? Our [product] is handmade, tested, and comes with a 100% satisfaction guarantee. Shop now and get free delivery!"

### CTA Button
- "Shop Now" for product catalogs
- "Learn More" for consideration
- "Get Offer" for promotions

## Tracking and Optimization

### Install Facebook Pixel
- Essential for tracking conversions
- Create lookalike audiences
- Retarget website visitors

### Daily Checks
- Spend vs. budget
- Cost per result
- CTR (aim for 1%+)
- Frequency (if > 3, refresh creative)

### Weekly Optimizations
- Pause underperforming ads
- Scale winning ad sets
- Test new creatives

## First 7-Day Campaign Plan

**Day 1-2:** Launch all 3 ad sets, let them learn
**Day 3:** Check early signals — pause anything with 0 results and ৳600+ spend
**Day 4-5:** Double down on winners, add 1-2 new creatives to test
**Day 6-7:** Scale budget by 20% on winning ad sets, retarget anyone who clicked

## Common Mistakes to Avoid

1. **Too broad targeting** — Bangladesh has 18M+ Facebook users. Be more specific.
2. **Bad images** — Blurry or low-res images kill conversions instantly.
3. **No pixel** — You're flying blind without tracking.
4. **Impatience** — Give campaigns 3-5 days to learn before judging.
5. **Copying competitors** — Test your own angles. What works for them may not work for you.

## Expected Results (Realistic)

- **First 7 days**: 0-5 sales (learning phase)
- **Days 8-30**: 10-30 sales (optimization phase)
- **Month 2**: 50-100+ sales (scaling phase) with ROAS of 2-4x

Start small, test everything, and scale what works. This is not a get-rich-quick strategy — it's a proven system that takes time and discipline.`,
    category: 'Facebook Ads',
    author: 'Saiful Islam',
    readTime: 9,
    featured: false,
    published: true,
  },
  {
    title: 'Bkash, Nagad, or Card? The Best Payment Gateway Strategy for Your Online Store',
    slug: 'bkash-nagad-card-payment-gateway-strategy',
    excerpt: 'Comparing payment options for Bangladeshi e-commerce and how offering the right choices increases your conversion rate.',
    content: `Which payment method should you offer in your online store? The answer dramatically impacts your conversion rate.

After analyzing 500+ transactions across our client stores, here's what we've learned about the Bangladeshi payment landscape.

## The Current Payment Landscape

### bKash
- **Market share**: 70%+ of online payments
- **Merchant fee**: 1-2% per transaction
- **Setup difficulty**: Easy (business account needed)
- **Customer trust**: Very high
- **Best for**: All e-commerce stores

### Nagad
- **Market share**: Rapidly growing (estimated 20%)
- **Merchant fee**: 0.5-1% (lower than bKash)
- **Setup difficulty**: Easy
- **Customer trust**: Growing fast
- **Best for**: Cost-conscious businesses, new stores

### Card Payments (Visa/Mastercard)
- **Market share**: ~5-8% of local transactions
- **Merchant fee**: 2-3%
- **Setup difficulty**: Moderate (payment gateway required)
- **Customer trust**: High for international customers
- **Best for**: International sales, premium brands

## The Ideal Payment Stack

**Minimum viable**: bKash + Nagad
**Standard**: bKash + Nagad + Card (via SSLCommerz or similar)
**Premium**: All of the above + Cash on Delivery (for high-trust items)

## Why Payment Options Affect Conversion

### Trust Factor
When a customer sees their preferred payment method, they feel safer transacting. bKash has the highest trust factor in Bangladesh — not offering it can cut conversions by 40%+.

### Friction Reduction
Every extra step in the checkout process loses 10-20% of customers. Having their preferred payment ready reduces friction significantly.

### Mobile First
90%+ of Bangladeshi shoppers use mobile. bKash and Nagad are mobile-native — card payments often require redirecting to a 3D Secure page that feels clunky on mobile.

## Integration Guide

### SSLCommerz (Most Popular)
- Supports bKash, Nagad, Visa, Mastercard, Amex
- Easy WooCommerce/Shopify integration
- 2-3% commission
- Settlement: 2-3 working days

### ShurjoPay
- Newer, more developer-friendly API
- Lower fees than SSLCommerz
- Growing merchant base
- Better documentation

### Direct bKash Merchant
- For very high-volume stores
- Lower fees than aggregators
- Requires bKash Business API integration
- Minimum monthly volume requirements

## Checkout Flow Optimization

### Step 1: Cart Page
Show accepted payment methods as icons before checkout. This builds confidence early.

### Step 2: Checkout Page
Order payment methods by popularity:
1. bKash (pre-selected)
2. Nagad
3. Card
4. Other

### Step 3: Confirmation
- Send manual confirmation via WhatsApp for high-value orders
- Auto-confirm card payments
- Set clear expectations for payment verification time

## Advanced Strategy: Payment-Driven Pricing

### Offer discounts for preferred payment
"Pay with bKash and get 5% off" — this can save you merchant fees and increase customer loyalty.

### Tiered pricing
- bKash/Nagad: Full price
- Card: +2% surcharge (to cover fees)
- Cash on Delivery: +5% (to cover risk)

## Impact on Conversion: Real Data

From our client stores:

| Payment Options Offered | Conversion Rate |
|------------------------|----------------|
| Card only | 1.2% |
| bKash only | 2.8% |
| bKash + Nagad | 3.5% |
| bKash + Nagad + Card | 4.1% |

Adding bKash alone typically increases conversion by 2x.
Adding Nagad adds another 25% improvement.
Adding cards adds ~15-20% more — mostly from international customers.

## Implementation Checklist

- [ ] Open bKash Merchant account (2-3 days)
- [ ] Open Nagad Merchant account (1-2 days)
- [ ] Integrate SSLCommerz or ShurjoPay (1-2 days with developer)
- [ ] Test all payment methods with ৳1 transactions
- [ ] Add payment icons to your website footer
- [ ] Train customer support on payment troubleshooting
- [ ] Monitor settlement times and reconciliation

## Final Recommendation

Start with bKash and Nagad — they cover 90%+ of your potential customers. Add card payments as soon as possible, especially if you plan to sell internationally.

The cost of integrating multiple payment methods (৳10,000-20,000 setup) pays for itself within weeks of increased conversion. Don't cheap out on payments — it's where the money meets the customer.`,
    category: 'E-commerce Setup',
    author: 'Saiful Islam',
    readTime: 9,
    featured: false,
    published: true,
  },
];

const CASE_STUDIES = [
  {
    title: 'Leathix',
    slug: 'leathix',
    category: 'Premium Leather Brand',
    icon: '👜',
    challenge: 'No brand identity, inconsistent visuals, zero online presence.',
    solution: 'Complete brand identity, e-commerce website, product photography direction, Instagram growth strategy.',
    result: '300% increase in online sales within 3 months.',
    resultHighlight: '300% sales increase',
    headerGradient: 'linear-gradient(135deg,#FFE7CC,#fff)',
    featured: true,
  },
  {
    title: 'Future Connect',
    slug: 'future-connect',
    category: 'Tech Accessories Brand',
    icon: '🎧',
    challenge: 'Basic Facebook page only, no website, no ads strategy, declining organic reach.',
    solution: 'Custom website with SEO, Facebook Ads campaign setup, content calendar, monthly growth management.',
    result: '৳500K+ monthly revenue achieved in 6 months with 4x ROAS.',
    resultHighlight: '৳500K+ monthly',
    headerGradient: 'linear-gradient(135deg,#E8F0FF,#fff)',
    featured: true,
  },
  {
    title: 'Fashion Nova BD',
    slug: 'fashion-nova-bd',
    category: 'Fashion E-commerce',
    icon: '👗',
    challenge: 'New entrepreneur with budget constraints, needed full e-commerce setup from scratch.',
    solution: 'Brand identity, website, Bkash/Nagad payment integration, AI content system training, first ad campaign.',
    result: 'First ৳1M revenue milestone within 4 months.',
    resultHighlight: '৳1M in 4 months',
    headerGradient: 'linear-gradient(135deg,#FFE0E6,#fff)',
    featured: true,
  },
  {
    title: 'NaturalGlow BD',
    slug: 'naturalglow-bd',
    category: 'Skincare Brand',
    icon: '🌿',
    challenge: 'Homemade products with no branding, selling only to friends and family.',
    solution: 'Premium brand identity, Shopify store, packaging design, content system.',
    result: '2,000+ customers in first 6 months. Featured in local media.',
    resultHighlight: '2,000+ customers',
    headerGradient: 'linear-gradient(135deg,#E0F5E8,#fff)',
    featured: true,
  },
  {
    title: 'TechZone BD',
    slug: 'techzone-bd',
    category: 'Electronics Reseller',
    icon: '💻',
    challenge: 'High competition, low margins, no brand differentiation strategy.',
    solution: 'Brand positioning, trust-building content strategy, Google Shopping ads.',
    result: '40% margin improvement through brand premium pricing strategy.',
    resultHighlight: '40% margin up',
    headerGradient: 'linear-gradient(135deg,#E8E8FF,#fff)',
    featured: true,
  },
  {
    title: 'Crafty Hands',
    slug: 'crafty-hands',
    category: 'Handcraft Business',
    icon: '🧶',
    challenge: 'Beautiful handmade products but could not reach the right audience online.',
    solution: 'Pinterest & Instagram strategy, video content series, Etsy & Facebook Shop setup.',
    result: 'International orders from 8 countries within 12 months.',
    resultHighlight: '8 countries reached',
    headerGradient: 'linear-gradient(135deg,#FFF3E0,#fff)',
    featured: true,
  },
];

// ── Seeder ─────────────────────────────────────────────────────────────────

async function seed() {
  try {
    console.log('Seeding database…');

    await db.sequelize.authenticate();
    console.log('Database connection established');

    if (process.env.DB_SYNC === 'true') {
      await db.sequelize.sync({ alter: true });
      console.log('Tables synced (DB_SYNC=true)');
    } else {
      console.log('Skipping sync. Run "npm run migrate" first if tables do not exist.');
    }

    // ── Admin ──

    const ADMIN_EMAIL = readEnv('ADMIN_EMAIL') || 'admin@saifulstudios.com';
    const ADMIN_NAME = readEnv('ADMIN_NAME') || 'Saiful Islam';

    const existingAdmin = await db.Admin.findOne({ where: { email: ADMIN_EMAIL } });
    if (existingAdmin) {
      console.log(`Admin already exists: ${ADMIN_EMAIL}`);
    } else {
      let ADMIN_PASSWORD = readEnv('ADMIN_PASSWORD');
      if (!ADMIN_PASSWORD) {
        if (process.env.NODE_ENV === 'production') {
          console.error('❌ ADMIN_PASSWORD is required in production. Refusing to generate one.');
          process.exit(1);
        }
        ADMIN_PASSWORD = crypto.randomBytes(12).toString('base64url');
        console.log('⚠️  No ADMIN_PASSWORD in env — generated a one-time random password for first run.');
      } else if (ADMIN_PASSWORD.length < 8) {
        console.error('❌ ADMIN_PASSWORD must be at least 8 characters.');
        process.exit(1);
      }

      const admin = await db.Admin.create({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        name: ADMIN_NAME,
        role: 'admin',
      });
      console.log('Admin user created');
      console.log('   ----------------------------------------');
      console.log(`   Email:    ${admin.email}`);
      console.log(`   Password: ${ADMIN_PASSWORD}`);
      console.log(`   Name:     ${admin.name}`);
      console.log(`   Role:     ${admin.role}`);
      console.log('   ----------------------------------------');
      console.log('   Change the password after first login!');
    }

    // ── Blog Posts ──

    console.log('\nSeeding blog posts…');
    let blogCount = 0;
    for (const post of BLOG_POSTS) {
      const existing = await db.Blog.findOne({ where: { slug: post.slug } });
      if (existing) {
        console.log(`   Blog post already exists: "${post.title}"`);
      } else {
        await db.Blog.create(post);
        console.log(`   ✓ Created: "${post.title}"`);
        blogCount++;
      }
    }
    if (blogCount === 0) {
      console.log('   All blog posts already exist. Skipping.');
    } else {
      console.log(`   ${blogCount} new blog post(s) created.`);
    }

    // ── Case Studies ──

    console.log('\nSeeding case studies…');
    let caseCount = 0;
    for (const cs of CASE_STUDIES) {
      const existing = await db.CaseStudy.findOne({ where: { slug: cs.slug } });
      if (existing) {
        console.log(`   Case study already exists: "${cs.title}"`);
      } else {
        await db.CaseStudy.create(cs);
        console.log(`   ✓ Created: "${cs.title}"`);
        caseCount++;
      }
    }
    if (caseCount === 0) {
      console.log('   All case studies already exist. Skipping.');
    } else {
      console.log(`   ${caseCount} new case study(ies) created.`);
    }

    console.log('\n✅ Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    console.error('Make sure your MySQL is running, .env credentials are correct, and you have run "npm run migrate".');
    process.exit(1);
  }
}

seed();
