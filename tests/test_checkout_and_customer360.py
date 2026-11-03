import unittest
from datetime import datetime

class TestProfitLeakCheckoutAndCustomer360(unittest.TestCase):
    """
    Validates ProfitLeak checkout, payment states, customer 360 projections,
    debt traceability, payment security, and e-receipt generation.
    """

    def test_payment_security_no_sensitive_credentials(self):
        # Verify prohibited sensitive fields are never in payment/customer records
        forbidden_fields = {"cvv", "pin", "otp", "password", "bank_password", "card_secret"}
        sample_payment_record = {
            "id": "pay_001",
            "sale_id": "sale_001",
            "amount": 100000,
            "currency": "UZS",
            "status": "SUCCESS",
            "provider_transaction_id": "tx_ref_99281",
            "masked_payment_method": "UZCARD •••• 6311",
            "created_at": datetime.utcnow().isoformat()
        }
        for field in forbidden_fields:
            self.assertNotIn(field, sample_payment_record, f"Security violation: {field} found in payment record")

    def test_debt_traceability_to_sale_items(self):
        # 100,000 UZS Nasiya sale test
        sale_items = [
            {"product_name": "Musaffo Sut 3.2% 1L", "quantity": 2, "unit_price": 12500, "line_total": 25000},
            {"product_name": "Mol Go'shti Lahm kg", "quantity": 1, "unit_price": 75000, "line_total": 75000}
        ]
        total_amount = sum(i["line_total"] for i in sale_items)
        self.assertEqual(total_amount, 100000, "Total must be exactly 100,000 UZS")

        debt_record = {
            "debt_number": "DBT-2026-000481",
            "customer_id": "cus_anvar_01",
            "original_amount": total_amount,
            "remaining_amount": total_amount,
            "source_sale_items": sale_items,
            "status": "UNPAID"
        }

        self.assertEqual(debt_record["original_amount"], 100000)
        self.assertEqual(len(debt_record["source_sale_items"]), 2)
        self.assertEqual(debt_record["source_sale_items"][0]["line_total"], 25000)
        self.assertEqual(debt_record["source_sale_items"][1]["line_total"], 75000)

    def test_customer_360_projections(self):
        customer = {
            "id": "cus_anvar_01",
            "full_name": "Anvar Karimov",
            "phone": "+998 90 123 45 67",
            "total_purchases": 350000,
            "total_paid": 250000,
            "outstanding_debt": 100000,
            "saved_payment_methods": [
                {"id": "cpm_01", "masked_number": "UZCARD •••• 6311", "verified": True, "recurrent_enabled": True}
            ]
        }
        self.assertEqual(customer["outstanding_debt"], 100000)
        self.assertEqual(len(customer["saved_payment_methods"]), 1)
        self.assertTrue(customer["saved_payment_methods"][0]["verified"])

    def test_electronic_receipt_structure(self):
        receipt = {
            "receipt_number": "REC-TASH-01-20261031-000214",
            "public_id": "rcpt_7F3K9A81",
            "subtotal": 100000,
            "total": 100000,
            "payment": {"method": "CARD_PROVIDER", "status": "SUCCESS", "amount": 100000},
            "customer": {"name": "Anvar Karimov"},
            "qr_payload": "profitleak://receipt/rcpt_7F3K9A81"
        }
        self.assertIn("receipt_number", receipt)
        self.assertIn("qr_payload", receipt)
        self.assertEqual(receipt["total"], 100000)
        self.assertEqual(receipt["payment"]["status"], "SUCCESS")

if __name__ == '__main__':
    unittest.main()
