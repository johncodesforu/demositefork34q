import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from "recharts";
import { 
  Plus, 
  LayoutDashboard, 
  Package, 
  Users, 
  BarChart3, 
  Search, 
  MoreVertical,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users2
} from "lucide-react";
import { getProducts } from "@/src/services/productService";
import { Product } from "@/src/types";
import { formatCurrency, cn } from "@/src/lib/utils";

const data = [
  { name: "Mon", revenue: 4000, orders: 24 },
  { name: "Tue", revenue: 3000, orders: 18 },
  { name: "Wed", revenue: 2000, orders: 12 },
  { name: "Thu", revenue: 2780, orders: 20 },
  { name: "Fri", revenue: 1890, orders: 15 },
  { name: "Sat", revenue: 2390, orders: 25 },
  { name: "Sun", revenue: 3490, orders: 30 },
];

export default function AdminDashboard() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [activeTab, setActiveTab] = React.useState("overview");

  React.useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 space-y-6 shrink-0">
        <div className="p-6 glass rounded-3xl border-accent/20">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-accent mb-6">Management</h2>
          <nav className="space-y-4">
             {[
               { id: "overview", name: "Overview", icon: LayoutDashboard },
               { id: "products", name: "Inventory", icon: Package },
               { id: "customers", name: "User Base", icon: Users },
               { id: "analytics", name: "Analytics", icon: BarChart3 },
             ].map((item) => (
               <button
                 key={item.id}
                 onClick={() => setActiveTab(item.id)}
                 className={cn(
                   "flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all",
                   activeTab === item.id ? "bg-accent/10 text-accent font-bold" : "text-white/40 hover:text-white"
                 )}
               >
                 <item.icon className="w-5 h-5" />
                 {item.name}
               </button>
             ))}
          </nav>
        </div>
        
        <button className="w-full h-14 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-accent transition-colors">
          <Plus className="w-5 h-5" /> New Product
        </button>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 space-y-12">
        {activeTab === "overview" && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Total Revenue", value: "$128,492", icon: DollarSign, trend: "+12.5%" },
                { label: "Orders", value: "842", icon: ShoppingCart, trend: "+8.2%" },
                { label: "Customers", value: "3,102", icon: Users2, trend: "+5.1%" },
                { label: "Conversion", value: "3.24%", icon: TrendingUp, trend: "+0.4%" },
              ].map((stat, i) => (
                <div key={i} className="p-6 glass rounded-3xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                      <stat.icon className="w-5 h-5 text-white/40" />
                    </div>
                    <span className="text-green-500 text-xs font-bold">{stat.trend}</span>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-2xl font-display font-bold mt-1">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass rounded-[2rem] p-8 space-y-6">
                <h3 className="text-xl font-display font-bold">Revenue Transmission</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} />
                      <YAxis stroke="#ffffff40" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#15151a", border: "1px solid #ffffff10", borderRadius: "16px" }}
                        itemStyle={{ color: "#00D4FF" }}
                      />
                      <Bar dataKey="revenue" fill="#00D4FF" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="glass rounded-[2rem] p-8 space-y-6">
                <h3 className="text-xl font-display font-bold">Global Traffic</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} />
                      <YAxis stroke="#ffffff40" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#15151a", border: "1px solid #ffffff10", borderRadius: "16px" }}
                      />
                      <Line type="monotone" dataKey="orders" stroke="#7C3AED" strokeWidth={3} dot={{ fill: "#7C3AED", r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Inventory */}
            <div className="glass rounded-[2rem] overflow-hidden">
               <div className="p-8 flex items-center justify-between border-b border-white/5">
                 <h3 className="text-xl font-display font-bold">Stock Management</h3>
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input type="text" placeholder="Search grid..." className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent w-64" />
                 </div>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                       <th className="px-8 py-4">Product</th>
                       <th className="px-8 py-4">Status</th>
                       <th className="px-8 py-4">Inventory</th>
                       <th className="px-8 py-4">Price</th>
                       <th className="px-8 py-4"></th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                     {products.map((p) => (
                       <tr key={p.id} className="group hover:bg-white/[0.02] transition-colors">
                         <td className="px-8 py-4">
                           <div className="flex items-center gap-4">
                             <img src={p.images[0]} className="w-10 h-12 object-cover rounded-lg" alt="" />
                             <div>
                               <p className="font-bold text-sm">{p.name}</p>
                               <p className="text-xs text-white/30">{p.category}</p>
                             </div>
                           </div>
                         </td>
                         <td className="px-8 py-4">
                            <span className={cn(
                              "inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                              p.inventory > 10 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                            )}>
                              {p.inventory > 10 ? "Optimal" : "Low Stock"}
                            </span>
                         </td>
                         <td className="px-8 py-4 font-mono text-sm">{p.inventory} units</td>
                         <td className="px-8 py-4 font-bold">{formatCurrency(p.price)}</td>
                         <td className="px-8 py-4">
                           <button className="p-2 text-white/20 hover:text-white transition-colors">
                             <MoreVertical className="w-4 h-4" />
                           </button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
