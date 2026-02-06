const express = require("express");
const route = express.Router();
const {protect} = require('../middleware/authMiddleware')
const {
  loginUser,
  getUserInfo,
  registerUser,
  updateProfile,
} = require("../controllers/authController");

route.post("/register", registerUser);

route.post("/login", loginUser);

route.get("/getUser", protect, getUserInfo);


route.put("/update-profile",protect,updateProfile);




module.exports = route
