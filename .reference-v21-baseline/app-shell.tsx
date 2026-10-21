import { Atmosphere } from "./today/atmosphere";
import "./today/today.css";
import "./app-shell.css";
import "./finance/overview.css";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Flag,
  ChartNoAxesCombined,
  Dumbbell,
  GraduationCap,
  BookOpen,
  ListTodo,
  LogOut,
  Bell,
  Repeat,
  Wallet,
  Search,
  Settings as SettingsIcon,
  UserRound,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { OfflineBanner } from "@/components/lifeos/states";
import {
  CommandPalette,
  useCommandPalette,
} from "@/components/lifeos/command-palette";
import { sessionQuery, useSignOut } from "@/lib/queries";
import { useOnline } from "@/hooks/use-online";
import { cn } from "@/lib/utils";
import { LifeOSLogo } from "@/components/lifeos/lifeos-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "@/components/lifeos/theme";
import { ProductTour } from "@/components/lifeos/product-tour";
import { getDataSource } from "@/lib/api";
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type LifeOSNotification,
} from "@/lib/api/notifications";

const NAV = [
  { to: "/", label: "Today", icon: ListTodo, accent: "var(--aurora-teal)" },
  {
    to: "/finances",
    label: "Finances",
    icon: Wallet,
    accent: "var(--module-finances)",
    tracker: "finances",
  },
  {
    to: "/habits",
    label: "Habits",
    icon: Repeat,
    accent: "var(--module-habits)",
    tracker: "habits",
  },
  {
    to: "/gym",
    label: "Gym",
    icon: Dumbbell,
    accent: "var(--module-gym)",
    tracker: "gym",
  },
  {
    to: "/reading",
    label: "Reading",
    icon: BookOpen,
    accent: "var(--module-reading)",
    tracker: "reading",
  },
  {
    to: "/study",
    label: "Study",
    icon: GraduationCap,
    accent: "var(--module-study)",
    tracker: "study",
  },
  { to: "/goals", label: "Goals", icon: Flag, accent: "var(--module-goals)" },
  {
    to: "/analytics",
    label: "Analytics",
    icon: ChartNoAxesCombined,
    accent: "var(--module-analytics)",
  },
  {
    to: "/settings",
    label: "Settings",
    icon: SettingsIcon,
    accent: "var(--aurora-neutral)",
  },
] as const;

const HEADER_BACKGROUNDS = {
  "/finances": {
    dark: "/finances-aurora-bg.png",
    light: "/finances-aurora-bg-light.png",
  },
  "/habits": {
    dark: "/habits-aurora-bg.png",
    light: "/habits-aurora-bg-light.png",
  },
  "/gym": {
    dark: "/gym-aurora-bg.png",
    light: "/gym-aurora-bg-light.png",
  },
  "/reading": {
    dark: "/reading-aurora-bg.png",
    light: "/reading-aurora-bg-light.png",
  },
  "/study": {
    dark: "/study-aurora-bg.png",
    light: "/study-aurora-bg-light.png",
  },
  "/goals": {
    dark: "/goals-aurora-bg.png",
    light: "/goals-aurora-bg-light.png",
  },
  "/analytics": {
    dark: "/analytics-aurora-bg.png",
    light: "/analytics-aurora-bg-light.png",
  },
  "/settings": {
    dark: "/settings-aurora-bg.png",
    light: "/settings-aurora-bg-light.png",
  },
  "/profile": {
    dark: "/profile-aurora-bg.png",
    light: "/profile-aurora-bg-light.png",
  },
} as const;

const DEFAULT_HEADER_BACKGROUNDS = {
  dark: "/aurora-bg.png",
  light: "/aurora-bg-light.png",
} as const;

const notificationKey = ["notifications"] as const;
const headerImages = [
  ...Object.values(DEFAULT_HEADER_BACKGROUNDS),
  ...new Set(
    Object.values(HEADER_BACKGROUNDS).flatMap((backgrounds) =>
      Object.values(backgrounds),
    ),
  ),
];
const loadedHeaders = new Map<string, Promise<void>>();
let previousHeader: string | null = null;
let didPreloadHeaders = false;

function loadHeader(image: string) {
  const existing = loadedHeaders.get(image);
  if (existing) return existing;
  const loaded = new Promise<void>((resolve) => {
    const asset = new Image();
    asset.src = image;
    asset.onload = () =>
      void asset
        .decode()
        .catch(() => undefined)
        .finally(resolve);
    asset.onerror = () => resolve();
  });
  loadedHeaders.set(image, loaded);
  return loaded;
}

