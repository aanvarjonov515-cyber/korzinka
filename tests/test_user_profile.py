import unittest
from backend.app.services.user_profile_service import UserProfileService

class TestUserProfileService(unittest.TestCase):

    def setUp(self):
        # Reset mock user
        self.user_id = "usr_test_abror"
        user = UserProfileService.get_or_create_user(self.user_id)
        user["first_name"] = "Abror"
        user["last_name"] = "Anvarjonov"
        user["role"] = "Bosh Direktor (Owner)"
        user["phone"] = "+998 90 750 12 34"

    def test_real_profile_fetch(self):
        profile = UserProfileService.get_or_create_user(self.user_id)
        self.assertEqual(profile["first_name"], "Abror")
        self.assertEqual(profile["last_name"], "Anvarjonov")
        self.assertEqual(profile["email"], "anvarjonov750@gmail.com")
        self.assertTrue(profile["email_verified"])
        self.assertEqual(profile["role"], "Bosh Direktor (Owner)")

    def test_update_allowed_fields(self):
        updates = {
            "first_name": "Abrorbek",
            "last_name": "Anvarjonov",
            "phone": "+998 93 111 22 33",
            "city": "Samarqand",
            "bio": "Tajribali chakana savdo rahbari"
        }
        ok, msg, updated = UserProfileService.update_profile(self.user_id, updates)
        self.assertTrue(ok)
        self.assertEqual(updated["first_name"], "Abrorbek")
        self.assertEqual(updated["phone"], "+998 93 111 22 33")
        self.assertEqual(updated["city"], "Samarqand")
        self.assertEqual(updated["bio"], "Tajribali chakana savdo rahbari")

    def test_mass_assignment_protection(self):
        # Malicious payload trying to escalate privileges and switch business
        malicious_payload = {
            "first_name": "HackedName",
            "role": "SUPER_ADMIN",
            "is_admin": True,
            "business_id": "00000000-0000-0000-0000-000000000000",
            "account_status": "EXEMPT"
        }
        ok, msg, updated = UserProfileService.update_profile(self.user_id, malicious_payload)
        self.assertTrue(ok)
        self.assertEqual(updated["first_name"], "HackedName")
        # Protected fields must remain unchanged!
        self.assertEqual(updated["role"], "Bosh Direktor (Owner)")
        self.assertNotEqual(updated.get("role"), "SUPER_ADMIN")

    def test_phone_validation(self):
        # Invalid phone
        bad_payload = {"phone": "abc-not-a-phone-123"}
        ok, msg, _ = UserProfileService.update_profile(self.user_id, bad_payload)
        self.assertFalse(ok)
        self.assertIn("formati noto'g'ri", msg)

    def test_avatar_validation_and_security(self):
        # 1. Valid JPEG with magic bytes
        jpeg_bytes = b"\xff\xd8\xff\xe0\x00\x10JFIF" + b"\x00" * 100
        ok, msg, ref = UserProfileService.validate_and_upload_avatar(
            self.user_id, jpeg_bytes, "avatar.jpg", "image/jpeg"
        )
        self.assertTrue(ok)
        self.assertIsNotNone(ref)
        self.assertTrue(ref.endswith(".jpg"))

        # 2. Fake image (script with .png extension)
        fake_png_bytes = b"<?php echo 'malicious code'; ?>"
        bad_ok, bad_msg, _ = UserProfileService.validate_and_upload_avatar(
            self.user_id, fake_png_bytes, "avatar.png", "image/png"
        )
        self.assertFalse(bad_ok)
        self.assertIn("imzo mos emas", bad_msg)

        # 3. Oversized image (>5MB)
        huge_bytes = b"\xff\xd8\xff" + b"\x00" * (6 * 1024 * 1024)
        huge_ok, huge_msg, _ = UserProfileService.validate_and_upload_avatar(
            self.user_id, huge_bytes, "large.jpg", "image/jpeg"
        )
        self.assertFalse(huge_ok)
        self.assertIn("juda katta", huge_msg)

    def test_remove_avatar(self):
        UserProfileService.get_or_create_user(self.user_id)["avatar_url"] = "/uploads/avatar.png"
        ok, msg = UserProfileService.remove_avatar(self.user_id)
        self.assertTrue(ok)
        self.assertIsNone(UserProfileService.get_or_create_user(self.user_id)["avatar_url"])

    def test_profile_completion_calculation(self):
        full_profile = {
            "first_name": "Abror",
            "last_name": "Anvarjonov",
            "email": "real@example.uz",
            "phone": "+998 90 123 45 67",
            "avatar_url": "/uploads/abror.png",
            "city": "Toshkent",
            "bio": "Rahbar"
        }
        score = UserProfileService.calculate_completion(full_profile)
        self.assertEqual(score, 100)

        partial_profile = {
            "first_name": "Abror",
            "last_name": "Anvarjonov",
            "email": "real@example.uz"
        }
        partial_score = UserProfileService.calculate_completion(partial_profile)
        self.assertEqual(partial_score, 50)  # 15 + 15 + 20 = 50%


if __name__ == "__main__":
    unittest.main()
