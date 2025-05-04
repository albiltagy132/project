export default function TimeRangeSelector({ onChange }: { onChange: (range: string) => void }) {
    return (
      <select onChange={(e) => onChange(e.target.value)} className="border p-2 rounded">
        <option value="all_time">All Time</option>
        <option value="last_7_days">Last 7 Days</option>
        <option value="last_month">Last Month</option>
        <option value="last_6_months">Last 6 Months</option>
        <option value="last_year">Last Year</option>
      </select>
    );
  }
  