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
  ExternalLink,
  GitCompareArrows,
  Info,
  Plus,
  RotateCcw,
  Route,
  Search,
  Share2,
  Sparkles,
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

export default function CompatibilityChecker({ initialSelected = [] }: { initialSelected?: string[] }) {
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [category, setCategory] = useState<Category>('All');
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [copied, setCopied] = useState<'link' | 'post' | null>(null);
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
  const flashCopied = (kind: 'link' | 'post') => {
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1800);
  };
  const copyText = async (text: string, kind: 'link' | 'post') => {
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
    copyText(`My Omarchy Stackprint:\n\n${score}/100 ready\n${counts.native} native · ${counts.web} web · ${counts.bridge} bridge · ${counts.blocked} blocked\n${blockers.length ? `Keep lane: ${blockers.map((app) => app.name).join(', ')}` : 'No hard blockers found.'}\n\nBuild yours before you switch. #omarchy`, 'post');
  };

  return (
    <>
      <section className="checker-section" id="checker" aria-labelledby="checker-title">
        <div className="section-intro">
          <span className="section-kicker">01 / Define your stack</span>
          <h2 id="checker-title">What has to work on day one?</h2>
          <p>Choose only the apps that would interrupt your job if they failed. The result updates as you select.</p>
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
          <div className="share-actions">
            <button type="button" onClick={shareResult} disabled={score === null}>{copied === 'link' ? <Check aria-hidden="true" /> : <Share2 aria-hidden="true" />}{copied === 'link' ? 'Link copied' : 'Share Stackprint'}</button>
            <button type="button" onClick={copyPost} disabled={score === null}>{copied === 'post' ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}{copied === 'post' ? 'Post copied' : 'Copy X post'}</button>
          </div>
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
