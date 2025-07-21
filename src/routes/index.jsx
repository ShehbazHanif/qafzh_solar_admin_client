import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Products from "../pages/products/Products";
import Orders from "../pages/orders/Orders";
import Analytics from "../pages/analytics/Analytics";
import Settings from "../pages/settings/Settings";
import ProtectedRoute from "../components/ProtectedRoute";
import Shops from "../pages/shops/Shops";
import Engineers from "../pages/Engineers/Engineers";
import Ads from "../pages/ads/Ads";
import CalculatorSettings from "../pages/calculatorSettings/CalculatorSettings";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Protected admin routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shop"
        element={
          <ProtectedRoute>
            <Shops />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ads"
        element={
          <ProtectedRoute>
            <Ads/>
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/engineers"
        element={
          <ProtectedRoute>
            <Engineers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/calculator-setting"
        element={
          <ProtectedRoute>
            <CalculatorSettings/>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
