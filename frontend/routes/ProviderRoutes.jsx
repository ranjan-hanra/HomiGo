import { Routes, Route } from "react-router-dom";

import ServiceProviderPage from "../src/landing_Page/serviceprovider/ServiceProviderPage";
import ProviderLogin from "../src/landing_Page/serviceprovider/ProviderLogin";
import ProviderProtectedRoute from "../src/landing_Page/serviceprovider/ProviderProtectedRoute";

const ProviderRoutes = () => {
    return (
        <Routes>

            {/* Provider Login */}
            <Route
                path="/login"
                element={<ProviderLogin />}
            />

            {/* Protected Provider Pages */}
            <Route element={<ProviderProtectedRoute />}>

                <Route
                    path="/"
                    element={<ServiceProviderPage />}
                />

            </Route>

        </Routes>
    );
};

export default ProviderRoutes;