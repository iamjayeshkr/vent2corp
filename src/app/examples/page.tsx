"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { GlobalSearchModal } from "@/components/GlobalSearchModal";
import { AuthModal, type AuthUser } from "@/components/AuthModal";
import { Search, Sparkles, Copy, Check, ArrowRight, Bookmark } from "lucide-react";
import { toggleFavorite, isFavorite } from "@/lib/storage";
import type { Tone, Recipient, Platform } from "@/types";

interface ExampleItem {
  id: string;
  category: string;
  raw: string;
  corporate: string;
  tone: string;
  recipient: string;
  platform: string;
}

const EXAMPLES_DATA: ExampleItem[] = [
  {
    id: "ex-1",
    category: "Manager",
    raw: "tera marad hun kya saale jab dekho tab bula leta hai kuch bhi hua jayesh yeh dekhna bc",
    corporate: "I've noticed frequent status interruptions throughout the day alongside daily requirement updates. Could we align on our core priorities and establish dedicated focus blocks so I can complete work efficiently?",
    tone: "Firm",
    recipient: "Manager",
    platform: "Slack",
  },
  {
    id: "ex-2",
    category: "Technical",
    raw: "API ka response 500 de raha hai aur frontend mein fallback handle nahi hai kal tak client ko demo dena hai",
    corporate: "The API is currently returning a 500 server response, and the frontend lacks fallback handling for this scenario. Resolving this will ensure a resilient user experience before our client demo tomorrow.",
    tone: "Firm",
    recipient: "Coworker",
    platform: "Email",
  },
  {
    id: "ex-3",
    category: "Client",
    raw: "bhai ye requirement roz change kyu ho rahi hai, client ko bolo thoda soch samjh ke bheje",
    corporate: "Could we please finalize the current scope before introducing further updates? Stabilizing the requirement specifications will ensure a more predictable delivery schedule.",
    tone: "Diplomatic",
    recipient: "Client",
    platform: "Email",
  },
  {
    id: "ex-4",
    category: "Workplace",
    raw: "mujhe ek hafte ki leave chahiye emergency hai par kaam rukna nahi chahiye",
    corporate: "I need to take emergency leave next week due to pressing personal matters. I have prepared handoff notes to ensure seamless task continuation while I am away.",
    tone: "Professional",
    recipient: "Manager",
    platform: "Slack",
  },
  {
    id: "ex-5",
    category: "HR",
    raw: "pichle saal bola tha appraisal hoga ab tak nahi hua, kitna wait karun?",
    corporate: "I wanted to follow up on our previous discussion regarding my compensation review. Could we schedule time to discuss my performance and growth trajectory for the coming term?",
    tone: "Polite",
    recipient: "HR",
    platform: "Email",
  },
  {
    id: "ex-6",
    category: "Angry",
    raw: "abe chutiya hai kya?? kuch bhi requiement bhej raha hai soch toh le ek baar",
    corporate: "I noticed the recent requirement updates seem a bit unvetted. Could we review and clarify the exact scope together before proceeding to ensure proper alignment?",
    tone: "Professional",
    recipient: "Manager",
    platform: "Slack",
  },
  {
    id: "ex-7",
    category: "Urgent",
    raw: "jaldi kar bhai client sar pe khada hai, aaj sham tak chahiye",
    corporate: "We need to expedite this deliverable to meet the client's end-of-day expectation. Let's align immediately on any blockers.",
    tone: "Firm",
    recipient: "Coworker",
    platform: "Microsoft Teams",
  },
];

const CATEGORIES = ["All", "Workplace", "Manager", "Client", "Coworker", "HR", "Technical", "Angry", "Urgent"];

export default function ExamplesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const filtered = EXAMPLES_DATA.filter((item) => {
    const matchesCat = selectedCategory === "All" || item.category === selectedCategory;
    const matchesQuery =
      item.raw.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.corporate.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTryThis = (raw: string) => {
    router.push(`/new?raw=${encodeURIComponent(raw)}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row antialiased select-none">
      <MobileNav user={currentUser} onOpenAuth={() => setAuthModalOpen(true)} />
      <div className="hidden lg:block">
        <Sidebar user={currentUser} onOpenAuth={() => setAuthModalOpen(true)} onOpenGlobalSearch={() => setGlobalSearchOpen(true)} />
      </div>

      <div className="flex-1 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <Header user={currentUser} onOpenAuth={() => setAuthModalOpen(true)} />

        {/* Page Header */}
        <div className="space-y-1">
          <h2 className="text-3xl font-bold font-handwritten text-foreground tracking-wide">
            see the transformation
          </h2>
          <p className="text-xs text-muted-foreground font-sans">
            real thoughts. real situations. much better delivery.
          </p>
        </div>

        {/* Search & Categories Bar */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#141923] border border-border/80 shadow-sm space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search examples by keyword, raw vent, or corporate output..."
              className="w-full h-11 pl-10 pr-4 rounded-2xl bg-muted/20 border border-border/80 text-xs font-sans font-medium text-foreground focus:outline-none focus:border-purple-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-purple-600 text-white font-semibold shadow-md shadow-purple-600/20"
                    : "bg-muted/30 text-muted-foreground hover:bg-muted/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Examples Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#141923] border border-border/80 shadow-md space-y-4 hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header Metadata */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300">
                    {item.category}
                  </span>
                  <div className="text-[11px] font-mono text-muted-foreground">
                    {item.tone} · {item.recipient} · {item.platform}
                  </div>
                </div>

                {/* Raw Input Box */}
                <div className="p-3.5 rounded-2xl bg-[#FFF5F7] dark:bg-[#1F1418] border border-pink-200/80 dark:border-pink-900/40 space-y-1">
                  <span className="text-[10px] font-bold text-pink-700 dark:text-pink-300 font-mono uppercase">
                    Raw Thought
                  </span>
                  <p className="text-xs font-sans font-medium text-foreground italic">
                    &ldquo;{item.raw}&rdquo;
                  </p>
                </div>

                {/* Corporate Output Box */}
                <div className="p-3.5 rounded-2xl bg-[#F0FDF4] dark:bg-[#102018] border border-emerald-300/80 dark:border-emerald-900/40 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 font-mono uppercase">
                    Corporate Output
                  </span>
                  <p className="text-xs font-sans font-medium text-foreground leading-relaxed">
                    {item.corporate}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => handleTryThis(item.raw)}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-purple-900/20 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  Try this
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.id, item.corporate)}
                    className="px-3 py-1.5 rounded-xl bg-muted/30 hover:bg-muted/60 text-xs font-medium text-foreground border border-border/80 flex items-center gap-1 transition-all"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === item.id ? "Copied" : "Copy"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      toggleFavorite({
                        id: item.id,
                        original: item.raw,
                        translated: item.corporate,
                        tone: item.tone.toLowerCase() as Tone,
                        recipient: item.recipient.toLowerCase() as Recipient,
                        platform: item.platform.toLowerCase() as Platform,
                        timestamp: Date.now(),
                      });
                      router.push("/favorites");
                    }}
                    className="p-1.5 rounded-xl bg-muted/30 hover:bg-muted/60 text-foreground border border-border/80 transition-all"
                  >
                    <Bookmark className={`w-4 h-4 ${isFavorite(item.raw) ? "fill-amber-400 text-amber-400" : ""}`} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <GlobalSearchModal open={globalSearchOpen} onOpenChange={setGlobalSearchOpen} />
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} onAuthSuccess={() => setAuthModalOpen(false)} />
    </div>
  );
}
