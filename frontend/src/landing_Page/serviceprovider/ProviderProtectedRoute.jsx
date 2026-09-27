import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const ProviderProtectedRoute = () => {

    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {

        const checkProviderAuth = async () => {
            try {

                await axios.get(
                    "http://localhost:3002/api/provider/me",
                    {
                        withCredentials: true
                    }
                );

                setAuthenticated(true);

            } catch (error) {

                console.log("Provider not authenticated");

                setAuthenticated(false);

            } finally {
                setLoading(false);
            }
        };

        checkProviderAuth();

    }, []);

    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">

                <div className="text-center">

                    <div
                        className="spinner-border"
                        role="status"
                    ></div>

                    <p className="text-muted mt-2 mb-0">
                        Checking authentication...
                    </p>

                </div>

            </div>
        );
    }

    if (!authenticated) {
        return <Navigate to="/provider/login" replace />;
    }

    return <Outlet />;
};

export default ProviderProtectedRoute;