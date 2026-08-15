import type { CSSProperties, ReactNode, SVGProps } from "react";

type DoodleProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  color?: string;
  rotation?: number;
  strokeWidth?: number;
};

const base = (props: DoodleProps, viewBox: string) => {
  const { size, color, rotation, strokeWidth = 3, style, ...rest } = props;
  return {
    ...rest,
    viewBox,
    fill: "none",
    stroke: color ?? "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    width: size,
    height: size,
    style: { ...style, transform: rotation === undefined ? style?.transform : `rotate(${rotation}deg)` } as CSSProperties,
  };
};

export function DoodleArrow(props: DoodleProps) {
  return <svg {...base(props, "0 0 64 38")}><path d="M4 21 C18 16 36 24 55 18 M47 9 C51 12 55 15 59 18 C55 21 51 25 47 29" /></svg>;
}
export const DoodleStraightArrow = DoodleArrow;

export function DoodleCurvedArrow(props: DoodleProps) {
  return <svg {...base(props, "0 0 58 58")}><path d="M8 10 C31 2 51 18 43 40 C41 45 36 48 31 49 M31 49 L40 40 M31 49 L43 51" /></svg>;
}

export function DoodleLoopArrow(props: DoodleProps) {
  return <svg {...base(props, "0 0 58 58")}><path d="M42 18 C47 6 28 3 17 12 C4 23 15 43 31 40 C43 38 45 27 39 23 C34 20 29 23 29 28 M29 28 L35 24 M29 28 L35 32" /></svg>;
}

export function DoodleDoubleArrow(props: DoodleProps) {
  return <svg {...base(props, "0 0 60 26")}><path d="M7 14 C22 10 37 16 53 12 M45 4 L54 12 L45 21 M16 5 L7 14 L17 22" /></svg>;
}

export function DoodleTinyArrow(props: DoodleProps) {
  return <svg {...base(props, "0 0 36 26")}><path d="M4 16 C13 13 20 14 29 11 M23 5 L31 10 L26 18" /></svg>;
}

export function DoodlePointingHand(props: DoodleProps) {
  return <svg {...base(props, "0 0 58 42")}><path d="M6 27 C12 24 17 23 22 24 L22 11 C22 8 26 8 27 11 L28 20 L30 8 C31 5 35 6 35 9 L35 20 L38 12 C40 10 43 12 42 15 L40 23 L49 20 C55 18 57 25 51 27 L40 32 C35 36 19 36 12 33 Z" /></svg>;
}

export function DoodleStar(props: DoodleProps) {
  return <svg {...base(props, "0 0 42 42")}><path d="M21 3 L25 15 L38 13 L29 22 L35 35 L22 29 L12 39 L13 26 L3 21 L15 17 Z" /></svg>;
}

export function DoodleSpark(props: DoodleProps) {
  return <svg {...base(props, "0 0 38 38")}><path d="M19 2 L22 15 L35 18 L23 22 L19 36 L16 23 L3 19 L15 16 Z" /></svg>;
}
export const DoodleSparkle = DoodleSpark;

export function DoodleBurst(props: DoodleProps) {
  return <svg {...base(props, "0 0 46 46")}><path d="M23 3 L25 14 M38 8 L32 17 M43 24 L32 23 M37 39 L29 31 M21 43 L21 32 M6 37 L15 29 M3 21 L14 20 M8 6 L16 15" /></svg>;
}

export function DoodleScribble(props: DoodleProps) {
  return <svg {...base(props, "0 0 74 28")}><path d="M4 16 C13 1 21 25 30 12 S46 4 52 15 S62 23 70 8" /><path d="M7 21 C19 13 24 23 35 19 S52 24 67 18" opacity=".7" /></svg>;
}

export function DoodleUnderline(props: DoodleProps) {
  return <svg {...base(props, "0 0 120 22")} preserveAspectRatio="none"><path d="M4 13 C25 8 40 16 62 12 S94 8 116 13" /><path d="M7 18 C33 15 52 20 78 16 S100 16 113 17" strokeWidth={(props.strokeWidth ?? 3) - .6} opacity=".65" /></svg>;
}

export function DoodleCircle(props: DoodleProps) {
  return <svg {...base(props, "0 0 54 54")}><path d="M28 4 C42 4 51 16 48 31 C45 46 25 51 12 42 C0 33 5 13 18 7 C22 5 25 5 28 4 Z" /></svg>;
}
export const DoodleRoughCircle = DoodleCircle;

export function DoodleRoughBox(props: DoodleProps) {
  return <svg {...base(props, "0 0 92 60")}><path d="M5 8 C25 4 59 6 86 5 L89 50 C61 55 28 52 7 55 Z" /><path d="M8 11 C31 8 59 10 83 9" strokeWidth={(props.strokeWidth ?? 3) - 1} opacity=".55" /></svg>;
}

