# Grocery Assist Implementation Backlog

**Version:** 1.0  
**Date:** 2026-05-08  
**Scope:** Phase 0 and Phase 1 only  
**Source of truth:** `PROJECT_PLAN.md`

## How to Use This Backlog

- Each item below is structured so it can be copied into a GitHub issue with minimal editing.
- Priority uses `P0`, `P1`, `P2` where `P0` blocks the phase.
- Dependencies are explicit so sequencing is clear.
- Acceptance criteria are written for implementation and QA handoff.

## Phase 0 - Discovery and Pricing Foundation

### GA-001 - Define pilot region and initial store coverage

- **Phase:** 0
- **Priority:** P0
- **Suggested labels:** `enhancement`, `pricing`, `region`, `planning`
- **Problem it solves:** Assistant recommendations need a bounded real-world target region before pricing, region logic, and starter lists can be designed.
- **Scope:**
- Select the first pilot region at suburb/postal-zone granularity.
- Choose the first set of stores to support in that region.
- Define the minimum criteria for including a store in the pilot.
- Document exclusions and open questions.
- **Deliverables:**
- Pilot region record.
- Initial store coverage list.
- Inclusion/exclusion criteria.
- **Acceptance criteria:**
- A single pilot region is documented with a stable `region_id` naming convention.
- A first-pass list of in-scope stores exists for the pilot region.
- Each store is marked with source readiness: `simulated`, `receipt-seeded`, or `future`.
- The document states why this region was chosen and why other candidates were deferred.
- **Dependencies:** None.

### GA-002 - Define pricing source policy and legal/compliance boundaries

- **Phase:** 0
- **Priority:** P0
- **Suggested labels:** `enhancement`, `pricing`, `compliance`, `planning`
- **Problem it solves:** Pricing strategy cannot proceed safely without explicit rules for allowed sources, freshness, and user-facing transparency.
- **Scope:**
- Define approved source types for MVP.
- Define prohibited or deferred sourcing methods.
- Define freshness, confidence, and disclosure requirements.
- Define privacy handling for location-derived pricing context.
- **Deliverables:**
- Pricing source policy.
- Compliance checklist.
- User transparency requirements.
- **Acceptance criteria:**
- Approved MVP sources are documented as `simulated` and `receipt-derived`.
- Deferred sources are documented, including retailer-feed and community submissions.
- The 14-day freshness rule is documented.
- Confidence labels and `last_updated` display requirements are documented.
- Coarse-region storage policy is documented and exact coordinate retention is rejected for MVP.
- **Dependencies:** [GA-001].

### GA-003 - Define product normalization model

- **Phase:** 0
- **Priority:** P0
- **Suggested labels:** `enhancement`, `data`, `pricing`, `planning`
- **Problem it solves:** Receipt items, list items, and price observations need a shared product key before substitutions, pricing, or reminders can be reliable.
- **Scope:**
- Define normalized product identity fields.
- Define handling for aliases, pack size, brand sensitivity, and category assignment.
- Define confidence scoring for product matching.
- **Deliverables:**
- Product normalization specification.
- Matching rules and examples.
- Confidence rubric.
- **Acceptance criteria:**
- A documented schema exists for `normalized_product_key`, `product_name_raw`, `pack_size`, and category.
- The spec distinguishes exact match, probable match, and unknown match states.
- The spec explains how brand-sensitive and flexible items differ.
- At least 20 representative grocery examples are included.
- **Dependencies:** [GA-001], [GA-002].

### GA-004 - Define regional starter list framework

- **Phase:** 0
- **Priority:** P1
- **Suggested labels:** `enhancement`, `region`, `shopping-list`, `planning`
- **Problem it solves:** Region-aware onboarding and staples suggestions need a reusable template system for Essentials, Budget, Family, and Top-up starter lists.
- **Scope:**
- Define starter list template schema.
- Define how region-level defaults differ from user-customized lists.
- Define required metadata for quantity, category, and optional price anchor.
- **Deliverables:**
- Starter list schema.
- Template types and example payloads.
- Rule for fallback when no region-specific template exists.
- **Acceptance criteria:**
- Four template types are defined: `essentials`, `budget`, `family`, `top_up`.
- Template records support quantity, category, optional normalized product key, and ordering.
- Manual region fallback behavior is documented.
- User customization is documented as an overlay on top of regional defaults.
- **Dependencies:** [GA-001], [GA-003].

### GA-005 - Define assistant rule inputs and thresholds

