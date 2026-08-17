import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface TooltipProps {
  text: string;
  children: ReactNode;
  wrapperStyle?: React.CSSProperties;
}

export default function Tooltip({ text, children, wrapperStyle }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [offset, setOffset] = useState({ x: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handlePressStart = () => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      setVisible(true);
    }, 500);
  };

  const handlePressEnd = () => {
    clearTimer();
    if (visible) {
      setVisible(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setVisible(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      clearTimer();
    };
  }, []);

  useEffect(() => {
    if (visible && tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      const margin = 8;
      let newOffsetX = 0;
      
      if (rect.right > window.innerWidth - margin) {
        newOffsetX = window.innerWidth - margin - rect.right;
      }
      if (rect.left < margin) {
        newOffsetX = margin - rect.left;
      }
      setOffset({ x: newOffsetX });
    } else {
      setOffset({ x: 0 });
    }
  }, [visible, text]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', display: 'inline-flex', ...wrapperStyle }}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onTouchCancel={handlePressEnd}
    >
      {children}
      {visible && (
        <div
          ref={tooltipRef}
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: '50%',
            transform: `translateX(calc(-50% + ${offset.x}px))`,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-sm)',
            zIndex: 150,
            padding: '6px 10px',
            fontSize: '0.75rem',
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
}
