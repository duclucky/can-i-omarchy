import { ArrowDown, Database, Github, LockKeyhole, ShieldCheck, Terminal } from 'lucide-react';
import Image from 'next/image';
import CompatibilityChecker from './compatibility-checker';
import { APPS } from './apps';

export default async function Home({ searchParams }: { searchParams: Promise<{ apps?: string | string[] }> }) {
  const params = await searchParams;
  const sharedApps = typeof params.apps === 'string' ? params.apps.split(',') : [];
  const initialSelected = [...new Set(sharedApps.filter((id) => APPS.some((app) => app.id === id)))];

  return (
    <main className="site-shell">
      <a className="skip-link" href="#checker">Skip to compatibility checker</a>

      <header className="topbar">
        <a className="brand" href="#top" aria-label="Can I Omarchy home"><Image className="brand-logo" src="/brand-logo.png" alt="" width={40} height={40} priority /><span>CAN I OMARCHY?</span></a>
        <nav className="topbar-nav" aria-label="Primary navigation">
          <a href="#checker">Checker</a>
          <a href="#checker">{APPS.length} apps</a>
        </nav>
        <a className="github-link" href="https://github.com/duclucky/can-i-omarchy" target="_blank" rel="noreferrer"><Github aria-hidden="true" /> <span>GitHub</span></a>
      </header>

      <section className="hero" id="top">
        <div className="hero-content">
          <div className="eyebrow"><span className="live-dot" /> Independent Omarchy compatibility checker</div>
          <h1>Before you switch,<br /><em>check your stack.</em></h1>
          <p className="hero-copy">Choose the apps your work depends on. Get a verdict that treats hard blockers like hard blockers—and a migration route you can actually test.</p>
          <div className="hero-actions">
            <a className="hero-primary" href="#checker">Check my apps <ArrowDown aria-hidden="true" /></a>
            <span><ShieldCheck aria-hidden="true" /> No signup. Selections stay in your browser.</span>
          </div>
        </div>
        <div className="hero-terminal" aria-hidden="true">
          <div className="terminal-bar"><span /><span /><span /><b>stack-check.sh</b></div>
          <div className="terminal-body">
            <p><span>$</span> can-i-omarchy --check my-stack</p>
            <p className="terminal-muted">Scanning required apps...</p>
            <p><b>READY</b> VS Code, Docker, Slack</p>
            <p><strong>BLOCKED</strong> Photoshop</p>
            <div className="terminal-rule" />
            <p className="terminal-verdict"><Terminal /> verdict: keep a Windows lane</p>
          </div>
        </div>
      </section>

      <CompatibilityChecker initialSelected={initialSelected} />

      <section className="truth-strip" aria-label="Compatibility principles">
        <article><span>01</span><Terminal aria-hidden="true" /><h3>Build is not test</h3><p>A hosted runner can produce an artifact. It cannot replace runtime, UI, signing, Simulator, installer, GPU, or device QA.</p></article>
        <article><span>02</span><Database aria-hidden="true" /><h3>A VM is not a workstation</h3><p>Omarchy&apos;s Windows VM fits Office-class apps. Without GPU passthrough, it is not an honest route for Adobe production work.</p></article>
        <article><span>03</span><LockKeyhole aria-hidden="true" /><h3>Your data stays local</h3><p>Your selections stay in the browser. A share URL contains only the stable IDs of the apps you chose.</p></article>
      </section>

      <footer>
        <a className="brand" href="#top"><Image className="brand-logo" src="/brand-logo.png" alt="" width={40} height={40} /><span>CAN I OMARCHY?</span></a>
        <p>Independent community tool. Not affiliated with Omarchy, Basecamp, or 37signals.</p>
        <span>Compatibility snapshot / Aug 2026</span>
      </footer>
    </main>
  );
}
