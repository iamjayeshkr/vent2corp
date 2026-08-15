"use client";

import Script from "next/script";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, CreditCard, LoaderCircle, ShieldCheck, Sparkles } from "lucide-react";
import { PRO_PLAN } from "@/lib/billing/plan";
import { DoodleArrow, DoodleCrown, DoodleUnderline } from "@/components/ui/Doodles";

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void; on: (event: "payment.failed", handler: () => void) => void };
  }
}

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
  theme: { color: string };
  modal: { ondismiss: () => void; escape: boolean };
};

type CheckoutStatus = "idle" | "loading" | "verifying" | "success" | "error" | "dismissed";

export default function CheckoutPage() {
  const [scriptReady, setScriptReady] = useState(false);
  const [status, setStatus] = useState<CheckoutStatus>("idle");
  const [message, setMessage] = useState("");

  const startCheckout = async () => {
    if (!scriptReady || !window.Razorpay) {
      setStatus("error");
      setMessage("Secure checkout is still loading. Please try again in a moment.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const orderResponse = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: PRO_PLAN.amount }),
      });
      const order = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(order.error || "Unable to start checkout.");

      const checkout = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "vent2corp",
        description: PRO_PLAN.description,
        order_id: order.order_id,
        theme: { color: "#2563EB" },
        modal: {
          escape: true,
          ondismiss: () => {
            setStatus((current) => current === "loading" ? "dismissed" : current);
            setMessage("Checkout was closed. Your plan has not changed.");
          },
        },
        handler: async (response) => {
          setStatus("verifying");
          const verification = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const result = await verification.json();
          if (!verification.ok) {
            setStatus("error");
            setMessage(result.error || "Payment could not be verified. Please contact support if you were charged.");
            return;
          }
          setStatus("success");
          setMessage(`Payment ${result.paymentId} is verified. Welcome to Pro.`);
        },
      });
      checkout.on("payment.failed", () => {
        setStatus("error");
        setMessage("The payment did not go through. No plan changes were made.");
      });
      checkout.open();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to start checkout.");
    }
  };

  const busy = status === "loading" || status === "verifying";

  return (
    <main className="min-h-screen bg-[#fffefa] px-4 py-8 text-gray-950 sm:px-6 sm:py-12">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" onLoad={() => setScriptReady(true)} onError={() => { setStatus("error"); setMessage("Unable to load secure checkout. Please refresh and try again."); }} />
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 transition-colors hover:text-[#2563EB]">
          <ArrowLeft className="h-4 w-4" /> Back to workspace
        </Link>
        <div className="relative font-black tracking-tight text-xl">vent<span className="text-[#2563EB]">2</span>corp<DoodleCrown className="absolute -top-5 left-2 h-5 w-7 text-[#D4A017]" rotation={-5} /></div>
      </div>

      <section className="mx-auto mt-10 grid max-w-5xl overflow-hidden rounded-[2rem] border-2 border-gray-950 bg-white shadow-[10px_11px_0_#18181b] lg:grid-cols-[1.1fr_.9fr]">
        <div className="relative overflow-hidden border-b-2 border-gray-950 bg-[#fef3c7] p-7 sm:p-10 lg:border-b-0 lg:border-r-2">
          <DoodleArrow className="absolute right-8 top-8 h-9 w-16 text-[#2563EB]" rotation={-12} />
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-gray-950 bg-white px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Secure Pro checkout</span>
          <h1 className="mt-7 max-w-md font-display text-5xl leading-[.9] sm:text-7xl">MAKE YOUR<br />WORDS<br /><span className="text-[#2563EB]">LAND.</span></h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-gray-700">Unlimited translations, tailored tones, and the room to say what you actually mean—without the workplace fallout.</p>
          <DoodleUnderline className="mt-3 h-4 w-28 text-pink-500" />
          <ul className="mt-9 space-y-3 text-sm font-bold text-gray-800">
            {["Unlimited translations", "Custom tones and templates", "Your workspace stays yours"].map((item) => <li key={item} className="flex items-center gap-2"><Check className="h-5 w-5 text-emerald-600" /> {item}</li>)}
          </ul>
        </div>

        <div className="flex flex-col justify-between p-7 sm:p-10">
          {status === "success" ? (
            <div className="space-y-5 text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full border-2 border-gray-950 bg-emerald-100"><Check className="h-8 w-8 text-emerald-700" /></div><h2 className="font-display text-4xl">YOU&apos;RE IN.</h2><p className="text-sm leading-relaxed text-gray-600">{message}</p><Link href="/dashboard" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-gray-950 bg-[#FACC15] px-5 text-sm font-extrabold shadow-[4px_4px_0_#18181b]">Open workspace <ArrowRight className="h-4 w-4" /></Link></div>
          ) : (
            <>
              <div><div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-widest text-gray-500"><span>vent2corp Pro</span><Sparkles className="h-4 w-4 text-[#2563EB]" /></div><div className="mt-6 text-5xl font-display">₹499 <span className="font-sans text-sm font-medium text-gray-500">/ month</span></div><p className="mt-3 text-sm text-gray-600">One clear plan. Cancel anytime.</p><div className="my-7 border-t border-gray-200" /><div className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-xs leading-relaxed text-gray-600"><div className="flex items-center gap-2 font-bold text-gray-900"><CreditCard className="h-4 w-4 text-[#2563EB]" /> Powered by Razorpay</div><p>Your payment details are entered only in Razorpay&apos;s secure checkout.</p></div></div>
              <div className="mt-8"><button type="button" disabled={!scriptReady || busy} onClick={startCheckout} className="flex h-14 w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-950 bg-[#FACC15] text-sm font-extrabold text-gray-950 shadow-[5px_5px_0_#18181b] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none">{busy ? <><LoaderCircle className="h-4 w-4 animate-spin" /> {status === "verifying" ? "Verifying payment..." : "Opening secure checkout..."}</> : <>{scriptReady ? "Continue securely" : "Loading checkout..."} <ArrowRight className="h-4 w-4" /></>}</button>{message && <p className={`mt-4 rounded-xl border p-3 text-xs font-medium ${status === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-gray-200 bg-gray-50 text-gray-600"}`}>{message}</p>}</div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
