'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  BookmarkCheck,
  Boxes,
  Check,
  CircleCheck,
  Copy,
  Download,
  ExternalLink,
  Flame,
  GitCompareArrows,
  Info,
  Plus,
  RotateCcw,
  Route,
  Search,
  Share2,
  Sparkles,
  Swords,
  Terminal,
  X,
} from 'lucide-react';
import { APPS, CATEGORIES, STATUS_META, type AppStatus, type Category, type WorkApp } from './apps';

const STATUS_ORDER: AppStatus[] = ['native', 'web', 'bridge', 'blocked'];

const STACK_PRESETS = [
  { id: 'developer', name: 'Developer', note: 'Code, containers, APIs', apps: ['vscode', 'docker', 'postman', 'slack', 'figma'] },
  { id: 'designer', name: 'Designer', note: 'UI and brand work', apps: ['photoshop', 'illustrator', 'figma', 'slack'] },
  { id: 'creator', name: 'Video creator', note: 'Edit, motion, stream', apps: ['premiere', 'after-effects', 'davinci', 'obs'] },
  { id: 'founder', name: 'Solo founder', note: 'Docs, calls, product', apps: ['google-workspace', 'notion', 'figma', 'slack', 'zoom'] },
] as const;

const ALTERNATIVE_MAP: Record<string, string[]> = {
  photoshop: ['krita', 'gimp'],
  illustrator: ['inkscape'],
  premiere: ['kdenlive', 'davinci'],
  affinity: ['krita', 'gimp', 'inkscape'],
  sketch: ['figma'],
  'after-effects': ['blender', 'kdenlive'],
  'final-cut': ['davinci', 'kdenlive'],
};

function getOmarchyRoute(app: WorkApp) {
  if (app.status === 'blocked') return 'Keep a supported Windows or macOS lane';
  if (app.id === 'xcode' || app.id === 'windows-builds') return 'Use CI, remote hardware, or a real-device lane';
  if (app.id === 'microsoft-365') return 'Install → Web App, or use the Windows VM';
  if (app.category === 'Gaming') return 'Super + Space → Install → Gaming';
  if (['onepassword', 'bitwarden', 'spotify'].includes(app.id)) return 'Super + Space → Install → Service';
  if (['vscode', 'cursor', 'zed', 'sublime', 'neovim', 'jetbrains'].includes(app.id)) return 'Super + Space → Install → Editor';
  if (app.status === 'web') return 'Super + Space → Install → Web App';
  if (app.status === 'bridge') return 'Stage the bridge before changing your main OS';
  return 'Super + Space → Install → Package / AUR';
}

type StackCounts = Record<AppStatus, number>;

function getStackIdentity(selectedApps: WorkApp[], counts: StackCounts) {
  const blockedIds = selectedApps.filter((app) => app.status === 'blocked').map((app) => app.id);
  const blockedNames = selectedApps.filter((app) => app.status === 'blocked').map((app) => app.name);
  if (blockedIds.some((id) => ['photoshop', 'illustrator', 'premiere', 'after-effects'].includes(id))) {
    return { slug: 'adobe-hostage', title: 'THE ADOBE HOSTAGE', roast: 'Your creative freedom is leased from Adobe. Cancel the lease—or keep the keys to Windows.' };
  }
  if (blockedIds.some((id) => ['final-cut', 'ableton', 'fl-studio'].includes(id))) {
    return { slug: 'studio-prisoner', title: 'THE STUDIO PRISONER', roast: 'Your files can move. Your studio cannot. The expensive plugins have the final vote.' };
  }
  if (counts.blocked > 0) {
    return { slug: 'one-app-hostage', title: 'THE ONE-APP HOSTAGE', roast: `${blockedNames[0]} has root access to your operating-system choice.` };
  }
  if (counts.bridge >= 2) {
    return { slug: 'bridge-architect', title: 'THE BRIDGE ARCHITECT', roast: 'Your stack runs on runners, remotes, VMs and optimism. Impressive. Fragile.' };
  }
  if (counts.bridge === 1) {
    return { slug: 'bridge-builder', title: 'THE BRIDGE BUILDER', roast: 'You can cross. Just do not burn the machine on the other side yet.' };
  }
  if (counts.web > counts.native) {
    return { slug: 'web-nomad', title: 'THE WEB NOMAD', roast: 'Your operating system is mostly a browser with better window management.' };
  }
  if (selectedApps.length > 0 && counts.native === selectedApps.length) {
    return { slug: 'linux-native', title: 'THE LINUX NATIVE', roast: 'No hostage detected. Your excuses now have zero dependencies.' };
  }
  return { slug: 'clean-escape', title: 'THE CLEAN ESCAPE', roast: 'Your stack can move. The remaining blocker is your nerve.' };
}

