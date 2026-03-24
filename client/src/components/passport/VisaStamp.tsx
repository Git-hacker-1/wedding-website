import { useId, type JSX } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { EventType } from '@/types';
import { BARAAT_ELEPHANT_STAMP_CIRCLES, BARAAT_ELEPHANT_STAMP_PATHS } from '@/components/passport/baraatElephantStampPaths';
import { HALDI_LOTUS_STAMP_PATH } from '@/components/passport/haldiLotusStampPath';
import { MEHNDI_HAND_STAMP_PATHS } from '@/components/passport/mehndiHandStampPaths';
import { RECEPTION_DANCE_PARTY_STAMP_PATH } from '@/components/passport/receptionDancePartyStampPath';
import { WELCOME_DINNER_STAMP_SHAPES } from '@/components/passport/welcomeDinnerStampShapes';

// Generate a stable random-ish rotation based on a seed string
function seededRotation(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash = hash & hash;
  }
  return -5 + (Math.abs(hash) % 10);
}

interface VisaStampProps {
  event: EventType;
  date: string;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  /** Seeded slight rotation + tilted entrance; use on passport scatter. Off for flat layouts (e.g. Events page). */
  passportTilt?: boolean;
}

const stampConfigs: Record<EventType, {
  title: string;
  icon: JSX.Element;
  color: string;
  borderStyle: 'circle' | 'rectangle' | 'oval';
}> = {
  welcome: {
    title: 'WELCOME DINNER',
    color: '#2E8B8B',
    borderStyle: 'circle',
    icon: (
      <g transform="translate(50,50) scale(0.11) translate(-256,-256)">
        {/* valentines-dinner-svgrepo-com.svg — per-path fills; fork uses mint fill + stroke outline */}
        {WELCOME_DINNER_STAMP_SHAPES.map((shape, i) =>
          shape.kind === 'path' ? (
            <path
              key={i}
              d={shape.d}
              fill={shape.fill}
              stroke={shape.stroke}
              strokeWidth={shape.strokeWidth}
              strokeLinejoin={shape.strokeLinejoin}
              strokeLinecap={shape.strokeLinecap}
              {...(shape.fillRule !== undefined ? { fillRule: shape.fillRule } : {})}
            />
          ) : (
            <polygon key={i} points={shape.points} fill={shape.fill} />
          ),
        )}
      </g>
    ),
  },
  haldi: {
    title: 'HALDI',
    color: '#B8860B',
    borderStyle: 'circle',
    icon: (
      <g
        fill="currentColor"
        stroke="none"
        transform="translate(50, 50) scale(0.19) translate(-148.5, -148.5)"
      >
        {/* lotus-svgrepo-com.svg — 297×297 */}
        <path d={HALDI_LOTUS_STAMP_PATH} />
      </g>
    ),
  },
  mehndi: {
    title: 'MEHNDI',
    color: '#8B5E3C',
    borderStyle: 'oval',
    icon: (
      <g
        fill="currentColor"
        stroke="none"
        transform="translate(50, 50) scale(0.19) translate(-148.5, -148.5)"
      >
        {/* henna-painted-hand-svgrepo-com.svg — 297×297, centered in 100×100 stamp */}
        {MEHNDI_HAND_STAMP_PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    ),
  },
  baraat: {
    title: 'BARAAT',
    color: '#CC3333',
    borderStyle: 'rectangle',
    icon: (
      <g
        fill="currentColor"
        stroke="none"
        transform="translate(50, 52) scale(0.185) translate(-148.5, -148.5)"
      >
        {/* elephant-svgrepo-com.svg — 297×297 */}
        {BARAAT_ELEPHANT_STAMP_PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
        {BARAAT_ELEPHANT_STAMP_CIRCLES.map((c, i) => (
          <circle key={`c-${i}`} cx={c.cx} cy={c.cy} r={c.r} />
        ))}
      </g>
    ),
  },
  wedding: {
    title: 'WEDDING CEREMONY',
    color: '#A67C00',
    borderStyle: 'circle',
    icon: (
      <g>
        {/* Mandap pillars */}
        <rect x="25" y="45" width="4" height="25" fill="currentColor" />
        <rect x="71" y="45" width="4" height="25" fill="currentColor" />
        {/* Mandap top */}
        <path d="M20 45 L50 25 L80 45" stroke="currentColor" strokeWidth="3" fill="none" />
        <path d="M25 45 L75 45" stroke="currentColor" strokeWidth="2" />
        {/* Decorative top */}
        <circle cx="50" cy="25" r="5" fill="currentColor" />
        {/* Fire/Agni */}
        <path d="M50 65 Q45 55 50 50 Q55 55 50 65" fill="currentColor" />
      </g>
    ),
  },
  cocktail: {
    title: 'COCKTAIL HOUR',
    color: '#1E3A5F',
    borderStyle: 'rectangle',
    icon: (
      <g>
        {/* Martini glass */}
        <path d="M35 35 L50 55 L65 35" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M50 55 L50 70" stroke="currentColor" strokeWidth="2" />
        <path d="M40 70 L60 70" stroke="currentColor" strokeWidth="2" />
        {/* Olive */}
        <circle cx="50" cy="42" r="4" fill="currentColor" />
        {/* Decorative bubbles */}
        <circle cx="30" cy="45" r="2" fill="currentColor" opacity="0.5" />
        <circle cx="70" cy="50" r="2" fill="currentColor" opacity="0.5" />
        <circle cx="68" cy="40" r="1.5" fill="currentColor" opacity="0.5" />
      </g>
    ),
  },
  reception: {
    title: 'RECEPTION',
    color: '#2874A6',
    borderStyle: 'oval',
    icon: (
      <g
        fill="currentColor"
        stroke="none"
        transform="translate(50, 50) scale(0.217) translate(-130, -130)"
      >
        {/* dance-party-party-fun-entertain-svgrepo-com.svg — 260×260 */}
        <path d={RECEPTION_DANCE_PARTY_STAMP_PATH} />
      </g>
    ),
  },
};

const sizeClasses = {
  sm: 'w-20 h-20',
  md: 'w-32 h-32',
  lg: 'w-44 h-44',
};

export function VisaStamp({ 
  event, 
  date, 
  animated = true, 
  size = 'md',
  className,
  passportTilt = true,
}: VisaStampProps) {
  const config = stampConfigs[event];
  const id = useId();
  const safeId = id.replace(/:/g, '');
  const randomRotation = passportTilt ? seededRotation(id + event) : 0;
  const useCurvedText = config.borderStyle === 'circle' || config.borderStyle === 'oval';

  const StampContent = (
    <svg
      viewBox="0 0 100 100"
      className={cn(sizeClasses[size], className)}
      style={{ color: config.color }}
    >
      {/* Arc paths for curved text — both arcs share endpoints at the
           horizontal centre-line so title & date are equally spaced from
           their respective dashed borders.
           Circle: r=37 (dashed r=42 → 5 unit inset for baseline)
           Oval:   rx=37 ry=31 (dashed ry=36 → 5 unit inset) */}
      <defs>
        {config.borderStyle === 'circle' && (
          <>
            <path id={`${safeId}-top`} d="M 13,50 A 37,37 0 0,1 87,50" fill="none" />
            <path id={`${safeId}-bot`} d="M 13,50 A 37,37 0 0,0 87,50" fill="none" />
          </>
        )}
        {config.borderStyle === 'oval' && (
          <>
            <path id={`${safeId}-top`} d="M 13,50 A 37,31 0 0,1 87,50" fill="none" />
            <path id={`${safeId}-bot`} d="M 13,50 A 37,31 0 0,0 87,50" fill="none" />
          </>
        )}
      </defs>

      {/* Background fill so stamps are legible on photo backgrounds */}
      {config.borderStyle === 'circle' && (
        <circle cx="50" cy="50" r="46" fill="rgba(250,248,245,0.92)" />
      )}
      {config.borderStyle === 'rectangle' && (
        <rect x="4" y="4" width="92" height="92" rx="4" fill="rgba(250,248,245,0.92)" />
      )}
      {config.borderStyle === 'oval' && (
        <ellipse cx="50" cy="50" rx="46" ry="40" fill="rgba(250,248,245,0.92)" />
      )}

      {/* Border based on style */}
      {config.borderStyle === 'circle' && (
        <>
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="3" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
        </>
      )}
      {config.borderStyle === 'rectangle' && (
        <>
          <rect x="4" y="4" width="92" height="92" rx="4" fill="none" stroke="currentColor" strokeWidth="3" />
          <rect x="8" y="8" width="84" height="84" rx="2" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
        </>
      )}
      {config.borderStyle === 'oval' && (
        <>
          <ellipse cx="50" cy="50" rx="46" ry="40" fill="none" stroke="currentColor" strokeWidth="3" />
          <ellipse cx="50" cy="50" rx="42" ry="36" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
        </>
      )}

      {/* Icon — centered in stamp */}
      <g transform="translate(0, -2)">
        {config.icon}
      </g>

      {/* Title — curved along top border for circles/ovals, straight for rectangles */}
      {useCurvedText ? (
        <text fill="currentColor" fontSize="7" fontWeight="bold" fontFamily="monospace">
          <textPath href={`#${safeId}-top`} startOffset="50%" textAnchor="middle">
            {config.title}
          </textPath>
        </text>
      ) : (
        <text
          x="50"
          y="16"
          textAnchor="middle"
          fill="currentColor"
          fontSize="7"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {config.title}
        </text>
      )}

      {/* Date — curved along bottom border for circles/ovals, straight for rectangles */}
      {useCurvedText ? (
        <text fill="currentColor" fontSize="6" fontFamily="monospace">
          <textPath href={`#${safeId}-bot`} startOffset="50%" textAnchor="middle">
            {date}
          </textPath>
        </text>
      ) : (
        <text
          x="50"
          y="87"
          textAnchor="middle"
          fill="currentColor"
          fontSize="6"
          fontFamily="monospace"
        >
          {date}
        </text>
      )}
    </svg>
  );

  if (animated) {
    return (
      <motion.div
        initial={
          passportTilt
            ? { scale: 2, opacity: 0, rotate: -15 }
            : { scale: 1.04, opacity: 0, rotate: 0 }
        }
        animate={{ scale: 1, opacity: 0.85, rotate: randomRotation }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
        whileHover={{ scale: 1.05, opacity: 1 }}
      >
        {StampContent}
      </motion.div>
    );
  }

  return (
    <div
      style={{
        opacity: 0.85,
        ...(passportTilt ? { transform: `rotate(${randomRotation}deg)` } : {}),
      }}
    >
      {StampContent}
    </div>
  );
}

interface StampCollectionProps {
  className?: string;
  /** When true, lay out stamps in exactly two rows (4 + 3) to save vertical space */
  twoRows?: boolean;
  /** When true, scatter stamps across the container with a sequential stamp-down animation */
  scattered?: boolean;
  /** Size of individual stamps (defaults to 'md') */
  stampSize?: 'sm' | 'md' | 'lg';
  /** When true, stamps overlap slightly with drop-shadows for a photo-overlay look */
  overlap?: boolean;
}

/**
 * Absolute positions for each stamp in a deliberate scattered layout.
 * x/y = percentage offsets from container edges, rotate = degrees.
 * Positions avoid the centre-bottom where the couple's photo subject sits.
 */
const SCATTERED_LAYOUT: { x: string; y: string; rotate: number }[] = [
  { x: '5%',  y: '4%',  rotate: -6 },
  { x: '68%', y: '2%',  rotate: 4 },
  { x: '30%', y: '18%', rotate: -2 },
  { x: '2%',  y: '38%', rotate: -3 },
  { x: '65%', y: '32%', rotate: 5 },
  { x: '8%',  y: '68%', rotate: 3 },
  { x: '70%', y: '62%', rotate: -4 },
];

/** Framer Motion variants for the scattered stamp container (orchestrates stagger). */
const scatteredContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.5,
      delayChildren: 1,
    },
  },
};

