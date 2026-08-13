import assert from "node:assert";
import { test, describe } from "node:test";
import { hashPassword, verifyPassword, signToken, verifyToken } from "../jwt";
import { checkRateLimit } from "../rateLimit";
import { createUser, getUserByEmail } from "../db";

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

  test("3. User DB & Unique Email Constraint", async () => {
    const testEmail = `user_${Date.now()}@vent2corp.com`;
    const passwordHash = await hashPassword("pass12345");

    const user = createUser({
      email: testEmail,
      name: "Unique Tester",
      passwordHash,
    });

    assert.ok(user.id.startsWith("usr_"), "User ID must be generated with usr_ prefix");
    assert.strictEqual(user.email, testEmail);

    const fetched = getUserByEmail(testEmail);
    assert.ok(fetched !== undefined, "User must be retrievable by email");
    assert.strictEqual(fetched?.name, "Unique Tester");

    assert.throws(
      () => {
        createUser({
          email: testEmail,
          name: "Duplicate Tester",
          passwordHash,
        });
      },
      /User with this email already exists/,
      "Duplicate user creation must throw an error"
    );
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
});