- **Phase:** 0
- **Priority:** P1
- **Suggested labels:** `enhancement`, `assistant`, `planning`, `budget`
- **Problem it solves:** Phase 1 instrumentation must know what inputs and thresholds are required for future assistant decisions.
- **Scope:**
- Define inputs for Budget Guardrail, Substitution, and Staples Reminder.
- Define threshold configuration model.
- Define dismissal and snooze rules.
- **Deliverables:**
- Assistant rules input matrix.
- Threshold config spec.
- Decision-state definitions.
- **Acceptance criteria:**
- Budget Guardrail supports user-configurable alert threshold.
- Substitution strictness levels are defined.
- Staples Reminder uses frequency plus user-defined staples.
- Dismissal rules for current-trip suppression are documented.
- The spec includes a place for confidence thresholds and a default of medium+ for substitution cards.
- **Dependencies:** [GA-003], [GA-004].

### GA-006 - Define analytics and KPI measurement plan

- **Phase:** 0
- **Priority:** P1
- **Suggested labels:** `enhancement`, `analytics`, `planning`
- **Problem it solves:** The project already has KPI targets and rollout gates, but the team needs explicit formulas and event mappings before implementation begins.
- **Scope:**
- Define KPI formulas.
- Map KPIs to event sources.
- Define pilot success gates for Phase 2 entry.
- **Deliverables:**
- KPI dictionary.
- Event-to-KPI mapping.
- Rollout gate definitions.
- **Acceptance criteria:**
- Apply rate, dismiss rate, abandonment, budget overrun, and trip savings metrics are formally defined.
- Each KPI references the events required to calculate it.
- The Staples Reminder top-3 to configurable gate is documented in measurement terms.
- Phase 2 readiness criteria are documented.
- **Dependencies:** [GA-005].

## Phase 1 - Data and Instrumentation Foundation

### GA-101 - Add application state versioning and storage migration layer

- **Phase:** 1
- **Priority:** P0
- **Suggested labels:** `enhancement`, `data`, `technical-debt`
- **Problem it solves:** Current local storage is simple and unversioned. New assistant data structures need safe migration to avoid corrupting existing user data.
- **Scope:**
- Add app data version field.
- Add migration path for current local storage keys.
- Add safe defaults for missing structures.
- **Deliverables:**
- Versioned storage contract.
- Initial migration routine.
- Regression coverage for upgrades.
- **Acceptance criteria:**
- Existing `ga_items`, `ga_expenses`, and `ga_budget` continue loading correctly after upgrade.
- New data containers can be introduced without breaking current users.
- Migration failures fall back safely without crashing the app.
- Migration behavior is covered by automated tests.
- **Dependencies:** [GA-003].

### GA-102 - Implement event logging foundation

- **Phase:** 1
- **Priority:** P0
- **Suggested labels:** `enhancement`, `analytics`, `assistant`
- **Problem it solves:** Assistant learning, KPI reporting, and rollout gates depend on consistent event capture.
- **Scope:**
- Add event logger utility.
- Add stable event schema with shared metadata.
- Persist events locally in MVP-safe form.
- **Deliverables:**
- Event logging module.
- Event schema validation rules.
- Local persistence strategy.
- **Acceptance criteria:**
- The app can record core events with `event_id`, timestamp, app version, and payload.
- Event logging failures do not break user actions.
- Logged events can be queried by event type and trip context.
- Automated tests cover logger write behavior and malformed payload handling.
- **Dependencies:** [GA-005], [GA-006], [GA-101].

### GA-103 - Add trip/session context model

- **Phase:** 1
- **Priority:** P1
- **Suggested labels:** `enhancement`, `analytics`, `shopping-list`
- **Problem it solves:** Assistant cards and post-trip insights need a stable way to group user activity into trips and sessions.
- **Scope:**
- Define session lifecycle.
- Define trip lifecycle and completion triggers.
- Attach session/trip ids to events.
- **Deliverables:**
- Session/trip model.
- Event integration for ids.
- Completion rules.
- **Acceptance criteria:**
- New sessions are created deterministically.
- Trip context can be started, resumed, and completed without user confusion.
- Events written after list/budget/receipt actions include session and trip linkage when available.
- Trip completion rules are documented and test-covered.
- **Dependencies:** [GA-102].

### GA-104 - Add product normalization utility and mappings

- **Phase:** 1
- **Priority:** P0
- **Suggested labels:** `enhancement`, `pricing`, `ocr`, `shopping-list`
- **Problem it solves:** List items and OCR items need to normalize into a shared product vocabulary to enable future substitutions and pricing observations.
- **Scope:**
- Add normalization utility.
- Add seed alias table for common products.
- Add match-confidence output.
- **Deliverables:**
- Normalization module.
- Seed mapping dataset.
- Match result structure.
- **Acceptance criteria:**
- Common grocery inputs normalize into shared keys with match confidence.
- Unknown items are preserved safely without false certainty.
- Normalization can be called from both list-entry and OCR flows.
- Automated tests cover exact, alias, and unknown-match scenarios.
- **Dependencies:** [GA-003], [GA-101].

### GA-105 - Add region metadata model and selection state

