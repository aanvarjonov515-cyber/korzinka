import unittest
import json
from datetime import datetime

from backend.app.services.action_center.priority_engine import PriorityEngine
from backend.app.services.action_center.workflow_engine import WorkflowEngine
from backend.app.services.action_center.automation_rules import AutomationRuleValidator
from backend.app.services.integrations.adapter_base import BaseIntegrationAdapter
from backend.app.services.integrations.pos_adapter import PosIntegrationAdapter
from backend.app.services.integrations.webhook_gateway import WebhookGateway
from backend.app.services.integrations.reconciliation_engine import ReconciliationEngine


class TestSection10ActionCenterAndIntegrations(unittest.TestCase):

    def test_priority_engine_calculation(self):
        # High financial impact + critical deadline
        level, score = PriorityEngine.calculate_priority(
            financial_impact=60_000_000,  # 60M UZS
            source_type="SECURITY",
            risk_level="CRITICAL",
            hours_to_deadline=1.5
        )
        self.assertEqual(level, "CRITICAL")
        self.assertGreaterEqual(score, 80.0)

        # Blocked action penalty
        level_blocked, score_blocked = PriorityEngine.calculate_priority(
            financial_impact=5_000_000,
            source_type="INVENTORY",
            risk_level="LOW",
            hours_to_deadline=30.0,
            is_blocked=True
        )
        self.assertIn(level_blocked, ["LOW", "MEDIUM"])

    def test_dedup_key_generation(self):
        key1 = PriorityEngine.generate_dedup_key("DEBT", "debt_cust_123", "COLLECTION")
        key2 = PriorityEngine.generate_dedup_key("debt", "debt_cust_123", "collection")
        self.assertEqual(key1, key2)
        self.assertEqual(key1, "DEBT:debt_cust_123:COLLECTION")

    def test_automation_rule_safety_validator_blocks_forbidden_actions(self):
        # Rule attempting to delete debt
        unsafe_rule = {
            "trigger_event": "CUSTOMER_COMPLAINT",
            "actions": [
                {"action_type": "DELETE_DEBT", "parameters": {"customer_id": "cust_1"}}
            ]
        }
        is_valid, errors, _ = AutomationRuleValidator.validate_rule_safety(unsafe_rule)
        self.assertFalse(is_valid)
        self.assertTrue(any("prohibited by system safety policy" in err for err in errors))

    def test_automation_rule_safety_validator_requires_human_approval_for_large_amounts(self):
        large_payout_rule = {
            "trigger_event": "INVOICE_RECEIVED",
            "actions": [
                {
                    "action_type": "APPROVE_SUPPLIER_PAYOUT",
                    "parameters": {"amount": 15_000_000},  # 15M UZS > 5M UZS threshold
                    "requires_human_approval": False        # Violation!
                }
            ]
        }
        is_valid, errors, _ = AutomationRuleValidator.validate_rule_safety(large_payout_rule)
        self.assertFalse(is_valid)
        self.assertTrue(any("require mandatory human approval" in err for err in errors))

    def test_automation_rule_anti_loop_prevention(self):
        loop_rule = {
            "trigger_event": "ACTION_CREATED",
            "actions": [
                {"action_type": "CREATE_ACTION", "parameters": {"title": "Follow up"}}
            ],
            "conditions": []
        }
        is_valid, errors, _ = AutomationRuleValidator.validate_rule_safety(loop_rule)
        self.assertFalse(is_valid)
        self.assertTrue(any("Infinite Loop Danger" in err for err in errors))

    def test_natural_language_to_draft_always_draft_status(self):
        prompt = "Mijozning qarzi 7 kundan oshib ketsa, telegramdan muloyim eslatma yuborilsin va limit tekshirilsin"
        draft = AutomationRuleValidator.parse_natural_language_to_draft(prompt)
        self.assertEqual(draft["status"], "DRAFT")
        self.assertTrue(draft["created_by_ai"])
        self.assertEqual(draft["trigger_event"], "DEBT_OVERDUE_DETECTED")
        self.assertTrue(draft["is_safety_validated"])

    def test_webhook_hmac_and_idempotency(self):
        secret = "profit_leak_super_secret_webhook_key_2026"
        gateway = WebhookGateway({"CLICK": secret})

        payload = json.dumps({"transaction_id": "click_txn_9999", "amount": 250000, "timestamp": "2026-10-31T15:00:00"}).encode("utf-8")
        import hmac, hashlib
        valid_sig = hmac.new(secret.encode("utf-8"), payload, hashlib.sha256).hexdigest()

        # Valid signature
        ok, msg, data = gateway.process_inbound_webhook("CLICK", payload, {"X-Signature": valid_sig})
        self.assertTrue(ok)
        self.assertEqual(data["transaction_id"], "click_txn_9999")

        # Duplicate delivery is handled idempotently
        ok2, msg2, _ = gateway.process_inbound_webhook("CLICK", payload, {"X-Signature": valid_sig})
        self.assertTrue(ok2)
        self.assertIn("idempotent ack", msg2.lower())

        # Invalid signature rejected
        bad_ok, bad_msg, _ = gateway.process_inbound_webhook("CLICK", payload, {"X-Signature": "invalid_sig_abc"})
        self.assertFalse(bad_ok)
        self.assertIn("invalid webhook hmac", bad_msg.lower())

    def test_reconciliation_engine_pos_vs_profitleak_mismatch_breakdown(self):
        # Real scenario: POS reports 100M UZS, internal ledger has 99.75M UZS -> 250k UZS diff
        external_total = 100_000_000.0
        internal_total = 99_750_000.0

        external_records = [
            {"external_id": "REC-001", "amount": 50_000_000.0},
            {"external_id": "REC-002", "amount": 49_750_000.0},
            {"external_id": "REC-003", "amount": 150_000.0},  # Missing in internal
            {"external_id": "REC-004", "amount": 100_000.0},  # Discrepant
        ]

        internal_records = [
            {"id": "REC-001", "amount": 50_000_000.0},
            {"id": "REC-002", "amount": 49_750_000.0},
            {"id": "REC-004", "amount": 0.0},  # Voided locally without update
        ]

        result = ReconciliationEngine.reconcile_totals(
            connection_type="POS_VS_SALES",
            period_start="2026-10-31 00:00:00",
            period_end="2026-10-31 23:59:59",
            external_total=external_total,
            internal_total=internal_total,
            external_records=external_records,
            internal_records=internal_records
        )

        self.assertFalse(result["is_matched"])
        self.assertEqual(result["difference_amount"], 250_000.0)
        self.assertEqual(result["mismatch_count"], 2)
        self.assertIsNotNone(result["action_item_proposal"])
        self.assertEqual(result["action_item_proposal"]["financial_impact"], 250_000.0)

    def test_workflow_engine_step_execution_and_loop_guard(self):
        context = {"order_id": "ORD-123", "amount": 8_000_000}
        step_def = {
            "step_id": "STEP_1",
            "step_type": "APPROVAL",
            "config": {
                "required_role": "FINANCIAL_CONTROLLER",
                "threshold_amount": 5_000_000
            },
            "on_approved_step": "STEP_DISPATCH"
        }

        # Approval step triggered because 8M > 5M
        res = WorkflowEngine.execute_step(context, step_def, step_execution_count=1)
        self.assertEqual(res["status"], "PENDING_APPROVAL")
        self.assertTrue(res["requires_approval"])

        # Test loop detection
        loop_res = WorkflowEngine.execute_step(context, step_def, step_execution_count=16)
        self.assertEqual(loop_res["status"], "FAILED")
        self.assertIn("Infinite loop detected", loop_res["error"])


if __name__ == "__main__":
    unittest.main()
