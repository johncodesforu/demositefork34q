import React from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { 
  Package, 
  MapPin, 
  Heart, 
  Settings, 
  LogOut, 
  ExternalLink,
  Clock,
  CheckCircle2,
  Truck
} from "lucide-react";
import { cn } from "@/src/lib/utils";

import { useAuth } from "@/src/context/AuthContext";
import { LogIn } from "lucide-react";

export default function Dashboard() {
  const { user, login, logout } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center">
        <div className="w-24 h-24 bg-accent/20 rounded-full mx-auto flex items-center justify-center neon-glow mb-8">
          <Package className="w-10 h-10 text-accent" />
        </div>
        <h2 className="text-4xl font-display font-bold mb-4">Identity Sync Required</h2>
        <p className="text-white/40 mb-12 max-w-md mx-auto">Please authorize your neural link to access your personal vault and order history.</p>
        <button 
          onClick={login}
          className="px-12 py-5 bg-accent text-black font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_rgba(0,184,212,0.3)]"
        >
          Authorize Identity
        </button>
      </div>
    );
  }

  const sidebarLinks = [
    { name: "My Orders", icon: Package, href: "/dashboard" },
    { name: "Wishlist", icon: Heart, href: "/dashboard/wishlist" },
    { name: "Addresses", icon: MapPin, href: "/dashboard/addresses" },
    { name: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 space-y-8 shrink-0">
          <div className="glass rounded-[2rem] p-8 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />
            <div className="w-20 h-20 bg-accent/20 rounded-full mx-auto flex items-center justify-center neon-glow mb-6 text-accent font-bold text-2xl relative">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full rounded-full" />
              ) : (
                user.displayName?.charAt(0) || "U"
              )}
            </div>
            <h2 className="text-xl font-display font-bold relative">{user.displayName}</h2>
            <p className="text-sm text-white/40 relative">Verified Citizen</p>
            
            <button 
              onClick={logout}
              className="mt-6 flex items-center gap-2 text-xs text-red-400/50 hover:text-red-400 transition-colors mx-auto"
            >
              <LogOut className="w-3 h-3" /> Terminate Session
            </button>
          </div>

          <div className="space-y-2">
            {sidebarLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all border",
                    isActive 
                      ? "bg-accent/10 border-accent/50 text-accent font-bold" 
                      : "border-transparent text-white/50 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Link>
              );
            })}
            <button className="flex items-center gap-4 px-6 py-4 rounded-2xl text-red-400 hover:bg-red-400/10 w-full transition-all">
              <LogOut className="w-5 h-5" />
              Disconnect
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<MyOrders />} />
            <Route path="/wishlist" element={<div className="p-20 glass rounded-[2rem] text-center text-white/40">Wishlist empty</div>} />
            <Route path="/addresses" element={<div className="p-20 glass rounded-[2rem] text-center text-white/40">No saved addresses</div>} />
            <Route path="/settings" element={<div className="p-20 glass rounded-[2rem] text-center text-white/40">Settings panel</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function MyOrders() {
  const orders = [
    { id: "FT-98234", date: "May 04, 2026", total: 1299.99, status: "processing", icon: Clock },
    { id: "FT-97120", date: "April 28, 2026", total: 350.00, status: "delivered", icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-display font-bold">Recent Transmissions</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="glass rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-8">
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0",
              order.status === "delivered" ? "bg-green-500/10 text-green-500" : "bg-accent/10 text-accent"
            )}>
              <order.icon className="w-8 h-8" />
            </div>
            
            <div className="flex-1 space-y-1">
               <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Order #{order.id}</p>
               <h3 className="text-xl font-bold font-display">Neural VR System x1</h3>
               <p className="text-sm text-white/40">Placed on {order.date}</p>
            </div>

            <div className="text-right space-y-2 w-full md:w-auto">
               <p className="text-xl font-bold font-display">${order.total}</p>
               <div className={cn(
                 "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                 order.status === "delivered" ? "bg-green-500/10 text-green-500" : "bg-accent/10 text-accent"
               )}>
                 {order.status}
               </div>
            </div>

            <button className="p-4 glass rounded-2xl hover:border-accent transition-all group">
              <ExternalLink className="w-5 h-5 text-white/40 group-hover:text-accent" />
            </button>
          </div>
        ))}
      </div>

      <div className="p-8 glass rounded-[2rem] bg-gradient-to-br from-accent/5 to-transparent border-accent/20 flex items-center justify-between gap-8">
        <div className="space-y-2">
           <h4 className="text-lg font-bold">Next Warp Delivery</h4>
           <p className="text-sm text-white/50">Your order #FT-98234 is currently in the quantum sorting phase. Expected jump in 12 hours.</p>
        </div>
        <Truck className="w-12 h-12 text-accent opacity-20 hidden md:block" />
      </div>
    </div>
  );
}
