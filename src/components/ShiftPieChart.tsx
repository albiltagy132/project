import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function ShiftPieChart({ events }: { events: any[] }) {
  const counts = { MORNING: 0, NIGHT: 0 };
  for (const e of events) {
    counts[e.trip.shift as "MORNING" | "NIGHT"]++;
  }

  const data = {
    labels: ["Morning", "Night"],
    datasets: [
      {
        label: "Shift Events",
        data: [counts.MORNING, counts.NIGHT],
        backgroundColor: ["#14b8a6", "#6366f1"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Event Distribution by Shift",
      },
    },
  };

  return (
    <div className="h-full">
      <h3 className="text-xl font-semibold mb-2">Event Distribution by Shift</h3>
      <div className="h-[300px]">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}
