import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Volume2, VolumeX, Maximize2, Clock as ClockIcon, Sparkles } from 'lucide-react';

interface VintageWaterburyClockProps {
  isDark?: boolean;
  size?: number;
  className?: string;
  isZoomChild?: boolean;
}

// 12 Ornate Victorian calligraphic Arabic numerals matching the Waterbury Brocot clock dial
const ARABIC_NUMERALS = [
  { num: '12', angle: 0, fontSize: 32, dy: 0 },
  { num: '1', angle: 30, fontSize: 32, dy: 0 },
  { num: '2', angle: 60, fontSize: 32, dy: 0 },
  { num: '3', angle: 90, fontSize: 32, dy: 0 },
  { num: '4', angle: 120, fontSize: 32, dy: 1 },
  { num: '5', angle: 150, fontSize: 32, dy: 0 },
  { num: '6', angle: 180, fontSize: 32, dy: -2 },
  { num: '7', angle: 210, fontSize: 32, dy: 0 },
  { num: '8', angle: 240, fontSize: 32, dy: 0 },
  { num: '9', angle: 270, fontSize: 32, dy: 0 },
  { num: '10', angle: 300, fontSize: 31, dy: 0 },
  { num: '11', angle: 330, fontSize: 31, dy: 0 },
];

// Generate Brocot ratchet-toothed escape wheel path
function generateBrocotEscapeWheelPath(
  outerRadius: number,
  toothCount: number,
  toothDepth: number
): string {
  const points: string[] = [];
  const angleStep = (Math.PI * 2) / toothCount;
  const innerRadius = outerRadius - toothDepth;

  for (let i = 0; i < toothCount; i++) {
    const a0 = i * angleStep;
    const a1 = a0 + angleStep * 0.45;
    const a2 = a0 + angleStep * 0.82;
    const a3 = (i + 1) * angleStep;

    const p0x = innerRadius * Math.cos(a0);
    const p0y = innerRadius * Math.sin(a0);
    const p1x = (innerRadius + toothDepth * 0.4) * Math.cos(a1);
    const p1y = (innerRadius + toothDepth * 0.4) * Math.sin(a1);
    const p2x = outerRadius * Math.cos(a2);
    const p2y = outerRadius * Math.sin(a2);
    const p3x = innerRadius * Math.cos(a3);
    const p3y = innerRadius * Math.sin(a3);

    if (i === 0) {
      points.push(`M ${p0x.toFixed(2)} ${p0y.toFixed(2)}`);
    }
    points.push(`L ${p1x.toFixed(2)} ${p1y.toFixed(2)}`);
    points.push(`L ${p2x.toFixed(2)} ${p2y.toFixed(2)}`);
    points.push(`L ${p3x.toFixed(2)} ${p3y.toFixed(2)}`);
  }
  points.push('Z');
  return points.join(' ');
}

