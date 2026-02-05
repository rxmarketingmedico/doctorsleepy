import Lottie from "lottie-react";
import { cn } from "@/lib/utils";

// Avatar animado simples usando formas básicas
// Em produção, substituir por arquivo Lottie real
const sleepyAvatarAnimation = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 90,
  w: 200,
  h: 200,
  nm: "Sleepy Avatar",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Face",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [100, 100, 100] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 45, s: [102, 102, 100] },
            { t: 90, s: [100, 100, 100] }
          ]
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "el",
          s: { a: 0, k: [120, 120] },
          p: { a: 0, k: [0, 0] },
          nm: "Head",
          d: 1
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.96, 0.87, 0.7, 1] },
          o: { a: 0, k: 100 },
          r: 1,
          bm: 0,
          nm: "Fill"
        }
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Left Eye",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [75, 90, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [100, 100, 100] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 20, s: [100, 10, 100] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 25, s: [100, 100, 100] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 70, s: [100, 100, 100] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 75, s: [100, 10, 100] },
            { t: 80, s: [100, 100, 100] }
          ]
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "el",
          s: { a: 0, k: [12, 12] },
          p: { a: 0, k: [0, 0] },
          nm: "Eye",
          d: 1
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.2, 0.2, 0.3, 1] },
          o: { a: 0, k: 100 },
          r: 1,
          bm: 0,
          nm: "Fill"
        }
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0
    },
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: "Right Eye",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [125, 90, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [100, 100, 100] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 20, s: [100, 10, 100] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 25, s: [100, 100, 100] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 70, s: [100, 100, 100] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 75, s: [100, 10, 100] },
            { t: 80, s: [100, 100, 100] }
          ]
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "el",
          s: { a: 0, k: [12, 12] },
          p: { a: 0, k: [0, 0] },
          nm: "Eye",
          d: 1
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.2, 0.2, 0.3, 1] },
          o: { a: 0, k: 100 },
          r: 1,
          bm: 0,
          nm: "Fill"
        }
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0
    },
    {
      ddd: 0,
      ind: 4,
      ty: 4,
      nm: "Smile",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [100, 115, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "rc",
          d: 1,
          s: { a: 0, k: [30, 8] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 4 },
          nm: "Smile"
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.85, 0.5, 0.5, 1] },
          o: { a: 0, k: 100 },
          r: 1,
          bm: 0,
          nm: "Fill"
        }
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0
    },
    {
      ddd: 0,
      ind: 5,
      ty: 4,
      nm: "Sleep Cap",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [-5] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 45, s: [5] },
            { t: 90, s: [-5] }
          ]
        },
        p: { a: 0, k: [100, 45, 0] },
        a: { a: 0, k: [0, 20, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "sr",
          sy: 1,
          d: 1,
          pt: { a: 0, k: 3 },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 0 },
          ir: { a: 0, k: 20 },
          or: { a: 0, k: 40 },
          is: { a: 0, k: 0 },
          os: { a: 0, k: 0 },
          ix: 1,
          nm: "Cap"
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.6, 0.7, 0.9, 1] },
          o: { a: 0, k: 100 },
          r: 1,
          bm: 0,
          nm: "Fill"
        }
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0
    }
  ],
  markers: []
};

interface AvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  state?: "idle" | "thinking" | "speaking" | "listening";
}

const sizeMap = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
  xl: "w-48 h-48",
};

export function Avatar({ size = "md", className, state = "idle" }: AvatarProps) {
  return (
    <div 
      className={cn(
        "avatar-container",
        sizeMap[size],
        state === "thinking" && "animate-pulse-soft",
        state === "speaking" && "animate-breathe",
        className
      )}
    >
      <Lottie
        animationData={sleepyAvatarAnimation}
        loop={true}
        autoplay={true}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
