import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { User } from "./models/User.js";
import { Product } from "./models/Product.js";
import { Service } from "./models/Service.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import floorPlanRoutes from "./routes/floorPlanRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import servicesRoutes from "./routes/servicesRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:4173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Логирование запросов
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Инициализация базы данных
async function initializeDatabase() {
  try {
    await User.createTable();
    await Product.createTable();
    await Service.createTable();
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/", dashboardRoutes);
app.use("/api/floorplan", floorPlanRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/services", servicesRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "Route not found",
  });
});

// Start server
async function startServer() {
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  });
}

startServer().catch(console.error);
