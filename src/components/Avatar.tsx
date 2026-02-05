import Lottie from "lottie-react";
import { cn } from "@/lib/utils";

// Avatar do Doutor Soneca - médico simpático com jaleco
const doctorAvatarAnimation = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 120,
  w: 200,
  h: 200,
  nm: "Doutor Soneca",
  ddd: 0,
  assets: [],
  layers: [
    // Corpo/Jaleco
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Body",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [100, 165, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "rc",
          d: 1,
          s: { a: 0, k: [80, 70] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 20 },
          nm: "Body"
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.95, 0.95, 0.98, 1] }, // Jaleco branco
          o: { a: 0, k: 100 },
          r: 1,
          bm: 0,
          nm: "Fill"
        }
      ],
      ip: 0,
      op: 120,
      st: 0,
      bm: 0
    },
    // Cabeça
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Head",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [0] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 30, s: [3] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 60, s: [0] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 90, s: [-3] },
            { t: 120, s: [0] }
          ]
        },
        p: { a: 0, k: [100, 85, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "el",
          s: { a: 0, k: [90, 90] },
          p: { a: 0, k: [0, 0] },
          nm: "Head",
          d: 1
        },
        {
          ty: "fl",
          c: { a: 0, k: [1, 0.87, 0.77, 1] }, // Tom de pele suave
          o: { a: 0, k: 100 },
          r: 1,
          bm: 0,
          nm: "Fill"
        }
      ],
      ip: 0,
      op: 120,
      st: 0,
      bm: 0
    },
    // Cabelo
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: "Hair",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [0] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 30, s: [3] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 60, s: [0] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 90, s: [-3] },
            { t: 120, s: [0] }
          ]
        },
        p: { a: 0, k: [100, 55, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "el",
          s: { a: 0, k: [70, 40] },
          p: { a: 0, k: [0, 0] },
          nm: "Hair",
          d: 1
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.35, 0.25, 0.2, 1] }, // Cabelo castanho
          o: { a: 0, k: 100 },
          r: 1,
          bm: 0,
          nm: "Fill"
        }
      ],
      ip: 0,
      op: 120,
      st: 0,
      bm: 0
    },
    // Olho esquerdo
    {
      ddd: 0,
      ind: 4,
      ty: 4,
      nm: "Left Eye",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [82, 82, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [100, 100, 100] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 55, s: [100, 100, 100] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 58, s: [100, 10, 100] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 62, s: [100, 100, 100] },
            { t: 120, s: [100, 100, 100] }
          ]
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "el",
          s: { a: 0, k: [10, 10] },
          p: { a: 0, k: [0, 0] },
          nm: "Eye",
          d: 1
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.2, 0.15, 0.1, 1] },
          o: { a: 0, k: 100 },
          r: 1,
          bm: 0,
          nm: "Fill"
        }
      ],
      ip: 0,
      op: 120,
      st: 0,
      bm: 0
    },
    // Olho direito
    {
      ddd: 0,
      ind: 5,
      ty: 4,
      nm: "Right Eye",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [118, 82, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [100, 100, 100] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 55, s: [100, 100, 100] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 58, s: [100, 10, 100] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 62, s: [100, 100, 100] },
            { t: 120, s: [100, 100, 100] }
          ]
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "el",
          s: { a: 0, k: [10, 10] },
          p: { a: 0, k: [0, 0] },
          nm: "Eye",
          d: 1
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.2, 0.15, 0.1, 1] },
          o: { a: 0, k: 100 },
          r: 1,
          bm: 0,
          nm: "Fill"
        }
      ],
      ip: 0,
      op: 120,
      st: 0,
      bm: 0
    },
    // Sorriso
    {
      ddd: 0,
      ind: 6,
      ty: 4,
      nm: "Smile",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [100, 98, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [100, 100, 100] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 30, s: [110, 100, 100] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 60, s: [100, 100, 100] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 90, s: [110, 100, 100] },
            { t: 120, s: [100, 100, 100] }
          ]
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "rc",
          d: 1,
          s: { a: 0, k: [25, 8] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 4 },
          nm: "Smile"
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.9, 0.5, 0.5, 1] },
          o: { a: 0, k: 100 },
          r: 1,
          bm: 0,
          nm: "Fill"
        }
      ],
      ip: 0,
      op: 120,
      st: 0,
      bm: 0
    },
    // Estetoscópio
    {
      ddd: 0,
      ind: 7,
      ty: 4,
      nm: "Stethoscope",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [100, 145, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [100, 100, 100] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 60, s: [102, 102, 100] },
            { t: 120, s: [100, 100, 100] }
          ]
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "el",
          s: { a: 0, k: [18, 18] },
          p: { a: 0, k: [0, 0] },
          nm: "Stethoscope",
          d: 1
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.3, 0.6, 0.8, 1] }, // Azul médico
          o: { a: 0, k: 100 },
          r: 1,
          bm: 0,
          nm: "Fill"
        }
      ],
      ip: 0,
      op: 120,
      st: 0,
      bm: 0
    },
    // Bochechas rosadas
    {
      ddd: 0,
      ind: 8,
      ty: 4,
      nm: "Left Cheek",
      sr: 1,
      ks: {
        o: { a: 0, k: 40 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [72, 92, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "el",
          s: { a: 0, k: [12, 8] },
          p: { a: 0, k: [0, 0] },
          nm: "Cheek",
          d: 1
        },
        {
          ty: "fl",
          c: { a: 0, k: [1, 0.6, 0.6, 1] }, // Rosa
          o: { a: 0, k: 100 },
          r: 1,
          bm: 0,
          nm: "Fill"
        }
      ],
      ip: 0,
      op: 120,
      st: 0,
      bm: 0
    },
    {
      ddd: 0,
      ind: 9,
      ty: 4,
      nm: "Right Cheek",
      sr: 1,
      ks: {
        o: { a: 0, k: 40 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [128, 92, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "el",
          s: { a: 0, k: [12, 8] },
          p: { a: 0, k: [0, 0] },
          nm: "Cheek",
          d: 1
        },
        {
          ty: "fl",
          c: { a: 0, k: [1, 0.6, 0.6, 1] },
          o: { a: 0, k: 100 },
          r: 1,
          bm: 0,
          nm: "Fill"
        }
      ],
      ip: 0,
      op: 120,
      st: 0,
      bm: 0
    }
  ],
  markers: []
};

