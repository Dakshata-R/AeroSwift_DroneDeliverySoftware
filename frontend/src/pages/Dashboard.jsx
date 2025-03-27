// import React, { useState, useEffect } from "react";
// import { Line } from "react-chartjs-2";
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// const Dashboard = () => {
//   const user = JSON.parse(localStorage.getItem("user"));
  
//   const [stats, setStats] = useState({
//     ordersToday: 0,
//     activeDrones: { available: 0, inUse: 0 },
//     ordersInTransit: 0,
//     revenueToday: 0,
//     pendingComplaints: 0,
//     criticalDrones: 0,
//     ordersPerHour: []
//   });

//   useEffect(() => {
//     // Fetch stats from API (mocked for now)
//     setStats({
//       ordersToday: 25,
//       activeDrones: { available: 8, inUse: 12 },
//       ordersInTransit: 5,
//       revenueToday: "$1,250",
//       pendingComplaints: 3,
//       criticalDrones: 2,
//       ordersPerHour: [2, 5, 8, 12, 20, 25, 18, 15, 10, 5, 3, 2]
//     });
//   }, []);

//   const chartData = {
//     labels: ["12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM"],
//     datasets: [
//       {
//         label: "Orders Per Hour",
//         data: stats.ordersPerHour,
//         borderColor: "#28a745",
//         backgroundColor: "rgba(40, 167, 69, 0.5)",
//         fill: true
//       }
//     ]
//   };

//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", color: "#fff", background: "linear-gradient(120deg, #007bff, #28a745)", minHeight: "100vh", position: "relative" }}>
//       <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Admin Dashboard</h1>
//       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
//         <StatCard title="Orders Placed Today" value={stats.ordersToday} />
//         <StatCard title="Active Drones" value={`${stats.activeDrones.available} Available / ${stats.activeDrones.inUse} In Use`} />
//         <StatCard title="Orders in Transit" value={stats.ordersInTransit} />
//         <StatCard title="Revenue Generated Today" value={stats.revenueToday} />
//         <StatCard title="Pending Complaints" value={stats.pendingComplaints} />
//         <StatCard title="Critical Drones (Low Battery)" value={stats.criticalDrones} highlight />
//       </div>
//       <div style={{ marginTop: "40px", padding: "20px", background: "#fff", borderRadius: "12px", boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)", color: "#333" }}>
//         <h3 style={{ textAlign: "center", background: "linear-gradient(90deg, #007bff, #28a745)", WebkitBackgroundClip: "text", color: "transparent" }}>AI-Based Demand Prediction</h3>
//         <Line data={chartData} />
//       </div>
//       <img src="https://cdn-icons-png.flaticon.com/512/3177/3177440.png" alt="Drone Icon" style={{ position: "absolute", bottom: "10px", right: "10px", width: "100px", opacity: "0.3" }} />
//     </div>
//   );
// };

// const StatCard = ({ title, value, highlight }) => {
//   return (
//     <div style={{ 
//       padding: "30px", 
//       borderRadius: "12px", 
//       background: highlight ? "#dc3545" : "#fff", 
//       color: highlight ? "#fff" : "#333", 
//       textAlign: "center", 
//       boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
//       minHeight: "180px" 
//     }}>
//       <h3 style={{ marginBottom: "15px", fontSize: "1.4em", background: "linear-gradient(90deg, #007bff, #28a745)", WebkitBackgroundClip: "text", color: "transparent" }}>{title}</h3>
//       <p style={{ fontSize: "2.2em", fontWeight: "bold" }}>{value}</p>
//     </div>
//   );
// };

// export default Dashboard;
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  
  const [stats, setStats] = useState({
    ordersToday: 0,
    activeDrones: { available: 0, inUse: 0 },
    ordersInTransit: 0,
    revenueToday: 0,
    pendingComplaints: 0,
    criticalDrones: 0,
    ordersPerHour: []
  });

  const [notifications, setNotifications] = useState([
    "New order received!",
    "Drone #5 battery low!",
    "Urgent system update required!",
    "New customer complaint submitted."
  ]);

  useEffect(() => {
    // Fetch stats from API (mocked for now)
    setStats({
      ordersToday: 25,
      activeDrones: { available: 8, inUse: 12 },
      ordersInTransit: 5,
      revenueToday: "$1,250",
      pendingComplaints: 3,
      criticalDrones: 2,
      ordersPerHour: [2, 5, 8, 12, 20, 25, 18, 15, 10, 5, 3, 2]
    });
  }, []);

  const chartData = {
    labels: ["12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM"],
    datasets: [
      {
        label: "Orders Per Hour",
        data: stats.ordersPerHour,
        borderColor: "#28a745",
        backgroundColor: "rgba(40, 167, 69, 0.5)",
        fill: true
      }
    ]
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", color: "#fff", background: "linear-gradient(120deg, #007bff, #28a745)", minHeight: "100vh", position: "relative" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Admin Dashboard</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        <StatCard title="Orders Placed Today" value={stats.ordersToday} />
        <StatCard title="Active Drones" value={`${stats.activeDrones.available} Available / ${stats.activeDrones.inUse} In Use`} />
        <StatCard title="Orders in Transit" value={stats.ordersInTransit} />
        <StatCard title="Revenue Generated Today" value={stats.revenueToday} />
        <StatCard title="Pending Complaints" value={stats.pendingComplaints} />
        <StatCard title="Critical Drones (Low Battery)" value={stats.criticalDrones} highlight />
      </div>
      <div style={{ marginTop: "40px", padding: "20px", background: "#fff", borderRadius: "12px", boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)", color: "#333" }}>
        <h3 style={{ textAlign: "center", background: "linear-gradient(90deg, #007bff, #28a745)", WebkitBackgroundClip: "text", color: "transparent" }}>AI-Based Demand Prediction</h3>
        <Line data={chartData} />
      </div>
      <div style={{ marginTop: "30px", padding: "20px", background: "#ffcc00", borderRadius: "12px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", color: "#333" }}>
        <h3 style={{ textAlign: "center" }}>Admin Notifications</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {notifications.map((note, index) => (
            <li key={index} style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{note}</li>
          ))}
        </ul>
      </div>
      <img src="https://cdn-icons-png.flaticon.com/512/3177/3177440.png" alt="Drone Icon" style={{ position: "absolute", bottom: "10px", right: "10px", width: "100px", opacity: "0.3" }} />
    </div>
  );
};

const StatCard = ({ title, value, highlight }) => {
  return (
    <div style={{ 
      padding: "30px", 
      borderRadius: "12px", 
      background: highlight ? "#dc3545" : "#fff", 
      color: highlight ? "#fff" : "#333", 
      textAlign: "center", 
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
      minHeight: "180px" 
    }}>
      <h3 style={{ marginBottom: "15px", fontSize: "1.4em", background: "linear-gradient(90deg, #007bff, #28a745)", WebkitBackgroundClip: "text", color: "transparent" }}>{title}</h3>
      <p style={{ fontSize: "2.2em", fontWeight: "bold" }}>{value}</p>
    </div>
  );
};

export default Dashboard;