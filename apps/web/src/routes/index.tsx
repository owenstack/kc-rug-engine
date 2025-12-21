import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
	component: HomeComponent,
	head: () => ({
		meta: [
			{
				title: "RugEngine | Dominate SOL & BNB Blockchain",
			},
			{
				name: "description",
				content:
					"Create and manage SOL & BNB tokens with RugEngine. Features include fast deployment, instant liquidation, multi-wallet management, and social media promotion tools.",
			},
		],
	}),
});

// ═══════════════════════════════════════════════════════════════
// LANDING PAGE STYLES
// ═══════════════════════════════════════════════════════════════

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Sora:wght@300;400;500;600;700&display=swap');

  /* ═══ CUSTOM PROPERTIES ═══ */
  :root {
    --re-neon-green: #00ff88;
    --re-neon-green-dim: #00ff8840;
    --re-electric-blue: #00d4ff;
    --re-electric-purple: #a855f7;
    --re-hot-pink: #ff0080;
    --re-dark-void: #0a0a0f;
    --re-dark-surface: #12121a;
    --re-dark-elevated: #1a1a25;
    --re-grid-color: rgba(0, 255, 136, 0.03);
    --re-text-primary: #ffffff;
    --re-text-secondary: #9ca3af;
    --re-text-muted: #6b7280;
    --re-gold: #ffd700;
  }

  /* ═══ BASE RESET ═══ */
  .rugengine-landing * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .rugengine-landing {
    font-family: 'Sora', sans-serif;
    background: var(--re-dark-void);
    color: var(--re-text-primary);
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
  }

  /* ═══ ANIMATED BACKGROUND ═══ */
  .re-bg-grid {
    position: fixed;
    inset: 0;
    background-image: 
      linear-gradient(var(--re-grid-color) 1px, transparent 1px),
      linear-gradient(90deg, var(--re-grid-color) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
    z-index: 0;
  }

  .re-bg-gradient {
    position: fixed;
    inset: 0;
    background: 
      radial-gradient(ellipse 80% 50% at 50% -20%, var(--re-neon-green-dim), transparent),
      radial-gradient(ellipse 60% 40% at 80% 60%, rgba(0, 212, 255, 0.08), transparent),
      radial-gradient(ellipse 50% 30% at 20% 80%, rgba(168, 85, 247, 0.06), transparent);
    pointer-events: none;
    z-index: 1;
  }

  .re-noise {
    position: fixed;
    inset: 0;
    opacity: 0.02;
    pointer-events: none;
    z-index: 2;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  }

  /* ═══ CONTENT WRAPPER ═══ */
  .re-content {
    position: relative;
    z-index: 10;
    padding-top: 60px;
  }

  /* ═══ HERO SECTION ═══ */
  .re-hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    text-align: center;
    position: relative;
  }

  .re-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: linear-gradient(135deg, var(--re-dark-elevated), var(--re-dark-surface));
    border: 1px solid rgba(0, 255, 136, 0.2);
    border-radius: 100px;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--re-neon-green);
    margin-bottom: 2rem;
    animation: fadeSlideDown 0.8s ease-out;
    backdrop-filter: blur(10px);
  }

  .re-hero-badge::before {
    content: '';
    width: 8px;
    height: 8px;
    background: var(--re-neon-green);
    border-radius: 50%;
    animation: pulse-glow 2s infinite;
  }

  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 0 0 var(--re-neon-green-dim); opacity: 1; }
    50% { box-shadow: 0 0 20px 5px var(--re-neon-green-dim); opacity: 0.8; }
  }

  .re-hero-title {
    font-family: 'Orbitron', sans-serif;
    font-size: clamp(3rem, 10vw, 7rem);
    font-weight: 900;
    letter-spacing: -0.02em;
    line-height: 0.95;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #fff 0%, var(--re-neon-green) 50%, var(--re-electric-blue) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: fadeSlideUp 0.8s ease-out 0.1s both;
    text-shadow: 0 0 80px var(--re-neon-green-dim);
  }

  .re-hero-subtitle {
    font-family: 'Orbitron', sans-serif;
    font-size: clamp(0.8rem, 2vw, 1.2rem);
    font-weight: 500;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--re-text-secondary);
    margin-bottom: 2rem;
    animation: fadeSlideUp 0.8s ease-out 0.2s both;
  }

  .re-hero-description {
    font-size: clamp(1rem, 2vw, 1.25rem);
    color: var(--re-text-secondary);
    max-width: 600px;
    line-height: 1.7;
    margin-bottom: 3rem;
    animation: fadeSlideUp 0.8s ease-out 0.3s both;
  }

  .re-hero-cta {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
    animation: fadeSlideUp 0.8s ease-out 0.4s both;
  }

  /* ═══ BUTTONS ═══ */
  .re-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 1rem 2rem;
    font-family: 'Sora', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    text-decoration: none;
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    border: none;
    position: relative;
    overflow: hidden;
  }

  .re-btn-primary {
    background: linear-gradient(135deg, var(--re-neon-green), #00cc6a);
    color: var(--re-dark-void);
    box-shadow: 
      0 0 0 1px var(--re-neon-green),
      0 4px 20px var(--re-neon-green-dim),
      inset 0 1px 0 rgba(255,255,255,0.2);
  }

  .re-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 0 0 1px var(--re-neon-green),
      0 8px 40px var(--re-neon-green-dim),
      0 0 60px var(--re-neon-green-dim),
      inset 0 1px 0 rgba(255,255,255,0.2);
  }

  .re-btn-secondary {
    background: transparent;
    color: var(--re-text-primary);
    border: 1px solid rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
  }

  .re-btn-secondary:hover {
    border-color: var(--re-neon-green);
    color: var(--re-neon-green);
    box-shadow: 0 0 30px var(--re-neon-green-dim);
  }

  /* ═══ SCROLL INDICATOR ═══ */
  .re-scroll-indicator {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: var(--re-text-muted);
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    animation: fadeIn 1s ease-out 1s both;
  }

  .re-scroll-mouse {
    width: 24px;
    height: 40px;
    border: 2px solid var(--re-text-muted);
    border-radius: 12px;
    position: relative;
  }

  .re-scroll-wheel {
    width: 4px;
    height: 8px;
    background: var(--re-neon-green);
    border-radius: 2px;
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    animation: scrollWheel 2s infinite;
  }

  @keyframes scrollWheel {
    0%, 100% { transform: translateX(-50%) translateY(0); opacity: 1; }
    50% { transform: translateX(-50%) translateY(10px); opacity: 0; }
  }

  /* ═══ SECTION STYLES ═══ */
  .re-section {
    padding: 6rem 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .re-section-header {
    text-align: center;
    margin-bottom: 4rem;
  }

  .re-section-label {
    font-family: 'Orbitron', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--re-neon-green);
    margin-bottom: 1rem;
  }

  .re-section-title {
    font-family: 'Orbitron', sans-serif;
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 700;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #fff 30%, var(--re-text-secondary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .re-section-description {
    font-size: 1.1rem;
    color: var(--re-text-secondary);
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.7;
  }

  /* ═══ FEATURES GRID ═══ */
  .re-features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.5rem;
  }

  .re-feature-card {
    background: linear-gradient(135deg, var(--re-dark-surface), var(--re-dark-elevated));
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 2rem;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  .re-feature-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--re-neon-green), transparent);
    opacity: 0;
    transition: opacity 0.4s;
  }

  .re-feature-card:hover {
    transform: translateY(-8px);
    border-color: rgba(0, 255, 136, 0.2);
    box-shadow: 
      0 20px 60px rgba(0, 0, 0, 0.4),
      0 0 60px var(--re-neon-green-dim);
  }

  .re-feature-card:hover::before {
    opacity: 1;
  }

  .re-feature-icon {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, var(--re-neon-green-dim), transparent);
    border: 1px solid var(--re-neon-green);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: var(--re-neon-green);
  }

  .re-feature-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: var(--re-text-primary);
  }

  .re-feature-description {
    font-size: 0.95rem;
    color: var(--re-text-secondary);
    line-height: 1.6;
  }

  /* ═══ INTEGRATIONS ═══ */
  .re-integrations {
    display: flex;
    justify-content: center;
    gap: 3rem;
    flex-wrap: wrap;
  }

  .re-integration-card {
    background: linear-gradient(135deg, var(--re-dark-surface), var(--re-dark-elevated));
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 24px;
    padding: 3rem 4rem;
    text-align: center;
    transition: all 0.4s;
    min-width: 280px;
  }

  .re-integration-card:hover {
    border-color: rgba(0, 212, 255, 0.3);
    box-shadow: 0 20px 60px rgba(0, 212, 255, 0.1);
    transform: translateY(-4px);
  }

  .re-integration-logo {
    font-family: 'Orbitron', sans-serif;
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 0.75rem;
    background: linear-gradient(135deg, var(--re-electric-blue), var(--re-electric-purple));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .re-integration-name {
    font-size: 1rem;
    color: var(--re-text-secondary);
  }

  /* ═══ PRICING ═══ */
  .re-pricing-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 900px;
    margin: 0 auto;
  }

  .re-pricing-card {
    background: linear-gradient(180deg, var(--re-dark-surface), var(--re-dark-elevated));
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 24px;
    padding: 2.5rem;
    position: relative;
    transition: all 0.4s;
  }

  .re-pricing-card.featured {
    border-color: var(--re-neon-green);
    box-shadow: 
      0 0 0 1px var(--re-neon-green),
      0 0 60px var(--re-neon-green-dim);
  }

  .re-pricing-card:hover {
    transform: translateY(-8px);
  }

  .re-pricing-badge {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, var(--re-neon-green), #00cc6a);
    color: var(--re-dark-void);
    padding: 0.5rem 1.5rem;
    border-radius: 100px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .re-pricing-name {
    font-family: 'Orbitron', sans-serif;
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--re-text-primary);
  }

  .re-pricing-description {
    font-size: 0.9rem;
    color: var(--re-text-muted);
    margin-bottom: 2rem;
  }

  .re-pricing-features {
    list-style: none;
    margin-bottom: 2rem;
  }

  .re-pricing-feature {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 0;
    font-size: 0.95rem;
    color: var(--re-text-secondary);
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  }

  .re-pricing-feature:last-child {
    border-bottom: none;
  }

  .re-pricing-check {
    width: 20px;
    height: 20px;
    background: var(--re-neon-green-dim);
    border: 1px solid var(--re-neon-green);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--re-neon-green);
    font-size: 0.7rem;
  }

  /* ═══ FAQ ═══ */
  .re-faq-grid {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .re-faq-item {
    background: linear-gradient(135deg, var(--re-dark-surface), var(--re-dark-elevated));
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 1.5rem 2rem;
    cursor: pointer;
    transition: all 0.3s;
  }

  .re-faq-item:hover {
    border-color: rgba(0, 255, 136, 0.2);
  }

  .re-faq-item.open {
    border-color: var(--re-neon-green);
  }

  .re-faq-question {
    font-family: 'Orbitron', sans-serif;
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--re-text-primary);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .re-faq-toggle {
    width: 24px;
    height: 24px;
    border: 1px solid var(--re-text-muted);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    color: var(--re-text-muted);
  }

  .re-faq-item.open .re-faq-toggle {
    background: var(--re-neon-green);
    border-color: var(--re-neon-green);
    color: var(--re-dark-void);
    transform: rotate(45deg);
  }

  .re-faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: all 0.3s ease-out;
  }

  .re-faq-item.open .re-faq-answer {
    max-height: 200px;
    padding-top: 1rem;
  }

  .re-faq-answer p {
    font-size: 0.95rem;
    color: var(--re-text-secondary);
    line-height: 1.7;
  }

  /* ═══ CTA SECTION ═══ */
  .re-cta-section {
    text-align: center;
    padding: 8rem 2rem;
    position: relative;
  }

  .re-cta-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 400px;
    background: radial-gradient(ellipse, var(--re-neon-green-dim), transparent 70%);
    pointer-events: none;
    opacity: 0.5;
  }

  .re-cta-title {
    font-family: 'Orbitron', sans-serif;
    font-size: clamp(2rem, 5vw, 4rem);
    font-weight: 800;
    margin-bottom: 1.5rem;
    position: relative;
    z-index: 1;
  }

  .re-cta-description {
    font-size: 1.15rem;
    color: var(--re-text-secondary);
    max-width: 500px;
    margin: 0 auto 2.5rem;
    position: relative;
    z-index: 1;
  }

  /* ═══ FOOTER ═══ */
  .re-footer {
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding: 3rem 2rem;
    text-align: center;
  }

  .re-footer-logo {
    font-family: 'Orbitron', sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--re-neon-green);
    margin-bottom: 1rem;
  }

  .re-footer-links {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  .re-footer-link {
    color: var(--re-text-muted);
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.3s;
  }

  .re-footer-link:hover {
    color: var(--re-neon-green);
  }

  .re-footer-copy {
    font-size: 0.85rem;
    color: var(--re-text-muted);
  }

  /* ═══ ANIMATIONS ═══ */
  @keyframes fadeSlideDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* ═══ RESPONSIVE ═══ */
  @media (max-width: 768px) {
    .re-section {
      padding: 4rem 1.5rem;
    }

    .re-hero {
      padding: 1.5rem;
    }

    .re-hero-cta {
      flex-direction: column;
      width: 100%;
      max-width: 300px;
    }

    .re-btn {
      width: 100%;
    }

    .re-features-grid {
      grid-template-columns: 1fr;
    }

    .re-pricing-grid {
      grid-template-columns: 1fr;
    }

    .re-integrations {
      flex-direction: column;
      align-items: center;
    }

    .re-integration-card {
      width: 100%;
      max-width: 300px;
    }
  }

  /* ═══ FLOATING PARTICLES ═══ */
  .re-particles {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }

  .re-particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: var(--re-neon-green);
    border-radius: 50%;
    opacity: 0.3;
    animation: float 20s infinite linear;
  }

  @keyframes float {
    0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
    10% { opacity: 0.3; }
    90% { opacity: 0.3; }
    100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
  }

  /* ═══ CHAINS DECORATION ═══ */
  .re-chain-badges {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 3rem;
    animation: fadeSlideUp 0.8s ease-out 0.5s both;
  }

  .re-chain-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    background: var(--re-dark-surface);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 100px;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--re-text-secondary);
  }

  .re-chain-badge-sol {
    border-color: rgba(148, 85, 255, 0.3);
  }

  .re-chain-badge-sol span {
    color: #9945ff;
  }

  .re-chain-badge-bnb {
    border-color: rgba(243, 186, 47, 0.3);
  }

  .re-chain-badge-bnb span {
    color: #f3ba2f;
  }

  /* ═══ GLOW TEXT ═══ */
  .re-glow-text {
    color: var(--re-neon-green);
    text-shadow: 0 0 20px var(--re-neon-green-dim);
  }

  /* ═══ DISCLAIMER ═══ */
  .re-disclaimer {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: rgba(0, 255, 136, 0.05);
    border: 1px solid rgba(0, 255, 136, 0.15);
    border-radius: 8px;
    font-size: 0.85rem;
    color: var(--re-text-secondary);
    margin-top: 2rem;
    animation: fadeSlideUp 0.8s ease-out 0.6s both;
  }