// Animação de pensando (pontos pulsando)
const thinkingAnimation = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  nm: "Thinking",
  ddd: 0,
  assets: [],
  layers: [
    // Mesmo avatar mas com olhos olhando para cima
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Body",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [100, 165, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "rc",
          d: 1,
          s: { a: 0, k: [80, 70] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 20 },
          nm: "Body"
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.95, 0.95, 0.98, 1] },
          o: { a: 0, k: 100 },
          r: 1,
          bm: 0,
          nm: "Fill"
        }
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Head",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [-5] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 30, s: [5] },
            { t: 60, s: [-5] }
          ]
        },
        p: { a: 0, k: [100, 85, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "el",
          s: { a: 0, k: [90, 90] },
          p: { a: 0, k: [0, 0] },
          nm: "Head",
          d: 1
        },
        {
          ty: "fl",
          c: { a: 0, k: [1, 0.87, 0.77, 1] },
          o: { a: 0, k: 100 },
          r: 1,
          bm: 0,
          nm: "Fill"
        }
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0
    },
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: "Hair",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [-5] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 30, s: [5] },
            { t: 60, s: [-5] }
          ]
        },
        p: { a: 0, k: [100, 55, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "el",
          s: { a: 0, k: [70, 40] },
          p: { a: 0, k: [0, 0] },
          nm: "Hair",
          d: 1
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.35, 0.25, 0.2, 1] },
          o: { a: 0, k: 100 },
          r: 1,
          bm: 0,
          nm: "Fill"
        }
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0
    },
    // Olhos olhando para cima
    {
      ddd: 0,
      ind: 4,
      ty: 4,
      nm: "Left Eye Up",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: {
          a: 1,
          k: [
            { i: { x: 0.667, y: 1 }, o: { x: 0.333, y: 0 }, t: 0, s: [82, 78, 0] },
            { i: { x: 0.667, y: 1 }, o: { x: 0.333, y: 0 }, t: 15, s: [82, 76, 0] },
            { i: { x: 0.667, y: 1 }, o: { x: 0.333, y: 0 }, t: 30, s: [82, 78, 0] },
            { i: { x: 0.667, y: 1 }, o: { x: 0.333, y: 0 }, t: 45, s: [82, 76, 0] },
            { t: 60, s: [82, 78, 0] }
          ]
        },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "el",
          s: { a: 0, k: [10, 10] },
          p: { a: 0, k: [0, 0] },
          nm: "Eye",
          d: 1
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.2, 0.15, 0.1, 1] },
          o: { a: 0, k: 100 },
          r: 1,
          bm: 0,
          nm: "Fill"
        }
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0
    },
    {
      ddd: 0,
      ind: 5,
      ty: 4,
      nm: "Right Eye Up",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: {
          a: 1,
          k: [
            { i: { x: 0.667, y: 1 }, o: { x: 0.333, y: 0 }, t: 0, s: [118, 78, 0] },
            { i: { x: 0.667, y: 1 }, o: { x: 0.333, y: 0 }, t: 15, s: [118, 76, 0] },
            { i: { x: 0.667, y: 1 }, o: { x: 0.333, y: 0 }, t: 30, s: [118, 78, 0] },
            { i: { x: 0.667, y: 1 }, o: { x: 0.333, y: 0 }, t: 45, s: [118, 76, 0] },
            { t: 60, s: [118, 78, 0] }
          ]
        },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "el",
          s: { a: 0, k: [10, 10] },
          p: { a: 0, k: [0, 0] },
          nm: "Eye",
          d: 1
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.2, 0.15, 0.1, 1] },
          o: { a: 0, k: 100 },
          r: 1,
          bm: 0,
          nm: "Fill"
        }
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0
    },
    // Boca pensativa
    {
      ddd: 0,
      ind: 6,
      ty: 4,
      nm: "Thinking Mouth",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [100, 98, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "el",
          s: { a: 0, k: [12, 12] },
          p: { a: 0, k: [0, 0] },
          nm: "Mouth",
          d: 1
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.9, 0.5, 0.5, 1] },
          o: { a: 0, k: 100 },
          r: 1,
          bm: 0,
          nm: "Fill"
        }
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0
    },
    // Estetoscópio
    {
      ddd: 0,
      ind: 7,
      ty: 4,
      nm: "Stethoscope",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [100, 145, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "el",
          s: { a: 0, k: [18, 18] },
          p: { a: 0, k: [0, 0] },
          nm: "Stethoscope",
          d: 1
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.3, 0.6, 0.8, 1] },
          o: { a: 0, k: 100 },
          r: 1,
          bm: 0,
          nm: "Fill"
        }
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0
    },
    // Bochechas
    {
      ddd: 0,
      ind: 8,
      ty: 4,
      nm: "Left Cheek",
      sr: 1,
      ks: {
        o: { a: 0, k: 40 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [72, 92, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "el",
          s: { a: 0, k: [12, 8] },
          p: { a: 0, k: [0, 0] },
          nm: "Cheek",
          d: 1
        },
        {
          ty: "fl",
          c: { a: 0, k: [1, 0.6, 0.6, 1] },
          o: { a: 0, k: 100 },
          r: 1,
          bm: 0,
          nm: "Fill"
        }
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0
    },
    {
      ddd: 0,
      ind: 9,
      ty: 4,
      nm: "Right Cheek",
      sr: 1,
      ks: {
        o: { a: 0, k: 40 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [128, 92, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "el",
          s: { a: 0, k: [12, 8] },
          p: { a: 0, k: [0, 0] },
          nm: "Cheek",
          d: 1
        },
        {
          ty: "fl",
          c: { a: 0, k: [1, 0.6, 0.6, 1] },
          o: { a: 0, k: 100 },
          r: 1,
          bm: 0,
          nm: "Fill"
        }
      ],
      ip: 0,
      op: 60,
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
  sm: "w-12 h-12",
  md: "w-20 h-20",
  lg: "w-28 h-28",
  xl: "w-40 h-40",
};

export function Avatar({ size = "md", className, state = "idle" }: AvatarProps) {
  const animation = state === "thinking" ? thinkingAnimation : doctorAvatarAnimation;
  
  return (
    <div 
      className={cn(
        "avatar-container rounded-full bg-gradient-to-br from-primary/10 to-secondary/20 p-1 shadow-lg",
        sizeMap[size],
        state === "speaking" && "animate-pulse ring-2 ring-primary/50",
        state === "listening" && "ring-2 ring-green-400/50",
        className
      )}
    >
      <div className="w-full h-full rounded-full bg-background overflow-hidden">
        <Lottie
          animationData={animation}
          loop={true}
          autoplay={true}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}
