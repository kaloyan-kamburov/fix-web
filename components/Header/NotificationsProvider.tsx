"use client";

import * as React from "react";
import { api } from "@/lib/api";

type NotificationsContextValue = {
  notifications: any[];
  refresh: () => Promise<void>;
  loading: boolean;
};

const NotificationsContext =
  React.createContext<NotificationsContextValue | null>(null);

export function useNotifications(): NotificationsContextValue {
  const ctx = React.useContext(NotificationsContext);
  return ctx || { notifications: [], refresh: async () => {}, loading: false };
}

export function NotificationsProvider({
  children,
  isEnabled,
  intervalMs = 45000,
}: {
  children: React.ReactNode;
  isEnabled: boolean;
  intervalMs?: number;
}) {
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const load = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("client/notifications");
      const raw = res?.data;
      const list = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
        ? raw.data
        : [];
      setNotifications(list);
    } catch {
      // noop
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!isEnabled) {
      setNotifications([]);
      return;
    }
    let mounted = true;
    load();
    const id = setInterval(() => {
      if (mounted) load();
    }, intervalMs);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [isEnabled, intervalMs, load]);

  const value = React.useMemo(
    () => ({ notifications, refresh: load, loading }),
    [notifications, load, loading]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}