`;

// ═══════════════════════════════════════════════════════════════
// FEATURE DATA
// ═══════════════════════════════════════════════════════════════

const features = [
	{
		icon: "⚡",
		title: "Fast Deployment",
		description:
			"Create and deploy your coins in seconds with our streamlined platform that handles all the complexity for you.",
	},
	{
		icon: "🎯",
		title: "Sell All Button",
		description:
			"One-click solution to instantly liquidate all tokens across multiple wallets with maximum efficiency.",
	},
	{
		icon: "📈",
		title: "Bump It",
		description:
			"Boost your token to the top of Pump.fun and GMGN.AI with organic, tax-free transactions using advanced algorithms.",
	},
	{
		icon: "🔗",
		title: "Bundler",
		description:
			"Securely purchase token supply across multiple sub-wallets at launch without triggering flags on trading platforms.",
	},
	{
		icon: "🤖",
		title: "Ad Bots",
		description:
			"Automated social media engagement to increase your coin's visibility across multiple platforms.",
	},
	{
		icon: "✨",
		title: "User Friendly GUI",
		description:
			"Intuitive interface that makes managing your coins effortless — no technical expertise required.",
	},
];

const pricingFeatures = [
	"Unlimited coins",
	"Bundler bot",
	"Coin mixer",
	"Fast transactions",
	"Multi-launches",
	"Bump it bot",
];

const faqs = [
	{
		question: "What is RugEngine?",
		answer:
			"RugEngine is a comprehensive platform for creating and managing SOL & BNB coins with advanced features like instant liquidation, wallets management, and social media promotion tools. Our platform simplifies the process of deploying and managing tokens while providing essential tools for coin creators.",
	},
	{
		question: "How can I get started with RugEngine?",
		answer:
			"To start, choose a pricing plan that fits your needs and contact us on Telegram to purchase. Our team will guide you through the setup process and help you get the most out of the platform's features.",
	},
	{
		question: "What operating systems does RugEngine support?",
		answer:
			"RugEngine is a web-based platform that works on any modern browser, regardless of your operating system. This includes Windows, macOS, Linux, iOS, and Android devices.",
	},
];

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

function Particles() {
	const particles = Array.from({ length: 20 }, (_, i) => ({
		id: i,
		left: `${Math.random() * 100}%`,
		delay: `${Math.random() * 20}s`,
		duration: `${15 + Math.random() * 10}s`,
	}));

	return (
		<div className="re-particles">
			{particles.map((p) => (
				<div
					key={p.id}
					className="re-particle"
					style={{
						left: p.left,
						animationDelay: p.delay,
						animationDuration: p.duration,
					}}
				/>
			))}
		</div>
	);
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div
			className={`re-faq-item ${isOpen ? "open" : ""}`}
			onClick={() => setIsOpen(!isOpen)}
			onKeyDown={(e) => e.key === "Enter" && setIsOpen(!isOpen)}
		>
			<div className="re-faq-question">
				<span>{question}</span>
				<div className="re-faq-toggle">+</div>
			</div>
			<div className="re-faq-answer">
				<p>{answer}</p>
			</div>
		</div>
	);
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

function HomeComponent() {
	const styleRef = useRef<HTMLStyleElement | null>(null);

	useEffect(() => {
		// Inject styles
		if (!styleRef.current) {
			const styleEl = document.createElement("style");
			styleEl.textContent = styles;
			document.head.appendChild(styleEl);
			styleRef.current = styleEl;
		}

		return () => {
			if (styleRef.current) {
				styleRef.current.remove();
				styleRef.current = null;
			}
		};
	}, []);

	return (
		<div className="rugengine-landing">
			{/* Background Effects */}
			<div className="re-bg-grid" />
			<div className="re-bg-gradient" />
			<div className="re-noise" />
			<Particles />

			{/* Main Content */}
			<div className="re-content">
				{/* Hero Section */}
				<section className="re-hero">
					<div className="re-hero-badge">
						<span>Web3 Token Platform</span>
					</div>

					<h1 className="re-hero-title">RUG ENGINE</h1>
					<p className="re-hero-subtitle">Dominate the Blockchain</p>

					<p className="re-hero-description">
						The ultimate platform for developers and degens to create and manage
						SOL & BNB tokens with advanced tools for deployment, liquidation,
						and promotion.
					</p>

					<div className="re-hero-cta">
						<a
							href="https://t.me/RugEngine"
							target="_blank"
							rel="noopener noreferrer"
							className="re-btn re-btn-primary"
						>
							<span>Get Started</span>
							<span>→</span>
						</a>
						<Link to="/dashboard" className="re-btn re-btn-secondary">
							<span>Dashboard</span>
						</Link>
					</div>

					<div className="re-chain-badges">
						<div className="re-chain-badge re-chain-badge-sol">
							<span>◎</span> Solana
						</div>
						<div className="re-chain-badge re-chain-badge-bnb">
							<span>◆</span> BNB Chain
						</div>
					</div>

					<div className="re-disclaimer">
						RugEngine is a legitimate coin development platform, not associated
						with scams or "rug pulls."
					</div>

					<div className="re-scroll-indicator">
						<div className="re-scroll-mouse">
							<div className="re-scroll-wheel" />
						</div>
						<span>Scroll to explore</span>
					</div>
				</section>

				{/* Features Section */}
				<section className="re-section" id="features">
					<div className="re-section-header">
						<div className="re-section-label">Powerful Features</div>
						<h2 className="re-section-title">
							Everything You Need to Dominate
						</h2>
						<p className="re-section-description">
							Create and manage your coins with powerful tools, all in one
							place.
						</p>
					</div>

					<div className="re-features-grid">
						{features.map((feature) => (
							<div key={feature.title} className="re-feature-card">
								<div className="re-feature-icon">{feature.icon}</div>
								<h3 className="re-feature-title">{feature.title}</h3>
								<p className="re-feature-description">{feature.description}</p>
							</div>
						))}
					</div>
				</section>

				{/* Integrations Section */}
				<section className="re-section">
					<div className="re-section-header">
						<div className="re-section-label">Seamless Integration</div>
						<h2 className="re-section-title">
							Instantly Listed on Top Platforms
						</h2>
						<p className="re-section-description">
							Your tokens are automatically visible on the leading trading and
							analytics platforms.
						</p>
					</div>

					<div className="re-integrations">
						<div className="re-integration-card">
							<div className="re-integration-logo">PUMP.FUN</div>
							<p className="re-integration-name">
								The largest platform for trading memecoins
							</p>
						</div>
						<div className="re-integration-card">
							<div className="re-integration-logo">GMGN.AI</div>
							<p className="re-integration-name">
								Real-time price tracking and analytics
							</p>
						</div>
					</div>
				</section>

				{/* Pricing Section */}
				<section className="re-section" id="pricing">
					<div className="re-section-header">
						<div className="re-section-label">Choose Your Plan</div>
						<h2 className="re-section-title">Simple, Transparent Pricing</h2>
						<p className="re-section-description">
							Go monthly for flexibility or get lifetime access with a one-time
							payment — no hidden fees.
						</p>
					</div>

					<div className="re-pricing-grid">
						<div className="re-pricing-card">
							<h3 className="re-pricing-name">Rental</h3>
							<p className="re-pricing-description">
								Monthly access with full features
							</p>
							<ul className="re-pricing-features">
								{pricingFeatures.map((feature) => (
									<li key={feature} className="re-pricing-feature">
										<span className="re-pricing-check">✓</span>
										{feature}
									</li>
								))}
							</ul>
							<a
								href="https://t.me/RugEngine"
								target="_blank"
								rel="noopener noreferrer"
								className="re-btn re-btn-secondary"
								style={{ width: "100%" }}
							>
								Contact to Purchase
							</a>
						</div>

						<div className="re-pricing-card featured">
							<div className="re-pricing-badge">Best Value</div>
							<h3 className="re-pricing-name">Lifetime</h3>
							<p className="re-pricing-description">
								One-time payment, unlimited access
							</p>
							<ul className="re-pricing-features">
								{pricingFeatures.map((feature) => (
									<li key={feature} className="re-pricing-feature">
										<span className="re-pricing-check">✓</span>
										{feature}
									</li>
								))}
								<li className="re-pricing-feature">
									<span className="re-pricing-check">✓</span>
									Lifetime access
								</li>
							</ul>
							<a
								href="https://t.me/RugEngine"
								target="_blank"
								rel="noopener noreferrer"
								className="re-btn re-btn-primary"
								style={{ width: "100%" }}
							>
								Contact to Purchase
							</a>
						</div>
					</div>
				</section>

				{/* FAQ Section */}
				<section className="re-section" id="faq">
					<div className="re-section-header">
						<div className="re-section-label">FAQ</div>
						<h2 className="re-section-title">Frequently Asked Questions</h2>
					</div>

					<div className="re-faq-grid">
						{faqs.map((faq) => (
							<FAQItem key={faq.question} {...faq} />
						))}
					</div>
				</section>

				{/* CTA Section */}
				<section className="re-cta-section">
					<div className="re-cta-glow" />
					<h2 className="re-cta-title">
						Ready to <span className="re-glow-text">Dominate</span>?
					</h2>
					<p className="re-cta-description">
						Join thousands of developers and degens using RugEngine to create
						and manage successful tokens.
					</p>
					<a
						href="https://t.me/RugEngine"
						target="_blank"
						rel="noopener noreferrer"
						className="re-btn re-btn-primary"
					>
						<span>Get Started Now</span>
						<span>→</span>
					</a>
				</section>

				{/* Footer */}
				<footer className="re-footer">
					<div className="re-footer-logo">RUG ENGINE</div>
					<div className="re-footer-links">
						<a href="#features" className="re-footer-link">
							Features
						</a>
						<a href="#pricing" className="re-footer-link">
							Pricing
						</a>
						<a href="#faq" className="re-footer-link">
							FAQ
						</a>
						<a
							href="https://t.me/RugEngine"
							target="_blank"
							rel="noopener noreferrer"
							className="re-footer-link"
						>
							Telegram
						</a>
					</div>
					<p className="re-footer-copy">
						© {new Date().getFullYear()} RugEngine. All rights reserved.
					</p>
				</footer>
			</div>
		</div>
	);
}
