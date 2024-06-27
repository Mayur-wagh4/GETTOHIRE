import { Spinner } from '@material-tailwind/react';
import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

// Lazy load components
const Home = lazy(() => import('../components/home/home'));
const Privacy = lazy(() => import('../components/home/privacy'));
const Refund = lazy(() => import('../components/home/refund'));
const Terms = lazy(() => import('../components/home/terms'));

const CandidateLogin = lazy(() => import('../components/candidate/Authentication/CandidateLogin'));
const CandidateRegister = lazy(() => import('../components/candidate/Authentication/CandidateRegister'));
const TermsAndConditions = lazy(() => import('../components/candidate/Authentication/TermsAndConditions'));
const CandidateLayout = lazy(() => import('../components/candidate/layouts/CandidateLayout'));
const AppliedJobs = lazy(() => import('../components/candidate/Dashboard/AppliedJobs'));
const CandidateProfile = lazy(() => import('../components/candidate/Dashboard/CandidateProfile'));
const EditDetails = lazy(() => import('../components/candidate/Dashboard/EditDetails'));
const Notification = lazy(() => import('../components/candidate/Dashboard/Notifications'));
const Payments = lazy(() => import('../components/candidate/Payments'));

const RestaurantLogin = lazy(() => import('../components/restaurant/Authentication/RestaurantLogin'));
const RestaurantRegister = lazy(() => import('../components/restaurant/Authentication/RestaurantRegister'));
const RestaurantLayout = lazy(() => import('../components/restaurant/layouts/RestaurantLayout'));
const RestaurantProfile = lazy(() => import('../components/restaurant/Dashboard/RestaurantProfile'));
const CompletedRequirements = lazy(() => import('../components/restaurant/Dashboard/CompletedRequirements'));
const EditProfile = lazy(() => import('../components/restaurant/Dashboard/EditProfile'));
const Notifications = lazy(() => import('../components/restaurant/Dashboard/Notifications'));
const PostJobs = lazy(() => import('../components/restaurant/Dashboard/postJob'));



const AdminLogin = lazy(() => import('../components/admin/auth/AdminLogin'));
const AdminLayout = lazy(() => import('../components/admin/layouts/AdminLayout'));
const AdminDashboard = lazy(() => import('../components/admin/Dashboard/AdminDashboard'));
const CandidateList = lazy(() => import('../components/admin/Dashboard/CandidateList'));
const EditCandidate = lazy(() => import('../components/admin/Dashboard/EditCandidate'));
const RestaurantList = lazy(() => import('../components/admin/Dashboard/RestaurantList'));
const AddRestaurant = lazy(() => import('../components/admin/Dashboard/AddRestaurant'));
const PostJob = lazy(() => import('../components/admin/Dashboard/PostJob'));
const JobList = lazy(() => import('../components/admin/Dashboard/JobList'));
const JobApplications = lazy(() => import('../components/admin/Dashboard/JobApplications'));
const AdminNotifications = lazy(() => import('../components/admin/Dashboard/Notifications'));


const Jobs = lazy(() => import('../components/Jobs/Jobs'));
const ApplyJob = lazy(() => import('../components/Jobs/ApplyJob'));
const JobDetails = lazy(() => import('../components/Jobs/JobDetails'));



const AppRoutes = () => {
  return (
    <div className="App">
      <Suspense fallback={<Spinner />}>
        <Routes>
          {/* Home Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/refund" element={<Refund />} />
          <Route path='/payment'element={<Payments/>}/>

          <Route path="/jobs">
          <Route index element={<Jobs />} />
          <Route path=":id" element={<JobDetails />} />
          <Route path=":id/apply" element={<ApplyJob />} />
          </Route>    


          {/* Candidate Routes */}
          <Route path="/candidate-login" element={<CandidateLogin />} />
          <Route path="/candidate-register" element={<CandidateRegister />} />
          <Route path="/terms-conditions" element={<TermsAndConditions />} />
          <Route path="/candidate" element={<CandidateLayout />}>
            <Route index element={<CandidateProfile />} />
            <Route path="applied-jobs" element={<AppliedJobs />} />
            <Route path="edit-details" element={<EditDetails />} />
            <Route path="notifications" element={<Notification />} />
            <Route path="payment" element={<Payments />} />
          </Route>

          {/* Restaurant Routes */}
          <Route path="/restaurant-login" element={<RestaurantLogin />} />
          <Route path="/restaurant-register" element={<RestaurantRegister />} />
          <Route path="/restaurant" element={<RestaurantLayout />}>
            <Route index element={<RestaurantProfile />} />
            <Route path="posted-jobs" element={<CompletedRequirements />} />
            <Route path="edit-details" element={<EditProfile />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="postjob" element={<PostJobs />} />
          </Route>

         

          {/* Admin Routes */}
          <Route path="/admin/admin-login" element={<AdminLogin />} />
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
        </Routes>
      </Suspense>
    </div>
  );
};

export default AppRoutes;