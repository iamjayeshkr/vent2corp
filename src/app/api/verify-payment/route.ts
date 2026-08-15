import { createHmac, timingSafeEqual } from "crypto";
import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { getRazorpayConfig } from "@/lib/billing/pro";
import { PRO_PLAN } from "@/lib/billing/plan";
import { requireSession } from "@/lib/auth/requireSession";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = requireSession(request);
  if (!user) {
    return NextResponse.json({ error: "Please sign in before verifying a payment." }, { status: 401 });
  }

  try {
    const { razorpay_payment_id: paymentId, razorpay_order_id: orderId, razorpay_signature: signature } = await request.json();
    if (![paymentId, orderId, signature].every((value) => typeof value === "string" && value.length > 0)) {
      return NextResponse.json({ error: "Payment verification details are incomplete." }, { status: 400 });
    }

    const { keyId, keySecret } = getRazorpayConfig();
    const expectedSignature = createHmac("sha256", keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");
    const isValid = expectedSignature.length === signature.length && timingSafeEqual(
      Buffer.from(expectedSignature, "utf8"),
      Buffer.from(signature, "utf8")
    );

    if (!isValid) {
      return NextResponse.json({ error: "Payment signature could not be verified." }, { status: 400 });
    }

    // Fetch the order before confirming it to ensure it belongs to the current user and plan.
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.fetch(orderId);
    if (order.amount !== PRO_PLAN.amount || order.currency !== PRO_PLAN.currency || order.notes?.userId !== user.userId) {
      return NextResponse.json({ error: "This payment order does not match your Pro checkout." }, { status: 400 });
    }

    return NextResponse.json({ success: true, paymentId, orderId });
  } catch (error) {
    console.error("Razorpay payment verification failed:", error);
    if (error instanceof Error && error.message === "Razorpay is not configured on the server.") {
      return NextResponse.json({ error: "Payments are not configured yet." }, { status: 503 });
    }
    return NextResponse.json({ error: "Unable to verify the payment. Please contact support if you were charged." }, { status: 500 });
  }
}
