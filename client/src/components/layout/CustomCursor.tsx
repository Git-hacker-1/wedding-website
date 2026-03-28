import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Compass } from 'lucide-react';

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [isHovering, setIsHovering] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    // Only enable on non-touch devices
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      
      // Calculate rotation based on movement direction
      if (!isInteractive) {
        setRotation(prev => prev + (e.movementX * 0.5));
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = !!(
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.classList.contains('cursor-pointer')
      );
      
      const isInput = !!(
        target.tagName.toLowerCase() === 'input' ||
        target.tagName.toLowerCase() === 'textarea'
      );

      setIsHovering(isClickable);
      setIsInteractive(isClickable || isInput);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    // Initial check to avoid hiding system cursor if no mouse
    document.documentElement.classList.add('custom-cursor-enabled');

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.documentElement.classList.remove('custom-cursor-enabled');
    };
  }, [cursorX, cursorY, isInteractive]);

  return (
    <>
      <style>{`
        .custom-cursor-enabled * {
          cursor: none !important;
        }
        .custom-cursor-enabled input,
        .custom-cursor-enabled textarea {
          cursor: text !important;
        }
      `}</style>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-100 flex items-center justify-center mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          rotate: isHovering ? 45 : rotation
        }}
        transition={{
          rotate: { type: 'spring', damping: 20 },
          scale: { duration: 0.2 }
        }}
      >
        <Compass 
          className="w-6 h-6 text-gold drop-shadow-lg" 
          strokeWidth={isHovering ? 1.5 : 2}
        />
        {/* Subtle dot in the center */}
        <div className="absolute inset-0 m-auto w-1 h-1 bg-white rounded-full opacity-50" />
      </motion.div>
    </>
  );
}
