# Grocery Assist Project Plan

**Version:** 1.1  
**Date:** 2026-05-08  
**Status:** Decision locked for MVP execution

## 1) Product Vision

Grocery Assist should evolve from a tracking tool into a practical shopping assistant that helps users:

- Plan smarter before shopping
- Spend less during shopping
- Learn from receipts and improve over time

## 2) Current Functionality (Baseline)

- Shopping list CRUD with quantity, category, estimated price, and filters
- Budget setup and expense tracking with progress bar visualization
- Receipt OCR (upload/drag-drop/camera), extraction, and selective item import
- Simulated regional price comparison view
- Local-first persistence using browser storage

## 3) Assistant MVP Scope (v1)

### 3.1 Exact Features in v1

1. Budget Guardrail Assistant
- Detect projected overspend while list is edited
- Suggest actionable changes (defer, reduce quantity, substitute)

2. Smart Substitution Assistant
- Recommend lower-cost alternatives for flexible items
- Respect user constraints and preferences

3. Staples Reminder Assistant
- Suggest likely missing recurring essentials
- One-tap add to list

4. Receipt Review Assistant
- Highlight low-confidence OCR lines
- Allow quick correction before import

5. Post-Trip Insight Assistant
- Summarize spend vs budget and key savings opportunities
- Suggest 2-3 next-trip actions

### 3.2 Out of Scope for v1

- Full household collaboration and cloud sync
- Real-time nationwide price coverage across all stores
- Advanced AI chat-driven planning

## 4) Pricing and Regional Data Strategy (Pre-build Foundation)

### 4.1 Core Principle

A hybrid strategy is required due to limited clean, open grocery price APIs:

- Retailer channels where legally permitted
- Receipt-derived prices from users
- Community/manual confirmations where needed
- Optional paid/affiliate feeds once validated

### 4.2 Location-Based Shop Discovery and Base Lists

Yes, this is part of the plan.

- Request device geolocation with user consent
- Map coordinates to region key (city/suburb/postal/custom zone)
- Load shops available in that region
- Offer region-specific starter lists (weekly staples, budget basket, family basket, top-up basket)
- If location is denied, support manual region selection

### 4.3 Pricing Data Model (Minimum)

- `store_id`
- `region_id`
- `product_name_raw`
- `normalized_product_key`
- `pack_size`
- `unit_price`
- `total_price`
- `currency`
- `observed_at`
- `source_type` (`retailer_feed`, `receipt`, `community`)
- `confidence_score`

### 4.4 Data Quality and Compliance Requirements

- Display `last_updated` and confidence level to user
- Respect source terms and legal restrictions
- Prefer storing coarse region over long-term raw coordinates
- Maintain user privacy controls (consent, opt-out, data deletion)

## 5) Assistant Event Schema (Tracking + Learning)

### 5.1 Core Events

- `list_item_added`
- `list_item_updated`
- `list_item_removed`
- `budget_set`
- `expense_logged`
- `assistant_card_shown`
- `assistant_card_applied`
- `assistant_card_dismissed`
- `assistant_card_snoozed`
- `receipt_uploaded`
- `receipt_line_extracted`
- `receipt_line_corrected`
- `price_observed`
- `trip_completed`

### 5.2 Common Event Fields

- `event_id`
- `user_id` (or `device_id` in local-first mode)
- `timestamp`
- `session_id`
- `trip_id`
- `event_name`
- `payload`
- `app_version`
- `region_id`

### 5.3 Assistant Card Payload

- `card_id`
- `card_type`
- `trigger_reason`
- `expected_savings_amount`
- `confidence_score`
- `affected_item_ids`

## 6) Assistant Card UX Flow

1. Trigger
- User action (list edit, budget change, receipt import, search)

2. Generate
- Rules engine creates candidate recommendations

3. Rank
- Sort by impact, then confidence, then preference fit

4. Display
- Show one primary card (max two cards visible)
- Include recommendation, reason, estimated impact, confidence

5. Action
- Buttons: Apply, Dismiss, Not now, Why this?

6. Learn
- Log user response and update preference profile

7. Confirm
- Show updated totals and immediate result of action

## 7) Acceptance Criteria (v1)

### 7.1 Budget Guardrail Assistant

- Recommendation appears when projected spend exceeds threshold
- Card includes overrun amount and at least one direct action
- Apply updates totals immediately
- Dismiss suppresses repeated recommendation for current trip

