import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowUpRight,
  ArrowRight,
  MessageSquare,
  Phone,
  AppWindow,
  CalendarDays,
  Files,
  TrendingUp,
  Network,
  Send,
  ShieldCheck,
  Check,
  Sparkle,
  Building2,
  Stethoscope,
  Scissors,
  ChevronRight,
  Activity,
  Users,
  SlidersHorizontal,
  CircleHelp,
  LayoutDashboard,
  Home,
  Landmark,
  Car,
  GraduationCap,
  Wrench,
  ShoppingBag,
  BedDouble,
  Plane,
  Briefcase,
} from 'lucide-react';
import type { ReactNode } from 'react';

const icons = {
  message: MessageSquare,
  phone: Phone,
  browser: AppWindow,
  calendar: CalendarDays,
  records: Files,
  chart: TrendingUp,
  network: Network,
  send: Send,
  shield: ShieldCheck,
  check: Check,
  star: Sparkle,
  building: Building2,
  medical: Stethoscope,
  scissors: Scissors,
  activity: Activity,
  users: Users,
  settings: SlidersHorizontal,
  help: CircleHelp,
  dashboard: LayoutDashboard,
  home: Home,
  bank: Landmark,
  car: Car,
  graduation: GraduationCap,
  tools: Wrench,
  store: ShoppingBag,
  hotel: BedDouble,
  plane: Plane,
  briefcase: Briefcase,
};
export function Icon({
  name,
  size = 22,
  className = '',
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Component = icons[name as keyof typeof icons] ?? Network;
  return <Component size={size} strokeWidth={1.5} aria-hidden="true" className={className} />;
}
export function Logo({ symbol = false, className = '' }: { symbol?: boolean; className?: string }) {
  return (
    <>
    <Image
      className={`brand-on-dark ${className}`}
      src={symbol ? '/brand/symbol-light.png' : '/brand/logo-light-v2.png'}
      alt={symbol ? '' : 'HireStella'}
      width={symbol ? 44 : 184}
      height={symbol ? 44 : 36}
      priority={!symbol}
      style={{ objectFit: 'contain' }}
    />
    <Image className={`brand-on-light ${className}`} src={symbol ? '/brand/symbol-dark.png' : '/brand/logo-dark-v2.png'} alt={symbol ? '' : 'HireStella'} width={symbol ? 44 : 184} height={symbol ? 44 : 36} style={{ objectFit: 'contain' }} />
    </>
  );
}
export function ButtonLink({
  href,
  children,
  secondary = false,
  className = '',
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
  className?: string;
}) {
  // In-page actions need native anchor navigation, with no route prefetch.
  if (href.startsWith('#')) {
    return (
      <a href={href} className={`button ${secondary ? 'button-secondary' : 'button-primary'} ${className}`}>
        {children}
        <ArrowUpRight size={17} aria-hidden="true" />
      </a>
    );
  }
  return (
    <Link
      className={`button ${secondary ? 'button-secondary' : 'button-primary'} ${className}`}
      href={href}
    >
      {children}
      <ArrowUpRight size={17} aria-hidden="true" />
    </Link>
  );
}
export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="text-link">
      {children}
      <ArrowRight size={17} aria-hidden="true" />
    </Link>
  );
}
export function SignalMark({ className = '' }: { className?: string }) {
  return <svg className={`signal-mark ${className}`} width="16" height="18" viewBox="0 0 16 18" fill="none" aria-hidden="true"><path d="M3 3.5C3 2.35 4.25 1.63 5.24 2.2L13.24 6.7C14.26 7.27 14.26 8.73 13.24 9.3L5.24 13.8C4.25 14.37 3 13.65 3 12.5V3.5Z" fill="currentColor" /></svg>;
}
export function Eyebrow({ children, number, icon }: { children: ReactNode; number?: string; icon?: string }) {
  const sectionIcons: Record<string, string> = { '01': 'activity', '02': 'network', '03': 'users', '04': 'send', '05': 'building', '06': 'chart', '07': 'dashboard', '08': 'calendar' };
  const name = icon || (number ? sectionIcons[number] : undefined);
  return (
    <div className="eyebrow">
      <span className="eyebrow-device">{name ? <Icon name={name} size={17} /> : <SignalMark />}</span>
      {children}
    </div>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  description,
  number,
  icon,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  number?: string;
  icon?: string;
}) {
  return (
    <div className="section-heading">
      <Eyebrow number={number} icon={icon}>{eyebrow}</Eyebrow>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
export function Breadcrumb({
  current,
  parent,
}: {
  current: string;
  parent?: { name: string; href: string };
}) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      <ChevronRight size={13} aria-hidden="true" />
      {parent && (
        <>
          <Link href={parent.href}>{parent.name}</Link>
          <ChevronRight size={13} aria-hidden="true" />
        </>
      )}
      <span aria-current="page">{current}</span>
    </nav>
  );
}
