import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Card, Container, Row, Col } from "react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AnalyticsCharts = ({ jobs }) => {
  const interviewsScheduled = jobs.filter((job) => job.interviewDate).length;
  const archivedApplications = jobs.filter((job) => job.status === "Archived").length;
  const offers = jobs.filter((job) => job.status === "Offer").length;

  const barData = {
    labels: ["Interviews Scheduled", "Archived Applications", "Offers"],
    datasets: [
      {
        label: "Applications Overview",
        data: [interviewsScheduled, archivedApplications, offers],
        backgroundColor: ["#007bff", "#6c757d", "#28a745"],
        borderRadius: 6,
      },
    ],
  };

  const pieData = {
    labels: ["Interviews Scheduled", "Archived", "Offers"],
    datasets: [
      {
        data: [interviewsScheduled, archivedApplications, offers],
        backgroundColor: ["#007bff", "#6c757d", "#28a745"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1500,
      easing: "easeInOutQuart",
    },
    plugins: { legend: { position: "bottom" } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <Container className="analytics-chart-container">
      <h3 className="text-center mb-4">Analytics Overview</h3>
      <Row>
        <Col md={6}>
          <Card className="mb-4 p-3 shadow-sm chart-card">
            <h5 className="mb-3">Applications Overview</h5>
            <div className="chart-wrapper" style={{ height: "300px" }}>
              <Bar data={barData} options={chartOptions} />
            </div>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4 p-3 shadow-sm chart-card">
            <h5 className="mb-3">Applications Breakdown</h5>
            <div className="chart-wrapper" style={{ height: "300px" }}>
              <Pie data={pieData} options={chartOptions} />
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AnalyticsCharts;
