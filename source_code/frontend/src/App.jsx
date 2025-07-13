import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from './context/AuthContext'; // Import AuthContext
import MainLayout from './MainLayout';
import Home from './pages/home';
import SignupCustomer from './pages/signupCustomer';
import Aboutus from './pages/AboutUs';
import OTPVerification from './pages/CustomerVerification';
import LoginPage from './pages/signin';
import ServiceProviderSignup from './pages/serviceProviderSignup';
import FindService from './pages/findService';
import AdminDashboard from './pages/AdminDashboard';
import ManageCustomers from './pages/AdminManageCustomers';
import ManageWorkers from './pages/AdminManageWorkers';
import AdminLayout from './pages/AdminLayout';
import SignupChoice from './pages/SignupChoice';
import ContactUs from './pages/ContactUs';
import CustomerProfile from './pages/CustomerProfile';
import ProtectedRoute from './components/ProtectedRoute'; // Import Protected Route
import WorkerProfile from './pages/WorkerProfile';
import NotAuthorized from './pages/NotAuthorized';

const App = () => {
  return (
    <AuthProvider> {/* Wrap the entire app inside AuthProvider */}
      <BrowserRouter>
        <Routes>
          {/* Main Layout Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="create-account" element={<SignupCustomer />} />
            <Route path="aboutus" element={<Aboutus />} />
            <Route path="verify-customer" element={<OTPVerification />} />
            <Route path="signin" element={<LoginPage />} />
            <Route path="service-provider" element={<ServiceProviderSignup />} />
            <Route path="signup-choice" element={<SignupChoice />} />
            <Route path="findService" element={<FindService />} />
            <Route path="contactus" element={<ContactUs />} />
            <Route path="unauthorized" element={<NotAuthorized />} />
            <Route path="/CustomerProfile" element={<ProtectedRoute allowedRoles={['consumer']}><CustomerProfile /></ProtectedRoute>} />
            <Route path="/WorkerProfile" element={<ProtectedRoute allowedRoles={['provider']}><WorkerProfile /></ProtectedRoute>} />
          </Route>

          {/* Admin Routes (Protected) */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="customers" element={<ManageCustomers />} />
            <Route path="workers" element={<ManageWorkers />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
