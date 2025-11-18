function labResultsFilter(
  page: number,
  filter: {
    name: string | null;
    start: Date | null;
    end: Date | null;
    analysis: number[];
    status: {
      sent: boolean;
      pending: boolean;
      lab: boolean;
    };
  }
) {
  const params = new URLSearchParams({ page: page.toString() });
  if (filter?.name) params.append("name", filter.name);
  if (filter?.start) params.append("start", filter.start.toISOString());
  if (filter?.end) params.append("end", filter.end.toISOString());
  if (filter?.analysis && filter.analysis.length > 0)
    params.append("analysis", JSON.stringify(filter.analysis));

  const selectedStatus = Object.entries(filter.status)
    .filter(([, v]) => v)
    .map(([key]) => key);

  if (selectedStatus.length > 0)
    params.append("status", JSON.stringify(selectedStatus));

  return params.toString();
}

export default labResultsFilter;
