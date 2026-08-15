"use client";

import { Users, Send, MessageSquare, Mail, Globe } from "lucide-react";
import { DoodleAnnotation, DoodleArrow, DoodleCheckMark, DoodleWiggle } from "@/components/ui/Doodles";

const USE_CASES = [
  {
    title: "Manager",
    desc: "Say something difficult without making it awkward or demotivating team members.",
    bubble: "Can you just do one more thing?",
    rawCue: "one more thing?",
    deliveryCue: "priorities + workload",
    sideNote: "not a hostage situation.",
    sideEmoji: "😵‍💫",
  },
  {
    title: "Client",
    desc: "Push back on unvetted requirement scope without sounding defensive or confrontational.",
    bubble: "Can we get this today?",
    rawCue: "need it today",
    deliveryCue: "scope + timeline",
    sideNote: "calendar says: breathe.",
    sideEmoji: "⏰",
  },
  {
    title: "Coworker",
    desc: "Ask someone to fix something broken or missing without starting a war in Slack.",
    bubble: "Can you check this real quick?",
    rawCue: "fix this now",
    deliveryCue: "clear, calm ask",
    sideNote: "deep breaths, Slack.",
    sideEmoji: "🫠",
  },
  {
    title: "HR",
    desc: "Communicate appraisal, leave, or policy concerns clearly without overexplaining.",
    bubble: "We need to discuss something.",
    rawCue: "we need to talk",
    deliveryCue: "specific context",
    sideNote: "less mystery, please.",
    sideEmoji: "👀",
  },
  {
    title: "Developer",
    desc: "Turn technical frustration about buggy APIs and shifting specs into clean engineering updates.",
    bubble: "That API is doing WHAT?",
    rawCue: "API is broken",
    deliveryCue: "repro + impact",
    sideNote: "logs first. drama later.",
    sideEmoji: "🐛",
  },
  {
    title: "Founder",
    desc: "Say no to low-priority requests without writing a 400-word defensive email.",
    bubble: "We need this by EOD.",
    rawCue: "need it by EOD",
    deliveryCue: "trade-offs first",
    sideNote: "urgent ≠ important.",
    sideEmoji: "🚨",
  },
];

const PLATFORMS = [
  { name: "WhatsApp", desc: "short and natural", icon: Send },
  { name: "Slack", desc: "clear and direct", icon: MessageSquare },
  { name: "Microsoft Teams", desc: "structured without sounding robotic", icon: Users },
  { name: "Email", desc: "structured & formal", icon: Mail },
  { name: "LinkedIn", desc: "network appropriate & polished", icon: Globe },
];

