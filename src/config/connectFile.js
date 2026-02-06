//file to connect DB to server
const mongoose = require("mongoose")
let isConnect = false
const connectDB = async () => {
  if(isConnect) return
  try {
    const db = await mongoose.connect(process.env.MONGO_URL)
    isConnect = db.connections[0].readyState===1
    console.log("MongoDB connected")
  } catch (error) {
    console.error("MongoDB connection failed")
    throw error 
  }
}

module.exports = connectDB
