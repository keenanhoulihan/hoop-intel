'use client';

import { useState, type ReactNode } from 'react';

export interface TeamTab {
  id: string;
  title: string;
  content: ReactNode;
}

/**
 * Sections 5-8 sit behind tabs to hold the information budget — only one
 * shows at a time. Default is 'cap-pathways': this audience is here for
 * mechanics first, and it's the tab with the most real (non-empty-state)
 * content given what the fixtures currently support.
 *
 * `content` for every tab is server-rendered by the caller and handed in
 * as a prop — a Client Component can't directly import and instantiate the
 * async Server Components each tab's content is built from, so the parent
 * page does that rendering and this component only toggles visibility.
 */
const DEFAULT_TAB = 'cap-pathways';

export function TeamTabs({ tabs }: { tabs: TeamTab[] }) {
  const [active, setActive] = useState(tabs.some((t) => t.id === DEFAULT_TAB) ? DEFAULT_TAB : tabs[0]?.id);

  return (
    <div>
      <div role="tablist" className="mb-5 flex flex-wrap gap-1 border-b border-rule">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={active === t.id}
            onClick={() => setActive(t.id)}
            className={`rounded-t px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.04em] ${
              active === t.id ? 'border-b-2 border-walnut text-ink' : 'text-bark-light hover:text-bark'
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} hidden={active !== t.id}>
          {t.content}
        </div>
      ))}
    </div>
  );
}
