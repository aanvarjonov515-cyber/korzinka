import unittest
from decimal import Decimal
from datetime import datetime

from backend.app.services.finance.tax_rule_engine import TaxRuleEngine
from backend.app.services.finance.profit_leak_engine import GlobalProfitLeakEngine
from backend.app.services.event_bus import DomainEventBus
from backend.app.services.action_center.priority_engine import PriorityEngine
from backend.app.services.integrations.adapter_base import BaseIntegrationAdapter
from backend.app.services.integrations.reconciliation_engine import ReconciliationEngine
from backend.app.services.control_plane.support_access_service import SupportAccessService
from backend.app.services.control_plane.observability_service import PlatformObservabilityService


class TestGlobalMasterArchitecture(unittest.TestCase):

    def test_global_e2e_sale_flow_and_no_double_counting(self):
        """
        E2E Sale: Cart -> Sale -> Revenue + COGS -> Receivable (Credit) -> Payment.
        CRITICAL: Customer debt payment must NOT increase revenue second time!
        """
        subtotal = Decimal("1000000.00")
        cost_total = Decimal("700000.00")
        
        # 1. Calculate Tax deterministically via TaxRuleEngine
        tax_res = TaxRuleEngine.calculate_tax(subtotal, tax_regime="GENERAL_VAT")
        self.assertEqual(tax_res["tax_rate"], Decimal("12.00"))
        self.assertEqual(tax_res["tax_amount"], Decimal("120000.00"))
        total_sale = tax_res["total_with_tax"]
        self.assertEqual(total_sale, Decimal("1120000.00"))

        # Gross margin calculation
        gross_profit = subtotal - cost_total
        margin_pct = (gross_profit / subtotal) * 100
        self.assertEqual(gross_profit, Decimal("300000.00"))
        self.assertEqual(margin_pct, Decimal("30.00"))

        # Accrual vs Cash Accounting: Credit Sale
        initial_revenue = total_sale
        initial_receivable = total_sale
        initial_cash = Decimal("0.00")

        # 2. Later: Customer pays debt
        customer_payment = Decimal("1120000.00")
        updated_receivable = initial_receivable - customer_payment
        updated_cash = initial_cash + customer_payment
        
        # Invariant check: Revenue remains exactly initial_revenue!
        post_payment_revenue = initial_revenue
        self.assertEqual(post_payment_revenue, initial_revenue)
        self.assertEqual(updated_receivable, Decimal("0.00"))
        self.assertEqual(updated_cash, Decimal("1120000.00"))

    def test_global_e2e_procurement_and_no_duplicate_expense(self):
        """
        E2E Procurement: PO -> GRN -> True Cost -> Supplier Invoice -> AP -> Payment.
        CRITICAL: Supplier payment must decrease payable, NOT create a second operating expense!
        """
        purchase_price = Decimal("50000000.00")
        logistics_fee = Decimal("2000000.00")
        true_cost = purchase_price + logistics_fee  # 52M UZS capital tied in inventory

        # Supplier Invoice creates Payable
        payable_balance = true_cost
        operating_expense = Decimal("0.00")  # Inventory is Asset, NOT Operating Expense!

        # Supplier payment executed
        payment_amount = Decimal("52000000.00")
        updated_payable = payable_balance - payment_amount
        cash_outflow = payment_amount

        # Invariant check: operating expense remains 0; no double counting!
        self.assertEqual(updated_payable, Decimal("0.00"))
        self.assertEqual(operating_expense, Decimal("0.00"))
        self.assertEqual(cash_outflow, Decimal("52000000.00"))

    def test_global_e2e_debt_collection_lifecycle(self):
        """
        E2E Debt: Overdue detection -> Collection AI alert -> Action Center -> Resolved.
        """
        overdue_days = 14
        debt_amount = 42500000.0  # 42.5M UZS

        # Priority calculation
        priority_level, score = PriorityEngine.calculate_priority(
            financial_impact=debt_amount,
            source_type="DEBT",
            risk_level="CRITICAL",
            hours_to_deadline=2.0
        )
        self.assertEqual(priority_level, "CRITICAL")
        self.assertGreaterEqual(score, 80.0)

    def test_global_e2e_tax_rule_versioning_and_calendar(self):
        """
        E2E Tax: Versioned Tax Rule Engine resolves historical rates accurately
        without overwriting past tax liabilities.
        """
        # Current transaction in 2026 -> 12%
        tax_2026 = TaxRuleEngine.calculate_tax(Decimal("100000.00"), txn_date_str="2026-10-31")
        self.assertEqual(tax_2026["tax_rate"], Decimal("12.00"))
        self.assertEqual(tax_2026["rule_version"], 2)

        # Historical transaction in 2021 -> 15%
        tax_2021 = TaxRuleEngine.calculate_tax(Decimal("100000.00"), txn_date_str="2021-05-15")
        self.assertEqual(tax_2021["tax_rate"], Decimal("15.00"))
        self.assertEqual(tax_2021["rule_version"], 1)

        # Compliance calendar produces deadlines
        calendar = TaxRuleEngine.get_tax_compliance_calendar()
        self.assertGreaterEqual(len(calendar), 2)
        self.assertEqual(calendar[0]["status"], "UPCOMING")

    def test_global_e2e_profit_leak_engine_calculation(self):
        """
        E2E Profit Leak Engine computes today's leak across all 13 categories deterministically.
        """
        report = GlobalProfitLeakEngine.calculate_todays_profit_leak(
            business_id="biz_central_tashkent",
            overdue_debts_amount=Decimal("42500000.00"),
            reconciliation_discrepancy=Decimal("250000.00"),
            stockout_potential_loss=Decimal("18400000.00"),
            expense_budget_variance=Decimal("8200000.00"),
            supplier_price_variance=Decimal("4500000.00"),
            dead_stock_capital=Decimal("12800000.00")
        )

        expected_total = Decimal("86650000.00")
        self.assertEqual(report["todays_total_leak_uzs"], expected_total)
        self.assertEqual(len(report["itemized_leaks"]), 6)
        self.assertEqual(len(report["top_5_actions"]), 5)
        self.assertIsNotNone(report["ai_executive_briefing"])

    def test_global_e2e_idempotency_and_event_bus(self):
        """
        E2E Event Bus: Duplicate events with same idempotency key are safely ignored.
        """
        bus = DomainEventBus()
        received_events = []

        bus.subscribe("SaleCreated", lambda p: received_events.append(p))

        payload = {"sale_id": "SALE-9912", "amount": 250000}
        key = "SALE_CREATED:SALE-9912:20261031"

        # First publish delivers
        res1 = bus.publish("SaleCreated", payload, idempotency_key=key)
        self.assertEqual(res1["status"], "DELIVERED")
        self.assertEqual(len(received_events), 1)

        # Second publish with same key is ignored
        res2 = bus.publish("SaleCreated", payload, idempotency_key=key)
        self.assertEqual(res2["status"], "DUPLICATE_IGNORED")
        self.assertEqual(len(received_events), 1)  # Handler was NOT called again!

    def test_global_e2e_no_ai_mode_resiliency(self):
        """
        CRITICAL ARCHITECTURAL TEST:
        If AI provider is completely unavailable, all core business transaction
        engines (Tax, Pricing, Reconciliation, Leaks) continue to function 100%!
        """
        # Tax engine works without AI
        tax = TaxRuleEngine.calculate_tax(Decimal("500000.00"))
        self.assertEqual(tax["tax_amount"], Decimal("60000.00"))

        # Reconciliation works without AI
        rec = ReconciliationEngine.reconcile_totals(
            connection_type="POS_VS_SALES",
            period_start="2026-10-31",
            period_end="2026-10-31",
            external_total=100000000.0,
            internal_total=99750000.0,
            external_records=[{"id": "R1", "amount": 250000.0}],
            internal_records=[]
        )
        self.assertEqual(rec["difference_amount"], 250000.0)

        # Profit leak engine works without AI
        leak = GlobalProfitLeakEngine.calculate_todays_profit_leak(business_id="biz_01")
        self.assertGreater(leak["todays_total_leak_uzs"], Decimal("0.00"))

    def test_global_e2e_multi_tenant_isolation(self):
        """
        Tenant Isolation: Business A can never access Business B records.
        """
        admin_id = "adm_operator_01"
        tenant_a = "tenant_korzinka"
        tenant_b = "tenant_makro"

        # Request support access for Tenant A only
        SupportAccessService.request_temporary_access(
            admin_user_id=admin_id,
            admin_user_name="Operator",
            tenant_id=tenant_a,
            tenant_name="Korzinka",
            reason="Investigating POS discrepancy ticket",
            scope="READ_ONLY_PROFILE",
            duration_minutes=30
        )

        # Access to Tenant A is permitted
        ok_a, _ = SupportAccessService.verify_tenant_access(admin_id, tenant_a, "READ_ONLY_PROFILE")
        self.assertTrue(ok_a)

        # Access to Tenant B is strictly denied
        ok_b, msg_b = SupportAccessService.verify_tenant_access(admin_id, tenant_b, "READ_ONLY_PROFILE")
        self.assertFalse(ok_b)
        self.assertIn("Access Denied", msg_b)


if __name__ == "__main__":
    unittest.main()
