'use client';

import { useEffect, useMemo, useState } from 'react';

type AppStatus = 'native' | 'web' | 'bridge' | 'blocked';
type Category = 'All' | 'Development' | 'Design' | 'Communication' | 'Productivity' | 'Media';

type WorkApp = {
  id: string;
  name: string;
  monogram: string;
  color: string;
  category: Exclude<Category, 'All'>;
  status: AppStatus;
  note: string;
  plan: string;
  source: string;
};

const APPS: WorkApp[] = [
  { id: 'photoshop', name: 'Photoshop', monogram: 'Ps', color: '#2163e8', category: 'Design', status: 'blocked', note: 'No supported Linux desktop build', plan: 'Keep a Windows or macOS lane for production work. The built-in Windows VM has no GPU passthrough, so dual boot or a second machine is the honest route.', source: 'https://helpx.adobe.com/photoshop/desktop/get-started/technical-requirements-installation/adobe-photoshop-on-desktop-technical-requirements.html' },
  { id: 'illustrator', name: 'Illustrator', monogram: 'Ai', color: '#e98112', category: 'Design', status: 'blocked', note: 'No supported Linux desktop build', plan: 'Use a separate Windows/macOS environment for production Illustrator work. Inkscape is worth testing, but file fidelity must be validated against your real deliverables.', source: 'https://helpx.adobe.com/illustrator/system-requirements.html' },
  { id: 'figma', name: 'Figma', monogram: 'Fi', color: '#f24e1e', category: 'Design', status: 'web', note: 'Primary workflow is browser-based', plan: 'Install Figma as an Omarchy web app. Test fonts, local font access, and any organization-specific plugins before wiping another OS.', source: 'https://help.figma.com/hc/en-us/articles/5601429983767-Guide-to-the-Figma-desktop-app' },
  { id: 'canva', name: 'Canva', monogram: 'Ca', color: '#00a6a6', category: 'Design', status: 'web', note: 'Works through the browser', plan: 'Use Canva as a Chromium web app. Keep a browser profile dedicated to creative work if you use multiple accounts.', source: 'https://www.canva.com/download/' },
  { id: 'vscode', name: 'VS Code', monogram: '</>', color: '#1782d0', category: 'Development', status: 'native', note: 'Native Linux build', plan: 'Install from Omarchy’s editor menu, then sync settings. Validate remote containers and any proprietary extension before migrating.', source: 'https://code.visualstudio.com/docs/setup/linux' },
  { id: 'cursor', name: 'Cursor', monogram: 'Cu', color: '#242424', category: 'Development', status: 'native', note: 'Available from Omarchy’s editor menu', plan: 'Install from Omarchy’s editor menu. Export any local rules, snippets, and MCP configuration separately from account sync.', source: 'https://omarchy.org/manual/development-tools/' },
  { id: 'jetbrains', name: 'JetBrains IDEs', monogram: 'JB', color: '#d3298f', category: 'Development', status: 'native', note: 'Linux builds are available', plan: 'Install Toolbox or the IDE package you use. Re-test file watchers, Docker integration, and global shortcuts under Wayland.', source: 'https://www.jetbrains.com/toolbox-app/' },
  { id: 'docker', name: 'Docker', monogram: 'Do', color: '#1479e8', category: 'Development', status: 'native', note: 'Included in the Omarchy workflow', plan: 'Use Omarchy’s Docker setup and move projects through Git, not by copying active volumes. Recreate databases from dumps or migrations.', source: 'https://omarchy.org/manual/development-tools/' },
  { id: 'android-studio', name: 'Android Studio', monogram: 'An', color: '#40a76b', category: 'Development', status: 'native', note: 'Official Linux support', plan: 'Install the Linux build and restore SDKs selectively. Confirm hardware acceleration and USB debugging on your actual device.', source: 'https://developer.android.com/studio/install' },
  { id: 'xcode', name: 'Xcode / iOS', monogram: 'X', color: '#168af2', category: 'Development', status: 'bridge', note: 'CI can build; local Simulator still needs macOS', plan: 'Code on Omarchy, build and test in a macOS runner or Xcode Cloud, and keep access to a Mac for Simulator, signing diagnostics, and device debugging.', source: 'https://developer.apple.com/documentation/Xcode/Xcode-Cloud' },
  { id: 'windows-builds', name: 'Windows builds', monogram: 'Win', color: '#1675d1', category: 'Development', status: 'bridge', note: 'Build on a hosted Windows runner', plan: 'Send tagged builds to a Windows GitHub Actions runner and upload signed output as an artifact. Keep a Windows test lane for runtime and installer QA.', source: 'https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/choose-the-runner-for-a-job' },
  { id: 'slack', name: 'Slack', monogram: '#', color: '#7c3aed', category: 'Communication', status: 'native', note: 'Linux app and web workflow', plan: 'Use the Linux app or install the web version. Verify screen sharing, audio routing, and notification behavior before committing.', source: 'https://slack.com/downloads/linux' },
  { id: 'discord', name: 'Discord', monogram: 'Di', color: '#5865f2', category: 'Communication', status: 'native', note: 'Linux desktop build', plan: 'Install the Linux app and verify screen sharing under Wayland for your exact use case.', source: 'https://discord.com/download' },
  { id: 'zoom', name: 'Zoom', monogram: 'Zm', color: '#2d8cff', category: 'Communication', status: 'native', note: 'Official Linux client', plan: 'Install the Linux client, then run a test call covering camera, microphone, screen sharing, and virtual backgrounds.', source: 'https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0063458' },
  { id: 'notion', name: 'Notion', monogram: 'N', color: '#171717', category: 'Productivity', status: 'web', note: 'Browser workflow is the safe route', plan: 'Install Notion as a web app. Check offline expectations first—the browser route is strongest when you stay connected.', source: 'https://www.notion.com/help/notion-for-web' },
  { id: 'microsoft-365', name: 'Microsoft 365', monogram: 'M', color: '#e05a26', category: 'Productivity', status: 'bridge', note: 'Web apps or the built-in Windows VM', plan: 'Start with Microsoft 365 on the web. For advanced desktop-only features, use Omarchy’s Windows VM; it is explicitly suited to Office-class apps.', source: 'https://omarchy.org/manual/windows-vm/' },
  { id: 'obsidian', name: 'Obsidian', monogram: 'Ob', color: '#7c4dff', category: 'Productivity', status: 'native', note: 'Included in the Omarchy experience', plan: 'Move the vault through your existing sync method, then review community plugins before enabling all of them on the new system.', source: 'https://omarchy.org/manual/guis/' },
  { id: 'spotify', name: 'Spotify', monogram: 'Sp', color: '#1db954', category: 'Media', status: 'native', note: 'Easy install in Omarchy', plan: 'Install through Omarchy’s service menu. Offline playback is supported by the Linux app.', source: 'https://omarchy.org/manual/commercial-apps-services/' },
  { id: 'obs', name: 'OBS Studio', monogram: 'OBS', color: '#3d3d45', category: 'Media', status: 'native', note: 'Included in Omarchy', plan: 'Import a copy of your scenes, then reselect PipeWire audio sources and verify hardware encoding before a real stream.', source: 'https://omarchy.org/manual/' },
  { id: 'premiere', name: 'Premiere Pro', monogram: 'Pr', color: '#6f49d8', category: 'Media', status: 'blocked', note: 'No supported Linux desktop build', plan: 'Keep Windows/macOS for Premiere projects. Omarchy’s Windows VM has no GPU passthrough and is not intended for video editing.', source: 'https://helpx.adobe.com/premiere-pro/system-requirements.html' },
  { id: 'davinci', name: 'DaVinci Resolve', monogram: 'DR', color: '#cf533d', category: 'Media', status: 'bridge', note: 'Linux exists, but workflow compatibility varies', plan: 'Test a real project before switching. Codecs, GPU drivers, plugins, and Arch packaging can turn an apparently native app into a migration project.', source: 'https://www.blackmagicdesign.com/support/family/davinci-resolve-and-fusion' },
];