export function DoodleLightning(props: DoodleProps) {
  return <svg {...base(props, "0 0 34 48")}><path d="M20 3 L5 25 L17 24 L13 44 L30 19 L19 20 Z" /></svg>;
}

export function DoodleCrown(props: DoodleProps) {
  return <svg {...base(props, "0 0 52 38")}><path d="M5 31 L3 10 L16 19 L25 5 L36 18 L48 9 L46 31 Z" /><path d="M8 35 C20 32 34 35 44 33" /></svg>;
}

export function DoodleHeart(props: DoodleProps) {
  return <svg {...base(props, "0 0 42 38")}><path d="M21 34 C15 27 4 22 4 12 C4 4 14 3 21 11 C28 2 39 5 38 13 C37 23 28 28 21 34 Z" /></svg>;
}

export function DoodleSmile(props: DoodleProps) {
  return <svg {...base(props, "0 0 46 46")}><path d="M24 4 C37 4 43 15 40 29 C37 42 16 44 7 32 C-1 19 8 5 24 4 Z" /><path d="M14 17 L15 18 M31 16 L32 17 M13 27 C18 34 29 34 34 26" /></svg>;
}

export function DoodleAngry(props: DoodleProps) {
  return <svg {...base(props, "0 0 46 46")}><path d="M23 4 C39 2 45 18 40 31 C35 43 15 43 6 30 C-2 16 8 5 23 4 Z" /><path d="M11 15 L19 19 M35 14 L27 19 M15 25 L16 26 M30 25 L31 26 M14 34 C18 28 27 28 32 34" /></svg>;
}
export const DoodleAngryFace = DoodleAngry;

export function DoodleConfused(props: DoodleProps) {
  return <svg {...base(props, "0 0 46 46")}><path d="M22 4 C37 2 44 16 41 29 C39 43 18 44 7 33 C-4 21 5 5 22 4 Z" /><path d="M12 16 C15 13 18 14 19 16 M28 15 C31 17 34 16 35 14 M14 29 C19 25 24 32 30 28" /><path d="M37 4 L42 1" /></svg>;
}

export function DoodleNervous(props: DoodleProps) {
  return <svg {...base(props, "0 0 46 46")}><path d="M22 4 C37 4 43 16 40 31 C36 43 17 44 7 32 C-3 19 6 4 22 4 Z" /><path d="M12 17 L17 17 M29 17 L34 17 M14 29 L31 29 M9 8 L6 5 M37 8 L41 5" /></svg>;
}

export function DoodleDeadpan(props: DoodleProps) {
  return <svg {...base(props, "0 0 46 46")}><path d="M23 4 C38 4 44 16 40 30 C37 43 17 43 7 32 C-3 20 5 5 23 4 Z" /><path d="M12 17 L17 17 M29 17 L34 17 M15 29 C20 28 26 29 31 29" /></svg>;
}

export function DoodleGhost(props: DoodleProps) {
  return <svg {...base(props, "0 0 48 54")}><path d="M24 4 C36 4 43 14 42 29 L42 47 L34 42 L28 48 L22 42 L15 48 L8 43 L7 29 C6 14 13 4 24 4 Z" /><path d="M17 23 L18 24 M30 23 L31 24 M17 32 C21 35 27 35 31 31" /><path d="M5 12 L1 9 M43 12 L47 9" /></svg>;
}

export function DoodleQuestion(props: DoodleProps) {
  return <svg {...base(props, "0 0 30 48")}><path d="M7 12 C7 1 25 2 24 13 C23 22 16 21 16 30 M16 40 L16 42" /></svg>;
}
export const DoodleQuestionMark = DoodleQuestion;

export function DoodleExclamation(props: DoodleProps) {
  return <svg {...base(props, "0 0 22 48")}><path d="M11 5 C10 15 12 23 10 31 M10 41 L10 42" /></svg>;
}

export function DoodleCheck(props: DoodleProps) {
  return <svg {...base(props, "0 0 38 32")}><path d="M4 16 L14 26 L33 5" /><path d="M5 20 L13 28" strokeWidth={(props.strokeWidth ?? 3) - 1} opacity=".5" /></svg>;
}
export const DoodleCheckMark = DoodleCheck;

export function DoodleCross(props: DoodleProps) {
  return <svg {...base(props, "0 0 34 34")}><path d="M5 5 C12 12 22 20 29 29 M29 4 C22 12 12 20 5 29" /></svg>;
}
export const DoodleHandCross = DoodleCross;

