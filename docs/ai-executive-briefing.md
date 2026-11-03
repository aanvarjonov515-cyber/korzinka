# ProfitLeak — AI Executive Briefing Specification

## Overview
The AI Executive Briefing converts structured snapshot metrics into concise executive intelligence.

## Structure
1. **Bugungi Holat (Today at a Glance)**: Summary of deferred sales, payment recovery, and current open debt.
2. **Nima O'zgardi (What Changed)**: Due today amounts and branch overdue shifts.
3. **Asosiy Xavf (Biggest Risk)**: Pinpoints top cashflow leak exposure (e.g. 60+ DPD concentration or broken promises).
4. **Best Opportunity**: Actionable recovery steps for immediate cashflow collection.
5. **Top 5 Actions**: Ranked deterministically by `ActionCandidateService`.

## Anti-Hallucination Safeguards
- All data fed into Gemini models is pre-computed by Python services.
- Models are instructed not to perform raw arithmetic.
- If AI API is unavailable, the dashboard presents deterministic metric cards gracefully.
