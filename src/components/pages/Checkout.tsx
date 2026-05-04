import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CreditCard, Truck, MapPin, ShieldCheck, ChevronRight, ArrowLeft } from "lucide-react";
import { useCart } from "@/src/context/CartContext";
import { useAuth } from "@/src/context/AuthContext";
import { formatCurrency, cn } from "@/src/lib/utils";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [step, setStep] = React.useState(1);
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal + shipping;

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        userId: user?.uid || "anonymous",
        items: cart,
        total: total + (subtotal * 0.08),
        status: "pending",
        createdAt: new Date().toISOString(),
        customerEmail: user?.email || "anonymous@future.com"
      };

      // Notify external email address as requested
      await fetch("/api/orders/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: "FT-" + Math.floor(Math.random() * 100000),
          total: orderData.total,
          items: orderData.items,
          email: "Wickjohngreat@gmail.com"
        })
      });

      clearCart();
      setStep(4);
    } catch (err) {
      console.error("Order failed", err);
    }
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  if (cart.length === 0 && step !== 4) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-2xl font-bold">Your cart is empty.</h2>
        <button onClick={() => navigate("/shop")} className="text-accent mt-4 underline">Go to Shop</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Checkout Flow */}
        <div className="flex-1 space-y-12">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between max-w-lg mx-auto mb-16">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className="relative">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                    step >= s ? "border-accent bg-accent text-black" : "border-white/10 text-white/30"
                  )}>
                    {step > s ? <Check className="w-6 h-6" /> : s}
                  </div>
                  <span className={cn(
                    "absolute top-full mt-2 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap font-bold uppercase tracking-widest transition-opacity",
                    step === s ? "opacity-100 text-accent" : "opacity-40"
                  )}>
                    {s === 1 ? "Shipping" : s === 2 ? "Payment" : "Review"}
                  </span>
                </div>
                {s < 3 && (
                  <div className={cn(
                    "h-px flex-1 mx-4 transition-all duration-500",
                    step > s ? "bg-accent" : "bg-white/10"
                  )} />
                )}
              </React.Fragment>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h2 className="text-3xl font-display font-bold">Shipping Logic</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Full Name" placeholder="John Matrix" />
                  <Input label="Email Address" placeholder="john@future.com" />
                  <div className="md:col-span-2">
                    <Input label="Street Address" placeholder="123 Galactic Way" />
                  </div>
                  <Input label="City" placeholder="Neo Tokyo" />
                  <Input label="Zip Code" placeholder="90210" />
                </div>
                
                <h3 className="text-xl font-bold mt-12">Delivery Method</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-6 glass border-accent rounded-3xl relative cursor-pointer">
                    <div className="absolute top-4 right-4 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-black" />
                    </div>
                    <Truck className="w-8 h-8 text-accent mb-4" />
                    <p className="font-bold">Lightning Protocol</p>
                    <p className="text-sm text-white/40">2-3 Galactic Days</p>
                    <p className="text-accent font-bold mt-2">FREE</p>
                  </div>
                  <div className="p-6 glass border-white/10 rounded-3xl opacity-50 cursor-not-allowed">
                    <Zap className="w-8 h-8 text-white/50 mb-4" />
                    <p className="font-bold">Instant Beam</p>
                    <p className="text-sm text-white/40">Under development</p>
                  </div>
                </div>

                <div className="pt-8">
                  <button 
                    onClick={handleNext}
                    className="w-full h-16 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
                  >
                    Continue to Payment <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h2 className="text-3xl font-display font-bold">Secure Payment</h2>
                <div className="p-8 glass rounded-3xl border-accent/30 space-y-8">
                  <div className="flex items-center justify-between pb-6 border-b border-white/10">
                    <div className="flex items-center gap-4">
                       <CreditCard className="w-6 h-6 text-accent" />
                       <span className="font-bold">Credit / Debit Card</span>
                    </div>
                    <ShieldCheck className="w-5 h-5 text-accent" />
                  </div>
                  
                  <div className="space-y-6">
                    <Input label="Card Number" placeholder="**** **** **** ****" />
                    <div className="grid grid-cols-2 gap-6">
                      <Input label="Expiry Date" placeholder="MM / YY" />
                      <Input label="CVV" placeholder="***" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-8">
                  <button onClick={handleBack} className="px-8 py-4 glass border border-white/10 rounded-2xl font-bold flex items-center justify-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button 
                    onClick={handleNext}
                    className="flex-1 h-16 bg-accent text-black font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform neon-glow"
                  >
                    Review Order <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h2 className="text-3xl font-display font-bold">Final Verification</h2>
                <div className="space-y-6">
                  <div className="p-6 glass rounded-3xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-accent" />
                        <span className="font-bold">Shipping to</span>
                      </div>
                      <button onClick={() => setStep(1)} className="text-accent text-xs font-bold uppercase tracking-widest">Edit</button>
                    </div>
                    <p className="text-white/60 text-sm">John Matrix, 123 Galactic Way, Neo Tokyo, 90210</p>
                  </div>
                  
                  <div className="p-6 glass rounded-3xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-accent" />
                        <span className="font-bold">Payment Method</span>
                      </div>
                      <button onClick={() => setStep(2)} className="text-accent text-xs font-bold uppercase tracking-widest">Edit</button>
                    </div>
                    <p className="text-white/60 text-sm">Ending in •••• 4242</p>
                  </div>
                </div>

                <div className="pt-8">
                  <button 
                    onClick={handlePlaceOrder}
                    className="w-full h-16 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
                  >
                    Place Secure Order <Check className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 space-y-8"
              >
                <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mx-auto neon-glow">
                  <Check className="w-12 h-12 text-accent" />
                </div>
                <div>
                  <h2 className="text-5xl font-display font-bold">Transmission Complete</h2>
                  <p className="text-white/50 text-xl mt-4">Your order #FT-98234 has been processed into the grid.</p>
                </div>
                <div className="flex justify-center gap-6">
                  <button onClick={() => navigate("/dashboard")} className="px-10 py-4 glass border border-white/10 rounded-2xl font-bold">Track Shipment</button>
                  <button onClick={() => navigate("/")} className="px-10 py-4 bg-white text-black rounded-2xl font-bold">Return Home</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Summary */}
        {step < 4 && (
          <div className="w-full lg:w-[400px] shrink-0">
             <div className="glass rounded-[2rem] p-8 space-y-8 sticky top-32">
                <h3 className="text-xl font-display font-bold">Order Summary</h3>
                <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                   {cart.map((item) => (
                     <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-20 rounded-xl overflow-hidden shrink-0">
                           <img src={item.images[0]} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-1">
                           <p className="font-bold text-sm line-clamp-1">{item.name}</p>
                           <p className="text-xs text-white/40">Qty: {item.quantity}</p>
                           <p className="text-sm font-bold mt-1 text-accent">{formatCurrency(item.price)}</p>
                        </div>
                     </div>
                   ))}
                </div>
                
                <div className="h-px bg-white/10 w-full" />
                
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between text-white/50">
                    <span>Subtotal</span>
                    <span className="text-white font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-white/50">
                    <span>Shipping</span>
                    <span className="text-accent font-bold">{shipping === 0 ? "FREE" : formatCurrency(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-white/50">
                    <span>Tax (Est.)</span>
                    <span className="text-white font-medium">{formatCurrency(subtotal * 0.08)}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-bold pt-4 border-t border-white/10 text-accent">
                    <span>Total</span>
                    <span>{formatCurrency(total + (subtotal * 0.08))}</span>
                  </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Input({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 group-focus-within:text-accent transition-colors">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent transition-all placeholder:text-white/10"
      />
    </div>
  );
}

function Zap(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}
