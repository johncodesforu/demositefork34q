import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingCart, User, Heart, Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";
import { useCart } from "@/src/context/CartContext";
import { useAuth } from "@/src/context/AuthContext";
import { LogIn, LogOut } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const location = useLocation();
  const { cart } = useCart();
  const { user, login, logout } = useAuth();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "New Arrivals", href: "/shop?sort=newest" },
    { name: "Trending", href: "/shop?sort=trending" },
    { name: "Categories", href: "/shop" },
    { name: "Support", href: "/support" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled ? "bg-black/60 backdrop-blur-xl border-b border-white/10" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-purple to-accent rounded-xl flex items-center justify-center neon-glow group-hover:scale-110 transition-transform">
            <span className="text-white font-bold text-xl">K</span>
          </div>
          <span className="font-display font-bold text-2xl tracking-tighter hidden sm:block">
            k34q's <span className="text-accent">Demo</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-sm font-medium text-white/70 hover:text-accent transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/dashboard" className="hidden sm:block text-xs font-medium text-white/50 hover:text-white transition-colors">
                {user.displayName?.split(' ')[0] || "Account"}
              </Link>
              <button 
                onClick={logout}
                className="p-2 text-white/70 hover:text-accent transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={login}
              className="flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium hover:bg-white/10 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Identity Sync</span>
            </button>
          )}
          
          <Link to="/cart" className="p-2 text-white/70 hover:text-accent relative transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-black text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-black">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            className="md:hidden p-2 text-white/70"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 glass rounded-3xl overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                <Search className="w-5 h-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-base px-3 w-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
