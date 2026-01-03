import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";
import HomePage from "./components/pages/HomePage";
import VendorsPage from "./components/pages/VendorPage";
import VendorDetailPage from "./components/pages/VendorDetailPage";
import BuyersPage from "./components/pages/BuyersPage";
import BuyersDetailPage from "./components/pages/BuyersDetailPage";
import VendorRegisterPage from "./components/pages/VendorRegisterPage";
import BuyerRegisterPage from "./components/pages/BuyerRegisterPage";
import RFPSubmitPage from "./components/pages/RFPSubmitPage";
import LoginPage from "./components/pages/LoginPage";
import VendorOnboardingPage from "./components/pages/VendorOnboardingPage";
import RfpMatchingPage from "./components/pages/RfpMatchingPage";
import PrivateRoute from "./guards/PrivateRoute";
import VendorRoute from "./guards/VendorRoute";
import BuyerRoute from "./guards/BuyerRoute";
import PublicRoute from "./guards/PublicRoute";
import { ToastProvider } from "./context/toastContext";

function App() {
  return (
    <div className="App">
      <Header />
      <ToastProvider>
        <Routes>
          {/* allowed wihtout login, not allowed after login */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <HomePage />
              </PublicRoute>
            }
          />
          <Route
            path="/vendor-register"
            element={
              <PublicRoute>
                <VendorRegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path="/buyer-register"
            element={
              <PublicRoute>
                <BuyerRegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          {/* allowed with login */}
          <Route
            path="/vendors/:id/:proposalAccepted?"
            element={
              <PrivateRoute>
                <VendorDetailPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/buyers/:id"
            element={
              <PrivateRoute>
                <BuyersDetailPage />
              </PrivateRoute>
            }
          />

          {/*  only to vendor */}
          <Route
            path="/onboarding"
            element={
              <PrivateRoute>
                <VendorRoute>
                  <VendorOnboardingPage />
                </VendorRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/buyers"
            element={
              <PrivateRoute>
                <VendorRoute>
                  <BuyersPage />
                </VendorRoute>
              </PrivateRoute>
            }
          />

          {/* only to buyer */}
          <Route
            path="/rfp-matching/:id?"
            element={
              <PrivateRoute>
                <BuyerRoute>
                  <RfpMatchingPage />
                </BuyerRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/rfp-submit"
            element={
              <PrivateRoute>
                <BuyerRoute>
                  <RFPSubmitPage />
                </BuyerRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/vendors"
            element={
              <PrivateRoute>
                <BuyerRoute>
                  <VendorsPage />
                </BuyerRoute>
              </PrivateRoute>
            }
          />

          <Route path="*" element={<HomePage />} />
        </Routes>
      </ToastProvider>
      <Footer />
    </div>
  );
}

export default App;
