import React from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import { useCart } from "@/src/context/CartContext";
import { formatCurrency } from "@/src/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, subtotal } = useCart();
  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center space-y-8">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10 text-white/20" />
        </div>
        <div>
          <h1 className="text-4xl font-display font-bold mb-4">Your cart is empty</h1>
          <p className="text-white/40 max-w-md mx-auto">
            The future waits for no one. Browse our latest tech and add some items to your collection.
          </p>
        </div>
        <Link to="/shop" className="inline-flex items-center gap-2 px-10 py-5 bg-accent text-black font-bold rounded-2xl hover:scale-105 transition-transform">
          Start Shopping <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-display font-bold mb-12">Shopping Collection</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass rounded-[2rem] p-6 flex flex-col sm:flex-row gap-6 relative group"
              >
                <div className="w-32 h-40 rounded-2xl overflow-hidden shrink-0">
                  <img src={item.images[0]} className="w-full h-full object-cover" alt="" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-accent uppercase tracking-widest">{item.category}</span>
                      <h3 className="text-xl font-display font-bold mt-1">{item.name}</h3>
                      {item.selectedVariant && (
                        <p className="text-xs text-white/40 mt-1">
                          {Object.entries(item.selectedVariant).map(([k, v]) => `${k}: ${v}`).join(" | ")}
                        </p>
                      )}
                    </div>
                    <p className="text-xl font-bold font-display">{formatCurrency(item.price)}</p>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center glass rounded-xl px-2 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:text-accent transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-bold">{item.quantity}</span>
                      <button 
                         onClick={() => updateQuantity(item.id, item.quantity + 1)}
                         className="p-2 hover:text-accent transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-white/30 hover:text-red-500 transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" /> Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="space-y-8">
          <div className="glass rounded-[2rem] p-8 space-y-6 sticky top-32">
            <h2 className="text-2xl font-display font-bold">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-white/60">
                <span>Subtotal</span>
                <span className="text-white font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Shipping</span>
                <span className="text-white font-medium">
                  {shipping === 0 ? <span className="text-accent font-bold">FREE</span> : formatCurrency(shipping)}
                </span>
              </div>
              <div className="h-px bg-white/10 w-full my-2" />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-accent">{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
               <div className="bg-accent/20 p-2 rounded-lg">
                 <ShieldCheck className="w-5 h-5 text-accent" />
               </div>
               <div className="text-xs">
                 <p className="font-bold">Encrypted Checkout</p>
                 <p className="text-white/40">Secure multi-factor authentication</p>
               </div>
            </div>

            <Link to="/checkout" className="w-full bg-white text-black font-bold h-16 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform">
              Proceed to Verification <ArrowRight className="w-5 h-5" />
            </Link>

            <div className="text-center">
              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Accepted Protocols</p>
              <div className="flex justify-center gap-4 mt-4 grayscale opacity-40">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="PayPal" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" alt="MasterCard" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/39/Stripe_logo%2C_revised_2016.svg" className="h-4" alt="Stripe" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
