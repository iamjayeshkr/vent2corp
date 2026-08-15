"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check } from "lucide-react";
import { DoodleSparkle, DoodleCheckMark, DoodleArrow, DoodleCrown, DoodleConfused, DoodleLightning, DoodleNervous } from "@/components/ui/Doodles";
import { CorporateMessageBubble, RawMessageBubble } from "@/components/illustrations";

interface ExampleCard {
  id: string;
  category: string;
  raw: string;
  corporate: string;
  tone: string;
  recipient: string;
  platform: string;
  rotate: string;
}

const GALLERY_EXAMPLES: ExampleCard[] = [
  {
    id: "g-1",
    category: "Manager",
    raw: "bhai ye kaam kal tak kaise hoga jab requirement aaj mili hai",
    corporate: "Since the requirement was shared today, I may need some additional time to complete it properly. Could we align on a realistic timeline?",
    tone: "Firm",
    recipient: "Manager",
    platform: "Slack",
    rotate: "-rotate-1",
  },
  {
    id: "g-2",
    category: "Technical",
    raw: "kitni baar same bug explain karu",
    corporate: "I've already shared the details around this issue, but it may be worth reviewing them once more so we can avoid going in circles.",
    tone: "Firm",
    recipient: "Coworker",
    platform: "Email",
    rotate: "rotate-1",
  },
  {
    id: "g-3",
    category: "Client",
    raw: "client roz scope badha raha hai",
    corporate: "The scope has expanded several times, so I'd suggest we finalize the current requirements before taking on additional changes.",
    tone: "Diplomatic",
    recipient: "Client",
    platform: "Email",
    rotate: "-rotate-2",
  },
  {
    id: "g-4",
    category: "Requirements",
    raw: "mujhe ye requirement samajh nhi aa rahi",
    corporate: "I want to make sure I understand the requirement correctly before proceeding. Could we clarify the expected outcome and acceptance criteria?",
    tone: "Professional",
    recipient: "Manager",
    platform: "Slack",
    rotate: "rotate-2",
  },
];

const TABS = ["All", "Manager", "Client", "Technical", "Requirements"];

export function Examples() {
  const [activeTab, setActiveTab] = useState("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = GALLERY_EXAMPLES.filter(
    (item) => activeTab === "All" || item.category === activeTab
  );

  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="examples" className="bg-white py-[clamp(7rem,12vw,13rem)] px-4 select-none sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1320px] space-y-12 text-left">
      <div className="space-y-2">
        <div className="inline-block px-3 py-1 rounded-md bg-[#FACC15] text-gray-950 font-extrabold text-xs font-mono uppercase">
          SEE IT IN ACTION
        </div>
        <h2 className="examples-title font-display text-gray-950">
          FROM:
          <br />
          &ldquo;I REALLY WANT
          <br />
          TO SAY THIS&rdquo;
          <br />
          <span className="desktop-blue-note text-[#2563EB]">TO: &ldquo;THIS WILL PROBABLY BE FINE.&rdquo;</span>
        </h2>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === tab
                ? "bg-[#2563EB] text-white shadow-md"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* A stable gallery frame keeps the examples easy to compare. */}
      <div className="example-card-rail grid grid-cols-1 gap-6 md:grid-cols-2 md:items-stretch">
        {filtered.map((item, idx) => {
          const ExampleDoodle = [DoodleCrown, DoodleNervous, DoodleLightning, DoodleConfused][idx % 4];
          return (
          <div
            key={item.id}
            className="example-card-rail-item example-gallery-card relative flex min-h-[27rem] flex-col justify-between space-y-4 rounded-3xl border-2 border-gray-950 bg-white p-6 shadow-[4px_5px_0_rgb(24_24_27_/_0.12)] transition-all hover:-translate-y-1 hover:shadow-[6px_8px_0_rgb(24_24_27_/_0.16)]"
          >

            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-100 text-yellow-800 font-mono">
                  {item.category}
                </span>
                <div className="flex items-center gap-2">
                  <ExampleDoodle className="h-9 w-10 text-[#2563EB]" rotation={idx % 2 ? 8 : -8} strokeWidth={2.6} />
                  <span className="text-[11px] font-mono font-bold text-gray-500">
                    {item.tone} · {item.recipient} · {item.platform}
                  </span>
                </div>
              </div>

              <RawMessageBubble className="rounded-2xl">
                <span className="text-[10px] font-bold font-mono text-pink-700 block mb-1">RAW</span>
                <p className="text-xs font-sans font-bold text-gray-950 italic">&ldquo;{item.raw}&rdquo;</p>
              </RawMessageBubble>

              <div className="flex h-5 items-center justify-center">
                <DoodleArrow className="h-5 w-12 text-[#2563EB]" rotation={90} strokeWidth={2.8} />
              </div>

              <CorporateMessageBubble className="rounded-2xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold font-mono text-emerald-700">CORPORATE</span>
                  <DoodleCheckMark className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-xs font-sans font-medium text-gray-950 leading-relaxed">{item.corporate}</p>
              </CorporateMessageBubble>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <Link
                href={`/new?raw=${encodeURIComponent(item.raw)}`}
                className="px-4 py-2 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-gray-950 font-extrabold text-xs flex items-center gap-1.5 shadow-2xs"
              >
                <DoodleSparkle className="w-4 h-4 text-gray-950" />
                TRY THIS →
              </Link>

              <button
                type="button"
                onClick={() => handleCopy(item.id, item.corporate)}
                className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-950 border border-gray-300 flex items-center gap-1"
              >
                {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === item.id ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
          );
        })}
      </div>
      </div>
    </section>
  );
}
