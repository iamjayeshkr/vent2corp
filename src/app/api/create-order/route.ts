import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { getRazorpayConfig } from "@/lib/billing/pro";
import { PRO_PLAN } from "@/lib/billing/plan";
import { requireSession } from "@/lib/auth/requireSession";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = requireSession(request);
  if (!user) {
    return NextResponse.json({ error: "Please sign in before starting checkout." }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const amount = Number(body.amount ?? PRO_PLAN.amount);

    if (!Number.isInteger(amount) || amount < 100) {
      return NextResponse.json({ error: "The payment amount must be at least 100 paise." }, { status: 400 });
    }

    // Pricing lives on the server so a changed browser request cannot lower the charge.
    if (amount !== PRO_PLAN.amount) {
      return NextResponse.json({ error: "That plan amount is not available." }, { status: 400 });
    }

    const { keyId, keySecret } = getRazorpayConfig();
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
      amount,
      currency: PRO_PLAN.currency,
      receipt: `v2c_${user.userId.slice(0, 16)}_${Date.now().toString(36)}`.slice(0, 40),
      notes: { userId: user.userId, plan: "pro_monthly" },
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: keyId,
    });
  } catch (error) {
    const statusCode = typeof error === "object" && error && "statusCode" in error
      ? Number(error.statusCode)
      : 500;

    console.error("Razorpay order creation failed:", error);
    if (statusCode === 401) {
      return NextResponse.json({ error: "Payment provider authentication failed." }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Razorpay is not configured on the server.") {
      return NextResponse.json({ error: "Payments are not configured yet." }, { status: 503 });
    }
    return NextResponse.json({ error: "Unable to create a payment order. Please try again." }, { status: 500 });
  }
}
