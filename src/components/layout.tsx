/** Layout shells: farmer navigation, admin sidebar, language and theme controls. */

import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Bell,
  BookOpen,
  ClipboardList,
  FileSpreadsheet,
  Home,
  Languages,
  LayoutDashboard,
  Leaf,
  LineChart,
  LogOut,
  MessageSquare,
  Moon,
  Settings,
  Sparkles,
  Sprout,
  Sun,
  Users,
  Wallet,
  WifiOff,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "../lib/api";
import { useI18n } from "../lib/i18n";
import { SUPPORTED_LANGUAGES, LANGUAGE_LABELS, type Language } from "../lib/i18n/types";
import { cn } from "../lib/utils";
import { usePreferences } from "../app/providers";
import { useSocket } from "../app/providers";
import { useAuth } from "../features/auth/AuthProvider";
import { Badge, Button } from "./ui";

interface NavItem {
  to: string;
  labelKey: string;
  icon: ReactNode;
  badge?: number;
}

function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();
  const { setTheme, theme, lowData, setLowData } = usePreferences();
  const label = useI18n().t("common.language");

  return (
    <div className="flex items-center gap-1">
      <span className="sr-only">{label}</span>
      <Languages aria-hidden className="h-4 w-4" />
      <select
        aria-label={label}
        className="tap-target rounded-lg border border-earth-300 bg-white px-2 text-sm dark:border-earth-600 dark:bg-earth-800"
        value={language}
        onChange={(event) => setLanguage(event.target.value as Language)}
      >
        {SUPPORTED_LANGUAGES.map((code) => (
          <option key={code} value={code}>
            {LANGUAGE_LABELS[code]}
          </option>
        ))}
      </select>
      <button
        type="button"
        aria-label={useI18n().t("common.theme")}
        className="tap-target rounded-lg p-2 hover:bg-earth-100 dark:hover:bg-earth-700"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? <Sun aria-hidden className="h-4 w-4" /> : <Moon aria-hidden className="h-4 w-4" />}
      </button>
      <button
        type="button"
        aria-pressed={lowData}
        aria-label={useI18n().t("common.lowData")}
        className={cn(
          "tap-target rounded-lg px-2 py-2 text-xs font-medium",
          lowData ? "bg-amber-500 text-earth-900" : "hover:bg-earth-100 dark:hover:bg-earth-700",
        )}
        onClick={() => setLowData(!lowData)}
      >
        1x
      </button>
    </div>
  );
}

export function OfflineBanner() {
  const { online } = usePreferences();
  const { t } = useI18n();
  const { status } = useSocket();
  if (online && status !== "reconnecting") return null;
  return (
    <div
      className="flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-sm font-medium text-earth-900"
      role="status"
    >
      <WifiOff aria-hidden className="h-4 w-4" />
      {t("common.offline")}
    </div>
  );
}

function useUnreadCount(enabled: boolean) {
  const { data } = useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: notificationsApi.unreadCount,
    enabled,
    refetchInterval: 60_000,
  });
  return data?.unread ?? 0;
}

