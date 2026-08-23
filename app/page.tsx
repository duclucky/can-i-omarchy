import { ArrowDown, Github, ShieldCheck, Terminal } from 'lucide-react';
import CompatibilityChecker from './compatibility-checker';
import { APPS } from './apps';

export default async function Home({ searchParams }: { searchParams: Promise<{ apps?: string | string[]; challenge?: string | string[] }> }) {
  const params = await searchParams;
  const sharedApps = typeof params.apps === 'string' ? params.apps.split(',') : [];
  const initialSelected = [...new Set(sharedApps.filter((id) => APPS.some((app) => app.id === id)))];
  const challengeValue = typeof params.challenge === 'string' ? Number(params.challenge) : Number.NaN;
  const challengeScore = Number.isInteger(challengeValue) && challengeValue >= 0 && challengeValue <= 100 ? challengeValue : null;

  return (
    <main className="site-shell">
      <a className="skip-link" href="#checker">Skip to compatibility checker</a>

      <header className="topbar">
        <a className="brand" href="#top" aria-label="Can I Omarchy home"><span className="brand-logo" aria-hidden="true" /><span>CAN I OMARCHY?</span></a>
        <nav className="topbar-nav" aria-label="Primary navigation">
          <a href="#checker">Checker</a>
          <a href="#checker">{APPS.length} apps</a>
        </nav>
        <a className="github-link" href="https://github.com/duclucky/can-i-omarchy" target="_blank" rel="noreferrer"><Github aria-hidden="true" /> <span>GitHub</span></a>
      </header>

      <section className="hero" id="top">
        <div className="hero-content">
          <div className="eyebrow"><span className="live-dot" /> Stack Roast / Omarchy edition</div>
          <h1>Your apps are<br /><em>holding you hostage.</em></h1>
          <p className="hero-copy">One app decides whether you can leave Windows or macOS. Pick your real stack. We&apos;ll name the hostage-taker—and give you something worth posting.</p>
          <div className="hero-actions">
            <a className="hero-primary" href="#checker">Roast my stack <ArrowDown aria-hidden="true" /></a>
            <span><ShieldCheck aria-hidden="true" /> No signup. No cope. Official sources.</span>
          </div>
          <div className="hero-proof" aria-label="Dataset summary">
            <span><b>{APPS.length}</b> targets</span>
            <span><b>8</b> identities</span>
            <span><b>1</b> share card</span>
          </div>
        </div>
        <div className="roast-preview" aria-hidden="true">
          <div className="roast-preview-top"><span>LIVE SPECIMEN / 01</span><strong>39</strong></div>
          <div className="roast-preview-stamp">THE ADOBE HOSTAGE</div>
          <h2>Your creativity is owned by two installers.</h2>
          <p>Photoshop + Illustrator decide your operating system. Not you.</p>
          <div className="roast-preview-lanes">
            <span><i /> MOVE 01</span><span><i /> WEB 01</span><span><i /> KEEP 02</span>
          </div>
          <div className="roast-preview-footer"><Terminal aria-hidden="true" /> CAN-I-OMARCHY.VERCEL.APP <b>#STACKROAST</b></div>
        </div>
      </section>

      <div className="roast-ticker" aria-hidden="true"><span>THE ADOBE HOSTAGE</span><i /> <span>THE WEB NOMAD</span><i /> <span>THE BRIDGE BUILDER</span><i /> <span>THE LINUX NATIVE</span><i /> <span>BEAT MY SCORE</span></div>

      <CompatibilityChecker initialSelected={initialSelected} challengeScore={challengeScore} />

      <footer>
        <a className="brand" href="#top"><span className="brand-logo" aria-hidden="true" /><span>CAN I OMARCHY?</span></a>
        <p>Independent community tool. Not affiliated with Omarchy, Basecamp, or 37signals.</p>
        <span>Compatibility snapshot / Aug 2026</span>
      </footer>
    </main>
  );
}
