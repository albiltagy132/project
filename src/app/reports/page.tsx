"use client";
import { useEffect, useState } from "react";
import DriverPerformanceChart from "@/components/DriverPerformanceChart";
import ShiftPieChart from "@/components/ShiftPieChart";
import DriverSelector from "@/components/DriverSelector";
import TimeRangeSelector from "@/components/TimeRangeSelector";
import DriverLeaderboard from "@/components/DriverLeaderboard";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ReportsPage() {
  const [events, setEvents] = useState([]);
  const [driverId, setDriverId] = useState("all");
  const [range, setRange] = useState("all_time");

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/reports?driver_id=${driverId}&range=${range}`);
      const data = await res.json();
      setEvents(data);
    };
    fetchData();
  }, [driverId, range]);

  const exportPDF = async () => {
    const input = document.getElementById("report-section");
    if (!input) return;

    // Patch unsupported oklch styles
    const elements = input.querySelectorAll("*");
    elements.forEach((el) => {
      const style = window.getComputedStyle(el);
      if (style.backgroundColor.includes("oklch")) {
        (el as HTMLElement).style.backgroundColor = "#ffffff";
      }
      if (style.color.includes("oklch")) {
        (el as HTMLElement).style.color = "#000000";
      }
    });

    // Generate canvas
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    // Create PDF
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("fleet-report.pdf");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Driver Performance Report</h1>

      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <DriverSelector onChange={setDriverId} />
        <TimeRangeSelector onChange={setRange} />
        <button
          onClick={exportPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Export PDF
        </button>
      </div>

      <div id="report-section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-4 rounded shadow h-[400px] flex flex-col justify-between">
            <DriverPerformanceChart events={events} />
          </div>
          <div className="bg-white p-4 rounded shadow h-[400px] flex flex-col justify-between">
            <ShiftPieChart events={events} />
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <DriverLeaderboard events={events} />
        </div>
      </div>
    </div>
  );
}
