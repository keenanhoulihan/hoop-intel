# Domain schema audit

Required domain concepts per the build brief: Player, Team, Game, Season, Contract, Transaction, Market, StoryEvent, with Sport as a first-class dimension. This is a gap-list against what's actually in `src/core/league.ts` and `src/core/fixtures.ts` today — no new types written yet, this is the audit step only.

| Concept | Status | Notes |
|---|---|---|
| Sport | **Exists** | `SportId` in `league.ts` (`'basketball' \| 'football' \| 'baseball' \| 'hockey' \| 'soccer'`), attached to `LeagueModule.sport`. Already first-class — every league declares its sport, nothing assumes basketball. |
| Team | **Partial** | `Org` covers the shell (id, league, name, code, grouping, venue) — enough for the economics/rail feature this repo currently renders. No roster relationship, no coaching staff, no arena capacity/location beyond a name string. |
| Season | **Partial** | `SeasonId` is just a bare string type (`'2025-26'`), used as a key into economics data. No `Season` entity — no start/end dates, no phase (preseason/regular/playoffs), no game count validation beyond `LeagueModule.season.gameCount`. |
| Player | **Missing** | Nothing. No id, name, position, physical attributes (height/weight/age — needed by the daily puzzle's guess-feedback), draft info, or team relationship exists anywhere in `src/core`. |
| Game | **Missing** | Nothing. No schedule, score, box score, or game-state model. |
| Contract | **Missing** | `EconomicPosition`/`Obligation` model an org's *aggregate* cap position (total committed, dead money by line item) but there's no per-player `Contract` entity — no years, no salary-by-year, no contract type (rookie-scale, extension, two-way), no player linkage. The aggregate-only model is a real gap: the trade predictor (§6) needs to reason about individual outgoing/incoming contracts, not just team totals. |
| Transaction | **Missing** | Nothing. No trade/signing/waiver/draft-pick-move record type. `MovementMechanism` in `league.ts` models the *rules* for how movement can happen (salary-match requirement, feasibility check) but not a log of transactions that occurred. |
| Market | **Missing** | Nothing. No Kalshi/Polymarket price-and-outcome model exists yet; `docs/data-sources.md` covers licensing but there's no schema for a normalized market/outcome/price-point across the two sources. |
| StoryEvent | **Missing** | Nothing. This is called out in the brief as powering the whole narrative layer (career timelines, news feed) and doesn't exist in any form — not even a stub. |

## Reads on the existing design

- `league.ts`'s own comment is explicit about scope: "Nothing in this file knows what basketball is." It's deliberately an economics/threshold-rail contract, not a general sports domain model. The brief's assumption that Player/Game/Contract/etc. already exist doesn't match — this file was never meant to cover them.
- `SourceRef` (provider, url, retrievedAt, confidence: `'fixture' | 'reported' | 'official'`) is a reusable pattern worth carrying into every new entity that gets shown as fact — Player, Contract, Transaction, StoryEvent, Market all need per-record provenance for the same reason `EconomicPosition` does.
- `fixtures.ts` has 3-5 `Org` records per league and one `EconomicPosition` each — no players, no games, no seasons beyond the single current one, no transactions, no story events, no market data. The "450 players / two seasons / StoryEvents / news / Kalshi+Polymarket fixtures" described in the brief's context doesn't exist and would need to be built along with the types.

## What this means for scope

Player, Game, Contract, Transaction, Market, and StoryEvent are all green-field — six new domain concepts, not an edit to existing ones. Team and Season need extending, not rebuilding. Sport needs nothing further as a dimension; it's already correctly modeled as data, not as a hardcoded branch.