/** Framer Motion variants for individual stamps (stamp-down spring). */
const stampDownVariants = {
  hidden: { scale: 2.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 0.92,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 22,
    },
  },
};

export function StampCollection({ className, twoRows, scattered, stampSize, overlap }: StampCollectionProps) {
  const events: { event: EventType; date: string }[] = [
    { event: 'welcome', date: 'APR 2, 2027' },
    { event: 'haldi', date: 'APR 3, 2027' },
    { event: 'mehndi', date: 'APR 3, 2027' },
    { event: 'baraat', date: 'APR 4, 2027' },
    { event: 'wedding', date: 'APR 4, 2027' },
    { event: 'cocktail', date: 'APR 4, 2027' },
    { event: 'reception', date: 'APR 4, 2027' },
  ];

  const renderStamp = (e: { event: EventType; date: string }, index: number) => (
    <motion.div
      key={e.event}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1}}
      className={overlap ? 'drop-shadow-lg' : undefined}
    >
      <Link
        to={`/events#${e.event}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-caribbean focus-visible:ring-offset-2 rounded"
        aria-label={`View ${stampConfigs[e.event].title} event details`}
      >
        <VisaStamp event={e.event} date={e.date} size={stampSize} />
      </Link>
    </motion.div>
  );

  if (scattered) {
    return (
      <motion.div
        className={cn('relative w-full h-full', className)}
        variants={scatteredContainerVariants}
        initial="hidden"
        animate="visible"
      >
        {events.map((e, i) => {
          const pos = SCATTERED_LAYOUT[i];
          return (
            <motion.div
              key={e.event}
              className="absolute drop-shadow-lg"
              style={{
                left: pos.x,
                top: pos.y,
                rotate: pos.rotate,
              }}
              variants={stampDownVariants}
              whileHover={{ scale: 1.08, opacity: 1 }}
            >
              <Link
                to={`/events#${e.event}`}
                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-caribbean focus-visible:ring-offset-2 rounded"
                aria-label={`View ${stampConfigs[e.event].title} event details`}
              >
                <VisaStamp
                  event={e.event}
                  date={e.date}
                  size="sm"
                  className="md:w-28 md:h-28"
                  animated={false}
                />
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    );
  }

  if (twoRows) {
    const row1 = events.slice(0, 4);
    const row2 = events.slice(4, 7);
    return (
      <div className={cn('flex flex-col justify-center items-center', overlap ? '-space-y-2' : stampSize === 'sm' ? 'gap-1' : 'gap-3', className)}>
        <div className={cn('flex flex-wrap justify-center', overlap ? '-space-x-2' : stampSize === 'sm' ? 'gap-1' : 'gap-3')}>
          {row1.map((e, i) => renderStamp(e, i))}
        </div>
        <div className={cn('flex flex-wrap justify-center', overlap ? '-space-x-2' : stampSize === 'sm' ? 'gap-1' : 'gap-3')}>
          {row2.map((e, i) => renderStamp(e, 4 + i))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-wrap gap-6 justify-center', className)}>
      {events.map((e, index) => renderStamp(e, index))}
    </div>
  );
}
