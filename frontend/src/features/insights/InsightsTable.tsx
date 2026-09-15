import { memo } from "react";
import type { Insight } from "../../api/types";

interface InsightsTableProps {
  insights: Insight[];
}

function InsightsTableImpl({ insights }: InsightsTableProps) {
  if (insights.length === 0) {
    return <p className="empty-state">No insights match your search.</p>;
  }

  return (
    <table className="insights-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Content</th>
          <th>Category</th>
        </tr>
      </thead>
      <tbody>
        {insights.map((insight) => (
          <tr key={insight.id}>
            <td>{insight.title}</td>
            <td>{insight.content}</td>
            <td>
              <span className="category-badge">{insight.category}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export const InsightsTable = memo(InsightsTableImpl);
