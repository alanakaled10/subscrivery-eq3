import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";

import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Plans from "../pages/Plans/Plans";
import Subscribe from "../pages/Subscribe/Subscribe";
import Dashboard from "../pages/Dashboard/Dashboard";
import Layout from "../components/Layout/Layout";

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Navigate to="/login" />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/plans"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Plans />
                            </Layout>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/Subscribe"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Subscribe />
                            </Layout>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/Dashboard"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Dashboard />
                            </Layout>
                        </PrivateRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}