function AuroraBackground({ image }: { image: string }) {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(previousHeader ?? image);
  const [incoming, setIncoming] = useState<string | null>(null);
  const target = useRef(image);

  useEffect(() => {
    if (didPreloadHeaders) return;
    didPreloadHeaders = true;
    headerImages.forEach((asset) => void loadHeader(asset));
  }, []);

  useEffect(() => {
    target.current = image;
    if (image === visible) {
      previousHeader = image;
      return;
    }
    let cancelled = false;
    void loadHeader(image).then(() => {
      if (cancelled || target.current !== image) return;
      if (reduceMotion) {
        previousHeader = image;
        setVisible(image);
        setIncoming(null);
      } else {
        setIncoming(image);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [image, reduceMotion, visible]);

  useEffect(() => {
    if (!incoming) return;
    const timeout = window.setTimeout(() => {
      if (target.current !== incoming) return;
      previousHeader = incoming;
      setVisible(incoming);
      setIncoming(null);
    }, 500);
    return () => window.clearTimeout(timeout);
  }, [incoming]);

  return (
    <div className="lifeos-header-aurora" aria-hidden="true">
      <AuroraLayer image={visible} />
      {incoming ? (
        <motion.div
          key={incoming}
          className="lifeos-header-aurora-crossfade"
          style={{ backgroundImage: `url("${incoming}")` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          onAnimationComplete={() => {
            if (target.current !== incoming) return;
            previousHeader = incoming;
            setVisible(incoming);
            setIncoming(null);
          }}
        />
      ) : null}
    </div>
  );
}

function AuroraLayer({ image }: { image: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className="lifeos-header-aurora-layer"
      style={{ backgroundImage: `url("${image}")` }}
      initial={false}
      animate={
        reduceMotion
          ? undefined
          : {
              scale: [1, 1.1, 1],
              x: ["0%", "-2%", "0%"],
              y: ["0%", "1%", "0%"],
            }
      }
      transition={{
        duration: 30,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      }}
    />
  );
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function NotificationContent({
  notification,
}: {
  notification: LifeOSNotification;
}) {
  return (
    <>
      <span
        aria-hidden="true"
        className={cn(
          "mt-1.5 size-2 shrink-0 rounded-full",
          notification.readAt ? "bg-muted-foreground/30" : "bg-primary",
        )}
      />
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block truncate text-xs",
            !notification.readAt && "font-semibold",
          )}
        >
          {notification.title}
        </span>
        {notification.message ? (
          <span className="mt-0.5 line-clamp-2 block text-[11px] leading-relaxed text-muted-foreground">
            {notification.message}
          </span>
        ) : null}
        <span className="mt-1 block text-[10px] text-muted-foreground">
          {formatDistanceToNow(new Date(notification.occurredAt), {
            addSuffix: true,
          })}
        </span>
      </span>
    </>
  );
}

export function AppShell({
  children,
  title,
  subtitle,
  actions,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const { open, setOpen } = useCommandPalette();
  const online = useOnline();
  const session = useQuery(sessionQuery);
  const queryClient = useQueryClient();
  const signOut = useSignOut();
  const { theme, setTheme } = useTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const financeOverview = pathname.replace(/\/$/, "") === "/finances";
  const moduleTheme = pathname.startsWith("/profile")
    ? "profile"
    : (NAV.find(
        ({ to }) => to !== "/" && pathname.startsWith(to),
      )?.label.toLowerCase() ?? "today");
  const headerBackgrounds =
    Object.entries(HEADER_BACKGROUNDS).find(([route]) =>
      pathname.startsWith(route),
    )?.[1] ?? DEFAULT_HEADER_BACKGROUNDS;
  const headerBackground = headerBackgrounds[theme];
  const profile =
    session.data?.status === "signed-in" ? session.data.profile : undefined;
  const notificationQuery = useQuery({
    queryKey: notificationKey,
    queryFn: listNotifications,
    enabled: Boolean(profile) && getDataSource() === "api",
  });
  const notifications = notificationQuery.data ?? [];
  const markRead = useMutation({
    mutationFn: markNotificationRead,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: notificationKey });
      queryClient.setQueryData<LifeOSNotification[]>(
        notificationKey,
        (current = []) =>
          current.map((notice) =>
            notice.id === id
              ? { ...notice, readAt: new Date().toISOString() }
              : notice,
          ),
      );
    },
    onSettled: () =>
      void queryClient.invalidateQueries({ queryKey: notificationKey }),
  });
  const markAllRead = useMutation({
    mutationFn: markAllNotificationsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationKey });
      const readAt = new Date().toISOString();
      queryClient.setQueryData<LifeOSNotification[]>(
        notificationKey,
        (current = []) =>
          current.map((notice) => ({
            ...notice,
            readAt: notice.readAt ?? readAt,
          })),
      );
    },
    onSettled: () =>
      void queryClient.invalidateQueries({ queryKey: notificationKey }),
  });
  const visibleNav = NAV.filter(
    (item) =>
      !("tracker" in item) || profile?.enabledModules.includes(item.tracker),
  );
  const mobileNav = visibleNav.filter((item) =>
    ["/", "/finances", "/habits", "/analytics", "/goals", "/settings"].includes(
      item.to,
    ),
  );
  const hasUnreadNotifications = notifications.some(
    (notification) => !notification.readAt,
  );

  return (
    <div
      data-profile-accent={
        moduleTheme === "profile" ? profile?.profileAccent : undefined
      }
      className={cn(
        "lifeos-app-shell h-dvh overflow-hidden bg-background text-foreground",
        `theme-${moduleTheme}`,
        pathname === "/" && "lifeos-v0",
        financeOverview && "finance-overview-shell",
      )}
    >
      {pathname === "/" && <Atmosphere />}
      {financeOverview && (
        <div className="hidden lg:block">
          <Atmosphere />
        </div>
      )}
      <CommandPalette open={open} onOpenChange={setOpen} />
      {profile && <ProductTour profile={profile} />}
      <div className="relative z-[1] flex h-full w-full min-w-0">
        {/* Desktop sidebar */}
        <aside
          aria-label="Desktop navigation"
          data-collapsed="true"
          className="lifeos-sidebar hidden shrink-0 flex-col lg:flex"
        >
          <div className="lifeos-sidebar-brand-slot shrink-0">
            <Link
              to="/"
              aria-label="LifeOS home"
              className="lifeos-sidebar-brand grid h-11 w-11 place-items-center rounded-2xl"
            >
              <LifeOSLogo />
            </Link>
          </div>
          <TooltipProvider delayDuration={100}>
            <nav
              aria-label="Primary"
              className="lifeos-primary-nav flex min-h-0 flex-1 flex-col"
            >
              {visibleNav
                .filter((item) => item.to !== "/settings")
                .map(({ to, label, icon: Icon, accent }) => {
                  const active =
                    to === "/" ? pathname === "/" : pathname.startsWith(to);
                  return (
                    <Tooltip key={to}>
                      <TooltipTrigger asChild>
                        <Link
                          to={to}
                          aria-label={label}
                          aria-current={active ? "page" : undefined}
                          data-active={active}
                          style={{ "--nav-accent": accent } as CSSProperties}
                          className="lifeos-sidebar-link grid h-11 w-11 shrink-0 place-items-center rounded-2xl"
                        >
                          <Icon aria-hidden="true" className="size-[19px]" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent
                        data-module-tooltip={label.toLowerCase()}
                        side="right"
                        sideOffset={8}
                      >
                        {label}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
            </nav>
            <nav
              aria-label="Account"
              className="lifeos-account-nav mt-4 flex shrink-0 flex-col items-center gap-1 border-t border-border pt-3"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/settings"
                    aria-label="Settings"
                    aria-current={
                      pathname.startsWith("/settings") ? "page" : undefined
                    }
                    data-active={pathname.startsWith("/settings")}
                    className="lifeos-sidebar-link grid h-11 w-11 place-items-center rounded-2xl"
                  >
                    <SettingsIcon aria-hidden="true" className="size-[19px]" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  Settings
                </TooltipContent>
              </Tooltip>
              {profile && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Sign out"
                      disabled={signOut.isPending}
                      className="h-11 w-11 rounded-2xl"
                      onClick={() => signOut.mutate()}
                    >
                      <LogOut className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    Sign out
                  </TooltipContent>
                </Tooltip>
              )}
            </nav>
          </TooltipProvider>
        </aside>

        {/* Main column */}
        <div
          data-app-scroll-container
          className="h-full min-w-0 flex-1 overflow-y-scroll pb-20 lg:pb-0"
        >
          <OfflineBanner online={online} />

          <header className="lifeos-page-header sticky top-0 z-50 overflow-visible">
            <AuroraBackground image={headerBackground} />
            <div className="relative z-10 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
              <div
                data-tour="today-overview"
                className="lifeos-header-copy min-w-0"
              >
                <h1 className="line-clamp-2 break-words text-xl leading-tight font-bold text-[var(--page-header-foreground)] sm:text-3xl">
                  {title}
                </h1>
                {subtitle ? (
                  <p className="mt-0.5 line-clamp-2 text-xs text-[var(--page-header-muted-foreground)]">
                    {subtitle}
                  </p>
                ) : null}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="lifeos-header-search hidden min-w-40 items-center gap-2 rounded-md border border-border bg-background px-2.5 py-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:flex"
                  aria-label="Search LifeOS"
                >
                  <Search className="size-3.5" />
                  <span className="flex-1 text-left">Search</span>
                  <kbd className="num rounded border border-border px-1 py-0.5 text-[10px]">
                    ⌘K
                  </kbd>
                </button>
                <Button
                  variant="outline"
                  size="icon"
                  className="lifeos-header-control sm:hidden"
                  aria-label="Open command palette"
                  onClick={() => setOpen(true)}
                >
                  <Search className="size-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="lifeos-header-control relative grid aspect-square size-9 place-items-center rounded-full p-0"
                      aria-label="Notifications"
                    >
                      <Bell className="size-4" />
                      {hasUnreadNotifications ? (
                        <span
                          aria-hidden="true"
                          data-notification-unread-indicator
                          className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[#ff7185] ring-2 ring-[#102039]/70"
                        />
                      ) : null}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    data-notification-popover
                    align="end"
                    className="w-64 overflow-hidden rounded-xl p-2"
                  >
                    <DropdownMenuLabel className="flex items-center justify-between gap-3">
                      <span>Notifications</span>
                      {hasUnreadNotifications ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-[11px]"
                          disabled={markAllRead.isPending}
                          onClick={(event) => {
                            event.preventDefault();
                            markAllRead.mutate();
                          }}
                        >
                          Mark all read
                        </Button>
                      ) : null}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notificationQuery.isPending &&
                    getDataSource() === "api" ? (
                      <p className="px-2 py-5 text-center text-xs text-muted-foreground">
                        Loading notifications...
                      </p>
                    ) : notifications.length ? (
                      <div className="scrollbar-subtle max-h-80 overflow-y-auto">
                        {notifications.map((notification) => (
                          <DropdownMenuItem
                            key={notification.id}
                            asChild={Boolean(notification.actionPath)}
                            className={cn(
                              "my-1 items-start gap-2 rounded-lg px-2 py-2.5",
                              !notification.readAt && "bg-primary/7",
                            )}
                            onSelect={() =>
                              !notification.readAt &&
                              markRead.mutate(notification.id)
                            }
                          >
                            {notification.actionPath ? (
                              <a href={notification.actionPath}>
                                <NotificationContent
                                  notification={notification}
                                />
                              </a>
                            ) : (
                              <NotificationContent
                                notification={notification}
                              />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </div>
                    ) : (
                      <p className="px-2 py-5 text-center text-xs text-muted-foreground">
                        No new notifications
                      </p>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="lifeos-header-control grid size-9 place-items-center rounded-full"
                      aria-label="Profile menu"
                    >
                      <Avatar className="size-7">
                        {profile?.avatarUrl ? (
                          <AvatarImage src={profile.avatarUrl} alt="" />
                        ) : null}
                        <AvatarFallback className="finance-header-avatar-fallback bg-white/14 text-[10px] font-semibold text-white">
                          {initials(profile?.name ?? "Account")}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="min-w-0">
                      <span className="block truncate">
                        {profile?.name ?? "Account"}
                      </span>
                      {profile?.email ? (
                        <span className="block truncate text-xs font-normal text-muted-foreground">
                          {profile.email}
                        </span>
                      ) : null}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">
                        <UserRound />
                        View profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings">
                        <SettingsIcon />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                      }
                    >
                      {theme === "dark" ? "Use light mode" : "Use dark mode"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      disabled={signOut.isPending}
                      onSelect={() => signOut.mutate()}
                    >
                      <LogOut />
                      {signOut.isPending ? "Signing out…" : "Sign out"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {actions}
              </div>
            </div>
          </header>

          <main className="lifeos-main-content relative z-10 px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile navigation */}
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        <ul className="grid grid-cols-6">
          {mobileNav.map(({ to, label, icon: Icon }) => {
            const active =
              to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <li key={to}>
                <Link
                  to={to}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-12 min-w-0 flex-col items-center justify-center gap-0.5 px-0.5 py-1.5 text-[10px] leading-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring min-[380px]:gap-1 min-[380px]:text-[11px]",
                    active
                      ? "bg-primary/8 font-medium text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  <span className="max-w-full truncate">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
