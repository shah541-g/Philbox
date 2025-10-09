import dotenv from "dotenv"
import express from "express"
import helmet from "helmet"
import cors from "cors"
import morgan from "morgan"

import connectDB from "./config/db.config.js"
import seedSuperAdmin from "./admin/auth/utils/seedSuperAdmin.js"

import adminAuthRoutes from "./admin/auth/routes/auth.routes.js"
import adminManagementRoutes from "./admin/admin_management/routes/admin.routes.js"
import branchManagementRoutes from "./admin/branch_management/routes/branch.routes.js"
import salespersonManagementRoutes from "./admin/salesperson_management/routes/salesperson.routes.js"


dotenv.config()

const app = express();

const minutes = process.env.LIMIT_MINUTES || 600000


app.use(helmet())
app.use(cors())
app.use(express.json());
app.use(morgan("dev"))

app.use("/api",adminAuthRoutes)
app.use("/api",adminManagementRoutes)
app.use("/api",branchManagementRoutes)
app.use("/api",salespersonManagementRoutes)

const start_server = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    await seedSuperAdmin();
    const port = process.env.PORT || 5000;
    app.listen(port, ()=> console.log(`Server running on the port ${port}`))
  } catch (err) {
    console.error("Failed to start app:", err)
    process.exit(1)
  }
}

start_server()