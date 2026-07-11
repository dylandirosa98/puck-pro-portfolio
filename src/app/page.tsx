import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PuckPro Media | Build Your Hockey Portfolio",
  description: "Build and publish a complete hockey recruiting portfolio from your phone.",
};

const landingStyles = "@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@700;900&family=Wix+Madefor+Display:wght@400;500;600&display=swap');\n\n  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }\n\n  :root {\n    --black: #111111;\n    --white: #FFFFFF;\n    --offwhite: #F5F5F5;\n    --grey: #E8E8E8;\n    --darkgrey: #444444;\n    --muted: #888888;\n    --border: #DCDCDC;\n  }\n\n  .hr-landing-page {\n    background: var(--white);\n    color: var(--black);\n    font-family: 'Wix Madefor Display', sans-serif;\n    font-size: 16px;\n    line-height: 1.6;\n    -webkit-font-smoothing: antialiased;\n  }\n\n  /* \u2500\u2500 HERO \u2500\u2500 */\n  .hr-hero {\n    background: var(--black);\n    color: var(--white);\n    text-align: center;\n    padding: 72px 24px 64px;\n    position: relative;\n    overflow: hidden;\n  }\n  .hr-hero::before {\n    content: 'HR';\n    position: absolute;\n    font-family: 'Kanit', sans-serif;\n    font-weight: 900;\n    font-size: clamp(180px, 30vw, 420px);\n    color: rgba(255,255,255,0.03);\n    letter-spacing: -0.05em;\n    top: 50%; left: 50%;\n    transform: translate(-50%, -50%);\n    pointer-events: none;\n  }\n  .hr-logo-wrap {\n    margin-bottom: 36px;\n    position: relative;\n    z-index: 1;\n  }\n  .hr-logo-wrap img {\n    height: 80px;\n    width: auto;\n    filter: brightness(0) invert(1);\n  }\n  .hr-eyebrow {\n    font-family: 'Wix Madefor Display', sans-serif;\n    font-size: 12px;\n    font-weight: 600;\n    letter-spacing: 0.22em;\n    text-transform: uppercase;\n    color: rgba(255,255,255,0.5);\n    margin-bottom: 18px;\n    position: relative;\n    z-index: 1;\n  }\n  .hr-hero h1 {\n    font-family: 'Kanit', sans-serif;\n    font-weight: 700;\n    font-size: clamp(48px, 8vw, 96px);\n    line-height: 0.92;\n    text-transform: uppercase;\n    letter-spacing: -0.01em;\n    margin-bottom: 20px;\n    position: relative;\n    z-index: 1;\n  }\n  .hr-hero-sub {\n    font-family: 'Wix Madefor Display', sans-serif;\n    font-size: 17px;\n    color: rgba(255,255,255,0.6);\n    max-width: 500px;\n    margin: 0 auto 48px;\n    line-height: 1.7;\n    position: relative;\n    z-index: 1;\n  }\n\n\n\n  /* \u2500\u2500 PROMO BANNER \u2500\u2500 */\n  .hr-banner {\n    background: var(--black);\n    border-top: 1px solid #2A2A2A;\n    color: var(--white);\n    text-align: center;\n    padding: 14px 20px;\n    font-family: 'Wix Madefor Display', sans-serif;\n    font-weight: 600;\n    font-size: 14px;\n    letter-spacing: 0.08em;\n    text-transform: uppercase;\n  }\n\n  /* \u2500\u2500 SECTIONS \u2500\u2500 */\n  .hr-section { padding: 80px 24px; }\n  .hr-section-dark { background: var(--black); color: var(--white); }\n  .hr-section-light { background: var(--offwhite); }\n  .hr-container { max-width: 1060px; margin: 0 auto; }\n\n  .hr-eyebrow-sm {\n    font-family: 'Wix Madefor Display', sans-serif;\n    font-size: 11px;\n    font-weight: 600;\n    letter-spacing: 0.22em;\n    text-transform: uppercase;\n    color: var(--muted);\n    margin-bottom: 14px;\n  }\n  .hr-section-title {\n    font-family: 'Kanit', sans-serif;\n    font-weight: 700;\n    font-size: clamp(34px, 5vw, 58px);\n    text-transform: uppercase;\n    line-height: 1;\n    margin-bottom: 16px;\n  }\n  .hr-section-body {\n    font-family: 'Wix Madefor Display', sans-serif;\n    font-size: 16px;\n    color: var(--darkgrey);\n    max-width: 520px;\n    line-height: 1.7;\n  }\n  .hr-section-dark .hr-section-body { color: rgba(255,255,255,0.55); }\n  .hr-section-dark .hr-eyebrow-sm { color: rgba(255,255,255,0.4); }\n\n  /* \u2500\u2500 PRICING (above features) \u2500\u2500 */\n  .hr-pricing-grid {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    gap: 1px;\n    background: var(--border);\n    border: 1px solid var(--border);\n    margin-top: 52px;\n  }\n  .hr-plan {\n    background: var(--white);\n    padding: 36px 28px 32px;\n    display: flex;\n    flex-direction: column;\n  }\n  .hr-plan.hr-featured {\n    background: var(--black);\n    color: var(--white);\n    border-top: 3px solid var(--darkgrey);\n  }\n  .hr-plan-badge {\n    font-family: 'Wix Madefor Display', sans-serif;\n    font-size: 10px;\n    font-weight: 600;\n    letter-spacing: 0.18em;\n    text-transform: uppercase;\n    color: var(--muted);\n    margin-bottom: 8px;\n  }\n  .hr-featured .hr-plan-badge { color: rgba(255,255,255,0.45); }\n  .hr-plan-name {\n    font-family: 'Kanit', sans-serif;\n    font-weight: 700;\n    font-size: 28px;\n    text-transform: uppercase;\n    letter-spacing: 0.02em;\n    margin-bottom: 4px;\n  }\n  .hr-plan-desc {\n    font-family: 'Wix Madefor Display', sans-serif;\n    font-size: 13px;\n    color: var(--muted);\n    margin-bottom: 16px;\n    line-height: 1.5;\n  }\n  .hr-featured .hr-plan-desc { color: rgba(255,255,255,0.45); }\n  .hr-plan-price {\n    font-family: 'Kanit', sans-serif;\n    font-weight: 700;\n    font-size: 52px;\n    line-height: 1;\n    margin-bottom: 2px;\n  }\n  .hr-plan-price sup { font-size: 22px; vertical-align: super; }\n  .hr-plan-freq {\n    font-family: 'Wix Madefor Display', sans-serif;\n    font-size: 12px;\n    color: var(--muted);\n    margin-bottom: 24px;\n  }\n  .hr-featured .hr-plan-freq { color: rgba(255,255,255,0.4); }\n  .hr-divider {\n    height: 1px;\n    background: var(--border);\n    margin-bottom: 24px;\n  }\n  .hr-featured .hr-divider { background: #2A2A2A; }\n  .hr-plan-list {\n    list-style: none;\n    flex: 1;\n    margin-bottom: 28px;\n  }\n  .hr-plan-list li {\n    font-family: 'Wix Madefor Display', sans-serif;\n    font-size: 13px;\n    color: #444;\n    padding: 7px 0;\n    border-bottom: 1px solid rgba(0,0,0,0.05);\n    display: flex;\n    align-items: flex-start;\n    gap: 9px;\n    line-height: 1.45;\n  }\n  .hr-featured .hr-plan-list li {\n    color: rgba(255,255,255,0.8);\n    border-bottom-color: rgba(255,255,255,0.12);\n  }\n  .hr-plan-list li::before {\n    content: '-';\n    color: var(--muted);\n    flex-shrink: 0;\n    font-size: 11px;\n    margin-top: 2px;\n  }\n  .hr-featured .hr-plan-list li::before { color: rgba(255,255,255,0.3); }\n\n  .hr-btn {\n    display: block;\n    text-align: center;\n    padding: 13px;\n    font-family: 'Kanit', sans-serif;\n    font-weight: 700;\n    font-size: 14px;\n    letter-spacing: 0.08em;\n    text-transform: uppercase;\n    text-decoration: none;\n    transition: all 0.18s;\n    cursor: pointer;\n  }\n  .hr-btn-outline {\n    border: 1px solid var(--border);\n    color: var(--black);\n    background: transparent;\n  }\n  .hr-btn-outline:hover { border-color: var(--black); background: var(--offwhite); }\n  .hr-btn-fill {\n    background: var(--white);\n    color: var(--black);\n    border: 1px solid var(--white);\n  }\n  .hr-btn-fill:hover { background: var(--grey); }\n\n  /* \u2500\u2500 ADDON \u2500\u2500 */\n  .hr-addon {\n    margin-top: 20px;\n    border: 1px solid var(--border);\n    padding: 22px 26px;\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    gap: 20px;\n    flex-wrap: wrap;\n    background: var(--white);\n  }\n  .hr-addon strong {\n    font-family: 'Kanit', sans-serif;\n    font-weight: 700;\n    font-size: 16px;\n    display: block;\n    margin-bottom: 4px;\n    color: var(--black);\n  }\n  .hr-addon p {\n    font-family: 'Wix Madefor Display', sans-serif;\n    font-size: 13px;\n    color: var(--muted);\n  }\n  .hr-addon-price {\n    font-family: 'Kanit', sans-serif;\n    font-weight: 700;\n    font-size: 26px;\n    white-space: nowrap;\n    color: var(--black);\n  }\n  .hr-addon-price span {\n    font-family: 'Wix Madefor Display', sans-serif;\n    font-size: 13px;\n    color: var(--muted);\n    font-weight: 400;\n  }\n\n  /* \u2500\u2500 FEATURES GRID \u2500\u2500 */\n  .hr-features-header {\n    display: flex;\n    align-items: flex-end;\n    justify-content: space-between;\n    flex-wrap: wrap;\n    gap: 16px;\n    margin-bottom: 0;\n  }\n  .hr-example-link {\n    font-family: 'Wix Madefor Display', sans-serif;\n    font-size: 13px;\n    font-weight: 600;\n    color: var(--black);\n    text-decoration: none;\n    border-bottom: 1px solid var(--black);\n    padding-bottom: 2px;\n    white-space: nowrap;\n    transition: opacity 0.18s;\n  }\n  .hr-example-link:hover { opacity: 0.55; }\n\n  /* Example thumbnails */\n  .hr-examples {\n    display: grid;\n    grid-template-columns: repeat(2, 1fr);\n    gap: 1px;\n    background: var(--border);\n    border: 1px solid var(--border);\n    margin-top: 28px;\n    margin-bottom: 0;\n  }\n  .hr-example-card {\n    background: var(--white);\n    padding: 28px 24px;\n    display: flex;\n    align-items: center;\n    gap: 20px;\n    text-decoration: none;\n    color: var(--black);\n    transition: background 0.18s;\n  }\n  .hr-example-card:hover { background: var(--offwhite); }\n  .hr-example-thumb {\n    width: 56px;\n    height: 56px;\n    border-radius: 50%;\n    background: var(--grey);\n    flex-shrink: 0;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-family: 'Kanit', sans-serif;\n    font-weight: 700;\n    font-size: 18px;\n    color: var(--darkgrey);\n    overflow: hidden;\n  }\n  .hr-example-thumb img { width: 100%; height: 100%; object-fit: cover; }\n  .hr-example-info {}\n  .hr-example-name {\n    font-family: 'Kanit', sans-serif;\n    font-weight: 700;\n    font-size: 18px;\n    text-transform: uppercase;\n    line-height: 1.1;\n    margin-bottom: 4px;\n  }\n  .hr-example-meta {\n    font-family: 'Wix Madefor Display', sans-serif;\n    font-size: 12px;\n    color: var(--muted);\n  }\n  .hr-example-arrow {\n    margin-left: auto;\n    font-size: 18px;\n    color: var(--muted);\n    flex-shrink: 0;\n  }\n\n  .hr-features {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    gap: 1px;\n    background: var(--border);\n    border: 1px solid var(--border);\n    margin-top: 40px;\n  }\n  .hr-feature {\n    background: var(--white);\n    padding: 32px 28px;\n    transition: background 0.18s;\n  }\n  .hr-feature:hover { background: var(--offwhite); }\n  .hr-feat-num {\n    font-family: 'Wix Madefor Display', sans-serif;\n    font-size: 11px;\n    font-weight: 600;\n    letter-spacing: 0.2em;\n    color: var(--muted);\n    margin-bottom: 10px;\n  }\n  .hr-feature h3 {\n    font-family: 'Kanit', sans-serif;\n    font-weight: 700;\n    font-size: 22px;\n    text-transform: uppercase;\n    letter-spacing: 0.03em;\n    margin-bottom: 10px;\n    color: var(--black);\n  }\n  .hr-feature p {\n    font-family: 'Wix Madefor Display', sans-serif;\n    font-size: 14px;\n    color: var(--darkgrey);\n    line-height: 1.65;\n  }\n\n  /* \u2500\u2500 PROCESS \u2500\u2500 */\n  .hr-process {\n    display: grid;\n    grid-template-columns: repeat(4, 1fr);\n    gap: 36px;\n    margin-top: 52px;\n  }\n  .hr-step-num {\n    font-family: 'Kanit', sans-serif;\n    font-size: 44px;\n    font-weight: 700;\n    color: rgba(255,255,255,0.12);\n    line-height: 1;\n    margin-bottom: 10px;\n  }\n  .hr-process-item h4 {\n    font-family: 'Kanit', sans-serif;\n    font-weight: 700;\n    font-size: 18px;\n    text-transform: uppercase;\n    letter-spacing: 0.05em;\n    margin-bottom: 8px;\n    color: var(--white);\n  }\n  .hr-process-item p {\n    font-family: 'Wix Madefor Display', sans-serif;\n    font-size: 13px;\n    color: rgba(255,255,255,0.5);\n    line-height: 1.65;\n  }\n\n  /* \u2500\u2500 FINAL CTA \u2500\u2500 */\n  .hr-final {\n    background: var(--black);\n    color: var(--white);\n    text-align: center;\n    padding: 80px 24px;\n  }\n  .hr-final h2 {\n    font-family: 'Kanit', sans-serif;\n    font-weight: 700;\n    font-size: clamp(38px, 6vw, 72px);\n    text-transform: uppercase;\n    line-height: 0.95;\n    margin-bottom: 20px;\n  }\n  .hr-final p {\n    font-family: 'Wix Madefor Display', sans-serif;\n    font-size: 16px;\n    color: rgba(255,255,255,0.6);\n    max-width: 440px;\n    margin: 0 auto 36px;\n    line-height: 1.6;\n  }\n  .hr-final a {\n    display: inline-block;\n    background: var(--white);\n    color: var(--black);\n    font-family: 'Kanit', sans-serif;\n    font-weight: 700;\n    font-size: 17px;\n    letter-spacing: 0.08em;\n    text-transform: uppercase;\n    padding: 15px 44px;\n    text-decoration: none;\n    transition: opacity 0.18s;\n  }\n  .hr-final a:hover { opacity: 0.85; }\n\n  /* \u2500\u2500 RESPONSIVE \u2500\u2500 */\n  @media (max-width: 860px) {\n    .hr-hero {\n      padding: 58px 20px 52px;\n    }\n\n    .hr-logo-wrap img {\n      height: 68px;\n      max-width: 82vw;\n    }\n\n    .hr-eyebrow {\n      max-width: 520px;\n      margin-left: auto;\n      margin-right: auto;\n      letter-spacing: 0.14em;\n      line-height: 1.5;\n    }\n\n    .hr-hero-sub {\n      margin-bottom: 34px;\n    }\n\n    .hr-banner {\n      font-size: 12px;\n      line-height: 1.5;\n      letter-spacing: 0.06em;\n    }\n\n    .hr-pricing-grid { grid-template-columns: 1fr; }\n    .hr-features { grid-template-columns: repeat(2, 1fr); }\n    .hr-process { grid-template-columns: repeat(2, 1fr); }\n    .hr-examples { grid-template-columns: 1fr; }\n\n    .hr-plan {\n      padding: 32px 24px;\n    }\n\n    .hr-btn {\n      min-height: 48px;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n    }\n  }\n\n  @media (max-width: 560px) {\n    .hr-features { grid-template-columns: 1fr; }\n    .hr-process { grid-template-columns: 1fr; }\n\n    .hr-landing-page {\n      font-size: 15px;\n    }\n\n    .hr-hero {\n      padding: 44px 16px 42px;\n    }\n\n    .hr-hero::before {\n      font-size: 190px;\n    }\n\n    .hr-logo-wrap {\n      margin-bottom: 28px;\n    }\n\n    .hr-logo-wrap img {\n      height: 56px;\n    }\n\n    .hr-eyebrow,\n    .hr-eyebrow-sm {\n      letter-spacing: 0.12em;\n    }\n\n    .hr-hero h1 {\n      font-size: 46px;\n      line-height: 0.96;\n    }\n\n    .hr-hero-sub {\n      font-size: 15px;\n      line-height: 1.6;\n      margin-bottom: 24px;\n    }\n\n    .hr-section {\n      padding: 52px 16px;\n    }\n\n    .hr-section-title {\n      font-size: 36px;\n      line-height: 1.02;\n    }\n\n    .hr-section-body {\n      font-size: 15px;\n    }\n\n    .hr-pricing-grid,\n    .hr-features,\n    .hr-examples {\n      margin-top: 32px;\n    }\n\n    .hr-plan {\n      padding: 28px 20px;\n    }\n\n    .hr-plan-name {\n      font-size: 25px;\n    }\n\n    .hr-plan-price {\n      font-size: 46px;\n    }\n\n    .hr-addon {\n      align-items: flex-start;\n      padding: 20px;\n    }\n\n    .hr-addon-price {\n      width: 100%;\n      font-size: 24px;\n    }\n\n    .hr-features-header {\n      display: block;\n    }\n\n    .hr-example-link {\n      display: inline-block;\n      margin-top: 18px;\n      white-space: normal;\n    }\n\n    .hr-feature {\n      padding: 28px 20px;\n    }\n\n    .hr-feature h3 {\n      font-size: 21px;\n    }\n\n    .hr-example-card {\n      align-items: flex-start;\n      gap: 14px;\n      padding: 22px 18px;\n    }\n\n    .hr-example-thumb {\n      width: 48px;\n      height: 48px;\n      font-size: 16px;\n    }\n\n    .hr-example-name {\n      font-size: 16px;\n    }\n\n    .hr-example-arrow {\n      padding-top: 2px;\n    }\n\n    .hr-process {\n      gap: 28px;\n      margin-top: 36px;\n    }\n\n    .hr-step-num {\n      font-size: 38px;\n    }\n  }\n\n  @media (max-width: 380px) {\n    .hr-hero h1 {\n      font-size: 40px;\n    }\n\n    .hr-section-title {\n      font-size: 32px;\n    }\n\n    .hr-plan,\n    .hr-feature,\n    .hr-example-card,\n    .hr-addon {\n      padding-left: 16px;\n      padding-right: 16px;\n    }\n\n    .hr-example-card {\n      gap: 12px;\n    }\n  }\n\n  /* \u2500\u2500 REVEAL \u2500\u2500 */\n  .hr-reveal {\n    opacity: 0;\n    transform: translateY(20px);\n    transition: opacity 0.55s ease, transform 0.55s ease;\n  }\n  .hr-reveal.hr-visible { opacity: 1; transform: none; }\n\n.hr-landing-page .hr-reveal { opacity: 1; transform: none; }\n";

