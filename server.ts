import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Mock Dropshipping API Integration
  app.get("/api/dropshipping/sync", (req, res) => {
    // In a real app, this would call AliExpress/CJ APIs
    res.json({ message: "Successfully synced inventory with global suppliers" });
  });

  // Email Notification for Orders
  app.post("/api/orders/notify", (req, res) => {
    const { orderId, total, items, email } = req.body;
    console.log(`[ORDER NOTIFICATION] Sending email to Wickjohngreat@gmail.com for order ${orderId}`);
    console.log(`Contents: ${items.length} items, Total: $${total}`);
    res.json({ success: true, message: "Notification transmission successful" });
  });

  // Stripe Payment Intent (Mock setup)
  app.post("/api/checkout/create-intent", async (req, res) => {
    const { amount } = req.body;
    // Real stripe integration would go here
    res.json({ clientSecret: "pi_mock_secret_" + Math.random().toString(36).substring(7) });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
