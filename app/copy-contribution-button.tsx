'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

const TEMPLATE = `App name:
Category:
Official compatibility source:
Omarchy path (native / web / bridge / blocked):
What must be tested:
Recommended migration plan:`;

export default function CopyContributionButton() {
  const [copied, setCopied] = useState(false);

  const copyTemplate = async () => {
    try {
      await navigator.clipboard.writeText(TEMPLATE);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt('Copy this:', TEMPLATE);
    }
  };

  return <button type="button" onClick={copyTemplate}>{copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}{copied ? 'Template copied' : 'Copy contribution template'}</button>;
}
