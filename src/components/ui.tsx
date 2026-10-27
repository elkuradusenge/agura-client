/** Buttons, inputs and the shared visual vocabulary. Lucide icons only. */

import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "warning";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-leaf-600 text-white hover:bg-leaf-700 disabled:bg-leaf-300",
  secondary:
    "bg-earth-100 text-earth-900 hover:bg-earth-200 dark:bg-earth-700 dark:text-earth-50 dark:hover:bg-earth-600",
  ghost: "bg-transparent text-leaf-700 hover:bg-leaf-50 dark:text-leaf-200 dark:hover:bg-earth-700",
  danger: "bg-danger-500 text-white hover:bg-danger-600",
  warning: "bg-amber-500 text-earth-900 hover:bg-amber-600",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  loading = false,
  icon,
  fullWidth = false,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        "tap-target inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-medium transition",
        "disabled:cursor-not-allowed disabled:opacity-70",
        VARIANTS[variant],
        fullWidth && "w-full",
        className,
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}

export interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  htmlFor?: string;
}

export function Field({ label, hint, error, required, children, htmlFor }: FieldProps) {
  return (
    <label className="block space-y-1.5" htmlFor={htmlFor}>
      <span className="block text-sm font-medium">
        {label}
        {required ? <span className="text-danger-500"> *</span> : null}
      </span>
      {children}
      {hint ? <span className="muted block text-xs">{hint}</span> : null}
      {error ? (
        <span className="block text-xs text-danger-500" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}

const CONTROL =
  "tap-target w-full rounded-xl border border-earth-300 bg-white px-3 py-2 text-earth-900 placeholder:text-earth-400 " +
  "dark:border-earth-600 dark:bg-earth-800 dark:text-earth-50 dark:placeholder:text-earth-400";

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(CONTROL, className)} {...rest} />;
}

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(CONTROL, "min-h-24", className)} {...rest} />;
}

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(CONTROL, className)} {...rest}>
      {children}
    </select>
  );
}

type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info";

const BADGE_TONES: Record<BadgeTone, string> = {
  neutral: "bg-earth-100 text-earth-800 dark:bg-earth-700 dark:text-earth-100",
  success: "bg-leaf-100 text-leaf-800 dark:bg-leaf-800 dark:text-leaf-50",
  warning: "bg-amber-400/25 text-earth-900 dark:text-amber-400",
  danger: "bg-danger-500/15 text-danger-600 dark:text-danger-500",
  info: "bg-leaf-50 text-leaf-700 dark:bg-earth-700 dark:text-leaf-100",
};

/**
 * Status is never shown by colour alone: every badge carries a text label, which
 * is what a screen reader announces and what a colour blind user reads.
 */
export function Badge({
  tone = "neutral",
  children,
  icon,
}: {
  tone?: BadgeTone;
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        BADGE_TONES[tone],
      )}
    >
      {icon}
      {children}
    </span>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("card", className)}>{children}</div>;
}

export function ProgressBar({ value, label }: { value: number; label: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className="h-2.5 w-full overflow-hidden rounded-full bg-earth-200 dark:bg-earth-700"
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className="h-full rounded-full bg-leaf-600 transition-all" style={{ width: `${clamped}%` }} />
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-earth-200 dark:bg-earth-700", className)} />;
}

export function EmptyState({
  title,
  body,
  icon,
  action,
}: {
  title: string;
  body?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-earth-300 p-8 text-center dark:border-earth-600">
      {icon}
      <p className="font-semibold">{title}</p>
      {body ? <p className="muted text-sm">{body}</p> : null}
      {action}
    </div>
  );
}

export function ErrorState({ title, body, onRetry, retryLabel }: { title: string; body?: string; onRetry?: () => void; retryLabel: string }) {
  return (
    <div className="rounded-2xl border border-danger-500/40 bg-danger-500/5 p-6" role="alert">
      <p className="font-semibold text-danger-600 dark:text-danger-500">{title}</p>
      {body ? <p className="muted mt-1 text-sm">{body}</p> : null}
      {onRetry ? (
        <Button variant="secondary" className="mt-3" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
