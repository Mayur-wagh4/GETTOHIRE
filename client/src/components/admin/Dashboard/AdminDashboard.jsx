import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { motion } from "framer-motion";
import React, { useEffect, useMemo } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchCandidates,
  fetchJobApplications,
  fetchJobs,
  fetchRestaurants,
} from "../../../redux/slices/adminSlice";

// Register the required components for Chart.js
ChartJS.register(
  CategoryScale,
  ArcElement,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { candidates, restaurants, jobApplications, jobs, loading, error } =
    useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchCandidates());
    dispatch(fetchRestaurants());
    dispatch(fetchJobApplications());
    dispatch(fetchJobs());
  }, [dispatch]);

  const getRandomData = (length) =>
    useMemo(
      () => Array.from({ length }, () => Math.floor(Math.random() * 100)),
      [length]
    );

    const chartConfigs = useMemo(
      () => ({
        candidateData: {
          labels: ["Total Candidates", "Premium Users", "Abroad Students"],
          datasets: [
            {
              label: "Candidates",
              data: [
                candidates.length,
                candidates.filter(c => c.isPremium).length,
                candidates.filter(c => c.isAbroadStudent).length
              ],
              backgroundColor: ["#4CAF50", "#2196F3", "#FFC107"],
              borderColor: ["#388E3C", "#1976D2", "#FFA000"],
            },
          ],
        },
        restaurantData: {
          labels: ["Total Restaurants", "With Job Posts", "Without Job Posts"],
          datasets: [
            {
              label: "Restaurants",
              data: [
                restaurants.length,
                restaurants.filter(r => r.jobPosts.length > 0).length,
                restaurants.filter(r => r.jobPosts.length === 0).length
              ],
              backgroundColor: ["#F44336", "#2196F3", "#4CAF50"],
              borderColor: ["#D32F2F", "#1976D2", "#388E3C"],
            },
          ],
        },
        jobData: {
          labels: ["Total Jobs", "Full-time", "Part-time"],
          datasets: [
            {
              label: "Jobs",
              data: [
                jobs.length,
                jobs.filter(j => j.jobType === 'full-time').length,
                jobs.filter(j => j.jobType === 'part-time').length
              ],
              backgroundColor: ["#9C27B0", "#2196F3", "#FFC107"],
              borderColor: ["#7B1FA2", "#1976D2", "#FFA000"],
            },
          ],
        },
        applicationData: {
          labels: ["Total Applications", "Pending", "Approved", "Rejected"],
          datasets: [
            {
              label: "Applications",
              data: [
                jobApplications.length,
                jobApplications.filter(a => a.status === 'pending').length,
                jobApplications.filter(a => a.status === 'approved').length,
                jobApplications.filter(a => a.status === 'rejected').length
              ],
              backgroundColor: ["#FF9800", "#2196F3", "#4CAF50", "#F44336"],
              borderColor: ["#F57C00", "#1976D2", "#388E3C", "#D32F2F"],
            },
          ],
        },
        jobDepartmentData: {
          labels: [...new Set(jobs.map(j => j.jobDepartment))],
          datasets: [
            {
              label: "Jobs by Department",
              data: [...new Set(jobs.map(j => j.jobDepartment))].map(
                dept => jobs.filter(j => j.jobDepartment === dept).length
              ),
              backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#9C27B0", "#F44336"],
              borderColor: ["#388E3C", "#1976D2", "#FFA000", "#7B1FA2", "#D32F2F"],
            },
          ],
        },
        applicationTrendData: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "Job Application Trends",
              data: [0, 1, 2, 3, 4, 5].map(monthsAgo => {
                const date = new Date();
                date.setMonth(date.getMonth() - monthsAgo);
                return jobApplications.filter(application => {
                  const applicationDate = new Date(application.createdAt);
                  return applicationDate.getMonth() === date.getMonth() &&
                         applicationDate.getFullYear() === date.getFullYear();
                }).length;
              }),
              borderColor: "#3F51B5",
              tension: 0.1,
              fill: false,
            },
          ],
        },
      }),
      [candidates, restaurants, jobs, jobApplications]
    );


  const ChartCard = React.memo(({ title, chart: Chart, data, options }) => (
    <motion.div
      className="bg-white shadow-lg rounded-xl p-6 flex flex-col justify-between"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      style={{ width: "100%", height: "350px" }} // Set fixed dimensions
    >
      <h3 className="text-xl text-cyan-500 font-semibold mb-4">{title}</h3>
      <div style={{ height: "100%", position: "relative" }}>
        <Chart
          data={data}
          options={{ maintainAspectRatio: false, ...options }}
        />
      </div>
    </motion.div>
  ));

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 text-center text-xl mt-10">
        Error: {error}
      </div>
    );

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Your Analytics
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <ChartCard
          title="Candidate Analytics"
          chart={Doughnut}
          data={chartConfigs.candidateData}
        />
        <ChartCard
          title="Restaurant Analytics"
          chart={Doughnut}
          data={chartConfigs.restaurantData}
        />
        <ChartCard
          title="Job Statistics"
          chart={Bar}
          data={chartConfigs.jobData}
        />
        <ChartCard
          title="Application Status"
          chart={Bar}
          data={chartConfigs.applicationData}
        />
        <ChartCard
          title="Jobs by Department"
          chart={Bar}
          data={chartConfigs.jobDepartmentData}
        />
        <ChartCard
          title="Application Trends"
          chart={Line}
          data={chartConfigs.applicationTrendData}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
