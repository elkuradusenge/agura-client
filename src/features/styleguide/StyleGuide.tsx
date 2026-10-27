/** Living style guide: palette, type, controls, states and the accessibility rules. */

import { AlertTriangle, CheckCircle2, Leaf, Sprout } from "lucide-react";
import { useI18n } from "../../lib/i18n";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Field,
  Input,
  ProgressBar,
  Select,
  Skeleton,
  Textarea,
} from "../../components/ui";
import { CompositionPieChart, ShareBarChart, TrendLineChart } from "../../components/charts";

const SWATCHES = [
  { name: "leaf-600", className: "bg-leaf-600", note: "Primary action" },
  { name: "leaf-100", className: "bg-leaf-100", note: "Selected surface" },
  { name: "earth-800", className: "bg-earth-800", note: "Body text, dark surface" },
  { name: "earth-100", className: "bg-earth-100", note: "Raised surface" },
  { name: "amber-500", className: "bg-amber-500", note: "Attention, never alone" },
  { name: "danger-500", className: "bg-danger-500", note: "Destructive" },
];

const SAMPLE = [
  { label: "Kigali", value: 0.042 },
  { label: "Northern", value: 0.018 },
  { label: "Southern", value: 0.026 },
  { label: "Eastern", value: 0.011 },
];

export function StyleGuide() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold">AGUra style guide</h1>
        <p className="muted text-sm">
          One typeface (Syne), one icon set (Lucide), status always carrying text, and 44px minimum tap targets.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Palette</h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {SWATCHES.map((swatch) => (
            <li key={swatch.name} className="card space-y-2">
              <div className={`h-12 rounded-lg ${swatch.className}`} />
              <p className="text-sm font-medium">{swatch.name}</p>
              <p className="muted text-xs">{swatch.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Type scale</h2>
        <Card className="space-y-2">
          <p className="text-3xl font-bold">3xl / Display</p>
          <p className="text-2xl font-bold">2xl / Page title</p>
          <p className="text-lg font-semibold">lg / Section</p>
          <p className="text-base">base / Body copy, minimum 16px on mobile</p>
          <p className="muted text-sm">sm / Secondary, never the only carrier of meaning</p>
          <p className="muted text-xs">xs / Timestamps only</p>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Controls</h2>
        <Card className="flex flex-wrap items-center gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="danger">Danger</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </Card>
        <Card className="grid gap-3 sm:grid-cols-2">
          <Field label="Label" htmlFor="sgInput" hint="Helper text">
            <Input id="sgInput" placeholder="Placeholder" />
          </Field>
          <Field label="Required" htmlFor="sgSelect" required error="This field is required">
            <Select id="sgSelect">
              <option>Option</option>
            </Select>
          </Field>
          <Field label="Multiline" htmlFor="sgTextarea">
            <Textarea id="sgTextarea" rows={3} />
          </Field>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Status</h2>
        <Card className="flex flex-wrap gap-2">
          <Badge tone="success" icon={<CheckCircle2 aria-hidden className="h-3.5 w-3.5" />}>
            {t("status.trackable")}
          </Badge>
          <Badge tone="warning" icon={<AlertTriangle aria-hidden className="h-3.5 w-3.5" />}>
            {t("status.suppressed")}
          </Badge>
          <Badge tone="neutral">{t("status.draft")}</Badge>
          <Badge tone="info">{t("status.paused")}</Badge>
          <Badge tone="danger">{t("status.retired")}</Badge>
        </Card>
        <Card>
          <ProgressBar value={64} label={t("plantings.progress")} />
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">States</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-24" />
          <EmptyState title={t("common.empty")} icon={<Leaf aria-hidden className="h-8 w-8 text-leaf-600" />} />
          <ErrorState title={t("common.error")} retryLabel={t("common.retry")} onRetry={() => undefined} />
          <Card>
            <p className="flex items-center gap-2 text-sm">
              <Sprout aria-hidden className="h-4 w-4 text-leaf-600" />
              Offline and low-data states keep the last good data on screen.
            </p>
          </Card>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Charts</h2>
        <Card>
          <ShareBarChart data={SAMPLE} />
        </Card>
        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <TrendLineChart data={SAMPLE} />
          </Card>
          <Card>
            <CompositionPieChart data={SAMPLE} />
          </Card>
        </div>
      </section>
    </div>
  );
}
