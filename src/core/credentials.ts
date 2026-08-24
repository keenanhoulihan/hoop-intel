import 'server-only';
import { z } from 'zod';

/**
 * Every API key in the product passes through here and nowhere else.
 *
 * Three properties this buys you:
 *
 *  1. `import 'server-only'` makes it a build error to reach a key from a client
 *     component. Not a convention — the bundler refuses.
 *  2. A missing key is a degraded provider, never a crash. `credentialsFor()`
 *     returns null, the health registry skips that provider, and the page falls
 *     back to fixtures. Adding a new league or a new market source must never be
 *     able to take down a page that doesn't use it.
 *  3. Adding a provider is one entry in PROVIDERS. Nothing downstream changes.
 */

type CredentialSpec = {
  /** Env var names this provider needs. All must be present to be considered live. */
  vars: readonly string[];
  /**
   * Whether the terms of service permit use in a monetized product.
   * `false` and `unclear` are both treated as opt-in only — see §2.4.
   */
  commercialUseCleared: boolean | 'unclear';
  /** Requests per minute this provider tolerates. Enforced by the fetch wrapper. */
  rateLimitPerMin: number;
  docs?: string;
};

export const PROVIDERS = {
  balldontlie: {
    vars: ['BALLDONTLIE_API_KEY'],
    commercialUseCleared: true,
    rateLimitPerMin: 60,
  },
  nbaStats: {
    vars: [],
    commercialUseCleared: 'unclear',
    rateLimitPerMin: 20,
    docs: 'stats.nba.com — undocumented, opt-in via NBA_STATS_ENABLED',
  },
  kalshi: {
    vars: ['KALSHI_API_KEY_ID', 'KALSHI_PRIVATE_KEY'],
    commercialUseCleared: true,
    rateLimitPerMin: 120,
  },
  polymarket: {
    vars: ['POLYMARKET_API_KEY', 'POLYMARKET_SECRET', 'POLYMARKET_PASSPHRASE'],
    commercialUseCleared: true,
    rateLimitPerMin: 120,
  },
  sportradar: {
    vars: ['SPORTRADAR_API_KEY'],
    commercialUseCleared: true,
    rateLimitPerMin: 60,
  },
} as const satisfies Record<string, CredentialSpec>;

export type ProviderId = keyof typeof PROVIDERS;

/**
 * Env is parsed once, lazily, and every key is optional. The app boots with an
 * empty .env and runs entirely on fixtures — that property is what lets someone
 * clone the repo and see the real UI in one command.
 */
const EnvSchema = z.object({
  BALLDONTLIE_API_KEY: z.string().min(1).optional(),
  KALSHI_API_KEY_ID: z.string().min(1).optional(),
  KALSHI_PRIVATE_KEY: z.string().min(1).optional(),
  POLYMARKET_API_KEY: z.string().min(1).optional(),
  POLYMARKET_SECRET: z.string().min(1).optional(),
  POLYMARKET_PASSPHRASE: z.string().min(1).optional(),
  SPORTRADAR_API_KEY: z.string().min(1).optional(),
  NBA_STATS_ENABLED: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => v === 'true'),
  DATABASE_URL: z.string().url().optional(),
});

let cached: z.infer<typeof EnvSchema> | null = null;

export function env() {
  if (cached) return cached;
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    // Malformed is different from missing. Missing is fine; malformed is a bug.
    throw new Error(
      `Invalid environment:\n${parsed.error.issues
        .map((i) => `  ${i.path.join('.')}: ${i.message}`)
        .join('\n')}`,
    );
  }
  cached = parsed.data;
  return cached;
}

export interface Credentials {
  provider: ProviderId;
  values: Record<string, string>;
  rateLimitPerMin: number;
}

/** null means "not configured" — callers fall back, they don't throw. */
export function credentialsFor(provider: ProviderId): Credentials | null {
  const spec = PROVIDERS[provider];
  const e = env() as Record<string, string | boolean | undefined>;

  if (provider === 'nbaStats' && e.NBA_STATS_ENABLED !== true) return null;

  const values: Record<string, string> = {};
  for (const v of spec.vars) {
    const val = e[v];
    if (typeof val !== 'string' || !val) return null;
    values[v] = val;
  }
  return { provider, values, rateLimitPerMin: spec.rateLimitPerMin };
}

/**
 * What the health page renders. Never include the values — only whether a
 * provider is configured and whether it's cleared for commercial use.
 */
export function providerHealth() {
  return (Object.keys(PROVIDERS) as ProviderId[]).map((id) => ({
    id,
    configured: credentialsFor(id) !== null,
    commercialUseCleared: PROVIDERS[id].commercialUseCleared,
    autoSelectable: PROVIDERS[id].commercialUseCleared === true,
  }));
}