- **Phase:** 1
- **Priority:** P1
- **Suggested labels:** `enhancement`, `region`, `location`
- **Problem it solves:** Region-aware templates and pricing need a stable in-app region selection model before geolocation is introduced.
- **Scope:**
- Add region metadata store.
- Add selected-region state.
- Support manual region selection and coarse persistence.
- **Deliverables:**
- Region schema.
- Selection/persistence utility.
- Manual fallback behavior.
- **Acceptance criteria:**
- The app can persist a selected coarse region without storing exact coordinates.
- Region selection can be changed manually.
- Region state is available to future pricing and starter-list logic.
- Automated tests cover default, update, and missing-region cases.
- **Dependencies:** [GA-001], [GA-002], [GA-101].

### GA-106 - Seed regional starter list data

- **Phase:** 1
- **Priority:** P1
- **Suggested labels:** `enhancement`, `shopping-list`, `region`
- **Problem it solves:** The app needs starter list content in place before assistant reminders and onboarding flows can use it.
- **Scope:**
- Add starter list dataset for pilot region.
- Include four template types.
- Connect dataset to region model, not yet to final UI.
- **Deliverables:**
- Starter list seed data.
- Template lookup utility.
- Validation tests.
- **Acceptance criteria:**
- Pilot region has at least one valid template for each of the four starter types.
- Templates resolve by region id.
- Missing-template fallback behavior is deterministic.
- Test coverage confirms list schema validity.
- **Dependencies:** [GA-004], [GA-105].

### GA-107 - Add receipt-derived price observation pipeline

- **Phase:** 1
- **Priority:** P0
- **Suggested labels:** `enhancement`, `ocr`, `pricing`, `assistant`
- **Problem it solves:** Hybrid pricing starts with receipt-derived observations, so OCR imports need to emit structured price records.
- **Scope:**
- Convert imported OCR items into price observations.
- Attach region, source type, and confidence.
- Store observations separately from raw expense entries.
- **Deliverables:**
- Price observation model.
- OCR-to-price observation mapper.
- Persistence and tests.
- **Acceptance criteria:**
- Importing OCR items creates `price_observed` events and observation records.
- Observation records include source type `receipt`, region context when known, and timestamps.
- Observation capture does not alter current shopping-list import behavior.
- Tests cover valid import, partial OCR confidence, and missing-region fallback.
- **Dependencies:** [GA-102], [GA-104], [GA-105].

### GA-108 - Add assistant card data contract and placeholder renderer

- **Phase:** 1
- **Priority:** P1
- **Suggested labels:** `enhancement`, `assistant`, `ui`
- **Problem it solves:** Assistant logic in Phase 2 needs a stable UI contract now so event logging and action handling are not invented later under pressure.
- **Scope:**
- Define assistant card payload shape.
- Add non-production placeholder renderer.
- Add apply/dismiss/not-now interaction hooks with logging.
- **Deliverables:**
- UI contract.
- Placeholder component/state wiring.
- Interaction events.
- **Acceptance criteria:**
- The app can render a placeholder assistant card from structured data.
- Apply, Dismiss, Not now, and Why this actions are supported at the contract level.
- Interaction events are logged even before final recommendation rules exist.
- Tests cover render state and action event emission.
- **Dependencies:** [GA-005], [GA-102].

### GA-109 - Add focused regression coverage for new data layer

- **Phase:** 1
- **Priority:** P0
- **Suggested labels:** `enhancement`, `testing`
- **Problem it solves:** The repo needs regression protection as storage, analytics, and normalization logic become more complex.
- **Scope:**
- Add automated tests for migrations, logger, normalization, region state, and OCR-derived pricing.
- Update the test plan to reflect new coverage.
- **Deliverables:**
- New automated tests.
- Updated `TEST_PLAN.md` coverage notes.
- **Acceptance criteria:**
- Tests exist for every new Phase 1 data module.
- Existing user flows continue to pass after the new data layer is introduced.
- `TEST_PLAN.md` is updated to reflect added regression coverage.
- **Dependencies:** [GA-101], [GA-102], [GA-104], [GA-105], [GA-107], [GA-108].

## Recommended Execution Order

1. GA-001
2. GA-002
3. GA-003
4. GA-004
5. GA-005
6. GA-006
7. GA-101
8. GA-102
9. GA-103
10. GA-104
11. GA-105
12. GA-106
13. GA-107
14. GA-108
15. GA-109

## Suggested Milestone Gates

### Gate A - Phase 0 complete

- Pilot region selected.
- Pricing policy documented.
- Product normalization spec approved.
- Starter list framework approved.
- Assistant thresholds and KPI formulas defined.

### Gate B - Phase 1 complete

- Storage migration works for existing local users.
- Event logger is in place and test-covered.
- Region state and starter list seeds exist.
- OCR imports create structured price observations.
- Assistant card contract exists and logs interactions.
- Regression suite updated for new data and state flows.