const CATEGORIES: Category[] = ['All', 'Development', 'Design', 'Communication', 'Productivity', 'Media'];
const STATUS_LABEL: Record<AppStatus, string> = { native: 'Native path', web: 'Web-ready', bridge: 'Needs a bridge', blocked: 'Hard blocker' };
const STATUS_ACTION: Record<AppStatus, string> = { native: 'MOVE', web: 'WRAP', bridge: 'BRIDGE', blocked: 'KEEP' };
const STATUS_WEIGHT: Record<AppStatus, number> = { native: 100, web: 86, bridge: 58, blocked: 15 };

export default function Home() {
  const [selected, setSelected] = useState<string[]>(['photoshop', 'vscode', 'slack']);
  const [category, setCategory] = useState<Category>('All');
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState<'link' | 'post' | null>(null);

  useEffect(() => {
    const shared = new URLSearchParams(window.location.search).get('apps');
    if (shared) {
      const valid = shared.split(',').filter((id) => APPS.some((app) => app.id === id));
      if (valid.length) setSelected(valid);
    }
  }, []);

  const selectedApps = useMemo(() => APPS.filter((app) => selected.includes(app.id)), [selected]);
  const filteredApps = useMemo(() => APPS.filter((app) => {
    const inCategory = category === 'All' || app.category === category;
    const inSearch = `${app.name} ${app.note}`.toLowerCase().includes(query.toLowerCase());
    return inCategory && inSearch;
  }), [category, query]);
  const score = useMemo(() => selectedApps.length ? Math.round(selectedApps.reduce((sum, app) => sum + STATUS_WEIGHT[app.status], 0) / selectedApps.length) : 100, [selectedApps]);
  const blockers = selectedApps.filter((app) => app.status === 'blocked');
  const bridges = selectedApps.filter((app) => app.status === 'bridge');

  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const flashCopied = (kind: 'link' | 'post') => { setCopied(kind); window.setTimeout(() => setCopied(null), 1800); };
  const copyText = async (text: string, kind: 'link' | 'post') => {
    try { await navigator.clipboard.writeText(text); flashCopied(kind); } catch { window.prompt('Copy this:', text); }
  };
  const shareResult = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('apps', selected.join(','));
    const data = { title: 'Can I Omarchy?', text: `My stack is ${score}% Omarchy-ready. ${blockers.length ? `${blockers.map((app) => app.name).join(', ')} ${blockers.length > 1 ? 'are' : 'is'} keeping me honest.` : 'No hard blockers.'}`, url: url.toString() };
    if (navigator.share) { try { await navigator.share(data); return; } catch { /* user cancelled */ } }
    await copyText(url.toString(), 'link');
  };
  const copyPost = () => copyText(`I ran my real work stack through Can I Omarchy?\n\nReadiness: ${score}/100\n${blockers.length ? `Hard blocker${blockers.length > 1 ? 's' : ''}: ${blockers.map((app) => app.name).join(', ')}` : 'No hard blockers.'}\n\nYour apps decide. Not the hype. #omarchy`, 'post');

  const verdict = blockers.length ? 'Make Omarchy your home base—not your only base.' : bridges.length ? 'You can switch—with a bridge.' : 'Your stack is ready to move.';
  const summary = blockers.length
    ? `${blockers.map((app) => app.name).join(' and ')} ${blockers.length > 1 ? 'are' : 'is'} the honest blocker. Keep a supported OS lane for those apps; move the rest of your day to Omarchy.`
    : bridges.length ? `Most of your stack moves cleanly. ${bridges.map((app) => app.name).join(' and ')} need a remote build, web workflow, VM, or real-device test lane.`
    : 'Everything selected has a credible native or browser path. Test the details that matter to you before changing disks.';

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Can I Omarchy home"><span className="brand-mark">C?</span><span>CAN I OMARCHY?</span></a>
        <div className="topbar-meta"><span className="live-dot" />Compatibility snapshot · Aug 2026</div>
        <a className="ghost-link" href="#method">Method <span>↗</span></a>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow"><span>01</span> THE FIVE-MINUTE REALITY CHECK</div>
        <h1>Your apps decide.<br /><em>Not the hype.</em></h1>
        <p className="hero-copy">Pick the tools you cannot live without. Get an honest migration path before Omarchy touches your drive.</p>
        <div className="proof-row"><span>No signup</span><i /><span>No uploads</span><i /><span>No Linux cope</span></div>
      </section>

      <section className="checker" aria-label="Omarchy compatibility checker">
        <div className="picker-panel">
          <div className="section-heading">
            <div><span className="step">STEP 01</span><h2>What do you use?</h2></div>
            <span className="selection-count">{selected.length} selected</span>
          </div>
          <div className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search apps" placeholder="Search your daily apps..." /></div>
          <div className="category-tabs" aria-label="Filter app category">
            {CATEGORIES.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}
          </div>
          <div className="app-grid">
            {filteredApps.map((app) => {
              const active = selected.includes(app.id);
              return (
                <button key={app.id} className={`app-card ${active ? 'selected' : ''}`} onClick={() => toggle(app.id)} aria-pressed={active}>
                  <span className="app-icon" style={{ background: app.color }}>{app.monogram}</span>
                  <span className="app-copy"><strong>{app.name}</strong><small>{app.note}</small></span>
                  <span className="checkmark">{active ? '✓' : '+'}</span>
                </button>
              );
            })}
          </div>
          {!filteredApps.length && <div className="empty-state">No match yet. Try another name or contribute the missing app.</div>}
          <a className="add-app" href="#contribute">Can&apos;t find an app? <strong>Help add it →</strong></a>
        </div>

        <aside className="result-panel" aria-live="polite">
          <span className="step light">YOUR READINESS</span>
          <div className="score-ring" style={{ '--score': `${score * 3.6}deg` } as React.CSSProperties}><div><strong>{score}</strong><span>/100</span></div></div>
          <h2>{verdict}</h2><p>{summary}</p>
          <div className="status-list">
            {(['native', 'web', 'bridge', 'blocked'] as AppStatus[]).map((status) => <div key={status}><span className={`status-dot ${status}`} />{STATUS_LABEL[status]}<strong>{selectedApps.filter((app) => app.status === status).length}</strong></div>)}
          </div>
          <a className="primary-cta" href="#plan">Build my migration plan <span>↓</span></a>
        </aside>
      </section>

      <section className="plan-section" id="plan">
        <div className="plan-intro">
          <span className="step">STEP 02</span>
          <h2>Don&apos;t switch.<br /><em>Stage the switch.</em></h2>
          <p>The score is a conversation starter. This is the useful part: a route for every app, ordered from the most consequential blocker down.</p>
          <div className="share-actions">
            <button onClick={shareResult}>{copied === 'link' ? 'Link copied ✓' : 'Share my result ↗'}</button>
            <button onClick={copyPost}>{copied === 'post' ? 'Post copied ✓' : 'Copy an X post'}</button>
          </div>
        </div>
        <div className="plan-list">
          {selectedApps.length ? [...selectedApps].sort((a, b) => STATUS_WEIGHT[a.status] - STATUS_WEIGHT[b.status]).map((app, index) => (
            <article className="plan-card" key={app.id}>
              <div className="plan-number">{String(index + 1).padStart(2, '0')}</div>
              <div className="plan-app"><span className="app-icon mini" style={{ background: app.color }}>{app.monogram}</span><div><h3>{app.name}</h3><span className={`route-label ${app.status}`}>{STATUS_ACTION[app.status]} · {STATUS_LABEL[app.status]}</span></div></div>
              <p>{app.plan}</p>
              <a href={app.source} target="_blank" rel="noreferrer" aria-label={`Open source for ${app.name}`}>Source ↗</a>
            </article>
          )) : <div className="empty-plan">Select at least one app to build a migration plan.</div>}
        </div>
      </section>

      <section className="truth-strip">
        <div><span>BUILD ≠ TEST</span><p>Hosted Windows/macOS runners can produce artifacts. They do not replace runtime, UI, signing, Simulator, or device QA.</p></div>
        <div><span>VM ≠ GPU WORKSTATION</span><p>Omarchy&apos;s built-in Windows VM is useful for Office-class apps, but the official guide says there is no GPU passthrough.</p></div>
        <div><span>ALTERNATIVE ≠ DROP-IN</span><p>A Linux alternative only counts after your own files, plugins, fonts, codecs, peripherals, and collaborators survive the test.</p></div>
      </section>

      <section className="method" id="method">
        <span>BUILT FOR THE QUESTION EVERYONE ASKS</span>
        <p>“Omarchy looks incredible. But can I actually do my job on it?”</p>
        <div className="method-grid">
          <div><b>01</b><h3>Evidence over vibes</h3><p>Paths link to official vendor or Omarchy documentation wherever practical.</p></div>
          <div><b>02</b><h3>Consequences matter</h3><p>A hard blocker changes the recommendation. It is not averaged away by ten easy apps.</p></div>
          <div><b>03</b><h3>Private by default</h3><p>Your selections stay in the browser. A share link contains only the app IDs you chose.</p></div>
        </div>
      </section>

      <section className="contribute" id="contribute">
        <div><span className="step light">COMMUNITY DATASET</span><h2>This gets better when your weird app is in it.</h2></div>
        <p>Missing a tool? Capture the vendor link, the real Linux path, what still needs testing, and the consequence if it fails. That is a useful contribution—not “works for me.”</p>
        <button onClick={() => copyText('App name:\nCategory:\nOfficial compatibility source:\nOmarchy path (native / web / bridge / blocked):\nWhat must be tested:\nRecommended migration plan:', 'post')}>{copied === 'post' ? 'Template copied ✓' : 'Copy contribution template'}</button>
      </section>

      <footer><a className="brand" href="#top"><span className="brand-mark">C?</span><span>CAN I OMARCHY?</span></a><p>Independent community tool. Not affiliated with Omarchy, Basecamp, or 37signals.</p><span>Snapshot: 2026-08-23</span></footer>
    </main>
  );
}