const landingMarkup = "<!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 HERO \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->\n<div class=\"hr-hero\">\n  <div class=\"hr-logo-wrap hr-reveal\">\n    <img\n      src=\"https://static.wixstatic.com/media/3bd810_119617a64ff1464b966999b6c6859d4a~mv2.png/v1/fill/w_304,h_154,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/ppm%20png_edited.png\"\n      alt=\"PuckPro Media\"\n    />\n  </div>\n  <p class=\"hr-eyebrow hr-reveal\">$300 Setup Fee Waived for Existing Customers \u2014 June 2026 Only</p>\n  <h1 class=\"hr-reveal\">The Hockey<br>R\u00e9sum\u00e9</h1>\n  <p class=\"hr-hero-sub hr-reveal\">A complete digital profile designed to grow with your player season after season.</p>\n\n\n</div>\n\n<!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 PROMO BANNER \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->\n<div class=\"hr-banner\">\n  $300 setup fee waived for existing customers \u2014 June 2026 only\n</div>\n\n<!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 PRICING \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->\n<div class=\"hr-section\" id=\"hr-pricing\">\n  <div class=\"hr-container\">\n    <div class=\"hr-reveal\">\n      <p class=\"hr-eyebrow-sm\">Plans & Pricing</p>\n      <h2 class=\"hr-section-title\">Choose your level</h2>\n      <p class=\"hr-section-body\">All plans include your Hockey R\u00e9sum\u00e9 setup, monthly hosting, and ongoing maintenance. Cancel anytime.</p>\n    </div>\n\n    <div class=\"hr-pricing-grid hr-reveal\">\n\n      <div class=\"hr-plan\">\n        <p class=\"hr-plan-badge\">Starter</p>\n        <div class=\"hr-plan-name\">Maintenance</div>\n        <p class=\"hr-plan-desc\">Keep your r\u00e9sum\u00e9 current with monthly updates.</p>\n        <div class=\"hr-plan-price\"><sup>$</sup>34</div>\n        <div class=\"hr-plan-freq\">per month</div>\n        <div class=\"hr-divider\"></div>\n        <ul class=\"hr-plan-list\">\n          <li>Monthly hosting</li>\n          <li>Highlights added once per month (end-of-month batch update)</li>\n          <li>Stats updated monthly</li>\n          <li>One timeline entry</li>\n        </ul>\n        <a href=\"https://buy.stripe.com/eVq8wQdfbeu80xR5dUeUU3H\" target=\"_blank\" class=\"hr-btn hr-btn-outline\">Sign Up \u2192</a>\n      </div>\n\n      <div class=\"hr-plan hr-featured\">\n        <p class=\"hr-plan-badge\">Most Popular</p>\n        <div class=\"hr-plan-name\">Next Level</div>\n        <p class=\"hr-plan-desc\">More updates, more visibility, more momentum.</p>\n        <div class=\"hr-plan-price\"><sup>$</sup>97</div>\n        <div class=\"hr-plan-freq\">per month</div>\n        <div class=\"hr-divider\"></div>\n        <ul class=\"hr-plan-list\">\n          <li>Monthly hosting</li>\n          <li>Highlights added twice per month</li>\n          <li>Stats updated monthly</li>\n          <li>One timeline entry</li>\n          <li>Player profile section updated with new videos that fit described skillset</li>\n          <li>One training session edited + added to training section</li>\n          <li>Outside the Rink & academic sections updated</li>\n        </ul>\n        <a href=\"https://buy.stripe.com/eVqaEY2Ax0Di1BV6hYeUU3I\" target=\"_blank\" class=\"hr-btn hr-btn-fill\">Sign Up \u2192</a>\n      </div>\n\n      <div class=\"hr-plan\">\n        <p class=\"hr-plan-badge\">Elite</p>\n        <div class=\"hr-plan-name\">Full Stack</div>\n        <p class=\"hr-plan-desc\">An updated Recruiting Video every month to keep your resume fresh. Nothing left out.</p>\n        <div class=\"hr-plan-price\"><sup>$</sup>419</div>\n        <div class=\"hr-plan-freq\">per month</div>\n        <div class=\"hr-divider\"></div>\n        <ul class=\"hr-plan-list\">\n          <li>Monthly hosting</li>\n          <li>Highlights added weekly</li>\n          <li>Stats updated monthly</li>\n          <li>One timeline entry</li>\n          <li>Player profile section updated with new videos that fit described skillset</li>\n          <li>Two training sessions edited + added to training section</li>\n          <li>One full Recruiting Highlight Video per month</li>\n          <li>4 edited social media posts per month</li>\n          <li>Outside the Rink & academic sections updated</li>\n          <li>Priority editing turnaround (72h)</li>\n        </ul>\n        <a href=\"https://buy.stripe.com/dRmcN66QN85K6WfeOueUU3J\" target=\"_blank\" class=\"hr-btn hr-btn-outline\">Sign Up \u2192</a>\n      </div>\n\n    </div>\n\n    <div class=\"hr-addon hr-reveal\">\n      <div>\n        <strong>Add-On: Custom Domain</strong>\n        <p>Give your athlete a shareable professional URL \u2014 like gianlucatrazzera.com \u2014 instead of a generic link. Option available in onboarding email after checkout.</p>\n      </div>\n      <div class=\"hr-addon-price\">$25 <span>/ year</span></div>\n    </div>\n\n  </div>\n</div>\n\n<!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 WHAT'S INSIDE \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->\n<div class=\"hr-section hr-section-light\">\n  <div class=\"hr-container\">\n\n    <div class=\"hr-features-header hr-reveal\">\n      <div>\n        <p class=\"hr-eyebrow-sm\">What's Inside</p>\n        <h2 class=\"hr-section-title\">Every section<br>tells the story</h2>\n        <p class=\"hr-section-body\">We build and maintain six sections that work together to provide a complete picture of your athlete.</p>\n      </div>\n      <a href=\"#hr-examples\" class=\"hr-example-link\">View Examples \u2193</a>\n    </div>\n\n    <div class=\"hr-features hr-reveal\">\n      <div class=\"hr-feature\">\n        <p class=\"hr-feat-num\">01</p>\n        <h3>Identity</h3>\n        <p>Vital stats, physical metrics, and quick-link buttons to game film, academics, and Elite Prospects \u2014 all in one instantly legible card.</p>\n      </div>\n      <div class=\"hr-feature\">\n        <p class=\"hr-feat-num\">02</p>\n        <h3>Highlights</h3>\n        <p>The r\u00e9sum\u00e9 is built around your videos. We'll showcase key moments from all of your game film, giving coaches a frictionless snapshot into your skillset.</p>\n      </div>\n      <div class=\"hr-feature\">\n        <p class=\"hr-feat-num\">03</p>\n        <h3>Characteristics</h3>\n        <p>Hockey IQ, compete level, puck possession \u2014 each trait linked directly to supporting video. Words backed by proof, built to show what role you fill on a team.</p>\n      </div>\n      <div class=\"hr-feature\">\n        <p class=\"hr-feat-num\">04</p>\n        <h3>Training</h3>\n        <p>Behind-the-scenes documentation of your athlete's work ethic and commitment \u2014 one of the strongest signals a recruiter can see.</p>\n      </div>\n      <div class=\"hr-feature\">\n        <p class=\"hr-feat-num\">05</p>\n        <h3>Extra-Curriculars</h3>\n        <p>Who is your athlete off the ice? This section shows coaches the character and locker-room chemistry behind the player.</p>\n      </div>\n      <div class=\"hr-feature\">\n        <p class=\"hr-feat-num\">06</p>\n        <h3>Timeline</h3>\n        <p>A living news feed built to show your progress over time with recent results & milestones, so the profile is always current. Look back over time to see the progress you've made.</p>\n      </div>\n    </div>\n\n    <!-- EXAMPLES -->\n    <div id=\"hr-examples\" style=\"margin-top: 52px;\" class=\"hr-reveal\">\n      <p class=\"hr-eyebrow-sm\">Live Examples</p>\n      <h3 style=\"font-family:'Kanit',sans-serif;font-weight:700;font-size:28px;text-transform:uppercase;margin-bottom:4px;\">See it in action</h3>\n      <p style=\"font-family:'Wix Madefor Display',sans-serif;font-size:14px;color:var(--muted);margin-bottom:0;\">Click either profile below to see a real Hockey R\u00e9sum\u00e9.</p>\n    </div>\n\n    <div class=\"hr-examples hr-reveal\">\n      <!-- EXAMPLE 1 \u2014 replace href and details when you have the URL -->\n      <a href=\"https://www.gianlucasantinotrazzera.com/\" target=\"_blank\" class=\"hr-example-card\">\n        <div class=\"hr-example-thumb\">GT</div>\n        <div class=\"hr-example-info\">\n          <div class=\"hr-example-name\">Gianluca Trazzera</div>\n          <div class=\"hr-example-meta\">Defense \u00b7 Long Island Gulls 15UAA</div>\n        </div>\n        <span class=\"hr-example-arrow\">\u2192</span>\n      </a>\n      <!-- EXAMPLE 2 \u2014 replace href and details when you have the URL -->\n      <a href=\"https://profile.puckpromedia.com/massimo-didonna\" target=\"_blank\" class=\"hr-example-card\">\n        <div class=\"hr-example-thumb\">MD</div>\n        <div class=\"hr-example-info\">\n          <div class=\"hr-example-name\">Massimo DiDonna</div>\n          <div class=\"hr-example-meta\">Forward \u00b7 NJ Titans 2013 AAA</div>\n        </div>\n        <span class=\"hr-example-arrow\">\u2192</span>\n      </a>\n    </div>\n\n  </div>\n</div>\n\n<!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 HOW IT WORKS \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->\n<div class=\"hr-section hr-section-dark\">\n  <div class=\"hr-container\">\n    <div class=\"hr-reveal\">\n      <p class=\"hr-eyebrow-sm\">The Process</p>\n      <h2 class=\"hr-section-title\">We handle<br>everything</h2>\n      <p class=\"hr-section-body\">After you sign up, we take it from there. No tech setup, no platform to learn.</p>\n    </div>\n\n    <div class=\"hr-process hr-reveal\">\n      <div class=\"hr-process-item\">\n        <div class=\"hr-step-num\">01</div>\n        <h4>Sign Up</h4>\n        <p>Choose your plan and complete checkout. You'll receive an onboarding form within 24 hours to tell us about your athlete.</p>\n      </div>\n      <div class=\"hr-process-item\">\n        <div class=\"hr-step-num\">02</div>\n        <h4>We Build It</h4>\n        <p>Our team builds every section of your athlete's Hockey R\u00e9sum\u00e9 \u2014 professional, polished, and ready to share.</p>\n      </div>\n      <div class=\"hr-process-item\">\n        <div class=\"hr-step-num\">03</div>\n        <h4>We Keep It Current</h4>\n        <p>Every month we update stats, highlights, and sections so the profile is always recruiter-ready.</p>\n      </div>\n      <div class=\"hr-process-item\">\n        <div class=\"hr-step-num\">04</div>\n        <h4>You Share It</h4>\n        <p>Send the link to scouts, coaches, and programs. One URL. One professional impression.</p>\n      </div>\n    </div>\n  </div>\n</div>";

