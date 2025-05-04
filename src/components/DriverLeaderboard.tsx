import Image from "next/image";

export default function DriverLeaderboard({ events }: { events: any[] }) {
  const leaderboard: Record<
    string,
    { count: number; high: number; medium: number; low: number; image: string }
  > = {};

  for (const e of events) {
    const name = `${e.trip.driver.first_name} ${e.trip.driver.last_name}`;
    const severity = e.event_severity;
    if (!leaderboard[name]) {
      leaderboard[name] = {
        count: 0,
        high: 0,
        medium: 0,
        low: 0,
        image: e.trip.driver.image_url,
      };
    }

    leaderboard[name].count += 1;
    if (severity === "High") leaderboard[name].high += 1;
    else if (severity === "Medium") leaderboard[name].medium += 1;
    else if (severity === "Low") leaderboard[name].low += 1;
  }

  const rows = Object.entries(leaderboard).sort((a, b) => b[1].count - a[1].count);

  return (
    <div className="bg-white p-4 shadow rounded-lg overflow-x-auto">
      <h3 className="text-xl font-semibold mb-4">Driver Leaderboard</h3>
      <table className="min-w-full table-auto border-collapse border border-gray-200 text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Driver</th>
            <th className="p-2 border">Total Events</th>
            <th className="p-2 border">High</th>
            <th className="p-2 border">Medium</th>
            <th className="p-2 border">Low</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, data]) => (
            <tr key={name} className="border-t">
              <td className="p-2 flex items-center space-x-3 border">
                <Image
                  src={data.image}
                  alt={name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover border"
                />
                <span>{name}</span>
              </td>
              <td className="p-2 border">{data.count}</td>
              <td className="p-2 border">{data.high}</td>
              <td className="p-2 border">{data.medium}</td>
              <td className="p-2 border">{data.low}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
