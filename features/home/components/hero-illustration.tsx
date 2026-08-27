"use client";

import { motion } from "framer-motion";

export default function HeroIllustration() {
  const syncTransition = {
    duration: 2.8,
    ease: "easeInOut" as const,
    times: [0, 0.45, 0.85, 1], // Neutral -> Pulling -> Max Effort (Bounce) -> Settled
    repeat: Infinity,
    repeatType: "reverse" as const,
    repeatDelay: 0.8,
  };

  const houseSlide = {
    x: [0, -45, -92, -85],
  };

  const clipSlide = {
    x: [390, 345, 298, 305],
  };

  // Rope attaches from boy's changing hand position to the house
  const ropeWave = {
    d: [
      "M 148 258 Q 220 268 295 240", // Slack
      "M 135 254 Q 190 250 250 240", // Getting tight
      "M 128 255 Q 165 248 203 240", // Taut, max effort
      "M 131 254 Q 170 247 210 240", // Taut, settled
    ],
  };

  // Torso leaning back
  const torsoAnim = {
    d: [
      "M 130 227 L 130 260", 
      "M 122 232 L 130 260", 
      "M 112 239 L 130 260", 
      "M 115 237 L 130 260",
    ],
  };

  // Front leg bending and planting
  const frontLegAnim = {
    d: [
      "M 130 260 L 125 285 L 118 290",
      "M 130 260 L 132 275 L 122 290",
      "M 130 260 L 135 275 L 125 290",
      "M 130 260 L 134 275 L 124 290",
    ],
  };

  // Back leg pushing
  const backLegAnim = {
    d: [
      "M 130 260 L 115 285 L 107 290",
      "M 130 260 L 110 285 L 102 290",
      "M 130 260 L 100 285 L 92 290",
      "M 130 260 L 103 285 L 95 290",
    ],
  };

  // Arms flexing
  const armsAnim = {
    d: [
      "M 130 238 L 142 250 L 148 258", // Extended
      "M 122 240 L 130 250 L 135 254", // Pulling
      "M 112 245 L 120 258 L 128 255", // Max flex
      "M 115 243 L 123 256 L 131 254", // Settled flex
    ],
  };

  // Head moving back and rotating
  const headAnim = {
    x: [0, -8, -18, -15],
    y: [0, 5, 12, 10],
    rotate: [0, -15, -30, -25],
  };

  // Sweat effort marks opacity
  const sweatAnim = {
    opacity: [0, 0, 1, 1],
  };

  return (
    <div className="relative w-full max-w-[500px]">
      <svg
        viewBox="0 0 500 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full"
        aria-label="Illustration of a boy putting realistic effort into pulling a house, revealing the Locus logo"
        role="img"
      >
        <defs>
          <clipPath id="logo-reveal-mask">
            <motion.rect
              y="0"
              width="200"
              height="380"
              animate={clipSlide}
              transition={syncTransition}
            />
          </clipPath>
        </defs>

        {/* Background warm circle (sun) */}
        <circle
          cx="330"
          cy="140"
          r="110"
          fill="#f0e6d3"
          style={{
            animation: "locus-sun-pulse 6s ease-in-out infinite",
            transformOrigin: "330px 140px",
          }}
        />

        {/* Subtle ground line */}
        <path
          d="M 30 290 Q 250 280 470 290"
          stroke="#d4cdc2"
          strokeWidth="1"
          fill="none"
          strokeDasharray="4 4"
        />

        {/* Distant buildings (background) */}
        <g opacity="0.12" stroke="#8a8578" strokeWidth="0.8" fill="none">
          <rect x="60" y="200" width="22" height="90" rx="1" />
          <line x1="66" y1="215" x2="76" y2="215" />
          <line x1="66" y1="230" x2="76" y2="230" />
          <line x1="66" y1="245" x2="76" y2="245" />
          <line x1="66" y1="260" x2="76" y2="260" />
          
          <rect x="90" y="230" width="18" height="60" rx="1" />
          <line x1="95" y1="240" x2="103" y2="240" />
          <line x1="95" y1="255" x2="103" y2="255" />
          
          <rect x="430" y="190" width="20" height="100" rx="1" />
          <line x1="435" y1="205" x2="445" y2="205" />
          <line x1="435" y1="220" x2="445" y2="220" />
          <line x1="435" y1="235" x2="445" y2="235" />
          <line x1="435" y1="250" x2="445" y2="250" />
          
          <rect x="455" y="240" width="16" height="50" rx="1" />
        </g>

        {/* Clouds */}
        <g style={{ animation: "locus-cloud-drift 20s ease-in-out infinite alternate" }}>
          <ellipse cx="120" cy="80" rx="28" ry="10" fill="#e8e4de" opacity="0.5" />
          <ellipse cx="135" cy="76" rx="20" ry="8" fill="#e8e4de" opacity="0.4" />
        </g>
        <g style={{ animation: "locus-cloud-drift 25s ease-in-out infinite alternate-reverse" }}>
          <ellipse cx="420" cy="60" rx="24" ry="9" fill="#e8e4de" opacity="0.45" />
          <ellipse cx="435" cy="56" rx="18" ry="7" fill="#e8e4de" opacity="0.35" />
        </g>

        {/* ─── HIDDEN LOGO (Revealed as house moves left) ─── */}
        <g clipPath="url(#logo-reveal-mask)">
          <text
            x="325"
            y="266"
            fontFamily="serif"
            fontSize="38"
            fontWeight="bold"
            fill="#1e1b17"
            letterSpacing="-0.02em"
          >
            Locus
          </text>
        </g>

        {/* ─── HOUSE GROUP (Animates left with subtle bounce) ─── */}
        <motion.g
          animate={houseSlide}
          transition={syncTransition}
        >
          {/* House base */}
          <rect x="295" y="180" width="100" height="110" rx="2" stroke="#2c2c2c" strokeWidth="2" fill="white" fillOpacity="0.8" />
          {/* Roof */}
          <path d="M285 182 L345 120 L405 182" stroke="#2c2c2c" strokeWidth="2" fill="white" fillOpacity="0.8" strokeLinecap="round" strokeLinejoin="round" />
          {/* Roof detail lines */}
          <path d="M295 178 L345 126 L395 178" stroke="#2c2c2c" strokeWidth="0.5" fill="none" opacity="0.3" />
          {/* Chimney */}
          <rect x="365" y="135" width="14" height="30" stroke="#2c2c2c" strokeWidth="1.5" fill="white" fillOpacity="0.8" />
          <path d="M372 135 Q375 125 370 118 Q373 110 376 105" stroke="#c9a96e" strokeWidth="1" fill="none" opacity="0.5" strokeLinecap="round" />
          {/* Door */}
          <rect x="330" y="240" width="28" height="50" rx="14" stroke="#2c2c2c" strokeWidth="1.5" fill="white" fillOpacity="0.6" />
          <circle cx="351" cy="268" r="2" fill="#c9a96e" />
          {/* Windows */}
          <rect x="305" y="200" width="22" height="22" rx="1" stroke="#2c2c2c" strokeWidth="1.5" fill="white" fillOpacity="0.5" />
          <line x1="316" y1="200" x2="316" y2="222" stroke="#2c2c2c" strokeWidth="0.8" />
          <line x1="305" y1="211" x2="327" y2="211" stroke="#2c2c2c" strokeWidth="0.8" />
          
          <rect x="362" y="200" width="22" height="22" rx="1" stroke="#2c2c2c" strokeWidth="1.5" fill="white" fillOpacity="0.5" />
          <line x1="373" y1="200" x2="373" y2="222" stroke="#2c2c2c" strokeWidth="0.8" />
          <line x1="362" y1="211" x2="384" y2="211" stroke="#2c2c2c" strokeWidth="0.8" />
          
          <circle cx="345" cy="155" r="10" stroke="#2c2c2c" strokeWidth="1.5" fill="white" fillOpacity="0.5" />
          <line x1="345" y1="145" x2="345" y2="165" stroke="#2c2c2c" strokeWidth="0.5" />
          <line x1="335" y1="155" x2="355" y2="155" stroke="#2c2c2c" strokeWidth="0.5" />
          
          <line x1="290" y1="290" x2="400" y2="290" stroke="#2c2c2c" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
          <circle cx="295" cy="240" r="3" fill="#2c2c2c" opacity="0.5" />
        </motion.g>

        {/* ─── ROPE ─── */}
        <motion.path
          stroke="#2c2c2c"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
          animate={ropeWave}
          transition={syncTransition}
        />

        {/* ─── BOY FIGURE (Realistic effort mechanics) ─── */}
        <g>
          {/* Torso */}
          <motion.path stroke="#2c2c2c" strokeWidth="2" strokeLinecap="round" animate={torsoAnim} transition={syncTransition} />
          
          {/* Front Leg */}
          <motion.path stroke="#2c2c2c" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" animate={frontLegAnim} transition={syncTransition} />
          
          {/* Back Leg */}
          <motion.path stroke="#2c2c2c" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" animate={backLegAnim} transition={syncTransition} />
          
          {/* Arms (one path for simplicity, flexes during pull) */}
          <motion.path stroke="#2c2c2c" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" animate={armsAnim} transition={syncTransition} />

          {/* Head (Moves and rotates with torso) */}
          <motion.g
            style={{ transformOrigin: "130px 227px" }}
            animate={headAnim}
            transition={syncTransition}
          >
            <circle cx="130" cy="215" r="12" stroke="#2c2c2c" strokeWidth="2" fill="white" />
            <circle cx="126" cy="213" r="1.5" fill="#2c2c2c" />
            <circle cx="134" cy="213" r="1.5" fill="#2c2c2c" />
            <path d="M126 219 Q130 223 134 219" stroke="#2c2c2c" strokeWidth="1" fill="none" strokeLinecap="round" />
            
            {/* Sweat effort marks appearing on strain */}
            <motion.g animate={sweatAnim} transition={syncTransition}>
              <path d="M 116 205 Q 113 210 116 212 Q 119 210 116 205" fill="#c9a96e" opacity="0.8" />
              <path d="M 122 198 Q 119 203 122 205 Q 125 203 122 198" fill="#c9a96e" opacity="0.8" />
            </motion.g>
          </motion.g>

          {/* Feet (static anchors) */}
          <ellipse cx="107" cy="291" rx="5" ry="2" fill="#2c2c2c" opacity="0.5" />
          <ellipse cx="122" cy="291" rx="5" ry="2" fill="#2c2c2c" opacity="0.5" />
        </g>

        {/* Small decorative elements */}
        {/* Tiny house sketch in distance */}
        <g opacity="0.1" stroke="#8a8578" strokeWidth="0.8" fill="none">
          <rect x="30" y="268" width="15" height="22" />
          <path d="M27 268 L37.5 255 L48 268" />
        </g>

        {/* Subtle sparkle near title area */}
        <g opacity="0.15">
          <line x1="465" y1="95" x2="465" y2="105" stroke="#c9a96e" strokeWidth="1" />
          <line x1="460" y1="100" x2="470" y2="100" stroke="#c9a96e" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
}