const builderPricingMarkup = `
<div class="hr-section" id="hr-pricing">
  <div class="hr-container">
    <div class="hr-reveal">
      <p class="hr-eyebrow-sm">Simple monthly pricing</p>
      <h2 class="hr-section-title">Choose your plan</h2>
      <p class="hr-section-body">Build first, preview everything, and choose a plan when you are ready to publish.</p>
    </div>

    <div class="hr-pricing-grid hr-reveal">
      <div class="hr-plan">
        <p class="hr-plan-badge">Standard</p>
        <div class="hr-plan-name">Portfolio</div>
        <p class="hr-plan-desc">A complete, shareable player portfolio with everything in one place.</p>
        <div class="hr-plan-price"><sup>$</sup>29</div>
        <div class="hr-plan-freq">per month</div>
        <div class="hr-divider"></div>
        <ul class="hr-plan-list">
          <li>Full mobile portfolio builder</li>
          <li>Photos, stats, highlights, and player story</li>
          <li>Secure hosting and a shareable profile link</li>
          <li>Edit your portfolio anytime</li>
        </ul>
        <a href="/builder" class="hr-btn hr-btn-outline">Start building</a>
      </div>

      <div class="hr-plan hr-featured">
        <p class="hr-plan-badge">Premium</p>
        <div class="hr-plan-name">Custom Domain</div>
        <p class="hr-plan-desc">Everything in Standard with a professional domain of your own.</p>
        <div class="hr-plan-price"><sup>$</sup>39</div>
        <div class="hr-plan-freq">per month</div>
        <div class="hr-divider"></div>
        <ul class="hr-plan-list">
          <li>Everything in Standard</li>
          <li>One custom domain included</li>
          <li>Search for your domain inside the builder</li>
          <li>Domain setup and renewal managed for you</li>
        </ul>
        <a href="/builder" class="hr-btn hr-btn-fill">Start building</a>
      </div>
    </div>
  </div>
</div>
`;