export const VintageWaterburyClock: React.FC<VintageWaterburyClockProps> = ({
  isDark = false,
  size = 275,
  className = '',
  isZoomChild = false,
}) => {
  const [time, setTime] = useState<Date>(new Date());
  const [tickSoundEnabled, setTickSoundEnabled] = useState<boolean>(false);
  const [tickMode, setTickMode] = useState<'mechanical' | 'smooth'>('mechanical');
  const [showDigitalBadge, setShowDigitalBadge] = useState<boolean>(false);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  // Real physical Brocot anchor pallet oscillation angle
  const [escapementAngle, setEscapementAngle] = useState<number>(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastSecondRef = useRef<number>(-1);
  const animFrameRef = useRef<number | null>(null);

  // Synthesize realistic Brocot deadbeat escapement tick-tock audio
  const playBrocotTick = (isTick: boolean) => {
    if (!tickSoundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Deadbeat pallet jewel impact sound
      filter.type = 'bandpass';
      filter.frequency.value = isTick ? 2400 : 1950;
      filter.Q.value = 10;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isTick ? 2100 : 1700, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.026);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.032);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch {
      // AudioContext policy
    }
  };

  // High-precision live mechanical escapement update loop
  useEffect(() => {
    let active = true;

    const updateLoop = () => {
      if (!active) return;
      const now = new Date();
      setTime(now);

      const sec = now.getSeconds();
      const ms = now.getMilliseconds();

      // Brocot deadbeat pallet physical oscillation (1.5 Hz natural clock cadence)
      const cycleMs = 1000;
      const phase = (ms % cycleMs) / cycleMs;
      // Sharp pallet drop and release motion
      const rockAngle = Math.sin(phase * Math.PI * 2) * 14.5;
      setEscapementAngle(rockAngle);

      // Sound on each second tick
      if (sec !== lastSecondRef.current) {
        lastSecondRef.current = sec;
        playBrocotTick(sec % 2 === 0);
      }

      animFrameRef.current = requestAnimationFrame(updateLoop);
    };

    animFrameRef.current = requestAnimationFrame(updateLoop);

    return () => {
      active = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [tickSoundEnabled]);

  // Compute live hand angles
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const milliseconds = time.getMilliseconds();

  const secondFrac = tickMode === 'smooth' ? seconds + milliseconds / 1000 : seconds;
  const minuteFrac = minutes + secondFrac / 60;
  const hourFrac = (hours % 12) + minuteFrac / 60;

  const hourDegrees = hourFrac * 30; // 360 / 12 = 30 deg/hr
  const minuteDegrees = minuteFrac * 6; // 360 / 60 = 6 deg/min
  const secondDegrees = secondFrac * 6; // 360 / 60 = 6 deg/sec

  // Escape wheel live rotation angle (moves with seconds)
  const escapeWheelDegrees = (secondFrac * 24) % 360; // Smooth steady mechanical rotation

  // Digital time strings
  const pad = (n: number) => n.toString().padStart(2, '0');
  const displayHours12 = (hours % 12 || 12).toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const digitalTimeStr = `${displayHours12}:${pad(minutes)}:${pad(seconds)} ${ampm}`;
  const dateStr = time.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  // Center coordinate (200, 200)
  const CX = 200;
  const CY = 200;

  // 60-Minute Railroad Track Ticks
  const railroadTicks = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => {
      const angle = i * 6;
      const isFiveMinute = i % 5 === 0;
      return {
        angle,
        isFiveMinute,
        r1: isFiveMinute ? 170 : 173,
        r2: 181,
      };
    });
  }, []);

  // Perimeter coin-edge knurling teeth (120 fine knurls around outer bezel)
  const coinEdgeKnurls = useMemo(() => {
    return Array.from({ length: 120 }, (_, i) => {
      const angle = (i * 360) / 120;
      const rad = (angle * Math.PI) / 180;
      return {
        x1: CX + 194 * Math.cos(rad),
        y1: CY + 194 * Math.sin(rad),
        x2: CX + 198.5 * Math.cos(rad),
        y2: CY + 198.5 * Math.sin(rad),
      };
    });
  }, []);

  // Brocot Escape Wheel 15-tooth path
  const escapeWheelPath = useMemo(() => {
    return generateBrocotEscapeWheelPath(25, 15, 6.5);
  }, []);

  return (
    <div
      className={`relative select-none flex flex-col items-center group transition-all duration-300 ${className}`}
      style={{ width: '100%', maxWidth: `${size}px`, aspectRatio: '1 / 1' }}
    >
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full cursor-pointer"
        onClick={() => !isZoomChild && setIsZoomed(true)}
        style={{
          filter: isDark
            ? 'drop-shadow(0 18px 36px rgba(0,0,0,0.95)) drop-shadow(0 4px 10px rgba(0,0,0,0.85))'
            : 'drop-shadow(0 18px 36px rgba(135,145,160,0.45)) drop-shadow(0 4px 10px rgba(135,145,160,0.25))',
        }}
      >
        <defs>
          {/* ================================================================= */}
          {/* METALLIC BRASS, CAST STEEL & PORCELAIN ENAMEL GRADIENTS           */}
          {/* ================================================================= */}
          {/* Outer Coin-Edge Metal Bezel */}
          <radialGradient id="bezelOuterRing" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor={isDark ? '#5e503b' : '#dfc491'} />
            <stop offset="30%" stopColor={isDark ? '#382f22' : '#a3844f'} />
            <stop offset="65%" stopColor={isDark ? '#6e5d44' : '#fae4b0'} />
            <stop offset="85%" stopColor={isDark ? '#2e261b' : '#7d6436'} />
            <stop offset="100%" stopColor={isDark ? '#19150e' : '#47391f'} />
          </radialGradient>

          {/* Stepped Inner Bezel Lip */}
          <linearGradient id="brassBezelRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#826d4a' : '#fff4d4'} />
            <stop offset="25%" stopColor={isDark ? '#473a26' : '#c9a665'} />
            <stop offset="50%" stopColor={isDark ? '#9c8359' : '#ffe19c'} />
            <stop offset="75%" stopColor={isDark ? '#3d311f' : '#8f723e'} />
            <stop offset="100%" stopColor={isDark ? '#6b5839' : '#dbae68'} />
          </linearGradient>

          {/* Porcelain Enamel Cream Dial Face */}
          <radialGradient id="porcelainDial" cx="48%" cy="45%" r="58%">
            <stop offset="0%" stopColor={isDark ? '#1f2229' : '#fcfbf7'} />
            <stop offset="65%" stopColor={isDark ? '#181a20' : '#f5f2e8'} />
            <stop offset="90%" stopColor={isDark ? '#13141a' : '#ede8dc'} />
            <stop offset="100%" stopColor={isDark ? '#0c0d10' : '#ded7c8'} />
          </radialGradient>

          {/* Recessed Center Aperture Enamel Face */}
          <radialGradient id="innerPorcelainCavity" cx="50%" cy="46%" r="54%">
            <stop offset="0%" stopColor={isDark ? '#1c1f26' : '#f7f4ec'} />
            <stop offset="75%" stopColor={isDark ? '#14161c' : '#ede7dc'} />
            <stop offset="100%" stopColor={isDark ? '#0a0b0e' : '#d6cbbd'} />
          </radialGradient>

          {/* Antique Gilded Brass Escapement Bridge */}
          <linearGradient id="brocotBridgeBrass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#a88c58' : '#fff3d1'} />
            <stop offset="20%" stopColor={isDark ? '#6b5733' : '#d6b36e'} />
            <stop offset="55%" stopColor={isDark ? '#9c814e' : '#fae4ab'} />
            <stop offset="80%" stopColor={isDark ? '#4d3d21' : '#94753c'} />
            <stop offset="100%" stopColor={isDark ? '#7a643b' : '#cfa761'} />
          </linearGradient>

          {/* Polished Steel Escapement Wheel & Pallets */}
          <linearGradient id="polishedSteel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f0f2f7" />
            <stop offset="35%" stopColor="#b0b7c4" />
            <stop offset="65%" stopColor="#e1e5ee" />
            <stop offset="100%" stopColor="#6e7582" />
          </linearGradient>

          {/* Ruby Pallet Jewels */}
          <radialGradient id="rubyJewel" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ff7b89" />
            <stop offset="45%" stopColor="#e6193c" />
            <stop offset="85%" stopColor="#870a1e" />
            <stop offset="100%" stopColor="#4a040e" />
          </radialGradient>

          {/* Winding Holes Deep Shadow */}
          <radialGradient id="windingArborHole" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#2e2b26" />
            <stop offset="60%" stopColor="#141311" />
            <stop offset="100%" stopColor="#050504" />
          </radialGradient>

          {/* Blued-Black Steel Hands */}
          <linearGradient id="waterburyHandSteel" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#08090b" />
            <stop offset="45%" stopColor="#1c1f26" />
            <stop offset="65%" stopColor="#2e3440" />
            <stop offset="100%" stopColor="#07080a" />
          </linearGradient>

          {/* Drop Shadows */}
          <filter id="brocotDropShadow" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="1.5" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity={isDark ? '0.9' : '0.45'} />
          </filter>

          <filter id="handDropShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="2" dy="3.5" stdDeviation="2.5" floodColor="#000000" floodOpacity={isDark ? '0.95' : '0.4'} />
          </filter>

          <filter id="secondHandDropShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="1.5" dy="2.5" stdDeviation="1.8" floodColor="#000000" floodOpacity={isDark ? '0.95' : '0.4'} />
          </filter>

          {/* Curved path for the bottom trademark: "MANUFACTURED BY WATERBURY CLOCK CO. U.S.A." */}
          <path
            id="waterburyTrademarkPath"
            d="M 104 366 A 176 176 0 0 0 296 366"
            fill="none"
          />
        </defs>

        {/* ================================================================= */}
        {/* 1. OUTER COIN-EDGE KNURLED BRASS/STEEL BEZEL                      */}
        {/* ================================================================= */}
        {/* Outermost Bezel Base */}
        <circle cx={CX} cy={CY} r="198" fill="url(#bezelOuterRing)" stroke={isDark ? '#262016' : '#574626'} strokeWidth="1.5" />

        {/* 120 Fine Knurled Teeth along outer coin edge */}
        <g opacity="0.85">
          {coinEdgeKnurls.map((k, idx) => (
            <line
              key={`knurl-${idx}`}
              x1={k.x1}
              y1={k.y1}
              x2={k.x2}
              y2={k.y2}
              stroke={isDark ? '#1c170f' : '#6b5731'}
              strokeWidth="1.3"
            />
          ))}
        </g>

        {/* Outer step ring */}
        <circle cx={CX} cy={CY} r="193" fill="none" stroke="url(#brassBezelRim)" strokeWidth="2" />
        <circle cx={CX} cy={CY} r="190" fill={isDark ? '#121419' : '#7d705c'} />
        <circle cx={CX} cy={CY} r="188" fill={isDark ? '#08090c' : '#c7bca9'} />

        {/* ================================================================= */}
        {/* 2. PORCELAIN ENAMEL DIAL FACE                                     */}
        {/* ================================================================= */}
        <circle cx={CX} cy={CY} r="186" fill="url(#porcelainDial)" />

        {/* ================================================================= */}
        {/* 3. TOP REGULATION HOLE WITH S | F INDICATOR (12 O'CLOCK)          */}
        {/* ================================================================= */}
        <g id="regulatorPort">
          {/* Dark regulation square arbor hole */}
          <circle cx={CX} cy={16.5} r="7.5" fill="url(#windingArborHole)" stroke="url(#brassBezelRim)" strokeWidth="1.2" />
          <rect x={CX - 2.2} y={14.3} width="4.4" height="4.4" fill={isDark ? '#a8946e' : '#4d412e'} rx="0.5" />

          {/* S | F Markings */}
          <text
            x={CX - 15}
            y={28}
            textAnchor="middle"
            fill={isDark ? '#cbd5e1' : '#222326'}
            fontFamily="'Times New Roman', Times, serif"
            fontWeight="900"
            fontSize="7"
          >
            S
          </text>
          <line x1={CX} y1={23} x2={CX} y2={30} stroke={isDark ? '#94a3b8' : '#474542'} strokeWidth="0.8" />
          <text
            x={CX + 15}
            y={28}
            textAnchor="middle"
            fill={isDark ? '#cbd5e1' : '#222326'}
            fontFamily="'Times New Roman', Times, serif"
            fontWeight="900"
            fontSize="7"
          >
            F
          </text>
        </g>

        {/* ================================================================= */}
        {/* 4. RAILROAD MINUTE TRACK & 60 MINUTE TICKS                        */}
        {/* ================================================================= */}
        <g id="railroadTrack" opacity={isDark ? '0.9' : '0.98'}>
          {/* Outer and inner concentric boundary circles */}
          <circle cx={CX} cy={CY} r="181" fill="none" stroke={isDark ? '#6e798e' : '#1a1917'} strokeWidth="1.1" />
          <circle cx={CX} cy={CY} r="170" fill="none" stroke={isDark ? '#51596b' : '#302f2d'} strokeWidth="0.8" />

          {/* 60 Minute divisions (ladder bars) */}
          {railroadTicks.map((t, idx) => {
            const rad = ((t.angle - 90) * Math.PI) / 180;
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);
            return (
              <line
                key={`rtick-${idx}`}
                x1={CX + t.r1 * cos}
                y1={CY + t.r1 * sin}
                x2={CX + t.r2 * cos}
                y2={CY + t.r2 * sin}
                stroke={isDark ? (t.isFiveMinute ? '#cbd5e1' : '#7b879c') : (t.isFiveMinute ? '#080808' : '#383633')}
                strokeWidth={t.isFiveMinute ? 2.2 : 0.85}
              />
            );
          })}
        </g>

        {/* ================================================================= */}
        {/* 5. VINTAGE CALLIGRAPHIC ARABIC NUMERALS (1 - 12)                  */}
        {/* ================================================================= */}
        <g id="arabicNumerals">
          {ARABIC_NUMERALS.map((item, idx) => {
            const rad = ((item.angle - 90) * Math.PI) / 180;
            // Radius ~143 for optimal placement between railroad track and inner bezel
            const radiusPos = 143;
            const x = CX + radiusPos * Math.cos(rad);
            const y = CY + radiusPos * Math.sin(rad) + item.dy;

            return (
              <text
                key={`numeral-${idx}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isDark ? '#e6edf7' : '#0d0d0f'}
                fontFamily="'Playfair Display', 'Baskerville', 'Times New Roman', serif"
                fontWeight="900"
                fontSize={item.fontSize}
                letterSpacing="0.01em"
                style={{ fontFeatureSettings: '"kern" 1' }}
              >
                {item.num}
              </text>
            );
          })}
        </g>

        {/* ================================================================= */}
        {/* 6. BOTTOM TRADEMARK INSCRIBED ALONG LOWER ARC                     */}
        {/* ================================================================= */}
        <text
          fill={isDark ? '#94a3b8' : '#383531'}
          fontFamily="'Times New Roman', Times, serif"
          fontWeight="900"
          fontSize="5.2"
          letterSpacing="0.22em"
          opacity={isDark ? '0.85' : '0.9'}
        >
          <textPath href="#waterburyTrademarkPath" startOffset="50%" textAnchor="middle">
            MANUFACTURED BY WATERBURY CLOCK CO. U.S.A.
          </textPath>
        </text>

        {/* ================================================================= */}
        {/* 7. INNER BRASS BEZEL APERTURE (EXPOSED BROCOT SKELETON OPENING)   */}
        {/* ================================================================= */}
        {/* Heavy Polished Stepped Brass Bezel Ring around aperture */}
        <circle cx={CX} cy={CY} r="105" fill="none" stroke="url(#brassBezelRim)" strokeWidth="3" />
        <circle cx={CX} cy={CY} r="103" fill="none" stroke={isDark ? '#141008' : '#574624'} strokeWidth="1.2" />
        <circle cx={CX} cy={CY} r="101" fill="none" stroke="url(#bezelOuterRing)" strokeWidth="2.2" />
        <circle cx={CX} cy={CY} r="98" fill={isDark ? '#06070a' : '#544633'} />

        {/* Recessed Porcelain Inner Cavity */}
        <circle cx={CX} cy={CY} r="96" fill="url(#innerPorcelainCavity)" />
        <circle cx={CX} cy={CY} r="96" fill="none" stroke={isDark ? 'rgba(0,0,0,0.8)' : 'rgba(70,55,30,0.3)'} strokeWidth="1" />

        {/* ================================================================= */}
        {/* 8. TWO DUAL WINDING ARBORS (AT ~4:30 AND ~7:30 POSITIONS)         */}
        {/* ================================================================= */}
        {/* Left Winding Arbor (Time Train) */}
        <g id="windingArborLeft" transform="translate(138, 235)">
          <circle cx="0" cy="0" r="13" fill="url(#brassBezelRim)" stroke={isDark ? '#2b2110' : '#6b5428'} strokeWidth="1" filter="url(#brocotDropShadow)" />
          <circle cx="0" cy="0" r="9.5" fill="url(#windingArborHole)" stroke="#110f0b" strokeWidth="0.8" />
          {/* Steel Winding Square Pin */}
          <rect x="-3" y="-3" width="6" height="6" fill="url(#polishedSteel)" stroke="#1a1814" strokeWidth="0.6" rx="0.5" />
          <circle cx="0" cy="0" r="1.5" fill="#141310" />
        </g>

        {/* Right Winding Arbor (Strike Train) */}
        <g id="windingArborRight" transform="translate(262, 235)">
          <circle cx="0" cy="0" r="13" fill="url(#brassBezelRim)" stroke={isDark ? '#2b2110' : '#6b5428'} strokeWidth="1" filter="url(#brocotDropShadow)" />
          <circle cx="0" cy="0" r="9.5" fill="url(#windingArborHole)" stroke="#110f0b" strokeWidth="0.8" />
          {/* Steel Winding Square Pin */}
          <rect x="-3" y="-3" width="6" height="6" fill="url(#polishedSteel)" stroke="#1a1814" strokeWidth="0.6" rx="0.5" />
          <circle cx="0" cy="0" r="1.5" fill="#141310" />
        </g>

        {/* ================================================================= */}
        {/* 9. LIVE BROCOT ESCAPEMENT MECHANISM (DEADBEAT JEWELED ESCAPEMENT) */}
        {/* ================================================================= */}
        <g id="brocotEscapement" filter="url(#brocotDropShadow)">
          {/* 9.1 Rotating Brocot Escape Wheel (Centered at cx: 200, cy: 146) */}
          <g transform={`translate(200, 146) rotate(${escapeWheelDegrees})`}>
            {/* 15-Tooth Ratchet Escape Wheel */}
            <path d={escapeWheelPath} fill="url(#polishedSteel)" stroke="#38404d" strokeWidth="0.7" />
            {/* Inner Lightening Spoke Cutouts */}
            <circle cx="0" cy="0" r="15" fill="url(#innerPorcelainCavity)" stroke="#667285" strokeWidth="0.8" />
            {[0, 90, 180, 270].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <line
                  key={`spoke-esc-${deg}`}
                  x1={0}
                  y1={0}
                  x2={14.5 * Math.cos(rad)}
                  y2={14.5 * Math.sin(rad)}
                  stroke="url(#polishedSteel)"
                  strokeWidth="1.8"
                />
              );
            })}
            <circle cx="0" cy="0" r="5" fill="url(#brocotBridgeBrass)" stroke="#3b2b0f" strokeWidth="0.7" />
            <circle cx="0" cy="0" r="1.8" fill="#1c160b" />
          </g>

          {/* 9.2 The Ornate Carved Brass Waterbury Escapement Bridge / Cock */}
          <g id="brocotBridge">
            {/* Winged arched bracket spanning horizontally with carved acanthus scrollwork */}
            <path
              d="M 148 184 C 158 174, 172 178, 185 162 C 190 152, 194 138, 200 134 C 206 138, 210 152, 215 162 C 228 178, 242 174, 252 184 C 244 192, 230 186, 218 190 C 208 194, 192 194, 182 190 C 170 186, 156 192, 148 184 Z"
              fill="url(#brocotBridgeBrass)"
              stroke={isDark ? '#3d2e13' : '#735724'}
              strokeWidth="1.2"
            />

            {/* Pierced / Engraved Scrollwork Details on Bridge Body */}
            <path
              d="M 166 182 Q 182 176 192 166"
              fill="none"
              stroke={isDark ? '#2e230f' : '#6b5120'}
              strokeWidth="1"
            />
            <path
              d="M 234 182 Q 218 176 208 166"
              fill="none"
              stroke={isDark ? '#2e230f' : '#6b5120'}
              strokeWidth="1"
            />
            <circle cx="178" cy="180" r="2.5" fill={isDark ? '#1f180a' : '#57411a'} />
            <circle cx="222" cy="180" r="2.5" fill={isDark ? '#1f180a' : '#57411a'} />

            {/* Left Bridge Mounting Screw (Blued Steel in Counterbored Brass Boss) */}
            <circle cx="156" cy="182" r="7" fill="url(#brassBezelRim)" stroke="#4d3b19" strokeWidth="0.8" />
            <circle cx="156" cy="182" r="4.2" fill="url(#polishedSteel)" stroke="#1a1c22" strokeWidth="0.6" />
            <line x1="153.5" y1="182" x2="158.5" y2="182" stroke="#0a0a0c" strokeWidth="1" />

            {/* Right Bridge Mounting Screw (Blued Steel in Counterbored Brass Boss) */}
            <circle cx="244" cy="182" r="7" fill="url(#brassBezelRim)" stroke="#4d3b19" strokeWidth="0.8" />
            <circle cx="244" cy="182" r="4.2" fill="url(#polishedSteel)" stroke="#1a1c22" strokeWidth="0.6" />
            <line x1="241.5" y1="182" x2="246.5" y2="182" stroke="#0a0a0c" strokeWidth="1" />

            {/* Top Pivot Bushing for Pallet Arbor */}
            <circle cx="200" cy="138" r="6" fill="url(#brassBezelRim)" stroke="#423214" strokeWidth="0.8" />
            <circle cx="200" cy="138" r="3.2" fill="url(#rubyJewel)" stroke="#2e050b" strokeWidth="0.5" />
            <circle cx="200" cy="138" r="1.2" fill="#ffffff" opacity="0.6" />
          </g>

          {/* 9.3 Live Oscillating Pallet Fork & Brocot D-Jewels (Pivots at cx: 200, cy: 138) */}
          <g transform={`translate(200, 138) rotate(${escapementAngle})`}>
            {/* Pallet Anchor Arms */}
            <path
              d="M -16 12 C -8 6, 8 6, 16 12 L 13 18 C 6 12, -6 12, -13 18 Z"
              fill="url(#polishedSteel)"
              stroke="#2e3440"
              strokeWidth="0.8"
            />
            {/* Left Ruby Pallet Stone (Entry Jewel) */}
            <rect x="-17" y="11" width="3.8" height="6.5" rx="1" fill="url(#rubyJewel)" stroke="#4a040e" strokeWidth="0.6" />
            {/* Right Ruby Pallet Stone (Exit Jewel) */}
            <rect x="13.2" y="11" width="3.8" height="6.5" rx="1" fill="url(#rubyJewel)" stroke="#4a040e" strokeWidth="0.6" />
            {/* Central Pallet Pivot Cap */}
            <circle cx="0" cy="0" r="3" fill="url(#brocotBridgeBrass)" stroke="#38290f" strokeWidth="0.5" />
          </g>
        </g>

        {/* ================================================================= */}
        {/* 10. AUTHENTIC WATERBURY BLACK STEEL HANDS & CENTER ARBOR          */}
        {/* ================================================================= */}
        <g id="clockHands" filter="url(#handDropShadow)">
          {/* 10.1 HOUR HAND (Diamond Spade Tip) */}
          <g transform={`translate(${CX}, ${CY}) rotate(${hourDegrees})`}>
            {/* Counterbalance rear tail */}
            <circle cx="0" cy="14" r="4.5" fill="url(#waterburyHandSteel)" stroke="#09090b" strokeWidth="0.8" />
            <line x1="0" y1="14" x2="0" y2="0" stroke="url(#waterburyHandSteel)" strokeWidth="3" />

            {/* Main shaft tapering toward head */}
            <path
              d="M -1.8 0 L -1.5 -48 L 1.5 -48 L 1.8 0 Z"
              fill="url(#waterburyHandSteel)"
            />

            {/* Diamond Spade Pointer Head (reaches to ~110px) */}
            <path
              d="M 0 -48 L -9 -62 L 0 -82 L 9 -62 Z"
              fill="url(#waterburyHandSteel)"
              stroke="#0a0a0c"
              strokeWidth="0.9"
            />
            {/* Open teardrop cutout in spade */}
            <circle cx="0" cy="-62" r="3.2" fill="none" stroke="#121317" strokeWidth="1" />
          </g>

          {/* 10.2 MINUTE HAND (Long Slender Diamond Spade Pointer extending to Railroad Track) */}
          <g transform={`translate(${CX}, ${CY}) rotate(${minuteDegrees})`}>
            {/* Counterbalance rear tail */}
            <circle cx="0" cy="18" r="4.8" fill="url(#waterburyHandSteel)" stroke="#09090b" strokeWidth="0.8" />
            <line x1="0" y1="18" x2="0" y2="0" stroke="url(#waterburyHandSteel)" strokeWidth="2.8" />

            {/* Slender shaft */}
            <path
              d="M -1.6 0 L -1.2 -112 L 1.2 -112 L 1.6 0 Z"
              fill="url(#waterburyHandSteel)"
            />

            {/* Long Diamond Spade Pointer Head (reaches into the railroad minute track at ~174px) */}
            <path
              d="M 0 -112 L -7.5 -128 L 0 -172 L 7.5 -128 Z"
              fill="url(#waterburyHandSteel)"
              stroke="#0a0a0c"
              strokeWidth="0.9"
            />
            {/* Slender diamond pierced cutout */}
            <path
              d="M 0 -124 L -2.5 -132 L 0 -144 L 2.5 -132 Z"
              fill="none"
              stroke="#121317"
              strokeWidth="0.9"
            />
          </g>

          {/* 10.3 LIVE ANTIQUE SECOND HAND (Slender Center Sweep Needle with Ring Counterweight) */}
          <g transform={`translate(${CX}, ${CY}) rotate(${secondDegrees})`} filter="url(#secondHandDropShadow)">
            {/* Counterweight rear shaft and antique pierced ring */}
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="36"
              stroke="url(#waterburyHandSteel)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            {/* Open teardrop / pear counterweight ring */}
            <circle
              cx="0"
              cy="24"
              r="5.5"
              fill="none"
              stroke="url(#waterburyHandSteel)"
              strokeWidth="1.8"
            />
            {/* Polished brass counterweight pip */}
            <circle cx="0" cy="35" r="2.2" fill="url(#brassBezelRim)" stroke="#2b200d" strokeWidth="0.5" />

            {/* Slender tapered needle pointer reaching into the minute railroad track */}
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="-176"
              stroke="url(#waterburyHandSteel)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />

            {/* Precision tip accent */}
            <line
              x1="0"
              y1="-142"
              x2="0"
              y2="-176"
              stroke={isDark ? '#cbd5e1' : '#b38f42'}
              strokeWidth="1"
            />

            {/* Second hand center boss mounting collar */}
            <circle cx="0" cy="0" r="5" fill="url(#waterburyHandSteel)" stroke="#1a1c24" strokeWidth="0.6" />
          </g>

          {/* 10.4 CENTRAL CANNON PINION & HAND NUT ARBOR */}
          <g transform={`translate(${CX}, ${CY})`}>
            <circle cx="0" cy="0" r="11" fill="url(#brassBezelRim)" stroke="#382a13" strokeWidth="1.2" />
            <circle cx="0" cy="0" r="7.5" fill="url(#waterburyHandSteel)" stroke="#12141a" strokeWidth="0.8" />
            <circle cx="0" cy="0" r="4.2" fill="url(#brassBezelRim)" stroke="#423214" strokeWidth="0.7" />
            <circle cx="0" cy="0" r="2" fill={isDark ? '#e2e8f0' : '#14171f'} />
          </g>
        </g>
      </svg>

      {/* Interactive Utilities (Tick Sound Toggle, Digital Time Badge, Loupe Magnification) */}
      <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setTickSoundEnabled(!tickSoundEnabled);
          }}
          className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white transition-all shadow-md"
          title={tickSoundEnabled ? 'Mute Deadbeat Escapement Sound' : 'Enable Brocot Deadbeat Escapement Sound'}
        >
          {tickSoundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-300" />}
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowDigitalBadge(!showDigitalBadge);
          }}
          className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white transition-all shadow-md"
          title="Toggle Digital Real-Time Overlay"
        >
          <ClockIcon className="w-3.5 h-3.5" />
        </button>

        {!isZoomChild && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(true);
            }}
            className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white transition-all shadow-md"
            title="Inspect Visible Brocot Escapement in Full Magnification"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Digital Real-Time Badge (Optional Peek) */}
      {showDigitalBadge && (
        <div className="mt-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white font-mono text-xs shadow-lg flex items-center gap-2 animate-fadeIn z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold">{digitalTimeStr}</span>
          <span className="text-slate-400 text-[10px]">({dateStr})</span>
        </div>
      )}

      {/* High-Resolution Magnification Modal for Brocot Visible Escapement */}
      {!isZoomChild && isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative max-w-md w-full p-4 sm:p-6 flex flex-col items-center max-h-[95vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex justify-between items-center mb-4 text-white">
              <div>
                <h4 className="text-sm sm:text-base font-black tracking-wider uppercase font-serif flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Waterbury Clock Co. • Visible Brocot Escapement</span>
                </h4>
                <p className="text-[11px] sm:text-xs text-amber-300/80 font-mono">
                  Deadbeat Pallets & Real-Time Hands • {digitalTimeStr}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="px-3 py-1 text-xs rounded-full bg-white/10 hover:bg-white/20 text-white font-bold"
              >
                Close
              </button>
            </div>

            {/* High-res watch view */}
            <div className="w-full max-w-[320px] sm:max-w-[400px] aspect-square flex items-center justify-center">
              <VintageWaterburyClock isDark={true} size={400} isZoomChild={true} />
            </div>

            <div className="mt-4 flex flex-wrap justify-center items-center gap-3 text-xs text-slate-300">
              <button
                type="button"
                onClick={() => setTickSoundEnabled(!tickSoundEnabled)}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 flex items-center gap-2"
              >
                {tickSoundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                <span>{tickSoundEnabled ? 'Brocot Sound On' : 'Brocot Sound Off'}</span>
              </button>

              <button
                type="button"
                onClick={() => setTickMode(tickMode === 'mechanical' ? 'smooth' : 'mechanical')}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 flex items-center gap-2 font-mono"
              >
                <span>Movement: {tickMode === 'mechanical' ? 'Mechanical (1-Sec Step)' : 'Smooth Sweep'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
