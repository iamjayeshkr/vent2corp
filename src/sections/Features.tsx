"use client";

import { UserCheck, Shield, Users, HeartHandshake, Code, Briefcase, MessageSquare, Mail, Send, Globe } from "lucide-react";

const USE_CASES = [
  {
    title: "Managers",
    desc: "Say something difficult without making it awkward or demotivating team members.",
    icon: UserCheck,
  },
  {
    title: "Clients",
    desc: "Push back on unvetted requirement scope without sounding defensive or confrontational.",
    icon: Shield,
  },
  {
    title: "Coworkers",
    desc: "Ask someone to fix something broken or missing without starting a Slack flame war.",
    icon: Users,
  },
  {
    title: "HR Team",
    desc: "Communicate appraisal, leave, or policy concerns clearly without overexplaining.",
    icon: HeartHandshake,
  },
  {
    title: "Developers",
    desc: "Turn technical frustration about buggy APIs and shifting deadlines into clear engineering status updates.",
    icon: Code,
  },
  {
    title: "Founders",
    desc: "Say no to low-priority requests without writing a 400-word defensive email.",
    icon: Briefcase,
  },
];

const PLATFORMS = [
  {
    name: "WhatsApp",
    badge: "short, natural, human",
    icon: Send,
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  },
  {
    name: "Slack",
    badge: "clear and to the point",
    icon: MessageSquare,
    color: "bg-purple-500/10 text-purple-600 border-purple-500/30",
  },
  {
    name: "Microsoft Teams",
    badge: "structured & professional",
    icon: Users,
    color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/30",
  },
  {
    name: "Email",
    badge: "formal without sounding robotic",
    icon: Mail,
    color: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  },
  {
    name: "LinkedIn",
    badge: "network appropriate & polished",
    icon: Globe,
    color: "bg-sky-500/10 text-sky-600 border-sky-500/30",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 select-none">
      {/* Section 6: Use-Cases */}
      <div className="space-y-8">
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Real Work Scenarios
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-handwritten text-foreground tracking-wide">
            built for the way people actually work.
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-sans">
            Whether you&apos;re negotiating deadlines, pushing back on scope, or requesting clarity—vent2corp handles every angle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {USE_CASES.map((uc) => {
            const Icon = uc.icon;
            return (
              <div
                key={uc.title}
                className="p-6 rounded-3xl bg-white dark:bg-[#141923] border border-border/80 shadow-md space-y-3 hover:shadow-xl transition-all"
              >
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold font-sans text-foreground">{uc.title}</h3>
                <p className="text-xs text-muted-foreground font-sans leading-relaxed">{uc.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 7: Platform Cards */}
      <div className="space-y-8 pt-6">
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Multi-Platform Ready
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-sans text-foreground">
            works wherever work happens.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {PLATFORMS.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.name}
                className="p-5 rounded-3xl bg-white dark:bg-[#141923] border border-border/80 shadow-sm space-y-3 text-center flex flex-col items-center justify-between"
              >
                <div className={`w-10 h-10 rounded-2xl ${p.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold font-sans text-foreground">{p.name}</h4>
                <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-0.5 rounded-full bg-muted/30 border border-border/60">
                  {p.badge}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