const builderProcessMarkup = `
<div class="hr-section hr-section-dark">
  <div class="hr-container">
    <div class="hr-reveal">
      <p class="hr-eyebrow-sm">The process</p>
      <h2 class="hr-section-title">Build it<br>your way</h2>
      <p class="hr-section-body">Create the full portfolio from your phone. Your draft saves as you go.</p>
    </div>

    <div class="hr-process hr-reveal">
      <div class="hr-process-item">
        <div class="hr-step-num">01</div>
        <h4>Add the basics</h4>
        <p>Enter player details, team information, and current stats.</p>
      </div>
      <div class="hr-process-item">
        <div class="hr-step-num">02</div>
        <h4>Tell the story</h4>
        <p>Add photos, highlights, skills, training, and recruiting links.</p>
      </div>
      <div class="hr-process-item">
        <div class="hr-step-num">03</div>
        <h4>Preview it</h4>
        <p>See every change in a phone-sized preview before anything goes live.</p>
      </div>
      <div class="hr-process-item">
        <div class="hr-step-num">04</div>
        <h4>Publish and share</h4>
        <p>Choose a plan, finish secure checkout, and share one professional link.</p>
      </div>
    </div>
  </div>
</div>
<div class="hr-final">
  <h2>Build your hockey resume</h2>
  <p>Start with the player basics. You can preview the entire portfolio before choosing a plan.</p>
  <a href="/builder">Open the builder</a>
</div>
`;

