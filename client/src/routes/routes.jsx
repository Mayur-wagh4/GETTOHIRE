import React from "react";
import { Route, Routes } from "react-router-dom";
import PaymentFailure from "../components/common/PaymentFailure";
import PaymentStatus from "../components/common/PaymentStatus";
import PaymentSuccess from "../components/common/PaymentSuccess";
import Home from "../components/home/home";
import Privacy from "../components/home/privacy";
import Refund from "../components/home/refund";
import Terms from "../components/home/terms";

import CandidateLogin from "../components/candidate/Authentication/CandidateLogin";
import CandidateRegister from "../components/candidate/Authentication/CandidateRegister";
import AppliedJobs from "../components/candidate/Dashboard/AppliedJobs";
import CandidateProfile from "../components/candidate/Dashboard/CandidateProfile";
import EditDetails from "../components/candidate/Dashboard/EditDetails";
import Notification from "../components/candidate/Dashboard/Notifications";
import Payments from "../components/candidate/Payments";
import CandidateLayout from "../components/candidate/layouts/CandidateLayout";

import RestaurantLogin from "../components/restaurant/Authentication/RestaurantLogin";
import RestaurantRegister from "../components/restaurant/Authentication/RestaurantRegister";
import CompletedRequirements from "../components/restaurant/Dashboard/CompletedRequirements";
import EditProfile from "../components/restaurant/Dashboard/EditProfile";
import Notifications from "../components/restaurant/Dashboard/Notifications";
import RestaurantProfile from "../components/restaurant/Dashboard/RestaurantProfile";
import PostJobs from "../components/restaurant/Dashboard/postJob";
import RestaurantLayout from "../components/restaurant/layouts/RestaurantLayout";

import AddRestaurant from "../components/admin/Dashboard/AddRestaurant";
import AdminDashboard from "../components/admin/Dashboard/AdminDashboard";
import CandidateList from "../components/admin/Dashboard/CandidateList";
import EditCandidate from "../components/admin/Dashboard/EditCandidate";
import JobApplications from "../components/admin/Dashboard/JobApplications";
import JobList from "../components/admin/Dashboard/JobList";
import AdminNotifications from "../components/admin/Dashboard/Notifications";
import PostJob from "../components/admin/Dashboard/PostJob";
import RestaurantList from "../components/admin/Dashboard/RestaurantList";
import AdminLogin from "../components/admin/auth/AdminLogin";
import AdminLayout from "../components/admin/layouts/AdminLayout";

import ProtectedRoute from "../components/common/ProtectedRoute";

import Jobs from "../components/Jobs/Jobs";

const AppRoutes = () => {
  return (
    <div className="App">
      <Routes>
      <Route path="*" element={<div>Catch-all: {window.location.pathname}</div>} />
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/payment-status/id=:transactionId" element={<PaymentStatus />} />
        <Route path="/payment/success" element={<PaymentSuccess/>} />
        <Route path="/payment/failure" element={<PaymentFailure/>} />

        {/* Authentication Routes */}
        <Route path="/candidate-login" element={<CandidateLogin />} />
        <Route path="/candidate-register" element={<CandidateRegister />} />
        <Route path="/restaurant-login" element={<RestaurantLogin />} />
        <Route path="/restaurant-register" element={<RestaurantRegister />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Protected Candidate Routes */}
        <Route element={<ProtectedRoute allowedUserTypes={["candidate"]} />}>
          <Route path="/candidate" element={<CandidateLayout />}>
            <Route index element={<CandidateProfile />} />
            <Route path="applied-jobs" element={<AppliedJobs />} />
            <Route path="edit-details" element={<EditDetails />} />
            <Route path="notifications" element={<Notification />} />
            <Route path="payment" element={<Payments />} />
          </Route>
        </Route>

        {/* Protected Restaurant Routes */}
        <Route element={<ProtectedRoute allowedUserTypes={["restaurant"]} />}>
          <Route path="/restaurant" element={<RestaurantLayout />}>
            <Route index element={<RestaurantProfile />} />
            <Route path="posted-jobs" element={<CompletedRequirements />} />
            <Route path="edit-details" element={<EditProfile />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="postjob" element={<PostJobs />} />
          </Route>
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute allowedUserTypes={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="candidates" element={<CandidateList />} />
            <Route path="edit-candidates" element={<EditCandidate />} />
            <Route path="restaurants" element={<RestaurantList />} />
            <Route path="add-restaurants" element={<AddRestaurant />} />
            <Route path="post-job" element={<PostJob />} />
            <Route path="view-jobs" element={<JobList />} />
            <Route path="view-applications" element={<JobApplications />} />
            <Route path="notifications" element={<AdminNotifications />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

export default AppRoutes;
