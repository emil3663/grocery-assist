# Grocery Assist

**A shopping assistant that keeps you inside a budget, rather than a list app
that tells you afterwards how far past it you went.**

Local-first: your list, your budget and your receipt history stay in the browser.
No account, no sign-up, no cloud dependency for anything that matters.

---

## Status

**Decision-locked for MVP execution.** `PROJECT_PLAN.md` v1.1 fixes the v1 scope,
and `IMPLEMENTATION_BACKLOG.md` carries fifteen tickets across two phases. Part of
the baseline is built; the assistant layer is specified and not yet implemented.

This README separates the two, because the difference matters and a reader
should not have to infer it from the source.

### Built and working

- Shopping list with quantity, category, estimated price and filters
- Budget setup and expense tracking with progress visualisation
- **Receipt OCR** — capture by upload, drag-and-drop or camera, with extraction
  and selective item import
- Regional price comparison view — see the note below
- Local-first persistence in browser storage

### Specified, not yet built

The five assistant modules that make up v1, defined in `PROJECT_PLAN.md` §3.1:

1. **Budget Guardrail** — detect projected overspend while the list is being
   edited, and suggest actionable changes: defer, reduce quantity, substitute
2. **Smart Substitution** — recommend lower-cost alternatives for flexible items,
   respecting stated constraints and preferences
3. **Staples Reminder** — surface likely missing recurring essentials, one tap to add
4. **Receipt Review** — highlight low-confidence OCR lines for correction before import
5. **Post-Trip Insight** — spend against budget, savings opportunities, and two or
   three concrete actions for next time

### Explicitly out of scope for v1

Household collaboration and cloud sync, real-time nationwide price coverage, and
chat-driven planning. Recorded in `PROJECT_PLAN.md` §3.2 so nobody assumes they
are coming.

---

## One thing to be clear about

**The regional price comparison is a simulated view, not live pricing data.**

That is not a shortcut, it is the honest state of the problem: there is no clean,
open, comprehensive grocery price API. `PROJECT_PLAN.md` §4 sets out the hybrid
strategy the real version needs — retailer channels where legally permitted,
prices derived from users' own scanned receipts, community confirmation, and
optional paid or affiliate feeds only once the rest is validated.

Receipt-derived pricing is the interesting part of that. Every scanned receipt is
a price observation with a date and a location attached, which means the data
improves as the app is used rather than requiring a feed to exist first.

---

## Planning documents

| Document | What it covers |
|---|---|
| `PROJECT_PLAN.md` | v1.1 — product vision, baseline, exact v1 scope, out-of-scope list, the pricing and regional data strategy |
| `IMPLEMENTATION_BACKLOG.md` | 15 tickets (GA-001 to GA-109) across two phases, each with scope, deliverables, observable acceptance criteria and explicit dependencies |
| `TEST_PLAN.md` | ID-coded test cases with expected results |

`GA-101` is the ticket to read first if you want to see the shape of the rest: a
versioned storage and migration layer, specified before the assistant data
structures land, so that a schema change cannot silently corrupt an existing
user's saved list.

---

## Running it

Static, no build step, no dependencies:

```
Open index.html in any modern browser.
```

Receipt capture by camera requires a secure context — `localhost` or HTTPS.

---

## How this was built

Specification first. Every ticket carries scope, deliverables, observable
acceptance criteria and explicit dependencies before any implementation begins;
AI coding agents do the implementation; the output is reviewed against that
specification rather than accepted on trust.

This project is the clearest example of that discipline in the portfolio, because
the planning got well ahead of the code — which is the intended order.

See [github.com/emil3663](https://github.com/emil3663).

---

## Licence

MIT. See `LICENSE`.
