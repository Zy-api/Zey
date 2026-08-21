import { type ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  from?: string;
  via?: string;
  to?: string;
  animate?: boolean;
}

/**
 * GradientText — renders children with an animated gradient fill.
 * Ideal for brand titles / hero headings.
 */
export default function GradientText({
  children,
  className = '',
  from = 'var(--accent)',
  via = 'var(--info)',
  to = 'var(--theme-green)',
  animate = true,
}: GradientTextProps) {
  return (
    <span
      className={className}
      style={{
        background: `linear-gradient(90deg, ${from}, ${via}, ${to})`,
        backgroundSize: animate ? '200% auto' : '100% auto',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: 'transparent',
        animation: animate ? 'gradient-shift 6s linear infinite' : undefined,
      }}
    >
      {children}
    </span>
  );
}
