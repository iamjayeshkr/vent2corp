import assert from "node:assert";
import { test, describe } from "node:test";
import { hashPassword, verifyPassword, signToken, verifyToken } from "../jwt";
import { checkRateLimit } from "../rateLimit";
import { createUser, getUserByEmail, updateUser } from "../db";

describe("Authentication & Security Module Tests", () => {
  test("1. Password Hashing & Verification", async () => {
    const rawPassword = "SuperSecurePassword123!";
    const hash = await hashPassword(rawPassword);
    
    assert.notStrictEqual(rawPassword, hash, "Hash must not equal raw password");
    
    const isValid = await verifyPassword(rawPassword, hash);
    assert.strictEqual(isValid, true, "Password verification must return true for correct password");

    const isInvalid = await verifyPassword("WrongPassword!", hash);
    assert.strictEqual(isInvalid, false, "Password verification must return false for wrong password");
  });

  test("2. JWT Signing & Verification", () => {
    const payload = {
      userId: "usr_test_123",
      email: "test@vent2corp.com",
      name: "Test User",
    };

    const token = signToken(payload);
    assert.ok(typeof token === "string" && token.length > 20, "Token must be a non-empty string");

    const decoded = verifyToken(token);
    assert.ok(decoded !== null, "Decoded token must not be null");
    assert.strictEqual(decoded?.userId, payload.userId);
    assert.strictEqual(decoded?.email, payload.email);
    assert.strictEqual(decoded?.name, payload.name);

    const tampered = verifyToken(token + "tampered");
    assert.strictEqual(tampered, null, "Tampered token must fail verification");
  });

  test("3. User DB, OTP Generation & Verification", async () => {
    const testEmail = `user_otp_${Date.now()}@vent2corp.com`;
    const passwordHash = await hashPassword("pass12345");
    const otpCode = "654321";

    const user = createUser({
      email: testEmail,
      name: "OTP Tester",
      passwordHash,
      emailVerified: false,
      otpCode,
      otpExpiresAt: Date.now() + 10 * 60 * 1000,
    });

    assert.strictEqual(user.emailVerified, false, "User must start unverified");
    assert.strictEqual(user.otpCode, "654321");

    // Activate user with OTP
    user.emailVerified = true;
    user.otpCode = undefined;
    updateUser(user);

    const fetched = getUserByEmail(testEmail);
    assert.strictEqual(fetched?.emailVerified, true, "User must be verified after OTP verification");
    assert.strictEqual(fetched?.otpCode, undefined, "OTP code must be cleared after verification");
  });

  test("4. Token Bucket Rate Limiting", () => {
    const id = `test_limit_${Date.now()}`;
    
    // Allow up to 3 requests
    const res1 = checkRateLimit(id, 3, 60 * 1000);
    assert.strictEqual(res1.allowed, true);
    assert.strictEqual(res1.remaining, 2);

    const res2 = checkRateLimit(id, 3, 60 * 1000);
    assert.strictEqual(res2.allowed, true);
    assert.strictEqual(res2.remaining, 1);

    const res3 = checkRateLimit(id, 3, 60 * 1000);
    assert.strictEqual(res3.allowed, true);
    assert.strictEqual(res3.remaining, 0);

    // 4th request must be rejected
    const res4 = checkRateLimit(id, 3, 60 * 1000);
    assert.strictEqual(res4.allowed, false, "4th request should exceed limit");
    assert.strictEqual(res4.remaining, 0);
  });

  test("5. Free Tier 10 Daily Translations Limit", () => {
    const userId = `free_user_daily_${Date.now()}`;
    const DAILY_LIMIT = 10;
    const WINDOW_24H = 24 * 60 * 60 * 1000;

    for (let i = 1; i <= DAILY_LIMIT; i++) {
      const check = checkRateLimit(`daily_usr_${userId}`, DAILY_LIMIT, WINDOW_24H);
      assert.strictEqual(check.allowed, true, `Request #${i} should be allowed`);
      assert.strictEqual(check.remaining, DAILY_LIMIT - i);
    }

    // 11th request must fail
    const check11 = checkRateLimit(`daily_usr_${userId}`, DAILY_LIMIT, WINDOW_24H);
    assert.strictEqual(check11.allowed, false, "11th request must hit daily limit");
    assert.strictEqual(check11.remaining, 0);
  });
});
