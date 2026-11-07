import type { SVGProps } from 'react';

const paths = {
  home: 'M3 11.5 12 4l9 7.5M5 10v10h5v-6h4v6h5V10',
  list: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8ZM4 20c0-3.3 3.6-6 8-6s8 2.7 8 6',
  shield: 'M12 3 4 6v6c0 4.5 3.4 7.7 8 9 4.6-1.3 8-4.5 8-9V6l-8-3Z',
  chart: 'M4 20V10M10 20V4M16 20v-8M22 20H2',
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'M6 6l12 12M18 6 6 18',
  plus: 'M12 5v14M5 12h14',
  edit: 'M4 20h4L19 9l-4-4L4 16v4ZM13.5 6.5l4 4',
  trash: 'M5 7h14M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  logout: 'M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10',
  chevron: 'M6 9l6 6 6-6',
  alert: 'M12 9v4M12 17h.01M10.3 4 2.7 18a2 2 0 001.7 3h15.2a2 2 0 001.7-3L13.7 4a2 2 0 00-3.4 0Z',
  arrowUp: 'M12 19V5M5 12l7-7 7 7',
  arrowDown: 'M12 5v14M19 12l-7 7-7-7',
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, className = 'size-5', ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" {...props}>
      <path d={paths[name]} />
    </svg>
  );
}