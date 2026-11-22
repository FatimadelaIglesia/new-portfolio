"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

type ToastKind = "success" | "error";
type ToastItem = { id: number; kind: ToastKind; text: string };
type ToastApi = { toast: (text: string, kind?: ToastKind) => void };

const ToastContext = createContext<ToastApi>({ toast: () => undefined });

export function useToast(): ToastApi {
  return useContext(ToastContext);
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setItems((previous) => previous.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (text: string, kind: ToastKind = "success") => {
      const id = nextId.current++;
      setItems((previous) => [...previous.slice(-2), { id, kind, text }]);
      window.setTimeout(() => dismiss(id), 5000);
    },
    [dismiss]
  );

  const api = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex flex-col items-center gap-2 px-4"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white shadow-lg ${
              item.kind === "error" ? "bg-red-700" : "bg-primary-dark"
            }`}
          >
            <span className="flex-1">{item.text}</span>
            <button
              type="button"
              onClick={() => dismiss(item.id)}
              aria-label="Dismiss notification"
              className="rounded px-1 text-base leading-none hover:bg-white/20"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