export function FarmerLayout({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const unread = useUnreadCount(Boolean(user));

  const items: NavItem[] = [
    { to: "/app/products", labelKey: "nav.products", icon: <Leaf aria-hidden className="h-5 w-5" /> },
    { to: "/app/plantings", labelKey: "nav.plantings", icon: <Sprout aria-hidden className="h-5 w-5" /> },
    { to: "/app/today", labelKey: "nav.today", icon: <ClipboardList aria-hidden className="h-5 w-5" /> },
    {
      to: "/app/notifications",
      labelKey: "nav.notifications",
      icon: <Bell aria-hidden className="h-5 w-5" />,
      badge: unread,
    },
    { to: "/app/help", labelKey: "nav.help", icon: <MessageSquare aria-hidden className="h-5 w-5" /> },
    { to: "/app/settings", labelKey: "nav.settings", icon: <Settings aria-hidden className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <OfflineBanner />
      <header className="border-b border-earth-200 bg-white/80 backdrop-blur dark:border-earth-700 dark:bg-earth-800/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <Leaf aria-hidden className="h-6 w-6 text-leaf-600" />
            <span className="text-lg font-semibold">{t("app.name")}</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              aria-label={t("auth.signOut")}
              onClick={async () => {
                await signOut();
                navigate("/");
              }}
            >
              <LogOut aria-hidden className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <nav
        aria-label={t("nav.products")}
        className="fixed bottom-0 left-0 right-0 z-20 border-t border-earth-200 bg-white lg:hidden dark:border-earth-700 dark:bg-earth-800"
      >
        <ul className="flex">
          {items.slice(0, 4).map((item) => (
            <li key={item.to} className="flex-1">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "tap-target flex flex-col items-center gap-1 py-2 text-[11px]",
                    isActive ? "text-leaf-700 dark:text-leaf-200" : "muted",
                  )
                }
              >
                {item.icon}
                <span>{t(item.labelKey)}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="absolute mt-0 rounded-full bg-amber-500 px-1.5 text-[10px] font-semibold text-earth-900">
                    {item.badge}
                  </span>
                ) : null}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-auto flex max-w-5xl gap-6 px-4 py-6">
        <aside className="hidden w-56 shrink-0 lg:block">
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "tap-target flex items-center justify-between rounded-xl px-3 py-2 text-sm",
                      isActive
                        ? "bg-leaf-100 font-semibold text-leaf-800 dark:bg-earth-700 dark:text-leaf-100"
                        : "hover:bg-earth-100 dark:hover:bg-earth-700",
                    )
                  }
                >
                  <span className="flex items-center gap-2">
                    {item.icon}
                    {t(item.labelKey)}
                  </span>
                  {item.badge && item.badge > 0 ? <Badge tone="warning">{item.badge}</Badge> : null}
                </NavLink>
              </li>
            ))}
          </ul>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const { signOut, admin } = useAuth();
  const navigate = useNavigate();
  const can = (permission: string) => admin?.permissions.includes(permission) ?? false;

  const items: NavItem[] = [
    { to: "/admin", labelKey: "nav.dashboard", icon: <LayoutDashboard aria-hidden className="h-5 w-5" /> },
    {
      to: "/admin/surveys",
      labelKey: "nav.surveyData",
      icon: <FileSpreadsheet aria-hidden className="h-5 w-5" />,
    },
    { to: "/admin/plants", labelKey: "nav.plants", icon: <Leaf aria-hidden className="h-5 w-5" /> },
    { to: "/admin/suggestions", labelKey: "nav.suggestions", icon: <Sparkles aria-hidden className="h-5 w-5" /> },
    { to: "/admin/products", labelKey: "nav.adminProducts", icon: <BookOpen aria-hidden className="h-5 w-5" /> },
    { to: "/admin/users", labelKey: "nav.users", icon: <Users aria-hidden className="h-5 w-5" /> },
    { to: "/admin/monitoring", labelKey: "nav.monitoring", icon: <LineChart aria-hidden className="h-5 w-5" /> },
    {
      to: "/admin/requests",
      labelKey: "nav.specialistRequests",
      icon: <MessageSquare aria-hidden className="h-5 w-5" />,
    },
    { to: "/admin/funding", labelKey: "nav.fundingInterest", icon: <Wallet aria-hidden className="h-5 w-5" /> },
    { to: "/admin/templates", labelKey: "nav.templates", icon: <Bell aria-hidden className="h-5 w-5" /> },
    { to: "/admin/audit", labelKey: "nav.auditLog", icon: <Home aria-hidden className="h-5 w-5" /> },
    { to: "/admin/settings", labelKey: "nav.settings2", icon: <Settings aria-hidden className="h-5 w-5" /> },
  ];

  const visible = items.filter((item) => {
    if (item.to === "/admin/users") return can("users.read");
    if (item.to === "/admin/audit") return can("audit.read");
    if (item.to === "/admin/monitoring") return can("monitoring.read");
    if (item.to === "/admin/requests" || item.to === "/admin/funding") return can("support.read");
    if (item.to === "/admin/templates") return can("templates.write") || can("support.read");
    if (item.to === "/admin/settings") return can("settings.write") || can("users.read");
    if (item.to === "/admin/surveys" || item.to === "/admin/plants") return can("surveys.read") || can("analysis.read");
    if (item.to === "/admin/suggestions") return can("analysis.read");
    if (item.to === "/admin/products") return can("products.read");
    return true;
  });

  return (
    <div className="min-h-screen">
      <OfflineBanner />
      <header className="border-b border-earth-200 bg-white dark:border-earth-700 dark:bg-earth-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <Leaf aria-hidden className="h-6 w-6 text-leaf-600" />
            <span className="text-lg font-semibold">{t("app.name")}</span>
            {admin ? <Badge tone="info">{admin.role}</Badge> : null}
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              aria-label={t("auth.signOut")}
              onClick={async () => {
                await signOut();
                navigate("/admin/sign-in");
              }}
            >
              <LogOut aria-hidden className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
        <aside className="hidden w-60 shrink-0 md:block">
          <nav aria-label={t("nav.dashboard")}>
            <ul className="space-y-1">
              {visible.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === "/admin"}
                    className={({ isActive }) =>
                      cn(
                        "tap-target flex items-center gap-2 rounded-xl px-3 py-2 text-sm",
                        isActive
                          ? "bg-leaf-100 font-semibold text-leaf-800 dark:bg-earth-700 dark:text-leaf-100"
                          : "hover:bg-earth-100 dark:hover:bg-earth-700",
                      )
                    }
                  >
                    {item.icon}
                    {t(item.labelKey)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