export function UseCases() {
  const sceneColors = ["bg-[#eef5ff] border-blue-200", "bg-[#fff9dc] border-yellow-200", "bg-[#f4efff] border-violet-200", "bg-[#edfcf5] border-emerald-200", "bg-[#fff1f6] border-pink-200", "bg-[#fff7ed] border-orange-200"];
  return (
    <section id="features" className="space-y-28 bg-[#faf9f6] py-[clamp(7rem,12vw,13rem)] px-4 select-none sm:px-6 lg:px-10">
      {/* Section 6: BUILT FOR REAL WORK */}
      <div className="mx-auto max-w-[1360px] space-y-12 text-left">
        <div className="space-y-2">
          <div className="inline-block px-3 py-1 rounded-md bg-[#FACC15] text-gray-950 font-extrabold text-xs font-mono uppercase">
            REAL WORK.
          </div>
          <h2 className="text-5xl sm:text-7xl lg:text-8xl font-display text-gray-950 leading-none">
            BUILT FOR
            <br />
            THE PEOPLE
            <br />
            <span className="desktop-blue-note text-[#2563EB]">YOU WORK WITH.</span>
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-gray-700 font-sans">Whatever the situation, start with what you actually want to say.</p>
        </div>

        <div className="scenario-rail grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {USE_CASES.map((uc, index) => {
            return (
              <div
                key={uc.title}
                className="scenario-rail-card paper-object relative flex min-h-[20rem] flex-col border-2 border-gray-950 bg-white p-6 text-left rounded-3xl"
              >
                {/* Custom Scene Doodle Sticker */}
                <div className="px-2.5 py-1 rounded-lg bg-yellow-100 border border-yellow-300 text-[10px] font-bold font-mono text-yellow-900 inline-block">
                  {uc.bubble}
                </div>

                <div className={`scenario-doodle-scene relative my-5 grid h-32 grid-cols-[1fr_2.25rem_1fr] items-center gap-1 overflow-hidden rounded-2xl border p-3 ${sceneColors[index]}`}>
                  <div className="relative rounded-xl border border-pink-300 bg-[#fff5f7] px-2 py-2.5 shadow-sm">
                    <span className="block font-mono text-[8px] font-black uppercase tracking-wider text-pink-700">raw thought</span>
                    <span className="mt-1 block font-handwritten text-base font-bold leading-none text-gray-950">{uc.rawCue}</span>
                  </div>
                  <DoodleArrow className="h-7 w-9 text-[#2563EB]" rotation={index % 2 ? -5 : 5} strokeWidth={2.6} />
                  <div className="relative rounded-xl border border-emerald-300 bg-[#f0fdf4] px-2 py-2.5 shadow-sm">
                    <DoodleCheckMark className="absolute right-1.5 top-1.5 h-3.5 w-4 text-emerald-600" strokeWidth={2.5} />
                    <span className="block pr-4 font-mono text-[8px] font-black uppercase tracking-wider text-emerald-700">better delivery</span>
                    <span className="mt-1 block font-handwritten text-base font-bold leading-none text-gray-950">{uc.deliveryCue}</span>
                  </div>
                </div>

                <div className="-mt-2 mb-2 flex items-center justify-end gap-1.5 text-[#2563EB]">
                  <span className="rounded-full border border-yellow-300 bg-yellow-50 px-1.5 py-0.5 text-xs leading-none" aria-hidden="true">{uc.sideEmoji}</span>
                  <DoodleWiggle className="h-3 w-7" strokeWidth={2.2} />
                  <DoodleAnnotation rotation={index % 2 ? 2 : -2} size="0.82rem">{uc.sideNote}</DoodleAnnotation>
                </div>

                <h3 className="mt-auto text-xl font-black font-sans text-gray-950">{uc.title}</h3>
                <p className="text-xs text-gray-700 font-sans leading-relaxed">{uc.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 7: WHEREVER WORK HAPPENS */}
      <div className="mx-auto max-w-[1280px] space-y-10 border-t-2 border-gray-200 pt-16 text-left">
        <div className="space-y-2">
          <div className="inline-block px-3 py-1 rounded-md bg-[#FACC15] text-gray-950 font-extrabold text-xs font-mono uppercase">
            WHEREVER YOU HAVE TO TYPE
          </div>
          <h2 className="text-5xl sm:text-7xl lg:text-8xl font-display text-gray-950 leading-none">
            WHEREVER YOU
            <br />
            <span className="desktop-blue-note text-[#2563EB]">HAVE TO TYPE.</span>
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-gray-700 font-sans">Slack. WhatsApp. Email. Teams. LinkedIn. Basically anywhere you have to pretend you&apos;re calm.</p>
          <DoodleAnnotation className="text-pink-600" rotation={-3} size="1rem">we&apos;ve all been there.</DoodleAnnotation>
        </div>

        <div className="flex items-center gap-2 pt-1 text-[#2563EB]">
          <span className="font-handwritten text-lg font-bold text-pink-600">say it raw</span>
          <DoodleArrow className="h-6 w-10" strokeWidth={2.6} />
          <span className="flex items-center gap-1 font-handwritten text-lg font-bold text-emerald-700">
            send it right <DoodleCheckMark className="h-4 w-4" strokeWidth={2.5} />
          </span>
        </div>

        <div className="platform-rail relative mx-auto grid max-w-6xl grid-cols-1 gap-4 pt-2 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
          {PLATFORMS.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.name}
                className="platform-rail-card paper-object relative flex min-h-60 flex-col items-center border-2 border-gray-950 bg-white p-5 text-center rounded-2xl"
              >
                <div className="w-10 h-10 rounded-2xl bg-white border border-gray-300 flex items-center justify-center text-gray-950 shadow-2xs">
                  <Icon className="w-5 h-5 text-[#2563EB]" />
                </div>
                <h4 className="text-base font-black font-sans text-gray-950">{p.name}</h4>
                <span className="text-[11px] font-mono font-bold text-gray-600">{p.desc}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
