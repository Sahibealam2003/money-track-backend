const dotenv = require("dotenv");
const cors = require("cors");
const express = require("express");
const connectDB = require("./src/config/connectFile");

const authRoutes = require("./src/routes/authRoutes");
const incomeRoutes = require("./src/routes/incomeRoutes");
const expenseRoutes = require("./src/routes/expenseRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");

dotenv.config();

const app = express();

app.use(cors({
  origin: "*",
  methods: ["POST", "GET", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(async(req,res,next)=>{
  await connectDB()
  next()
})

app.get("/", (req, res) => {
  res.json({ status: "Server is running" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

module.exports=app;
