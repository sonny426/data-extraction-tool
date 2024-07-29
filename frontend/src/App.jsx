import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import ProtectedRoute from "./utils/ProtectedRoute";
import './index.css'

function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/auth/*" element={
        <Auth />
      } />
      <Route path="*" element={
        <ProtectedRoute>
          <Navigate to="/dashboard/home" replace />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
