/**
 * Generates the HTML email template for new subscribers.
 * @param {string} email - The subscriber's email address
 * @returns {string} - Full HTML email string
 */
export const getWelcomeEmailHTML = (email) => {
    const year = new Date().getFullYear();
  
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Welcome to InvestBeans</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        font-family: 'Inter', Arial, sans-serif;
        background: #f0f4f8;
        -webkit-font-smoothing: antialiased;
      }
      .wrapper {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 4px 30px rgba(0,0,0,0.08);
      }
      /* ─── Header ─────────────────────────────────────────────── */
      .header {
        background: linear-gradient(135deg, #0c1a2e 0%, #0e2038 60%, #0b1825 100%);
        padding: 48px 40px 36px;
        text-align: center;
        position: relative;
      }
      .header-top-line {
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 3px;
        background: linear-gradient(90deg, transparent, #D4A843, transparent);
      }
      .logo-wrap {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: rgba(212,168,67,0.12);
        border: 1px solid rgba(212,168,67,0.3);
        border-radius: 16px;
        width: 64px; height: 64px;
        margin-bottom: 20px;
      }
      .logo-wrap img { width: 40px; height: 40px; }
      .brand-name {
        font-size: 28px;
        font-weight: 800;
        color: #ffffff;
        letter-spacing: -0.5px;
      }
      .brand-name span {
        background: linear-gradient(135deg, #D4A843, #C4941E);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .header-tagline {
        color: rgba(255,255,255,0.55);
        font-size: 13px;
        margin-top: 6px;
        letter-spacing: 0.5px;
      }
      /* ─── Hero Banner ─────────────────────────────────────────── */
      .hero {
        background: linear-gradient(135deg, #D4A843 0%, #C4941E 100%);
        padding: 36px 40px;
        text-align: center;
      }
      .hero-emoji { font-size: 40px; margin-bottom: 12px; display: block; }
      .hero h1 {
        font-size: 26px;
        font-weight: 800;
        color: #0c1a2e;
        margin-bottom: 8px;
      }
      .hero p {
        font-size: 14px;
        color: rgba(12,26,46,0.75);
        line-height: 1.6;
      }
      /* ─── Body ────────────────────────────────────────────────── */
      .body { padding: 40px; }
      .greeting {
        font-size: 17px;
        color: #0c1a2e;
        font-weight: 600;
        margin-bottom: 14px;
      }
      .intro-text {
        font-size: 14.5px;
        color: #4a5568;
        line-height: 1.75;
        margin-bottom: 30px;
      }
      /* ─── What You Get ─────────────────────────────────────────── */
      .section-title {
        font-size: 13px;
        font-weight: 700;
        color: #D4A843;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 16px;
      }
      .features { margin-bottom: 32px; }
      .feature-item {
        display: flex;
        align-items: flex-start;
        gap: 14px;
        padding: 14px 0;
        border-bottom: 1px solid #f0f4f8;
      }
      .feature-item:last-child { border-bottom: none; }
      .feature-icon {
        width: 38px; height: 38px;
        background: rgba(212,168,67,0.1);
        border: 1px solid rgba(212,168,67,0.25);
        border-radius: 10px;
        display: flex; align-items: center; justify-content: center;
        font-size: 18px;
        flex-shrink: 0;
      }
      .feature-title {
        font-size: 14px;
        font-weight: 600;
        color: #0c1a2e;
        margin-bottom: 3px;
      }
      .feature-desc {
        font-size: 13px;
        color: #718096;
        line-height: 1.5;
      }
      /* ─── Stats Strip ─────────────────────────────────────────── */
      .stats {
        background: #f7fafc;
        border: 1px solid #e8edf2;
        border-radius: 14px;
        padding: 24px;
        display: flex;
        justify-content: space-around;
        margin-bottom: 32px;
        text-align: center;
      }
      .stat-number {
        font-size: 22px;
        font-weight: 800;
        color: #D4A843;
      }
      .stat-label {
        font-size: 11.5px;
        color: #a0aec0;
        margin-top: 4px;
        font-weight: 500;
      }
      /* ─── CTA Button ──────────────────────────────────────────── */
      .cta-wrap { text-align: center; margin-bottom: 32px; }
      .cta-btn {
        display: inline-block;
        background: linear-gradient(135deg, #D4A843, #C4941E);
        color: #0c1a2e !important;
        font-size: 14px;
        font-weight: 700;
        padding: 14px 36px;
        border-radius: 12px;
        text-decoration: none;
        letter-spacing: 0.3px;
      }
      /* ─── Footer ──────────────────────────────────────────────── */
      .footer {
        background: #0c1a2e;
        padding: 28px 40px;
        text-align: center;
      }
      .footer p {
        font-size: 12px;
        color: rgba(255,255,255,0.35);
        line-height: 1.8;
      }
      .footer a {
        color: #D4A843;
        text-decoration: none;
      }
      .unsubscribe {
        margin-top: 12px;
        font-size: 11px;
        color: rgba(255,255,255,0.2);
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
  
      <!-- ── Header ──────────────────────────────────────────────── -->
      <div class="header">
        <div class="header-top-line"></div>
        <div class="logo-wrap">
          <!-- Replace src with your actual logo URL -->
          <span style="font-size:28px;">🫘</span>
        </div>
        <div class="brand-name">Invest<span>Beans</span></div>
        <div class="header-tagline">Smart Investing · Daily Insights · Real Results</div>
      </div>
  
      <!-- ── Hero ────────────────────────────────────────────────── -->
      <div class="hero">
        <span class="hero-emoji">🎉</span>
        <h1>You're In! Welcome to the Family</h1>
        <p>Thank you for trusting InvestBeans with your financial journey.<br/>
        You've just joined 50,000+ smart investors.</p>
      </div>
  
      <!-- ── Body ────────────────────────────────────────────────── -->
      <div class="body">
        <div class="greeting">Hello, Future Investor! 👋</div>
        <p class="intro-text">
          We're thrilled to have you on board. At <strong>InvestBeans</strong>, our mission
          is simple — to make the stock market accessible, understandable, and profitable
          for every Indian investor. Whether you're a complete beginner or a seasoned trader,
          we've got something powerful for you every single day.
        </p>
  
        <!-- What You Get -->
        <div class="section-title">✦ What You'll Get Every Day</div>
        <div class="features">
          <div class="feature-item">
            <div class="feature-icon">📈</div>
            <div>
              <div class="feature-title">Daily Market Insights</div>
              <div class="feature-desc">Pre-market briefings, top movers, and sector analysis delivered before the bell rings.</div>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🧠</div>
            <div>
              <div class="feature-title">Expert Stock Analysis</div>
              <div class="feature-desc">Deep dives on trending stocks with buy/sell/hold recommendations backed by data.</div>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🌍</div>
            <div>
              <div class="feature-title">Global Market Pulse</div>
              <div class="feature-desc">NASDAQ, NYSE, SGX Nifty — we track the world so you stay ahead of Dalal Street.</div>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🚀</div>
            <div>
              <div class="feature-title">IPO & New Listings</div>
              <div class="feature-desc">Never miss a hot IPO. Get GMP, subscription data, and expert verdicts in your inbox.</div>
            </div>
          </div>
        </div>
  
        <!-- Stats -->
        <div class="stats">
          <div>
            <div class="stat-number">50K+</div>
            <div class="stat-label">Subscribers</div>
          </div>
          <div>
            <div class="stat-number">Daily</div>
            <div class="stat-label">Insights</div>
          </div>
          <div>
            <div class="stat-number">100%</div>
            <div class="stat-label">Free Newsletter</div>
          </div>
        </div>
  
        <!-- CTA -->
        <div class="cta-wrap">
          <a href="https://investbeans.com" class="cta-btn">
            🫘 Explore InvestBeans →
          </a>
        </div>
  
        <p style="font-size:13px; color:#718096; line-height:1.7; text-align:center;">
          Your subscribed email is <strong style="color:#0c1a2e;">${email}</strong>.<br/>
          Our first insight will land in your inbox tomorrow morning. Stay tuned!
        </p>
      </div>
  
      <!-- ── Footer ──────────────────────────────────────────────── -->
      <div class="footer">
        <p>
          © ${year} <strong style="color:rgba(255,255,255,0.6)">InvestBeans</strong> · All rights reserved<br/>
          Making India's Investors Smarter, One Bean at a Time 🫘<br/><br/>
          <a href="https://investbeans.com/privacy">Privacy Policy</a> &nbsp;·&nbsp;
          <a href="https://investbeans.com/terms">Terms of Service</a> &nbsp;·&nbsp;
          <a href="https://investbeans.com">Visit Website</a>
        </p>
        <p class="unsubscribe">
          You're receiving this because you subscribed at investbeans.com<br/>
          <a href="https://investbeans.com/unsubscribe" style="color:rgba(255,255,255,0.2)">Unsubscribe</a>
        </p>
      </div>
  
    </div>
  </body>
  </html>
    `.trim();
  };