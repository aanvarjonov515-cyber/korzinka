# ProfitLeak AI Capabilities & Routing Specification

## 1. Canonical Capabilities
Routing is capability-driven, never by arbitrary free-form string matching:

1. `FINANCIAL_ANALYSIS`:
   - Answers questions on Revenue, Gross Margin, Operating Costs, Cash Bridge, Working Capital.
   - Authoritative Node: `FINANCE_AI`.
2. `DEBT_ANALYSIS`:
   - Inspects customer debt aging, days past due (DPD), broken promises, collection priority.
   - Authoritative Node: `COLLECTION_AI`.
3. `COLLECTION_CONVERSATION`:
   - Soft reminder interactions with debtors obeying quiet hours (20:00 - 08:00) and channel preferences.
   - Authoritative Node: `COLLECTION_AI`.
4. `SALES_ANALYSIS`:
   - Explains sales velocity, cashier discount patterns, ticket sizes, and return spikes.
   - Authoritative Node: `SALES_AI`.
5. `PROCUREMENT_ANALYSIS`:
   - Vendor quotes comparison, price spike explanations, supplier delivery accuracy.
   - Authoritative Node: `PROCUREMENT_AI`.
6. `INVENTORY_ANALYSIS`:
   - Stockout risk warnings, reorder suggestions, slow-moving items, batch expiration.
   - Authoritative Node: `INVENTORY_AI`.
7. `TAX_EXPLANATION`:
   - VAT liability breakdown, EHF reconciliation status, tax calendar compliance.
   - Authoritative Node: `TAX_AI`.
8. `VISION_EVENT_ANALYSIS`:
   - Queue depth, anonymous footfall, zone occupancy alerts.
   - Authoritative Node: `CAMERA_AI`.
9. `SECURITY_EVENT_ANALYSIS`:
   - WAF blocks, brute-force login attempts, protection state transitions.
   - Authoritative Node: `SECURITY_AI`.
10. `EXECUTIVE_BRIEFING`:
    - Cross-agent holistic business health synthesis and owner briefings.
    - Authoritative Node: `SUPERVISOR_AI`.
