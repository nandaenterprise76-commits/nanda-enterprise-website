import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Brands from "@/pages/Brands";
import BrandDetail from "@/pages/BrandDetail";
import ProductDetail from "@/pages/ProductDetail";
import PowerWheels from "@/pages/PowerWheels";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Policies from "@/pages/Policies";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Shell({ children, hideChrome }) {
  return (
    <div className="App grain min-h-screen flex flex-col">
      {!hideChrome && <Header />}
      <main className="flex-1 relative z-10">{children}</main>
      {!hideChrome && <Footer />}
    </div>
  );
}

function Routed() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  return (
    <Shell hideChrome={isAdmin}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/brands" element={<Brands />} />
        <Route path="/brands/:slug" element={<BrandDetail />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/power-wheels" element={<PowerWheels />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </Shell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routed />
        <Toaster theme="dark" position="top-right" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}
