'use client';

import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  Check,
  CircleCheck,
  Copy,
  ExternalLink,
  Info,
  Plus,
  RotateCcw,
  Search,
  Share2,
  X,
} from 'lucide-react';
import { APPS, CATEGORIES, STATUS_META, type AppStatus, type Category } from './apps';

const STATUS_ORDER: AppStatus[] = ['native', 'web', 'bridge', 'blocked'];

export default function CompatibilityChecker({ initialSelected = [] }: { initialSelected?: string[] }) {
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [category, setCategory] = useState<Category>('All');
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState<'link' | 'post' | null>(null);

  const selectedApps = useMemo(() => APPS.filter((app) => selected.includes(app.id)), [selected]);
  const filteredApps = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return APPS.filter((app) => {
      const inCategory = category === 'All' || app.category === category;
      const inSearch = `${app.name} ${app.note} ${app.category}`.toLowerCase().includes(normalizedQuery);
      return inCategory && inSearch;
    });
  }, [category, query]);

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
  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
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
      text: `My work stack is ${score}% Omarchy-ready. ${blockers.length ? `Hard blocker: ${blockers.map((app) => app.name).join(', ')}.` : 'No hard blockers found.'}`,
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
    copyText(`I checked my real work stack before switching to Omarchy.\n\nReadiness: ${score}/100\n${blockers.length ? `Hard blocker${blockers.length > 1 ? 's' : ''}: ${blockers.map((app) => app.name).join(', ')}` : 'No hard blockers found.'}\n\nCheck your stack before you switch. #omarchy`, 'post');
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
            <div className="picker-toolbar">
              <label className="search-field">
                <span className="sr-only">Search apps</span>
                <Search aria-hidden="true" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search 21 work apps" />
                {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search"><X aria-hidden="true" /></button>}
              </label>
              <span className="selection-count"><b>{selected.length}</b> selected</span>
            </div>

            <div className="category-tabs" aria-label="Filter apps by category">
              {CATEGORIES.map((item) => (
                <button type="button" key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)} aria-pressed={category === item}>
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
              {filteredApps.map((app) => {
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

            {!filteredApps.length && (
              <div className="empty-state">
                <Search aria-hidden="true" />
                <strong>No matching app</strong>
                <span>Try another name or add it to the community dataset.</span>
              </div>
            )}
            <a className="missing-link" href="#contribute">Can&apos;t find an app? Help add it <ExternalLink aria-hidden="true" /></a>
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
              <a className="primary-cta" href="#plan">Build my migration plan <ArrowDown aria-hidden="true" /></a>
            )}
          </aside>
        </div>
      </section>

      <section className="plan-section" id="plan" aria-labelledby="plan-title">
        <div className="plan-header">
          <div>
            <span className="section-kicker">02 / Make the move reversible</span>
            <h2 id="plan-title">Your migration plan</h2>
            <p>Start with the highest-consequence app. Build is not test, and “has a Linux version” is not proof that your workflow survives.</p>
          </div>
          <div className="share-actions">
            <button type="button" onClick={shareResult} disabled={score === null}>{copied === 'link' ? <Check aria-hidden="true" /> : <Share2 aria-hidden="true" />}{copied === 'link' ? 'Link copied' : 'Share result'}</button>
            <button type="button" onClick={copyPost} disabled={score === null}>{copied === 'post' ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}{copied === 'post' ? 'Post copied' : 'Copy X post'}</button>
          </div>
        </div>

        <div className="plan-list">
          {sortedPlan.length ? sortedPlan.map((app, index) => (
            <article className={`plan-card ${app.status}`} key={app.id}>
              <span className="plan-number">{String(index + 1).padStart(2, '0')}</span>
              <div className="plan-app">
                <span className="app-icon mini" style={{ '--app-color': app.color } as React.CSSProperties}>{app.monogram}</span>
                <div><h3>{app.name}</h3><span className={`route-label ${app.status}`}>{STATUS_META[app.status].action} / {STATUS_META[app.status].label}</span></div>
              </div>
              <p>{app.plan}</p>
              <a href={app.source} target="_blank" rel="noreferrer" aria-label={`Open official source for ${app.name}`}>Official source <ExternalLink aria-hidden="true" /></a>
            </article>
          )) : (
            <div className="empty-plan">
              <div><Plus aria-hidden="true" /></div>
              <h3>Your plan starts with one required app.</h3>
              <p>Select the tools that would stop your work if they failed.</p>
              <a href="#checker">Choose my apps <ArrowDown aria-hidden="true" /></a>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
