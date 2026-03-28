import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PassportCoverProps {
  isOpen: boolean;
  onOpen: () => void;
  className?: string;
}

function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const check = (): void => {
      setIsTouch(typeof window !== 'undefined' && 'ontouchstart' in window);
    };
    const id = requestAnimationFrame(check);
    return () => cancelAnimationFrame(id);
  }, []);
  return isTouch;
}

export function PassportCover({ isOpen, onOpen, className }: PassportCoverProps) {
  const isTouchDevice = useIsTouchDevice();

  return (
    <div className={cn('relative perspective-1000', className)}>
      {/* Passport Book */}
      <motion.div
        role="button"
        tabIndex={0}
        className="relative cursor-pointer transform-style-3d focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-r-lg"
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen();
          }
        }}
        initial={false}
        animate={{
          rotateY: isOpen ? -180 : 0,
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{
          duration: 0.8,
          ease: [0.4, 0, 0.2, 1],
        }}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Front Cover - responsive width so it never overflows on narrow viewports */}
        <div
          className="relative w-[min(340px,calc(100vw-2rem))] md:w-[400px] aspect-340/480 md:aspect-400/560 rounded-r-lg overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #1A2A42 0%, #0F1C2E 50%, #17263B 100%)',
            boxShadow: 'inset -2px 0 10px rgba(0,0,0,0.6), 12px 20px 30px rgba(0,0,0,0.5), inset 2px 2px 5px rgba(255,255,255,0.1)',
          }}
        >
          {/* Premium Leather Texture Overlay */}
          <div 
            className="absolute inset-0 opacity-40 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
          {/* Edge Highlighting (emboss effect) */}
          <div className="absolute inset-0 rounded-r-lg border border-white/5 pointer-events-none" />

          {/* Gold Emblem */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-24 h-24 md:w-28 md:h-28">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Outer Circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#goldGradient)"
                strokeWidth="2"
              />
              {/* Inner decorative circle */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="url(#goldGradient)"
                strokeWidth="1"
                strokeDasharray="4 2"
              />
              {/* Heart symbol */}
              <path
                d="M50 75 C50 75, 25 55, 25 40 C25 30, 35 25, 50 35 C65 25, 75 30, 75 40 C75 55, 50 75, 50 75Z"
                fill="url(#goldGradient)"
              />
              {/* Gradient definition */}
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#BF953F" />
                  <stop offset="25%" stopColor="#FCF6BA" />
                  <stop offset="50%" stopColor="#B38728" />
                  <stop offset="75%" stopColor="#FBF5B7" />
                  <stop offset="100%" stopColor="#AA771C" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Title Text */}
          <div className="absolute top-44 md:top-52 left-1/2 -translate-x-1/2 text-center w-full">
            <motion.h1 
              className="text-2xl md:text-3xl tracking-[0.3em] font-light mb-2 inline-block px-4"
              style={{
                background: 'linear-gradient(110deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #BF953F 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
              animate={{ backgroundPosition: ['0% center', '200% center'] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            >
              PASSPORT
            </motion.h1>
            <div 
              className="w-32 md:w-40 h-[1.5px] mx-auto opacity-80"
              style={{
                background: 'linear-gradient(90deg, transparent, #FCF6BA, #B38728, #FCF6BA, transparent)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.5)',
              }}
            />
          </div>

          {/* Names */}
          <div className="absolute top-64 md:top-80 left-1/2 -translate-x-1/2 text-center w-full">
            <motion.p 
              className="text-xl md:text-2xl font-heading tracking-wide px-4"
              style={{
                background: 'linear-gradient(110deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #BF953F 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                textShadow: '0 2px 4px rgba(0,0,0,0.4)',
              }}
              animate={{ backgroundPosition: ['200% center', '0% center'] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
            >
              Sagar & Grace
            </motion.p>
          </div>

          {/* Destination */}
          <div className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 text-center">
            <p className="text-xs md:text-sm text-gold/70 tracking-widest uppercase mb-1">
              Destination
            </p>
            <p 
              className="text-sm md:text-base font-medium tracking-wide"
              style={{
                background: 'linear-gradient(90deg, #D4AF37, #E6C65C, #D4AF37)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Cancun, Mexico
            </p>
          </div>

          {/* Date */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <p 
              className="text-xs md:text-sm tracking-[0.2em]"
              style={{
                background: 'linear-gradient(90deg, #D4AF37, #E6C65C, #D4AF37)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              APRIL 2-5, 2027
            </p>
          </div>

          {/* Mexico visa stamp */}
          <div
            className="absolute bottom-24 right-6 md:bottom-28 md:right-8 w-14 h-14 md:w-16 md:h-16 border-2 border-gold/80 rounded-sm flex flex-col items-center justify-center opacity-90"
            style={{
              transform: 'rotate(8deg)',
              background: 'linear-gradient(135deg, rgba(250,248,245,0.95) 0%, rgba(245,240,230,0.98) 100%)',
              color: '#1E3A5F',
              boxShadow: 'inset 0 0 0 1px rgba(212,175,55,0.3)',
            }}
          >
            <span className="text-[8px] md:text-[9px] font-mono font-bold tracking-wider uppercase">
              MEXICO
            </span>
            <span className="text-[7px] md:text-[8px] font-mono text-ocean-deep/80 mt-0.5">
              CUN
            </span>
            <span className="text-[6px] font-mono text-ocean-deep/60 mt-0.5">
              APR 2027
            </span>
          </div>

          {/* Click / tap hint */}
          <motion.div
            className="absolute top-4 right-4 text-[#FCF6BA] text-xs font-mono tracking-widest uppercase opacity-70"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {isTouchDevice ? 'Tap To Open' : 'Click To Open'}
          </motion.div>

          {/* Dynamic Gold Sheen Sweep */}
          <motion.div
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{
              background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.4) 25%, rgba(255,240,150,0.5) 30%, transparent 35%)',
              backgroundSize: '300% 100%',
              borderRadius: '0 8px 8px 0',
            }}
            animate={{ backgroundPosition: ['200% center', '-100% center'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 3 }}
          />

          {/* Spine shadow */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-10 mix-blend-multiply pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 40%, transparent 100%)',
            }}
          />
        </div>

        {/* Back of cover (visible when flipped) - fills parent, size from front */}
        <div
          className="absolute inset-0 rounded-l-lg paper-texture"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Page texture */}
          <div className="absolute inset-0 rounded-l-lg bg-sand-pearl" />
        </div>
      </motion.div>
    </div>
  );
}
