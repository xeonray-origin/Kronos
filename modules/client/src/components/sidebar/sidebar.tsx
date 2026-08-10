import {
  AudioLines,
  Bell,
  CalendarDays,
  CircleHelp,
  ChartNoAxesCombined,
  ChevronDown,
  Download,
  Ellipsis,
  Inbox,
  PanelLeft,
  Plus,
  Search,
  TriangleAlert,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { labelColor } from '@/lib/labels';
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
  Button,
} from '@/components/base';
import type { LabelItemProps, NavLink, SidebarProps } from '@/types';

const defaultLinks: NavLink[] = [
  { icon: Inbox, label: 'Inbox', count: 8 },
  { icon: CalendarDays, label: 'Today', count: 2, active: true },
  { icon: CalendarDays, label: 'Upcoming' },
  { icon: ChartNoAxesCombined, label: 'Analyze' },
];

function NavItem({ icon: Icon, label, count, active }: NavLink) {
  return (
    <button
      className={cn(
        'flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors',
        active ? 'bg-brand/15 text-brand' : 'text-sidebar-foreground/90 hover:bg-sidebar-accent',
      )}
    >
      <Icon
        className={cn('size-[18px] shrink-0', active ? 'text-brand' : 'text-muted-foreground')}
      />
      <span className="flex-1 truncate text-left">{label}</span>
      {count != null && (
        <span className={cn('text-xs', active ? 'text-brand' : 'text-muted-foreground')}>
          {count}
        </span>
      )}
    </button>
  );
}

function LabelItem({ label, count, active, onSelect }: LabelItemProps) {
  return (
    <button
      onClick={() => onSelect?.(label)}
      className={cn(
        'flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors',
        active ? 'bg-brand/15 text-brand' : 'text-sidebar-foreground/90 hover:bg-sidebar-accent',
      )}
    >
      <span className={cn('size-2.5 shrink-0 rounded-full', labelColor(label).dot)} />
      <span className="flex-1 truncate text-left">{label}</span>
      <span className={cn('text-xs', active ? 'text-brand' : 'text-muted-foreground')}>
        {count}
      </span>
    </button>
  );
}

export function Sidebar({
  user = { name: 'Xeonray' },
  links = defaultLinks,
  labels = [],
  activeLabel,
  onSelectLabel,
}: SidebarProps) {
  return (
    <aside
      className="relative  h-dvh inset-y-0 left-0 z-40 flex w-70 flex-col 
    border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
    >
      <div className="flex items-center justify-between gap-1 px-3 pt-3 pb-1">
        <button
          className="flex min-w-0 items-center gap-2 rounded-md px-1.5 py-1 
        transition-colors hover:bg-sidebar-accent"
        >
          <Avatar>
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            <AvatarBadge className="bg-orange-500" />
          </Avatar>
          <span className="truncate font-semibold">{user.name}</span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Toggle sidebar">
            <PanelLeft className="text-muted-foreground" />
          </Button>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5 px-3">
        {links.map((link) => (
          <NavItem key={link.label} {...link} />
        ))}
      </nav>

      <div className="mt-5 flex flex-col gap-0.5 px-3">
        <h2 className="px-2.5 pb-1 text-sm font-semibold text-muted-foreground">Labels</h2>
        {labels.map((item) => (
          <LabelItem
            key={item.label}
            {...item}
            active={item.label === activeLabel}
            onSelect={onSelectLabel}
          />
        ))}
      </div>
    </aside>
  );
}
