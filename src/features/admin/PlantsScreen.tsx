/** Plants: mushroom adoption from the census, with suppressed cells shown honestly. */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminAnalysisApi } from "../../lib/api";
import { useI18n } from "../../lib/i18n";
import { formatNumber, formatPercent } from "../../lib/utils";
import { Badge, Card, ErrorState, Select, Skeleton } from "../../components/ui";
import { ShareBarChart } from "../../components/charts";
import type { MushroomCell, SuppressedValue } from "../../lib/api/types";

const LEVELS = ["province", "district", "sector"] as const;

/** A suppressed cell is labelled, never silently zero. */
function Cell({ cell }: { cell: SuppressedValue }) {
  const { t } = useI18n();
  if (cell.suppressed) {
    return (
      <Badge tone="warning" icon={undefined}>
        {t(cell.translation_key ?? "status.suppressed")}
      </Badge>
    );
  }
  if (cell.value === null) return <span className="muted">-</span>;
  return <span>{formatPercent(cell.value)}</span>;
}

export function PlantsScreen() {
  const { t } = useI18n();
  const [level, setLevel] = useState<string>("province");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-analysis", "mushroom", level],
    queryFn: () => adminAnalysisApi.mushroom({ level }),
  });

  const chart = (data?.items ?? [])
    .filter((item: MushroomCell) => !item.share.suppressed && item.share.value !== null)
    .slice(0, 12)
    .map((item: MushroomCell) => ({
      label: item.province ?? item.district ?? item.sector ?? item.level,
      value: item.share.value,
    }));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">{t("nav.plants")}</h1>
        <div className="w-40">
          <Select aria-label="level" value={level} onChange={(event) => setLevel(event.target.value)}>
            {LEVELS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <Card className="space-y-2">
        <h2 className="font-semibold">Mushroom growing households</h2>
        <ShareBarChart data={chart} />
        <p className="muted text-xs">
          Small cells are withheld so no household can be identified. The threshold is a setting, not hard coded.
        </p>
      </Card>

      {isLoading ? <Skeleton className="h-40" /> : null}
      {isError ? (
        <ErrorState title={t("common.error")} retryLabel={t("common.retry")} onRetry={() => void refetch()} />
      ) : null}

      {data?.items.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">Mushroom summary by {level}</caption>
            <thead>
              <tr className="text-left">
                <th scope="col">{level}</th>
                <th scope="col">Households</th>
                <th scope="col">Growing</th>
                <th scope="col">Share</th>
                <th scope="col">Urban</th>
                <th scope="col">Rural</th>
                <th scope="col">Female headed</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item: MushroomCell) => (
                <tr key={`${item.level}-${item.province}-${item.district}-${item.sector}`} className="border-t border-earth-200 dark:border-earth-700">
                  <th scope="row" className="py-1.5 text-left font-medium">
                    {item.province ?? item.district ?? item.sector ?? item.level}
                  </th>
                  <td className="py-1.5">
                    {item.households_total.suppressed ? "-" : formatNumber(item.households_total.count)}
                  </td>
                  <td className="py-1.5">
                    {item.mushroom_households.suppressed ? "-" : formatNumber(item.mushroom_households.count)}
                  </td>
                  <td className="py-1.5">
                    <Cell cell={item.share} />
                  </td>
                  <td className="py-1.5">
                    <Cell cell={item.urban_share_of_mushroom} />
                  </td>
                  <td className="py-1.5">
                    <Cell cell={item.rural_share_of_mushroom} />
                  </td>
                  <td className="py-1.5">
                    <Cell cell={item.female_headed_share} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
