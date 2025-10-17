import dotenv from "dotenv"
import express from "express"
import helmet from "helmet"
import cors from "cors"
import morgan from "morgan"

import connectDB from "./config/db.config.js"
import seedSuperAdmin from "./modules/admin/features/auth/utils/seedSuperAdmin.js"

import adminAuthRoutes from "./modules/admin/features/auth/routes/auth.routes.js"
import adminAdminManagementRoutes from "./modules/admin/features/admin_management/routes/admin.routes.js"
import adminBranchManagementRoutes from "./modules/admin/features/branch_management/routes/branch.routes.js"
import adminSalespersonManagementRoutes from "./modules/admin/features/salesperson_management/routes/salesperson.routes.js"


dotenv.config()

const app = express();

app.use(helmet())
app.use(cors())
app.use(express.json());
app.use(morgan("dev"))

app.use("/api",adminAuthRoutes)
app.use("/api",adminAdminManagementRoutes)
app.use("/api",adminBranchManagementRoutes)
app.use("/api",adminSalespersonManagementRoutes)

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