import { useCallback, useMemo, useState } from "react";
import { useGetInsightsQuery } from "../../api/apiSlice";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { InsightsTable } from "./InsightsTable";
import { PaginationControls } from "./PaginationControls";
import { SearchBar } from "./SearchBar";
import { SortControl, type SortOrder } from "./SortControl";

const PAGE_SIZE = 10;

interface InsightsPanelProps {
  contextId: string;
}

export function InsightsPanel({ contextId }: InsightsPanelProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("none");
  const debouncedSearch = useDebouncedValue(search, 300);

  const { data, isFetching, isError } = useGetInsightsQuery({ contextId, page, pageSize: PAGE_SIZE });

  const visibleInsights = useMemo(() => {
    const insights = data?.insights ?? [];
    const query = debouncedSearch.trim().toLowerCase();
    const filtered = query
      ? insights.filter(
          (insight) =>
            insight.title.toLowerCase().includes(query) ||
            insight.content.toLowerCase().includes(query) ||
            insight.category.toLowerCase().includes(query),
        )
      : insights;

    if (sortOrder === "none") return filtered;

    const sorted = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    return sortOrder === "za" ? sorted.reverse() : sorted;
  }, [data?.insights, debouncedSearch, sortOrder]);

  const handlePageChange = useCallback((nextPage: number) => setPage(nextPage), []);

  if (isError) {
    return <p className="error-banner">Failed to load insights. Please try again.</p>;
  }

  return (
    <section className="insights-panel">
      <div className="insights-toolbar">
        <SearchBar value={search} onChange={setSearch} />
        <SortControl value={sortOrder} onChange={setSortOrder} />
      </div>

      {isFetching && !data ? (
        <p className="loading-state">Loading insights...</p>
      ) : (
        <>
          <InsightsTable insights={visibleInsights} />
          {data && <PaginationControls pagination={data.pagination} onPageChange={handlePageChange} />}
        </>
      )}
    </section>
  );
}