export function DoodleTape(props: DoodleProps) {
  const { color, ...rest } = props;
  return <svg {...base({ ...rest, color }, "0 0 90 26")} fill={color ?? "currentColor"} stroke="none"><path d="M3 4 L87 1 L84 23 L6 25 Z" opacity=".62" /><path d="M11 6 L79 4" stroke="white" strokeOpacity=".25" strokeWidth="1.5" /></svg>;
}

export function DoodleHighlight(props: DoodleProps) {
  const { color, ...rest } = props;
  return <svg {...base({ ...rest, color }, "0 0 120 28")} fill={color ?? "currentColor"} stroke="none" preserveAspectRatio="none"><path d="M3 7 C33 2 83 5 118 4 L115 23 C83 26 40 22 5 25 Z" opacity=".62" /></svg>;
}
export const DoodleHighlightStroke = DoodleHighlight;

export function DoodleRays(props: DoodleProps) {
  return <svg {...base(props, "0 0 56 56")}><path d="M28 3 L29 16 M47 9 L38 20 M53 29 L40 29 M46 47 L37 38 M27 53 L27 40 M9 47 L18 37 M3 28 L16 27 M9 9 L18 19" /></svg>;
}
export const DoodleTinyRays = DoodleRays;

export function DoodleSpiral(props: DoodleProps) {
  return <svg {...base(props, "0 0 50 50")}><path d="M42 27 C44 10 24 4 11 14 C-3 25 9 44 25 38 C38 34 35 18 24 18 C14 18 14 31 23 32 C30 33 31 25 27 23" /></svg>;
}

export function DoodleSpeechBubble(props: DoodleProps) {
  return <svg {...base(props, "0 0 74 54")}><path d="M8 8 C25 3 53 4 66 9 C72 18 67 35 59 40 C45 47 25 45 12 39 L6 48 L8 37 C2 28 3 15 8 8 Z" /></svg>;
}

export function DoodleChaos(props: DoodleProps) {
  return <svg {...base(props, "0 0 68 46")}><path d="M4 26 C11 4 24 42 34 17 S51 2 47 28 S61 40 64 8" /><path d="M8 39 L18 34 M38 40 L47 35 M57 24 L66 26" /></svg>;
}
export const DoodleChaoticScribble = DoodleChaos;

export function DoodleConnector(props: DoodleProps) {
  return <svg {...base(props, "0 0 86 48")}><path d="M4 31 C22 10 42 42 61 19 C68 11 75 13 81 15" /><path d="M73 8 L82 15 L72 22" /></svg>;
}

export function DoodleCorner(props: DoodleProps) {
  return <svg {...base(props, "0 0 46 46")}><path d="M5 38 C4 19 15 6 38 5 M12 40 L5 38 L7 30 M40 13 L38 5 L30 7" /></svg>;
}

export function DoodleWiggle(props: DoodleProps) {
  return <svg {...base(props, "0 0 64 22")}><path d="M3 12 C10 2 18 20 27 10 S42 1 49 11 S58 18 62 7" /></svg>;
}
export const DoodleSquiggle = DoodleWiggle;

export function DoodlePaperPin(props: DoodleProps) {
  return <svg {...base(props, "0 0 26 42")} fill="currentColor"><path d="M13 2 C20 2 23 9 19 14 L16 18 L17 36 L13 41 L10 36 L11 18 L7 14 C3 9 6 2 13 2 Z" stroke="none" /></svg>;
}

export function DoodleAnnotation({ children, className = "", color, rotation = -2, size = "1rem", style }: { children: ReactNode; className?: string; color?: string; rotation?: number; size?: number | string; style?: CSSProperties }) {
  return <span className={`font-handwritten inline-block leading-none ${className}`} style={{ color, fontSize: size, transform: `rotate(${rotation}deg)`, ...style }}>{children}</span>;
}

export function DoodleNote({ children, color = "yellow", rotation = -2, tape = false, className = "" }: { children: ReactNode; color?: "yellow" | "blue" | "pink" | "green"; rotation?: number; tape?: boolean; className?: string }) {
  const colors = { yellow: "bg-yellow-200 border-yellow-400", blue: "bg-blue-100 border-blue-300", pink: "bg-pink-100 border-pink-300", green: "bg-emerald-100 border-emerald-300" };
  return <div className={`relative border-2 px-4 py-3 shadow-md ${colors[color]} ${className}`} style={{ transform: `rotate(${rotation}deg)`, clipPath: "polygon(1% 3%, 98% 0, 100% 96%, 3% 100%)" }}>{tape && <DoodleTape className="absolute -top-3 left-1/2 h-5 w-16 -translate-x-1/2 text-blue-300" />}<div className="relative z-10">{children}</div></div>;
}