export default function CompatibilityChecker({ initialSelected = [], challengeScore = null }: { initialSelected?: string[]; challengeScore?: number | null }) {
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [category, setCategory] = useState<Category>('All');
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [copied, setCopied] = useState<'link' | 'post' | 'challenge' | 'card' | null>(null);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let restored: string[] | null = null;
    try {
      if (initialSelected.length === 0) {
        const saved = JSON.parse(window.localStorage.getItem('can-i-omarchy-stack-v1') ?? '[]');
        if (Array.isArray(saved)) {
          restored = saved.filter((id): id is string => typeof id === 'string' && APPS.some((app) => app.id === id));
        }
      }
    } catch {
      // Local storage is an enhancement; the checker still works without it.
    }
    queueMicrotask(() => {
      if (cancelled) return;
      if (restored) setSelected(restored);
      setStorageReady(true);
    });
    return () => { cancelled = true; };
  }, [initialSelected]);

  useEffect(() => {
    if (!storageReady) return;
    try {
      window.localStorage.setItem('can-i-omarchy-stack-v1', JSON.stringify(selected));
    } catch {
      // Ignore storage restrictions in private or hardened browsers.
    }
  }, [selected, storageReady]);

  const selectedApps = useMemo(() => APPS.filter((app) => selected.includes(app.id)), [selected]);
  const filteredApps = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return APPS.filter((app) => {
      const inCategory = category === 'All' || app.category === category;
      const inSearch = `${app.name} ${app.note} ${app.category}`.toLowerCase().includes(normalizedQuery);
      return inCategory && inSearch;
    });
  }, [category, query]);
  const isDefaultView = category === 'All' && query.trim() === '';
  const visibleApps = isDefaultView && !showAll ? filteredApps.slice(0, 18) : filteredApps;

  const counts = useMemo(() => STATUS_ORDER.reduce<Record<AppStatus, number>>((result, status) => {
    result[status] = selectedApps.filter((app) => app.status === status).length;
    return result;
  }, { native: 0, web: 0, bridge: 0, blocked: 0 }), [selectedApps]);

  const blockers = selectedApps.filter((app) => app.status === 'blocked');
  const bridges = selectedApps.filter((app) => app.status === 'bridge');
  const rawScore = selectedApps.length
    ? Math.round(selectedApps.reduce((sum, app) => sum + STATUS_META[app.status].weight, 0) / selectedApps.length)
    : null;
  const score = rawScore === null
    ? null
    : blockers.length
      ? Math.min(rawScore, 39)
      : bridges.length
        ? Math.min(rawScore, 74)
        : rawScore;
  const identity = getStackIdentity(selectedApps, counts);
  const challengeDelta = score !== null && challengeScore !== null ? score - challengeScore : null;
  const challengeLabel = challengeDelta === null
    ? `STACK ROAST / ${selectedApps.length} APPS`
    : challengeDelta > 0
      ? `CHALLENGE BEATEN / +${challengeDelta}`
      : challengeDelta < 0
        ? `CHALLENGE LOST / ${challengeDelta}`
        : 'CHALLENGE DRAW / EXACT SCORE';

  const result = score === null
    ? {
        code: 'NOT CHECKED',
        title: 'Pick the apps that make or break your work.',
        summary: 'Your score will appear after you select at least one required app.',
      }
    : blockers.length
      ? {
          code: 'KEEP A SECOND OS',
          title: 'Do not make Omarchy your only lane yet.',
          summary: `${blockers.map((app) => app.name).join(' and ')} ${blockers.length > 1 ? 'are' : 'is'} a hard blocker. Move the rest of your day, but keep a supported OS for this work.`,
        }
      : bridges.length
        ? {
            code: 'STAGED MOVE',
            title: 'You can move—with a bridge plan.',
            summary: `${bridges.map((app) => app.name).join(' and ')} still need a web, VM, CI, remote, or real-device lane. Test that lane before switching.`,
          }
        : {
            code: 'READY TO TEST',
            title: 'Your stack has a credible Omarchy path.',
            summary: 'Nothing selected is a known hard blocker. Validate your real files, plugins, hardware, and team workflow before changing disks.',
          };

  const sortedPlan = [...selectedApps].sort((a, b) => STATUS_META[a.status].weight - STATUS_META[b.status].weight);
  const escapeRoutes = blockers.map((blocker) => ({
    blocker,
    alternatives: (ALTERNATIVE_MAP[blocker.id] ?? []).map((id) => APPS.find((app) => app.id === id)).filter((app): app is WorkApp => Boolean(app)),
  })).filter((route) => route.alternatives.length > 0);
  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const addApp = (id: string) => setSelected((current) => current.includes(id) ? current : [...current, id]);
  const applyPreset = (apps: readonly string[]) => {
    setSelected([...apps]);
    setCategory('All');
    setQuery('');
    setShowAll(false);
  };
  const flashCopied = (kind: 'link' | 'post' | 'challenge' | 'card') => {
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1800);
  };
  const copyText = async (text: string, kind: 'link' | 'post' | 'challenge') => {
    try {
      await navigator.clipboard.writeText(text);
      flashCopied(kind);
    } catch {
      window.prompt('Copy this:', text);
    }
  };
  const shareResult = async () => {
    if (score === null) return;
    const url = new URL(window.location.href);
    url.searchParams.set('apps', selected.join(','));
    const data = {
      title: 'Can I Omarchy?',
      text: `My Omarchy Stackprint is ${score}/100: ${counts.native} native, ${counts.web} web, ${counts.bridge} bridge, ${counts.blocked} blocked.`,
      url: url.toString(),
    };
    if (navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch {
        // A cancelled native share should fall back to copying the link.
      }
    }
    await copyText(url.toString(), 'link');
  };
  const copyPost = () => {
    if (score === null) return;
    copyText(`${identity.title}\n\n${identity.roast}\n\nMy Omarchy Stack Roast: ${score}/100\n${counts.native} move · ${counts.web} web · ${counts.bridge} bridge · ${counts.blocked} keep\n\nGet roasted: can-i-omarchy.vercel.app #StackRoast #omarchy`, 'post');
  };
  const challengeFriend = async () => {
    if (score === null) return;
    const url = new URL(window.location.origin);
    url.searchParams.set('challenge', String(score));
    url.hash = 'checker';
    const text = `I got ${score}/100 and ${identity.title}. Can your stack beat mine?`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Beat my Omarchy Stack Roast', text, url: url.toString() });
        return;
      } catch {
        // Fall back to copying a challenge when native sharing is cancelled.
      }
    }
    await copyText(`${text}\n${url}`, 'challenge');
  };
  const downloadRoastCard = () => {
    if (score === null) return;
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.fillStyle = '#070806';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#b6ff34';
    context.fillRect(34, 34, 1132, 562);
    context.strokeStyle = '#f4f1e8';
    context.lineWidth = 5;
    context.strokeRect(20, 20, 1160, 590);
    context.fillStyle = '#070806';
    context.font = '700 20px monospace';
    context.fillText(`CAN I OMARCHY? / ${challengeLabel}`, 70, 86);
    context.font = '700 86px monospace';
    context.fillText(String(score).padStart(2, '0'), 980, 112);
    context.fillStyle = '#ff4f87';
    context.fillRect(70, 145, Math.min(720, 32 + identity.title.length * 16), 48);
    context.fillStyle = '#070806';
    context.font = '700 24px monospace';
    context.fillText(identity.title, 86, 178);
    const drawWrapped = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
      const words = text.toUpperCase().split(' ');
      let line = '';
      let cursorY = y;
      for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (context.measureText(test).width > maxWidth && line) {
          context.fillText(line, x, cursorY);
          line = word;
          cursorY += lineHeight;
        } else {
          line = test;
        }
      }
      if (line) context.fillText(line, x, cursorY);
      return cursorY;
    };
    context.font = '700 54px monospace';
    const lastHeadlineY = drawWrapped(identity.roast, 70, 270, 1040, 62);
    context.font = '700 18px monospace';
    const apps = selectedApps.slice(0, 7).map((app) => app.name.toUpperCase()).join(' / ');
    context.fillText(apps, 70, Math.min(480, lastHeadlineY + 72));
    context.fillStyle = '#070806';
    context.fillRect(70, 520, 1060, 2);
    context.font = '700 18px monospace';
    context.fillText(`${counts.native} MOVE   ${counts.web} WEB   ${counts.bridge} BRIDGE   ${counts.blocked} KEEP`, 70, 562);
    context.textAlign = 'right';
    context.fillText('CAN-I-OMARCHY.VERCEL.APP  #STACKROAST', 1130, 562);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `omarchy-${identity.slug}.png`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      flashCopied('card');
    }, 'image/png');
  };

  return (
    <>
      <section className="checker-section" id="checker" aria-labelledby="checker-title">
        {challengeScore !== null && (
          <div className="challenge-banner"><Swords aria-hidden="true" /><div><span>You were challenged</span><strong>Beat {challengeScore}/100 with your real stack.</strong></div><a href="#checker-title">Accept the roast <ArrowDown aria-hidden="true" /></a></div>
        )}
        <div className="section-intro">
          <span className="section-kicker">01 / Name the hostage-taker</span>
          <h2 id="checker-title">Which apps own your operating system?</h2>
          <p>Choose the tools that can stop your actual work. Nice-to-have apps make a weak roast.</p>
        </div>

        <div className="checker-workspace">
          <div className="picker-panel">
            <div className="preset-block">
              <div className="preset-heading"><span><Sparkles aria-hidden="true" /> Quick start</span><small>Replace the sample with your real stack.</small></div>
              <div className="preset-grid">
                {STACK_PRESETS.map((preset) => (
                  <button type="button" key={preset.id} onClick={() => applyPreset(preset.apps)}>
                    <Boxes aria-hidden="true" />
                    <span><strong>{preset.name}</strong><small>{preset.note}</small></span>
                    <span>{preset.apps.length}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="picker-toolbar">
              <label className="search-field">
                <span className="sr-only">Search apps</span>
                <Search aria-hidden="true" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${APPS.length} work apps`} />
                {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search"><X aria-hidden="true" /></button>}
              </label>
              <span className="selection-count"><BookmarkCheck aria-hidden="true" /><b>{selected.length}</b> selected · saved locally</span>
            </div>

            <div className="category-tabs" aria-label="Filter apps by category">
              {CATEGORIES.map((item) => (
                <button type="button" key={item} className={category === item ? 'active' : ''} onClick={() => { setCategory(item); setShowAll(false); }} aria-pressed={category === item}>
                  {item}
                </button>
              ))}
            </div>

            {selectedApps.length > 0 && (
              <div className="selected-strip" aria-label="Selected apps">
                <div className="selected-chips">
                  {selectedApps.map((app) => (
                    <button type="button" key={app.id} onClick={() => toggle(app.id)} aria-label={`Remove ${app.name}`}>
                      {app.name}<X aria-hidden="true" />
                    </button>
                  ))}
                </div>
                <button type="button" className="clear-selection" onClick={() => setSelected([])}><RotateCcw aria-hidden="true" /> Clear</button>
              </div>
            )}

            <div className="app-grid">
              {visibleApps.map((app) => {
                const active = selected.includes(app.id);
                return (
                  <button type="button" key={app.id} className={`app-card ${active ? 'selected' : ''}`} onClick={() => toggle(app.id)} aria-pressed={active}>
                    <span className="app-icon" style={{ '--app-color': app.color } as React.CSSProperties}>{app.monogram}</span>
                    <span className="app-copy">
                      <span className="app-name-row"><strong>{app.name}</strong><small className={`status-tag ${app.status}`}><i />{STATUS_META[app.status].shortLabel}</small></span>
                      <span>{app.note}</span>
                    </span>
                    <span className="select-control" aria-hidden="true">{active ? <Check /> : <Plus />}</span>
                  </button>
                );
              })}
            </div>

            {isDefaultView && filteredApps.length > 18 && (
              <button className="show-all-apps" type="button" onClick={() => setShowAll((current) => !current)} aria-expanded={showAll}>
                {showAll ? 'Show popular apps only' : `Show all ${APPS.length} apps`}
                <ArrowDown aria-hidden="true" />
              </button>
            )}

            {!filteredApps.length && (
              <div className="empty-state">
                <Search aria-hidden="true" />
                <strong>No matching app</strong>
                <span>Try another name or request it on GitHub.</span>
              </div>
            )}
            <a className="missing-link" href="https://github.com/duclucky/can-i-omarchy/issues/new" target="_blank" rel="noreferrer">Missing an app? Request it on GitHub <ExternalLink aria-hidden="true" /></a>
          </div>

          <aside className={`result-panel ${score === null ? 'is-empty' : ''} ${blockers.length ? 'has-blocker' : ''}`} aria-live="polite" aria-label="Compatibility result">
            <div className="result-heading">
              <span>Live verdict</span>
              <b className={blockers.length ? 'danger' : score === null ? '' : 'success'}>{result.code}</b>
            </div>

            <div className="score-block">
              <div><strong>{score ?? '—'}</strong>{score !== null && <span>/100</span>}</div>
              <div className="score-track" aria-hidden="true"><span style={{ width: `${score ?? 0}%` }} /></div>
            </div>

            <div className="verdict-copy">
              {blockers.length ? <AlertTriangle aria-hidden="true" /> : score !== null ? <CircleCheck aria-hidden="true" /> : <Info aria-hidden="true" />}
              <div><h3>{result.title}</h3><p>{result.summary}</p></div>
            </div>

            <div className="status-list">
              {STATUS_ORDER.map((status) => (
                <div key={status}><span className={`status-dot ${status}`} /><span>{STATUS_META[status].label}</span><strong>{counts[status]}</strong></div>
              ))}
            </div>

            <p className="score-rule"><Info aria-hidden="true" /> Hard blockers cap readiness at 39. Bridge-dependent stacks cap at 74.</p>
            {score === null ? (
              <button className="primary-cta disabled" type="button" disabled>Select an app to continue <ArrowDown aria-hidden="true" /></button>
            ) : (
              <a className="primary-cta" href="#plan">Open my Stackprint <ArrowDown aria-hidden="true" /></a>
            )}
          </aside>
        </div>
      </section>

      {sortedPlan.length > 0 && <section className="plan-section" id="plan" aria-labelledby="plan-title">
        <div className="plan-header">
          <div>
            <span className="section-kicker">02 / Your decision artifact</span>
            <h2 id="plan-title">Your Omarchy Stackprint</h2>
            <p>A shareable map of what moves cleanly, what needs a bridge, and what forces you to keep another operating system.</p>
          </div>
        </div>

        <article className="viral-roast-card">
          <div className="viral-card-top"><span>{challengeLabel}</span><strong>{score}</strong></div>
          <div className="viral-card-stamp"><Flame aria-hidden="true" />{identity.title}</div>
          <h3>{identity.roast}</h3>
          <div className="viral-card-apps">{selectedApps.slice(0, 8).map((app) => <span key={app.id}>{app.name}</span>)}</div>
          <div className="viral-card-footer"><span>{counts.native} MOVE · {counts.web} WEB · {counts.bridge} BRIDGE · {counts.blocked} KEEP</span><b>CAN-I-OMARCHY.VERCEL.APP / #STACKROAST</b></div>
        </article>

        <div className="viral-actions" aria-label="Share your Stack Roast">
          <button type="button" onClick={downloadRoastCard}><Download aria-hidden="true" />{copied === 'card' ? 'PNG downloaded' : 'Download roast card'}</button>
          <button type="button" onClick={challengeFriend}><Swords aria-hidden="true" />{copied === 'challenge' ? 'Challenge copied' : 'Challenge someone'}</button>
          <button type="button" onClick={shareResult}><Share2 aria-hidden="true" />{copied === 'link' ? 'Link copied' : 'Share stack URL'}</button>
          <button type="button" onClick={copyPost}><Copy aria-hidden="true" />{copied === 'post' ? 'Post copied' : 'Copy X roast'}</button>
        </div>

        <div className="stackprint-summary">
          <div className="stackprint-score">
            <span>STACK ID / {selectedApps.map((app) => app.id.slice(0, 2).toUpperCase()).join('-')}</span>
            <strong>{score}<small>/100</small></strong>
            <p>{result.code}</p>
          </div>
          <div className="stackprint-routes">
            {STATUS_ORDER.map((status) => {
              const routeApps = selectedApps.filter((app) => app.status === status);
              return (
                <article key={status} className={status}>
                  <div><span className={`status-dot ${status}`} /><b>{STATUS_META[status].action}</b><strong>{routeApps.length}</strong></div>
                  <p>{STATUS_META[status].label}</p>
                  <div className="route-apps">{routeApps.length ? routeApps.map((app) => <span key={app.id}>{app.name}</span>) : <em>None</em>}</div>
                </article>
              );
            })}
          </div>
        </div>

        {escapeRoutes.length > 0 && (
          <section className="escape-routes" aria-labelledby="escape-title">
            <div className="escape-heading"><GitCompareArrows aria-hidden="true" /><div><span>Escape routes</span><h3 id="escape-title">Test an alternative before accepting a permanent blocker.</h3></div></div>
            <div className="escape-grid">
              {escapeRoutes.map(({ blocker, alternatives }) => (
                <article key={blocker.id}>
                  <div className="escape-from"><span className="app-icon mini" style={{ '--app-color': blocker.color } as React.CSSProperties}>{blocker.monogram}</span><div><small>Blocked</small><strong>{blocker.name}</strong></div></div>
                  <Route aria-hidden="true" />
                  <div className="escape-options">
                    {alternatives.map((alternative) => {
                      const active = selected.includes(alternative.id);
                      return <button type="button" key={alternative.id} onClick={() => addApp(alternative.id)} disabled={active}><span className={`status-dot ${alternative.status}`} />{alternative.name}<small>{active ? 'Added' : '+ Test'}</small></button>;
                    })}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <div className="plan-list-heading"><span>03 / Execution order</span><h3>Test the hardest constraint first.</h3><p>The route below follows actual consequence, not app popularity.</p></div>

        <div className="plan-list">
          {sortedPlan.map((app, index) => (
            <article className={`plan-card ${app.status}`} key={app.id}>
              <span className="plan-number">{String(index + 1).padStart(2, '0')}</span>
              <div className="plan-app">
                <span className="app-icon mini" style={{ '--app-color': app.color } as React.CSSProperties}>{app.monogram}</span>
                <div><h3>{app.name}</h3><span className={`route-label ${app.status}`}>{STATUS_META[app.status].action} / {STATUS_META[app.status].label}</span></div>
              </div>
              <div className="plan-copy"><p>{app.plan}</p><span><Terminal aria-hidden="true" />{getOmarchyRoute(app)}</span></div>
              <a href={app.source} target="_blank" rel="noreferrer" aria-label={`Open official source for ${app.name}`}>Official source <ExternalLink aria-hidden="true" /></a>
            </article>
          ))}
        </div>
      </section>}
    </>
  );
}
