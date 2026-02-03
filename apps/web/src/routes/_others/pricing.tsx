import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useBnbPrice, useSolanaPrice } from "@/lib/queries";

export const Route = createFileRoute("/_others/pricing")({
	component: PricingComponent,
	head: () => ({
		meta: [
			{
				title: "Pricing | RugEngine",
			},
			{
				name: "description",
				content:
					"View RugEngine pricing plans. Choose between Rental or Lifetime access for creating and managing SOL & BNB tokens.",
			},
		],
	}),
});

// ═══════════════════════════════════════════════════════════════
// PRICING PAGE STYLES (Subset of Landing Page Styles + Specifics)
// ═══════════════════════════════════════════════════════════════

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Sora:wght@300;400;500;600;700&display=swap');

  :root {
    --re-neon-green: #00ff88;
    --re-neon-green-dim: #00ff8840;
    --re-electric-blue: #00d4ff;
    --re-dark-void: #0a0a0f;
    --re-dark-surface: #12121a;
    --re-dark-elevated: #1a1a25;
    --re-grid-color: rgba(0, 255, 136, 0.03);
    --re-text-primary: #ffffff;
    --re-text-secondary: #9ca3af;
    --re-text-muted: #6b7280;
  }

  .re-pricing-page * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .re-pricing-page {
    font-family: 'Sora', sans-serif;
    background: var(--re-dark-void);
    color: var(--re-text-primary);
    min-height: 100vh;
    padding-top: 80px; /* Space for navbar if present */
    position: relative;
    overflow-x: hidden;
  }

  /* ═══ BACKGROUND ═══ */
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
      radial-gradient(ellipse 60% 40% at 80% 60%, rgba(0, 212, 255, 0.08), transparent);
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

  .re-content-pricing {
    position: relative;
    z-index: 10;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  /* ═══ HEADER ═══ */
  .re-page-header {
    text-align: center;
    margin-bottom: 4rem;
  }

  .re-page-title {
    font-family: 'Orbitron', sans-serif;
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 800;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #fff 0%, var(--re-neon-green) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 40px var(--re-neon-green-dim);
  }

  .re-page-subtitle {
    font-size: 1.2rem;
    color: var(--re-text-secondary);
  }

  /* ═══ PRICING CARDS ═══ */
  .re-pricing-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 3rem;
    align-items: center;
  }

  .re-plan-card {
    background: linear-gradient(180deg, var(--re-dark-surface), var(--re-dark-elevated));
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 24px;
    padding: 3rem;
    position: relative;
    transition: all 0.4s;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .re-plan-card.featured {
    border-color: var(--re-neon-green);
    box-shadow: 
      0 0 0 1px var(--re-neon-green),
      0 0 60px var(--re-neon-green-dim);
    transform: scale(1.02);
    z-index: 20;
  }

  .re-plan-badge {
    position: absolute;
    top: -16px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--re-neon-green);
    color: var(--re-dark-void);
    padding: 0.5rem 1.5rem;
    border-radius: 100px;
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .re-plan-name {
    font-family: 'Orbitron', sans-serif;
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: var(--re-text-primary);
  }

  .re-plan-desc {
    font-size: 0.95rem;
    color: var(--re-text-secondary);
    margin-bottom: 2rem;
  }

  .re-plan-price {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .re-price-usd {
    font-family: 'Orbitron', sans-serif;
    font-size: 3.5rem;
    font-weight: 800;
    color: var(--re-text-primary);
    line-height: 1;
    margin-bottom: 1rem;
    display: flex;
    align-items: flex-start;
    gap: 4px;
  }

  .re-price-currency {
    font-size: 1.5rem;
    margin-top: 8px;
    color: var(--re-text-muted);
  }

  .re-crypto-prices {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .re-crypto-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255, 255, 255, 0.03);
    padding: 0.75rem 1rem;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .re-crypto-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--re-text-secondary);
  }

  .re-crypto-label.sol { color: #9945ff; }
  .re-crypto-label.bnb { color: #f3ba2f; }

  .re-crypto-value {
    font-family: 'Orbitron', sans-serif;
    font-weight: 600;
    color: var(--re-text-primary);
  }

  /* ═══ BUTTONS ═══ */
  .re-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 1.25rem;
    font-family: 'Sora', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    text-decoration: none;
    border-radius: 12px;
    transition: all 0.3s;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: auto;
  }

  .re-btn-primary {
    background: var(--re-neon-green);
    color: var(--re-dark-void);
    box-shadow: 0 0 20px var(--re-neon-green-dim);
    border: none;
  }

  .re-btn-primary:hover {
    background: #00cc6a;
    box-shadow: 0 0 40px var(--re-neon-green-dim);
    transform: translateY(-2px);
  }

  .re-btn-secondary {
    background: transparent;
    color: var(--re-text-primary);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .re-btn-secondary:hover {
    border-color: var(--re-neon-green);
    color: var(--re-neon-green);
    background: rgba(0, 255, 136, 0.05);
  }

  /* ═══ FEATURES LIST ═══ */
  .re-plan-features {
    list-style: none;
    margin-bottom: 2.5rem;
  }

  .re-feature {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    color: var(--re-text-secondary);
    font-size: 0.95rem;
  }

  .re-check {
    color: var(--re-neon-green);
    font-size: 1.1rem;
  }

  /* ═══ FOOTER NOTES ═══ */
  .re-price-note {
    text-align: center;
    margin-top: 4rem;
    color: var(--re-text-muted);
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    .re-pricing-container {
      grid-template-columns: 1fr;
    }
    
    .re-plan-card.featured {
      transform: none;
    }
  }
`;

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════

function PricingComponent() {
	const styleRef = useRef<HTMLStyleElement | null>(null);

	// 1. Fetch real-time prices
	const solPrice = useSolanaPrice();
	const bnbPrice = useBnbPrice();

	// 2. Define standard pricing
	const PRICES = {
		rental: 300,
		lifetime: 1000,
	};

	// 3. Helper to calculate crypto amount
	const getCryptoAmount = (usdAmount: number, cryptoPrice: number) => {
		if (!cryptoPrice || cryptoPrice === 0) return "Loading...";
		return (usdAmount / cryptoPrice).toFixed(4);
	};

	useEffect(() => {
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
		<div className="re-pricing-page">
			<div className="re-bg-grid" />
			<div className="re-bg-gradient" />
			<div className="re-noise" />

			<div className="re-content-pricing">
				<header className="re-page-header">
					<h1 className="re-page-title">CHOOSE YOUR WEAPON</h1>
					<p className="re-page-subtitle">
						Transparent pricing. Real-time conversion. Instant access.
					</p>
				</header>

				<div className="re-pricing-container">
					{/* RENTAL PLAN */}
					<div className="re-plan-card">
						<h2 className="re-plan-name">RENTAL</h2>
						<p className="re-plan-desc">
							Monthly access for active developers.
						</p>

						<div className="re-plan-price">
							<div className="re-price-usd">
								<span className="re-price-currency">$</span>
								{PRICES.rental}
							</div>
							<div className="re-crypto-prices">
								<div className="re-crypto-row">
									<div className="re-crypto-label sol">
										<span>◎</span> SOL Equivalent
									</div>
									<div className="re-crypto-value">
										{getCryptoAmount(PRICES.rental, solPrice)} SOL
									</div>
								</div>
								<div className="re-crypto-row">
									<div className="re-crypto-label bnb">
										<span>◆</span> BNB Equivalent
									</div>
									<div className="re-crypto-value">
										{getCryptoAmount(PRICES.rental, bnbPrice)} BNB
									</div>
								</div>
							</div>
						</div>

						<ul className="re-plan-features">
							<li className="re-feature">
								<span className="re-check">✓</span> Unlimited coin creation
							</li>
							<li className="re-feature">
								<span className="re-check">✓</span> Bundler & Bump It bots
							</li>
							<li className="re-feature">
								<span className="re-check">✓</span> Fast transactions
							</li>
							<li className="re-feature">
								<span className="re-check">✓</span> Multi-launches
							</li>
						</ul>

						<a
							href="https://t.me/Rugpullengine01"
							target="_blank"
							rel="noopener noreferrer"
							className="re-btn re-btn-secondary"
						>
							Purchase Monthly
						</a>
					</div>

					{/* LIFETIME PLAN */}
					<div className="re-plan-card featured">
						<div className="re-plan-badge">Best Value</div>
						<h2 className="re-plan-name">LIFETIME</h2>
						<p className="re-plan-desc">One-time payment. Own it forever.</p>

						<div className="re-plan-price">
							<div className="re-price-usd">
								<span className="re-price-currency">$</span>
								{PRICES.lifetime}
							</div>
							<div className="re-crypto-prices">
								<div className="re-crypto-row">
									<div className="re-crypto-label sol">
										<span>◎</span> SOL Equivalent
									</div>
									<div className="re-crypto-value">
										{getCryptoAmount(PRICES.lifetime, solPrice)} SOL
									</div>
								</div>
								<div className="re-crypto-row">
									<div className="re-crypto-label bnb">
										<span>◆</span> BNB Equivalent
									</div>
									<div className="re-crypto-value">
										{getCryptoAmount(PRICES.lifetime, bnbPrice)} BNB
									</div>
								</div>
							</div>
						</div>

						<ul className="re-plan-features">
							<li className="re-feature">
								<span className="re-check">✓</span> Everything in Rental
							</li>
							<li className="re-feature">
								<span className="re-check">✓</span> Lifetime access
							</li>
							<li className="re-feature">
								<span className="re-check">✓</span> Priority support
							</li>
							<li className="re-feature">
								<span className="re-check">✓</span> Early access to new features
							</li>
						</ul>

						<a
							href="https://t.me/Rugpullengine01"
							target="_blank"
							rel="noopener noreferrer"
							className="re-btn re-btn-primary"
						>
							Purchase Lifetime
						</a>
					</div>
				</div>

				<div className="re-price-note">
					<p>
						* Crypto prices are updated in real-time. Final transaction amount
						may vary slightly due to market volatility.
					</p>
				</div>
			</div>
		</div>
	);
}