### 7.2 Smart Substitution Assistant

- Suggested alternative includes expected savings and source context
- User can permanently mark item as non-substitutable
- Apply keeps list integrity (name/qty/category as defined)

### 7.3 Staples Reminder Assistant

- Reminder only shown above recurrence confidence threshold
- One-tap add works with sensible default quantity/category
- Dismiss lowers reminder frequency for same item

### 7.4 Receipt Review Assistant

- Low-confidence OCR lines are visually flagged
- User can edit line item name/price pre-import
- Corrected values persist accurately into list/expense history

### 7.5 Post-Trip Insight Assistant

- Summary generated after trip completion
- Includes spend vs budget plus top savings opportunities
- User can save one suggested action for next trip

## 8) Development Phases

### Phase 0 - Discovery and Pricing Foundation

- Finalize legal data sourcing boundaries and regional pilot strategy
- Define product normalization and pricing confidence model
- Create baseline region-shop mapping and starter list design

### Phase 1 - Data and Instrumentation Foundation

- Implement event collection model
- Add product normalization layer and region metadata
- Add initial pricing ingestion pathways (receipt-first)

### Phase 2 - Assistant MVP Core

- Ship Budget Guardrail, Substitution, and Staples Reminder
- Ship assistant card system with apply/dismiss actions
- Instrument acceptance and impact metrics

### Phase 3 - Receipt Intelligence

- Add low-confidence review and correction UX
- Improve OCR parsing with learned corrections
- Add post-trip insight generation

### Phase 4 - Regional Expansion and Personalization

- Add location-based region/shop discovery (opt-in)
- Add regional base lists and adaptive ranking
- Expand pricing source coverage by quality threshold

### Phase 5 - Optional Cloud/Collaboration

- Introduce accounts and sync
- Add household/shared list capabilities
- Keep local-first fallback mode

## 9) Initial KPI Targets

- Reduce budget overrun rate
- Increase assistant recommendation acceptance rate
- Improve trip-to-trip savings trend
- Reduce time to create a weekly list
- Increase retained monthly active users

## 10) Immediate Next Steps

1. Lock pilot region and first-shop coverage list
2. Define v1 thresholds (budget alert trigger, reminder confidence)
3. Design assistant card components and interaction copy
4. Build Phase 0 and Phase 1 technical tasks in GitHub Issues/Project

## 11) Final Decision Log (Locked)

### 11.1 Budget Guardrail Assistant

- A1.3: User-configurable alert threshold
- A2.2: Warning plus suggested item changes
- A3.1: Dismiss suppression limited to current trip

### 11.2 Smart Substitution Assistant

- B1.3: User-selectable substitution strictness
- B2.3: Per-item and per-category substitution controls
- B3.2: Only show suggestions with medium+ confidence

### 11.3 Staples Reminder Assistant

- C1.3: Frequency model plus user-defined staples
- C2.3: Show on app open and list open, capped to once daily
- C3.1: Show top 3 reminders initially

Scale trigger for C3 change (top 3 to configurable):

- Move from C3.1 to C3.3 after two consecutive releases where all are true:
- Reminder apply rate is at least 30%
- Reminder dismiss rate is below 45%
- No increase above 5% in session abandonment after reminder display
- At least 500 reminder events captured in the pilot region

### 11.4 Receipt Review Assistant

- D1.2: Force review only for low-confidence OCR lines
- D2.2: Inline edit plus quick category picker
- D3.1 now; D3.2 later: Learn on device first, then account-level learning after sync rollout

### 11.5 Post-Trip Insight Assistant

- E1.3: Show both per-trip summary and weekly digest
- E2.3: Focus on budget, savings, and next actions
- E3.2: Persist one next-trip goal

### 11.6 Location and Regional Base Lists

- F1.3: Auto-detect location with manual override
- F2.2: Suburb/postal-zone granularity
- F3.2: Regional templates include Essentials, Budget, Family, Top-up

### 11.7 Pricing Source Strategy

- G1.3: Hybrid pricing (simulated + receipt-derived) with confidence labels
- G2.2: Onboard stores only after data quality/freshness thresholds
- G3.2: Price freshness window set to 14 days

### 11.8 Privacy, Trust, and Controls

- H1.2: Persist coarse region only, not precise coordinates
- H2.2: Show reason and confidence on every assistant card
- H3.2: Full user controls for card types, confidence, export/delete