const builderLandingStyles = landingStyles + `
  .hr-pricing-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    max-width: 780px;
    margin-left: auto;
    margin-right: auto;
  }
  .hr-plan-price {
    display: flex;
    align-items: flex-start;
    gap: 2px;
  }
  .hr-plan-price sup {
    line-height: 1;
    padding-top: 5px;
    vertical-align: baseline;
  }
  .hr-hero-cta {
    display: inline-flex;
    min-height: 50px;
    align-items: center;
    justify-content: center;
    background: var(--white);
    color: var(--black);
    font-family: 'Kanit', sans-serif;
    font-weight: 700;
    font-size: 16px;
    text-transform: uppercase;
    text-decoration: none;
    padding: 13px 32px;
    position: relative;
    z-index: 1;
  }
  @media (max-width: 680px) {
    .hr-pricing-grid { grid-template-columns: 1fr; }
    .hr-hero-cta { width: 100%; max-width: 340px; }
  }
`;

const builderLandingMarkup = (() => {
  let markup = landingMarkup
    .replace("$300 Setup Fee Waived for Existing Customers — June 2026 Only", "Build your own recruiting portfolio")
    .replace(
      '<p class="hr-hero-sub hr-reveal">A complete digital profile designed to grow with your player season after season.</p>',
      '<p class="hr-hero-sub hr-reveal">A complete hockey portfolio you can build, preview, and publish right from your phone.</p><a class="hr-hero-cta hr-reveal" href="/builder">Start building</a>',
    )
    .replace(/<div class="hr-banner">[\s\S]*?<\/div>/, "")
    .replace(
      "We build and maintain six sections that work together to provide a complete picture of your athlete.",
      "Build the sections that work together to give coaches a complete picture of your athlete.",
    )
    .replace(
      "We'll showcase key moments from all of your game film, giving coaches a frictionless snapshot into your skillset.",
      "Showcase key moments from game film and give coaches a frictionless snapshot of the player's skillset.",
    );

  const pricingStart = markup.indexOf('<div class="hr-section" id="hr-pricing">');
  const pricingEnd = markup.indexOf('<div class="hr-section hr-section-light">');
  if (pricingStart >= 0 && pricingEnd > pricingStart) {
    markup = markup.slice(0, pricingStart) + builderPricingMarkup + "\n" + markup.slice(pricingEnd);
  }

  const processStart = markup.lastIndexOf('<div class="hr-section hr-section-dark">');
  if (processStart >= 0) {
    markup = markup.slice(0, processStart) + builderProcessMarkup;
  }

  return markup;
})();

export default function Home() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: builderLandingStyles }} />
      <main
        className="hr-landing-page"
        dangerouslySetInnerHTML={{ __html: builderLandingMarkup }}
      />
    </>
  );
}
