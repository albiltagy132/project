import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


export default function DriverPerformanceChart({ events }: { events: any[] }) {
  const driverCounts: Record<string, number> = {};

  for (const e of events) {
    const name = `${e.trip.driver.first_name} ${e.trip.driver.last_name}`;
    driverCounts[name] = (driverCounts[name] || 0) + 1;
  }

  const data = {
    labels: Object.keys(driverCounts),
    datasets: [
      {
        label: "# of Events",
        data: Object.values(driverCounts),
        backgroundColor: "rgba(59,130,246,0.6)",
      },
    ],
  };
  

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">Event Count per Driver</h3>
      <Bar data={data} />
    </div>
  );
}
