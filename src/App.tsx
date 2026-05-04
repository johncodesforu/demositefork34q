/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Home from "./components/pages/Home";
import Shop from "./components/pages/Shop";
import ProductDetail from "./components/pages/ProductDetail";
import Cart from "./components/pages/Cart";
import Checkout from "./components/pages/Checkout";
import Dashboard from "./components/pages/Dashboard";
import AdminDashboard from "./components/pages/AdminDashboard";
import { useEffect } from "react";
import { seedProducts } from "./services/productService";
import { useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

function DatabaseSeeder() {
  const { user } = useAuth();

  useEffect(() => {
    // Only attempt to seed if we have a user and it's the admin
    // This prevents "Missing or insufficient permissions" errors for public users
    if (user?.email === 'mamidiabhyun@gmail.com') {
      seedProducts();
    }
  }, [user]);

  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DatabaseSeeder />
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-[#0B0B0F] text-white selection:bg-accent/30 selection:text-white">
              <Navbar />
              <main className="pt-20">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/dashboard/*" element={<Dashboard />} />
                  <Route path="/admin/*" element={<AdminDashboard />} />
                  <Route path="/support" element={<Support />} />
                </Routes>
              </main>
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function Support() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24 text-center space-y-8">
      <h1 className="text-5xl font-display font-bold underline decoration-accent">Support Grid</h1>
      <p className="text-white/50 text-lg">Need tactical assistance? Our neural link is always active for verified citizens.</p>
      <div className="glass p-12 rounded-[2rem] space-y-6 text-left relative overflow-hidden group">
        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <h3 className="text-2xl font-bold text-accent">Encrypted Contact</h3>
        <p className="text-white/40">Email: support@k34qdemo.future</p>
        <p className="text-white/40">Neural Freq: 882.4 MHZ</p>
        <p className="text-white/40">Response Time: &lt; 2 Micro-Cycles</p>
        <button className="w-full py-4 bg-white text-black font-bold rounded-xl mt-6 hover:scale-[1.02] active:scale-95 transition-all">Open Channel</button>
      </div>
    </div>
  );
}


