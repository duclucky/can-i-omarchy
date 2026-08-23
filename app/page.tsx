import { ArrowDown, Database, Github, LockKeyhole, ShieldCheck, Terminal } from 'lucide-react';
import CompatibilityChecker from './compatibility-checker';
import CopyContributionButton from './copy-contribution-button';
import { APPS } from './apps';

export default async function Home({ searchParams }: { searchParams: Promise<{ apps?: string | string[] }> }) {
  const params = await searchParams;
  const sharedApps = typeof params.apps === 'string' ? params.apps.split(',') : [];
  const initialSelected = [...new Set(sharedApps.filter((id) => APPS.some((app) => app.id === id)))];

  return (
    <main className="site-shell">
      <a className="skip-link" href="#checker">Skip to compatibility checker</a>

      <header className="topbar">
        <a className="brand" href="#top" aria-label="Can I Omarchy home"><span className="brand-mark">C?</span><span>CAN I OMARCHY?</span></a>
        <nav className="topbar-nav" aria-label="Primary navigation">
          <a href="#checker">Checker</a>
          <a href="#plan">Migration plan</a>
          <a href="#method">Method</a>
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

      <section className="method" id="method">
        <div className="section-intro">
          <span className="section-kicker">How the verdict works</span>
          <h2>A decision gate, not a personality quiz.</h2>
          <p>One required blocker can matter more than ten easy apps. The score follows the consequence instead of averaging it away.</p>
        </div>
        <div className="method-grid">
          <article><b>01</b><h3>Select required apps</h3><p>Choose only tools that can interrupt your real work. Nice-to-have apps distort the answer.</p></article>
          <article><b>02</b><h3>Respect the hardest constraint</h3><p>A blocker caps the verdict at 39. A remote, VM, CI, or device bridge caps it at 74.</p></article>
          <article><b>03</b><h3>Test a reversible route</h3><p>Follow the source-backed plan before changing disks, migrating files, or dropping your fallback OS.</p></article>
        </div>
      </section>

      <section className="contribute" id="contribute">
        <div><span className="section-kicker">Community dataset</span><h2>Missing the weird app that runs your business?</h2></div>
        <p>Add evidence, the real Linux route, what still needs testing, and what breaks if it fails. “Works for me” is not enough.</p>
        <CopyContributionButton />
      </section>

      <footer>
        <a className="brand" href="#top"><span className="brand-mark">C?</span><span>CAN I OMARCHY?</span></a>
        <p>Independent community tool. Not affiliated with Omarchy, Basecamp, or 37signals.</p>
        <span>Compatibility snapshot / Aug 2026</span>
      </footer>
    </main>
  );
}
