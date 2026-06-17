import {
  AudioLines,
  Bell,
  CalendarDays,
  CircleHelp,
  ChartNoAxesCombined,
  ChevronDown,
  Download,
  Ellipsis,
  Hash,
  Inbox,
  PanelLeft,
  Plus,
  Search,
  TriangleAlert,
  Users,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
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

interface NavLink {
  icon: LucideIcon;
  label: string;
  count?: number;
  active?: boolean;
}

interface Project {
  name: string;
  emoji?: string;
  shared?: boolean;
  count?: number;
}

interface SidebarProps {
  user?: { name: string; avatarUrl?: string };
  links?: NavLink[];
  projects?: Project[];
}

const defaultLinks: NavLink[] = [
  { icon: Search, label: 'Search' },
  { icon: Inbox, label: 'Inbox', count: 8 },
  { icon: CalendarDays, label: 'Today', count: 2, active: true },
  { icon: CalendarDays, label: 'Upcoming' },
  { icon: ChartNoAxesCombined, label: 'Reporting' },
  { icon: Ellipsis, label: 'More' },
];

const defaultProjects: Project[] = [
  { name: 'Grocery List', emoji: '🍎', shared: true, count: 4 },
  { name: 'Blog topics', count: 5 },
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

function ProjectItem({ name, emoji, shared, count }: Project) {
  return (
    <button className="flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium text-sidebar-foreground/90 transition-colors hover:bg-sidebar-accent">
      <Hash className="size-[18px] shrink-0 text-emerald-500" />
      <span className="flex items-center gap-1.5 truncate text-left">
        {name}
        {emoji && <span aria-hidden>{emoji}</span>}
      </span>
      {shared && <Users className="size-4 shrink-0 text-muted-foreground" />}
      <span className="flex-1" />
      {count != null && <span className="text-xs text-muted-foreground">{count}</span>}
    </button>
  );
}

export function Sidebar({
  user = { name: 'Xeonray' },
  links = defaultLinks,
  projects = defaultProjects,
}: SidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex items-center justify-between gap-1 px-3 pt-3 pb-1">
        <button className="flex min-w-0 items-center gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-sidebar-accent">
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
        <h2 className="px-2.5 pb-1 text-sm font-semibold text-muted-foreground">My Projects</h2>
        {projects.map((project) => (
          <ProjectItem key={project.name} {...project} />
        ))}
      </div>

      <div className="flex-1" />

      <button
        className="flex items-center gap-3 border-t border-sidebar-border px-5 py-3 text-sm font-medium 
      text-sidebar-foreground/90 transition-colors hover:bg-sidebar-accent"
      >
        <CircleHelp className="size-[18px] text-muted-foreground" />
        Help & resources
      </button>
    </aside>
  );
}
