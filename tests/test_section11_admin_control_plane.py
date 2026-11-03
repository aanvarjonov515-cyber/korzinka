import unittest
from datetime import datetime, timedelta

from backend.app.services.control_plane.support_access_service import SupportAccessService
from backend.app.services.control_plane.platform_security_service import PlatformSecurityService
from backend.app.services.control_plane.observability_service import PlatformObservabilityService


class TestSection11AdminControlPlane(unittest.TestCase):

    def test_platform_rbac_least_privilege(self):
        # SUPPORT_ADMIN should have tenants:read, but NOT ai:providers:manage
        support_roles = ["SUPPORT_ADMIN"]
        self.assertTrue(PlatformSecurityService.check_permission(support_roles, "tenants:read"))
        self.assertFalse(PlatformSecurityService.check_permission(support_roles, "ai:providers:manage"))
        self.assertFalse(PlatformSecurityService.check_permission(support_roles, "mfa:reset"))

        # AI_PLATFORM_ADMIN can manage AI providers
        ai_roles = ["AI_PLATFORM_ADMIN"]
        self.assertTrue(PlatformSecurityService.check_permission(ai_roles, "ai:providers:manage"))
        self.assertFalse(PlatformSecurityService.check_permission(ai_roles, "subscriptions:write"))

        # SUPER_ADMIN has wildcard access
        super_roles = ["PLATFORM_SUPER_ADMIN"]
        self.assertTrue(PlatformSecurityService.check_permission(super_roles, "anything:unlimited"))

    def test_privilege_escalation_protection(self):
        # Support Admin cannot promote someone to Super Admin
        assigner_roles = ["SUPPORT_ADMIN"]
        ok, msg = PlatformSecurityService.validate_role_assignment(assigner_roles, "PLATFORM_SUPER_ADMIN")
        self.assertFalse(ok)
        self.assertIn("Privilege Escalation Blocked", msg)

        # Super Admin can assign any role
        ok2, msg2 = PlatformSecurityService.validate_role_assignment(["PLATFORM_SUPER_ADMIN"], "SECURITY_ADMIN")
        self.assertTrue(ok2)

    def test_step_up_authentication_enforcement(self):
        # High-risk action requires step-up token
        action = "SUSPEND_TENANT"
        ok, msg = PlatformSecurityService.verify_step_up_token(action, step_up_token=None, last_step_up_time=None)
        self.assertFalse(ok)
        self.assertIn("Step-Up Required", msg)

        # High-risk action with fresh step-up succeeds
        recent_time = datetime.utcnow() - timedelta(minutes=2)
        ok2, msg2 = PlatformSecurityService.verify_step_up_token(action, step_up_token="valid_mfa_token_xyz", last_step_up_time=recent_time)
        self.assertTrue(ok2)

        # Expired step-up (>10 mins) fails
        old_time = datetime.utcnow() - timedelta(minutes=15)
        ok3, msg3 = PlatformSecurityService.verify_step_up_token(action, step_up_token="valid_mfa_token_xyz", last_step_up_time=old_time)
        self.assertFalse(ok3)
        self.assertIn("Step-Up Expired", msg3)

    def test_tenant_data_access_requires_support_session(self):
        admin_id = "adm_sarvar_01"
        tenant_a = "tenant_korzinka_99"

        # 1. Admin without session is blocked
        ok, msg = SupportAccessService.verify_tenant_access(admin_id, tenant_a, "READ_ONLY_PROFILE")
        self.assertFalse(ok)
        self.assertIn("Access Denied", msg)

        # 2. Grant temporary support session for 30 minutes
        grant_ok, grant_msg, session = SupportAccessService.request_temporary_access(
            admin_user_id=admin_id,
            admin_user_name="Sarvar Aliyev",
            tenant_id=tenant_a,
            tenant_name="Korzinka Branch #04",
            reason="Investigating POS sync timeout ticket #SUP-9912",
            scope="INTEGRATION_DIAGNOSTICS",
            duration_minutes=30,
            support_case_id="SUP-9912"
        )
        self.assertTrue(grant_ok)
        self.assertIsNotNone(session)

        # 3. Access with granted scope succeeds
        ok_verify, msg_verify = SupportAccessService.verify_tenant_access(admin_id, tenant_a, "INTEGRATION_DIAGNOSTICS")
        self.assertTrue(ok_verify)

        # 4. Access with higher ungranted scope fails (Scope Insufficient)
        ok_high, msg_high = SupportAccessService.verify_tenant_access(admin_id, tenant_a, "FULL_SUPPORT")
        self.assertFalse(ok_high)
        self.assertIn("Scope Insufficient", msg_high)

    def test_cross_tenant_isolation_in_support_session(self):
        admin_id = "adm_nodir_02"
        tenant_a = "tenant_alpha_01"
        tenant_b = "tenant_beta_02"

        # Session granted only for Tenant A
        SupportAccessService.request_temporary_access(
            admin_user_id=admin_id,
            admin_user_name="Nodir Qodirov",
            tenant_id=tenant_a,
            tenant_name="Alpha Retail",
            reason="Customer requested invoice troubleshooting",
            scope="FULL_SUPPORT",
            duration_minutes=60
        )

        # Checking Tenant A succeeds
        ok_a, _ = SupportAccessService.verify_tenant_access(admin_id, tenant_a, "READ_ONLY_PROFILE")
        self.assertTrue(ok_a)

        # Attempting to access Tenant B fails
        ok_b, msg_b = SupportAccessService.verify_tenant_access(admin_id, tenant_b, "READ_ONLY_PROFILE")
        self.assertFalse(ok_b)
        self.assertIn("Access Denied: No active SupportAccessSession", msg_b)

    def test_ai_failure_classification(self):
        # 1. Daily quota exhausted
        c1 = PlatformObservabilityService.classify_ai_failure(
            http_code=429,
            error_message="Resource has been exhausted (e.g. check quota)",
            current_token_count=1500,
            max_context=8192
        )
        self.assertEqual(c1["category"], "DAILY_QUOTA_EXHAUSTED")
        self.assertTrue(c1["can_fallback"])

        # 2. Context length exceeded (Fatal, cannot simply fallback to same prompt)
        c2 = PlatformObservabilityService.classify_ai_failure(
            http_code=400,
            error_message="This model maximum context length is 8192 tokens",
            current_token_count=10000,
            max_context=8192
        )
        self.assertEqual(c2["category"], "TOKEN_CONTEXT_EXCEEDED")
        self.assertFalse(c2["can_fallback"])

        # 3. Provider Outage
        c3 = PlatformObservabilityService.classify_ai_failure(
            http_code=503,
            error_message="Service Unavailable / Backend Overloaded",
            current_token_count=1200,
            max_context=8192
        )
        self.assertEqual(c3["category"], "PROVIDER_OUTAGE")
        self.assertTrue(c3["can_fallback"])

    def test_sensitive_data_redaction_for_audit(self):
        raw_payload = {
            "business_name": "Mega Trade LLC",
            "api_key": "sk_live_9981248719234871239847",
            "database_connection": {
                "host": "postgres.internal",
                "password": "SuperSecretPassword123!",
                "port": 5432
            },
            "webhook_config": {
                "url": "https://api.megatrade.uz/hooks",
                "shared_secret": "whsec_abcdef123456"
            }
        }

        redacted = PlatformSecurityService.redact_sensitive_data(raw_payload)

        # Cleartext secrets must NOT be present
        self.assertNotEqual(redacted["api_key"], "sk_live_9981248719234871239847")
        self.assertTrue(redacted["api_key"].startswith("sk_l..."))
        self.assertEqual(redacted["database_connection"]["password"], "Supe...123!")
        self.assertTrue("..." in redacted["webhook_config"]["shared_secret"])

        # Non-sensitive fields preserved
        self.assertEqual(redacted["business_name"], "Mega Trade LLC")
        self.assertEqual(redacted["database_connection"]["host"], "postgres.internal")


if __name__ == "__main__":
    unittest.main()
